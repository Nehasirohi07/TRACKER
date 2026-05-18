import logging
import os
from pathlib import Path
from typing import Optional, AsyncGenerator

import litellm
from litellm import completion

from app.core.config import settings
from app.services.conversation_memory import conversation_memory

logger = logging.getLogger(__name__)


class AIAgentError(Exception):
    """Base exception for AI Agent errors."""
    pass


class AIAgentService:
    """Service class for interacting with LLMs via liteLLM.

    Features:
        - Unified interface for Gemini (and other models) via liteLLM
        - System prompt loading
        - Conversation memory integration
        - Streaming response support
        - Error handling with fallbacks
        - Configurable model parameters
    """

    def __init__(self):
        self._model_name: Optional[str] = None
        self._system_prompt: Optional[str] = None
        self._api_key: Optional[str] = None
        self._initialized = False

    def _ensure_initialized(self) -> None:
        """Lazy initialization of the liteLLM client."""
        if self._initialized:
            return

        self._api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
        if not self._api_key or self._api_key == "your-gemini-api-key":
            logger.warning(
                "GEMINI_API_KEY is not set. AI agent will return fallback responses."
            )
            self._initialized = True
            return

        try:
            self._system_prompt = self._load_system_prompt()
            # Use "gemini/" prefix for liteLLM to route to Google Gemini
            self._model_name = f"gemini/{settings.GEMINI_MODEL}"
            self._initialized = True
            logger.info("AI agent initialized with model: %s", self._model_name)
        except Exception as exc:
            logger.error(
                "Failed to initialize AI agent (model=%s): %s",
                settings.GEMINI_MODEL,
                exc,
                exc_info=True,
            )
            raise AIAgentError(f"Failed to initialize AI agent: {exc}") from exc

    def _load_system_prompt(self) -> str:
        """Load the system prompt from the configured file path."""
        if self._system_prompt is not None:
            return self._system_prompt

        prompt_path = settings.SYSTEM_PROMPT_PATH

        if not os.path.exists(prompt_path):
            alt_paths = [
                "system_prompt.txt",
                "/app/system_prompt.txt",
                str(Path(__file__).resolve().parent.parent.parent / "system_prompt.txt"),
            ]
            for alt in alt_paths:
                if os.path.exists(alt):
                    prompt_path = alt
                    break

        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                self._system_prompt = f.read()
            logger.info("Loaded system prompt from: %s", prompt_path)
        except FileNotFoundError:
            logger.warning("System prompt file not found at: %s", prompt_path)
            self._system_prompt = "You are a helpful AI assistant."
        except IOError as exc:
            logger.error("Error reading system prompt: %s", exc)
            self._system_prompt = "You are a helpful AI assistant."

        return self._system_prompt

    def _build_messages(self, user_message: str, session_id: Optional[str] = None) -> list:
        """Build the messages list for the LLM call."""
        messages = []

        # Add system prompt as first message
        if self._system_prompt:
            messages.append({"role": "system", "content": self._system_prompt})

        # Add conversation history if session_id is provided
        if session_id and settings.CONVERSATION_MEMORY_ENABLED:
            history = conversation_memory.get_history(session_id)
            for msg in history:
                if msg["role"] in ("user", "model", "assistant"):
                    role = "assistant" if msg["role"] == "model" else msg["role"]
                    messages.append({"role": role, "content": msg["content"]})

        # Add the current user message
        messages.append({"role": "user", "content": user_message})

        return messages

    def generate_response(
        self,
        user_message: str,
        session_id: Optional[str] = None,
    ) -> str:
        """Generate a non-streaming AI response.

        Args:
            user_message: The user's message text.
            session_id: Optional session ID for conversation memory.

        Returns:
            The AI-generated response text.

        Raises:
            AIAgentError: If the AI service fails.
        """
        self._ensure_initialized()

        if not self._model_name or not self._api_key:
            return self._fallback_response()

        try:
            messages = self._build_messages(user_message, session_id)

            response = completion(
                model=self._model_name,
                messages=messages,
                api_key=self._api_key,
                temperature=settings.GEMINI_TEMPERATURE,
                max_tokens=settings.GEMINI_MAX_TOKENS,
                stream=False,
            )

            ai_response = response.choices[0].message.content

            # Save to conversation memory
            if session_id and settings.CONVERSATION_MEMORY_ENABLED:
                conversation_memory.add_message(session_id, "user", user_message)
                conversation_memory.add_message(session_id, "assistant", ai_response)

            return ai_response

        except Exception as exc:
            logger.error(
                "AI generation error (model=%s, session=%s): %s",
                self._model_name,
                session_id,
                exc,
                exc_info=True,
            )
            raise AIAgentError(f"AI generation failed: {exc}") from exc

    async def generate_stream(
        self,
        user_message: str,
        session_id: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """Generate a streaming AI response.

        Yields:
            Chunks of the AI-generated response text.

        Raises:
            AIAgentError: If the AI service fails.
        """
        self._ensure_initialized()

        if not self._model_name or not self._api_key:
            yield self._fallback_response()
            return

        try:
            messages = self._build_messages(user_message, session_id)

            full_response = ""
            response = completion(
                model=self._model_name,
                messages=messages,
                api_key=self._api_key,
                temperature=settings.GEMINI_TEMPERATURE,
                max_tokens=settings.GEMINI_MAX_TOKENS,
                stream=True,
            )

            for chunk in response:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield content

            # Save to conversation memory
            if session_id and settings.CONVERSATION_MEMORY_ENABLED:
                conversation_memory.add_message(session_id, "user", user_message)
                conversation_memory.add_message(session_id, "assistant", full_response)

        except Exception as exc:
            logger.error(
                "AI streaming error (model=%s, session=%s): %s",
                self._model_name,
                session_id,
                exc,
                exc_info=True,
            )
            raise AIAgentError(f"AI streaming failed: {exc}") from exc

    def get_history_length(self, session_id: str) -> int:
        """Get the number of messages in a session's history."""
        return len(conversation_memory.get_history(session_id))

    def reset_conversation(self, session_id: str) -> None:
        """Reset conversation history for a session."""
        conversation_memory.clear_session(session_id)

    def _fallback_response(self) -> str:
        """Return a fallback response when the AI service is unavailable."""
        return (
            "I'm currently operating in offline mode because the AI service "
            "is not configured. Please set the GEMINI_API_KEY environment "
            "variable and restart the server to enable AI responses."
        )

    @property
    def is_ready(self) -> bool:
        """Check if the AI agent is properly configured."""
        try:
            self._ensure_initialized()
            return self._model_name is not None and self._api_key is not None
        except AIAgentError:
            return False

    @property
    def memory_stats(self) -> dict:
        """Get conversation memory statistics."""
        return conversation_memory.stats


# Singleton instance
ai_agent = AIAgentService()

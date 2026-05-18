import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, Field
from sse_starlette.sse import EventSourceResponse

from app.services.ai_agent import ai_agent, AIAgentError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["AI Chat"])


# ── Request/Response Schemas ──────────────────────────────────────────────


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000, description="User message")
    session_id: Optional[str] = Field(
        None, description="Session ID for conversation memory. Omit or send new UUID to start fresh."
    )


class ChatResponse(BaseModel):
    response: str = Field(..., description="AI-generated response text")
    session_id: str = Field(..., description="Session ID for continuing the conversation")
    memory_used: int = Field(0, description="Number of history messages used in this response")


class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error description")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Service status")
    ai_ready: bool = Field(..., description="Whether the AI agent is configured and operational")
    active_sessions: int = Field(0, description="Number of active conversation sessions")


# ── Non-Streaming Chat Endpoint ──────────────────────────────────────────


@router.post(
    "",
    response_model=ChatResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
    summary="Send a message to the AI assistant",
    description="Send a user message and receive an AI-generated response. "
    "Optionally provide a session_id to maintain conversation context.",
)
async def chat(chat_data: ChatRequest):
    """Chat endpoint with the AI agent (non-streaming)."""
    if not chat_data.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty.",
        )

    session_id = chat_data.session_id or str(uuid.uuid4())

    try:
        ai_response = ai_agent.generate_response(
            user_message=chat_data.message.strip(),
            session_id=session_id,
        )
        memory_used = ai_agent.get_history_length(session_id)

        return ChatResponse(
            response=ai_response,
            session_id=session_id,
            memory_used=memory_used,
        )

    except AIAgentError as exc:
        logger.error("AI Agent error (session=%s): %s", session_id, exc, exc_info=True)
        error_msg = str(exc)
        if "API key" in error_msg.lower() or "not found" in error_msg.lower():
            friendly_msg = "AI service configuration error. Please check the API key."
        elif "safety" in error_msg.lower() or "blocked" in error_msg.lower():
            friendly_msg = "The request was blocked by AI safety filters. Please rephrase your message."
        elif "quota" in error_msg.lower() or "rate" in error_msg.lower() or "429" in error_msg:
            friendly_msg = "AI service rate limit exceeded. Please wait a moment and try again."
        else:
            friendly_msg = f"AI service error: {error_msg}"
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=friendly_msg,
        ) from exc
    except Exception as exc:
        logger.exception("Unexpected error in chat endpoint: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred.",
        ) from exc


# ── Streaming Chat Endpoint (SSE) ────────────────────────────────────────


@router.post(
    "/stream",
    summary="Send a message and receive a streaming AI response",
    description="Send a user message and receive an AI-generated response as a Server-Sent Events stream.",
)
async def chat_stream(chat_data: ChatRequest, request: Request):
    """Chat endpoint with streaming AI response via SSE."""
    if not chat_data.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty.",
        )

    session_id = chat_data.session_id or str(uuid.uuid4())

    async def event_generator():
        try:
            # Send session_id first
            yield {
                "event": "meta",
                "data": f'{{"session_id": "{session_id}"}}',
            }

            # Stream the AI response
            async for chunk in ai_agent.generate_stream(
                user_message=chat_data.message.strip(),
                session_id=session_id,
            ):
                if await request.is_disconnected():
                    break
                yield {
                    "event": "chunk",
                    "data": chunk,
                }

            # Send done event
            yield {
                "event": "done",
                "data": "",
            }

        except AIAgentError as exc:
            logger.error("AI streaming error (session=%s): %s", session_id, exc, exc_info=True)
            yield {
                "event": "error",
                "data": str(exc),
            }
        except Exception as exc:
            logger.exception("Unexpected streaming error: %s", exc)
            yield {
                "event": "error",
                "data": "An unexpected error occurred during streaming.",
            }

    return EventSourceResponse(event_generator())


# ── Utility Endpoints ─────────────────────────────────────────────────────


@router.post(
    "/reset",
    summary="Reset conversation history",
    description="Clear the conversation history for a given session_id.",
)
async def reset_conversation(session_id: str):
    """Reset/Clear the conversation history for a session."""
    ai_agent.reset_conversation(session_id)
    return {
        "message": "Conversation history cleared.",
        "session_id": session_id,
    }


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Check AI agent health",
    description="Check if the AI agent is operational and get memory statistics.",
)
async def health_check():
    """Health check endpoint for the AI agent."""
    return HealthResponse(
        status="healthy",
        ai_ready=ai_agent.is_ready,
        active_sessions=ai_agent.memory_stats["active_sessions"],
    )


@router.get(
    "/stats",
    summary="Get AI agent statistics",
    description="Get detailed statistics about the AI agent and conversation memory.",
)
async def get_stats():
    """Get AI agent and memory statistics."""
    return {
        "ai_ready": ai_agent.is_ready,
        "memory": ai_agent.memory_stats,
    }

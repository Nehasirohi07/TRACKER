import time
import threading
import logging
from typing import Dict, List, Optional, Tuple

from app.core.config import settings

logger = logging.getLogger(__name__)


class ConversationMemory:
    """In-memory conversation history store with TTL-based expiry.

    Stores conversation history per session/user ID with:
        - Automatic expiry of stale sessions
        - Configurable max history length per session
        - Thread-safe operations
        - Cleanup of expired sessions on access
    """

    def __init__(
        self,
        ttl_seconds: int = settings.CONVERSATION_MEMORY_TTL_SECONDS,
        max_history: int = settings.MAX_CONVERSATION_HISTORY,
    ):
        self._ttl_seconds = ttl_seconds
        self._max_history = max_history
        # session_id -> (timestamp, [(role, content), ...])
        self._sessions: Dict[str, Tuple[float, List[Dict[str, str]]]] = {}
        self._lock = threading.Lock()

    def add_message(self, session_id: str, role: str, content: str) -> None:
        """Add a message to a session's history."""
        with self._lock:
            now = time.time()
            if session_id in self._sessions:
                _, history = self._sessions[session_id]
            else:
                history = []
            history.append({"role": role, "content": content})
            # Trim to max history
            if len(history) > self._max_history:
                history = history[-self._max_history:]
            self._sessions[session_id] = (now, history)

    def get_history(self, session_id: str) -> List[Dict[str, str]]:
        """Get the conversation history for a session.

        Returns an empty list if session doesn't exist or has expired.
        """
        with self._lock:
            self._evict_expired()
            if session_id not in self._sessions:
                return []
            timestamp, history = self._sessions[session_id]
            self._sessions[session_id] = (time.time(), history)
            return list(history)

    def clear_session(self, session_id: str) -> None:
        """Clear all history for a session."""
        with self._lock:
            self._sessions.pop(session_id, None)

    def clear_all(self) -> None:
        """Clear all sessions."""
        with self._lock:
            self._sessions.clear()

    def _evict_expired(self) -> None:
        """Remove sessions that have exceeded the TTL."""
        now = time.time()
        expired = [
            sid
            for sid, (ts, _) in self._sessions.items()
            if (now - ts) > self._ttl_seconds
        ]
        for sid in expired:
            del self._sessions[sid]
            logger.debug("Evicted expired session: %s", sid)

    @property
    def active_session_count(self) -> int:
        """Return the number of active (non-expired) sessions."""
        with self._lock:
            self._evict_expired()
            return len(self._sessions)

    @property
    def stats(self) -> dict:
        """Return memory usage statistics."""
        with self._lock:
            self._evict_expired()
            total_messages = sum(len(h) for _, h in self._sessions.values())
            return {
                "active_sessions": len(self._sessions),
                "total_messages": total_messages,
                "ttl_seconds": self._ttl_seconds,
                "max_history_per_session": self._max_history,
            }


# Singleton instance
conversation_memory = ConversationMemory()

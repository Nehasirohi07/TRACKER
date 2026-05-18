import time
import logging
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("app.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all incoming HTTP requests and their responses.

    Logs:
        - HTTP method
        - Request path
        - Response status code
        - Request duration
        - Client IP address
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        # Get client IP
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "unknown"

        # Process the request
        try:
            response: Response = await call_next(request)
            duration = time.time() - start_time

            logger.info(
                "%s %s -> %d (%.3fs) [%s]",
                request.method,
                request.url.path,
                response.status_code,
                duration,
                client_ip,
            )
            return response
        except Exception as exc:
            duration = time.time() - start_time
            logger.error(
                "%s %s -> ERROR (%.3fs) [%s] - %s",
                request.method,
                request.url.path,
                duration,
                client_ip,
                str(exc),
            )
            raise

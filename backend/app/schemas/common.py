from pydantic import BaseModel
from typing import Optional, Generic, TypeVar

T = TypeVar('T')


class Response(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Success"
    data: Optional[T] = None


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    page_size: int


class MessageResponse(BaseModel):
    success: bool = True
    message: str = "Success"


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    detail: Optional[str] = None
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, Field


class GoalCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    domain: Optional[str] = Field(None, max_length=50)
    target_date: Optional[date] = None
    status: Optional[str] = Field(default="active", max_length=20)


class GoalUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    domain: Optional[str] = Field(None, max_length=50)
    target_date: Optional[date] = None
    status: Optional[str] = Field(None, max_length=20)


class GoalProgressUpdate(BaseModel):
    progress: int = Field(..., ge=0, le=100)


class GoalResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    domain: Optional[str] = None
    target_date: Optional[date] = None
    progress: int = 0
    status: str = "active"
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

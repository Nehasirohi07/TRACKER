from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class HabitCreate(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    domain: Optional[str] = Field(None, max_length=50)
    frequency: Optional[str] = Field(default="daily", max_length=20)


class HabitUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    domain: Optional[str] = Field(None, max_length=50)
    frequency: Optional[str] = Field(None, max_length=20)
    is_active: Optional[bool] = None


class HabitResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None
    domain: Optional[str] = None
    frequency: str = "daily"
    streak: int = 0
    best_streak: int = 0
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}

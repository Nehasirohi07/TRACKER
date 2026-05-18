from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class MissionCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    domain: Optional[str] = Field(None, max_length=50)
    priority: Optional[str] = Field(default="medium", max_length=20)
    status: Optional[str] = Field(default="pending", max_length=20)
    due_date: Optional[datetime] = None
    xp_reward: Optional[int] = Field(default=10, ge=0)
    is_daily: Optional[bool] = False


class MissionUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    domain: Optional[str] = Field(None, max_length=50)
    priority: Optional[str] = Field(None, max_length=20)
    status: Optional[str] = Field(None, max_length=20)
    due_date: Optional[datetime] = None
    xp_reward: Optional[int] = Field(None, ge=0)
    is_daily: Optional[bool] = None


class MissionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    domain: Optional[str] = None
    priority: str = "medium"
    status: str = "pending"
    due_date: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    xp_reward: int = 10
    is_daily: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

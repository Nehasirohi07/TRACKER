from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

from app.database import get_db
from app.models.fitness import PomodoroSession
from app.security import get_current_user

router = APIRouter(prefix="/pomodoro", tags=["Pomodoro"])


class PomodoroStart(BaseModel):
    duration_minutes: int = 25
    task_type: str = None


class PomodoroComplete(BaseModel):
    completed: bool = True


class PomodoroResponse(BaseModel):
    id: int
    duration_minutes: int
    task_type: Optional[str] = None
    completed: bool
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


@router.post("/start", response_model=PomodoroResponse)
def start_pomodoro(
    data: PomodoroStart,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = PomodoroSession(
        user_id=current_user["user_id"],
        duration_minutes=data.duration_minutes,
        task_type=data.task_type,
        started_at=datetime.utcnow()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/{session_id}/complete", response_model=PomodoroResponse)
def complete_pomodoro(
    session_id: int,
    data: PomodoroComplete,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(PomodoroSession).filter(
        PomodoroSession.id == session_id,
        PomodoroSession.user_id == current_user["user_id"]
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    session.completed = data.completed
    session.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session


@router.get("/stats")
def get_pomodoro_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == current_user["user_id"]
    ).all()

    total = len(sessions)
    completed = sum(1 for s in sessions if s.completed)
    total_minutes = sum(s.duration_minutes for s in sessions if s.completed)

    return {
        "total_sessions": total,
        "completed_sessions": completed,
        "total_minutes": total_minutes,
        "completion_rate": round(completed / total * 100, 1) if total > 0 else 0
    }


@router.get("/history", response_model=List[PomodoroResponse])
def get_pomodoro_history(
    limit: int = 50,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(PomodoroSession).filter(
        PomodoroSession.user_id == current_user["user_id"]
    ).order_by(PomodoroSession.started_at.desc()).limit(limit).all()
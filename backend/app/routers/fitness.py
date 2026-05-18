from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

from app.database import get_db
from app.models.fitness import FitnessLog
from app.security import get_current_user

router = APIRouter(prefix="/fitness", tags=["Fitness"])


class FitnessLogCreate(BaseModel):
    workout_type: str
    duration_minutes: int
    calories_burned: int = 0
    notes: Optional[str] = None


class FitnessLogResponse(BaseModel):
    id: int
    workout_type: str
    duration_minutes: int
    calories_burned: int
    notes: Optional[str] = None
    logged_at: datetime

    class Config:
        from_attributes = True


@router.get("/logs", response_model=List[FitnessLogResponse])
def get_fitness_logs(
    limit: int = 30,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(FitnessLog).filter(
        FitnessLog.user_id == current_user["user_id"]
    ).order_by(FitnessLog.logged_at.desc()).limit(limit).all()


@router.post("/logs", response_model=FitnessLogResponse)
def add_fitness_log(
    log_data: FitnessLogCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_log = FitnessLog(
        user_id=current_user["user_id"],
        **log_data.model_dump()
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log


@router.get("/stats")
def get_fitness_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(FitnessLog).filter(
        FitnessLog.user_id == current_user["user_id"]
    ).all()

    total_workouts = len(logs)
    total_duration = sum(log.duration_minutes for log in logs)
    total_calories = sum(log.calories_burned for log in logs)

    workout_types = {}
    for log in logs:
        workout_types[log.workout_type] = workout_types.get(log.workout_type, 0) + 1

    return {
        "total_workouts": total_workouts,
        "total_duration_minutes": total_duration,
        "total_calories": total_calories,
        "workout_breakdown": workout_types,
        "average_duration": total_duration // total_workouts if total_workouts > 0 else 0
    }


@router.delete("/logs/{log_id}")
def delete_fitness_log(
    log_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    log = db.query(FitnessLog).filter(
        FitnessLog.id == log_id,
        FitnessLog.user_id == current_user["user_id"]
    ).first()
    
    if not log:
        raise HTTPException(status_code=404, detail="Workout log not found")
    
    db.delete(log)
    db.commit()
    return {"message": "Workout deleted successfully"}
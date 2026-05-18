from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.models.habit import Habit, HabitLog
from app.models.user import Profile
from app.models.achievement import XPLog
from app.schemas.habit import HabitCreate, HabitUpdate, HabitResponse
from app.security import get_current_user

router = APIRouter(prefix="/habits", tags=["Habits"])


@router.get("", response_model=List[HabitResponse])
def get_habits(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Habit).filter(
        Habit.user_id == current_user["user_id"],
        Habit.is_active == True
    ).all()


@router.get("/today")
def get_today_habits(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    habits = db.query(Habit).filter(
        Habit.user_id == current_user["user_id"],
        Habit.is_active == True
    ).all()

    result = []
    for habit in habits:
        log_today = db.query(HabitLog).filter(
            HabitLog.habit_id == habit.id,
            HabitLog.completed_at >= today_start,
            HabitLog.completed_at < today_end
        ).first()

        result.append({
            **HabitResponse.model_validate(habit).model_dump(),
            "completed_today": log_today is not None
        })

    return result


@router.post("", response_model=HabitResponse)
def create_habit(
    habit_data: HabitCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_habit = Habit(
        user_id=current_user["user_id"],
        **habit_data.model_dump()
    )
    db.add(new_habit)
    db.commit()
    db.refresh(new_habit)
    return new_habit


@router.get("/{habit_id}", response_model=HabitResponse)
def get_habit(
    habit_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user["user_id"]
    ).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    habit_data: HabitUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user["user_id"]
    ).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    for key, value in habit_data.model_dump(exclude_unset=True).items():
        setattr(habit, key, value)

    db.commit()
    db.refresh(habit)
    return habit


@router.post("/{habit_id}/complete")
def complete_habit(
    habit_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user["user_id"]
    ).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)

    existing_log = db.query(HabitLog).filter(
        HabitLog.habit_id == habit.id,
        HabitLog.completed_at >= today_start,
        HabitLog.completed_at < today_end
    ).first()

    if existing_log:
        return {"message": "Habit already completed today", "habit": habit}

    log = HabitLog(habit_id=habit.id, user_id=current_user["user_id"])
    db.add(log)

    habit.streak += 1
    if habit.streak > habit.best_streak:
        habit.best_streak = habit.streak

    profile = db.query(Profile).filter(Profile.user_id == current_user["user_id"]).first()
    if profile:
        profile.total_xp += 5
        xp_log = XPLog(
            user_id=current_user["user_id"],
            amount=5,
            source="habit",
            description=f"Completed habit: {habit.name}"
        )
        db.add(xp_log)

    db.commit()
    db.refresh(habit)
    return {"message": "Habit completed!", "habit": habit}


@router.delete("/{habit_id}")
def delete_habit(
    habit_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user["user_id"]
    ).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    db.delete(habit)
    db.commit()
    return {"message": "Habit deleted successfully"}
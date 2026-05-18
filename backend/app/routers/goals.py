from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse, GoalProgressUpdate
from app.security import get_current_user

router = APIRouter(prefix="/goals", tags=["Goals"])


@router.get("", response_model=List[GoalResponse])
def get_goals(
    status: str = None,
    domain: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Goal).filter(Goal.user_id == current_user["user_id"])
    if status:
        query = query.filter(Goal.status == status)
    if domain:
        query = query.filter(Goal.domain == domain)
    return query.order_by(Goal.target_date.asc()).all()


@router.get("/active")
def get_active_goals(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Goal).filter(
        Goal.user_id == current_user["user_id"],
        Goal.status == "active"
    ).order_by(Goal.target_date.asc()).all()


@router.post("", response_model=GoalResponse)
def create_goal(
    goal_data: GoalCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_goal = Goal(
        user_id=current_user["user_id"],
        **goal_data.model_dump()
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal


@router.get("/{goal_id}", response_model=GoalResponse)
def get_goal(
    goal_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user["user_id"]
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user["user_id"]
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    for key, value in goal_data.model_dump(exclude_unset=True).items():
        setattr(goal, key, value)

    db.commit()
    db.refresh(goal)
    return goal


@router.put("/{goal_id}/progress", response_model=GoalResponse)
def update_progress(
    goal_id: int,
    progress_data: GoalProgressUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user["user_id"]
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.progress = min(100, max(0, progress_data.progress))
    if goal.progress == 100:
        goal.status = "completed"

    db.commit()
    db.refresh(goal)
    return goal


@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.user_id == current_user["user_id"]
    ).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}
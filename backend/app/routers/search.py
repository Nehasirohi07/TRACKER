from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.mission import Mission
from app.models.goal import Goal
from app.models.habit import Habit
from app.security import get_current_user

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("")
def search_all(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search across missions, goals, and habits"""
    user_id = current_user["user_id"]
    query = f"%{q}%"

    # Search missions
    missions = db.query(Mission).filter(
        Mission.user_id == user_id,
        Mission.title.ilike(query)
    ).all()

    # Search goals
    goals = db.query(Goal).filter(
        Goal.user_id == user_id,
        Goal.title.ilike(query)
    ).all()

    # Search habits
    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.name.ilike(query)
    ).all()

    return {
        "missions": [
            {"id": m.id, "title": m.title, "domain": m.domain, "status": m.status}
            for m in missions
        ],
        "goals": [
            {"id": g.id, "title": g.title, "domain": g.domain, "progress": g.progress}
            for g in goals
        ],
        "habits": [
            {"id": h.id, "name": h.name, "domain": h.domain, "streak": h.streak}
            for h in habits
        ],
        "total": len(missions) + len(goals) + len(habits)
    }


@router.get("/missions")
def search_missions(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search missions"""
    user_id = current_user["user_id"]
    missions = db.query(Mission).filter(
        Mission.user_id == user_id,
        Mission.title.ilike(f"%{q}%")
    ).all()

    return {
        "results": [
            {
                "id": m.id,
                "title": m.title,
                "description": m.description,
                "domain": m.domain,
                "status": m.status,
                "priority": m.priority,
                "xp_reward": m.xp_reward,
                "created_at": m.created_at.isoformat() if m.created_at else None
            }
            for m in missions
        ],
        "count": len(missions)
    }


@router.get("/goals")
def search_goals(
    q: str = Query(..., min_length=1),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search goals"""
    user_id = current_user["user_id"]
    goals = db.query(Goal).filter(
        Goal.user_id == user_id,
        Goal.title.ilike(f"%{q}%")
    ).all()

    return {
        "results": [
            {
                "id": g.id,
                "title": g.title,
                "description": g.description,
                "domain": g.domain,
                "progress": g.progress,
                "status": g.status,
                "target_date": g.target_date.isoformat() if g.target_date else None
            }
            for g in goals
        ],
        "count": len(goals)
    }
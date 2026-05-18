from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import Profile
from app.models.achievement import Achievement, UserAchievement, XPLog
from app.security import get_current_user

router = APIRouter(prefix="/gamification", tags=["Gamification"])


@router.get("/xp")
def get_xp_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user["user_id"]).first()
    if not profile:
        return {"error": "Profile not found"}

    from app.utils.constants import RANKS
    next_rank = None
    current_rank_info = None

    for i, rank in enumerate(RANKS):
        if profile.current_rank == rank["name"]:
            current_rank_info = rank
            if i + 1 < len(RANKS):
                next_rank = RANKS[i + 1]
            break

    return {
        "total_xp": profile.total_xp,
        "level": profile.current_level,
        "rank": profile.current_rank,
        "current_rank_xp": current_rank_info["xp_required"] if current_rank_info else 0,
        "next_rank_xp": next_rank["xp_required"] if next_rank else None,
        "xp_to_next_rank": (next_rank["xp_required"] - profile.total_xp) if next_rank else 0
    }


@router.get("/achievements")
def get_achievements(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    all_achievements = db.query(Achievement).all()
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user["user_id"]
    ).all()

    earned_ids = {ua.achievement_id for ua in user_achievements}

    return [
        {
            "id": a.id,
            "name": a.name,
            "description": a.description,
            "icon": a.icon,
            "xp_reward": a.xp_reward,
            "category": a.category,
            "earned": a.id in earned_ids,
            "earned_at": next((ua.earned_at for ua in user_achievements if ua.achievement_id == a.id), None)
        }
        for a in all_achievements
    ]


@router.get("/xp-history")
def get_xp_history(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    logs = db.query(XPLog).filter(
        XPLog.user_id == current_user["user_id"]
    ).order_by(XPLog.created_at.desc()).limit(50).all()

    return [
        {
            "id": log.id,
            "amount": log.amount,
            "source": log.source,
            "description": log.description,
            "created_at": log.created_at.isoformat()
        }
        for log in logs
    ]
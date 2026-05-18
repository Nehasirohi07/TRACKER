from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, Profile
from app.schemas.user import ProfileResponse, ProfileUpdate
from app.security import get_current_user
from app.utils.constants import RANKS

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/profile", response_model=ProfileResponse)
def get_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user["user_id"]).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user["user_id"]).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for key, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/stats")
def get_user_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user["user_id"]).first()
    if not profile:
        return {"error": "Profile not found"}

    return {
        "total_xp": profile.total_xp,
        "level": profile.current_level,
        "rank": profile.current_rank,
        "next_rank_xp": _get_next_rank_xp(profile.total_xp)
    }


def _get_next_rank_xp(total_xp: int) -> int:
    for rank in RANKS:
        if total_xp < rank["xp_required"]:
            return rank["xp_required"]
    return RANKS[-1]["xp_required"]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.mission import Mission
from app.models.user import Profile
from app.models.achievement import XPLog
from app.schemas.mission import MissionCreate, MissionUpdate, MissionResponse
from app.security import get_current_user
from app.utils.constants import XP_REWARDS

router = APIRouter(prefix="/missions", tags=["Missions"])


@router.get("", response_model=List[MissionResponse])
def get_missions(
    status: str = None,
    domain: str = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Mission).filter(Mission.user_id == current_user["user_id"])
    if status:
        query = query.filter(Mission.status == status)
    if domain:
        query = query.filter(Mission.domain == domain)
    return query.order_by(Mission.created_at.desc()).all()


@router.get("/daily")
def get_daily_missions(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = datetime.now().date()
    return db.query(Mission).filter(
        Mission.user_id == current_user["user_id"],
        Mission.is_daily == True,
        Mission.due_date >= datetime.combine(today, datetime.min.time())
    ).all()


@router.post("", response_model=MissionResponse)
def create_mission(
    mission_data: MissionCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_mission = Mission(
        user_id=current_user["user_id"],
        **mission_data.model_dump()
    )
    db.add(new_mission)
    db.commit()
    db.refresh(new_mission)
    return new_mission


@router.get("/{mission_id}", response_model=MissionResponse)
def get_mission(
    mission_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == current_user["user_id"]
    ).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@router.put("/{mission_id}", response_model=MissionResponse)
def update_mission(
    mission_id: int,
    mission_data: MissionUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == current_user["user_id"]
    ).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    for key, value in mission_data.model_dump(exclude_unset=True).items():
        setattr(mission, key, value)

    db.commit()
    db.refresh(mission)
    return mission


@router.delete("/{mission_id}")
def delete_mission(
    mission_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == current_user["user_id"]
    ).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    db.delete(mission)
    db.commit()
    return {"message": "Mission deleted successfully"}


@router.post("/{mission_id}/complete", response_model=MissionResponse)
def complete_mission(
    mission_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mission = db.query(Mission).filter(
        Mission.id == mission_id,
        Mission.user_id == current_user["user_id"]
    ).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    if mission.status == "completed":
        raise HTTPException(status_code=400, detail="Mission already completed")

    mission.status = "completed"
    mission.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(mission)

    xp_earned = mission.xp_reward or XP_REWARDS["mission_complete"]
    _add_xp(current_user["user_id"], xp_earned, "mission", f"Completed: {mission.title}", db)

    return mission


def _add_xp(user_id: int, amount: int, source: str, description: str, db: Session):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        profile.total_xp += amount

        from app.utils.constants import RANKS
        for rank in RANKS:
            if profile.total_xp >= rank["xp_required"]:
                profile.current_rank = rank["name"]
                profile.current_level = rank["level_min"]

        xp_log = XPLog(
            user_id=user_id,
            amount=amount,
            source=source,
            description=description
        )
        db.add(xp_log)
        db.commit()
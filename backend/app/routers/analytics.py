from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.database import get_db
from app.models.mission import Mission
from app.models.habit import HabitLog
from app.models.user import Profile
from app.security import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
def get_dashboard(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]

    total_missions = db.query(Mission).filter(Mission.user_id == user_id).count()
    completed_missions = db.query(Mission).filter(
        Mission.user_id == user_id,
        Mission.status == "completed"
    ).count()

    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow = today + timedelta(days=1)
    today_missions = db.query(Mission).filter(
        Mission.user_id == user_id,
        Mission.due_date >= today,
        Mission.due_date < tomorrow
    ).count()

    today_completed = db.query(Mission).filter(
        Mission.user_id == user_id,
        Mission.status == "completed",
        Mission.completed_at >= today,
        Mission.completed_at < tomorrow
    ).count()

    profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    return {
        "missions": {
            "total": total_missions,
            "completed": completed_missions,
            "completion_rate": round(completed_missions / total_missions * 100, 1) if total_missions > 0 else 0,
            "today_total": today_missions,
            "today_completed": today_completed
        },
        "profile": {
            "level": profile.current_level if profile else 1,
            "rank": profile.current_rank if profile else "Private",
            "total_xp": profile.total_xp if profile else 0
        }
    }


@router.get("/weekly")
def get_weekly_report(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]
    week_ago = datetime.utcnow() - timedelta(days=7)

    missions_completed = db.query(Mission).filter(
        Mission.user_id == user_id,
        Mission.status == "completed",
        Mission.completed_at >= week_ago
    ).count()

    habit_logs = db.query(HabitLog).filter(
        HabitLog.user_id == user_id,
        HabitLog.completed_at >= week_ago
    ).count()

    return {
        "missions_completed": missions_completed,
        "habits_completed": habit_logs,
        "average_per_day": round((missions_completed + habit_logs) / 7, 1)
    }


@router.get("/domains")
def get_domain_progress(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["user_id"]

    domains = ["coding", "aiml", "cybersec", "cds", "ssc", "english", "fitness"]
    result = []

    for domain in domains:
        total = db.query(Mission).filter(
            Mission.user_id == user_id,
            Mission.domain == domain
        ).count()

        completed = db.query(Mission).filter(
            Mission.user_id == user_id,
            Mission.domain == domain,
            Mission.status == "completed"
        ).count()

        result.append({
            "domain": domain,
            "total": total,
            "completed": completed,
            "progress": round(completed / total * 100, 1) if total > 0 else 0
        })

    return result
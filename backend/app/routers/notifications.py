from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel

from app.database import get_db
from app.security import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


class NotificationCreate(BaseModel):
    title: str
    message: str
    type: str = "info"  # info, success, warning, error


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    type: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# In-memory notifications storage (in production, use database)
notifications_db = {}


@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all notifications for current user"""
    user_id = current_user["user_id"]
    user_notifications = notifications_db.get(user_id, [])
    # Sort by created_at descending
    return sorted(user_notifications, key=lambda x: x['created_at'], reverse=True)


@router.post("")
def create_notification(
    notification: NotificationCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new notification"""
    user_id = current_user["user_id"]
    
    if user_id not in notifications_db:
        notifications_db[user_id] = []
    
    new_notification = {
        "id": len(notifications_db[user_id]) + 1,
        "title": notification.title,
        "message": notification.message,
        "type": notification.type,
        "read": False,
        "created_at": datetime.utcnow()
    }
    
    notifications_db[user_id].append(new_notification)
    return new_notification


@router.put("/{notification_id}/read")
def mark_as_read(
    notification_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark a notification as read"""
    user_id = current_user["user_id"]
    user_notifications = notifications_db.get(user_id, [])
    
    for notif in user_notifications:
        if notif["id"] == notification_id:
            notif["read"] = True
            return {"message": "Notification marked as read", "notification": notif}
    
    return {"error": "Notification not found"}


@router.put("/read-all")
def mark_all_as_read(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark all notifications as read"""
    user_id = current_user["user_id"]
    user_notifications = notifications_db.get(user_id, [])
    
    count = 0
    for notif in user_notifications:
        if not notif["read"]:
            notif["read"] = True
            count += 1
    
    return {"message": f"Marked {count} notifications as read"}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a notification"""
    user_id = current_user["user_id"]
    user_notifications = notifications_db.get(user_id, [])
    
    notifications_db[user_id] = [n for n in user_notifications if n["id"] != notification_id]
    return {"message": "Notification deleted"}


@router.get("/unread-count")
def get_unread_count(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get count of unread notifications"""
    user_id = current_user["user_id"]
    user_notifications = notifications_db.get(user_id, [])
    unread_count = sum(1 for n in user_notifications if not n["read"])
    return {"unread_count": unread_count}
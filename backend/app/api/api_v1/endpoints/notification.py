from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.models.backend_notification import Notification
from backend.app.schemas import notification as schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Notification])
def read_notifications(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(deps.get_current_active_user),
):
    """
    Retrieve notifications for the current user.
    """
    notifications = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return notifications

@router.get("/unread-count", response_model=int)
def get_unread_count(
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Get the count of unread notifications.
    """
    count = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.is_read == False)
        .count()
    )
    return count

@router.put("/{id}/read", response_model=schemas.Notification)
def mark_notification_read(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user = Depends(deps.get_current_active_user),
):
    """
    Mark a notification as read.
    """
    notification = db.query(Notification).filter(Notification.id == id, Notification.user_id == current_user.id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@router.post("/test-trigger", response_model=schemas.Notification)
def trigger_test_notification(
    title: str = "Test Notification",
    message: str = "This is a test desktop notification.",
    db: Session = Depends(deps.get_db),
    current_user = Depends(deps.get_current_active_user),
):
    """
    Manually trigger a notification for testing purposes.
    """
    notification = Notification(
        user_id=current_user.id,
        title=title,
        message=message,
        notification_type="info"
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
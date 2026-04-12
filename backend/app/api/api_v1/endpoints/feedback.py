from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from datetime import datetime
from backend.app.api import deps
from backend.app.schemas import feedback as feedback_schema
from backend.db import crud
from backend.models.user import User
from backend.models.platform_feedback import PlatformFeedback

router = APIRouter()

# --- Chat-specific feedback (thumbs up/down on AI messages) ---

@router.post("/", response_model=feedback_schema.FeedbackRead, status_code=status.HTTP_201_CREATED)
def create_feedback_for_message(
    feedback_in: feedback_schema.FeedbackCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Submit feedback (rating and optional comment) for a specific AI chat message.
    """
    msg = crud.get_chat_message_by_id(db, message_id=feedback_in.chat_message_id)
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat message not found.",
        )

    if msg.user_id != current_user.id: #type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only provide feedback on your own chat messages.",
        )
    if msg.is_from_user is True:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback can only be submitted for AI responses.",
        )
    if msg.feedback is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Feedback has already been submitted for this message.",
        )
    feedback = crud.create_feedback(db=db, feedback=feedback_in)
    return feedback


# --- General platform feedback ---

class PlatformFeedbackCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 (poor) to 5 (excellent)")
    comment: Optional[str] = Field(None, max_length=2000)

class PlatformFeedbackRead(BaseModel):
    id: int
    user_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

@router.post("/platform", response_model=PlatformFeedbackRead, status_code=status.HTTP_201_CREATED)
def submit_platform_feedback(
    feedback_in: PlatformFeedbackCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Submit general platform feedback (rating + optional comment).
    """
    entry = PlatformFeedback(
        user_id=current_user.id,
        rating=feedback_in.rating,
        comment=feedback_in.comment,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/platform", response_model=List[PlatformFeedbackRead])
def get_my_platform_feedback(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Retrieve all platform feedback submitted by the current user.
    """
    items = (
        db.query(PlatformFeedback)
        .filter(PlatformFeedback.user_id == current_user.id)
        .order_by(PlatformFeedback.created_at.desc())
        .all()
    )
    return items


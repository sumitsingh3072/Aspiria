from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.app.schemas import feedback as feedback_schema
from backend.db import crud
from backend.models.user import User

router = APIRouter()

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

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.app.schemas import chat
from backend.db import crud
from backend.models.user import User
from backend.app.services import ai_advisor
router = APIRouter()

@router.post("/", response_model=chat.ChatResponse)
def handle_chat_message(
    chat_in: chat.ChatMessageCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Handle an incoming chat message from a user.
    """
    user_profile = crud.get_profile_by_user_id(db, user_id=current_user.id)
    chat_history = crud.get_chat_history(db, user_id=current_user.id)
    crud.create_chat_message(db, message=chat_in, user_id=current_user.id, is_from_user=True)

    try:
        # Pass the db session to the AI service for RAG
        ai_response_text = ai_advisor.get_ai_response(
            db=db,
            user_message=chat_in.message,
            chat_history=chat_history,
            user_profile=user_profile
        )
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))

    ai_message_schema = chat.ChatMessageCreate(message=ai_response_text)
    db_ai_message = crud.create_chat_message(db, message=ai_message_schema, user_id=current_user.id, is_from_user=False)

    # --- Return the new ID and the response text ---
    return chat.ChatResponse(response=ai_response_text, message_id=db_ai_message.id)

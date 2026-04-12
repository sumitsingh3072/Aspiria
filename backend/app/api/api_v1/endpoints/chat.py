from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.app.schemas import chat, translation as translation_schema
from backend.db import crud
from backend.models.user import User
from backend.app.services import ai_advisor, translation_service
from itertools import groupby
import uuid

router = APIRouter()

@router.post("/", response_model=chat.ChatResponse)
def handle_chat_message(
    chat_in: chat.ChatMessageCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    session_id = chat_in.session_id or str(uuid.uuid4())
    chat_in.session_id = session_id
    
    user_profile = crud.get_profile_by_user_id(db, user_id=current_user.id)
    chat_history = crud.get_chat_history(db, user_id=current_user.id, session_id=session_id)
    crud.create_chat_message(db, message=chat_in, user_id=current_user.id, is_from_user=True)

    try:
        ai_response_text = ai_advisor.get_ai_response(
            db=db,
            user_message=chat_in.message,
            chat_history=chat_history,
            user_profile=user_profile
        )
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))

    ai_message_schema = chat.ChatMessageCreate(message=ai_response_text, session_id=session_id)
    db_ai_message = crud.create_chat_message(db, message=ai_message_schema, user_id=current_user.id, is_from_user=False)
    return chat.ChatResponse(response=ai_response_text, message_id=db_ai_message.id, session_id=session_id)


@router.post("/translate", response_model=translation_schema.MultilingualChatResponse)
def handle_multilingual_chat(
    chat_in: translation_schema.MultilingualChatRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    session_id = chat_in.session_id or str(uuid.uuid4())
    
    translation_result = translation_service.translate_text(chat_in.message, target_language="en")
    english_message_text = translation_result.get("translatedText", chat_in.message)
    detected_language = translation_result.get("detectedSourceLanguage", "en")

    user_profile = crud.get_profile_by_user_id(db, user_id=current_user.id)
    chat_history = crud.get_chat_history(db, user_id=current_user.id, session_id=session_id)

    user_message_schema = chat.ChatMessageCreate(message=english_message_text, session_id=session_id)
    crud.create_chat_message(db, message=user_message_schema, user_id=current_user.id, is_from_user=True)

    try:
        ai_response_text = ai_advisor.get_ai_response(
            db=db,
            user_message=english_message_text,
            chat_history=chat_history,
            user_profile=user_profile
        )
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
        
    ai_message_schema = chat.ChatMessageCreate(message=ai_response_text, session_id=session_id)
    db_ai_message = crud.create_chat_message(db, message=ai_message_schema, user_id=current_user.id, is_from_user=False)

    if detected_language != "en":
        ai_translation_result = translation_service.translate_text(ai_response_text, target_language=detected_language)
        final_response = ai_translation_result.get("translatedText", ai_response_text)
    else:
        final_response = ai_response_text

    return translation_schema.MultilingualChatResponse(
        response=final_response,
        original_language=detected_language,
        english_response=ai_response_text,
        message_id=db_ai_message.id,
        session_id=session_id
    )

@router.get("/history")
def get_history(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    chats = crud.get_all_user_chats(db, user_id=current_user.id)
    sessions = {}
    for chat_msg in chats:
        sid = chat_msg.session_id or "default"
        if sid not in sessions:
            sessions[sid] = []
        sessions[sid].append({
            "id": chat_msg.id,
            "message": chat_msg.message,
            "is_from_user": chat_msg.is_from_user,
            "timestamp": chat_msg.timestamp
        })
    return {"sessions": sessions}
from fastapi import APIRouter
from backend.app.api.api_v1.endpoints import auth, health, profile, chat

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
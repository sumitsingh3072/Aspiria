from fastapi import APIRouter
from backend.app.api.api_v1.endpoints import auth, feedback, health, ingestion, profile, chat, notification, job_alerts, jobs, resume

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(ingestion.router, prefix="/ingestion", tags=["ingestion"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
api_router.include_router(notification.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(job_alerts.router, prefix="/job-alerts", tags=["job_alerts"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(resume.router, prefix="/resume", tags=["resume"])
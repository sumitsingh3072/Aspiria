# backend/app/core/celery_app.py
from celery import Celery
from backend.app.core.config import settings

celery_app = Celery(
    "tasks",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["backend.app.tasks.job_task"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "hourly-auto-refresh": {
            "task": "backend.app.tasks.job_task.hourly_auto_refresh_task",
            "schedule": 3600.0,  # every 60 minutes
        },
    },
)

if __name__ == "__main__":
    celery_app.start()
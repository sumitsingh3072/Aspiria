from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from backend.app.api import deps
from backend.app.tasks.job_task import ingest_jobs_task
from backend.models.user import User, Profile
from backend.models.ingestion_preferences import IngestionPreferences

router = APIRouter()

COOLDOWN_HOURS_DEFAULT = 6
COOLDOWN_HOURS_PREMIUM = 1  # When auto-refresh is enabled


class IngestionStatus(BaseModel):
    last_pipeline_run: Optional[str] = None
    auto_refresh_enabled: bool = False
    can_trigger: bool = False
    cooldown_remaining_minutes: Optional[int] = None
    cooldown_total_minutes: int = 360


def _get_or_create_prefs(db: Session, user_id: int) -> IngestionPreferences:
    prefs = db.query(IngestionPreferences).filter(IngestionPreferences.user_id == user_id).first()
    if not prefs:
        prefs = IngestionPreferences(user_id=user_id, auto_refresh_enabled=False)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs


def _is_profile_complete(db: Session, user_id: int) -> bool:
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        return False
    return bool(profile.education_level and profile.skills)


def _cooldown_passed(prefs: IngestionPreferences) -> tuple[bool, int]:
    """Returns (can_trigger, remaining_minutes). Cooldown is dynamic based on auto-refresh."""
    cooldown_hours = COOLDOWN_HOURS_PREMIUM if prefs.auto_refresh_enabled else COOLDOWN_HOURS_DEFAULT
    if not prefs.last_pipeline_run:
        return True, 0
    now = datetime.now(timezone.utc)
    elapsed = now - prefs.last_pipeline_run
    if elapsed >= timedelta(hours=cooldown_hours):
        return True, 0
    remaining = timedelta(hours=cooldown_hours) - elapsed
    return False, int(remaining.total_seconds() / 60)


@router.get("/status", response_model=IngestionStatus)
def get_ingestion_status(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get the current user's ingestion status (last run, auto-refresh, cooldown).
    """
    prefs = _get_or_create_prefs(db, current_user.id)
    can_trigger, remaining = _cooldown_passed(prefs)
    profile_ready = _is_profile_complete(db, current_user.id)

    cooldown_total = 60 if prefs.auto_refresh_enabled else 360
    return IngestionStatus(
        last_pipeline_run=prefs.last_pipeline_run.isoformat() if prefs.last_pipeline_run else None,
        auto_refresh_enabled=prefs.auto_refresh_enabled,
        can_trigger=can_trigger and profile_ready,
        cooldown_remaining_minutes=remaining if not can_trigger else None,
        cooldown_total_minutes=cooldown_total,
    )


@router.post("/auto-trigger", status_code=status.HTTP_200_OK)
def auto_trigger_on_login(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Called automatically after login. Triggers the pipeline only if:
    1) User profile is complete (education + skills filled).
    2) At least 6 hours since last pipeline run.
    """
    prefs = _get_or_create_prefs(db, current_user.id)

    if not _is_profile_complete(db, current_user.id):
        return {"triggered": False, "reason": "Profile incomplete. Fill your education and skills first."}

    can_trigger, remaining = _cooldown_passed(prefs)
    if not can_trigger:
        return {"triggered": False, "reason": f"Cooldown active. {remaining} minutes remaining."}

    # Fire the Celery task
    task_result = ingest_jobs_task.delay(user_id=current_user.id)
    print(f"--- Auto-triggered ingestion on login for user {current_user.id}, task: {task_result.id} ---")

    # Update last run timestamp
    prefs.last_pipeline_run = datetime.now(timezone.utc)
    db.commit()

    return {"triggered": True, "task_id": task_result.id}


@router.post("/auto-refresh/toggle")
def toggle_auto_refresh(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Toggle hourly automatic job refresh for this user.
    This is designed to be a premium feature in the future.
    """
    prefs = _get_or_create_prefs(db, current_user.id)
    prefs.auto_refresh_enabled = not prefs.auto_refresh_enabled
    db.commit()
    db.refresh(prefs)

    status_text = "enabled" if prefs.auto_refresh_enabled else "disabled"
    return {
        "auto_refresh_enabled": prefs.auto_refresh_enabled,
        "message": f"Hourly auto-refresh {status_text}.",
    }


@router.post("/jobs", status_code=status.HTTP_202_ACCEPTED)
def trigger_job_ingestion_manual(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Manual pipeline trigger (still available as fallback). Respects 6-hour cooldown.
    """
    prefs = _get_or_create_prefs(db, current_user.id)

    can_trigger, remaining = _cooldown_passed(prefs)
    if not can_trigger:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Pipeline cooldown active. Try again in {remaining} minutes.",
        )

    task_result = ingest_jobs_task.delay(user_id=current_user.id)
    prefs.last_pipeline_run = datetime.now(timezone.utc)
    db.commit()

    return {"message": "Job ingestion started.", "task_id": task_result.id}


@router.post("/force-trigger", status_code=status.HTTP_202_ACCEPTED)
def force_trigger_ingestion(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Force-trigger pipeline, ignoring cooldown. For admin/testing use.
    """
    prefs = _get_or_create_prefs(db, current_user.id)
    task_result = ingest_jobs_task.delay(user_id=current_user.id)
    prefs.last_pipeline_run = datetime.now(timezone.utc)
    db.commit()
    return {"message": "Force-triggered job ingestion.", "task_id": task_result.id}

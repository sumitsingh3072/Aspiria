from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api import deps
from backend.app.schemas import profile
from backend.db import crud
from backend.models.user import User, Profile
from backend.app.services.job_ingestion import embedding_model

router = APIRouter()

def _update_profile_embedding(db: Session, profile: Profile):
    if embedding_model:
        text_parts = []
        if profile.preferred_job_roles:
            text_parts.extend(profile.preferred_job_roles)
        if profile.skills:
            text_parts.extend(profile.skills)
        if profile.experience:
            text_parts.append(profile.experience)
        if profile.interests:
            text_parts.extend(profile.interests)
        text_to_embed = " ".join(text_parts)
        if text_to_embed:
            emb = embedding_model.encode(text_to_embed).tolist()
            profile.profile_embedding = emb
            db.commit()
            db.refresh(profile)


@router.get("/me", response_model=profile.ProfileRead)
def read_current_user_profile(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Retrieve the profile for the current logged-in user.
    """
    profile = crud.get_profile_by_user_id(db, user_id=current_user.id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please create one.",
        )
    return profile

@router.post("/me", response_model=profile.ProfileRead, status_code=status.HTTP_201_CREATED)
def create_current_user_profile(
    profile_in: profile.ProfileCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Create a profile for the current logged-in user.
    Will return an error if a profile already exists.
    """
    existing_profile = crud.get_profile_by_user_id(db, user_id=current_user.id)
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists for this user. Use the update endpoint instead.",
        )
    profile = crud.create_user_profile(db=db, profile=profile_in, user_id=current_user.id)
    _update_profile_embedding(db, profile)
    return profile


@router.put("/me", response_model=profile.ProfileRead)
def update_current_user_profile(
    profile_in: profile.ProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Update the profile for the current logged-in user.
    """
    db_profile = crud.get_profile_by_user_id(db, user_id=current_user.id)
    if not db_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please create one first.",
        )
    profile = crud.update_user_profile(db=db, db_profile=db_profile, profile_in=profile_in)
    _update_profile_embedding(db, profile)
    return profile


# --- Application Tracking from Profile ---
from backend.models.job import JobApplication
from backend.app.schemas.job import JobApplicationRead, JobApplicationStatusUpdate
from typing import List

VALID_STATUSES = {"applied", "selected", "rejected", "in-touch"}

@router.get("/applications", response_model=List[JobApplicationRead])
def get_my_applications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Get all job applications for the current user."""
    apps = (
        db.query(JobApplication)
        .filter(JobApplication.user_id == current_user.id)
        .order_by(JobApplication.applied_at.desc())
        .all()
    )
    return apps


@router.put("/applications/{app_id}/status", response_model=JobApplicationRead)
def update_application_status(
    app_id: int,
    body: JobApplicationStatusUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Update the status of a specific application."""
    if body.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}",
        )

    app = db.query(JobApplication).filter(
        JobApplication.id == app_id,
        JobApplication.user_id == current_user.id,
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = body.status
    db.commit()
    db.refresh(app)
    return app

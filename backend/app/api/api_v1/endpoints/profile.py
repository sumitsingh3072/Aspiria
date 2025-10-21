from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.api import deps
from backend.app.schemas import profile
from backend.db import crud
from backend.models.user import User

router = APIRouter()

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
    return profile


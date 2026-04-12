from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.models.user import User
from backend.models.job_alert_preferences import JobAlertPreferences
from backend.app.schemas.job_alerts import JobAlertPreferencesCreate, JobAlertPreferencesRead

router = APIRouter()

@router.post("/subscribe", response_model=JobAlertPreferencesRead)
def subscribe_job_alerts(
    preferences_in: JobAlertPreferencesCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Subscribe to job alerts or update existing preferences.
    """
    db_pref = db.query(JobAlertPreferences).filter(JobAlertPreferences.user_id == current_user.id).first()
    if db_pref:
        update_data = preferences_in.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_pref, key, value)
        db_pref.is_active = True
        db.commit()
        db.refresh(db_pref)
        return db_pref
    else:
        new_pref = JobAlertPreferences(
            user_id=current_user.id,
            **preferences_in.model_dump()
        )
        db.add(new_pref)
        db.commit()
        db.refresh(new_pref)
        return new_pref

@router.delete("/unsubscribe", status_code=status.HTTP_200_OK)
def unsubscribe_job_alerts(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Unsubscribe from job alerts (marks as inactive).
    """
    db_pref = db.query(JobAlertPreferences).filter(JobAlertPreferences.user_id == current_user.id).first()
    if not db_pref:
        raise HTTPException(status_code=404, detail="Preferences not found")
    
    db_pref.is_active = False
    db.commit()
    return {"detail": "Successfully unsubscribed from job alerts"}

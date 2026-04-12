from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.models.user import User
from backend.models.job import Job

router = APIRouter()

@router.post("/{job_id}/auto-apply")
def auto_apply_for_job(
    job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    """
    Simulates or initiates the auto-apply logic for a given job using the user's profile.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"status": "success", "message": f"Successfully initiated auto-apply for job {job_id} using profile for {current_user.email}"}

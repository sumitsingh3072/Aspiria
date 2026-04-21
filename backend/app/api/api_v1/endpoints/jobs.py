from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from backend.app.api import deps
from backend.models.user import User
from backend.models.job import Job

router = APIRouter()

class JobRead(BaseModel):
    id: int
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    skills: Optional[list] = None
    source: Optional[str] = None
    apply_options: Optional[list] = None
    schedule_type: Optional[str] = None
    posted_at: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[JobRead])
def list_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = None,
    db: Session = Depends(deps.get_db),
):
    """
    Retrieve all ingested job listings.
    """
    query = db.query(Job)
    if search:
        query = query.filter(
            Job.title.ilike(f"%{search}%") | Job.company.ilike(f"%{search}%")
        )
    jobs = query.order_by(Job.id.desc()).offset(skip).limit(limit).all()
    return jobs

@router.get("/count")
def get_jobs_count(db: Session = Depends(deps.get_db)):
    """
    Get total number of ingested jobs.
    """
    count = db.query(Job).count()
    return {"count": count}

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

from backend.app.services.ats_scorer import calculate_ats_score

class ScoreRequest(BaseModel):
    job_id: int
    resume_id: int

@router.post("/score")
def score_resume(
    request: ScoreRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    from backend.models.user import Resume

    job = db.query(Job).filter(Job.id == request.job_id).first()
    resume = db.query(Resume).filter(Resume.id == request.resume_id, Resume.user_id == current_user.id).first()

    if not job or not resume:
        raise HTTPException(status_code=404, detail="Job or Resume not found")

    parsed_json = resume.parsed_json or {}
    job_desc = job.description or ""
    job_skills = job.skills or []
    
    score_result = calculate_ats_score(parsed_json, job_desc, job_skills)
    
    return score_result

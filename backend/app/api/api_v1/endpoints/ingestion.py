from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from backend.app.api import deps
from backend.app.services import job_ingestion

router = APIRouter()

@router.post("/jobs", status_code=status.HTTP_202_ACCEPTED)
def trigger_job_ingestion(
    db: Session = Depends(deps.get_db),
):
    """
    Manually trigger the job data ingestion process.
    This simulates a scheduled background task.
    """
    job_ingestion.ingest_jobs_to_db(db)
    return {"message": "Job ingestion process started."}

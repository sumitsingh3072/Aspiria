from fastapi import APIRouter, Depends, status
# from sqlalchemy.orm import Session
# from backend.app.api import deps
# from backend.app.services import job_ingestion
from backend.app.tasks.job_task import ingest_jobs_task
router = APIRouter()

@router.post("/jobs", status_code=status.HTTP_202_ACCEPTED)
def trigger_job_ingestion(
):
    """
    Manually trigger the job data ingestion process.
    This runs as a background task via Celery.
    """
    task_result = ingest_jobs_task.delay()
    print(f"--- Triggered job ingestion task with ID: {task_result.id} ---")
    return {"message": "Job ingestion process started.", "task_id": task_result.id}

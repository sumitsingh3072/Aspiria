from backend.app.core.celery_app import celery_app
from backend.db.session import SessionLocal
from backend.app.services import job_ingestion as job_ingestion_service
from sqlalchemy.orm import Session

@celery_app.task
def simple_test_task(x, y):
    print(f"--- Running simple test task: {x} + {y} ---")
    return x + y

@celery_app.task(bind=True) # bind=True gives access to 'self'
def ingest_jobs_task(self):
    """
    Celery task to ingest jobs into the database asynchronously.
    """
    print("--- Starting job ingestion task ---")
    db: Session = SessionLocal() 
    try:
        job_ingestion_service.ingest_jobs_to_db(db)
        print("--- Job ingestion task finished successfully ---")
        return {"status": "success"}
    except Exception as e:
        print(f"--- Job ingestion task failed: {e} ---")
        # implement retries here using self.retry()
        return {"status": "failure", "error": str(e)}
    finally:
        db.close() 
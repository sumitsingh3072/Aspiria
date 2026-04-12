from backend.app.core.celery_app import celery_app
from backend.db.session import SessionLocal
from backend.app.services import job_ingestion as job_ingestion_service
from sqlalchemy.orm import Session

@celery_app.task
def simple_test_task(x, y):
    print(f"--- Running simple test task: {x} + {y} ---")
    return x + y

@celery_app.task(bind=True)
def ingest_jobs_task(self, user_id: int = None):
    """
    Celery task to ingest personalized jobs for a specific user.
    """
    print(f"--- Starting personalized job ingestion for user_id={user_id} ---")
    db: Session = SessionLocal() 
    try:
        job_ingestion_service.ingest_jobs_to_db(db, user_id=user_id)
        print("--- Job ingestion task finished successfully ---")
        return {"status": "success", "user_id": user_id}
    except Exception as e:
        print(f"--- Job ingestion task failed: {e} ---")
        return {"status": "failure", "error": str(e)}
    finally:
        db.close() 


@celery_app.task
def hourly_auto_refresh_task():
    """
    Celery Beat periodic task: runs every hour.
    Triggers personalized ingestion for each user with auto-refresh enabled.
    """
    from backend.models.ingestion_preferences import IngestionPreferences
    from datetime import datetime, timezone

    db: Session = SessionLocal()
    try:
        active_prefs = (
            db.query(IngestionPreferences)
            .filter(IngestionPreferences.auto_refresh_enabled == True)
            .all()
        )

        if not active_prefs:
            print("--- Hourly auto-refresh: No users with auto-refresh enabled. Skipping. ---")
            return {"status": "skipped", "reason": "no active subscribers"}

        print(f"--- Hourly auto-refresh: Running for {len(active_prefs)} user(s) ---")
        
        now = datetime.now(timezone.utc)
        for pref in active_prefs:
            # Run personalized ingestion per user
            job_ingestion_service.ingest_jobs_to_db(db, user_id=pref.user_id)
            pref.last_pipeline_run = now

        db.commit()
        print("--- Hourly auto-refresh completed successfully ---")
        return {"status": "success", "subscribers": len(active_prefs)}
    except Exception as e:
        print(f"--- Hourly auto-refresh failed: {e} ---")
        return {"status": "failure", "error": str(e)}
    finally:
        db.close()
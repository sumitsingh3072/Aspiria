from backend.app.core.celery_app import celery_app
from backend.db.session import SessionLocal
from backend.app.services import job_ingestion as job_ingestion_service
from sqlalchemy.orm import Session

@celery_app.task
def simple_test_task(x, y):
    print(f"--- Running simple test task: {x} + {y} ---")
    return x + y

@celery_app.task(bind=True)
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
        return {"status": "failure", "error": str(e)}
    finally:
        db.close() 


@celery_app.task
def hourly_auto_refresh_task():
    """
    Celery Beat periodic task: runs every hour.
    Checks which users have auto_refresh_enabled=True and triggers ingestion.
    The actual job data is shared, so we only need to run the pipeline once
    if any user has the feature enabled.
    """
    from backend.models.ingestion_preferences import IngestionPreferences
    from datetime import datetime, timezone

    db: Session = SessionLocal()
    try:
        active_users = (
            db.query(IngestionPreferences)
            .filter(IngestionPreferences.auto_refresh_enabled == True)
            .count()
        )

        if active_users == 0:
            print("--- Hourly auto-refresh: No users with auto-refresh enabled. Skipping. ---")
            return {"status": "skipped", "reason": "no active subscribers"}

        print(f"--- Hourly auto-refresh: {active_users} user(s) with auto-refresh. Running pipeline... ---")
        job_ingestion_service.ingest_jobs_to_db(db)

        # Update last_pipeline_run for all auto-refresh users
        now = datetime.now(timezone.utc)
        (
            db.query(IngestionPreferences)
            .filter(IngestionPreferences.auto_refresh_enabled == True)
            .update({"last_pipeline_run": now})
        )
        db.commit()

        print("--- Hourly auto-refresh completed successfully ---")
        return {"status": "success", "subscribers": active_users}
    except Exception as e:
        print(f"--- Hourly auto-refresh failed: {e} ---")
        return {"status": "failure", "error": str(e)}
    finally:
        db.close()
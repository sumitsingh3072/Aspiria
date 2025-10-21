from sqlalchemy.orm import Session
from backend.db import crud
from backend.app.schemas import job as job_schema

def fetch_mock_jobs() -> list[dict]:
    """
    Simulates fetching job data from an external API like Indeed or LinkedIn.
    In a real application, this would make an HTTP request.
    """
    return [
        {
            "title": "Data Scientist",
            "company": "HealthTech Innovations",
            "location": "Lucknow, Uttar Pradesh",
            "description": "Analyze healthcare data to find insights...",
            "skills": ["python", "sql", "machine learning", "pandas", "healthcare"]
        },
        {
            "title": "AI Engineer - Generative AI",
            "company": "Creative Solutions Ltd.",
            "location": "Remote",
            "description": "Develop and deploy generative models for content creation.",
            "skills": ["python", "pytorch", "gcp", "docker", "generative ai", "mlops"]
        },
        {
            "title": "Backend Developer (Python)",
            "company": "Fintech Secure",
            "location": "Bengaluru, Karnataka",
            "description": "Build secure and scalable backend systems for financial applications.",
            "skills": ["python", "fastapi", "docker", "postgresql", "security"]
        },
        {
            "title": "Junior Python Developer",
            "company": "StartUp Sprint",
            "location": "Noida, Uttar Pradesh",
            "description": "Join our fast-paced team to work on various web projects.",
            "skills": ["python", "fastapi", "sql"]
        }
    ]

def ingest_jobs_to_db(db: Session):
    """
    Fetches mock job data and stores it in the database.
    """
    jobs_data = fetch_mock_jobs()
    for job_data in jobs_data:
        job_in = job_schema.JobCreate(**job_data)
        # Here you might add logic to avoid duplicates
        crud.create_job(db=db, job=job_in)
    print(f"--- Ingested {len(jobs_data)} jobs into the database ---")

import logging
import requests
from sqlalchemy.orm import Session
from backend.db import crud
from backend.app.schemas import job as job_schema
from backend.app.core.config import settings
from sentence_transformers import SentenceTransformer

try:
    print("--- Loading SentenceTransformer model 'all-MiniLM-L6-v2' ---")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2') 
    print("--- SentenceTransformer model loaded successfully ---")
except Exception as e:
    logging.error(f"Failed to load SentenceTransformer model: {e}")
    embedding_model = None

# Diverse search queries to get a well-rounded dataset
SEARCH_QUERIES = [
    {"q": "software engineer", "location": "India"},
    {"q": "data scientist", "location": "India"},
    {"q": "machine learning engineer", "location": "India"},
    {"q": "python developer", "location": "India"},
    {"q": "full stack developer", "location": "India"},
    {"q": "AI engineer", "location": "India"},
    {"q": "backend developer", "location": "India"},
    {"q": "devops engineer", "location": "India"},
]

SERPAPI_BASE_URL = "https://serpapi.com/search"


def _extract_skills_from_highlights(job_highlights: list) -> list[str]:
    """
    Extract skill-like keywords from the job_highlights.qualifications section.
    """
    skills = []
    if not job_highlights:
        return skills
    for section in job_highlights:
        if section.get("title") == "Qualifications":
            items = section.get("items", [])
            # Take first 5 qualification items as proxy skill tags
            for item in items[:5]:
                # Truncate long items to something usable as a tag
                tag = item.strip()
                if len(tag) > 60:
                    tag = tag[:57] + "..."
                skills.append(tag)
    return skills


def fetch_live_jobs(query: str, location: str = "India") -> list[dict]:
    """
    Fetches real job data from Google Jobs via SerpAPI.
    """
    if not settings.SERP_API_KEY:
        logging.warning("SERP_API_KEY not set, falling back to empty results.")
        return []

    params = {
        "engine": "google_jobs",
        "q": query,
        "location": location,
        "hl": "en",
        "api_key": settings.SERP_API_KEY,
    }

    try:
        response = requests.get(SERPAPI_BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        logging.error(f"SerpAPI request failed for query '{query}': {e}")
        return []

    jobs_results = data.get("jobs_results", [])
    parsed_jobs = []

    for job in jobs_results:
        description = job.get("description", "")
        skills = _extract_skills_from_highlights(job.get("job_highlights", []))
        
        # Truncate very long descriptions to save DB space
        if len(description) > 3000:
            description = description[:2997] + "..."

        # Extract apply link (first option if available)
        apply_options = job.get("apply_options", [])
        apply_link = apply_options[0].get("link") if apply_options else None

        # Extract metadata from detected_extensions
        detected = job.get("detected_extensions", {})

        parsed_jobs.append({
            "title": job.get("title", "Untitled"),
            "company": job.get("company_name"),
            "location": job.get("location"),
            "description": description,
            "skills": skills,
            "source": job.get("via"),
            "apply_link": apply_link,
            "schedule_type": detected.get("schedule_type"),
            "posted_at": detected.get("posted_at"),
        })

    logging.info(f"Fetched {len(parsed_jobs)} jobs for query '{query}' in '{location}'")
    return parsed_jobs


def ingest_jobs_to_db(db: Session):
    """
    Fetches live job data from Google Jobs via SerpAPI and stores it in the database.
    Runs multiple search queries for diverse coverage.
    """
    total_ingested = 0

    for search in SEARCH_QUERIES:
        query = search["q"]
        location = search.get("location", "India")

        jobs_data = fetch_live_jobs(query=query, location=location)

        for job_data in jobs_data:
            # Build embedding text
            text_to_embed = (
                f"{job_data.get('title', '')} "
                f"{job_data.get('company', '')} "
                f"{job_data.get('description', '')} "
                f"{' '.join(job_data.get('skills', []))}"
            )
            if embedding_model:
                job_data['description_embedding'] = embedding_model.encode(text_to_embed).tolist()

            job_in = job_schema.JobCreate(**job_data)
            crud.create_job(db=db, job=job_in)
            total_ingested += 1

    print(f"--- Ingested {total_ingested} LIVE jobs from Google Jobs API into the database ---")

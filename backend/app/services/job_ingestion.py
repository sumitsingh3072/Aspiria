import logging
import requests
from sqlalchemy.orm import Session
from backend.db import crud
from backend.app.schemas import job as job_schema
from backend.app.core.config import settings
from backend.models.user import Profile
from sentence_transformers import SentenceTransformer

try:
    print("--- Loading SentenceTransformer model 'all-MiniLM-L6-v2' ---")
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2') 
    print("--- SentenceTransformer model loaded successfully ---")
except Exception as e:
    logging.error(f"Failed to load SentenceTransformer model: {e}")
    embedding_model = None

SERPAPI_BASE_URL = "https://serpapi.com/search"


def _build_queries_from_profile(profile: Profile) -> list[dict]:
    """
    Build personalized SerpAPI search queries from the user's profile.
    Uses preferred_job_roles first, then falls back to skills/interests.
    Returns a list of {q, location} dicts.
    """
    queries = []

    # Primary: preferred job roles (most direct)
    roles = profile.preferred_job_roles or []
    for role in roles[:5]:  # Cap at 5 role searches
        queries.append({"q": role.strip(), "location": "India"})

    # Secondary: combine skills into job search queries
    skills = profile.skills or []
    if skills and len(queries) < 3:
        # Group skills into search-friendly queries
        skill_str = " ".join(skills[:4])
        queries.append({"q": f"{skill_str} developer", "location": "India"})

    # Tertiary: interests
    interests = profile.interests or []
    for interest in interests[:2]:  # Max 2 interest-based searches
        if len(queries) >= 6:
            break
        queries.append({"q": f"{interest.strip()} jobs", "location": "India"})

    # Fallback: field of study
    if not queries and profile.field_of_study:
        queries.append({"q": f"{profile.field_of_study} jobs", "location": "India"})

    # Ultimate fallback
    if not queries:
        queries.append({"q": "software jobs", "location": "India"})

    return queries


def _extract_skills_from_highlights(job_highlights: list) -> list[str]:
    """Extract skill-like keywords from job_highlights.qualifications."""
    skills = []
    if not job_highlights:
        return skills
    for section in job_highlights:
        if section.get("title") == "Qualifications":
            for item in section.get("items", [])[:5]:
                tag = item.strip()
                if len(tag) > 60:
                    tag = tag[:57] + "..."
                skills.append(tag)
    return skills


def fetch_live_jobs(query: str, location: str = "India") -> list[dict]:
    """Fetches real job data from Google Jobs via SerpAPI."""
    if not settings.SERP_API_KEY:
        logging.warning("SERP_API_KEY not set, returning empty results.")
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
        
        if len(description) > 3000:
            description = description[:2997] + "..."

        raw_apply = job.get("apply_options", [])
        apply_options = [
            {"title": opt.get("title", "Apply"), "link": opt.get("link")}
            for opt in raw_apply if opt.get("link")
        ]

        detected = job.get("detected_extensions", {})

        parsed_jobs.append({
            "title": job.get("title", "Untitled"),
            "company": job.get("company_name"),
            "location": job.get("location"),
            "description": description,
            "skills": skills,
            "source": job.get("via"),
            "apply_options": apply_options if apply_options else None,
            "schedule_type": detected.get("schedule_type"),
            "posted_at": detected.get("posted_at"),
        })

    logging.info(f"Fetched {len(parsed_jobs)} jobs for query '{query}' in '{location}'")
    return parsed_jobs


def ingest_jobs_to_db(db: Session, user_id: int = None):
    """
    Fetches live job data from Google Jobs via SerpAPI.
    If user_id is provided, builds personalized queries from their profile.
    """
    total_ingested = 0

    # Build personalized queries from user profile
    search_queries = []
    if user_id:
        profile = db.query(Profile).filter(Profile.user_id == user_id).first()
        if profile:
            search_queries = _build_queries_from_profile(profile)
            print(f"--- Personalized ingestion for user {user_id}: {[q['q'] for q in search_queries]} ---")

    # Fallback if no profile or no queries built
    if not search_queries:
        search_queries = [{"q": "software developer", "location": "India"}]
        print("--- No profile found, using fallback query ---")

    for search in search_queries:
        query = search["q"]
        location = search.get("location", "India")

        jobs_data = fetch_live_jobs(query=query, location=location)

        for job_data in jobs_data:
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

    print(f"--- Ingested {total_ingested} personalized jobs from Google Jobs API ---")

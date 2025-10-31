from sqlalchemy.orm import Session
from backend.models import user as user_model, job as job_model
from backend.models.job import Job
from typing import List
from backend.app.schemas import user as user_schema, profile as profile_schema, chat as chat_schema , job as job_schema
from backend.app.core.security import get_password_hash
from sqlalchemy import or_, String

# --- User CRUD ---

def get_user_by_email(db: Session, email: str) -> user_model.User | None:
    """Fetches a user from the database by their email address."""
    return db.query(user_model.User).filter(user_model.User.email == email).first()


def create_user(db: Session, user: user_schema.UserCreate) -> user_model.User:
    """Creates a new user in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = user_model.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Profile CRUD ---

def get_profile_by_user_id(db: Session, user_id: int) -> user_model.Profile | None:
    """Fetches a user's profile from the database by their user ID."""
    return db.query(user_model.Profile).filter(user_model.Profile.user_id == user_id).first()

def create_user_profile(db: Session, profile: profile_schema.ProfileCreate, user_id: int) -> user_model.Profile:
    """Creates a new profile for a user in the database."""
    db_profile = user_model.Profile(
        **profile.model_dump(),
        user_id=user_id
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

def update_user_profile(db: Session, db_profile: user_model.Profile, profile_in: profile_schema.ProfileUpdate) -> user_model.Profile:
    """Updates an existing user profile in the database."""
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_profile, field, value)
    
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

# --- ChatMessage CRUD ---
def create_chat_message(db: Session, message: chat_schema.ChatMessageCreate, user_id: int, is_from_user: bool) -> user_model.ChatMessage:
    """Creates a new chat message in the database."""
    db_message = user_model.ChatMessage(
        message=message.message,
        user_id=user_id,
        is_from_user=is_from_user
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def get_chat_history(db: Session, user_id: int, limit: int = 50) -> list[user_model.ChatMessage]:
    """Fetches the chat history for a user, ordered by creation time."""
    return db.query(user_model.ChatMessage).filter(user_model.ChatMessage.user_id == user_id).order_by(user_model.ChatMessage.id.desc()).limit(limit).all()[::-1]

# --- Job CRUD ---

def create_job(db: Session, job: job_schema.JobCreate) -> job_model.Job:
    """Creates a new job posting in the database."""
    db_job = job_model.Job(**job.model_dump())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def get_relevant_jobs(db: Session, query_embedding: List[float], limit: int = 5) -> list[job_model.Job]:
    """
    Retrieves jobs from the database that are semantically similar
    to the user's query embedding using pgvector's L2 distance.
    """
    if not query_embedding:
        return []
    
    # Use the L2 distance operator '<->' to find the nearest neighbors
    # The pgvector.sqlalchemy library overloads this operator
    query = db.query(job_model.Job).order_by(
        job_model.Job.description_embedding.l2_distance(query_embedding)
    ).limit(limit)
    
    return query.all()


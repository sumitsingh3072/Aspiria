from sqlalchemy import Column, Integer, String, JSON, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.db.session import Base
from pgvector.sqlalchemy import Vector

EMBEDDING_DIM = 384

class Job(Base):
    """Database model for job postings."""
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    company = Column(String, index=True)
    location = Column(String)
    description = Column(String)
    skills = Column(JSON) 
    description_embedding = Column(Vector(EMBEDDING_DIM), nullable=True)
    source = Column(String, nullable=True)         # e.g. "ZipRecruiter", "LinkedIn"
    apply_options = Column(JSON, nullable=True)     # [{title: "Indeed", link: "..."}, ...]
    schedule_type = Column(String, nullable=True)   # "Full-time", "Part-time", "Contract"
    posted_at = Column(String, nullable=True)       # "3 days ago"
    applications = relationship("JobApplication", back_populates="job", cascade="all, delete-orphan")


class JobApplication(Base):
    """Tracks which jobs a user has applied to and their application status."""
    __tablename__ = "job_applications"
    __table_args__ = (
        UniqueConstraint("user_id", "job_id", name="uq_user_job_application"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False, index=True)
    status = Column(String, nullable=False, default="applied")  # applied, selected, rejected, in-touch
    applied_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    job = relationship("Job", back_populates="applications")
    owner = relationship("User", back_populates="job_applications")
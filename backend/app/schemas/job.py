from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    skills: List[str] = []
    description_embedding: Optional[List[float]] = None
    source: Optional[str] = None
    apply_options: Optional[List[Dict[str, Any]]] = None
    schedule_type: Optional[str] = None
    posted_at: Optional[str] = None

class JobCreate(JobBase):
    pass

class JobRead(JobBase):
    id: int

    class Config:
        from_attributes = True


# --- Job Application Schemas ---

class JobApplicationCreate(BaseModel):
    job_id: int

class JobApplicationStatusUpdate(BaseModel):
    status: str  # applied, selected, rejected, in-touch

class JobApplicationJobInfo(BaseModel):
    """Minimal job info embedded in application responses."""
    id: int
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    schedule_type: Optional[str] = None

    class Config:
        from_attributes = True

class JobApplicationRead(BaseModel):
    id: int
    user_id: int
    job_id: int
    status: str
    applied_at: datetime
    job: JobApplicationJobInfo

    class Config:
        from_attributes = True

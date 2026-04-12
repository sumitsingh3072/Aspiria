from pydantic import BaseModel
from typing import Any, Dict, List, Optional

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

from pydantic import BaseModel
from typing import List, Optional

class JobBase(BaseModel):
    title: str
    company: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    skills: List[str] = []
    description_embedding: Optional[List[float]] = None

class JobCreate(JobBase):
    pass

class JobRead(JobBase):
    id: int

    class Config:
        from_attributes = True

from pydantic import BaseModel, Field
from typing import List, Optional

class ProfileBase(BaseModel):
    """Base schema with common profile attributes."""
    education_level: Optional[str] = Field(None)
    field_of_study: Optional[str] = Field(None)
    skills: Optional[List[str]] = Field(None)
    interests: Optional[List[str]] = Field(None)
    career_aspirations: Optional[str] = Field(None)
    experience: Optional[str] = Field(None)
    preferred_job_roles: Optional[List[str]] = Field(None)
    is_complete: Optional[bool] = Field(False)

class ProfileCreate(ProfileBase):
    """Schema for creating a profile. All fields are optional at creation."""
    pass

class ProfileUpdate(ProfileBase):
    """Schema for updating a profile. All fields are optional."""
    pass

class ProfileRead(ProfileBase):
    """Schema for reading/returning profile data."""
    id: int
    user_id: int

    class Config:
        from_attributes = True

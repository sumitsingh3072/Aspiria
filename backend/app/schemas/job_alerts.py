from pydantic import BaseModel

class JobAlertPreferencesBase(BaseModel):
    location_preference: str | None = None
    role_keywords: str | None = None
    employment_type: str | None = None
    is_active: bool = True

class JobAlertPreferencesCreate(JobAlertPreferencesBase):
    pass

class JobAlertPreferencesUpdate(JobAlertPreferencesBase):
    pass

class JobAlertPreferencesRead(JobAlertPreferencesBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

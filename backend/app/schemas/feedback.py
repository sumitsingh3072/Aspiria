from pydantic import BaseModel, Field
from typing import Optional

class FeedbackBase(BaseModel):
    """Base schema for feedback."""
    chat_message_id: int
    rating: int = Field(..., ge=1, le=5, description="User rating from 1 (bad) to 5 (good)")
    comment: Optional[str] = Field(None, max_length=1000)

class FeedbackCreate(FeedbackBase):
    """Schema for creating new feedback."""
    pass

class FeedbackRead(FeedbackBase):
    """Schema for reading/returning feedback data."""
    id: int
    
    class Config:
        from_attributes = True

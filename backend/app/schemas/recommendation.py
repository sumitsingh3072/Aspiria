from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import uuid
from datetime import datetime

class SkillSchema(BaseModel):
    """
    Represents a single skill.
    """
    name: str
    description: Optional[str] = None

class LearningResourceSchema(BaseModel):
    """
    Represents a learning resource, like an online course or article.
    """
    title: str
    url: HttpUrl
    resource_type: str  # e.g., "Course", "Article", "Book", "Project Idea"
    
class JobMarketInsightSchema(BaseModel):
    """
    Represents a job posting or a summary of market trends.
    """
    title: str
    url: HttpUrl
    company: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None

class CareerPathSchema(BaseModel):
    """
    Represents a single, detailed career path recommendation.
    """
    title: str
    description: str
    required_skills: List[SkillSchema] = []
    suggested_learning: List[LearningResourceSchema] = []
    job_market_insights: List[JobMarketInsightSchema] = []

class RecommendationBase(BaseModel):
    """
    Base schema for a recommendation, containing the core advice.
    """
    summary: str
    career_paths: List[CareerPathSchema] = []

class RecommendationCreate(RecommendationBase):
    """
    Schema used when creating a new recommendation in the system.
    The user_id will be associated internally.
    """
    pass

class Recommendation(RecommendationBase):
    """
    The full recommendation object to be returned by the API.
    """
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True

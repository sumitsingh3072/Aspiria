from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.session import Base

class JobAlertPreferences(Base):
    """
    Database model for user job alert preferences.
    """
    __tablename__ = "job_alert_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    location_preference = Column(String, nullable=True)
    role_keywords = Column(String, nullable=True)
    employment_type = Column(String, nullable=True) # e.g. full-time, internship
    is_active = Column(Boolean, default=True)

    user = relationship("User", backref="job_alert_preferences")

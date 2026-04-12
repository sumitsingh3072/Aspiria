from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.db.session import Base


class IngestionPreferences(Base):
    """Tracks per-user pipeline run history and auto-refresh toggle."""
    __tablename__ = "ingestion_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    last_pipeline_run = Column(DateTime(timezone=True), nullable=True)
    auto_refresh_enabled = Column(Boolean, default=False, nullable=False)

    user = relationship("User")

import uuid
from sqlalchemy import Column, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime

from .user import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Storing complex, nested data like this is often best done in a JSONB column.
    # This avoids creating many small tables and keeps the recommendation self-contained.
    recommendation_data = Column(JSONB, nullable=False)

    user = relationship("User", back_populates="recommendations")

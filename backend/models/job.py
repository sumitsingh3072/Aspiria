from sqlalchemy import Column, Integer, String, JSON
from backend.db.session import Base
from pgvector.sqlalchemy import Vector

EMBEDDING_DIM = 384

class Job(Base):
    """Database model for job postings."""
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    company = Column(String, index=True)
    location = Column(String)
    description = Column(String)
    skills = Column(JSON) 
    description_embedding = Column(Vector(EMBEDDING_DIM), nullable=True)
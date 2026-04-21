from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.db.session import Base
from sqlalchemy.sql import func
from backend.models.job import Job 
from backend.models.backend_notification import Notification  # noqa: F401 — required for SQLAlchemy relationship resolution

class User(Base):
    """
    Database model for a user.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    chat_messages = relationship("ChatMessage", back_populates="owner", cascade="all, delete-orphan")
    profile = relationship("Profile", uselist=False, back_populates="owner", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="owner", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="owner", cascade="all, delete-orphan")

class Profile(Base):
    """
    Database model for a user's profile.
    Contains details needed for the AI advisor.
    """
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    education_level = Column(String, index=True, nullable=True)
    field_of_study = Column(String, index=True, nullable=True)
    skills = Column(JSON, nullable=True)
    interests = Column(JSON, nullable=True)
    career_aspirations = Column(Text, nullable=True)
    experience = Column(String, nullable=True)           # e.g. "Fresher", "2 years", "5+ years"
    preferred_job_roles = Column(JSON, nullable=True)    # e.g. ["Software Engineer", "Data Scientist"]
    is_complete = Column(Boolean, default=False)
    owner = relationship("User", back_populates="profile")


class ChatMessage(Base):
    """
    Database model for a single chat message.
    """
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, index=True, nullable=True)
    message = Column(Text, nullable=False)
    is_from_user = Column(Boolean, default=True)
    owner = relationship("User", back_populates="chat_messages")
    feedback = relationship("Feedback", uselist=False, back_populates="chat_message", cascade="all, delete-orphan")


class Feedback(Base):
    """
    Database model for user feedback on an AI chat message.
    """
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    chat_message_id = Column(Integer, ForeignKey("chat_messages.id"), unique=True, nullable=False)
    rating = Column(Integer, nullable=False) # e.g., 1 for "bad", 5 for "good"
    comment = Column(Text, nullable=True)
    chat_message = relationship("ChatMessage", back_populates="feedback")


class Resume(Base):
    """
    Database model for user uploaded and parsed resumes.
    """
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_url = Column(String, nullable=True)
    parsed_json = Column(JSON, nullable=True)
    owner = relationship("User", back_populates="resumes")


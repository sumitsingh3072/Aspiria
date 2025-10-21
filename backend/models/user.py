from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.db.session import Base

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
    owner = relationship("User", back_populates="profile")


class ChatMessage(Base):
    """
    Database model for a single chat message.
    """
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    is_from_user = Column(Boolean, default=True)
    owner = relationship("User", back_populates="chat_messages")

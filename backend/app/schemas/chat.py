from pydantic import BaseModel
import uuid
from datetime import datetime

class MessageBase(BaseModel):
    """
    Base model for a message, containing the essential content.
    """
    content: str

class MessageCreate(MessageBase):
    """
    Schema for a user sending a new message.
    The user_id will be handled by the backend based on the authenticated user.
    """
    pass

class Message(MessageBase):
    """
    Schema for a message to be returned by the API.
    Includes sender information and a timestamp.
    """
    id: uuid.UUID
    sender: str  # "user" or "ai"
    timestamp: datetime
    
    class Config:
        from_attributes = True

class ChatSession(BaseModel):
    """
    Represents a full chat session with its history.
    """
    id: uuid.UUID
    user_id: uuid.UUID
    messages: list[Message] = []

    class Config:
        from_attributes = True

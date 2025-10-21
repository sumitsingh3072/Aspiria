from pydantic import BaseModel

class ChatMessageBase(BaseModel):
    """Base schema for a chat message."""
    message: str

class ChatMessageCreate(ChatMessageBase):
    """Schema for creating a new message (from the user)."""
    pass

class ChatMessageRead(ChatMessageBase):
    """Schema for reading/returning a chat message."""
    id: int
    is_from_user: bool

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    """Schema for the AI's response."""
    response: str

from pydantic import BaseModel

class MultilingualChatRequest(BaseModel):
    """Schema for sending a message in any language."""
    message: str
    session_id: str | None = None

class MultilingualChatResponse(BaseModel):
    """Schema for the translated response."""
    response: str 
    original_language: str  
    english_response: str  
    message_id: int
    session_id: str
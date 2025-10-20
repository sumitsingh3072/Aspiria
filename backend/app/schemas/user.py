from pydantic import BaseModel, EmailStr, Field



# --- User Schemas ---

class UserBase(BaseModel):
    """Base schema with common user attributes."""
    email: EmailStr
    full_name: str | None = None


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(
        ...,
        min_length=8,
        max_length=256,
        description="Password must be at least 8 characters long."
    )

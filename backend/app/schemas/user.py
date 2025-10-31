from pydantic import BaseModel, EmailStr, Field

# --- Token Schemas ---
class Token(BaseModel):
    """Schema for the access token."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for the data encoded in the token."""
    email: str | None = None

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

class UserRead(UserBase):
    """Schema for reading/returning user data."""
    id: int
    is_active: bool

    class Config:
        from_attributes = True # Replaces orm_mode = True
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from typing import Optional
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')

class Settings(BaseSettings):
    """
    Holds all the application settings. The values are loaded from
    environment variables.
    """
    PROJECT_NAME: str = "Aspiria"
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str 
    SECRET_KEY: str
    DATABASE_URL: str

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 7000
    CELERY_BROKER_URL: str = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
    CELERY_RESULT_BACKEND: str = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: Optional[str] = "http://localhost:8000/api/v1/auth/google/callback"
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")


    # Email
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    model_config = SettingsConfigDict(env_file="C:\\ML_Projects\\Aspiria\\backend\\.env", extra="ignore")

settings = Settings()  # type: ignore
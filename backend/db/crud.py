from sqlalchemy import desc, func
from sqlalchemy.orm import Session
from backend.models.user import User
from backend.app.schemas.user import UserCreate
from backend.app.core.security import get_password_hash
from datetime import datetime
from decimal import Decimal


def get_user_by_email(db: Session, email: str) -> User | None:
    """Fetches a user from the database by their email address."""
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate) -> User:
    """Creates a new user in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
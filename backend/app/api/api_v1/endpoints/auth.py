from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.app.api import deps
from backend.app.schemas.user import UserCreate, UserRead , Token
from backend.db import crud
from backend.app.core import security
from backend.models.user import User
import string
import secrets
from authlib.integrations.starlette_client import OAuth
from backend.app.core.config import settings
from starlette.requests import Request


router = APIRouter()

# --- Google OAuth Setup ---
oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

@router.get("/google/login")
async def login_google(request: Request):
    """
    Redirects the user to the Google OAuth consent screen.
    """
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    client = oauth.create_client('google')
    if not client:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google OAuth client not found")
    
    return await client.authorize_redirect(request, redirect_uri)

@router.get("/google/callback", response_model=Token)
async def auth_google(request: Request, db: Session = Depends(deps.get_db)):
    """
    Callback for Google OAuth. 
    Creates the user if they don't exist and returns an access token.
    """
    client = oauth.create_client('google')
    if not client:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Google OAuth client not found")

    try:
        token = await client.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"OAuth Error: {str(e)}")

    user_info = token.get('userinfo')
    if not user_info:
        user_info = await client.userinfo(token=token)
    
    email = user_info.get('email')
    name = user_info.get('name')
    
    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not found in OAuth data")


    user = crud.get_user_by_email(db, email=email)
    
    if not user:

        alphabet = string.ascii_letters + string.digits + string.punctuation
        random_password = ''.join(secrets.choice(alphabet) for i in range(32))
        
        user_in = UserCreate(email=email, full_name=name, password=random_password)
        user = crud.create_user(db=db, user=user_in)
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate, 
    db: Session = Depends(deps.get_db)
):
    """
    Create a new user.
    """
    user = crud.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )
    user = crud.create_user(db=db, user=user_in)
    return user


@router.post("/login", response_model=Token)
async def login_for_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    
    'username' in the form is the user's email.
    """
    user = crud.get_user_by_email(db, email=form_data.username)
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Inactive user"
        )

    access_token = security.create_access_token(
        data={"sub": user.email}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
async def read_users_me(
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get the current logged-in user's details.
    """
    return current_user
import os
import sys
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from backend.db.session import engine, Base
from backend.app.core.config import settings
from backend.app.api.api_v1.api import api_router

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# def create_db_and_tables():
#     Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("--- Starting up: Creating database tables ---")
    # create_db_and_tables()
    print("--- Startup complete ---")
    yield
    print("--- Shutting down ---")

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

app.include_router(api_router, prefix=settings.API_V1_STR)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

@app.get("/")
async def read_root():
    """
    This is the root endpoint. It's a simple way to check if the
    application is running.
    """
    return {"message": f"Welcome to the {settings.PROJECT_NAME} API!"}
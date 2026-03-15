from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "test") # Adjust to your DB name
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    AI_REVIEW_PORT: int = 8001

    class Config:
        env_file = ".env"

settings = Settings()

import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Mental Health AI"
    # Add other config vars here (DB_URL, API_KEYS, etc.)
    
    class Config:
        env_file = ".env"

settings = Settings()

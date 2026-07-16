from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise Collaboration API"
    DATABASE_URL: str = "postgresql://workspace_user:mysecretpassword@127.0.0.1:25432/workspace_ai"
    
    # Auth (Firebase)
    FIREBASE_PROJECT_ID: str = ""
    FIREBASE_SERVICE_ACCOUNT_PATH: str = ""

    # AI (Groq - legacy fallback)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Encryption
    ENCRYPTION_KEY: str = ""

    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Enterprise Collaboration API"
    DATABASE_URL: str
    
    # Auth (Firebase)
    FIREBASE_PROJECT_ID: str = ""

    # AI (Groq)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    class Config:
        env_file = ".env"

settings = Settings()

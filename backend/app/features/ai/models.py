from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.base import Base

def generate_uuid():
    return str(uuid.uuid4())

class AICredential(Base):
    __tablename__ = "ai_credentials"
    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    provider = Column(String, nullable=False)  # groq, openai, gemini, anthropic, ollama, openrouter
    model = Column(String, nullable=False)     # e.g. llama-3.3-70b-versatile
    base_url = Column(String, nullable=True)
    encrypted_secret = Column(String, nullable=False)
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=2048)
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class AIRequestLog(Base):
    __tablename__ = "ai_request_logs"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    provider = Column(String, nullable=False)
    model = Column(String, nullable=False)
    tokens = Column(Integer, default=0)
    latency_ms = Column(Integer, default=0)
    status = Column(String, nullable=False)    # success, error
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

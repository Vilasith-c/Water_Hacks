from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AICredentialBase(BaseModel):
    provider: str
    model: str
    base_url: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2048
    enabled: Optional[bool] = True

class AICredentialCreate(AICredentialBase):
    organization_id: str
    secret_key: str

class AICredentialUpdate(BaseModel):
    model: Optional[str] = None
    base_url: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    enabled: Optional[bool] = None
    secret_key: Optional[str] = None  # Optional key update

class AICredentialResponse(BaseModel):
    id: str
    organization_id: str
    provider: str
    model: str
    base_url: Optional[str] = None
    temperature: float
    max_tokens: int
    enabled: bool
    configured: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatCompletionRequest(BaseModel):
    provider: Optional[str] = None
    model: Optional[str] = None
    api_key: Optional[str] = None
    prompt: str
    system_prompt: Optional[str] = "You are a helpful, secure enterprise AI assistant."
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None

class ChatCompletionResponse(BaseModel):
    content: str
    provider: str
    model: str
    tokens: int
    latency_ms: int

class ConnectionTestRequest(BaseModel):
    provider: str
    model: str
    secret_key: str
    base_url: Optional[str] = None

class ConnectionTestResponse(BaseModel):
    status: str  # success, error
    latency_ms: int
    message: str

class ProviderMetadataResponse(BaseModel):
    name: str
    id: str
    default_model: str
    models: List[str]

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Folders ---
class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[str] = None
    organization_id: str

class FolderResponse(BaseModel):
    id: str
    name: str
    parent_id: Optional[str]
    organization_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Documents ---
class DocumentResponse(BaseModel):
    id: str
    filename: str
    content_type: str
    size_bytes: int
    folder_id: Optional[str]
    owner_id: str
    organization_id: str
    created_at: datetime

    class Config:
        from_attributes = True

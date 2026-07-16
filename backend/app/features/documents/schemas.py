from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Folders ---
class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[str] = None
    organization_id: str

class FolderUpdate(BaseModel):
    name: Optional[str] = None
    parent_id: Optional[str] = None

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
    project_id: Optional[str]
    department_id: Optional[str]
    access_level: str
    tags: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentUpdate(BaseModel):
    filename: Optional[str] = None
    folder_id: Optional[str] = None
    project_id: Optional[str] = None
    department_id: Optional[str] = None
    access_level: Optional[str] = None
    tags: Optional[str] = None

# --- Versioning ---
class DocumentVersionResponse(BaseModel):
    id: str
    document_id: str
    version_number: int
    size_bytes: int
    created_at: datetime
    created_by_id: str

    class Config:
        from_attributes = True

# --- Sharing ---
class DocumentShareCreate(BaseModel):
    user_id: Optional[str] = None
    department_id: Optional[str] = None
    role: str = "read"  # read, write

class DocumentShareResponse(BaseModel):
    id: str
    document_id: str
    user_id: Optional[str]
    department_id: Optional[str]
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.responses import FileResponse
import os

from app.db.session import get_db
from app.api.deps import get_current_user
from app.features.documents import models, schemas
from app.features.documents.storage import storage_service

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.post("/folders", response_model=schemas.FolderResponse)
def create_folder(
    folder: schemas.FolderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Verify org access here (omitted for brevity in MVP)
    new_folder = models.Folder(
        name=folder.name,
        parent_id=folder.parent_id,
        organization_id=folder.organization_id
    )
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    return new_folder

@router.get("/folders/{organization_id}", response_model=List[schemas.FolderResponse])
def get_folders(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(models.Folder).filter(models.Folder.organization_id == organization_id).all()

@router.post("/upload", response_model=schemas.DocumentResponse)
async def upload_document(
    organization_id: str = Form(...),
    folder_id: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Save physical file
    storage_key = await storage_service.upload_file(file)
    
    # Save to database
    doc = models.Document(
        filename=file.filename,
        content_type=file.content_type,
        size_bytes=file.size if hasattr(file, 'size') else 0, # Note: size may need to be read manually in older fastAPI
        folder_id=folder_id,
        owner_id=current_user.get("sub"), # Clerk user id
        organization_id=organization_id,
        storage_key=storage_key
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.get("/{document_id}/download")
def download_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    file_path = storage_service.get_file_path(doc.storage_key)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Physical file missing")
        
    return FileResponse(path=file_path, filename=doc.filename)

@router.get("/org/{organization_id}", response_model=List[schemas.DocumentResponse])
def get_documents(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(models.Document).filter(models.Document.organization_id == organization_id).all()

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.responses import FileResponse
import os

from app.db.session import get_db
from app.api.deps import get_current_user, require_permission
from app.core.permissions import PolicyEngine
from app.features.documents import models, schemas
from app.features.documents.storage import storage_service
from app.features.audit.service import AuditService

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/folders", response_model=schemas.FolderResponse)
def create_folder(
    folder: schemas.FolderCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_folder = models.Folder(
        name=folder.name,
        parent_id=folder.parent_id,
        organization_id=folder.organization_id
    )
    db.add(new_folder)
    db.commit()
    db.refresh(new_folder)
    
    user_id = current_user.get("sub") if isinstance(current_user, dict) else None
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Create Folder",
        resource=new_folder.name,
        resource_id=new_folder.id,
        details={"organization_id": folder.organization_id},
        request=request
    )
    
    return new_folder

@router.get("/folders/{organization_id}", response_model=List[schemas.FolderResponse])
def get_folders(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(models.Folder).filter(models.Folder.organization_id == organization_id).all()

@router.put("/folders/{folder_id}", response_model=schemas.FolderResponse)
def update_folder(
    folder_id: str,
    folder_in: schemas.FolderUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    folder = db.query(models.Folder).filter(models.Folder.id == folder_id).first()
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    
    if folder_in.name is not None:
        folder.name = folder_in.name
    if folder_in.parent_id is not None:
        folder.parent_id = folder_in.parent_id
        
    db.commit()
    db.refresh(folder)
    
    user_id = current_user.get("sub") if isinstance(current_user, dict) else None
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Update Folder",
        resource=folder.name,
        resource_id=folder.id,
        details={"name": folder_in.name, "parent_id": folder_in.parent_id},
        request=request
    )
    
    return folder

@router.delete("/folders/{folder_id}")
def delete_folder(
    folder_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    folder = db.query(models.Folder).filter(models.Folder.id == folder_id).first()
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
        
    user_id = current_user.get("sub") if isinstance(current_user, dict) else None
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Delete Folder",
        resource=folder.name,
        resource_id=folder.id,
        request=request
    )
    
    db.delete(folder)
    db.commit()
    return {"message": "Folder deleted successfully"}

@router.post("/upload", response_model=schemas.DocumentResponse)
async def upload_document(
    request: Request,
    organization_id: str = Form(...),
    folder_id: Optional[str] = Form(None),
    project_id: Optional[str] = Form(None),
    department_id: Optional[str] = Form(None),
    access_level: str = Form("internal"),
    tags: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    storage_key = await storage_service.upload_file(file)
    size_bytes = file.size if hasattr(file, 'size') else 0
    
    # Save base document
    doc = models.Document(
        filename=file.filename,
        content_type=file.content_type,
        size_bytes=size_bytes,
        folder_id=folder_id,
        owner_id=user_id,
        organization_id=organization_id,
        project_id=project_id,
        department_id=department_id,
        access_level=access_level,
        tags=tags,
        storage_key=storage_key
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    # Register Version 1
    version = models.DocumentVersion(
        document_id=doc.id,
        version_number=1,
        storage_key=storage_key,
        size_bytes=size_bytes,
        created_by_id=user_id
    )
    db.add(version)
    db.commit()
    
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Upload Document",
        resource=doc.filename,
        resource_id=doc.id,
        details={"organization_id": organization_id, "size_bytes": size_bytes},
        request=request
    )
    
    return doc

@router.post("/{document_id}/version", response_model=schemas.DocumentResponse)
async def upload_new_version(
    document_id: str,
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Get next version number
    last_version = db.query(models.DocumentVersion)\
        .filter(models.DocumentVersion.document_id == document_id)\
        .order_by(models.DocumentVersion.version_number.desc()).first()
    
    next_ver_num = (last_version.version_number + 1) if last_version else 1
    
    storage_key = await storage_service.upload_file(file)
    size_bytes = file.size if hasattr(file, 'size') else 0
    
    # Create new version record
    version = models.DocumentVersion(
        document_id=document_id,
        version_number=next_ver_num,
        storage_key=storage_key,
        size_bytes=size_bytes,
        created_by_id=user_id
    )
    db.add(version)
    
    # Update main active pointer
    doc.storage_key = storage_key
    doc.size_bytes = size_bytes
    doc.filename = file.filename
    doc.content_type = file.content_type
    
    db.commit()
    db.refresh(doc)
    
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Upload New Version",
        resource=doc.filename,
        resource_id=doc.id,
        details={"version_number": next_ver_num, "size_bytes": size_bytes},
        request=request
    )
    
    return doc

@router.get("/{document_id}/versions", response_model=List[schemas.DocumentVersionResponse])
def get_versions(
    document_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(models.DocumentVersion)\
        .filter(models.DocumentVersion.document_id == document_id)\
        .order_by(models.DocumentVersion.version_number.desc()).all()

@router.post("/{document_id}/versions/{version_id}/restore", response_model=schemas.DocumentResponse)
def restore_version(
    document_id: str,
    version_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    ver = db.query(models.DocumentVersion).filter(models.DocumentVersion.id == version_id).first()
    if not doc or not ver:
        raise HTTPException(status_code=404, detail="Document or Version not found")
        
    doc.storage_key = ver.storage_key
    doc.size_bytes = ver.size_bytes
    
    db.commit()
    db.refresh(doc)
    
    user_id = current_user.get("sub") if isinstance(current_user, dict) else None
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Restore Version",
        resource=doc.filename,
        resource_id=doc.id,
        details={"version_id": version_id, "version_number": ver.version_number},
        request=request
    )
    
    return doc

@router.put("/{document_id}", response_model=schemas.DocumentResponse)
def update_document(
    document_id: str,
    doc_in: schemas.DocumentUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if doc_in.filename is not None:
        doc.filename = doc_in.filename
    if doc_in.folder_id is not None:
        doc.folder_id = doc_in.folder_id
    if doc_in.project_id is not None:
        doc.project_id = doc_in.project_id
    if doc_in.department_id is not None:
        doc.department_id = doc_in.department_id
    if doc_in.access_level is not None:
        doc.access_level = doc_in.access_level
    if doc_in.tags is not None:
        doc.tags = doc_in.tags
        
    db.commit()
    db.refresh(doc)
    
    user_id = current_user.get("sub") if isinstance(current_user, dict) else None
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Update Document Metadata",
        resource=doc.filename,
        resource_id=doc.id,
        details=doc_in.model_dump(exclude_unset=True) if hasattr(doc_in, 'model_dump') else doc_in.dict(exclude_unset=True),
        request=request
    )
    
    return doc

@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    request: Request,
    db: Session = Depends(get_db),
    membership = Depends(require_permission("documents.delete"))
):
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    if not PolicyEngine.can(membership, "documents.delete", doc):
        raise HTTPException(status_code=403, detail="Not authorized to delete this document")
        
    AuditService.log_action(
        db=db,
        user_id=membership.user_id,
        action="Delete Document",
        resource=doc.filename,
        resource_id=doc.id,
        request=request
    )
    
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}

@router.get("/{document_id}/download")
def download_document(
    document_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    file_path = storage_service.get_file_path(doc.storage_key)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Physical file missing")
        
    user_id = current_user.get("sub") if isinstance(current_user, dict) else None
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Download Document",
        resource=doc.filename,
        resource_id=doc.id,
        request=request
    )
    
    return FileResponse(path=file_path, filename=doc.filename)

@router.get("/org/{organization_id}", response_model=List[schemas.DocumentResponse])
def get_documents(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(models.Document).filter(models.Document.organization_id == organization_id).all()

# --- Sharing ---
@router.post("/{document_id}/share", response_model=schemas.DocumentShareResponse)
def share_document(
    document_id: str,
    share_in: schemas.DocumentShareCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    share = models.DocumentShare(
        document_id=document_id,
        user_id=share_in.user_id,
        department_id=share_in.department_id,
        role=share_in.role
    )
    db.add(share)
    db.commit()
    db.refresh(share)
    
    user_id = current_user.get("sub") if isinstance(current_user, dict) else None
    doc = db.query(models.Document).filter(models.Document.id == document_id).first()
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Share Document",
        resource=doc.filename if doc else "Unknown",
        resource_id=document_id,
        details={"shared_with_user": share_in.user_id, "shared_with_dept": share_in.department_id, "role": share_in.role},
        request=request
    )
    
    return share

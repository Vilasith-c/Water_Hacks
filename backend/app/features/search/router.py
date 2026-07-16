from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.api.deps import get_current_user
from app.features.documents import models, schemas
from app.core.responses import success_response, StandardResponse
from pydantic import BaseModel

router = APIRouter(prefix="/search", tags=["search"])

class SearchResults(BaseModel):
    documents: List[schemas.DocumentResponse]
    folders: List[schemas.FolderResponse]

@router.get("", response_model=StandardResponse[SearchResults])
def search_workspace(
    organization_id: str,
    q: Optional[str] = Query(None),
    project_id: Optional[str] = Query(None),
    department_id: Optional[str] = Query(None),
    access_level: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    doc_query = db.query(models.Document).filter(models.Document.organization_id == organization_id)
    folder_query = db.query(models.Folder).filter(models.Folder.organization_id == organization_id)
    
    if q:
        search_pattern = f"%{q}%"
        doc_query = doc_query.filter(
            (models.Document.filename.ilike(search_pattern)) | 
            (models.Document.tags.ilike(search_pattern))
        )
        folder_query = folder_query.filter(models.Folder.name.ilike(search_pattern))
        
    if project_id:
        doc_query = doc_query.filter(models.Document.project_id == project_id)
    if department_id:
        doc_query = doc_query.filter(models.Document.department_id == department_id)
    if access_level:
        doc_query = doc_query.filter(models.Document.access_level == access_level)
        
    documents = doc_query.all()
    folders = folder_query.all()
    
    results = SearchResults(documents=documents, folders=folders)
    return success_response(data=results, message="Search queries completed successfully")

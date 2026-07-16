from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.features.projects import schemas
from app.features.projects.service import project_service
from app.core.responses import success_response, StandardResponse
from app.features.audit.service import AuditService

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("", response_model=StandardResponse[schemas.ProjectResponse])
def create_project(
    proj_in: schemas.ProjectCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = project_service.create_project(db, proj_in=proj_in)
    
    user_id = current_user.get("sub")
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Create Project",
        resource=project.name,
        resource_id=project.id,
        details={"organization_id": proj_in.organization_id},
        request=request
    )
    
    return success_response(data=project, message="Project created successfully")

@router.get("/org/{organization_id}", response_model=StandardResponse[List[schemas.ProjectResponse]])
def get_org_projects(
    organization_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    projects = project_service.get_projects_by_org(db, org_id=organization_id)
    return success_response(data=projects, message="Projects retrieved successfully")

@router.get("/{project_id}", response_model=StandardResponse[schemas.ProjectResponse])
def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = project_service.get_project_by_id(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return success_response(data=project, message="Project retrieved successfully")

@router.put("/{project_id}", response_model=StandardResponse[schemas.ProjectResponse])
def update_project(
    project_id: str,
    proj_in: schemas.ProjectUpdate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    project = project_service.get_project_by_id(db, project_id=project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    from app.features.projects.repository import project_repository
    updated_project = project_repository.update(db, db_obj=project, obj_in=proj_in)
    
    user_id = current_user.get("sub")
    AuditService.log_action(
        db=db,
        user_id=user_id,
        action="Update Project",
        resource=updated_project.name,
        resource_id=updated_project.id,
        details=proj_in.model_dump(exclude_unset=True) if hasattr(proj_in, 'model_dump') else proj_in.dict(exclude_unset=True),
        request=request
    )
    
    return success_response(data=updated_project, message="Project updated successfully")

from sqlalchemy.orm import Session
from typing import List, Optional
from app.features.projects.models import Project
from app.features.projects.repository import project_repository
from app.features.projects import schemas

class ProjectService:
    def create_project(self, db: Session, proj_in: schemas.ProjectCreate) -> Project:
        return project_repository.create(db, obj_in=proj_in)

    def get_projects_by_org(self, db: Session, org_id: str) -> List[Project]:
        return db.query(Project).filter(Project.organization_id == org_id).all()

    def get_project_by_id(self, db: Session, project_id: str) -> Optional[Project]:
        return project_repository.get(db, id=project_id)

project_service = ProjectService()

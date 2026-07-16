from app.core.repository import BaseRepository
from app.features.projects.models import Project
from app.features.projects.schemas import ProjectCreate, ProjectUpdate

class ProjectRepository(BaseRepository[Project, ProjectCreate, ProjectUpdate]):
    pass

project_repository = ProjectRepository(Project)

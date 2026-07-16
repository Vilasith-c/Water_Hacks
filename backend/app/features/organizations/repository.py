from app.core.repository import BaseRepository
from app.features.organizations.models import Organization, Membership, Department, Team
from app.features.organizations import schemas

class OrganizationRepository(BaseRepository[Organization, schemas.OrganizationCreate, schemas.OrganizationUpdate]):
    pass

class MembershipRepository(BaseRepository[Membership, schemas.MembershipCreate, schemas.MembershipUpdate]):
    pass

class DepartmentRepository(BaseRepository[Department, schemas.DepartmentCreate, schemas.DepartmentBase]):
    pass

class TeamRepository(BaseRepository[Team, schemas.TeamCreate, schemas.TeamBase]):
    pass

organization_repository = OrganizationRepository(Organization)
membership_repository = MembershipRepository(Membership)
department_repository = DepartmentRepository(Department)
team_repository = TeamRepository(Team)

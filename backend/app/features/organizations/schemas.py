from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- Organization ---
class OrganizationBase(BaseModel):
    name: str

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None

class OrganizationResponse(OrganizationBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Department ---
class DepartmentBase(BaseModel):
    name: str
    organization_id: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Team ---
class TeamBase(BaseModel):
    name: str
    department_id: str

class TeamCreate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Membership ---
class MembershipBase(BaseModel):
    user_id: str
    organization_id: str
    role: str = "employee"
    department_id: Optional[str] = None
    team_id: Optional[str] = None

class MembershipCreate(MembershipBase):
    pass

class MembershipUpdate(BaseModel):
    role: Optional[str] = None
    department_id: Optional[str] = None
    team_id: Optional[str] = None

class MembershipResponse(MembershipBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class Scope(Enum):
    ORGANIZATION = "ORGANIZATION"
    DEPARTMENT = "DEPARTMENT"
    TEAM = "TEAM"
    OWN = "OWN"
    NONE = "NONE"

class RolePermissions(BaseModel):
    role: str
    permissions: Dict[str, Scope]

class PolicyEngine:
    # Role-based permission matrix
    POLICIES = {
        "admin": {
            "documents.read": Scope.ORGANIZATION,
            "documents.delete": Scope.ORGANIZATION,
            "organization.members.read": Scope.ORGANIZATION,
            "ai.settings.read": Scope.ORGANIZATION,
        },
        "department_head": {
            "documents.read": Scope.DEPARTMENT,
            "documents.delete": Scope.DEPARTMENT,
            "organization.members.read": Scope.DEPARTMENT,
            "ai.settings.read": Scope.NONE,
        },
        "team_leader": {
            "documents.read": Scope.TEAM,
            "documents.delete": Scope.OWN,
            "organization.members.read": Scope.TEAM,
            "ai.settings.read": Scope.NONE,
        },
        "employee": {
            "documents.read": Scope.TEAM,
            "documents.delete": Scope.OWN,
            "organization.members.read": Scope.NONE,
            "ai.settings.read": Scope.NONE,
        }
    }

    @classmethod
    def can(cls, membership: Any, permission: str, resource: Any = None) -> bool:
        """
        Evaluate if a user (represented by their membership) has access to perform
        an action (permission) on a resource (optional).
        """
        if not membership:
            return False

        # Normalize role
        role = membership.role.lower() if membership.role else "employee"
        
        # Get allowed scope for this role and permission
        role_policy = cls.POLICIES.get(role, cls.POLICIES["employee"])
        allowed_scope = role_policy.get(permission, Scope.NONE)

        if allowed_scope == Scope.NONE:
            return False

        # Admin overrides
        if allowed_scope == Scope.ORGANIZATION:
            # Assumes resource is within the same organization
            if resource and hasattr(resource, "organization_id"):
                return resource.organization_id == membership.organization_id
            return True # Action allowed at org level

        # If resource is required for evaluation but not provided, fail safe
        if resource is None:
            # If scope is larger than NONE, but it's not tied to a specific resource
            # we evaluate it as True (e.g. read all own docs)
            return True

        if allowed_scope == Scope.DEPARTMENT:
            # Resource must belong to user's department
            if hasattr(resource, "department_id"):
                return resource.department_id == membership.department_id
            
            # Fallback checks if resource only has organization_id
            if hasattr(resource, "organization_id"):
                return resource.organization_id == membership.organization_id
            return False

        if allowed_scope == Scope.TEAM:
            # Resource must belong to user's team
            if hasattr(resource, "team_id"):
                return resource.team_id == membership.team_id
            return False

        if allowed_scope == Scope.OWN:
            # Resource must be owned by the user
            if hasattr(resource, "owner_id"):
                return resource.owner_id == membership.user_id
            # Fallback if field is user_id
            if hasattr(resource, "user_id"):
                return resource.user_id == membership.user_id
            return False

        return False

from sqlalchemy.orm import Session
from typing import List, Optional
from app.features.organizations.models import Organization, Membership, Department, Team
from app.features.organizations.repository import (
    organization_repository,
    membership_repository,
    department_repository,
    team_repository,
)
from app.features.organizations import schemas

class OrganizationService:
    def create_organization(self, db: Session, org_in: schemas.OrganizationCreate, creator_user_id: str) -> Organization:
        org = organization_repository.create(db, obj_in=org_in)
        # Create membership as admin for the creator
        membership_in = schemas.MembershipCreate(
            user_id=creator_user_id,
            organization_id=org.id,
            role="admin"
        )
        membership_repository.create(db, obj_in=membership_in)
        return org

    def list_user_organizations(self, db: Session, user_id: str) -> List[Organization]:
        memberships = db.query(Membership).filter(Membership.user_id == user_id).all()
        org_ids = [m.organization_id for m in memberships]
        if not org_ids:
            return []
        return db.query(Organization).filter(Organization.id.in_(org_ids)).all()

    def get_organization_members(self, db: Session, org_id: str) -> List[Membership]:
        return db.query(Membership).filter(Membership.organization_id == org_id).all()

    def add_user_to_organization(self, db: Session, org_id: str, user_id: str, role: str = "employee") -> Membership:
        membership = db.query(Membership).filter(
            Membership.organization_id == org_id,
            Membership.user_id == user_id
        ).first()
        if membership:
            return membership
        
        membership_in = schemas.MembershipCreate(
            user_id=user_id,
            organization_id=org_id,
            role=role
        )
        return membership_repository.create(db, obj_in=membership_in)

organization_service = OrganizationService()

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.features.organizations import schemas
from app.features.organizations.service import organization_service
from app.core.responses import success_response, StandardResponse
from app.features.users.models import User
from app.features.organizations.models import Membership

router = APIRouter(prefix="/organizations", tags=["organizations"])

@router.post("", response_model=StandardResponse[schemas.OrganizationResponse])
def create_org(
    org_in: schemas.OrganizationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    creator_id = current_user.get("sub")
    org = organization_service.create_organization(db, org_in=org_in, creator_user_id=creator_id)
    return success_response(data=org, message="Organization created successfully")

@router.get("", response_model=StandardResponse[List[schemas.OrganizationResponse]])
def get_my_orgs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    orgs = organization_service.list_user_organizations(db, user_id=user_id)
    return success_response(data=orgs, message="Organizations retrieved successfully")

@router.get("/{org_id}/members", response_model=StandardResponse[List[schemas.MembershipResponse]])
def get_org_members(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    members = organization_service.get_organization_members(db, org_id=org_id)
    return success_response(data=members, message="Organization members retrieved successfully")

@router.post("/{org_id}/join", response_model=StandardResponse[schemas.MembershipResponse])
def join_org(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    membership = organization_service.add_user_to_organization(db, org_id=org_id, user_id=user_id)
    return success_response(data=membership, message="Joined organization successfully")

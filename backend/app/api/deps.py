from fastapi import Depends, HTTPException
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.core.security import verify_token
from app.db.session import get_db

def get_current_user(
    token_data: Dict[str, Any] = Depends(verify_token),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns the validated JWT token payload and ensures the user exists in the DB.
    """
    if not token_data or not token_data.get("sub"):
        raise HTTPException(status_code=401, detail="Token missing subject identifier")
    
    # Auto-provision user in the database
    from app.features.users.service import user_service
    user_id = token_data.get("sub")
    email = token_data.get("email", f"{user_id}@placeholder.com")
    name = token_data.get("name", "User")
    user_service.get_or_create_user(db, user_id=user_id, email=email, full_name=name)
    
    return token_data

def require_permission(permission: str):
    def dependency(
        token_data: Dict[str, Any] = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        user_id = token_data.get("sub")
        from app.features.organizations.models import Membership
        membership = db.query(Membership).filter(Membership.user_id == user_id).first()
        
        if not membership:
            raise HTTPException(status_code=403, detail="User does not belong to any organization")
            
        from app.core.permissions import PolicyEngine, Scope
        role = membership.role.lower() if membership.role else "employee"
        allowed_scope = PolicyEngine.POLICIES.get(role, PolicyEngine.POLICIES["employee"]).get(permission, Scope.NONE)
        
        if allowed_scope == Scope.NONE:
            raise HTTPException(status_code=403, detail=f"Not authorized to perform '{permission}'")
            
        return membership
    return dependency

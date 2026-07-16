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

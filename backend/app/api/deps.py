from fastapi import Depends, HTTPException
from typing import Dict, Any
from app.core.security import verify_token

def get_current_user(token_data: Dict[str, Any] = Depends(verify_token)) -> str:
    """
    Returns the user ID (subject) from the validated JWT token.
    """
    user_id = token_data.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing subject identifier")
    return user_id

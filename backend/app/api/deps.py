from fastapi import Depends, HTTPException
from typing import Dict, Any
from app.core.security import verify_token

def get_current_user(token_data: Dict[str, Any] = Depends(verify_token)) -> Dict[str, Any]:
    """
    Returns the validated JWT token payload.
    """
    if not token_data or not token_data.get("sub"):
        raise HTTPException(status_code=401, detail="Token missing subject identifier")
    return token_data

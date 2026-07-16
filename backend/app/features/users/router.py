from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.features.users import schemas
from app.features.users.service import user_service
from app.core.responses import success_response, StandardResponse

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=StandardResponse[schemas.UserResponse])
def get_me(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    # Retrieve email/name from Clerk JWT claims if available
    email = current_user.get("email") or f"{user_id}@clerk.dev"
    name = current_user.get("name") or current_user.get("username")
    
    user = user_service.get_or_create_user(db, user_id=user_id, email=email, full_name=name)
    return success_response(data=user, message="Profile retrieved successfully")

@router.put("/me", response_model=StandardResponse[schemas.UserResponse])
def update_me(
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    user = user_service.get_user_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")
        
    from app.features.users.repository import user_repository
    updated_user = user_repository.update(db, db_obj=user, obj_in=user_in)
    return success_response(data=updated_user, message="Profile updated successfully")

from sqlalchemy.orm import Session
from typing import Optional
from app.features.users.repository import user_repository
from app.features.users.schemas import UserCreate, UserUpdate
from app.features.users.models import User

class UserService:
    def get_user_by_id(self, db: Session, user_id: str) -> Optional[User]:
        return user_repository.get(db, id=user_id)

    def get_or_create_user(self, db: Session, user_id: str, email: str, full_name: Optional[str] = None) -> User:
        user = user_repository.get(db, id=user_id)
        if not user:
            db_user = User(id=user_id, email=email, full_name=full_name)
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        
        if full_name and user.full_name != full_name:
            user_repository.update(db, db_obj=user, obj_in=UserUpdate(full_name=full_name))
        return user

user_service = UserService()

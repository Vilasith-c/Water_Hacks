from app.core.repository import BaseRepository
from app.features.users.models import User
from app.features.users.schemas import UserCreate, UserUpdate

class UserRepository(BaseRepository[User, UserCreate, UserUpdate]):
    pass

user_repository = UserRepository(User)

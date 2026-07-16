from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)  # Clerk user ID
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationship to memberships (defined in organizations)
    memberships = relationship("Membership", back_populates="user", cascade="all, delete-orphan")

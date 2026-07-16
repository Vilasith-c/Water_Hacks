from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.base import Base

def generate_uuid():
    return str(uuid.uuid4())

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    departments = relationship("Department", back_populates="organization", cascade="all, delete-orphan")
    members = relationship("Membership", back_populates="organization", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="organization", cascade="all, delete-orphan")

class Department(Base):
    __tablename__ = "departments"
    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    organization = relationship("Organization", back_populates="departments")
    teams = relationship("Team", back_populates="department", cascade="all, delete-orphan")
    members = relationship("Membership", back_populates="department")

class Team(Base):
    __tablename__ = "teams"
    id = Column(String, primary_key=True, default=generate_uuid)
    department_id = Column(String, ForeignKey("departments.id"), nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    department = relationship("Department", back_populates="teams")
    members = relationship("Membership", back_populates="team")

class Membership(Base):
    __tablename__ = "memberships"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    team_id = Column(String, ForeignKey("teams.id"), nullable=True)
    role = Column(String, default="employee")  # e.g., admin, manager, employee
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="memberships")
    organization = relationship("Organization", back_populates="members")
    department = relationship("Department", back_populates="members")
    team = relationship("Team", back_populates="members")

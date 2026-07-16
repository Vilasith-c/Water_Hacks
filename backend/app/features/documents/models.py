from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from app.db.base import Base

def generate_uuid():
    return str(uuid.uuid4())

class Folder(Base):
    __tablename__ = "folders"
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey("folders.id"), nullable=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    parent = relationship("Folder", remote_side=[id], back_populates="children")
    children = relationship("Folder", back_populates="parent", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="folder", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    id = Column(String, primary_key=True, default=generate_uuid)
    filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    size_bytes = Column(Integer, default=0)
    
    folder_id = Column(String, ForeignKey("folders.id"), nullable=True)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=False)
    
    # Metadata
    project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    access_level = Column(String, default="internal")  # public, internal, restricted
    tags = Column(String, nullable=True)  # comma separated e.g. "hr,policy,draft"

    storage_key = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    folder = relationship("Folder", back_populates="documents")
    project = relationship("Project")
    department = relationship("Department")
    versions = relationship("DocumentVersion", back_populates="document", cascade="all, delete-orphan")
    shares = relationship("DocumentShare", back_populates="document", cascade="all, delete-orphan")

class DocumentVersion(Base):
    __tablename__ = "document_versions"
    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    storage_key = Column(String, nullable=False)
    size_bytes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_by_id = Column(String, ForeignKey("users.id"), nullable=False)

    document = relationship("Document", back_populates="versions")
    creator = relationship("User")

class DocumentShare(Base):
    __tablename__ = "document_shares"
    id = Column(String, primary_key=True, default=generate_uuid)
    document_id = Column(String, ForeignKey("documents.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    department_id = Column(String, ForeignKey("departments.id"), nullable=True)
    role = Column(String, default="read")  # read, write
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    document = relationship("Document", back_populates="shares")
    user = relationship("User")
    department = relationship("Department")

from sqlalchemy import Column, String, DateTime, JSON
from datetime import datetime, timezone
import uuid
import hashlib
from app.db.base import Base

def generate_uuid():
    return str(uuid.uuid4())

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, index=True, nullable=True)
    action = Column(String, nullable=False, index=True)
    resource = Column(String, nullable=False)
    resource_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Tamper-evident hash chain
    previous_hash = Column(String, nullable=False)
    current_hash = Column(String, nullable=False)
    
    def compute_hash(self):
        data = f"{self.id}{self.user_id}{self.action}{self.resource}{self.resource_id}{self.previous_hash}"
        return hashlib.sha256(data.encode()).hexdigest()

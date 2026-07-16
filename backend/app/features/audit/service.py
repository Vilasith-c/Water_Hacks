from sqlalchemy.orm import Session
from app.features.audit.models import AuditLog
from fastapi import Request

class AuditService:
    @staticmethod
    def log_action(
        db: Session, 
        user_id: str, 
        action: str, 
        resource: str, 
        resource_id: str = None, 
        details: dict = None, 
        request: Request = None
    ):
        ip_address = request.client.host if request and request.client else None
        
        # Get the previous hash for the hash chain
        last_log = db.query(AuditLog).order_by(AuditLog.created_at.desc()).first()
        previous_hash = last_log.current_hash if last_log else "0000000000000000000000000000000000000000000000000000000000000000"
        
        new_log = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=details,
            ip_address=ip_address,
            previous_hash=previous_hash
        )
        
        # Compute the current hash
        new_log.current_hash = new_log.compute_hash()
        
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log

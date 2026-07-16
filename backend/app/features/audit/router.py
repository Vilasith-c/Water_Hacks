from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_current_user, get_db
from app.features.audit.models import AuditLog
from app.features.users.models import User
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/audit", tags=["Audit Logs"])

class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str]
    user_name: Optional[str]
    action: str
    resource: str
    resource_id: Optional[str]
    details: Optional[dict]
    ip_address: Optional[str]
    created_at: datetime
    previous_hash: str
    current_hash: str

    class Config:
        from_attributes = True

@router.get("/logs", response_model=List[AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        results = db.query(AuditLog, User.full_name, User.email).outerjoin(User, AuditLog.user_id == User.id).order_by(AuditLog.created_at.desc()).limit(100).all()
        logs = []
        for audit_log, full_name, email in results:
            display_name = full_name or email or audit_log.user_id or "System"
            logs.append({
                "id": audit_log.id,
                "user_id": audit_log.user_id,
                "user_name": display_name,
                "action": audit_log.action,
                "resource": audit_log.resource,
                "resource_id": audit_log.resource_id,
                "details": audit_log.details,
                "ip_address": audit_log.ip_address,
                "created_at": audit_log.created_at,
                "previous_hash": audit_log.previous_hash,
                "current_hash": audit_log.current_hash
            })
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

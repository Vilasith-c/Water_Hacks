import time
import json
import os
from fastapi import APIRouter, Depends, HTTPException, Header, Request, Query as QueryParam
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.deps import get_current_user
from app.db.session import get_db
from app.features.ai import schemas, service
from app.features.audit.service import AuditService

router = APIRouter(tags=["AI Gateway"])

@router.post("/credentials", response_model=schemas.AICredentialResponse)
def save_credentials(
    credential_in: schemas.AICredentialCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        cred = service.save_credentials(
            db=db,
            org_id=credential_in.organization_id,
            provider=credential_in.provider,
            model=credential_in.model,
            secret_key=credential_in.secret_key,
            base_url=credential_in.base_url,
            temperature=credential_in.temperature,
            max_tokens=credential_in.max_tokens,
            enabled=credential_in.enabled
        )
        return schemas.AICredentialResponse(
            id=cred.id,
            organization_id=cred.organization_id,
            provider=cred.provider,
            model=cred.model,
            base_url=cred.base_url,
            temperature=cred.temperature,
            max_tokens=cred.max_tokens,
            enabled=cred.enabled,
            configured=True,
            created_at=cred.created_at,
            updated_at=cred.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/credentials/org/{org_id}", response_model=List[schemas.AICredentialResponse])
def get_credentials(
    org_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    creds = service.get_credentials(db, org_id)
    res = []
    for cred in creds:
        res.append(
            schemas.AICredentialResponse(
                id=cred.id,
                organization_id=cred.organization_id,
                provider=cred.provider,
                model=cred.model,
                base_url=cred.base_url,
                temperature=cred.temperature,
                max_tokens=cred.max_tokens,
                enabled=cred.enabled,
                configured=True,
                created_at=cred.created_at,
                updated_at=cred.updated_at
            )
        )
    return res

@router.post("/test", response_model=schemas.ConnectionTestResponse)
def test_connection(
    request: schemas.ConnectionTestRequest
):
    start_time = time.time()
    try:
        from app.features.ai.factory import AIFactory
        strategy = AIFactory.get_provider(request.provider)
        # Minimal fast check prompt
        test_prompt = "Hello. Respond with one word: 'OK'."
        strategy.generate(
            prompt=test_prompt,
            model=request.model,
            api_key=request.secret_key,
            base_url=request.base_url,
            temperature=0.1,
            max_tokens=5
        )
        latency = int((time.time() - start_time) * 1000)
        return schemas.ConnectionTestResponse(
            status="success",
            latency_ms=latency,
            message="Connection verified successfully."
        )
    except Exception as e:
        latency = int((time.time() - start_time) * 1000)
        return schemas.ConnectionTestResponse(
            status="error",
            latency_ms=latency,
            message=f"Connection failed: {str(e)}"
        )

@router.get("/providers", response_model=List[schemas.ProviderMetadataResponse])
def list_providers():
    try:
        p_path = os.path.join(os.path.dirname(__file__), "providers.json")
        with open(p_path, "r") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load providers metadata: {str(e)}")

@router.post("/chat", response_model=schemas.ChatCompletionResponse)
def chat_completion(
    request: schemas.ChatCompletionRequest,
    req_obj: Request,
    organization_id: str = QueryParam(..., description="Organization ID for AI credential lookup"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("sub")
    
    try:
        res = service.execute_chat_completion(
            db=db,
            user_id=user_id,
            org_id=organization_id,
            prompt=request.prompt,
            system_prompt=request.system_prompt,
            provider=request.provider,
            model=request.model,
            header_key=request.api_key,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        AuditService.log_action(
            db=db,
            user_id=user_id,
            action="AI Assistant Query",
            resource=request.prompt[:100],  # Use prompt summary as resource
            details={"provider": res.get("provider"), "model": res.get("model")},
            request=req_obj
        )
        
        return res
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

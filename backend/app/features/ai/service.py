import time
import json
import os
from sqlalchemy.orm import Session
from app.features.ai.models import AICredential, AIRequestLog
from app.features.ai.encryption import encrypt_secret, decrypt_secret
from app.features.ai.factory import AIFactory

def save_credentials(
    db: Session, 
    org_id: str, 
    provider: str, 
    model: str, 
    secret_key: str, 
    base_url: str = None, 
    temperature: float = 0.7, 
    max_tokens: int = 2048, 
    enabled: bool = True
):
    encrypted = encrypt_secret(secret_key)
    
    cred = db.query(AICredential).filter(
        AICredential.organization_id == org_id, 
        AICredential.provider == provider
    ).first()
    
    if cred:
        cred.model = model
        cred.base_url = base_url
        cred.encrypted_secret = encrypted
        cred.temperature = temperature
        cred.max_tokens = max_tokens
        cred.enabled = enabled
    else:
        cred = AICredential(
            organization_id=org_id,
            provider=provider,
            model=model,
            base_url=base_url,
            encrypted_secret=encrypted,
            temperature=temperature,
            max_tokens=max_tokens,
            enabled=enabled
        )
        db.add(cred)
    db.commit()
    db.refresh(cred)
    return cred

def get_credentials(db: Session, org_id: str):
    return db.query(AICredential).filter(AICredential.organization_id == org_id).all()

def execute_chat_completion(
    db: Session,
    user_id: str,
    org_id: str,
    prompt: str,
    system_prompt: str = None,
    provider: str = None,
    model: str = None,
    header_key: str = None,
    temperature: float = None,
    max_tokens: int = None
):
    final_key = header_key
    final_provider = provider
    final_model = model
    final_base_url = None
    final_temp = temperature if temperature is not None else 0.7
    final_max = max_tokens if max_tokens is not None else 2048
    
    if not final_key:
        # Stateful DB loading
        if not final_provider:
            cred = db.query(AICredential).filter(
                AICredential.organization_id == org_id, 
                AICredential.enabled == True
            ).first()
        else:
            cred = db.query(AICredential).filter(
                AICredential.organization_id == org_id, 
                AICredential.provider == final_provider
            ).first()
            
        if not cred:
            raise Exception("No AI provider credentials configured for this organization.")
            
        final_provider = cred.provider
        final_model = model or cred.model
        final_base_url = cred.base_url
        final_key = decrypt_secret(cred.encrypted_secret)
        if temperature is None:
            final_temp = cred.temperature
        if max_tokens is None:
            final_max = cred.max_tokens

    if not final_key:
        raise Exception("AI API Key / Secret is missing or unconfigured.")
        
    if not final_provider:
        raise Exception("AI Provider must be specified.")
        
    if not final_model:
        # Resolve default model
        try:
            p_path = os.path.join(os.path.dirname(__file__), "providers.json")
            with open(p_path, "r") as f:
                provs = json.load(f)
                for p in provs:
                    if p["id"] == final_provider:
                        final_model = p["default_model"]
                        break
        except Exception:
            pass
        if not final_model:
            final_model = "llama-3.3-70b-versatile"
            
    strategy = AIFactory.get_provider(final_provider)
    
    start_time = time.time()
    status = "success"
    tokens_used = 0
    content = ""
    
    try:
        res = strategy.generate(
            prompt=prompt,
            model=final_model,
            api_key=final_key,
            base_url=final_base_url,
            temperature=final_temp,
            max_tokens=final_max,
            system_prompt=system_prompt
        )
        content = res.get("content", "")
        tokens_used = res.get("tokens", 0)
    except Exception as e:
        status = "error"
        content = f"Execution Error: {str(e)}"
        raise e
    finally:
        latency = int((time.time() - start_time) * 1000)
        log_entry = AIRequestLog(
            user_id=user_id,
            organization_id=org_id,
            provider=final_provider,
            model=final_model,
            tokens=tokens_used,
            latency_ms=latency,
            status=status
        )
        db.add(log_entry)
        db.commit()
        
    return {
        "content": content,
        "provider": final_provider,
        "model": final_model,
        "tokens": tokens_used,
        "latency_ms": latency
    }

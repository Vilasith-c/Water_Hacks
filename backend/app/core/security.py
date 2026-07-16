import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security = HTTPBearer()
jwks_client = None
if settings.CLERK_JWKS_URL:
    jwks_client = jwt.PyJWKClient(settings.CLERK_JWKS_URL)

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    if not jwks_client:
        raise HTTPException(status_code=500, detail="Clerk JWKS URL is not configured")
        
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # In MVP, we might skip audience/issuer validation if not strictly configured
        decode_kwargs = {"algorithms": ["RS256"]}
        if settings.CLERK_AUDIENCE:
            decode_kwargs["audience"] = settings.CLERK_AUDIENCE
        if settings.CLERK_ISSUER:
            decode_kwargs["issuer"] = settings.CLERK_ISSUER
            
        data = jwt.decode(token, signing_key.key, **decode_kwargs)
        return data
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

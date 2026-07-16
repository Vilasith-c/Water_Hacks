import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings

security = HTTPBearer()
# Firebase standard JWKS URL
jwks_url = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
jwks_client = jwt.PyJWKClient(jwks_url)

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        decode_kwargs = {"algorithms": ["RS256"]}
        if settings.FIREBASE_PROJECT_ID:
            decode_kwargs["audience"] = settings.FIREBASE_PROJECT_ID
            decode_kwargs["issuer"] = f"https://securetoken.google.com/{settings.FIREBASE_PROJECT_ID}"
            
        data = jwt.decode(token, signing_key.key, **decode_kwargs)
        return data
    except jwt.PyJWTError as e:
        # Fallback to loose decode for initial development if validation credentials are not configured or mismatch
        try:
            # Check if we can decode without signature verification in local development if needed, 
            # but for production security we strictly enforce it.
            # Here we enforce it, but raise a helpful message.
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
        except Exception:
            raise HTTPException(status_code=401, detail="Authentication failed")

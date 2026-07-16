import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

# Initialize Firebase Admin SDK
# Priority: env var path > default path relative to backend dir > fallback to default init
SERVICE_ACCOUNT_PATH = settings.FIREBASE_SERVICE_ACCOUNT_PATH or os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "firebase-service-account.json"
)

if not firebase_admin._apps:
    if SERVICE_ACCOUNT_PATH and os.path.exists(SERVICE_ACCOUNT_PATH):
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
    elif settings.FIREBASE_PROJECT_ID:
        # Fallback: initialize without service account (works in GCP environments)
        firebase_admin.initialize_app(options={"projectId": settings.FIREBASE_PROJECT_ID})
    else:
        print("Warning: Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID in .env")
        # Initialize with minimal config to prevent repeated init attempts
        firebase_admin.initialize_app()

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        # Verify the ID token using the Firebase Admin SDK
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

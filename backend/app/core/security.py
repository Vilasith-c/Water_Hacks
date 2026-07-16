import os
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from app.core.config import settings

# Initialize Firebase Admin SDK
# Provide path to the downloaded service account key
SERVICE_ACCOUNT_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "nexora-77b99-firebase-adminsdk-fbsvc-50e41b2579.json")

if not firebase_admin._apps:
    if os.path.exists(SERVICE_ACCOUNT_PATH):
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
        firebase_admin.initialize_app(cred)
    else:
        print(f"Warning: Firebase service account not found at {SERVICE_ACCOUNT_PATH}")
        # Optionally fallback to default initialization if running in GCP environment
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

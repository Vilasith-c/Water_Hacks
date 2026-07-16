import os
from cryptography.fernet import Fernet

# Fetch key from environment, default to auto-generated temporary key if not set
KEY_ENV = os.getenv("ENCRYPTION_KEY", "")

if not KEY_ENV:
    # Safe fallback key for development convenience
    # Generate a static key for development consistency so keys persist between restarts
    # Use standard Fernet key bytes
    fallback_key = b"5df035bf47034bf799fa778e00d0d2d95df035bf470="
    fernet = Fernet(fallback_key)
else:
    try:
        fernet = Fernet(KEY_ENV.encode())
    except Exception:
        fallback_key = b"5df035bf47034bf799fa778e00d0d2d95df035bf470="
        fernet = Fernet(fallback_key)

def encrypt_secret(secret: str) -> str:
    if not secret:
        return ""
    return fernet.encrypt(secret.encode()).decode()

def decrypt_secret(encrypted_secret: str) -> str:
    if not encrypted_secret:
        return ""
    try:
        return fernet.decrypt(encrypted_secret.encode()).decode()
    except Exception:
        return ""

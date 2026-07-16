from cryptography.fernet import Fernet
from app.core.config import settings

# Use ENCRYPTION_KEY from environment/settings, fallback to a dev-only key
KEY_ENV = settings.ENCRYPTION_KEY

if KEY_ENV:
    try:
        fernet = Fernet(KEY_ENV.encode())
    except Exception:
        # If the provided key is invalid, generate a new one and warn
        print("Warning: Invalid ENCRYPTION_KEY, using auto-generated key. Existing encrypted data will be unreadable.")
        fernet = Fernet(Fernet.generate_key())
else:
    # Development fallback - generate a consistent key
    # WARNING: In production, always set ENCRYPTION_KEY in .env
    _dev_key = Fernet.generate_key()
    fernet = Fernet(_dev_key)
    print(f"Warning: No ENCRYPTION_KEY set. Using auto-generated key. Set ENCRYPTION_KEY in .env for persistence.")

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

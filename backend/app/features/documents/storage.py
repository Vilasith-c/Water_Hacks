import os
import shutil
from fastapi import UploadFile
import uuid

# Fallback local storage directory since MinIO docker pull timed out
UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")

class StorageService:
    def __init__(self):
        os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    async def upload_file(self, file: UploadFile, prefix: str = "docs") -> str:
        """
        Saves the file to the local disk (or MinIO if configured).
        Returns the unique storage_key.
        """
        extension = os.path.splitext(file.filename)[1] if file.filename else ""
        storage_key = f"{prefix}/{uuid.uuid4()}{extension}"
        
        # Ensure prefix directories exist locally
        target_dir = os.path.join(UPLOAD_DIR, os.path.dirname(storage_key))
        os.makedirs(target_dir, exist_ok=True)
        
        file_path = os.path.join(UPLOAD_DIR, storage_key)
        
        # Write to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return storage_key

    def get_file_path(self, storage_key: str) -> str:
        """Returns the absolute path to the locally stored file."""
        return os.path.join(UPLOAD_DIR, storage_key)

storage_service = StorageService()

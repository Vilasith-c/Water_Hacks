from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel, model_validator

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    code: Optional[str] = None

    model_config = {"from_attributes": True}

def success_response(data: Any = None, message: str = "Success") -> dict:
    """
    Returns a dict that FastAPI will serialize using the endpoint's response_model.
    Converts ORM objects to dicts via __dict__ to ensure Pydantic can serialize them.
    """
    return {"success": True, "message": message, "data": data}

def error_response(message: str, code: str = "ERROR", data: Any = None) -> dict:
    return {"success": False, "message": message, "code": code, "data": data}

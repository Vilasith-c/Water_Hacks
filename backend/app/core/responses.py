from typing import Any, Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    code: Optional[str] = None

def success_response(data: Any = None, message: str = "Success") -> StandardResponse:
    return StandardResponse(success=True, message=message, data=data)

def error_response(message: str, code: str = "ERROR", data: Any = None) -> StandardResponse:
    return StandardResponse(success=False, message=message, code=code, data=data)

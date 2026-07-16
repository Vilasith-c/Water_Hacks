import pytest
from fastapi.testclient import TestClient
from main import app
from app.api.deps import get_current_user

# Mock authentication
async def mock_get_current_user():
    return {"sub": "test_user_id", "email": "test@example.com"}

app.dependency_overrides[get_current_user] = mock_get_current_user

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Enterprise Collaboration API v1"}

def test_ai_providers():
    response = client.get("/api/v1/ai/providers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_user_me():
    response = client.get("/api/v1/users/me")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "test_user_id"

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.features.users import models as user_models
from app.features.organizations import models as org_models
from app.features.projects import models as project_models
from app.features.documents import models as doc_models
from app.features.audit import models as audit_models
from app.features.documents import router as doc_router
from app.db.session import engine

# Ensure all models are imported before creating tables
user_models.Base.metadata.create_all(bind=engine)
org_models.Base.metadata.create_all(bind=engine)
project_models.Base.metadata.create_all(bind=engine)
doc_models.Base.metadata.create_all(bind=engine)
audit_models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Enterprise Collaboration API",
    description="Backend API for AI-Powered Enterprise Collaboration Platform",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

from fastapi import APIRouter
from app.features.users import router as users_router
from app.features.organizations import router as org_router
from app.features.projects import router as projects_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(doc_router.router)
api_v1_router.include_router(users_router.router)
api_v1_router.include_router(org_router.router)
api_v1_router.include_router(projects_router.router)

app.include_router(api_v1_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Enterprise Collaboration API v1"}


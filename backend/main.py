from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.features.users import models as user_models
from app.features.organizations import models as org_models
from app.features.projects import models as project_models
from app.features.documents import models as doc_models
from app.features.audit import models as audit_models
from app.features.ai import models as ai_models
from app.db.session import engine
from app.core.config import settings

user_models.Base.metadata.create_all(bind=engine)
org_models.Base.metadata.create_all(bind=engine)
project_models.Base.metadata.create_all(bind=engine)
doc_models.Base.metadata.create_all(bind=engine)
audit_models.Base.metadata.create_all(bind=engine)
ai_models.Base.metadata.create_all(bind=engine)

# Auto-initialize extensions and seed default workspaces
from sqlalchemy import text
from app.db.session import SessionLocal

db = SessionLocal()
try:
    # 1. Enable pgvector extension
    try:
        db.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        db.commit()
    except Exception as ve:
        print(f"Warning: Could not create pgvector extension: {ve}")
        db.rollback()
    
    # 2. Seed default organizations
    for org_id, org_name in [("org_default_test_id", "Enterprise Workspace"), ("org_alternate_test_id", "Alternate Workspace")]:
        result = db.execute(text("SELECT id FROM organizations WHERE id = :id"), {"id": org_id}).fetchone()
        if not result:
            db.execute(
                text("INSERT INTO organizations (id, name, created_at) VALUES (:id, :name, NOW())"),
                {"id": org_id, "name": org_name}
            )
            db.commit()

    # 3. Seed default departments
    departments = ["Marketing", "HR", "Finance", "Engineering", "Operations", "Legal"]
    for dept in departments:
        result = db.execute(
            text("SELECT id FROM departments WHERE id = :id"),
            {"id": dept}
        ).fetchone()
        if not result:
            db.execute(
                text("INSERT INTO departments (id, organization_id, name, created_at) VALUES (:id, :org_id, :name, NOW())"),
                {"id": dept, "org_id": "org_default_test_id", "name": dept}
            )
            db.commit()
except Exception as e:
    print(f"Error initializing/seeding database: {e}")
finally:
    db.close()


app = FastAPI(
    title="Enterprise Collaboration API",
    description="Backend API for AI-Powered Enterprise Collaboration Platform",
    version="1.0.0",
)

@app.on_event("startup")
def seed_default_org():
    from app.db.session import SessionLocal
    from app.features.organizations.models import Organization
    db = SessionLocal()
    try:
        org = db.query(Organization).filter(Organization.id == "org_default_test_id").first()
        if not org:
            org = Organization(id="org_default_test_id", name="Default Organization")
            db.add(org)
            db.commit()
    except Exception as e:
        print("Failed to seed default org:", e)
    finally:
        db.close()

# Configure CORS with configurable origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https://.*\.ngrok-free\.(app|dev)",
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
from app.features.documents import router as doc_router
from app.features.search import router as search_router
from app.features.ai import router as ai_router
from app.features.audit import router as audit_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(doc_router.router)
api_v1_router.include_router(users_router.router)
api_v1_router.include_router(org_router.router)
api_v1_router.include_router(projects_router.router)
api_v1_router.include_router(search_router.router)
api_v1_router.include_router(ai_router.router, prefix="/ai")
api_v1_router.include_router(audit_router.router)

app.include_router(api_v1_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Enterprise Collaboration API v1"}

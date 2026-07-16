from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.features.auth import models as auth_models
from app.features.audit import models as audit_models
from app.features.documents import models as doc_models
from app.features.documents import router as doc_router
from app.db.session import engine

# Ensure all models are imported before creating tables
auth_models.Base.metadata.create_all(bind=engine)
audit_models.Base.metadata.create_all(bind=engine)
doc_models.Base.metadata.create_all(bind=engine)

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

app.include_router(doc_router.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Enterprise Collaboration API"}


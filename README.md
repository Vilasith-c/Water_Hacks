<div align="center">

![NEXORA Banner](./frontend/public/docs/hero-banner.png)

# NEXORA

### Secure Document Intelligence for Enterprise Teams

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg?style=for-the-badge)](LICENSE)

*One workspace for projects, policy documents, AI answers, and audit-ready collaboration.*

[Access Workspace](#installation--deployment) · [View Features](#features) · [API Docs](#api-reference) · [Architecture](#system-architecture)

</div>

---

## Features

| Feature | Description |
|---------|-------------|
| 🔐 **Firebase Authentication** | Email/password and Google OAuth sign-in with secure JWT token verification via Firebase Admin SDK |
| 🏢 **Organization Management** | Create and manage organizations, departments, and team members with hierarchical structure |
| 📁 **Document Management** | Upload, organize, version, share, and download documents with nested folder support |
| 🤖 **AI Gateway (BYOK)** | Bring Your Own Key — connect **Groq, OpenAI, Gemini, Anthropic, Ollama, or OpenRouter** with encrypted credential storage |
| 🔍 **Enterprise Search** | Search documents, folders, and projects with department and access-level filters |
| 🛡️ **Immutable Audit Logs** | Tamper-evident SHA-256 hash chain tracks every action for enterprise compliance |
| 📊 **Enterprise Dashboard** | Real-time stats, recent activity timeline, and AI permission recommendations |
| 🗂️ **Project Workspaces** | Organize documents and collaboration within scoped project contexts |
| 📝 **Version History** | Full document versioning with one-click rollback to any previous version |
| 🔗 **Document Sharing** | Share documents with specific users or departments with role-based permissions |

---

## Application Screenshots

### Enterprise Dashboard

The centralized hub displays live statistics, recent activity with hash-chain audit references, and AI-powered permission recommendations.

![Enterprise Dashboard](./frontend/public/docs/dashboard.png)

### Document Management

Upload, organize, and manage documents with metadata tagging (project, department, access level, tags) and nested folder navigation.

![Document Management](./frontend/public/docs/documents.png)

### AI Document Assistant

Enterprise AI Gateway with stateless/stateful BYOK support — query your documents using any connected LLM provider.

![AI Document Assistant](./frontend/public/docs/ai-assistant.png)

### Secure Authentication

Firebase-powered sign-in with email/password and Google OAuth, featuring a premium dark-mode UI.

![Sign In](./frontend/public/docs/sign-in.png)

---

## System Architecture

```mermaid
graph TB
    subgraph Client["Frontend — Next.js 16 / React 19"]
        LP[Landing Page]
        AUTH[Sign In / Sign Up]
        DASH[Dashboard]
        DOCS[Document Manager]
        AI_CHAT[AI Assistant]
        SEARCH[Enterprise Search]
        PROJ[Project Manager]
    end

    subgraph Server["Backend — FastAPI"]
        API[API Router v1]
        AUTH_SVC[Firebase Auth Verification]
        DOC_SVC[Document Service]
        AI_SVC[AI Gateway Service]
        AUDIT_SVC[Audit Hash Chain]
        SEARCH_SVC[Search Service]
    end

    subgraph Data["Data Layer"]
        PG[(PostgreSQL + pgvector)]
        REDIS[(Redis Cache)]
        MINIO[(MinIO Object Storage)]
    end

    subgraph Providers["AI Providers"]
        GROQ[Groq]
        OPENAI[OpenAI]
        GEMINI[Gemini]
        ANTHROPIC[Anthropic]
        OLLAMA[Ollama]
        OPENROUTER[OpenRouter]
    end

    subgraph External["External Services"]
        FB[Firebase Auth]
    end

    Client -->|REST API| API
    AUTH -->|ID Token| FB
    API --> AUTH_SVC --> FB
    API --> DOC_SVC --> MINIO
    API --> AI_SVC --> Providers
    API --> AUDIT_SVC
    API --> SEARCH_SVC
    DOC_SVC --> PG
    AI_SVC --> PG
    AUDIT_SVC --> PG
    SEARCH_SVC --> PG

    style Client fill:#1a1a2e,stroke:#CD9D39,color:#fff
    style Server fill:#1a1a2e,stroke:#0891b2,color:#fff
    style Data fill:#1a1a2e,stroke:#3b82f6,color:#fff
    style Providers fill:#1a1a2e,stroke:#8b5cf6,color:#fff
    style External fill:#1a1a2e,stroke:#f59e0b,color:#fff
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org/) | 16 | React framework with App Router |
| [React](https://react.dev/) | 19 | UI component library |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | 4 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations and transitions |
| [TanStack Query](https://tanstack.com/query) | 5 | Async state management |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | 7 / 4 | Form handling and validation |
| [Lucide React](https://lucide.dev/) | — | Icon library |
| [Firebase SDK](https://firebase.google.com/) | 12 | Client-side authentication |

### Backend

| Technology | Purpose |
|-----------|---------|
| [FastAPI](https://fastapi.tiangolo.com/) | High-performance async API framework |
| [SQLAlchemy](https://www.sqlalchemy.org/) | ORM and database toolkit |
| [Pydantic](https://docs.pydantic.dev/) | Data validation and serialization |
| [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) | Server-side JWT verification |
| [pgvector](https://github.com/pgvector/pgvector) | Vector similarity search extension |
| [MinIO](https://min.io/) | S3-compatible object storage |
| [Cryptography (Fernet)](https://cryptography.io/) | AES-128 encryption for API keys |
| [Alembic](https://alembic.sqlalchemy.org/) | Database migrations |

### Infrastructure

| Service | Purpose |
|---------|---------|
| PostgreSQL + pgvector | Relational database with vector search |
| Redis | Caching and session management |
| MinIO | S3-compatible file storage |
| pgAdmin | Database administration UI |
| Docker Compose | Container orchestration |

---

## Project Structure

```text
workspace-ai/
├── frontend/                   # Next.js 16 application
│   ├── src/
│   │   ├── app/               # App Router — pages, layouts, routes
│   │   │   ├── page.tsx       # Main app (dashboard + all views)
│   │   │   ├── sign-in/       # Authentication — sign in
│   │   │   └── sign-up/       # Authentication — sign up
│   │   ├── components/        # Reusable UI components
│   │   │   ├── LandingPage.tsx      # Marketing landing page
│   │   │   ├── DashboardApp.tsx     # Full dashboard application
│   │   │   ├── DocumentManager.tsx  # File upload and folder management
│   │   │   ├── ProjectManager.tsx   # Project CRUD operations
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   └── TopNav.tsx           # Top navigation bar
│   │   ├── context/           # React context providers
│   │   │   └── AuthContext.tsx      # Firebase auth state provider
│   │   └── lib/               # Shared utilities
│   ├── public/docs/           # Documentation screenshots
│   ├── Dockerfile             # Frontend container config
│   └── package.json           # Dependencies and scripts
│
├── backend/                   # FastAPI Python application
│   ├── app/
│   │   ├── api/               # API dependencies and middleware
│   │   ├── core/              # Configuration, security, responses
│   │   │   ├── config.py            # Environment settings
│   │   │   ├── security.py          # Firebase Admin SDK verification
│   │   │   └── repository.py        # Base CRUD repository
│   │   ├── db/                # Database session and base models
│   │   ├── features/          # Modular feature packages
│   │   │   ├── ai/            # AI Gateway — providers, encryption, factory
│   │   │   │   ├── providers/       # Groq, OpenAI, Gemini, Anthropic, Ollama, OpenRouter
│   │   │   │   ├── encryption.py    # Fernet key encryption
│   │   │   │   ├── factory.py       # Strategy pattern provider factory
│   │   │   │   ├── service.py       # Chat completion orchestration
│   │   │   │   └── router.py        # AI API endpoints
│   │   │   ├── audit/         # Immutable hash-chain audit logs
│   │   │   ├── auth/          # Authentication helpers
│   │   │   ├── documents/     # Upload, versioning, sharing, folders
│   │   │   ├── organizations/ # Organization management
│   │   │   ├── projects/      # Project workspaces
│   │   │   ├── search/        # Enterprise search
│   │   │   ├── users/         # User profiles
│   │   │   ├── permissions/   # RBAC (planned)
│   │   │   ├── workflows/     # Approval workflows (planned)
│   │   │   └── notifications/ # Real-time alerts (planned)
│   │   └── shared/            # Shared utilities
│   ├── main.py                # FastAPI entrypoint
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile             # Backend container config
│
├── docker-compose.yml         # Full-stack orchestration
└── README.md                  # This file
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- [Python](https://www.python.org/) 3.11+
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
- A [Firebase Project](https://console.firebase.google.com/) with Email/Password and Google sign-in enabled
- At least one AI provider API key (Groq, OpenAI, Gemini, etc.) for the AI Gateway

---

## Installation & Deployment

This project is fully containerized. You can run the entire stack locally with Docker, or run the frontend and backend independently for development.

### Option A: Docker (Recommended)

> [!IMPORTANT]
> Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is running before proceeding.

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd workspace-ai
```

**2. Configure environment variables**

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

Edit `backend/.env`:
```env
DATABASE_URL=postgresql://workspace_user:mysecretpassword@127.0.0.1:25432/workspace_ai
FIREBASE_PROJECT_ID=your_firebase_project_id
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> [!NOTE]
> The `DATABASE_URL` is automatically injected by Docker Compose when running in containers. The value in `backend/.env` is only used for local development outside Docker.

**3. Start the application stack**

```bash
docker compose up --build -d
```

**4. Access the services**

| Service | URL |
|---------|-----|
| 🌐 Web Application | [http://localhost:3000](http://localhost:3000) |
| 📡 API Documentation | [http://localhost:8000/docs](http://localhost:8000/docs) |
| 🗄️ pgAdmin (Database) | [http://localhost:5050](http://localhost:5050) |
| 📦 MinIO Console | [http://localhost:9001](http://localhost:9001) |

---

### Option B: Local Development

**1. Start infrastructure services**

```bash
docker compose up db redis minio pgadmin -d
```

**2. Backend**

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

**3. Frontend**

```bash
cd frontend
npm install
npm run dev
```

---

## Sharing the Application

> [!TIP]
> **Local Network (Wi-Fi):** Find your machine's IP with `ipconfig` (Windows) or `ifconfig` (Mac/Linux). Colleagues can access the app at `http://<your-ip>:3000`.
>
> **Internet (ngrok):** Expose your local deployment with a public URL:
> ```bash
> ngrok http 3000
> ```

---

## API Reference

All endpoints are prefixed with `/api/v1` and require a valid Firebase JWT token in the `Authorization: Bearer <token>` header (except health check).

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/` | API welcome message |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/sync` | Sync Firebase user to database |
| `GET` | `/api/v1/users/me` | Get current user profile |

### Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/organizations` | Create organization |
| `GET` | `/api/v1/organizations` | List organizations |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/projects` | Create project |
| `GET` | `/api/v1/projects/org/{org_id}` | List projects by organization |
| `PUT` | `/api/v1/projects/{id}` | Update project |
| `DELETE` | `/api/v1/projects/{id}` | Delete project |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/documents/upload` | Upload document (multipart) |
| `GET` | `/api/v1/documents/org/{org_id}` | List documents by organization |
| `PUT` | `/api/v1/documents/{id}` | Update document metadata |
| `DELETE` | `/api/v1/documents/{id}` | Delete document |
| `GET` | `/api/v1/documents/{id}/download` | Download document |
| `POST` | `/api/v1/documents/{id}/version` | Upload new version |
| `GET` | `/api/v1/documents/{id}/versions` | List version history |
| `POST` | `/api/v1/documents/{id}/versions/{ver}/restore` | Restore to version |
| `POST` | `/api/v1/documents/{id}/share` | Share document |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/documents/folders` | Create folder |
| `GET` | `/api/v1/documents/folders/{org_id}` | List folders |
| `PUT` | `/api/v1/documents/folders/{id}` | Rename folder |
| `DELETE` | `/api/v1/documents/folders/{id}` | Delete folder |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/search` | Search documents, folders, and projects |

### AI Gateway

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/ai/credentials` | Save AI provider credentials (encrypted) |
| `GET` | `/api/v1/ai/credentials/org/{org_id}` | List configured providers |
| `POST` | `/api/v1/ai/test` | Test provider connection |
| `GET` | `/api/v1/ai/providers` | List available provider metadata |
| `POST` | `/api/v1/ai/chat` | Send chat completion request |

---

## AI Gateway — Supported Providers

NEXORA's AI Gateway uses a **Strategy + Factory pattern** to support multiple LLM providers. Organizations can configure their own API keys which are encrypted at rest using Fernet (AES-128).

| Provider | Default Model | Available Models |
|----------|--------------|-----------------|
| **Groq** | `llama-3.3-70b-versatile` | `llama-3.1-8b-instant`, `mixtral-8x7b-32768` |
| **OpenAI** | `gpt-4o` | `gpt-4o-mini`, `o1-mini` |
| **Gemini** | `gemini-2.5-flash` | `gemini-2.5-pro` |
| **Anthropic** | `claude-3-5-sonnet-20241022` | `claude-3-5-haiku-20241022` |
| **Ollama** | `llama3` | `mistral`, `codellama` |
| **OpenRouter** | `meta-llama/llama-3.3-70b-instruct` | `google/gemini-2.5-flash`, `anthropic/claude-3.5-sonnet` |

---

## Immutable Audit Logging

Every critical action is recorded in an **append-only hash chain** using SHA-256 hashing. Each log entry stores the hash of the previous entry, creating a tamper-evident chain that can be cryptographically verified.

```text
Log Entry N
├── id
├── user_id
├── action (e.g., "Upload Document", "Approve Workflow")
├── resource + resource_id
├── details (JSON)
├── ip_address
├── previous_hash ← hash of Entry N-1
└── current_hash  ← SHA-256(id + user_id + action + resource + resource_id + previous_hash)
```

The genesis block uses a zeroed hash (`0000...0000`) as its previous hash. Any attempt to modify a historical record breaks the chain, making tampering immediately detectable.

---

## Demo Flow

```text
1. User signs in with Firebase (Email or Google)
        ↓
2. User accesses the Enterprise Dashboard
        ↓
3. User creates a project and uploads an HR policy PDF
        ↓
4. Document is versioned, stored in MinIO, and metadata indexed in PostgreSQL
        ↓
5. User configures an AI provider (e.g., Groq) in the AI Gateway settings
        ↓
6. User asks the AI Assistant: "What is the leave policy?"
        ↓
7. AI retrieves context and responds using the configured LLM
        ↓
8. Admin reviews the audit log — every action is traceable via the hash chain
        ↓
9. Dashboard shows AI permission recommendations for inactive access rights
```

---

## Roadmap

Features intentionally scoped for post-MVP development:

- [ ] Real-time collaborative document editing
- [ ] RAG pipeline with pgvector semantic search
- [ ] Attribute-Based Access Control (ABAC)
- [ ] Hyperledger Fabric audit log integration
- [ ] AI anomaly detection using ML models
- [ ] Advanced compliance dashboards (GDPR, ISO 27001)
- [ ] Real-time notifications via WebSockets
- [ ] External integrations (Slack, Jira, Microsoft Teams)
- [ ] Multi-region deployments

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

Built by **Sarvan Kumar**

</div>

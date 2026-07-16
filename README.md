# AI-Powered Enterprise Collaboration Platform

A production-ready enterprise collaboration platform built for secure document management, hierarchical team workflows, and AI-driven document insights. The platform features an immutable audit log, role-based access control, and hybrid semantic search. Built with Next.js, FastAPI, PostgreSQL (pgvector), Clerk, and the Groq API.

## Features

- **Secure Authentication & RBAC**: Handled by Clerk Auth and Next.js, with fine-grained access control across Organizations, Departments, and Teams.
- **AI Document Assistant**: RAG-powered document understanding and hybrid search (Semantic + Keyword) utilizing local embeddings and the Groq LLM API.
- **Immutable Audit Logging**: A tamper-evident, append-only hash chain tracks every API action for strict enterprise compliance and security.
- **Document Management & Extraction**: Upload documents to a local S3-compatible MinIO bucket, with async text extraction and vector embedding via FastAPI BackgroundTasks.
- **Enterprise Dashboard**: A centralized hub for users to view recent activities, permission alerts, and pending workflows.

## Project Architecture

```text
workspace-ai/
│── frontend/          # Next.js 15, Tailwind, shadcn/ui React application
│   ├── src/app/       # Application routes and layouts
│   └── .env.example   # Frontend configuration example
│── backend/           # FastAPI Python application
│   ├── app/
│   │   ├── api/       # API endpoints and dependencies
│   │   ├── core/      # Security, config, and JWT validation
│   │   ├── db/        # SQLAlchemy session and base models
│   │   └── features/  # Modular backend features (auth, audit, etc.)
│   ├── main.py        # Main FastAPI entrypoint
│   └── requirements.txt # Python dependencies
│── docker-compose.yml # PostgreSQL, pgvector, Redis, MinIO, and pgAdmin
│── README.md          # Project documentation
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose
- A valid [Clerk Account](https://clerk.com/) for authentication keys
- A valid [Groq API Key](https://console.groq.com/) for LLM inference

## Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd workspace-ai
   ```

2. **Start the Infrastructure**:
   ```bash
   docker-compose up -d
   ```
   *This starts PostgreSQL (with pgvector), Redis, MinIO, and pgAdmin.*

3. **Setup the Backend**:
   ```bash
   cd backend
   python -m venv venv
   # On Windows: venv\Scripts\activate
   # On Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Setup the Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

1. **Frontend Setup**:
   Navigate to the `frontend` folder and copy the environment example:
   ```bash
   cp .env.example .env.local
   ```
   Add your Clerk API keys:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

2. **Backend Setup**:
   Navigate to the `backend` folder and create a `.env` file:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/workspace_ai
   CLERK_JWKS_URL=https://<your-clerk-domain>/.well-known/jwks.json
   GROQ_API_KEY=your_groq_api_key
   ```

## Running the Application

1. **Start the FastAPI Backend**:
   ```bash
   cd backend
   # Ensure virtual environment is active
   uvicorn main:app --reload --port 8000
   ```

2. **Start the Next.js Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

Access the application at `http://localhost:3000`.

## Application Screenshots

> **Note to Contributors:** Place the project screenshot images in the `frontend/public/docs/` folder, and reference them below.

### 1. Enterprise Dashboard
![Enterprise Dashboard Visualization](./frontend/public/docs/dashboard-placeholder.png)
*(Screenshot of the main dashboard showing storage usage, recent activity timeline, and AI insights.)*

### 2. Document Search & AI Chat
![AI Search & Chat UI](./frontend/public/docs/ai-search-placeholder.png)
*(Screenshot of the hybrid search interface querying enterprise policies and summarizing documents.)*

### 3. Workflow & Approvals
![Workflow Board](./frontend/public/docs/workflow-placeholder.png)
*(Screenshot showing pending requests and admin approval capabilities.)*

## License

This project is licensed under the MIT License.

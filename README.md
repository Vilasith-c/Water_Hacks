# AI-Powered Enterprise Collaboration Platform

A production-ready enterprise collaboration platform built for secure document management, hierarchical team workflows, and AI-driven document insights. The platform features an immutable audit log, role-based access control, and hybrid search. Built with Next.js, FastAPI, PostgreSQL (pgvector), Firebase Authentication, and the Groq API.

## Features

- **Secure Authentication & RBAC**: Handled by Firebase Auth (Email/Password registration and login) and Next.js, with fine-grained access control across Organizations, Departments, and Teams.
- **AI Document Assistant**: RAG-powered document understanding and search utilizing local embeddings and the Groq LLM API.
- **Immutable Audit Logging**: A tamper-evident, append-only hash chain tracks every API action for strict enterprise compliance and security.
- **Document Management & Extraction**: Upload documents, manage nested directory folders, and trigger version history rollbacks. Files are stored locally with metadata (project, department, access level, and tags).
- **Enterprise Dashboard**: A centralized hub for users to view recent activities, permission alerts, active projects, and document lists.

## Project Architecture

```text
workspace-ai/
│── frontend/          # Next.js 16, Tailwind v4 React application
│   ├── src/app/       # Application routes and layouts
│   ├── src/context/   # Authentication Provider Context
│   └── .env.example   # Frontend configuration example
│── backend/           # FastAPI Python application
│   ├── app/
│   │   ├── api/       # API endpoints and dependencies
│   │   ├── core/      # Security, config, and JWT validation
│   │   ├── db/        # SQLAlchemy session and base models
│   │   └── features/  # Modular backend features (users, organizations, etc.)
│   ├── main.py        # Main FastAPI entrypoint
│   └── requirements.txt # Python dependencies
│── docker-compose.yml # PostgreSQL, pgvector, Redis, MinIO, and pgAdmin
│── README.md          # Project documentation
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- Docker and Docker Compose
- A valid [Firebase Project](https://console.firebase.google.com/) for authentication setup
- A valid [Groq API Key](https://console.groq.com/) for LLM inference

## Installation & Deployment

This project is fully containerized. You can run the entire stack (Frontend, Backend, Database, Redis, MinIO, pgAdmin) locally using Docker.

> [!IMPORTANT]
> **Docker Desktop Required:** Ensure that the [Docker Desktop](https://www.docker.com/products/docker-desktop/) application is running and actively open on your machine before attempting to build or start the containers.

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd workspace-ai
   ```

2. **Configure Environment Variables**:
   Copy the example environment files and configure your Firebase and Groq keys.
   
   *Frontend (`frontend/.env`):*
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

   *Backend (`backend/.env`):*
   ```env
   FIREBASE_PROJECT_ID=your_project_id
   GROQ_API_KEY=your_groq_api_key
   GROQ_MODEL=llama-3.3-70b-versatile
   ```
   *(Note: The `DATABASE_URL` is automatically configured by `docker-compose.yml` internally!)*

3. **Start the Entire Application Stack**:
   With Docker Desktop running, execute the following command from the root folder:
   ```bash
   docker compose up --build -d
   ```

4. **Access the Application**:
   Once the containers have successfully spun up, access the platform by navigating to:
   - **Main Web App**: [http://localhost:3000](http://localhost:3000)
   - **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **pgAdmin (Database UI)**: [http://localhost:5050](http://localhost:5050)
   - **MinIO Console**: [http://localhost:9001](http://localhost:9001)

> [!TIP]
> **Sharing the App (Local Network / Wi-Fi)**: To allow colleagues on the same network to access the app, find your machine's local IP address (run `ipconfig` on Windows or `ifconfig` on Mac/Linux). They can then navigate to `http://<your-local-ip>:3000`.
> 
> **Sharing the App (Internet)**: To share your local deployment over the internet using a public URL, you can utilize tools like [ngrok](https://ngrok.com/) or [localtunnel](https://theboroer.github.io/localtunnel-www/). 
> Simply run `ngrok http 3000` to generate a secure public URL that tunnels to your running frontend container!

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

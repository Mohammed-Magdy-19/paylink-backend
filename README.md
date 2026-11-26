# PayLink

Bill-payment and wallet backend (Phase 1: requirements, design, and DevOps foundation).

## Run locally

1. Clone the repository and enter the project directory:
   ```bash
   git clone <repo-url>
   cd paylink
   ```
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Start the application and PostgreSQL 18 database:
   ```bash
   docker compose up --build
   ```
4. Verify the health endpoint returns `{"status":"ok"}`:
   ```bash
   curl http://localhost:3000/health
   ```

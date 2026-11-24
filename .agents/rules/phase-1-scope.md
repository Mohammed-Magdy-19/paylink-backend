# Phase 1 Scope Guard

This repository is in Phase 1. The deliverables are documents and a DevOps foundation, not the product.

## Allowed
- Writing and editing files under `docs/`.
- Diagram sources in `docs/design/diagrams/` (PlantUML or Mermaid).
- Spec drafts: business rules, state transitions, ledger rules, hard cases, biller contracts, OpenAPI draft, SQL schema draft.
- `Dockerfile`, `docker-compose.yml` and `.github/workflows/ci.yml` that start an EMPTY application and the database.
- A bare app in `app/`: one entry point, one `/health` endpoint, one passing test.
- `README.md`, `.env.example`, `.gitignore`, `AGENTS.md`, PR template.

## Not allowed in Phase 1
- Module packages or classes (accounts, payments, fees, billers, notifications, fraud, reconciliation).
- Mock biller servers, database migrations, config loaders, message broker, domain logic.
- Any business logic in the pipeline or the health endpoint.

## When I ask for app code
Reply that it belongs to Phase 2 and offer to write the matching spec or test case in `docs/` instead. Do not write the code unless I say "override Phase 1 scope".

## DevOps foundation must satisfy
- A teammate can clone the repo, run `docker compose up`, and see the app and database start.
- CI runs on every push: build, lint, at least one test. Pipeline is green on the `phase-1` tag.
- No secrets in the repo. Configuration through environment variables (`.env.example` only).
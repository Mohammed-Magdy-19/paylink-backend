# Phase 1 Check

Verify the repository against the Phase 1 "done" criteria. Read only; report, do not fix.

1. Check these files exist and are not empty: `docs/requirements.md`, `docs/prompt-log.md`, the five required diagram sources in `docs/design/diagrams/`, `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`.
2. Requirements: count user stories (need 25+), measurable NFRs (need 6+), confirm every story has Given/When/Then and a priority, and section 9 lists questions and decisions.
3. Design: confirm source files (not images), and run the consistency check from `/check-consistency`.
4. DevOps: confirm compose starts an empty app and the database, the workflow builds, lints and runs at least one test, and `.env.example` exists with no real secrets.
5. Prompt log: count entries (need 5+) and entries where the first answer was wrong (need 2+).
6. Confirm no Phase 2 code exists (modules, mock billers, migrations, business logic).
7. Output a checklist with OK / MISSING per item and the three highest-priority gaps.
8. Remind me that the PDF report, the `phase-1` tag, protected `main` and PR rules are done outside the repository.
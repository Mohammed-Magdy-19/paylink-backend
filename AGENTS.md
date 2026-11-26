# PayLink: Agent Instructions

PayLink is a university project: a bill-payment and wallet backend for Egypt (like Fawry). Customers pay electricity, water, mobile and internet bills from a wallet. The system holds customer money, so correctness matters more than speed or cleverness.

## Current phase: PHASE 1 (requirements, design, DevOps foundation)

Phase 1 is documentation and a bare DevOps skeleton. **Do not build the application.** Details are in `.agents/rules/phase-1-scope.md`.

## Sources of truth (read before answering)

- `docs/requirements.md`: user stories, NFRs, priorities, decisions (section 9), traceability.
- `docs/design/specs/`: business rules, state transitions, ledger rules, hard cases, module interfaces.
- `docs/design/diagrams/`: PlantUML/Mermaid sources.
- `docs/prompt-log.md`: our honest log of AI use.

If two files disagree, stop and tell me which lines conflict. Do not silently pick one.

## Non-negotiable domain rules

1. Money is an exact decimal type, never float or double. Currency is EGP, 2 decimals.
2. A balance is the sum of ledger entries. Never overwrite a balance. Ledger entries are append-only.
3. Payment states are exactly: Initiated, FundsHeld, SentToBiller, Completed, Failed, Unknown, Refunded, Rejected. Only the transitions in `docs/design/specs/state-transactions.md` are legal.
4. A payment in Unknown is never refunded automatically.
5. Limits, fees, timeouts, retries and commission come from configuration, not code.
6. Notification failure never changes a payment's state.

## How to work with me

- Plan first. For anything larger than a small edit, show a short plan and wait for my OK.
- If a requirement is ambiguous, ask one focused question, or list the options. Record the decision in `docs/requirements.md` section 9.
- Prefer small, reviewable changes. One topic per change.
- Use the exact names from the glossary and the state table in every file. Do not invent synonyms (not "Pending", "Success", "Paid").
- Be honest about uncertainty. Say "I am not sure" rather than inventing facts about the brief.
- Never put real secrets, passwords or personal data in any file.
- I must understand everything committed. Explain non-obvious choices briefly.

## Language and format

- Documentation in English, Markdown. Diagrams as source text, never screenshots.
- Keep specs short and precise. One page per spec where possible.

## Stack (fill in once declared; fixed after Phase 1)

- Language/framework: Node.js 22.19.0 + NestJS 10 (TypeScript 5.7)
- Database: PostgreSQL 18
- Test framework: Jest 29 (supertest)
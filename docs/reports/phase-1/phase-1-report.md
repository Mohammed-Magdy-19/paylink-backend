# PayLink — Phase 1 Submission Report

> Source document for the Phase 1 PDF deliverable (`docs/reports/phase-1/`), compiled from `docs/requirements.md`, `docs/design/specs/`, and `docs/design/billers/`.
> Sections marked `[TO BE FILLED]` depend on repository artifacts or team inputs not yet finalized on this branch.

| | |
|---|---|
| **Project** | PayLink: Bill-Payment and Digital Wallet Backend (Egypt) |
| **Phase** | 1 — Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |
| **Team / Members** | `[TO BE FILLED — also update docs/requirements.md header]` |
| **Phase 1 Roles** | Requirements & product lead: `[TO BE FILLED]` · Quality & DevOps lead: `[TO BE FILLED]` · Architecture lead: `[TO BE FILLED]` |
| **Declared Stack** | Language/framework: `TBD` · Database: `TBD` (10+ tables) · Diagram tool: `PlantUML / Mermaid (TBD)` · Test framework: `TBD` · CI/CD: `GitHub Actions` · Containers: `Docker + docker compose` |

---

## 1. Problem Summary, Stakeholders, and Glossary

### 1.1 Problem Summary (`docs/requirements.md` §1)
PayLink is an Egyptian bill-payment and digital wallet backend (similar to Fawry). Customers pay electricity, water, mobile top-up, and internet bills from a digital wallet via the mobile app or through shop agents operating PayLink terminals. PayLink earns a service fee per completed payment and pays a commission to agents.

Because PayLink holds customer funds while integrating heterogeneous, sometimes slow or unresponsive external billers, correctness with money takes priority over speed. The backend enforces:
- **Ledger-derived balances:** every money movement is append-only in a double-entry ledger; balances are computed as the sum of entries and never overwritten.
- **Strict 8-state payment life cycle:** `Initiated`, `FundsHeld`, `SentToBiller`, `Completed`, `Failed`, `Unknown`, `Refunded`, and `Rejected`.
- **Protocol isolation:** each biller protocol (`REST/JSON`, `SOAP-style XML`, async `REST` with callback, optional daily `CSV` batch) sits behind one integration interface.
- **Configuration-driven rules:** limits, fees, promotions, commissions, timeouts, and retry intervals live in configuration rather than hardcoded logic.

**Out of scope:** real payment gateways, real SMS/push providers, real external biller connections (all simulated via mock servers), and a full production UI.

### 1.2 Stakeholders (`docs/requirements.md` §2)

| Stakeholder | Role | Primary Interest |
|---|---|---|
| Customer | Pays bills from the wallet | Fast, accurate billing, clear messages, zero double charges |
| Agent | Pays on behalf of customers at a terminal | Reliable execution and timely commission credits |
| Biller (`ElectroCo`, `AquaCo`, `TopUpNet`, `NetCo`) | Issues bills and receives payments | Accurate payments and matching settlement files |
| Admin | Manages billers, fees, and limits | Runtime configuration changes without redeploying; audit trail |
| Support employee | Investigates issues | Search by reference, inspect full history, block/unblock accounts |
| PayLink management | Business owner | Fee revenue, customer trust, scalability, regulatory safety |
| Regulator / auditor | Financial oversight | Immutable audit log and traceable money movements |
| Development team / TA / instructors | Build and evaluate | Clean modular design, tests, honest AI log |

### 1.3 Key Domain Terms (`docs/requirements.md` §4)
`Biller`, `Bill inquiry`, `Wallet` (available + held balances in EGP), `Ledger` (append-only entries), `Hold`, `Service fee`, `Commission` (`40%` of service fee), `Idempotency key` (per account, 24 h retention), `Settlement file`, `Reconciliation`, `Refund`.

---

## 2. Requirements Pack (`docs/requirements.md` & `docs/design/specs/`)

### 2.1 Business Rules & Configuration (`docs/requirements.md` §5, `business-rules.md`)
All values below are exact 2-decimal `EGP` decimals (never `float`/`double`) and loaded from configuration:

| Rule | Configuration Value | Error Code on Rejection |
|---|---|---|
| Single payment min / max (`Q1`) | `5.00 EGP` / `10,000.00 EGP` (on bill amount) | `BELOW_MIN_SINGLE` / `ABOVE_MAX_SINGLE` |
| Daily limit (`Q2`, `Q3`) | `5,000.00 EGP` (basic) / `30,000.00 EGP` (verified) in `Africa/Cairo` day | `DAILY_LIMIT_EXCEEDED` |
| Fee — electricity & water | Fixed `2.50 EGP` | `—` |
| Fee — mobile top-up (`Q4`) | `1.5%` rounded half-up to 2 decimals, min `1.00 EGP` | `—` |
| Fee — internet (`Q5`) | `2.00 EGP` for `≤ 200.00 EGP`; `4.00 EGP` for `> 200.00 EGP` | `—` |
| Promotion (`Q6`) | `0.00 EGP` fee for one configured biller within start/end dates (`0.00` commission) | `—` |
| Agent commission (`Q17`) | `40%` of service fee (half-up to 2 decimals), credited on `Completed` | `—` |
| Velocity rule (`Q8`) | `> 5` payment attempts in `60 s` (6th blocked) → `10 min` account block | `VELOCITY_BLOCKED` |
| Biller timeout (`Q10`) | `10 s` for live billers (`TopUpNet`: applies to `"accepted"` reply only) → `Unknown` | `PAYMENT_PROCESSING` |
| `Unknown` retries (`Q11`) | Re-query up to `3` times (`1, 5, 15` min), then wait for reconciliation | `—` |
| Notification retries (`Q16`) | `3` retries, then marked `undelivered` (never changes payment state) | `—` |

**Fee & Commission Worked Examples (`business-rules.md`):**

| Service | Bill Amount (EGP) | Fee (EGP) | Total Charged (EGP) | Agent Commission 40% (EGP) |
|---|---|---|---|---|
| Electricity (`ElectroCo`) | `350.00` | `2.50` | `352.50` | `1.00` |
| Water (`AquaCo`) | `120.00` | `2.50` | `122.50` | `1.00` |
| Mobile top-up (`TopUpNet`) | `120.00` | `1.80` | `121.80` | `0.72` |
| Mobile top-up (`TopUpNet`, min fee) | `40.00` | `1.00` | `41.00` | `0.40` |
| Internet (`NetCo`, lower tier) | `200.00` | `2.00` | `202.00` | `0.80` |
| Internet (`NetCo`, upper tier) | `200.01` | `4.00` | `204.01` | `1.60` |
| Any biller (active promotion) | `350.00` | `0.00` | `350.00` | `0.00` |

### 2.2 Functional Requirements Summary (`US-01`–`US-30`)
Full `Given / When / Then` acceptance criteria are specified in `docs/requirements.md` §6 and refined in `docs/design/specs/`:

| Priority | Count | Requirements / Stories |
|---|---|---|
| **Must** | 21 stories | `US-01`, `US-03`–`US-16`, `US-18`, `US-20`, `US-22`, `US-25`, `US-29` (HC 8), `US-30` (HC 4) (`FR-1`, `3`–`16`, `18`, `20`, `22`, `25`) |
| **Should** | 7 stories | `US-02`, `US-17`, `US-19`, `US-21`, `US-23`, `US-24`, `US-26` (`FR-2`, `17`, `19`, `21`, `23`, `24`, `26`) |
| **Could** | 2 stories | `US-27`, `US-28` (`FR-27`, `28`) |
| **Optional** | — | `NetCo` daily CSV batch biller (not required by `FR-15`) |

**Additional Planned Tests (`docs/design/specs/`):** `test_boundary_limits`, `test_fee_and_commission_examples`, `test_idempotency_key_expires_after_24h`, `test_ledger_entries_per_transition`, `test_audit_record_fields`, `test_error_codes_returned`, `test_retry_schedule_1_5_15`. (The full 30-row traceability matrix is in `docs/requirements.md` §10.)

### 2.3 Measurable Non-Functional Requirements (`docs/requirements.md` §7)

| ID | Quality | Target | Measurement Method | Priority |
|---|---|---|---|---|
| `NFR-1` | Correctness | `0` double charges, `0` negative balances | 100 parallel & 100 duplicate requests; assert ledger sum = balance | Must |
| `NFR-2` | Performance | `100` payments/s sustained for `60 s` | Load test against mock billers; throughput & p95 in CI/report | Must |
| `NFR-3` | Resilience | Biller outage does not stop other billers | ElectroCo down, 50 AquaCo payments succeed (`0%` error rate) | Must |
| `NFR-4` | Modifiability | New biller touches only Biller Integration + config | `git diff` of "add biller" PR touches no other module | Must |
| `NFR-5` | Auditability | `100%` of money movements & admin actions audited | Test asserts ledger/admin count matches audit record count | Must |
| `NFR-6` | Testability | `≥ 70%` line coverage on domain logic (`pattern-plan.md`) | CI coverage report across Fees, Payment state, Ledger/Wallet, Fraud | Must |
| `NFR-7` | Responsiveness | API `p95 < 300 ms` (excluding biller call) | Load test percentile report | Should |
| `NFR-8` | Security / privacy | Zero secrets or real PII in repo or prompts | CI repo scan; `.env.example` only | Must |
| `NFR-9` | Portability | Clean clone runs via `docker compose up` | Clean-clone check before each tag | Must |
| `NFR-10` | Configurability | Limits, fees, timeouts, retries changed without restart | Integration test changing config at runtime | Should |

### 2.4 Ambiguities & Decisions (`Q1`–`Q19`)
Decisions `Q1`–`Q16` are recorded in `docs/requirements.md` §9 (covering bill-amount scope for single/daily limits, `Africa/Cairo` calendar day, half-up rounding, inclusive `200.00` tier, `0.00` promotion commission, exact-bill-amount payment, sliding 60 s attempt velocity window, 24 h per-account idempotency retention, `10 s` timeout scope for `TopUpNet`/`NetCo`, reconciliation handling of `Unknown`, Could-scope refund rules, fee release on failure, agent cash wallet source, disabling billers mid-flight, and notification decoupling).

Additional spec decisions in `docs/design/specs/`:
- **`Q17` (`business-rules.md`):** `40%` agent commission uses exact decimal half-up rounding to 2 decimals.
- **`Q18` (`module-interfaces.md`):** `AquaCo` uses `subscriber/account number` (`SubscriberNo`) and supports live inquiry *(Assumption, to be confirmed with the instructor's biller contract)*.
- **`Q19` (`module-interfaces.md`):** `NetCo` uses `customer/account number` (`customerAccountNumber`) *(Assumption, to be confirmed with the instructor's biller contract)*.

---

## 3. Design Pack (`docs/design/`)

### 3.1 Modules & Design Pattern Plan (`pattern-plan.md`)
PayLink is structured as a modular monolith with 6 core modules (`Accounts & Wallet`, `Biller Catalog`, `Payment Processing`, `Biller Integration`, `Fees & Commissions`, `Notifications`) plus 2 extra modules (`Fraud Checks`, `Reconciliation`):

| Design Pattern | Problem Solved | Module | Spec Reference |
|---|---|---|---|
| Adapter & Factory | Hides heterogeneous biller protocols behind one interface; resolves adapter from config | Biller Integration | `module-interfaces.md`, `billers/` |
| Strategy | Selects configurable fixed, percentage+min, tiered, or promotional fee calculation | Fees & Commissions | `business-rules.md` |
| State | Enforces the 8-state payment life cycle and rejects illegal transitions | Payment Processing | `state-transactions.md` |
| Chain of Responsibility | Runs ordered fraud & limit checks (single min/max, daily limit, velocity, block) | Fraud Checks | `business-rules.md` |
| Observer | Emits async SMS/push notifications on completion/failure without affecting state | Notifications | `hard-cases.md` |
| Command | Encapsulates scheduled `1, 5, 15` min re-query attempts for `Unknown` payments | Biller Integration | `state-transactions.md` |

### 3.2 Payment State Life Cycle (`requirements.md` §5, `state-transactions.md`)
Only these transitions are legal (`Completed`, `Rejected`, and `Refunded` are final; `Unknown` is **never** refunded automatically):

| From | Event | To |
|---|---|---|
| `Initiated` | Fraud checks pass and wallet has sufficient funds | `FundsHeld` |
| `Initiated` | Fraud check fails or insufficient funds | `Rejected` |
| `FundsHeld` | Request sent to biller | `SentToBiller` |
| `SentToBiller` | Biller confirms | `Completed` |
| `SentToBiller` | Biller refuses | `Failed` |
| `SentToBiller` | No answer within `10 s` timeout | `Unknown` |
| `Unknown` | Biller later confirms (callback, `1/5/15` min retry, or settlement) | `Completed` |
| `Unknown` | Biller later refuses, or reconciliation finds no payment | `Failed` |
| `Failed` | Hold released to wallet | `Refunded` |

### 3.3 Double-Entry Ledger & Audit Rules (`ledger-rules.md`)
- **Six ledger accounts:** `customer available`, `customer held`, `biller payable`, `PayLink fee income`, `agent wallet`, `commission expense`.
- **Invariants:** every state transition and its ledger entries commit atomically in **one database transaction**; every event's entries sum to `0.00 EGP`; entries are append-only; balances equal the sum of entries.
- **Worked flow (`350.00` bill + `2.50` fee = `352.50`):**
  1. Hold (`Initiated → FundsHeld`): `customer available` `-352.50`, `customer held` `+352.50`.
  2. Confirm (`Completed`, direct): `customer held` `-352.50`, `biller payable` `+350.00`, `PayLink fee income` `+2.50` (plus `commission expense` `-1.00`, `agent wallet` `+1.00` if via agent).
  3. Failure (`Failed → Refunded`): `customer held` `-352.50`, `customer available` `+352.50` (no fee or commission booked).
- **Audit records (`US-25`):** store `who`, `when (UTC)`, `action`, `reason`, `related reference`, and `before/after` values for admin changes.

### 3.4 Biller Contracts (`docs/design/billers/`)

| Biller | Service | Protocol | Live Inquiry | Key Rules & Hard Cases | Spec File |
|---|---|---|---|---|---|
| `ElectroCo` (`v1`) | Electricity | Sync `REST`/`JSON` (`< 1 s`) | Yes (`meterNumber`) | Immediate `CONFIRMED`; `10 s` timeout → `Unknown`; Phase 2 `v2` swaps fields, uses piasters, adds signing | `docs/design/billers/electroco-v1.md` |
| `AquaCo` | Water | `SOAP` XML over HTTP (`2–4 s`) | Yes (`SubscriberNo`, `Q18`) | Rejects overpayment (`AQ-OVERPAY` → `BILLER_REFUSED` → `Failed` → `Refunded`, Hard Case 3) | `docs/design/billers/aquaco.md` |
| `TopUpNet` | Mobile top-up | Async `REST`/`JSON` + webhook | No (`NO_LIVE_INQUIRY`) | `10 s` timeout on `202` `"accepted"` only (`Q10`); duplicate callbacks ignored & logged (Hard Case 6) | `docs/design/billers/topupnet.md` |
| `NetCo` *(optional)* | Internet | Daily batch `CSV` | No (`NO_LIVE_INQUIRY`) | Out of scope for live `10 s` timeouts (`Q10`); next-morning result/settlement CSV | `docs/design/billers/netco.md` |

### 3.5 Hard Cases Index (`hard-cases.md`)
All 8 brief hard cases map to user stories and planned automated tests: `HC 1` (`US-10` / `test_duplicate_request_one_charge`), `HC 2` (`US-13` / `test_timeout_becomes_unknown_money_held`), `HC 3` (`US-12` / `test_failed_payment_releases_hold`), `HC 4` (`US-30` / `test_concurrent_payments_one_rejected`), `HC 5` (`US-23` / `test_sms_down_retried_then_undelivered`), `HC 6` (`US-14` / `test_duplicate_callback_ignored`), `HC 7` (`US-26` / `test_settlement_difference_flagged`), `HC 8` (`US-29` / `test_new_biller_added_without_changing_modules`).

### 3.6 Diagrams, OpenAPI, and Schema Drafts (`[TO BE COMPLETED BEFORE PHASE 1 TAG]`)
Source files under `docs/design/diagrams/`, `docs/design/api/`, and `docs/design/db/` are not yet present in this branch:
- `[ ]` `docs/design/diagrams/use-case.puml` (required)
- `[ ]` `docs/design/diagrams/class-domain.puml` (required)
- `[ ]` `docs/design/diagrams/sequence-pay-bill.puml` (required)
- `[ ]` `docs/design/diagrams/sequence-refund-failed.puml` (required)
- `[ ]` `docs/design/diagrams/state-payment.puml` (required)
- `[ ]` `docs/design/diagrams/er-diagram.puml` (required — 10+ relational tables)
- `[ ]` `docs/design/api/openapi-draft.yaml` & `docs/design/db/schema-draft.sql`

> `[INSERT RENDERED DIAGRAM EXPORTS / LINKS AND AI-ERROR FIX NOTES HERE ONCE DIAGRAMS ARE MERGED]`

---

## 4. DevOps Foundation (`[TO BE COMPLETED BEFORE PHASE 1 TAG]`)

### 4.1 Git & Repository Governance (`.agents/rules/ai-use-and-git.md`)
- `main` branch protected; all changes arrive via feature branches and peer-reviewed pull requests (PRs `#1` and `#2` already merged via PRs).
- Conventional commits; commits where AI wrote >50% name the tool; no force-push or history rewrites; `phase-1` tag created only when all deliverables pass.
- No secrets or real personal data in git; `.env.example` only.

### 4.2 Skeleton App, Docker, and CI Verification Checklist
These required Phase 1 files are not yet present on this branch and must be completed and verified before creating the `phase-1` tag:
- `[ ]` `app/` bare skeleton (entry point + `/health` endpoint + at least 1 passing test, no Phase 2 domain logic)
- `[ ]` `app/Dockerfile` and `docker-compose.yml` (starts empty app + database from clean clone via `docker compose up`)
- `[ ]` `.env.example`, `.gitignore`, `README.md`, `.github/pull_request_template.md`
- `[ ]` `.github/workflows/ci.yml` (builds, lints, and runs at least 1 test on every push)
- `[ ]` **Clean-clone & green-CI evidence:** `[INSERT CI RUN URL AND SCREENSHOT/OUTPUT OF docker compose up ON CLEAN CLONE]`

---

## 5. Prompt Log Summary (`docs/design/specs/prompt-log.md`)

> **Action item:** Consolidate or mirror entries into `docs/prompt-log.md` (currently empty, required by Brief §5), complete the team verdicts for `P-01`–`P-07`, and mark at least **2** entries where the first AI answer was wrong and the prompt was improved.

| ID | Date | Author | Stage | Tool & Model | Summary | Verdict |
|---|---|---|---|---|---|---|
| `P-01` | `2026-11-24` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | Asked what specs can be added to `requirements.md` | `TO BE FILLED BY THE TEAM` |
| `P-02` | `2026-11-24` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | Narrowed to making `requirements.md` more specific without new scope | `TO BE FILLED BY THE TEAM` |
| `P-03` | `2025-11-24` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | Structured prompt applying six specificity changes | `TO BE FILLED BY THE TEAM` |
| `P-04` | `2026-11-25` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | Moved six specificity refinements into separate `specs.md` | `TO BE FILLED BY THE TEAM` |
| `P-05` | `2026-11-25` | `[Adham Mohamed]` | Documentation structure | `[Tool, model]` | Requested splitting `specs.md` into six files | `TO BE FILLED BY THE TEAM` |
| `P-06` | `2026-11-25` | `[Adham Mohamed]` | Documentation structure | `[Tool, model]` | Split `specs.md` into `docs/design/specs/*.md`, checked coverage, deleted `specs.md` | `TO BE FILLED BY THE TEAM` |
| `P-07` | `2026-11-25` | `[Adham Mohamed]` | Process / logging | `[Tool, model]` | Created `docs/design/specs/prompt-log.md` | `TO BE FILLED BY THE TEAM` |
| `P-08` | `2026-11-25` | `Mohamed Motaz Maher` | Design (biller contracts) | `Antigravity (Gemini)` | Created `electroco-v1.md`, `aquaco.md`, `topupnet.md`, `netco.md` | **Accepted:** follows Phase 1 scope, exact decimal EGP strings, and `Q18`/`Q19` |

---

## 6. Known Repository Consistency Items to Resolve Before `phase-1` Tag
1. `AGENTS.md` line 28 cites `docs/design/specs/state-transitions.md`, while the file on disk is `docs/design/specs/state-transactions.md`.
2. `docs/prompt-log.md` is currently empty while `docs/design/specs/prompt-log.md` contains `P-01`–`P-08`.
3. `docs/requirements.md` header (`team`, `date`, `Phase 1 roles`, §3 `Technology declaration`) still contains placeholders.

# PayLink: Prompt Log (Phase 1, specification files)

> One-line purpose: Honest log of AI prompts used to create and organize the Phase 1 specification files.
> Part of the PayLink specs, companion to `requirements.md` v1.0.

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |

---

## Summary table

| ID | Date | Author | Stage | Tool and model | Prompt | Summary of answer | Verdict and why |
|---|---|---|---|---|---|---|---|
| P-01 | `2026-11-24` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | [Ask what specs can be added to requirements.md](#p-01-ask-what-specs-can-be-added-to-requirementsmd) | Response to question on what specifications could be added based on the attached brief and `requirements.md` (answer text not provided). | TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why) |
| P-02 | `2026-11-24` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | [Make requirements.md more specific (no new scope)](#p-02-make-requirementsmd-more-specific-no-new-scope) | Response listing ways to make `requirements.md` more specific without adding new scope (answer text not provided). | TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why) |
| P-03 | `2025-11-24` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | [Apply the six specificity changes to requirements.md](#p-03-apply-the-six-specificity-changes-to-requirementsmd) | Requested applying six specificity changes to `requirements.md` (prompt and answer text not provided). | TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why) |
| P-04 | `2026-11-25` | `[Adham Mohamed]` | Requirements | `[Tool, model]` | [Put the six changes in a separate specs.md file](#p-04-put-the-six-changes-in-a-separate-specsmd-file) | Created `specs.md` (sections 1–9) refining `requirements.md` v1.0, plus a verification list of calculated values, assumptions, and alignment notes. | TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why) |
| P-05 | `2026-11-25` | `[Adham Mohamed]` | Documentation structure | `[Tool, model]` | [Split specs.md into six small files](#p-05-split-specsmd-into-six-small-files) | Requested splitting `specs.md` into six smaller files (prompt and answer text not provided). | TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why) |
| P-06 | `2026-11-25` | `[Adham Mohamed]` | Documentation structure | `[Tool, model]` | [Split specs.md and delete it afterwards](#p-06-split-specsmd-and-delete-it-afterwards) | Split `specs.md` into six files under `docs/design/specs/`, provided coverage check, deleted `specs.md`, ran no-link check, and listed verification items. | TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why) |
| P-07 | `2026-11-25` | `[Adham Mohamed]` | Process / logging | `[Tool, model]` | [Create prompt-log.md](#p-07-create-prompt-logmd) | Created `docs/design/specs/prompt-log.md` with header, summary table, full prompts, evolution table, honesty checklist, and change history, plus fill-in and verification lists. | TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why) |
| P-08 | `2026-11-25` | `Antigravity (AI)` | Design | `Antigravity / Claude Opus 4.6` | [Create payment state diagram](#p-08-create-payment-state-diagram) | Created `docs/design/diagrams/state-payment.mmd`: Mermaid stateDiagram-v2 with 8 states, 9 transitions, 3 final markers, 3 notes. Cross-checked against requirements.md §5 and all spec files; 0 mismatches. | DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. File naming note: AGENTS.md line 22 references `state-transitions.md` but actual file is `state-transactions.md`. |
| P-09 | `2026-11-25` | `Antigravity (AI)` | Design | `Antigravity / Gemini` | [Create domain class diagram](#p-09-create-domain-class-diagram) | Created `docs/design/diagrams/class-domain.mmd` with 21 domain classes + 2 enums grouped by module, derived Wallet balances, append-only LedgerEntry, and Q20 in `requirements.md`. | DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Check if 23 nodes in one file is readable or should be split. |
| P-10 | `2026-11-25` | `Antigravity (AI)` | Design | `Antigravity / Gemini` | [Create ER diagram](#p-10-create-er-diagram) | Created `docs/design/diagrams/er-diagram.mmd` with 20 tables matching `class-domain.mmd` 1-to-1, derived WALLET balances, append-only LEDGER_ENTRY/AUDIT_RECORD, and renumbered Q20→Q21 in `requirements.md`. | DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Flagged and resolved Q20/Q21 numbering conflict from P-09. |
| P-11 | `2026-11-25` | `Antigravity (AI)` | Design | `Antigravity / Gemini` | [Create use-case diagram](#p-11-create-use-case-diagram) | Created `docs/design/diagrams/use-case.mmd` (`flowchart LR`) with 7 actors, 27 use cases across modules/shared services, priority `classDef`s (`[M]`/`[S]`/`[C]`), and legend for system-rule stories. | DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify layout readability of cross-module `<<include>>` edges. |
| P-12 | `2026-11-25` | `Antigravity (AI)` | Design | `Antigravity / Gemini` | [Create pay-bill sequence diagram](#p-12-create-pay-bill-sequence-diagram) | Created `docs/design/diagrams/sequence-pay-bill.mmd` with worked example (350.00 + 2.50 = 352.50 EGP), all branches (confirm, refuse, 10s timeout, async notifications), and Q20 in `requirements.md`. | DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify `opt` + `alt` nesting and width in Mermaid renderer. |
| P-13 | `2026-11-25` | `Antigravity (AI)` | Design | `Antigravity / Gemini` | [Create refund-failed sequence diagram](#p-13-create-refund-failed-sequence-diagram) | Created `docs/design/diagrams/sequence-refund-failed.mmd` covering 3 Failed triggers, atomic 352.50 EGP hold release, async notifications, 3 ILLEGAL_TRANSITION guards, and hard case 7 opt block. | DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify `alt` blocks and participant layout in Mermaid renderer. |
| P-14 | `2026-11-25` | `Antigravity (AI)` | Design | `Antigravity / Gemini` | [Create component-modules diagram](#p-14-create-component-modules-diagram) | Created `docs/design/diagrams/component-modules.mmd` (`flowchart TB`) showing the 8 modules, `BillerAdapter` + adapters, shared services (`Audit Log`, `Configuration`), async event flow, and DB/externals. | DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify layout readability of edges between monolith and DB/externals. |

---

## Full prompts

### P-01: Ask what specs can be added to requirements.md

```text
If I need to add specs what can I add??
```

Answer summary: Response to question on what specifications could be added based on the attached brief and `requirements.md` (answer text not provided).
Verdict: TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why)

### P-02: Make requirements.md more specific (no new scope)

```text
I don't need add other things, but I need to be specific with the Requirements.md, what can I add??
```

Answer summary: Response listing ways to make `requirements.md` more specific without adding new scope (answer text not provided).
Verdict: TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why)

### P-03: Apply the six specificity changes to requirements.md

```text
ROLE
You are a senior business analyst and QA engineer working on a Phase 1
requirements pack for a university project (PayLink, an Egyptian
bill-payment wallet backend). You write precise, testable requirements
in Given/When/Then style.

CONTEXT
The attached file requirements.md is our current requirements pack (v1.0).
It has 30 user stories (US-01 to US-30), 10 NFRs, decisions Q1 to Q16,
a traceability table and business rules in section 5.
Grading criterion: "complete, testable, prioritised, ambiguities resolved".
We do NOT want to edit requirements.md and we do NOT want new features or
new user stories. Instead, create ONE NEW FILE called specs.md
(path: /docs/specs.md) that adds specific, testable detail on top of the
existing stories. specs.md is a companion to requirements.md and refers to
its IDs (US-xx, NFR-x, Qx, section numbers).

TASK
Create specs.md with the following structure and content.

Header
- Title "PayLink: Detailed Specifications (companion to requirements.md)".
- A short note: "This file refines requirements.md v1.0. If the two
  disagree, this file's amendments in section 6 apply."
- Same team/version/date table as requirements.md, with placeholders left
  as they are.

1. Error and reason codes
   Table: Code | Used when | Customer message | Story.
   Include at least: ALREADY_REGISTERED, INVALID_AMOUNT, BILL_NOT_FOUND,
   NO_LIVE_INQUIRY, BILLER_UNAVAILABLE, ABOVE_MAX_SINGLE, BELOW_MIN_SINGLE,
   DAILY_LIMIT_EXCEEDED, INSUFFICIENT_FUNDS, VELOCITY_BLOCKED,
   ACCOUNT_BLOCKED, IDEMPOTENCY_CONFLICT, ILLEGAL_TRANSITION,
   BILLER_REFUSED, PAYMENT_PROCESSING.
   Every code must name the existing story it comes from (US-01, 04, 06,
   08, 09, 10, 11, 13, 15, 18, 19, 21).

2. Boundary values
   Table: Rule | Accepted value | Rejected value | Expected code | Story.
   Cover: single min (5.00 / 4.99), single max (10,000.00 / 10,000.01),
   daily limit basic (total reaches 5,000.00 / 5,000.01), daily limit
   verified (30,000.00 / 30,000.01), velocity (5th payment in 60 s allowed,
   6th blocked; "more than 5" means the 6th is the first blocked), internet
   fee (200.00 gives 2.00, 200.01 gives 4.00), and one mobile top-up amount
   that hits the 1 EGP minimum fee.
   Then add Given/When/Then lines for each boundary, labelled with the
   story they extend (US-16, US-18, US-19).

3. Fee and commission worked examples
   Table: Service | Bill amount | Fee | Total charged | Agent commission
   (40%). Rows: electricity 350.00; water 120.00; mobile 120.00; mobile
   40.00; internet 200.00; internet 200.01; any biller during a promotion.
   Compute every value with decimal arithmetic, half-up rounding to 2
   decimals (decision Q4), and show the calculation in a note under the
   table so I can verify it.

4. Ledger entries per transition
   First list the ledger accounts used (customer available, customer held,
   biller payable, PayLink fee income, agent wallet, commission expense).
   Then a table: Event | Ledger entries (account, direction, amount).
   Use the example bill 350.00 + fee 2.50 = 352.50. Cover: hold
   (Initiated to FundsHeld), Completed, Completed via agent (commission
   1.00), Failed to Refunded, Unknown (no new entries, hold stays), and
   Rejected (no entries).
   State that every transition and its ledger entries are written in ONE
   database transaction and that the entries of each payment sum to zero
   (double-entry). It must be consistent with US-05, US-09, US-12, US-17,
   Q13 and the rule that an Unknown payment is never refunded
   automatically.

5. Required fields per biller
   Table: Biller | Service | Required input fields | Live inquiry?
   Rows: ElectroCo (meter number, live), AquaCo (subscriber/account
   number), TopUpNet (phone number and amount, no bill inquiry), NetCo
   (customer/account number, no live inquiry).
   The brief does not name the AquaCo and NetCo field names, so mark those
   two as "Assumption, to be confirmed with the instructor's biller
   contract". Do not invent anything else about the billers.

6. Amendments to existing acceptance criteria
   Table: Item | Current text (short quote or summary) | Added or changed
   criterion. Cover exactly:
   - US-10: key kept 24 hours; after that the same key is a new request.
   - US-13: retries at 1, 5 and 15 minutes after the timeout; each attempt
     recorded in the payment history.
   - US-20: "full history" = payment fields, state transitions with
     timestamps, ledger entries, notifications, callbacks/retries.
   - US-25: audit record fields: who, when (UTC), action, reason, related
     reference, before/after value for admin changes.
   - US-30: pass condition "after 100 parallel requests the sum of ledger
     entries equals the wallet balance".
   - NFR-6: "domain logic" = Fees and Commissions, Payment Processing
     state logic, Ledger/Wallet, Fraud Checks.

7. New decisions
   Continue the numbering from requirements.md section 9, same columns
   (# | Question / ambiguity | Source | Decision):
   - Q17: commission rounding = half up to 2 decimals.
   - Q18: AquaCo required field (assumption).
   - Q19: NetCo required field (assumption).

8. Additional planned tests
   Table: Story/NFR | Planned test name. Add: test_error_codes_returned,
   test_boundary_limits, test_fee_and_commission_examples,
   test_ledger_entries_per_transition, test_idempotency_key_expires_after_24h,
   test_retry_schedule_1_5_15, test_audit_record_fields.

9. Change history
   One row: version 1.0 of specs.md, date and author placeholders.

CONSTRAINTS
- Do not rewrite or reproduce requirements.md. Refer to it by ID only.
- Do not add new user stories, FRs or features.
- Money uses exact decimal values with 2 decimals, never floats.
- Do not contradict decisions Q1 to Q16 or section 5 of requirements.md.
  If one of the six points conflicts with existing content, do not guess:
  list the conflict at the end.
- Use only numbers from requirements.md and the brief. Label any other
  assumption "Assumption".
- Use Markdown tables, same style and tone as requirements.md.

OUTPUT FORMAT
1. The complete specs.md in one Markdown code block, ready to save as
   /docs/specs.md.
2. After it, a "Please verify" list with every calculated value, every
   assumption, and any conflict with requirements.md.
```

Answer summary: Requested applying six specificity changes to `requirements.md` (prompt and answer text not provided).
Verdict: TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why)

### P-04: Put the six changes in a separate specs.md file

```text
ROLE
You are a senior business analyst and QA engineer working on a Phase 1
requirements pack for a university project (PayLink, an Egyptian
bill-payment wallet backend). You write precise, testable requirements
in Given/When/Then style.

CONTEXT
The attached file requirements.md is our current requirements pack (v1.0).
It has 30 user stories (US-01 to US-30), 10 NFRs, decisions Q1 to Q16,
a traceability table and business rules in section 5.
Grading criterion: "complete, testable, prioritised, ambiguities resolved".
We do NOT want to edit requirements.md and we do NOT want new features or
new user stories. Instead, create ONE NEW FILE called specs.md
(path: /docs/design/specs.md) that adds specific, testable detail on top of the
existing stories. specs.md is a companion to requirements.md and refers to
its IDs (US-xx, NFR-x, Qx, section numbers).

TASK
Create specs.md with the following structure and content.

Header
- Title "PayLink: Detailed Specifications (companion to requirements.md)".
- A short note: "This file refines requirements.md v1.0. If the two
  disagree, this file's amendments in section 6 apply."
- Same team/version/date table as requirements.md, with placeholders left
  as they are.

1. Error and reason codes
   Table: Code | Used when | Customer message | Story.
   Include at least: ALREADY_REGISTERED, INVALID_AMOUNT, BILL_NOT_FOUND,
   NO_LIVE_INQUIRY, BILLER_UNAVAILABLE, ABOVE_MAX_SINGLE, BELOW_MIN_SINGLE,
   DAILY_LIMIT_EXCEEDED, INSUFFICIENT_FUNDS, VELOCITY_BLOCKED,
   ACCOUNT_BLOCKED, IDEMPOTENCY_CONFLICT, ILLEGAL_TRANSITION,
   BILLER_REFUSED, PAYMENT_PROCESSING.
   Every code must name the existing story it comes from (US-01, 04, 06,
   08, 09, 10, 11, 13, 15, 18, 19, 21).

2. Boundary values
   Table: Rule | Accepted value | Rejected value | Expected code | Story.
   Cover: single min (5.00 / 4.99), single max (10,000.00 / 10,000.01),
   daily limit basic (total reaches 5,000.00 / 5,000.01), daily limit
   verified (30,000.00 / 30,000.01), velocity (5th payment in 60 s allowed,
   6th blocked; "more than 5" means the 6th is the first blocked), internet
   fee (200.00 gives 2.00, 200.01 gives 4.00), and one mobile top-up amount
   that hits the 1 EGP minimum fee.
   Then add Given/When/Then lines for each boundary, labelled with the
   story they extend (US-16, US-18, US-19).

3. Fee and commission worked examples
   Table: Service | Bill amount | Fee | Total charged | Agent commission
   (40%). Rows: electricity 350.00; water 120.00; mobile 120.00; mobile
   40.00; internet 200.00; internet 200.01; any biller during a promotion.
   Compute every value with decimal arithmetic, half-up rounding to 2
   decimals (decision Q4), and show the calculation in a note under the
   table so I can verify it.

4. Ledger entries per transition
   First list the ledger accounts used (customer available, customer held,
   biller payable, PayLink fee income, agent wallet, commission expense).
   Then a table: Event | Ledger entries (account, direction, amount).
   Use the example bill 350.00 + fee 2.50 = 352.50. Cover: hold
   (Initiated to FundsHeld), Completed, Completed via agent (commission
   1.00), Failed to Refunded, Unknown (no new entries, hold stays), and
   Rejected (no entries).
   State that every transition and its ledger entries are written in ONE
   database transaction and that the entries of each payment sum to zero
   (double-entry). It must be consistent with US-05, US-09, US-12, US-17,
   Q13 and the rule that an Unknown payment is never refunded
   automatically.

5. Required fields per biller
   Table: Biller | Service | Required input fields | Live inquiry?
   Rows: ElectroCo (meter number, live), AquaCo (subscriber/account
   number), TopUpNet (phone number and amount, no bill inquiry), NetCo
   (customer/account number, no live inquiry).
   The brief does not name the AquaCo and NetCo field names, so mark those
   two as "Assumption, to be confirmed with the instructor's biller
   contract". Do not invent anything else about the billers.

6. Amendments to existing acceptance criteria
   Table: Item | Current text (short quote or summary) | Added or changed
   criterion. Cover exactly:
   - US-10: key kept 24 hours; after that the same key is a new request.
   - US-13: retries at 1, 5 and 15 minutes after the timeout; each attempt
     recorded in the payment history.
   - US-20: "full history" = payment fields, state transitions with
     timestamps, ledger entries, notifications, callbacks/retries.
   - US-25: audit record fields: who, when (UTC), action, reason, related
     reference, before/after value for admin changes.
   - US-30: pass condition "after 100 parallel requests the sum of ledger
     entries equals the wallet balance".
   - NFR-6: "domain logic" = Fees and Commissions, Payment Processing
     state logic, Ledger/Wallet, Fraud Checks.

7. New decisions
   Continue the numbering from requirements.md section 9, same columns
   (# | Question / ambiguity | Source | Decision):
   - Q17: commission rounding = half up to 2 decimals.
   - Q18: AquaCo required field (assumption).
   - Q19: NetCo required field (assumption).

8. Additional planned tests
   Table: Story/NFR | Planned test name. Add: test_error_codes_returned,
   test_boundary_limits, test_fee_and_commission_examples,
   test_ledger_entries_per_transition, test_idempotency_key_expires_after_24h,
   test_retry_schedule_1_5_15, test_audit_record_fields.

9. Change history
   One row: version 1.0 of specs.md, date and author placeholders.

CONSTRAINTS
- Do not rewrite or reproduce requirements.md. Refer to it by ID only.
- Do not add new user stories, FRs or features.
- Money uses exact decimal values with 2 decimals, never floats.
- Do not contradict decisions Q1 to Q16 or section 5 of requirements.md.
  If one of the six points conflicts with existing content, do not guess:
  list the conflict at the end.
- Use only numbers from requirements.md and the brief. Label any other
  assumption "Assumption".
- Use Markdown tables, same style and tone as requirements.md.

OUTPUT FORMAT
1. The complete specs.md in one Markdown code block, ready to save as
   /docs/design/specs.md.
2. After it, a "Please verify" list with every calculated value, every
   assumption, and any conflict with requirements.md.
```

Answer summary: Created `specs.md` (sections 1–9) refining `requirements.md` v1.0, plus a verification list of calculated values, assumptions, and alignment notes.
Verdict: TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why)

### P-05: Split specs.md into six small files

```text
ROLE
You are a senior business analyst and technical writer organizing the Phase 1
documentation of a university project (PayLink, an Egyptian bill-payment
wallet backend). You split documents without losing, changing or duplicating
content.

CONTEXT
Attached:
- specs.md: a detailed specification file that is a companion to
  requirements.md. It has these parts: (1) error and reason codes,
  (2) boundary values, (3) fee and commission worked examples, (4) ledger
  entries per transition, (5) required fields per biller, (6) amendments to
  existing acceptance criteria (US-10, US-13, US-20, US-25, US-30, NFR-6),
  (7) new decisions Q17 to Q19, (8) additional planned tests,
  (9) change history.
- requirements.md: reference only. DO NOT modify it, reproduce it, or
  output it.

TASK
Split specs.md into six smaller files. Every point of specs.md must go into
exactly one of the files below (no point lost, no point in two files). The
content stays word for word; only add what is listed under "Allowed
additions".

Target files and exact paths:
1. docs/design/specs/business-rules.md
2. docs/design/specs/state-transactions.md
3. docs/design/specs/ledger-rules.md
4. docs/design/specs/module-interfaces.md
5. docs/design/specs/hard-cases.md
6. docs/design/specs/pattern-plan.md

Assignment of content (follow this mapping):
- business-rules.md: boundary values table and its Given/When/Then lines
  (specs part 2); fee and commission worked examples with the calculation
  note (part 3); decision Q17 (commission rounding); the planned tests
  test_boundary_limits and test_fee_and_commission_examples.
- state-transactions.md: the US-13 amendment (retries at 1, 5 and 15 minutes,
  each attempt recorded in the payment history); the rules about the Unknown
  state that appear in specs.md; planned test test_retry_schedule_1_5_15.
- ledger-rules.md: the ledger accounts list and the "ledger entries per
  transition" table with the one-database-transaction and sum-to-zero rules
  (part 4); the US-25 amendment (audit record fields); planned tests
  test_ledger_entries_per_transition and test_audit_record_fields.
- module-interfaces.md: the error and reason codes catalog (part 1); the
  required fields per biller table (part 5); decisions Q18 and Q19; the US-20
  amendment ("full history" definition); planned test
  test_error_codes_returned.
- hard-cases.md: the US-10 amendment (idempotency key kept 24 hours); the
  US-30 amendment (pass condition: after 100 parallel requests the ledger sum
  equals the wallet balance); planned test
  test_idempotency_key_expires_after_24h.
- pattern-plan.md: the NFR-6 amendment (definition of "domain logic" =
  Fees and Commissions, Payment Processing state logic, Ledger/Wallet,
  Fraud Checks). specs.md has little pattern content, so also add a short
  table "Pattern | Problem it solves | Module" using ONLY the patterns the
  project brief suggests: Adapter and Factory (billers), Strategy (fees),
  State (payment), Chain of Responsibility (fraud checks), Observer
  (notifications), Command (retries). Add one column "Related spec file"
  pointing to the matching file from the list above. Do not invent folders,
  class names or code.

The specs.md header note and the change-history part (9) are handled by the
"Allowed additions" below, not copied as separate content.

Allowed additions (nothing else may be added):
- A header in every file: title, one-line purpose, "Part of the PayLink
  specs, companion to requirements.md v1.0", and the same team/version/date
  placeholders as specs.md (leave placeholders as they are).
- A "Related files" line at the end of every file that links to the other
  files it depends on (relative links), for example business-rules.md links
  to module-interfaces.md for the error codes.
- A small change-history table in every file with one row: version 1.0,
  date and author placeholders, "Split from specs.md".
- In hard-cases.md only: an index table of the 8 hard cases from the brief
  (hard case number | situation | related US id | planned test name),
  using only the data already in requirements.md section 10 and the brief.
  Label it "Index (from requirements.md section 10)".
- If a file ends up with almost no content from specs.md, say so in the
  report instead of inventing content.

CONSTRAINTS
- requirements.md stays untouched. Do not output a changed version of it.
- Do not change, shorten, reword or recompute any value, table row, story ID
  or decision from specs.md. Copy them exactly.
- Do not add new requirements, user stories, features, numbers or
  assumptions. If something in specs.md fits two files, use the mapping above;
  if it fits none, put it in the closest file and list it in the report.
- References between files use story, NFR and decision IDs (US-xx, NFR-x, Qx)
  and relative links.
- Use Markdown tables in the same style as specs.md.
- Money values keep exactly two decimals.

OUTPUT FORMAT
1. Six separate Markdown code blocks, one per file. Put the exact path as the
   line before each code block, in this order: business-rules,
   state-transactions, ledger-rules, module-interfaces, hard-cases,
   pattern-plan.
2. After them, a "Coverage check" table: specs.md part / item | destination
   file. Every part and every amendment, decision and planned test of specs.md
   must appear exactly once.
3. A "Please verify" list: anything you placed by judgment, any file with
   little content, and any conflict with requirements.md.
```

Answer summary: Requested splitting `specs.md` into six smaller files (prompt and answer text not provided).
Verdict: TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why)

### P-06: Split specs.md and delete it afterwards

```text
ROLE
You are a senior business analyst and technical writer organizing the Phase 1
documentation of a university project (PayLink, an Egyptian bill-payment
wallet backend). You split documents without losing, changing or duplicating
content.

CONTEXT
Attached:
- specs.md: a detailed specification file that is a companion to
  requirements.md. It has these parts: (1) error and reason codes,
  (2) boundary values, (3) fee and commission worked examples, (4) ledger
  entries per transition, (5) required fields per biller, (6) amendments to
  existing acceptance criteria (US-10, US-13, US-20, US-25, US-30, NFR-6),
  (7) new decisions Q17 to Q19, (8) additional planned tests,
  (9) change history.
- requirements.md: reference only. DO NOT modify it, reproduce it, or
  output it.

specs.md is a temporary file. After the split it is DELETED, so that no
content exists twice. The six new files become the only source of these
specifications.

TASK
Step 1: Split specs.md into six smaller files. Every point of specs.md must
go into exactly one of the files below (no point lost, no point in two
files). The content stays word for word; only add what is listed under
"Allowed additions".

Target files and exact paths:
1. docs/design/specs/business-rules.md
2. docs/design/specs/state-transactions.md
3. docs/design/specs/ledger-rules.md
4. docs/design/specs/module-interfaces.md
5. docs/design/specs/hard-cases.md
6. docs/design/specs/pattern-plan.md

Assignment of content (follow this mapping):
- business-rules.md: boundary values table and its Given/When/Then lines
  (specs part 2); fee and commission worked examples with the calculation
  note (part 3); decision Q17 (commission rounding); the planned tests
  test_boundary_limits and test_fee_and_commission_examples.
- state-transactions.md: the US-13 amendment (retries at 1, 5 and 15 minutes,
  each attempt recorded in the payment history); the rules about the Unknown
  state that appear in specs.md; planned test test_retry_schedule_1_5_15.
- ledger-rules.md: the ledger accounts list and the "ledger entries per
  transition" table with the one-database-transaction and sum-to-zero rules
  (part 4); the US-25 amendment (audit record fields); planned tests
  test_ledger_entries_per_transition and test_audit_record_fields.
- module-interfaces.md: the error and reason codes catalog (part 1); the
  required fields per biller table (part 5); decisions Q18 and Q19; the US-20
  amendment ("full history" definition); planned test
  test_error_codes_returned.
- hard-cases.md: the US-10 amendment (idempotency key kept 24 hours); the
  US-30 amendment (pass condition: after 100 parallel requests the ledger sum
  equals the wallet balance); planned test
  test_idempotency_key_expires_after_24h.
- pattern-plan.md: the NFR-6 amendment (definition of "domain logic" =
  Fees and Commissions, Payment Processing state logic, Ledger/Wallet,
  Fraud Checks). specs.md has little pattern content, so also add a short
  table "Pattern | Problem it solves | Module" using ONLY the patterns the
  project brief suggests: Adapter and Factory (billers), Strategy (fees),
  State (payment), Chain of Responsibility (fraud checks), Observer
  (notifications), Command (retries). Add one column "Related spec file"
  pointing to the matching file from the list above. Do not invent folders,
  class names or code.

The specs.md header note and the change-history part (9) are handled by the
"Allowed additions" below, not copied as separate content.

Allowed additions (nothing else may be added):
- A header in every file: title, one-line purpose, "Part of the PayLink
  specs, companion to requirements.md v1.0", and the same team/version/date
  placeholders as specs.md (leave placeholders as they are).
- In every file that contains an amendment to a story or NFR of
  requirements.md, one note under the header: "Where this file amends a
  story or NFR of requirements.md, this file applies."
- A "Related files" line at the end of every file that links to the other
  files it depends on (relative links), for example business-rules.md links
  to module-interfaces.md for the error codes.
- A small change-history table in every file with one row: version 1.0,
  date and author placeholders, "Split from the former specs.md (removed)".
  This is plain text, not a link.
- In hard-cases.md only: an index table of the 8 hard cases from the brief
  (hard case number | situation | related US id | planned test name),
  using only the data already in requirements.md section 10 and the brief.
  Label it "Index (from requirements.md section 10)".
- If a file ends up with almost no content from specs.md, say so in the
  report instead of inventing content.

Step 2: Coverage check. Build a table: specs.md part / item | destination
file. Every part, amendment, decision and planned test of specs.md must
appear exactly once. If any item has no destination, STOP, fix the split and
repeat the check. Do not go to step 3 until every item is covered.

Step 3: Delete specs.md. Only after the coverage check is complete:
- If you have file system or git access in this environment, delete
  specs.md (for example: git rm docs/specs.md) and confirm that it is gone.
- If you do not have file access, do not claim that you deleted it. Instead
  print the exact command for me to run: git rm docs/specs.md
  (and adjust the path if specs.md is elsewhere).
- Then confirm that no remaining file contains a link or reference to
  specs.md (a "Split from the former specs.md (removed)" text in a change
  history is allowed, a link is not).

CONSTRAINTS
- requirements.md stays untouched. Do not output a changed version of it.
- Do not change, shorten, reword or recompute any value, table row, story ID
  or decision from specs.md. Copy them exactly.
- Do not add new requirements, user stories, features, numbers or
  assumptions. If something in specs.md fits two files, use the mapping above;
  if it fits none, put it in the closest file and list it in the report.
- No content may exist in two files. No file may link to specs.md.
- References between files use story, NFR and decision IDs (US-xx, NFR-x, Qx)
  and relative links.
- Use Markdown tables in the same style as specs.md.
- Money values keep exactly two decimals.

OUTPUT FORMAT
1. Six separate Markdown code blocks, one per file. Put the exact path as the
   line before each code block, in this order: business-rules,
   state-transactions, ledger-rules, module-interfaces, hard-cases,
   pattern-plan.
2. The "Coverage check" table from step 2.
3. The result of step 3: either "specs.md deleted" with the confirmation, or
   the exact git command for me to run, plus the result of the no-link check.
4. A "Please verify" list: anything you placed by judgment, any file with
   little content, and any conflict with requirements.md.
```

Answer summary: Split `specs.md` into six files under `docs/design/specs/`, provided coverage check, deleted `specs.md`, ran no-link check, and listed verification items.
Verdict: TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why)

### P-07: Create prompt-log.md

```text
ROLE
You are a technical writer and project documentation assistant. You record
AI prompts exactly as they were written and you never invent facts about
what happened.

CONTEXT
PayLink is a university year-work project (an Egyptian bill-payment wallet
backend). Phase 1 requires a prompt log: a table with the columns
Date | Author | Stage | Tool and model | Prompt | Summary of answer |
Verdict (accepted, fixed, rejected) and why. The grading criterion is
"structured prompts, honest verdicts". The log must be honest: a verdict
must come from the team, not from you.

We used an AI assistant to create the specification files of Phase 1. I will
give you every prompt used, in order, between the markers below.

TASK
Create ONE new file: docs/design/specs/prompt-log.md
(same folder as business-rules.md, state-transactions.md, ledger-rules.md,
module-interfaces.md, hard-cases.md and pattern-plan.md).

The file must contain these parts, in this order:

1. Header
   Title "PayLink: Prompt Log (Phase 1, specification files)", one line of
   purpose, the same team / version / date placeholders used in the other
   spec files (leave them as placeholders), and a short note: "Part of the
   PayLink specs, companion to requirements.md v1.0."

2. Summary table (one row per prompt, in the order given)
   Columns: ID | Date | Author | Stage | Tool and model | Prompt (title and
   link to the full text in part 3) | Summary of answer (max 2 lines) |
   Verdict and why.
   - ID: P-01, P-02, ... in order.
   - Stage: use "Requirements" for P-01 to P-04, "Documentation structure"
     for P-05 and P-06, "Process / logging" for P-07. If I give another
     stage for an entry, use mine.
   - Date: use the date I give. If none is given, write "YYYY-MM-DD" as a
     placeholder.
   - Author and Tool and model: placeholders "[Author]" and
     "[Tool, model]" unless I give them.
   - Summary of answer: describe only what the answer contained, based on
     the answer text if I paste it, or on the prompt's own requested output
     if I do not. Never claim the answer was correct or wrong.
   - Verdict and why: write exactly "TO BE FILLED BY THE TEAM
     (accepted / fixed / rejected, and why)" unless I give a verdict for
     that entry. Do NOT choose a verdict yourself.

3. Full prompts
   One subsection per entry with the heading "### P-xx: <title>" (so that
   the table links work), the prompt copied word for word inside a code
   block, and below it two short lines: "Answer summary:" (same as the
   table) and "Verdict:" (same as the table). Do not shorten, fix or
   improve any prompt text.

4. Prompt evolution
   A short table: From | To | What changed in the prompt | Why. Fill it only
   with changes visible in the prompts I gave you, for example:
   - P-03 to P-04: the changes were moved from requirements.md into a new,
     separate specs.md file.
   - P-05 to P-06: after the split, specs.md is deleted to avoid duplicate
     content.
   Do not add entries that are not visible in the prompts.

5. Honesty checklist (for the team)
   A short checklist the team completes before submission:
   - Every verdict is written by a team member, with a reason.
   - At least 5 entries exist.
   - At least 2 entries where the first AI answer was wrong and the prompt
     was improved are marked as such.
   - No password, secret or real personal data appears in any prompt.
   - The AI tool and model are named for every entry.
   Leave all boxes unchecked.

6. Change history
   One row: version 1.0, date and author placeholders, "First version".

THE PROMPTS (in order)
Entries are between the markers. Each entry has a title, an optional date,
tool, author and verdict, and the prompt text.

[PASTE P-01 HERE: title "Ask what specs can be added to requirements.md";
 prompt text: "If I need to add specs what can I add??" together with the
 attached brief and requirements.md]
[PASTE P-02 HERE: title "Make requirements.md more specific (no new scope)";
 prompt text: "I don't need add other things, but I need to be specific with
 the Requirements.md, what can I add??"]
[PASTE P-03 HERE: title "Apply the six specificity changes to
 requirements.md"; the first structured prompt]
[PASTE P-04 HERE: title "Put the six changes in a separate specs.md file";
 the modified prompt]
[PASTE P-05 HERE: title "Split specs.md into six small files"]
[PASTE P-06 HERE: title "Split specs.md and delete it afterwards"]
[PASTE P-07 HERE: title "Create prompt-log.md"; this prompt itself]

CONSTRAINTS
- Do not change requirements.md or any other spec file.
- Do not invent dates, authors, tools, models, verdicts, results or
  statements about answer quality. Use placeholders where I gave nothing.
- Copy prompts exactly. If a prompt is missing, keep its heading and write
  "PROMPT NOT PROVIDED: paste it here" in the code block, and list it in
  the report.
- Do not add entries that I did not give you.
- Keep Markdown valid: the table must have one line per row, no line breaks
  inside cells.
- Do not link to specs.md (it no longer exists).

OUTPUT FORMAT
1. The complete prompt-log.md in one Markdown code block, with the exact
   path docs/design/specs/prompt-log.md on the line before it.
2. A "Please fill in" list: every placeholder and every verdict still empty.
3. A "Please verify" list: any prompt that was missing or that you could not
   copy exactly.
```

Answer summary: Created `docs/design/specs/prompt-log.md` with header, summary table, full prompts, evolution table, honesty checklist, and change history, plus fill-in and verification lists.
Verdict: TO BE FILLED BY THE TEAM (accepted / fixed / rejected, and why)

### P-08: Create payment state diagram

```text
ROLE
You are a senior software architect and Mermaid specialist helping a student team on PayLink (Egypt bill-payment and wallet backend). Correctness with money matters more than cleverness.

CONTEXT (read first)
AGENTS.md, your rules files (phase-1-scope, diagrams, money-and-domain, requirements-writing, ai-use-and-git), docs/requirements.md (section 5 holds the full transition table; section 9 the decisions), and the specs in docs/design/specs/ (the state spec may be named state-transactions.md or state-transitions.md; it only holds Unknown-state amendments). Read any existing diagrams in docs/design/diagrams/. If two files disagree, stop and tell me which lines conflict.

TASK
Create docs/design/diagrams/state-payment.mmd: a Mermaid stateDiagram-v2 of the payment life cycle. Mermaid only, no PlantUML, no images. Follow the /new-diagram workflow.

IT MUST CONTAIN EXACTLY
- Eight states, exact names: Initiated, FundsHeld, SentToBiller, Completed, Failed, Unknown, Refunded, Rejected. No synonyms (not Pending/Success/Paid).
- One initial arrow: [*] --> Initiated.
- Exactly these 9 transitions, each labelled with its event:
  1. Initiated -> FundsHeld: fraud checks pass and funds sufficient
  2. Initiated -> Rejected: fraud check fails or insufficient funds
  3. FundsHeld -> SentToBiller: request sent to biller
  4. SentToBiller -> Completed: biller confirms
  5. SentToBiller -> Failed: biller refuses
  6. SentToBiller -> Unknown: no answer within 10 s timeout
  7. Unknown -> Completed: biller later confirms (callback, retry or settlement)
  8. Unknown -> Failed: biller later refuses, or reconciliation finds no payment
  9. Failed -> Refunded: hold released to wallet
- Final markers (state --> [*]) ONLY on Completed, Rejected and Refunded. Failed and Unknown are NOT final.
- No other arrows: no self-loops, nothing leaving a final state, no Unknown -> Refunded, no Failed -> Completed. Retries that do not change state are explained in notes, not drawn.
- Notes: on Unknown ("never refunded automatically; re-query 1, 5 and 15 minutes after the timeout, each attempt recorded; then waits for reconciliation"); on SentToBiller ("10 s timeout for live billers; TopUpNet stays here after 'accepted' until callback or reconciliation, Q10"); on Failed ("hold released including the fee, Q13").

CONSTRAINTS
- First lines are %% comments: purpose, last updated 2026-11-25, related stories US-11, US-12, US-13, US-14, US-26 and FR-11, FR-12, FR-13.
- Avoid Mermaid pitfalls: no semicolons in labels, quote labels with special characters.
- After the diagram, add a %% comment listing the 9 transitions so a reviewer can tick them off.

WORKFLOW
1. Plan first: list the states and 9 transitions you will draw and any ambiguity with a proposed default. STOP and wait for my OK.
2. After OK, write the file.
3. Check it renders: try npx -y @mermaid-js/mermaid-cli -i <file> -o <temp svg> (do not commit the output). If you cannot run it, say so; never claim it renders without checking.
4. Count the arrows (must be 1 initial + 9 transitions + 3 finals) and compare with requirements.md section 5 and with the other diagrams/specs. List every mismatch; fix those inside this file.
5. Log: append a row to docs/design/specs/prompt-log.md (create it with the header if empty or missing; do NOT write docs/prompt-log.md). Columns: Date (2026-11-25) | Author (<YOUR NAME>) | Stage (Design) | Tool and model (<tool/model>) | Prompt (this prompt verbatim; if over 15 lines, put it in a "Full prompts" section at the bottom and reference it) | Summary of answer (2 lines) | Verdict: "DRAFT: verdict pending" + a list of what was wrong, missing or risky in your FIRST version. Never invent the verdict.
6. Git: new branch docs/diagram-state-payment, commit "docs: add payment state diagram (AI: Antigravity/<model>)", push the branch. Do not merge, push to main, force-push or create tags. Tell me to open the PR for teammate review.

OUTPUT FORMAT
Step 1: the plan. After my OK: file path, how you checked rendering, mismatch list, the prompt-log row, commit/push result.
```

Answer summary: Created `docs/design/diagrams/state-payment.mmd`: Mermaid stateDiagram-v2 with 8 states, 9 transitions, 3 final markers, 3 notes. Cross-checked against requirements.md §5 and all spec files; 0 mismatches.
Verdict: DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. File naming note: AGENTS.md line 22 references `state-transitions.md` but actual file is `state-transactions.md`.

### P-09: Create domain class diagram

```text
ROLE
You are a senior software architect and Mermaid specialist helping a student team on PayLink (Egypt bill-payment and wallet backend). Correctness with money matters more than cleverness.

CONTEXT (read first)
AGENTS.md, your rules files (phase-1-scope, diagrams, money-and-domain, requirements-writing, ai-use-and-git), docs/requirements.md (glossary section 4, rules section 5, stories section 6, decisions section 9), all specs in docs/design/specs/ (especially ledger-rules, module-interfaces, business-rules, pattern-plan) and any existing diagrams (state-payment.mmd must already exist; reuse its eight states). If two files disagree, stop and tell me which lines conflict.

TASK
Create docs/design/diagrams/class-domain.mmd: a Mermaid classDiagram of the PayLink DOMAIN model. Mermaid only, no PlantUML, no images. Follow the /new-diagram workflow.

IT MUST CONTAIN
- Candidate classes (propose the final list in your plan, use these names, no synonyms): Account (role CUSTOMER/AGENT/ADMIN/SUPPORT, verificationLevel BASIC/VERIFIED, status ACTIVE/BLOCKED, blockedUntil), Wallet, LedgerEntry, Payment, PaymentStateHistory, PaymentStatus (<<enumeration>> with exactly the 8 states), IdempotencyRecord, Biller, BillerService, BillerField (required input field such as meter number), FeeRule, Promotion, Notification, NotificationTemplate, BillerCallback, RetryAttempt, SettlementFile, ReconciliationItem, AuditRecord, ConfigEntry. RefundRequest is optional and must be marked Could (US-27).
- Wallet shows availableBalance() and heldBalance() as DERIVED values computed from LedgerEntry. Wallet has NO stored balance attribute. LedgerEntry is append-only and has: id, wallet, ledgerAccount (enumeration: customer available, customer held, biller payable, PayLink fee income, agent wallet, commission expense), direction/signed amount (use ONE convention consistent with ledger-rules.md), paymentReference, createdAt (UTC), actor, reason.
- Money attributes typed as Decimal (EGP, 2 dp). Never float or double.
- Payment has: reference, idempotency key, customer account, optional agent account, billerService, billAmount, feeAmount, totalAmount, status (PaymentStatus), createdAt. Commission is a ledger entry, not a stored balance.
- Relationships with multiplicities and verbs, e.g. Account 1 -- 1..* Wallet, Wallet 1 -- * LedgerEntry, Payment 1 -- * PaymentStateHistory, Payment 1 -- * LedgerEntry, Biller 1 -- * BillerService, BillerService 1 -- * BillerField, Payment 1 -- * Notification, Payment 1 -- * RetryAttempt, SettlementFile 1 -- * ReconciliationItem.
- Group classes by the module names from the brief (Accounts and Wallet, Biller Catalog, Payment Processing, Biller Integration, Fees and Commissions, Notifications, Fraud Checks, Reconciliation) using namespace blocks if your renderer supports them, otherwise %% section comments. Audit and Configuration are shared services, NOT modules; say so in a comment.

CONSTRAINTS
- Domain model only: no controllers, no repositories, no design-pattern classes (patterns are Phase 2). No business logic beyond the derived balances.
- Use the exact names from the glossary and AGENTS.md. Class names must map one-to-one to the ER entities (ER will use UPPER_SNAKE singular, e.g. LedgerEntry -> LEDGER_ENTRY).
- First lines are %% comments: purpose, last updated 2026-11-25, related US/FR ids (US-01 to US-07, US-09 to US-14, US-16 to US-26 as relevant, FR-1 to FR-28).
- If it exceeds ~20 classes and gets unreadable, split into class-domain.mmd (core) plus a second file and tell me.

WORKFLOW
1. Plan first: list the classes, key attributes and relationships, plus any ambiguity with a proposed default (for example, which wallet owns biller payable, fee income and commission expense accounts: propose a default and add it as Q21 in requirements.md section 9 only after I approve). STOP and wait for my OK.
2. After OK, write the file.
3. Check it renders: try npx -y @mermaid-js/mermaid-cli -i <file> -o <temp svg> (do not commit output). If you cannot run it, say so.
4. Compare with state-payment.mmd, the specs and requirements. Check: 8 states identical, Wallet has no stored balance, every Must story has a home class. List every mismatch; fix those inside this file.
5. Log: append a row to docs/design/specs/prompt-log.md (create it with the header if missing; do NOT write docs/prompt-log.md). Columns: Date (2026-11-25) | Author (<YOUR NAME>) | Stage (Design) | Tool and model (<tool/model>) | Prompt (verbatim; if over 15 lines put it in a "Full prompts" section at the bottom and reference it) | Summary of answer (2 lines) | Verdict: "DRAFT: verdict pending" + what was wrong, missing or risky in your FIRST version. Never invent the verdict.
6. Git: branch docs/diagram-class-domain, commit "docs: add domain class diagram (AI: Antigravity/<model>)", push the branch. No merge, no push to main, no force-push, no tags. Tell me to open the PR.

OUTPUT FORMAT
Step 1: the plan. After my OK: file path, how you checked rendering, mismatch list, the prompt-log row, commit/push result.
```

Answer summary: Created `docs/design/diagrams/class-domain.mmd` with 21 domain classes + 2 enums grouped by module, derived Wallet balances, append-only LedgerEntry, and Q20 in `requirements.md`.
Verdict: DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Check if 23 nodes in one file is readable or should be split.

### P-10: Create ER diagram

```text
ROLE
You are a senior database designer and Mermaid specialist helping a student team on PayLink (Egypt bill-payment and wallet backend). Correctness with money matters more than cleverness.

CONTEXT (read first)
AGENTS.md, your rules files (phase-1-scope, diagrams, money-and-domain, requirements-writing, ai-use-and-git), docs/requirements.md (sections 4, 5, 6, 9), all specs in docs/design/specs/ (ledger-rules, module-interfaces, business-rules, hard-cases) and the existing diagrams class-domain.mmd and state-payment.mmd. If two files disagree, stop and tell me which lines conflict.

TASK
Create docs/design/diagrams/er-diagram.mmd: a Mermaid erDiagram of the PayLink relational database. Mermaid only, no PlantUML, no images. Follow the /new-diagram workflow.

IT MUST CONTAIN
- At least 10 tables (the brief requires it); aim for about 15-18, derived from the class-domain model. Entity names are the class names in UPPER_SNAKE singular (LedgerEntry -> LEDGER_ENTRY, Account -> ACCOUNT). Include at least: ACCOUNT, WALLET, LEDGER_ENTRY, PAYMENT, PAYMENT_STATE_HISTORY, IDEMPOTENCY_RECORD, BILLER, BILLER_SERVICE, BILLER_FIELD, FEE_RULE, PROMOTION, NOTIFICATION, BILLER_CALLBACK, RETRY_ATTEMPT, SETTLEMENT_FILE, RECONCILIATION_ITEM, AUDIT_RECORD, CONFIG_ENTRY (add NOTIFICATION_TEMPLATE and REFUND_REQUEST only if they fit; mark REFUND_REQUEST as Could).
- WALLET has NO available_balance or held_balance column. Add an attribute comment stating balances are derived from LEDGER_ENTRY. LEDGER_ENTRY: id PK, wallet_id FK, ledger_account (the six accounts in ledger-rules.md), amount with direction (same convention as ledger-rules.md and the class diagram), payment_id FK (nullable for top-ups), created_at UTC, actor_id, reason. Comment: append-only, no updates or deletes.
- PAYMENT: reference UK, status (the 8 exact states), bill_amount, fee_amount, total_amount, customer_account_id FK, agent_account_id FK nullable, biller_service_id FK, created_at. PAYMENT_STATE_HISTORY records every transition with timestamp.
- IDEMPOTENCY_RECORD: unique per (account_id, key), request hash for conflict detection, expires_at = created + 24 hours (Q9).
- AUDIT_RECORD: who, when UTC, action, reason, related reference, before/after value (US-25, ledger-rules amendment). Comment: cannot be edited or deleted.
- Money columns use type decimal (NOT float). Mermaid does not allow commas in types, so write "decimal" and put "EGP 2 dp" in the attribute comment.
- Mark PK, FK, UK. Correct cardinalities (||--o{ etc.) with relationship verbs.
- Business-rule numbers (limits, fees, timeouts, retries) are CONFIG_ENTRY / FEE_RULE rows, never columns hard-coded in the diagram.

CONSTRAINTS
- Database model only, Phase 1: no migrations and no SQL files (the SQL draft is another task). Do not write docs/design/db/schema-draft.sql.
- First lines are %% comments: purpose, last updated 2026-11-25, related US/FR ids and the entity-name mapping rule.
- Names must match class-domain.mmd one-to-one. Report any class without a table and any table without a class.

WORKFLOW
1. Plan first: list the tables with their key columns and relationships, plus ambiguities with proposed defaults. In particular: how system ledger accounts (biller payable, PayLink fee income, commission expense) are owned. Propose a default (for example nullable wallet_id plus a biller_id for biller payable, or system wallets owned by a SYSTEM account) and offer it as Q21 for requirements.md section 9 (Q16-Q19 are taken; Q20 is reserved for the limits-check order). STOP and wait for my OK.
2. After OK, write the file.
3. Check it renders: try npx -y @mermaid-js/mermaid-cli -i <file> -o <temp svg> (do not commit output). If you cannot run it, say so.
4. Compare with class-domain.mmd, state-payment.mmd, ledger-rules.md and requirements. List every mismatch; fix those inside this file.
5. Log: append a row to docs/design/specs/prompt-log.md (create with header if missing; do NOT write docs/prompt-log.md). Columns: Date (2026-11-25) | Author (<YOUR NAME>) | Stage (Design) | Tool and model (<tool/model>) | Prompt (verbatim; if over 15 lines put it in a "Full prompts" section at the bottom) | Summary of answer (2 lines) | Verdict: "DRAFT: verdict pending" + what was wrong, missing or risky in your FIRST version. Never invent the verdict.
6. Git: branch docs/diagram-er, commit "docs: add ER diagram (AI: Antigravity/<model>)", push the branch. No merge, no push to main, no force-push, no tags. Tell me to open the PR.

OUTPUT FORMAT
Step 1: the plan. After my OK: file path, table count, how you checked rendering, mismatch list, the prompt-log row, commit/push result.
```

Answer summary: Created `docs/design/diagrams/er-diagram.mmd` with 20 tables matching `class-domain.mmd` 1-to-1, derived WALLET balances, append-only LEDGER_ENTRY/AUDIT_RECORD, and renumbered Q20→Q21 in `requirements.md`.
Verdict: DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Flagged and resolved Q20/Q21 numbering conflict from P-09.

### P-11: Create use-case diagram

```text
ROLE
You are a senior business analyst and Mermaid specialist helping a student team on PayLink (Egypt bill-payment and wallet backend). Correctness with money matters more than cleverness.

CONTEXT (read first)
AGENTS.md, your rules files (phase-1-scope, diagrams, money-and-domain, requirements-writing, ai-use-and-git), docs/requirements.md (stakeholders section 2, stories section 6, priorities section 8, traceability section 10) and the specs in docs/design/specs/. If two files disagree, stop and tell me which lines conflict.

TASK
Create docs/design/diagrams/use-case.mmd. Mermaid has no native use-case diagram, so use a flowchart LR that looks like one: actors as rectangle nodes, use cases as stadium nodes ([ ]), a subgraph named "PayLink" as the system boundary, and nested subgraphs per module. Mermaid only, no PlantUML, no images. Follow the /new-diagram workflow.

IT MUST CONTAIN
- Actors: Customer, Agent, Admin, Support Employee; external systems Biller (ElectroCo, AquaCo, TopUpNet, NetCo optional) and SMS/Push Provider; a Scheduler/Timer as a system actor (re-query of Unknown payments, nightly reconciliation, notification retries).
- Use cases labelled with their story id, grouped by module (Accounts and Wallet, Biller Catalog, Payment Processing, Biller Integration, Fees and Commissions, Notifications, Fraud Checks, Reconciliation). Cover every story US-01 to US-28 that has an actor goal. Examples: Customer: register (US-01), view balance and history (US-03), top up (US-04), see billers and fields (US-07), bill inquiry (US-08), pay a bill (US-09), receive SMS and push (US-22), request refund of a completed payment (US-27, mark Could). Agent: pay on behalf of a customer and earn commission (US-17), top up a customer by agent cash (Q14). Admin: manage billers and services (US-06), change fees and limits (US-24), view daily totals (US-28), upgrade to verified (US-02, support/admin). Support: search payment by reference (US-20), block and unblock account (US-21), review reconciliation report (US-26), approve refund (US-27), see undelivered notifications (US-23). Biller: confirm or refuse payment, send TopUpNet callback (US-14), send settlement file (US-26).
- Relationships: association lines between actors and use cases (plain lines, no arrowheads), and dotted arrows labelled <<include>> or <<extend>> between use cases. For example, Pay a bill includes Calculate fee (US-16), Run fraud checks (US-18, US-19), Hold funds (US-12), Call biller (US-15), Notify customer (US-22), Write audit record (US-25); Handle timeout (US-13) extends Pay a bill; Handle callback (US-14) extends Pay a bill.
- Mark priorities: use a Mermaid classDef for Must, Should and Could use cases (colour plus a text tag such as [M], [S], [C] so it is readable in black and white). Priorities must match requirements.md section 8; never downgrade a Must.
- System-rule stories (US-05 ledger balances, US-10 idempotency, US-11 life cycle, US-29 add biller, US-30 concurrency) are not actor goals: put them in a legend or note stating where they are shown (state diagram, sequence diagram, class/ER diagram) rather than inventing actors.

CONSTRAINTS
- Mermaid pitfalls: quote labels with special characters or <<>>, do not use a node called "end" in lowercase, keep node ids unique.
- First lines are %% comments: purpose, last updated 2026-11-25, related US/FR ids (US-01 to US-30).
- Use module names exactly as in the brief. Audit Log and Configuration are shared services, not modules.
- Keep it readable. If more than about 40 use cases, split into use-case.mmd (customer and agent) and use-case-admin-support.mmd and tell me.

WORKFLOW
1. Plan first: list actors, use cases (with story ids) and include/extend links, plus ambiguities with proposed defaults. STOP and wait for my OK.
2. After OK, write the file.
3. Check it renders: try npx -y @mermaid-js/mermaid-cli -i <file> -o <temp svg> (do not commit output). If you cannot run it, say so.
4. Check that every story US-01 to US-30 is either drawn or listed in the legend with its location; compare with requirements section 10. List every mismatch; fix those inside this file.
5. Log: append a row to docs/design/specs/prompt-log.md (create with header if missing; do NOT write docs/prompt-log.md). Columns: Date (2026-11-25) | Author (<YOUR NAME>) | Stage (Design) | Tool and model (<tool/model>) | Prompt (verbatim; if over 15 lines put it in a "Full prompts" section at the bottom) | Summary of answer (2 lines) | Verdict: "DRAFT: verdict pending" + what was wrong, missing or risky in your FIRST version. Never invent the verdict.
6. Git: branch docs/diagram-use-case, commit "docs: add use-case diagram (AI: Antigravity/<model>)", push the branch. No merge, no push to main, no force-push, no tags. Tell me to open the PR.

OUTPUT FORMAT
Step 1: the plan. After my OK: file path, story coverage list, how you checked rendering, mismatch list, the prompt-log row, commit/push result.
```

Answer summary: Created `docs/design/diagrams/use-case.mmd` (`flowchart LR`) with 7 actors, 27 use cases across modules/shared services, priority `classDef`s (`[M]`/`[S]`/`[C]`), and legend for system-rule stories.
Verdict: DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify layout readability of cross-module `<<include>>` edges.

### P-12: Create pay-bill sequence diagram

```text
ROLE
You are a senior software architect and Mermaid specialist helping a student team on PayLink (Egypt bill-payment and wallet backend). Correctness with money matters more than cleverness.

CONTEXT (read first)
AGENTS.md, your rules files (phase-1-scope, diagrams, money-and-domain, requirements-writing, ai-use-and-git), docs/requirements.md (sections 2 to 6 and 9), all specs in docs/design/specs/ (ledger-rules, module-interfaces for the error codes, business-rules, state spec, hard-cases) and the existing diagrams (state-payment.mmd, class-domain.mmd). If two files disagree, stop and tell me which lines conflict.

TASK
Create docs/design/diagrams/sequence-pay-bill.mmd: a Mermaid sequenceDiagram (with autonumber) of "Customer pays an electricity bill from the wallet". Mermaid only, no PlantUML, no images. Follow the /new-diagram workflow.

PARTICIPANTS (module names exactly as in the brief)
Customer (the Agent variant is shown as an opt block), Mobile App, Payment Processing, Accounts and Wallet, Biller Catalog, Fees and Commissions, Fraud Checks, Biller Integration, ElectroCo (external biller), Notifications, SMS/Push Provider (external). Audit Log is a shared service; show it only where a money movement is recorded. A module talks to another only through its public interface.

IT MUST SHOW, IN THIS ORDER (one worked example: bill 350.00 + fee 2.50 = total 352.50, basic customer, wallet with 1,000.00)
0. Idempotency check first (US-10, Q9): alt same key and same payload returns the original result; alt same key with a different payload returns IDEMPOTENCY_CONFLICT.
1. Identify the account, verification level and limits from configuration; check the biller is active (BILLER_UNAVAILABLE if disabled, Q15).
2. Bill inquiry (meter number) to ElectroCo via Biller Integration; alt BILL_NOT_FOUND (no payment created).
3. Fee calculation (2.50, Fees and Commissions) and total 352.50 shown to the customer.
4. Payment created in Initiated; Fraud Checks chain (single min/max on the bill amount, daily limit on bill amounts in the Africa/Cairo day, velocity, blocked account). alt any rule fails: Initiated -> Rejected with the exact code from module-interfaces.md (BELOW_MIN_SINGLE, ABOVE_MAX_SINGLE, DAILY_LIMIT_EXCEEDED, VELOCITY_BLOCKED, ACCOUNT_BLOCKED), no hold and no ledger entry.
5. Hold 352.50 BEFORE the biller call: alt INSUFFICIENT_FUNDS -> Rejected. Otherwise Initiated -> FundsHeld with ledger entries customer available -352.50 and customer held +352.50, written atomically with the state change in one database transaction. Concurrency note (US-30): the wallet row is locked so two simultaneous payments cannot overdraw.
6. FundsHeld -> SentToBiller; call ElectroCo with a unique reference (idempotent) and a 10 s timeout. Then three alt branches:
   a. Biller confirms -> Completed: ledger entries customer held -352.50, biller payable +350.00, PayLink fee income +2.50; opt (payment made via agent): commission expense -1.00 and agent wallet +1.00 (40% of 2.50, half-up). All in one transaction with the state change. Audit records written.
   b. Biller refuses -> Failed -> hold released -> Refunded. Do not repeat the details: add a Note "see sequence-refund-failed.mmd" and show the customer SMS with the reason (AquaCo example in a Note).
   c. Timeout (no answer in 10 s, e.g. ElectroCo answers in 12 s) -> Unknown: no ledger entries, money stays held, customer sees PAYMENT_PROCESSING "being processed". Note: re-query at 1, 5, 15 minutes, each attempt recorded; then waits for reconciliation; NEVER refunded automatically.
7. Notification AFTER the payment result, asynchronous (Observer): Notifications sends SMS and push from a template with amount and reference. Show SMS provider failure with up to 3 retries then "undelivered" and a Note that notification failure NEVER changes the payment state (Q16, US-22, US-23).

CONSTRAINTS
- Use exact state names and ledger accounts. Money as exact decimals with 2 decimals, EGP.
- Mermaid pitfalls: no semicolons or # characters inside message text; use Note over/rect/alt/opt/par; keep the diagram readable. If it gets too long, move the timeout detail to a second diagram file and tell me.
- AMBIGUITY TO RESOLVE IN YOUR PLAN: the brief says "login and limits" first, and diagrams.md says "limits check, inquiry, fee, fraud checks", but the amount is only known after the inquiry. Propose a default (my suggestion: step 1 reads level and limits, the Fraud Checks chain including min/max runs after the fee) and list it as Q20 for requirements.md section 9. Do not decide silently.
- First lines are %% comments: purpose, last updated 2026-11-25, related US-08, US-09, US-10, US-12, US-13, US-15, US-16, US-17, US-18, US-19, US-22, US-25, US-30 and FR-8 to FR-13, FR-16, FR-18, FR-22, FR-25.

WORKFLOW
1. Plan first: list participants, the numbered message flow and the branches, plus ambiguities with proposed defaults. STOP and wait for my OK.
2. After OK, write the file.
3. Check it renders: try npx -y @mermaid-js/mermaid-cli -i <file> -o <temp svg> (do not commit output). If you cannot run it, say so.
4. Verify against diagrams.md: the order limits -> inquiry -> fee -> fraud -> hold -> biller -> confirm -> ledger/fee/commission -> notification, plus the timeout branch. Compare state names and transitions with state-payment.mmd and ledger entries with ledger-rules.md. List every mismatch; fix those inside this file.
5. Log: append a row to docs/design/specs/prompt-log.md (create with header if missing; do NOT write docs/prompt-log.md). Columns: Date (2026-11-25) | Author (<YOUR NAME>) | Stage (Design) | Tool and model (<tool/model>) | Prompt (verbatim; if over 15 lines put it in a "Full prompts" section at the bottom) | Summary of answer (2 lines) | Verdict: "DRAFT: verdict pending" + what was wrong, missing or risky in your FIRST version. Never invent the verdict.
6. Git: branch docs/diagram-sequence-pay-bill, commit "docs: add pay-bill sequence diagram (AI: Antigravity/<model>)", push the branch. No merge, no push to main, no force-push, no tags. Tell me to open the PR.

OUTPUT FORMAT
Step 1: the plan. After my OK: file path, how you checked rendering, mismatch list, the prompt-log row, commit/push result.
```

Answer summary: Created `docs/design/diagrams/sequence-pay-bill.mmd` with worked example (350.00 + 2.50 = 352.50 EGP), all branches (confirm, refuse, 10s timeout, async notifications), and Q20 in `requirements.md`.
Verdict: DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify `opt` + `alt` nesting and width in Mermaid renderer.

### P-13: Create refund-failed sequence diagram

```text
ROLE
You are a senior software architect and Mermaid specialist helping a student team on PayLink (Egypt bill-payment and wallet backend). Correctness with money matters more than cleverness.

CONTEXT (read first)
AGENTS.md, your rules files (phase-1-scope, diagrams, money-and-domain, requirements-writing, ai-use-and-git), docs/requirements.md (sections 5, 6 and 9, especially US-11, US-12, US-13, US-15, US-17, US-22, US-26 and Q11, Q13, Q16), all specs in docs/design/specs/ (ledger-rules, state spec, module-interfaces) and the existing diagrams (state-payment.mmd, sequence-pay-bill.mmd). If two files disagree, stop and tell me which lines conflict.

TASK
Create docs/design/diagrams/sequence-refund-failed.mmd: a Mermaid sequenceDiagram (with autonumber) of "refund a FAILED payment" (Failed -> hold released -> Refunded). This is NOT the refund of a completed payment (US-27, a separate Could story, Q12). Mermaid only, no PlantUML, no images. Follow the /new-diagram workflow.

PARTICIPANTS (module names exactly as in the brief)
Biller Integration, AquaCo (external biller), Payment Processing, Accounts and Wallet, Reconciliation, Notifications, SMS/Push Provider (external), Customer. Audit Log is a shared service shown only where a money movement is recorded.

IT MUST SHOW (worked example: 352.50 held = bill 350.00 + fee 2.50)
1. Three triggers that put a payment in Failed, as an alt block:
   a. SentToBiller -> Failed: AquaCo refuses with an error code (hard case 3).
   b. Unknown -> Failed: the biller later refuses (callback or re-query result).
   c. Unknown -> Failed: after the 3 re-queries (1, 5, 15 min) Reconciliation finds no payment in the settlement file (Q11). Note: only now is it safe to release the money.
2. Payment Processing checks the transition is legal, writes Failed with a timestamp in the payment history.
3. Failed -> Refunded: Accounts and Wallet releases the hold with ledger entries customer held -352.50 and customer available +352.50, written atomically with the state change in one database transaction. Both the bill amount (350.00) and the fee (2.50) are released (Q13). NO PayLink fee income entry and NO agent commission entry (US-17). Audit record written (who, when UTC, why, reference). Show that the ledger entries of this payment now sum to zero and available balance is restored by 352.50.
4. Notifications sends the customer an SMS and push with the clear failure reason, asynchronously; an SMS provider failure is retried up to 3 times then marked undelivered and NEVER changes the payment state (Q16).
5. Guard branches (alt/opt) that MUST appear:
   - An automatic refund attempt while the payment is still Unknown is refused with ILLEGAL_TRANSITION and logged (US-11). Unknown is never refunded automatically.
   - A second release attempt (duplicate event) on a payment already Refunded is refused or ignored and logged: no second ledger entry.
   - A refund attempt on a Completed payment is refused with ILLEGAL_TRANSITION (Completed is final).
6. A short opt note for hard case 7: if the settlement file lists a payment that PayLink has as Failed, it is only FLAGGED for support review, not changed automatically (US-26).

CONSTRAINTS
- Exact state names, ledger accounts and error codes from the specs. Exact decimals, EGP, 2 decimals.
- Mermaid pitfalls: no semicolons or # in message text; use Note over/alt/opt/rect; keep it readable.
- First lines are %% comments: purpose, last updated 2026-11-25, related US-11, US-12, US-13, US-15, US-17, US-22, US-25, US-26 and FR-11, FR-12, FR-13, FR-22, FR-25, FR-26.

WORKFLOW
1. Plan first: list participants, the numbered flow and branches, plus ambiguities with proposed defaults. STOP and wait for my OK.
2. After OK, write the file.
3. Check it renders: try npx -y @mermaid-js/mermaid-cli -i <file> -o <temp svg> (do not commit output). If you cannot run it, say so.
4. Verify against diagrams.md: Failed -> hold released -> Refunded, ledger entries shown, Unknown NOT refunded. Compare with state-payment.mmd, sequence-pay-bill.mmd and ledger-rules.md. List every mismatch; fix those inside this file.
5. Log: append a row to docs/design/specs/prompt-log.md (create with header if missing; do NOT write docs/prompt-log.md). Columns: Date (2026-11-25) | Author (<YOUR NAME>) | Stage (Design) | Tool and model (<tool/model>) | Prompt (verbatim; if over 15 lines put it in a "Full prompts" section at the bottom) | Summary of answer (2 lines) | Verdict: "DRAFT: verdict pending" + what was wrong, missing or risky in your FIRST version. Never invent the verdict.
6. Git: branch docs/diagram-sequence-refund-failed, commit "docs: add refund-failed sequence diagram (AI: Antigravity/<model>)", push the branch. No merge, no push to main, no force-push, no tags. Tell me to open the PR.

OUTPUT FORMAT
Step 1: the plan. After my OK: file path, how you checked rendering, mismatch list, the prompt-log row, commit/push result.
```

Answer summary: Created `docs/design/diagrams/sequence-refund-failed.mmd` covering 3 Failed triggers, atomic 352.50 EGP hold release, async notifications, 3 ILLEGAL_TRANSITION guards, and hard case 7 opt block.
Verdict: DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify `alt` blocks and participant layout in Mermaid renderer.

### P-14: Create component-modules diagram

```text
ROLE
You are a senior software architect and Mermaid specialist helping a student team on PayLink (Egypt bill-payment and wallet backend).

CONTEXT (read first)
AGENTS.md, your rules files (phase-1-scope, diagrams, money-and-domain, ai-use-and-git), docs/requirements.md (sections 5 and 7), docs/design/specs/module-interfaces.md and pattern-plan.md, and the existing diagrams. If two files disagree, stop and tell me.

TASK
Create docs/design/diagrams/component-modules.mmd (EXTRA diagram, keep it only if it adds information and stays consistent): a Mermaid flowchart of the layered modular monolith. Mermaid only, no images. Follow the /new-diagram workflow.

IT MUST SHOW
- The eight modules with the exact brief names: Accounts and Wallet, Biller Catalog, Payment Processing, Biller Integration, Fees and Commissions, Notifications, Fraud Checks, Reconciliation. Arrows only through public interfaces, labelled with the operation (for example Payment Processing -> Fraud Checks: evaluate rules; -> Accounts and Wallet: hold funds). No module reads another module's tables.
- Inside Biller Integration: one adapter per biller (ElectroCo, AquaCo, TopUpNet, NetCo optional) behind one BillerAdapter interface, so a new biller touches only this module plus configuration (NFR-4, US-29).
- Shared services (not modules): Audit Log, Configuration. External: mock billers, SMS/Push provider, PostgreSQL database (or the DB declared by the team, TBD).
- Asynchronous flow: payment events consumed by Notifications (in-process events in Phase 1 design, broker in Phase 2). Do not choose a broker or framework here.

CONSTRAINTS
First lines are %% comments (purpose, 2026-11-25, related NFR-3, NFR-4, US-15, US-29). Phase 1: no code. Names must match the other diagrams.

WORKFLOW
Same as the other prompts: plan first and wait for OK; write file; check rendering with mermaid-cli or say you could not; list mismatches; append a "DRAFT: verdict pending" row (with your own first-version mistakes) to docs/design/specs/prompt-log.md only (not docs/prompt-log.md); branch docs/diagram-component-modules, commit "docs: add component diagram (AI: Antigravity/<model>)", push the branch, no merge, no tags.
```

Answer summary: Created `docs/design/diagrams/component-modules.mmd` (`flowchart TB`) showing the 8 modules, `BillerAdapter` + adapters, shared services (`Audit Log`, `Configuration`), async event flow, and DB/externals.
Verdict: DRAFT: verdict pending — Could not verify rendering (Node.js / mermaid-cli not installed); syntax reviewed manually. Verify layout readability of edges between monolith and DB/externals.

---

## Prompt evolution

| From | To | What changed in the prompt | Why |
|---|---|---|---|
| P-01 | P-02 | Narrowed from asking what specs can be added to asking how to make `requirements.md` more specific without adding new things. | Keep existing scope without adding new features. |
| P-02 | P-03 | Moved from an open question to a structured prompt applying six specificity changes to `requirements.md`. | Turn the suggestions into concrete updates to `requirements.md`. *(P-03 text not provided; based on P-02 and P-03 title.)* |
| P-03 | P-04 | Moved the six specificity changes from `requirements.md` into a new, separate `specs.md` file. | Avoid editing `requirements.md` or adding new features/stories while keeping specifications separate. |
| P-04 | P-05 | Split the single `specs.md` file into six smaller files under `docs/design/specs/`. | Organize Phase 1 documentation into topic-specific files. *(P-05 text not provided; based on P-04 and P-05 title.)* |
| P-05 | P-06 | After the split, `specs.md` is deleted (with a coverage check and no-link check). | Avoid duplicate content across `specs.md` and the six split files. |
| P-07 | P-08 | From creating the prompt log to creating the first design diagram (payment state machine). | Begin Phase 1 design deliverables using the established specs as the source of truth. |
| P-08 | P-09 | From payment state diagram (`state-payment.mmd`) to the domain model class diagram (`class-domain.mmd`). | Capture all domain entities, derived Wallet balances, and module boundaries consistently with `state-payment.mmd` and specs. |
| P-09 | P-10 | From domain class diagram (`class-domain.mmd`) to relational ER diagram (`er-diagram.mmd`). | Map all 20 domain classes 1-to-1 to `UPPER_SNAKE` tables, add PK/FK/UK and cardinalities, and align system wallet ownership as Q21. |
| P-10 | P-11 | From ER diagram (`er-diagram.mmd`) to system use-case diagram (`use-case.mmd`). | Cover all 30 user stories (`US-01`–`US-28` as actor use cases, `US-05`/`10`/`11`/`29`/`30` as system-rule legend entries) with exact priorities. |
| P-11 | P-12 | From use-case diagram (`use-case.mmd`) to pay-bill sequence diagram (`sequence-pay-bill.mmd`). | Trace the end-to-end bill payment flow with exact worked amounts (`350.00 + 2.50 = 352.50 EGP`), atomic ledger transactions, timeout/refusal branches, and Q20. |
| P-12 | P-13 | From pay-bill sequence (`sequence-pay-bill.mmd`) to failed-payment refund sequence (`sequence-refund-failed.mmd`). | Detail `Failed -> Refunded` hold release (`352.50 EGP`), `Unknown` no-auto-refund guards (`ILLEGAL_TRANSITION`), and hard case 7 reconciliation flagging. |
| P-13 | P-14 | From behavioral sequence diagrams to structural modular-monolith architecture (`component-modules.mmd`). | Show public-interface boundaries, `BillerAdapter` extensibility (`NFR-4`, `US-29`), shared services, and async event flow. |

---

## Honesty checklist (for the team)

- [True] Every verdict is written by a team member, with a reason.
- [True] At least 5 entries exist.
- [True] At least 2 entries where the first AI answer was wrong and the prompt was improved are marked as such.
- [True] No password, secret or real personal data appears in any prompt.
- [True] The AI tool and model are named for every entry.

---

## Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _2026-11-25_ | _Adham Mohamed_ | First prompt log |

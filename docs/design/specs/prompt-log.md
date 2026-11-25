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

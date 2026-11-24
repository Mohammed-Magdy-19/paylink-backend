# PayLink: Detailed Specifications (companion to requirements.md)

> This file refines `requirements.md` v1.0. If the two disagree, this file's amendments in section 6 apply.

| | |
|---|---|
| **Team** | _team name / members_ |
| **Phase** | 1: Requirements, design, DevOps foundation |
| **Version / date** | v1.0 / _YYYY-MM-DD_ |
| **Roles (Phase 1)** | Requirements & product lead: _name_ · Quality & DevOps lead: _name_ · Architecture lead: _name_ |

---

## 1. Error and reason codes

Every code maps to existing stories in `requirements.md` section 6 and business rules in section 5 / section 9.

| Code | Used when | Customer message | Story |
|---|---|---|---|
| `ALREADY_REGISTERED` | Customer attempts to register with a phone number that already has an account | "This phone number is already registered." | US-01 |
| `INVALID_AMOUNT` | Wallet top-up amount is zero, negative, or not a valid 2-decimal EGP amount | "Please enter a valid amount greater than 0.00 EGP." | US-04 |
| `BILL_NOT_FOUND` | Live bill inquiry returns no matching bill for the supplied reference (e.g. meter number) | "Bill not found. Please check the reference and try again." | US-08 |
| `NO_LIVE_INQUIRY` | Customer requests a live bill inquiry for a biller that does not support it (e.g. NetCo, TopUpNet) | "Live bill inquiry is not available for this biller." | US-08 |
| `BILLER_UNAVAILABLE` | Biller is disabled by an admin, or the external biller service is unreachable/down | "This biller is currently unavailable. Please try again later." | US-06, US-15 |
| `ABOVE_MAX_SINGLE` | Bill amount exceeds the configured single payment maximum (`10,000.00 EGP`, Q1) | "Payment rejected: above maximum single payment of 10,000.00 EGP." | US-18 |
| `BELOW_MIN_SINGLE` | Bill amount is below the configured single payment minimum (`5.00 EGP`, Q1) | "Payment rejected: below minimum single payment of 5.00 EGP." | US-18 |
| `DAILY_LIMIT_EXCEEDED` | Bill amount causes the account's daily total (`FundsHeld`, `SentToBiller`, `Unknown`, `Completed` in `Africa/Cairo` day) to exceed `5,000.00 EGP` (basic) or `30,000.00 EGP` (verified) (Q2, Q3) | "Payment rejected: daily limit exceeded." | US-18 |
| `INSUFFICIENT_FUNDS` | Wallet available balance is less than the payment total (bill amount + service fee) | "Payment rejected: insufficient wallet balance." | US-09, US-30 |
| `VELOCITY_BLOCKED` | More than 5 payment attempts (the 6th attempt) occur within a sliding 60-second window (Q8), triggering a 10-minute account block | "Too many payment attempts. Your account is blocked for 10 minutes." | US-19 |
| `ACCOUNT_BLOCKED` | Payment attempted while the account is blocked by support/admin or within an active 10-minute velocity block | "Payment rejected: account blocked." | US-21, US-19 |
| `IDEMPOTENCY_CONFLICT` | Same idempotency key is reused by the same account within 24 hours with a different payload (amount or biller) (Q9) | "Request conflict: this idempotency key was already used for a different payment." | US-10 |
| `ILLEGAL_TRANSITION` | Event attempts a state transition not allowed by `requirements.md` section 5 (including altering a final state or automatically refunding `Unknown`) | "This payment cannot be updated in its current state." | US-11 |
| `BILLER_REFUSED` | Biller explicitly refuses the payment with an error code (`SentToBiller` / `Unknown` → `Failed` → `Refunded`) | "Payment failed: refused by the biller. Held funds have been refunded." | US-15 |
| `PAYMENT_PROCESSING` | Live biller does not respond within the 10-second timeout; payment moves to `Unknown` and funds stay held (Q10) | "Your payment is still being processed. Funds remain held while we confirm with the biller." | US-13 |

---

## 2. Boundary values

All monetary values are exact 2-decimal EGP amounts. Default values come from configuration (`requirements.md` section 5).

| Rule | Accepted value | Rejected value | Expected code | Story |
|---|---|---|---|---|
| Single payment min (Q1) | `5.00 EGP` (bill amount) | `4.99 EGP` (bill amount) | `BELOW_MIN_SINGLE` | US-18 |
| Single payment max (Q1) | `10,000.00 EGP` (bill amount) | `10,000.01 EGP` (bill amount) | `ABOVE_MAX_SINGLE` | US-18 |
| Daily limit: basic (Q2, Q3) | Daily total reaches `5,000.00 EGP` | Daily total reaches `5,000.01 EGP` | `DAILY_LIMIT_EXCEEDED` | US-18 |
| Daily limit: verified (Q2, Q3) | Daily total reaches `30,000.00 EGP` | Daily total reaches `30,000.01 EGP` | `DAILY_LIMIT_EXCEEDED` | US-18, US-02 |
| Velocity rule (Q8) | `5th` payment attempt in 60 s | `6th` payment attempt in 60 s ("more than 5" means the 6th is the first blocked) | `VELOCITY_BLOCKED` | US-19 |
| Internet fee tier (Q5) | `200.00 EGP` bill → `2.00 EGP` fee | `—` (not rejected; `200.01 EGP` bill → `4.00 EGP` fee) | `—` | US-16 |
| Mobile top-up minimum fee (Q4) | `40.00 EGP` bill → `1.00 EGP` fee (minimum applies up to `66.33 EGP`) | `—` (not rejected; `67.00 EGP` bill → `1.01 EGP` fee) | `—` | US-16 |

### Boundary acceptance criteria

- **US-18 (Single minimum):**
  - **Given** a basic wallet with sufficient funds and no active promotion, **when** the customer submits a payment with bill amount `5.00 EGP`, **then** the amount check passes.
  - **Given** a wallet with sufficient funds, **when** the customer submits a payment with bill amount `4.99 EGP`, **then** the payment is `Rejected` with code `BELOW_MIN_SINGLE` and no hold or ledger entry is created.
- **US-18 (Single maximum):**
  - **Given** a verified wallet with daily remaining limit ≥ `10,000.00 EGP` and sufficient funds, **when** the customer submits a payment with bill amount `10,000.00 EGP`, **then** the amount check passes.
  - **Given** a verified wallet with sufficient funds, **when** the customer submits a payment with bill amount `10,000.01 EGP`, **then** the payment is `Rejected` with code `ABOVE_MAX_SINGLE` and no hold or ledger entry is created.
- **US-18 (Daily limit — basic):**
  - **Given** a *basic* customer whose `Africa/Cairo` daily total in `{FundsHeld, SentToBiller, Unknown, Completed}` is `4,500.00 EGP`, **when** they submit a payment with bill amount `500.00 EGP` (daily total reaches `5,000.00 EGP`), **then** the daily limit check passes.
  - **Given** the same *basic* customer with `4,500.00 EGP` daily total, **when** they submit a payment with bill amount `500.01 EGP` (daily total would reach `5,000.01 EGP`), **then** the payment is `Rejected` with code `DAILY_LIMIT_EXCEEDED` and no hold or ledger entry is created.
- **US-18 (Daily limit — verified):**
  - **Given** a *verified* customer whose `Africa/Cairo` daily total in `{FundsHeld, SentToBiller, Unknown, Completed}` is `25,000.00 EGP`, **when** they submit a payment with bill amount `5,000.00 EGP` (daily total reaches `30,000.00 EGP`), **then** the daily limit check passes.
  - **Given** the same *verified* customer with `25,000.00 EGP` daily total, **when** they submit a payment with bill amount `5,000.01 EGP` (daily total would reach `30,000.01 EGP`), **then** the payment is `Rejected` with code `DAILY_LIMIT_EXCEEDED` and no hold or ledger entry is created.
- **US-19 (Velocity limit):**
  - **Given** an active account with 4 payment attempts in the last 60 seconds, **when** the 5th payment attempt arrives within the same 60-second window, **then** the velocity check passes and the account is not blocked.
  - **Given** an active account with 5 payment attempts in the last 60 seconds, **when** the 6th payment attempt arrives within the same 60-second window, **then** the 6th attempt is `Rejected` with code `VELOCITY_BLOCKED` and the account is blocked for 10 minutes.
- **US-16 (Internet fee boundary):**
  - **Given** no active promotion for NetCo, **when** the fee is calculated for a `200.00 EGP` internet bill, **then** the fee is `2.00 EGP` and total charged is `202.00 EGP`.
  - **Given** no active promotion for NetCo, **when** the fee is calculated for a `200.01 EGP` internet bill, **then** the fee is `4.00 EGP` and total charged is `204.01 EGP`.
- **US-16 (Mobile top-up minimum fee boundary):**
  - **Given** no active promotion for TopUpNet, **when** the fee is calculated for a `40.00 EGP` mobile top-up (`1.5%` = `0.60`), **then** the `1.00 EGP` minimum fee applies, giving a fee of `1.00 EGP` and total charged of `41.00 EGP`.
  - **Given** no active promotion for TopUpNet, **when** the fee is calculated for a `66.33 EGP` mobile top-up (`1.5%` = `0.99495` → `0.99`), **then** the `1.00 EGP` minimum fee applies (`1.00 EGP`); **when** calculated for `67.00 EGP` (`1.5%` = `1.005` → `1.01`), **then** the fee is `1.01 EGP`.

---

## 3. Fee and commission worked examples

All calculations use exact decimal arithmetic with half-up rounding to 2 decimal places (`Q4`, `Q17`).

| Service | Bill amount (EGP) | Fee (EGP) | Total charged (EGP) | Agent commission (40%) (EGP) |
|---|---|---|---|---|
| Electricity | `350.00` | `2.50` | `352.50` | `1.00` |
| Water | `120.00` | `2.50` | `122.50` | `1.00` |
| Mobile top-up | `120.00` | `1.80` | `121.80` | `0.72` |
| Mobile top-up | `40.00` | `1.00` | `41.00` | `0.40` |
| Internet | `200.00` | `2.00` | `202.00` | `0.80` |
| Internet | `200.01` | `4.00` | `204.01` | `1.60` |
| Any biller (during active promotion) | `350.00` *(example)* | `0.00` | `350.00` | `0.00` |

**Calculation breakdown (for verification):**

- **Electricity (`350.00`):** Fixed fee = `2.50`. Total = `350.00 + 2.50 = 352.50`. Commission = `2.50 × 0.40 = 1.000` → `1.00`.
- **Water (`120.00`):** Fixed fee = `2.50`. Total = `120.00 + 2.50 = 122.50`. Commission = `2.50 × 0.40 = 1.000` → `1.00`.
- **Mobile (`120.00`):** `120.00 × 0.015 = 1.800` → half-up to 2 decimals = `1.80`; `max(1.80, 1.00) = 1.80`. Total = `120.00 + 1.80 = 121.80`. Commission = `1.80 × 0.40 = 0.720` → `0.72`.
- **Mobile (`40.00`):** `40.00 × 0.015 = 0.600` → half-up to 2 decimals = `0.60`; apply `1.00` minimum → `max(0.60, 1.00) = 1.00`. Total = `40.00 + 1.00 = 41.00`. Commission = `1.00 × 0.40 = 0.400` → `0.40`.
- **Internet (`200.00`):** `200.00 ≤ 200.00` (Q5) → fee = `2.00`. Total = `200.00 + 2.00 = 202.00`. Commission = `2.00 × 0.40 = 0.800` → `0.80`.
- **Internet (`200.01`):** `200.01 > 200.00` (Q5) → fee = `4.00`. Total = `200.01 + 4.00 = 204.01`. Commission = `4.00 × 0.40 = 1.600` → `1.60`.
- **Any biller during a promotion (example `350.00`):** Promotion sets fee = `0.00`. Total = `350.00 + 0.00 = 350.00`. Commission = `0.00 × 0.40 = 0.00` (no commission entry created, Q6).

---

## 4. Ledger entries per transition

### Ledger accounts used

1. `customer available` — Customer wallet spendable balance.
2. `customer held` — Customer wallet funds reserved for in-flight payments (`FundsHeld`, `SentToBiller`, `Unknown`, `Failed` prior to release).
3. `biller payable` — Amount owed by PayLink to the external biller for confirmed payments.
4. `PayLink fee income` — Service fee revenue earned by PayLink when a payment reaches `Completed`.
5. `agent wallet` — Agent's wallet balance receiving earned commissions.
6. `commission expense` — PayLink expense account funding agent commissions on `Completed` payments.

### Worked example transitions (`350.00` bill + `2.50` fee = `352.50` total; agent commission `1.00`)

Convention: `Debit` (`-`) decreases a wallet/liability/income account or records an expense; `Credit` (`+`) increases a wallet/liability/income account.

| Event | Ledger entries (account, direction, amount) |
|---|---|
| Hold (`Initiated` → `FundsHeld`) | • `customer available`, Debit, `-352.50`<br>• `customer held`, Credit, `+352.50` |
| `Completed` (customer direct; from `SentToBiller` or `Unknown`) | • `customer held`, Debit, `-352.50`<br>• `biller payable`, Credit, `+350.00`<br>• `PayLink fee income`, Credit, `+2.50` |
| `Completed` via agent (commission `1.00`; from `SentToBiller` or `Unknown`) | • `customer held`, Debit, `-352.50`<br>• `biller payable`, Credit, `+350.00`<br>• `PayLink fee income`, Credit, `+2.50`<br>• `commission expense`, Debit, `-1.00`<br>• `agent wallet`, Credit, `+1.00` |
| `Failed` → `Refunded` (hold released) | • `customer held`, Debit, `-352.50`<br>• `customer available`, Credit, `+352.50` |
| `Unknown` (`SentToBiller` → `Unknown`) | No new entries (the `352.50` hold in `customer held` stays). |
| `Rejected` (`Initiated` → `Rejected`) | No entries (rejected before any hold is placed). |

*(Note: `FundsHeld` → `SentToBiller` and `SentToBiller` / `Unknown` → `Failed` create no ledger entries; the `352.50` hold stays in `customer held` until `Completed` or `Failed` → `Refunded`.)*

### Ledger invariants

- **Single transaction:** Every payment state transition and all of its ledger entries are written atomically in **one database transaction**. If either fails, both roll back.
- **Double-entry zero sum:** Every ledger-writing event and every payment's complete set of ledger entries sum to `0.00 EGP` (total Debits equal total Credits).
- **Append-only and derived balances (US-05):** Ledger entries are append-only and never edited or deleted; wallet available and held balances are always computed as the sum of their ledger entries.
- **Pre-call hold and fee/refund rules (US-09, US-12, US-17, Q13):** The hold (`352.50`) is committed before calling the biller. On failure (`Failed` → `Refunded`), both bill amount (`350.00`) and fee (`2.50`) are fully released to `customer available`, and no `PayLink fee income` or `agent wallet` commission entry is written. An `Unknown` payment is **never** refunded automatically.

---

## 5. Required fields per biller

| Biller | Service | Required input fields | Live inquiry? |
|---|---|---|---|
| `ElectroCo` | Electricity | `meter number` | Yes (live inquiry) |
| `AquaCo` | Water | `subscriber/account number` *(Assumption, to be confirmed with the instructor's biller contract)* | Yes *(Assumption, to be confirmed with the instructor's biller contract)* |
| `TopUpNet` | Mobile top-up | `phone number`, `amount` | No (no bill inquiry) |
| `NetCo` | Internet | `customer/account number` *(Assumption, to be confirmed with the instructor's biller contract)* | No (no live inquiry) |

---

## 6. Amendments to existing acceptance criteria

| Item | Current text (short quote or summary) | Added or changed criterion |
|---|---|---|
| **US-10** | Same key `K` returns original result; same key `K` with different amount or biller is rejected as conflict (Q9 notes 24-hour retention). | Idempotency key `K` is kept per account for **24 hours** from the original request. Within 24 hours, repeating `K` with the same payload returns the original result and repeating `K` with a different payload returns `IDEMPOTENCY_CONFLICT`. **After 24 hours have passed, sending key `K` is treated as a new request.** |
| **US-13** | "when 1, 5 and 15 minutes pass, then the biller is re-queried (3 attempts), and after that the payment waits for reconciliation." | The 3 re-query attempts occur at **1, 5, and 15 minutes after the timeout**, and **each retry attempt (timestamp and outcome) is recorded in the payment history**. |
| **US-20** | "I see the payment, its state history with timestamps, ledger entries and notifications." | `"Full history"` returned by reference search comprises: **payment fields**, **state transitions with timestamps**, **ledger entries**, **notifications**, and **callbacks/retries**. |
| **US-25** | "an audit record with who, when, why and the related reference exists." | Every audit record stores: **who**, **when (UTC)**, **action**, **reason**, **related reference**, and **before/after value for admin changes**. |
| **US-30** | Two simultaneous payments of `352.50` on `400.00` balance: one succeeds, one is `Rejected`, balance stays ≥ 0. | Adds pass condition: **after 100 parallel requests, the sum of ledger entries equals the wallet balance** (and wallet balance stays ≥ `0.00 EGP`). |
| **NFR-6** | "At least 70% line coverage on domain logic" | `"Domain logic"` is defined as the following modules: **Fees and Commissions**, **Payment Processing state logic**, **Ledger/Wallet**, and **Fraud Checks**. |

---

## 7. New decisions

Continuing from `requirements.md` section 9 (`Q1`–`Q16`):

| # | Question / ambiguity | Source | Decision |
|---|---|---|---|
| **Q17** | How is the 40% agent commission rounded when the service fee produces fractional fils? | `requirements.md` §5, US-17 | Round **half up to 2 decimals** using exact decimal arithmetic (same rule as Q4). |
| **Q18** | What exact customer identifier field does AquaCo require? | `requirements.md` §1, US-07 | **Assumption:** `subscriber/account number`, to be confirmed with the instructor's biller contract. |
| **Q19** | What exact customer identifier field does NetCo require? | `requirements.md` §1, US-07, US-08 | **Assumption:** `customer/account number`, to be confirmed with the instructor's biller contract. |

---

## 8. Additional planned tests

These tests supplement `requirements.md` section 10:

| Story / NFR | Planned test name |
|---|---|
| US-01, US-04, US-06, US-08, US-09, US-10, US-11, US-13, US-15, US-18, US-19, US-21 | `test_error_codes_returned` |
| US-16, US-18, US-19 | `test_boundary_limits` |
| US-16, US-17 | `test_fee_and_commission_examples` |
| US-05, US-09, US-12, US-17 | `test_ledger_entries_per_transition` |
| US-10 | `test_idempotency_key_expires_after_24h` |
| US-13 | `test_retry_schedule_1_5_15` |
| US-25 | `test_audit_record_fields` |

---

## 9. Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _YYYY-MM-DD_ | _name_ | First version (companion to `requirements.md` v1.0) |

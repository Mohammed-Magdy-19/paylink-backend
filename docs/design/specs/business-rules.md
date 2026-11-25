# PayLink: Business Rules Specification

> One-line purpose: Exact boundary values, boundary acceptance criteria, fee/commission worked examples, and commission rounding rules.
> Part of the PayLink specs, companion to `requirements.md` v1.0.

| | |
|---|---|
| **Team** | _team name / members_ |
| **Phase** | 1: Requirements, design, DevOps foundation |
| **Version / date** | v1.0 / _YYYY-MM-DD_ |
| **Roles (Phase 1)** | Requirements & product lead: _name_ · Quality & DevOps lead: _name_ · Architecture lead: _name_ |

---

## Boundary values

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

## Fee and commission worked examples

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

## Decisions

| # | Question / ambiguity | Source | Decision |
|---|---|---|---|
| **Q17** | How is the 40% agent commission rounded when the service fee produces fractional fils? | `requirements.md` §5, US-17 | Round **half up to 2 decimals** using exact decimal arithmetic (same rule as Q4). |

---

## Planned tests

| Story / NFR | Planned test name |
|---|---|
| US-16, US-18, US-19 | `test_boundary_limits` |
| US-16, US-17 | `test_fee_and_commission_examples` |

---

## Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _YYYY-MM-DD_ | _name_ | Split from the former specs.md (removed) |

Related files: [module-interfaces.md](module-interfaces.md) (error codes), [ledger-rules.md](ledger-rules.md) (ledger entries for fees and commissions).

# PayLink: Module Interfaces Specification

> One-line purpose: Error and reason codes, required fields per biller, biller field decisions, and full history definition.
> Part of the PayLink specs, companion to `requirements.md` v1.0.

> Where this file amends a story or NFR of `requirements.md`, this file applies.

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |

---

## Error and reason codes

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

## Required fields per biller

| Biller | Service | Required input fields | Live inquiry? |
|---|---|---|---|
| `ElectroCo` | Electricity | `meter number` | Yes (live inquiry) |
| `AquaCo` | Water | `subscriber/account number` *(Assumption, to be confirmed with the instructor's biller contract)* | Yes *(Assumption, to be confirmed with the instructor's biller contract)* |
| `TopUpNet` | Mobile top-up | `phone number`, `amount` | No (no bill inquiry) |
| `NetCo` | Internet | `customer/account number` *(Assumption, to be confirmed with the instructor's biller contract)* | No (no live inquiry) |

---

## Amendments to existing acceptance criteria

| Item | Current text (short quote or summary) | Added or changed criterion |
|---|---|---|
| **US-20** | "I see the payment, its state history with timestamps, ledger entries and notifications." | `"Full history"` returned by reference search comprises: **payment fields**, **state transitions with timestamps**, **ledger entries**, **notifications**, and **callbacks/retries**. |

---

## Decisions

| # | Question / ambiguity | Source | Decision |
|---|---|---|---|
| **Q18** | What exact customer identifier field does AquaCo require? | `requirements.md` §1, US-07 | **Assumption:** `subscriber/account number`, to be confirmed with the instructor's biller contract. |
| **Q19** | What exact customer identifier field does NetCo require? | `requirements.md` §1, US-07, US-08 | **Assumption:** `customer/account number`, to be confirmed with the instructor's biller contract. |

---

## Planned tests

| Story / NFR | Planned test name |
|---|---|
| US-01, US-04, US-06, US-08, US-09, US-10, US-11, US-13, US-15, US-18, US-19, US-21 | `test_error_codes_returned` |

---

## Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _2026-11-25_ | _Adham Mohamed_ | Split from the former specs.md (removed) |

Related files: [business-rules.md](business-rules.md) (limit and fee values), [state-transactions.md](state-transactions.md) (`Unknown` timeout and retry history), [hard-cases.md](hard-cases.md) (`IDEMPOTENCY_CONFLICT` / `US-10` and `INSUFFICIENT_FUNDS` / `US-30`).

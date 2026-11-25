# PayLink: Hard Cases Specification

> One-line purpose: Hard-case index and refinements for idempotency expiration (US-10) and parallel concurrency checks (US-30).
> Part of the PayLink specs, companion to `requirements.md` v1.0.

> Where this file amends a story or NFR of `requirements.md`, this file applies.

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |

---

## Index (from requirements.md section 10)

| Hard case number | Situation | Related US ID | Planned test name |
|---|---|---|---|
| 1 | Idempotent payment requests (duplicate request) | US-10 | `test_duplicate_request_one_charge` |
| 2 | Handle biller timeout (`Unknown` state, money stays held) | US-13 | `test_timeout_becomes_unknown_money_held` |
| 3 | Hold, release and refund funds (failed payment releases hold) | US-12 | `test_failed_payment_releases_hold` |
| 4 | Concurrent payments never overdraw | US-30 | `test_concurrent_payments_one_rejected` |
| 5 | Retry failed notifications (SMS down retried then undelivered) | US-23 | `test_sms_down_retried_then_undelivered` |
| 6 | Receive asynchronous callbacks (duplicate callback ignored) | US-14 | `test_duplicate_callback_ignored` |
| 7 | Daily reconciliation report (settlement difference flagged) | US-26 | `test_settlement_difference_flagged` |
| 8 | Add a new biller without changing existing modules | US-29 | `test_new_biller_added_without_changing_modules` |

---

## Amendments to existing acceptance criteria

| Item | Current text (short quote or summary) | Added or changed criterion |
|---|---|---|
| **US-10** | Same key `K` returns original result; same key `K` with different amount or biller is rejected as conflict (Q9 notes 24-hour retention). | Idempotency key `K` is kept per account for **24 hours** from the original request. Within 24 hours, repeating `K` with the same payload returns the original result and repeating `K` with a different payload returns `IDEMPOTENCY_CONFLICT`. **After 24 hours have passed, sending key `K` is treated as a new request.** |
| **US-30** | Two simultaneous payments of `352.50` on `400.00` balance: one succeeds, one is `Rejected`, balance stays ≥ 0. | Adds pass condition: **after 100 parallel requests, the sum of ledger entries equals the wallet balance** (and wallet balance stays ≥ `0.00 EGP`). |

---

## Planned tests

| Story / NFR | Planned test name |
|---|---|
| US-10 | `test_idempotency_key_expires_after_24h` |

---

## Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _2026-11-25_ | _Adham Mohamed_ | Split from the former specs.md (removed) |

Related files: [module-interfaces.md](module-interfaces.md) (`IDEMPOTENCY_CONFLICT` and `INSUFFICIENT_FUNDS`), [ledger-rules.md](ledger-rules.md) (ledger sum and balance invariant), [state-transactions.md](state-transactions.md) (hard case 2 / `US-13`).

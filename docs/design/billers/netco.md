# PayLink: NetCo Biller Contract (Internet — Optional)

> One-line purpose: Daily batch CSV contract for NetCo internet bill payments (optional biller per FR-15) and next-morning result/settlement processing.
> Part of the PayLink specs, companion to `requirements.md` v1.0 and [module-interfaces.md](../specs/module-interfaces.md).

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |

---

## 1. Overview & Configuration

- **Biller code:** `NETCO` (**optional** per `FR-15` and `requirements.md` §8)
- **Service:** Internet bills (`internet`)
- **Protocol & format:** Daily batch `CSV` file exchange (UTF-8, comma-separated, header row required)
- **Required input field:** `customerAccountNumber` *(Assumption `Q19`: `customer/account number`, to be confirmed with the instructor's biller contract)*
- **Live bill inquiry:** **No** (`NO_LIVE_INQUIRY`, `US-08`).
- **Timeout & retry scope (`Q10`):** NetCo is **out of scope for live `10 s` timeouts and `1 / 5 / 15` min retries**. Payments remain in `SentToBiller` after batch upload until the next-morning result file is processed.
- **Money format:** Exact 2-decimal `EGP` string (e.g., `"200.00"`), never floats.

> **Mock contract note:** File naming, CSV columns, and `NC-*` result codes below define our Phase 1 mock batch contract (Brief §2.4, Assumption A1, `Q19`).

---

## 2. Batch Lifecycle & File Formats

### 2.1 Payment Submission & Batch Export (`US-09`, `US-12`)
1. Customer submits an internet bill payment (`customerAccountNumber`, `amount` in `5.00`–`10,000.00 EGP`).
2. Fraud/limit checks pass and funds (`amount + fee`) are held (`Initiated` → `FundsHeld`).
3. Once per day (configurable cutoff, e.g., `23:00 Africa/Cairo`), PayLink writes all queued `FundsHeld` NetCo payments to the outgoing batch CSV and transitions them to `SentToBiller`.

**Outgoing batch file (`netco_batch_YYYY-MM-DD.csv`):**
```csv
paymentReference,customerAccountNumber,amount,currency,submittedAtUtc
PAY-20261125-000412,NET-778201,200.00,EGP,2026-11-25T18:10:00Z
PAY-20261125-000413,NET-778202,200.01,EGP,2026-11-25T18:15:00Z
```

### 2.2 Next-Morning Result & Settlement File (`US-26`)
NetCo returns one result CSV the next morning (`netco_result_YYYY-MM-DD.csv`), which also serves as NetCo's settlement file for reconciliation:
```csv
paymentReference,billerTxId,customerAccountNumber,amount,currency,status,reasonCode,processedAtUtc
PAY-20261125-000412,NC-TX-30112,NET-778201,200.00,EGP,PAID,,2026-11-26T06:00:12Z
PAY-20261125-000413,NC-TX-30113,NET-778202,200.01,EGP,REJECTED,NC_INVALID_ACCOUNT,2026-11-26T06:00:13Z
```

---

## 3. Response & Error Mapping

| NetCo signal | PayLink error code | PayLink payment state transition |
|---|---|---|
| Inquiry requested by client | `NO_LIVE_INQUIRY` | Rejected before payment creation (`US-08`) |
| Included in daily outgoing batch upload | `—` | `FundsHeld` → `SentToBiller` |
| Next-morning CSV `status = PAID` | `—` | `SentToBiller` → `Completed` (books fee & commission) |
| Next-morning CSV `status = REJECTED` | `BILLER_REFUSED` | `SentToBiller` → `Failed` → `Refunded` (hold released) |
| Sent in batch but missing from next-morning CSV | `—` | Flagged in reconciliation report for support (`US-26`) |

---

## 4. Worked Examples (`business-rules.md`, `Q5`)

Fee rule: tiered `2.00 EGP` for bill amount `≤ 200.00 EGP`; `4.00 EGP` for bill amount `> 200.00 EGP` (`Q5`). Agent commission: `40%` of fee (`Q17`).

| Scenario | Bill amount (EGP) | Fee (EGP) | Total held/charged (EGP) | Agent commission (EGP) |
|---|---|---|---|---|
| Lower tier boundary (`≤ 200.00`) | `200.00` | `2.00` | `202.00` | `0.80` |
| Upper tier boundary (`> 200.00`) | `200.01` | `4.00` | `204.01` | `1.60` |

---

## 5. Mock Failure & Test Hooks (Phase 2)

| Test scenario | Mock trigger | Expected PayLink outcome |
|---|---|---|
| `Q5` tiered fee + batch `PAID` | Result CSV marks `200.00` and `200.01` as `PAID` | Both reach `Completed`; fees `2.00` and `4.00` booked |
| Batch rejection | Result CSV marks row `REJECTED` (`NC_INVALID_ACCOUNT`) | `Failed` → `Refunded`, full hold released (`Q13`), SMS sent |
| Reconciliation mismatch | Payment omitted from result CSV or listed after `Failed` | Flagged in daily reconciliation report (`US-26`) |

---

## Change History

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-25 | Team / AI | Initial NetCo optional batch biller contract specification |

Related files: [business-rules.md](../specs/business-rules.md), [ledger-rules.md](../specs/ledger-rules.md), [module-interfaces.md](../specs/module-interfaces.md), [state-transactions.md](../specs/state-transactions.md), [hard-cases.md](../specs/hard-cases.md).

# PayLink: TopUpNet Biller Contract (Mobile Top-Up)

> One-line purpose: Asynchronous REST/JSON mock contract for TopUpNet mobile top-up submission, webhook callback handling, duplicate-callback idempotency, and settlement.
> Part of the PayLink specs, companion to `requirements.md` v1.0 and [module-interfaces.md](../specs/module-interfaces.md).

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |

---

## 1. Overview & Configuration

- **Biller code:** `TOPUPNET` (active)
- **Service:** Mobile top-up (`mobile_topup`)
- **Protocol & format:** Asynchronous `REST` / `JSON` over HTTP + callback webhook
- **Required input fields:** `phoneNumber`, `amount` (matches [module-interfaces.md](../specs/module-interfaces.md))
- **Live bill inquiry:** **No** (`NO_LIVE_INQUIRY`, `US-08`). Customer supplies phone number and top-up amount (`5.00` to `10,000.00 EGP`); PayLink computes fee + total quote locally.
- **Timeout rule (`Q10`):** The **`10 s`** timeout applies **only to the initial `"accepted"` reply**. Once `"accepted"` is received, the payment remains in `SentToBiller` until the callback arrives or reconciliation runs.
- **Money format:** Exact 2-decimal `EGP` string (e.g., `"120.00"`), never floats.

---

## 2. Endpoints & Callback

### 2.1 Submit Top-Up (`POST /v1/topups`) (`US-09`, `US-14`, `Q10`)
Header: `Idempotency-Key: <uuid>`

**Request:**
```json
{
  "paymentReference": "PAY-20261125-000309",
  "idempotencyKey": "4c10a8d2-33f1-4a09-88b2-000000000309",
  "phoneNumber": "01012345678",
  "amount": "120.00",
  "currency": "EGP",
  "callbackUrl": "https://paylink.internal/callbacks/billers/topupnet"
}
```
**Immediate Synchronous Response `202 Accepted` (within `10 s`):**
```json
{
  "paymentReference": "PAY-20261125-000309",
  "billerTxId": "TN-REQ-88412",
  "status": "accepted"
}
```
- Upon `"accepted"`, PayLink keeps the payment in `SentToBiller` (funds remain held).

### 2.2 Asynchronous Callback (`POST /callbacks/billers/topupnet`) (`US-14`, Hard Case 6)
TopUpNet calls PayLink minutes later with `"success"` or `"failed"`:
```json
{
  "callbackId": "TN-CB-991024",
  "paymentReference": "PAY-20261125-000309",
  "billerTxId": "TN-REQ-88412",
  "amount": "120.00",
  "currency": "EGP",
  "status": "success",
  "reasonCode": null,
  "completedAtUtc": "2026-11-25T16:04:10Z"
}
```
- **Duplicate callback rule (`US-14`, Hard Case 6):** If `callbackId` was already processed, or the payment is already in a final state (`Completed` or `Refunded`), PayLink **ignores the duplicate, logs it in payment history (`US-20`), creates zero new state transitions or ledger entries, and returns `200 OK`**.

### 2.3 Status Re-Query (`GET /v1/topups/{paymentReference}`) (`US-13`, `state-transactions.md`)
Used only if the initial `POST /v1/topups` timed out (`> 10 s`, entering `Unknown`) for the `1`, `5`, and `15` min retries. Returns `"accepted"`, `"success"`, `"failed"`, or `404`.

---

## 3. Response & Error Mapping

| TopUpNet signal | PayLink error code | PayLink payment state transition |
|---|---|---|
| Inquiry requested by client | `NO_LIVE_INQUIRY` | Rejected before payment creation (`US-08`) |
| `202` with `status = "accepted"` | `—` | Remains `SentToBiller` (`Q10`) |
| Callback `status = "success"` | `—` | `SentToBiller` / `Unknown` → `Completed` (once only) |
| Callback `status = "failed"` (or `400` sync refusal) | `BILLER_REFUSED` | `SentToBiller` / `Unknown` → `Failed` → `Refunded` |
| Duplicate callback (`"success"` or `"failed"`) | `—` | Ignored & logged; state unchanged (`US-14`) |
| No `"accepted"` reply within `10 s` | `PAYMENT_PROCESSING` | `SentToBiller` → `Unknown` (money stays held) |

---

## 4. Worked Examples (`business-rules.md`)

Fee rule: `1.5%` of top-up amount, rounded half-up to 2 decimals, minimum `1.00 EGP` (`Q4`). Agent commission: `40%` of fee, rounded half-up (`Q17`).

| Scenario | Top-up amount (EGP) | Fee (EGP) | Total held/charged (EGP) | Agent commission (EGP) |
|---|---|---|---|---|
| Standard percentage (`1.5%`) | `120.00` | `1.80` | `121.80` | `0.72` |
| Minimum fee applied (`1.5% = 0.60 → 1.00`) | `40.00` | `1.00` | `41.00` | `0.40` |

---

## 5. Nightly Settlement File Format (`US-26`)

Delivered daily as UTF-8 CSV (`topupnet_settlement_YYYY-MM-DD.csv`):
```csv
paymentReference,billerTxId,phoneNumber,amount,currency,status,settledAtUtc
PAY-20261125-000309,TN-REQ-88412,01012345678,120.00,EGP,success,2026-11-25T16:04:10Z
```

---

## 6. Mock Failure & Test Hooks (Phase 2)

| Test scenario | Mock trigger | Expected PayLink outcome |
|---|---|---|
| Hard Case 6 / `US-14` | Send `"success"` callback twice with same `paymentReference` | Completes once; second callback ignored and logged |
| Async failure | Send `"failed"` callback with `reasonCode="TN_INVALID_MSISDN"` | `Failed` → `Refunded`, hold released, SMS sent (`US-22`) |
| `Q10` timeout | `delayMs=12000` before `202 accepted` | `10 s` timeout → `Unknown`, money stays held, re-queried at `1, 5, 15` min |

---

## Change History

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-25 | Team / AI | Initial TopUpNet biller contract specification |

Related files: [business-rules.md](../specs/business-rules.md), [ledger-rules.md](../specs/ledger-rules.md), [module-interfaces.md](../specs/module-interfaces.md), [state-transactions.md](../specs/state-transactions.md), [hard-cases.md](../specs/hard-cases.md).

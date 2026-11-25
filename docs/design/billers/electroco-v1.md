# PayLink: ElectroCo v1 Biller Contract (Electricity)

> One-line purpose: Synchronous REST/JSON v1 mock contract for ElectroCo electricity bill inquiry, payment, status re-query, and nightly settlement.
> Part of the PayLink specs, companion to `requirements.md` v1.0 and [module-interfaces.md](../specs/module-interfaces.md).

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |

---

## 1. Overview & Configuration

- **Biller code:** `ELECTROCO` (`v1`, active)
- **Service:** Electricity bills (`electricity`)
- **Protocol & format:** Synchronous `REST` / `JSON` over HTTP (`Content-Type: application/json`)
- **Required input field:** `meterNumber` (string; maps to `meter number` in [module-interfaces.md](../specs/module-interfaces.md))
- **Live bill inquiry:** Yes (`US-08`)
- **Timeout & latency:** Expected `< 1 s`; PayLink live-biller timeout is **`10 s`** (`requirements.md` §5, `Q10`).
- **Money format (v1):** Exact 2-decimal `EGP` string (e.g., `"350.00"`), never JSON floating-point numbers.
- **Phase 2 v2 change boundary (`NFR-4`, `US-29`):** In Phase 2, ElectroCo v2 changes JSON field names, switches amounts from EGP pounds to integer piasters, and adds request signing. Only the ElectroCo adapter and its configuration change.

> **Mock contract note:** Exact paths, JSON field names, and `EL-*` error codes below define our Phase 1 mock server contract (Brief §2.4, Assumption A1).

---

## 2. Endpoints (REST / JSON v1)

### 2.1 Live Bill Inquiry (`US-08`)
`GET /v1/bills/{meterNumber}`

**Response `200 OK`:**
```json
{
  "meterNumber": "EG-EL-904210",
  "billReference": "EL-BILL-202611-8812",
  "amount": "350.00",
  "currency": "EGP",
  "dueDate": "2026-11-30"
}
```
- `404 Not Found` (`{"errorCode": "EL_BILL_NOT_FOUND", "message": "Meter has no open bill"}`) → mapped to `BILL_NOT_FOUND`.

### 2.2 Submit Payment (`US-09`, `US-10`, `Q7`)
`POST /v1/payments`  
Header: `Idempotency-Key: <uuid>`

**Request:**
```json
{
  "paymentReference": "PAY-20261125-000101",
  "idempotencyKey": "6b2f6c1a-9b41-4a7e-8c1e-22c9a1100001",
  "meterNumber": "EG-EL-904210",
  "billReference": "EL-BILL-202611-8812",
  "amount": "350.00",
  "currency": "EGP"
}
```
- PayLink holds `352.50 EGP` **before** calling this endpoint (`US-12`).
- PayLink sends exact inquired `amount` (`Q7`).

**Response `200 OK` (immediate confirmation):**
```json
{
  "paymentReference": "PAY-20261125-000101",
  "billerTxId": "EL-TX-774920",
  "status": "CONFIRMED",
  "amount": "350.00",
  "currency": "EGP",
  "confirmedAtUtc": "2026-11-25T14:22:05Z"
}
```

### 2.3 Status Re-Query for `Unknown` Retries (`US-13`, `state-transactions.md`)
`GET /v1/payments/{paymentReference}`

Called at `1`, `5`, and `15` minutes after a `10 s` timeout while payment is `Unknown`.
- Returns `200 OK` with `"status": "CONFIRMED"` → `Completed`, `"status": "REFUSED"` → `Failed`, or `404` / `"NOT_FOUND"` → stays `Unknown` until remaining retries complete or nightly reconciliation runs (`Q11`).

---

## 3. Response & Error Mapping

| ElectroCo v1 signal | PayLink error code | PayLink payment state transition |
|---|---|---|
| `200 OK` with `status = "CONFIRMED"` | `—` | `SentToBiller` / `Unknown` → `Completed` |
| `404` on inquiry (`EL_BILL_NOT_FOUND`) | `BILL_NOT_FOUND` | No payment created |
| `400`/`422` (`EL_INVALID_METER`, `EL_AMOUNT_MISMATCH`, `EL_ALREADY_PAID`) | `BILLER_REFUSED` | `SentToBiller` / `Unknown` → `Failed` → `Refunded` |
| No response within `10 s` | `PAYMENT_PROCESSING` | `SentToBiller` → `Unknown` (money stays held) |
| `503 Service Unavailable` / connection refused | `BILLER_UNAVAILABLE` | If pre-send: `Failed` → `Refunded`; other billers unaffected (`NFR-3`) |

---

## 4. Worked Example (`business-rules.md`, `ledger-rules.md`)

- **Bill amount:** `350.00 EGP` | **Service fee (electricity fixed):** `2.50 EGP` | **Total held/charged:** `352.50 EGP` | **Agent commission (40%, if via agent):** `1.00 EGP`.
- On `CONFIRMED` (`Completed`): `customer held` `-352.50`, `biller payable` `+350.00`, `PayLink fee income` `+2.50` (plus `commission expense` `-1.00` / `agent wallet` `+1.00` if agent-assisted).

---

## 5. Nightly Settlement File Format (`US-26`, Hard Case 7)

Delivered daily as UTF-8 CSV (`electroco_settlement_YYYY-MM-DD.csv`):
```csv
paymentReference,billerTxId,meterNumber,amount,currency,status,settledAtUtc
PAY-20261125-000101,EL-TX-774920,EG-EL-904210,350.00,EGP,CONFIRMED,2026-11-25T14:22:05Z
```
- Any row present in the settlement file where PayLink recorded `Failed` is flagged for support review and never altered automatically (`US-26`).
- Any `Unknown` payment absent from the settlement file after 3 retries moves to `Failed` → `Refunded` (`Q11`).

---

## 6. Mock Failure & Test Hooks (Phase 2)

| Test scenario | Mock trigger (configurable query/header/mode) | Expected PayLink outcome |
|---|---|---|
| Hard Case 2 / `US-13` | `delayMs=12000` on `POST /v1/payments` | `10 s` timeout → `Unknown`, money stays held, re-queried at `1, 5, 15` min |
| `NFR-3` resilience | `mode=DOWN` (`503`) on ElectroCo mock | AquaCo and TopUpNet payments continue with `0%` error rate |
| `US-08` bill not found | `meterNumber=000000` | `404` → `BILL_NOT_FOUND`, no payment created |
| Hard Case 7 / `US-26` | Settlement CSV includes a payment marked `Failed` in PayLink | Flagged in reconciliation report |

---

## Change History

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-25 | Team / AI | Initial ElectroCo v1 biller contract specification |

Related files: [business-rules.md](../specs/business-rules.md), [ledger-rules.md](../specs/ledger-rules.md), [module-interfaces.md](../specs/module-interfaces.md), [state-transactions.md](../specs/state-transactions.md), [hard-cases.md](../specs/hard-cases.md).

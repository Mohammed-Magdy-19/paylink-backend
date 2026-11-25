# PayLink: AquaCo Biller Contract (Water)

> One-line purpose: SOAP-style XML over HTTP mock contract for AquaCo water bill inquiry, payment (with overpayment rejection), status re-query, and settlement.
> Part of the PayLink specs, companion to `requirements.md` v1.0 and [module-interfaces.md](../specs/module-interfaces.md).

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |

---

## 1. Overview & Configuration

- **Biller code:** `AQUACO` (active)
- **Service:** Water bills (`water`)
- **Protocol & format:** `SOAP-style XML` over HTTP (`POST /soap/water`, `Content-Type: text/xml; charset=utf-8`)
- **Required input field:** `SubscriberNo` *(Assumption `Q18`: `subscriber/account number`, to be confirmed with the instructor's biller contract)*
- **Live bill inquiry:** Yes *(Assumption `Q18`)*
- **Timeout & latency:** Normal mock latency **`2–4 s`** (Brief §2.4); PayLink live-biller timeout is **`10 s`** (`requirements.md` §5, `Q10`).
- **Money format:** Exact 2-decimal `EGP` decimal text in XML elements (e.g., `<DueAmount>120.00</DueAmount>`), never floats.

> **Mock contract note:** Exact XML tags and `AQ-*` fault codes below define our Phase 1 mock server contract (Brief §2.4, Assumption A1, `Q18`).

---

## 2. SOAP Operations

### 2.1 Live Bill Inquiry (`SOAPAction: "GetWaterBill"`) (`US-08`)
**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:aq="http://aquaco.mock/water">
  <soapenv:Body>
    <aq:GetWaterBillRequest>
      <aq:SubscriberNo>WTR-440192</aq:SubscriberNo>
    </aq:GetWaterBillRequest>
  </soapenv:Body>
</soapenv:Envelope>
```
**Response (`200 OK`):**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:aq="http://aquaco.mock/water">
  <soapenv:Body>
    <aq:GetWaterBillResponse>
      <aq:SubscriberNo>WTR-440192</aq:SubscriberNo>
      <aq:InvoiceCode>AQ-INV-99210</aq:InvoiceCode>
      <aq:DueAmount>120.00</aq:DueAmount>
      <aq:CurrencyCode>EGP</aq:CurrencyCode>
      <aq:DueDate>2026-11-30</aq:DueDate>
    </aq:GetWaterBillResponse>
  </soapenv:Body>
</soapenv:Envelope>
```

### 2.2 Submit Payment (`SOAPAction: "PayWaterBill"`) (`US-09`, `US-15`, `Q7`)
PayLink holds `122.50 EGP` **before** calling AquaCo (`US-12`).
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:aq="http://aquaco.mock/water">
  <soapenv:Body>
    <aq:PayWaterBillRequest>
      <aq:PayLinkTxRef>PAY-20261125-000205</aq:PayLinkTxRef>
      <aq:IdempotencyToken>9e4b1a00-7d12-4c22-91a3-000000000205</aq:IdempotencyToken>
      <aq:SubscriberNo>WTR-440192</aq:SubscriberNo>
      <aq:InvoiceCode>AQ-INV-99210</aq:InvoiceCode>
      <aq:PaidAmount>120.00</aq:PaidAmount>
      <aq:CurrencyCode>EGP</aq:CurrencyCode>
    </aq:PayWaterBillRequest>
  </soapenv:Body>
</soapenv:Envelope>
```
- **Success response:** `<aq:PayWaterBillResponse>` with `<aq:ResultCode>AQ-000</aq:ResultCode>`, `<aq:Status>SETTLED</aq:Status>`, and `<aq:AquaTxId>AQ-TX-55109</aq:AquaTxId>`.
- **Overpayment rejection (Brief §2.4):** If `PaidAmount > DueAmount`, AquaCo returns a SOAP Fault with `<aq:ErrorCode>AQ-OVERPAY</aq:ErrorCode>` and `<aq:ErrorDetail>Paid amount exceeds bill due amount</aq:ErrorDetail>`. (PayLink also enforces exact bill amount matching per `Q7`.)

### 2.3 Status Re-Query (`SOAPAction: "QueryWaterPayment"`) (`US-13`, `state-transactions.md`)
Used for the `1`, `5`, and `15` min retries when a call exceeds `10 s` and enters `Unknown`. Request carries `<aq:PayLinkTxRef>`; response returns `SETTLED` (`Completed`), `REFUSED` (`Failed`), or `AQ-TX-NOT-FOUND` (remains `Unknown`).

---

## 3. Response & Error Mapping

| AquaCo XML result / fault | PayLink error code | PayLink payment state transition |
|---|---|---|
| `AQ-000` (`Status = SETTLED`) | `—` | `SentToBiller` / `Unknown` → `Completed` |
| `AQ-404` (subscriber or invoice not found on inquiry) | `BILL_NOT_FOUND` | No payment created |
| `AQ-OVERPAY` (amount > bill due) / `AQ-INVALID-SUB` / `AQ-ALREADY-PAID` | `BILLER_REFUSED` | `SentToBiller` / `Unknown` → `Failed` → `Refunded` |
| No response within `10 s` | `PAYMENT_PROCESSING` | `SentToBiller` → `Unknown` (money stays held) |
| HTTP `503` / transport failure before acceptance | `BILLER_UNAVAILABLE` | `Failed` → `Refunded`; other billers unaffected (`NFR-3`) |

---

## 4. Worked Example (`business-rules.md`)

- **Bill amount:** `120.00 EGP` | **Service fee (water fixed):** `2.50 EGP` | **Total held/charged:** `122.50 EGP` | **Agent commission (40%, if via agent):** `1.00 EGP`.
- On `AQ-OVERPAY` or any `AQ-*` refusal (Hard Case 3 / `US-15`): payment moves `SentToBiller` → `Failed` → `Refunded`, releasing the full `122.50 EGP` hold back to `customer available`, with `0.00 EGP` fee and `0.00 EGP` commission (`Q13`), and an SMS is sent with a clear failure reason (`US-22`).

---

## 5. Nightly Settlement File Format (`US-26`)

Delivered daily as UTF-8 CSV (`aquaco_settlement_YYYY-MM-DD.csv`):
```csv
PayLinkTxRef,AquaTxId,SubscriberNo,PaidAmount,CurrencyCode,Result,SettledAtUtc
PAY-20261125-000205,AQ-TX-55109,WTR-440192,120.00,EGP,SETTLED,2026-11-25T15:01:12Z
```

---

## 6. Mock Failure & Test Hooks (Phase 2)

| Test scenario | Mock trigger | Expected PayLink outcome |
|---|---|---|
| Normal latency (Brief §2.4) | Default delay `2000–4000 ms` | Succeeds within `10 s` timeout → `Completed` |
| Hard Case 3 / `US-15` | Trigger `AQ-OVERPAY` or `AQ-REFUSED` | `Failed` → `Refunded`, hold released, SMS sent with clear reason |
| `NFR-3` resilience | ElectroCo down while AquaCo healthy | `50` AquaCo payments succeed (`0%` error rate) |
| `US-13` timeout | `delayMs=12000` | `10 s` timeout → `Unknown`, money held, re-queried at `1, 5, 15` min |

---

## Change History

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-11-25 | Team / AI | Initial AquaCo biller contract specification |

Related files: [business-rules.md](../specs/business-rules.md), [ledger-rules.md](../specs/ledger-rules.md), [module-interfaces.md](../specs/module-interfaces.md), [state-transactions.md](../specs/state-transactions.md), [hard-cases.md](../specs/hard-cases.md).

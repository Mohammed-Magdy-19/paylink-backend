# PayLink: Ledger Rules Specification

> One-line purpose: Ledger accounts, double-entry postings per transition, transaction invariants, and audit record fields.
> Part of the PayLink specs, companion to `requirements.md` v1.0.

> Where this file amends a story or NFR of `requirements.md`, this file applies.

| | |
|---|---|
| **Phase** | 1: Requirements, Design, DevOps Foundation |
| **Version / Date** | v1.0 / 2026-11-25 |
---

## Ledger accounts used

1. `customer available` — Customer wallet spendable balance.
2. `customer held` — Customer wallet funds reserved for in-flight payments (`FundsHeld`, `SentToBiller`, `Unknown`, `Failed` prior to release).
3. `biller payable` — Amount owed by PayLink to the external biller for confirmed payments.
4. `PayLink fee income` — Service fee revenue earned by PayLink when a payment reaches `Completed`.
5. `agent wallet` — Agent's wallet balance receiving earned commissions.
6. `commission expense` — PayLink expense account funding agent commissions on `Completed` payments.

## Worked example transitions (`350.00` bill + `2.50` fee = `352.50` total; agent commission `1.00`)

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

## Ledger invariants

- **Single transaction:** Every payment state transition and all of its ledger entries are written atomically in **one database transaction**. If either fails, both roll back.
- **Double-entry zero sum:** Every ledger-writing event and every payment's complete set of ledger entries sum to `0.00 EGP` (total Debits equal total Credits).
- **Append-only and derived balances (US-05):** Ledger entries are append-only and never edited or deleted; wallet available and held balances are always computed as the sum of their ledger entries.
- **Pre-call hold and fee/refund rules (US-09, US-12, US-17, Q13):** The hold (`352.50`) is committed before calling the biller. On failure (`Failed` → `Refunded`), both bill amount (`350.00`) and fee (`2.50`) are fully released to `customer available`, and no `PayLink fee income` or `agent wallet` commission entry is written.

---

## Amendments to existing acceptance criteria

| Item | Current text (short quote or summary) | Added or changed criterion |
|---|---|---|
| **US-25** | "an audit record with who, when, why and the related reference exists." | Every audit record stores: **who**, **when (UTC)**, **action**, **reason**, **related reference**, and **before/after value for admin changes**. |

---

## Planned tests

| Story / NFR | Planned test name |
|---|---|
| US-05, US-09, US-12, US-17 | `test_ledger_entries_per_transition` |
| US-25 | `test_audit_record_fields` |

---

## Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _2026-11-25_ | _Adham Mohamed_ | Split from the former specs.md (removed) |

Related files: [state-transactions.md](state-transactions.md) (`Unknown` state retry and no-auto-refund rule), [business-rules.md](business-rules.md) (fee and commission calculation rules).

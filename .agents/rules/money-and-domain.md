# Money and Domain Rules

Applies to specs now, and to code in Phase 2.

## Money
- Exact decimal only. Never float or double. Two decimals, EGP.
- Percentage fee: round half up to 2 decimals, then apply the minimum (see requirements section 9, Q4).
- Show a worked numeric example with every money rule.

## Ledger
- Append-only entries. Every movement has: id, wallet, type, amount (signed or debit/credit, be consistent), payment reference, timestamp, actor, reason.
- Balance = sum of entries. Held balance is the sum of hold entries minus their release/charge entries.
- Worked example, 350.00 bill + 2.50 fee (basic customer, agent involved):
  1. Hold 352.50: available -352.50, held +352.50.
  2. Biller confirms: held -352.50 (charge).
  3. Credit PayLink fee income +2.50.
  4. Credit agent commission +1.00 (40% of 2.50).
  5. Failure instead of step 2: release hold: held -352.50, available +352.50, no fee, no commission.

## Payments
- Idempotency key is unique per account and kept 24 hours. Same key + same payload returns the first result. Same key + different payload is a conflict.
- Hold funds BEFORE calling the biller.
- Timeout (10 s live billers) → Unknown, money stays held, re-query after 1, 5, 15 minutes, then wait for reconciliation.
- Duplicate callbacks are ignored and logged. State changes happen once.
- Concurrency: two simultaneous payments on one wallet must never produce a negative balance.

## Auditing
- Every money movement and admin action writes an audit record (who, when, why). Audit records cannot be edited or deleted.

## Modules
- Six modules minimum plus Fraud Checks and Reconciliation: Accounts & Wallet, Biller Catalog, Payment Processing, Biller Integration, Fees & Commissions, Notifications.
- A module talks to others only through its public interface. A new biller touches only Biller Integration plus configuration.
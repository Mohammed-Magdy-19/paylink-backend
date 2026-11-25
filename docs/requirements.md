# PayLink: Requirements Pack (Phase 1)

| | |
|---|---|
| **Team** | _team name / members_ |
| **Phase** | 1: Requirements, design, DevOps foundation |
| **Version / date** | v1.0 / _YYYY-MM-DD_ |
| **Roles (Phase 1)** | Requirements & product lead: _name_ · Quality & DevOps lead: _name_ · Architecture lead: _name_ |

---

## 1. Problem summary (in our own words)

PayLink is an Egyptian bill-payment company. Customers pay electricity, water, mobile and internet bills from a digital wallet, either in the mobile app or through agents (small shops with a PayLink terminal). PayLink earns a service fee on every payment and pays a commission to agents.

The central difficulty is that PayLink **holds customers' money** while depending on **external billers that are slow, different from each other and sometimes silent**. A payment must therefore never be charged twice, never charged without the biller receiving it, and never push a wallet below zero. When the biller does not answer, the system must not guess: it keeps the money held until it is sure.

We are building a backend that:

- moves money correctly using a **ledger** (balances are always computed from entries, never overwritten);
- follows a strict **payment life cycle** (Initiated → FundsHeld → SentToBiller → Completed / Failed / Unknown → Refunded / Rejected);
- integrates billers with different protocols (ElectroCo REST/JSON, AquaCo SOAP-style XML, TopUpNet async REST with callback, NetCo daily CSV batch) behind one interface;
- applies fees, promotions, limits and fraud rules from **configuration**, not code;
- is easy to extend with a new biller and ready for the busiest day of the month.

**Out of scope:** real payment gateways, real SMS/push providers, real biller connections (all simulated), and a polished UI (a simple web page or CLI is enough).

---

## 2. Stakeholders

| Stakeholder | Role | What they care about |
|---|---|---|
| Customer | Pays bills from the wallet | Fast, correct, clear messages, no double charge |
| Agent | Pays on behalf of customers at a terminal | Reliable payments, commission credited |
| Biller (ElectroCo, AquaCo, TopUpNet, NetCo) | Issues bills, receives payments | Paid correctly, matching settlement files |
| Admin | Manages billers, fees, limits | Change rules without redeploying; audit trail |
| Support employee | Investigates problems | Search by reference, see full history, block accounts |
| PayLink management | Owns the business | Revenue (fees), trust, low losses, scalability |
| Regulator / auditor | Oversight of wallet money | Complete audit log, traceable money movements |
| Development team / TA / instructors | Build and grade | Clean design, tests, honest AI use |

---

## 3. Technology declaration

> Fixed after Phase 1. Fill in and keep consistent with `AI_CONTEXT.md`.

| Item | Decision |
|---|---|
| Language / framework | _e.g. Python FastAPI / Java Spring Boot / .NET / Node NestJS_ |
| Database | _e.g. PostgreSQL_ (relational, 10+ tables, migrations in the repository) |
| Diagram tool | _PlantUML or Mermaid_ |
| Test framework | _e.g. pytest / JUnit / xUnit / Jest_ |
| CI/CD | GitHub Actions |
| Containers | Docker + docker compose |
| AI assistant(s) | _tool names and models_ |

---

## 4. Glossary

| Term | Meaning |
|---|---|
| Biller | Company that issues bills and receives payments |
| Bill inquiry | Asking the biller what a customer owes before paying |
| Wallet | Customer/agent account in EGP with available and held balance |
| Ledger | Append-only list of entries recording every money movement; balance = sum of entries |
| Hold | Money reserved for a payment not yet confirmed |
| Service fee | What PayLink charges the customer per payment |
| Commission | 40% of the service fee, paid to the agent's wallet when the payment completes |
| Idempotency key | Unique value sent with a request so that sending it twice has the effect of once |
| Settlement file | Biller's daily list of payments it received |
| Reconciliation | Comparing PayLink's payments with the settlement file and flagging differences |
| Refund | Returning held or charged money to the wallet after a failed or cancelled payment |

---

## 5. Business rules (configuration values)

All values below are **configuration, not code**. All money uses exact decimal types, never floating point.

| Rule | Value |
|---|---|
| Daily payment limit | 5,000 EGP (basic) / 30,000 EGP (verified) |
| Single payment min / max | 5 EGP / 10,000 EGP |
| Fee: electricity, water | Fixed 2.50 EGP |
| Fee: mobile top-up | 1.5% of amount, minimum 1 EGP |
| Fee: internet | 2 EGP up to 200 EGP; 4 EGP above 200 EGP |
| Promotion | Fee = 0 for one chosen biller between configurable start and end dates |
| Agent commission | 40% of the service fee, credited when the payment completes |
| Velocity rule | More than 5 payments in 60 s from one account → blocked for 10 min |
| Biller timeout | 10 s for live billers, then payment becomes Unknown |
| Unknown retries | Re-query 3 times (after 1, 5, 15 min), then wait for reconciliation |
| Notification retry | 3 retries, then marked undelivered |

### Payment life cycle (only these transitions are allowed)

| From | Event | To |
|---|---|---|
| Initiated | Fraud checks pass and funds sufficient | FundsHeld |
| Initiated | Fraud check fails or insufficient funds | Rejected |
| FundsHeld | Request sent to biller | SentToBiller |
| SentToBiller | Biller confirms | Completed |
| SentToBiller | Biller refuses | Failed |
| SentToBiller | No answer within timeout | Unknown |
| Unknown | Biller later confirms (callback, retry, settlement) | Completed |
| Unknown | Biller later refuses, or reconciliation finds no payment | Failed |
| Failed | Hold released to wallet | Refunded |

Completed, Rejected and Refunded are final. A payment in Unknown is **never** refunded automatically.

---

## 6. Functional requirements: user stories

Priority: **M** = Must, **S** = Should, **C** = Could. "FR" links to the numbered requirement in the brief.

### Accounts and Wallet

**US-01: Register as a customer** · M · FR-1
As a new customer, I want to register so that I get a wallet and can pay bills.
- **Given** a phone number and name not yet registered, **when** I register, **then** an account is created with level *basic* and a wallet with 0.00 EGP available and 0.00 EGP held.
- **Given** a phone number already registered, **when** I register again, **then** the request is rejected with a clear "already registered" error and no second account is created.

**US-02: Upgrade to verified** · S · FR-2
As support/admin, I want to upgrade a customer to *verified* so that their limits increase.
- **Given** a basic customer, **when** the upgrade is approved, **then** the level becomes *verified* and the daily limit becomes 30,000 EGP.
- **Given** the upgrade, **when** it happens, **then** an audit record stores who, when and why.

**US-03: View balance and history** · M · FR-3
As a customer, I want to see my available and held balance and my transactions.
- **Given** a wallet with a hold of 352.50 EGP, **when** I open my wallet, **then** I see available and held balances separately.
- **Given** several transactions, **when** I request history, **then** entries are listed newest first with type, amount, date and payment reference.

**US-04: Top up the wallet** · M · FR-4
As a customer, I want to top up by simulated card or agent cash.
- **Given** a valid amount, **when** I top up 500.00 EGP, **then** a ledger credit of 500.00 is created and the available balance increases by 500.00.
- **Given** an invalid amount (zero, negative, or non-decimal), **when** I top up, **then** it is rejected and no ledger entry is created.

**US-05: Ledger-based balances** · M · FR-5
As the business, I want every balance change recorded as a ledger entry.
- **Given** any operation that changes money (top-up, hold, charge, fee, commission, release, refund), **when** it completes, **then** at least one ledger entry exists and the balance equals the sum of the entries.
- **Given** the code base, **when** reviewed, **then** no function overwrites a stored balance directly.

### Biller Catalog

**US-06: Manage billers and services** · M · FR-6
As an admin, I want to add, edit and disable billers and services.
- **Given** a new biller definition, **when** I add it, **then** it appears in the catalog with its fields and min/max amounts.
- **Given** an active biller, **when** I disable it, **then** new payments to it are refused with "biller unavailable" and existing payments continue normally.
- **Given** any admin change, **when** saved, **then** it is written to the audit log.

**US-07: See billers and required fields** · M · FR-7
As a customer, I want to see the billers and what I must enter.
- **Given** active billers, **when** I open the list, **then** I see each biller, its services and its required input fields (e.g. meter number, phone number).
- **Given** a disabled biller, **when** I open the list, **then** it is not offered.

### Payment Processing

**US-08: Bill inquiry with fee and total** · M · FR-8
As a customer, I want to see amount, fee and total before paying.
- **Given** a valid meter number, **when** I run an inquiry, **then** I see the bill amount (350.00), fee (2.50) and total (352.50).
- **Given** an unknown meter number, **when** I run an inquiry, **then** I get a clear "bill not found" message and no payment is created.
- **Given** a biller without live inquiry (NetCo), **when** I try an inquiry, **then** the system explains that no live inquiry exists.

**US-09: Pay a bill from the wallet** · M · FR-9
As a customer, I want to pay a bill from my wallet.
- **Given** an available balance of 1,000.00 and a 350.00 bill, **when** I pay, **then** 352.50 is held, the biller is called, and on confirmation the payment becomes Completed.
- **Given** a completed payment, **when** it finishes, **then** the fee income is credited to PayLink and a receipt is available.

**US-10: Idempotent payment requests** · M · FR-10
As a customer on a slow network, I want repeated requests not to charge me twice.
- **Given** a payment request with idempotency key K already processed, **when** the same request with K arrives again, **then** the original result is returned and no second payment or ledger entry is created.
- **Given** key K reused with a different amount or biller, **when** it arrives, **then** it is rejected as a conflict.

**US-11: Enforce the payment life cycle** · M · FR-11
As the business, I want only legal state transitions.
- **Given** a payment in Completed, **when** any event tries to change its state, **then** the transition is refused and logged.
- **Given** a payment in Unknown, **when** a refund is requested automatically, **then** it is refused.
- **Given** every transition in section 5, **when** its event occurs, **then** the new state is stored with a timestamp in the payment history.

**US-12: Hold, release and refund funds** · M · FR-12
As a customer, I want my money held before the biller is called and returned if the payment fails.
- **Given** a Failed payment, **when** the system releases the hold, **then** the state becomes Refunded and the available balance is restored by the held amount.
- **Given** a payment, **when** funds are held, **then** the hold exists *before* the first call to the biller.

**US-13: Handle biller timeout** · M · FR-13
As a customer, I want to be told when my payment is still being processed.
- **Given** ElectroCo answers after 12 seconds, **when** the 10-second timeout expires, **then** the payment becomes Unknown, the money stays held and I see "being processed".
- **Given** an Unknown payment, **when** 1, 5 and 15 minutes pass, **then** the biller is re-queried (3 attempts), and after that the payment waits for reconciliation.

**US-14: Receive asynchronous callbacks** · M · FR-14
As the system, I want to accept TopUpNet callbacks and ignore duplicates.
- **Given** an accepted TopUp payment, **when** a "success" callback arrives, **then** the payment completes once.
- **Given** the same "success" callback arrives a second time, **when** processed, **then** it is ignored and logged, with no second state change or ledger entry.

**US-15: Support multiple billers with different formats** · M · FR-15
As the business, I want ElectroCo, AquaCo and TopUpNet supported behind one interface.
- **Given** a payment to each of the three billers, **when** processed, **then** each is sent in its own protocol and mapped to the same internal result.
- **Given** ElectroCo is down, **when** a customer pays AquaCo, **then** the AquaCo payment is not affected.
- **Given** AquaCo refuses with an error code, **when** processed, **then** the payment becomes Failed, the hold is released and the customer receives an SMS with a clear reason.

### Fees and Commissions

**US-16: Calculate fees** · M · FR-16
As the business, I want fees calculated per the rules, including promotions.
- **Given** an electricity or water payment, **when** the fee is calculated, **then** it is 2.50 EGP.
- **Given** a 120.00 mobile top-up, **when** the fee is calculated, **then** it is 1.80 EGP; **given** a 40.00 top-up, **then** it is 1.00 EGP (minimum).
- **Given** an internet bill of 200.00 / 200.01, **when** the fee is calculated, **then** it is 2 EGP / 4 EGP.
- **Given** a promotion active for biller X today, **when** a payment to X is made, **then** the fee is 0.00; **given** the promotion ended, **then** the normal fee applies.

**US-17: Agent pays on behalf of a customer** · S · FR-17
As an agent, I want to pay for a customer and earn commission.
- **Given** a completed payment made via an agent with fee 2.50, **when** it completes, **then** 1.00 EGP (40%) is credited to the agent's wallet through a ledger entry.
- **Given** the payment fails, **when** the hold is released, **then** no commission is paid.

### Fraud Checks

**US-18: Enforce amount and daily limits** · M · FR-18
As the business, I want payments above limits rejected with a clear reason.
- **Given** a payment of 10,000.01 EGP, **when** submitted, **then** it is Rejected with reason "above maximum single payment".
- **Given** a basic customer who already paid 4,900 EGP today, **when** they pay 200 EGP, **then** it is Rejected with reason "daily limit exceeded".
- **Given** a rejected payment, **when** it ends, **then** no hold and no ledger entry for the payment amount exist.

**US-19: Velocity rule** · S · FR-19
As the business, I want rapid payments blocked.
- **Given** 5 payments in 60 seconds, **when** a 6th arrives, **then** it is Rejected and the account is blocked for 10 minutes.
- **Given** the 10 minutes have passed, **when** the customer pays again, **then** the account is allowed again.

### Support and Admin

**US-20: Search a payment by reference** · M · FR-20
As support, I want to find a payment and see its full history.
- **Given** a payment reference, **when** I search, **then** I see the payment, its state history with timestamps, ledger entries and notifications.
- **Given** an unknown reference, **when** I search, **then** I get "not found".

**US-21: Block and unblock an account** · S · FR-21
As support, I want to block and unblock accounts.
- **Given** an active account, **when** I block it with a reason, **then** new payments are Rejected with "account blocked" and the action is audited.
- **Given** a blocked account, **when** I unblock it, **then** payments are allowed again.

### Notifications

**US-22: Receive SMS and push on completion or failure** · M · FR-22
As a customer, I want to be notified of the result.
- **Given** a payment completes, **when** processing ends, **then** I receive an SMS and a push message from a template with amount and reference.
- **Given** a payment fails, **when** the hold is released, **then** I receive a message with the failure reason.
- **Given** the SMS provider is down, **when** a payment completes, **then** the payment still completes (notification failure never changes the payment state).

**US-23: Retry failed notifications** · S · FR-23
As the business, I want failed messages retried and then marked undelivered.
- **Given** an SMS fails, **when** retried, **then** up to 3 retries are made.
- **Given** all 3 retries fail, **when** the last one fails, **then** the notification is marked *undelivered* and visible to support.

### Configuration, Audit, Reconciliation, Reporting

**US-24: Change fees and limits without redeploying** · S · FR-24
As an admin, I want to edit fee and limit values at runtime.
- **Given** a new daily limit, **when** I save it, **then** the next payment uses the new value without restarting the system.
- **Given** an invalid value (negative, or min greater than max), **when** I save it, **then** it is refused.

**US-25: Audit log** · M · FR-25
As an auditor, I want every money movement and admin action logged.
- **Given** any ledger entry or admin action, **when** it happens, **then** an audit record with who, when, why and the related reference exists.
- **Given** the audit log, **when** a user tries to edit or delete a record, **then** it is not possible.

**US-26: Daily reconciliation report** · S · FR-26
As support, I want a nightly comparison with the biller's settlement file.
- **Given** a settlement file, **when** reconciliation runs, **then** a report lists matched payments and differences.
- **Given** the file lists a payment PayLink has as Failed, **when** the report is made, **then** it is flagged for support review (not changed automatically).
- **Given** an Unknown payment that the file does not contain, **when** reconciliation runs, **then** it moves to Failed and is then refunded.

**US-27: Refund a completed payment** · C · FR-27
As a customer, I want to request a refund of a completed payment, approved by support.
- **Given** a completed payment, **when** I request a refund, **then** a request is created in *pending* state.
- **Given** support approves, **when** processed, **then** the amount is returned by ledger entries and the action is audited.
- **Given** support rejects, **when** processed, **then** nothing moves and the customer is told why.

**US-28: Admin daily totals** · C · FR-28
As an admin, I want daily totals.
- **Given** a day of payments, **when** I open the report, **then** I see number and value of payments, fees earned, commissions paid, and failures per biller.

**US-29: Add a new biller without changing existing modules** · M · (hard case 8)
As the business, I want to add a biller by adding one integration and configuration only.
- **Given** a new biller adapter and its configuration, **when** the system starts, **then** the biller works end to end and no existing module file has changed.

**US-30: Concurrent payments never overdraw** · M · (hard case 4)
As the business, I want the balance never to go negative.
- **Given** a balance of 400 EGP and two simultaneous payments of 352.50 EGP, **when** both arrive at once, **then** exactly one succeeds and the other is Rejected, and the balance stays ≥ 0.

---

## 7. Non-functional requirements (measurable)

| ID | Quality | Requirement | How we measure it | Priority |
|---|---|---|---|---|
| NFR-1 | Correctness | Zero double charges and zero negative balances in duplicate and concurrency tests | Automated tests with 100 parallel and 100 repeated requests; assert ledger sum and balance | M |
| NFR-2 | Performance | 100 payments/second sustained for 60 seconds against the mock billers | Load test script; report throughput and p95 latency in CI/report | M |
| NFR-3 | Resilience | A biller outage does not stop payments to other billers | Test: ElectroCo down, 50 AquaCo payments still succeed; error rate for AquaCo = 0% | M |
| NFR-4 | Modifiability | Adding a biller touches only the Biller Integration module and configuration | Git diff of the "add biller" change lists no other module | M |
| NFR-5 | Auditability | 100% of money movements and admin actions have an audit record (who, when, why) | Test: count ledger entries vs audit records, must be equal | M |
| NFR-6 | Testability | At least 70% line coverage on domain logic | Coverage report produced by the CI pipeline | M |
| NFR-7 | Responsiveness | p95 of API responses (excluding the biller call) under 300 ms at normal load | Load test percentile report | S |
| NFR-8 | Security / privacy | No secrets or real personal data in the repository or in AI prompts; secrets come from environment variables | Repository scan in CI; `.env.example` only | M |
| NFR-9 | Portability | A teammate can start the system from a clean clone with `docker compose up` | Clean-clone check before each tag | M |
| NFR-10 | Configurability | Limits, fees, timeouts and retries are changed without code changes | Test with changed configuration values | S |

---

## 8. Priorities summary

| Priority | Requirements |
|---|---|
| **Must** | FR-1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 25 |
| **Should** | FR-2, 17, 19, 21, 23, 24, 26 |
| **Could** | FR-27, 28 |
| **Optional** | NetCo batch biller (not required by FR-15) |

---

## 9. Questions and ambiguities, with decisions

> Replace or extend with the questions the AI actually asked and what your team found. Each decision should be agreed by the team.

| # | Question / ambiguity | Source | Decision |
|---|---|---|---|
| Q1 | Do the min/max single-payment limits apply to the bill amount or to the total with fee? | §2.6 | Apply to the **bill amount**. The fee is added afterwards. |
| Q2 | Does the daily limit count the fee, and which payments count (held, completed, failed)? | §2.6 | Count the **bill amount** of payments in FundsHeld, SentToBiller, Unknown and Completed. Failed, Rejected and Refunded payments are not counted. |
| Q3 | What defines "a day" for the daily limit? | §2.1 | Calendar day in the **Africa/Cairo** time zone, stored in UTC. |
| Q4 | How is the percentage fee rounded? | §2.6 | Round **half up to 2 decimals** using decimal types, then apply the 1 EGP minimum. |
| Q5 | Is the 200 EGP tier boundary inclusive? | §2.6 | "Up to 200" means **≤ 200.00 → 2 EGP**; above 200.00 → 4 EGP. |
| Q6 | If the fee is 0 due to a promotion, what is the agent commission? | §2.6 | 40% of 0 = **0**. No commission entry is created. |
| Q7 | Can a customer pay less than the bill? AquaCo rejects more than the bill. | §2.4 | Payment amount must **equal the inquired bill amount**, except where a biller allows partial payment (not in v1). |
| Q8 | What does the velocity rule count: attempts or successful payments? | §2.6 | Count **all payment attempts** (including rejected ones) in a sliding 60-second window. |
| Q9 | What is the scope of an idempotency key and how long is it kept? | §2.7 | Key is unique **per account**, kept for **24 hours**; same key with a different payload → conflict. |
| Q10 | Which biller timeout applies to TopUpNet (async) and NetCo (batch)? | §2.6 | The 10 s timeout applies to the "accepted" reply only. After "accepted", the payment stays in SentToBiller until the callback or reconciliation. NetCo is out of scope for live timeouts. |
| Q11 | When Unknown payments exhaust 3 retries and reconciliation finds nothing, who decides? | §2.5 | Reconciliation moves it to Failed, then the hold is released (Refunded). Never earlier. |
| Q12 | Refund of a **completed** payment (FR-27): does the biller get the money back? | §3.2 | Out of Must scope. In the Could story the wallet refund is simulated; the biller side is a flagged manual step for support. |
| Q13 | What happens to the fee on a failed payment? | §2.2 | The fee is part of the hold and is **fully released**; no fee income is booked unless the payment completes. |
| Q14 | Who can top up with "agent cash"? | FR-4 | An agent credits a customer's wallet from the agent's own wallet; both sides recorded in the ledger. |
| Q15 | What happens to payments when a biller is disabled while some are in progress? | FR-6 | In-flight payments continue. Only new payments are refused. |
| Q16 | Is a notification failure allowed to change the payment state? | §2.7 | **No.** Notification is asynchronous and independent from the payment result. |
| Q20 | Which wallet owns the system-level ledger accounts (`biller payable`, `PayLink fee income`, `commission expense`)? | `ledger-rules.md`, `class-domain.mmd` | `Wallet` includes a `walletType` (`CUSTOMER`, `AGENT`, `SYSTEM`); system-level ledger accounts belong to designated `SYSTEM` wallets so every `LedgerEntry` belongs to a `Wallet`. *(Note: Q17–Q19 are recorded in `business-rules.md` and `module-interfaces.md`.)* |

---

## 10. Traceability table (requirement → module → planned test)

| FR | Story | Module | Planned test (name) |
|---|---|---|---|
| FR-1 | US-01 | Accounts & Wallet | `test_register_creates_basic_account_and_wallet` |
| FR-2 | US-02 | Accounts & Wallet | `test_upgrade_raises_daily_limit` |
| FR-3 | US-03 | Accounts & Wallet | `test_wallet_shows_available_and_held` |
| FR-4 | US-04 | Accounts & Wallet | `test_topup_creates_ledger_credit` |
| FR-5 | US-05 | Accounts & Wallet | `test_balance_equals_sum_of_ledger` |
| FR-6 | US-06 | Biller Catalog | `test_disabled_biller_refuses_new_payments` |
| FR-7 | US-07 | Biller Catalog | `test_list_shows_required_fields` |
| FR-8 | US-08 | Payment Processing | `test_inquiry_returns_amount_fee_total` |
| FR-9 | US-09 | Payment Processing | `test_pay_bill_happy_path_completes` |
| FR-10 | US-10 | Payment Processing | `test_duplicate_request_one_charge` (hard case 1) |
| FR-11 | US-11 | Payment Processing | `test_illegal_transitions_refused` |
| FR-12 | US-12 | Accounts & Wallet / Payment | `test_failed_payment_releases_hold` (hard case 3) |
| FR-13 | US-13 | Biller Integration | `test_timeout_becomes_unknown_money_held` (hard case 2) |
| FR-14 | US-14 | Biller Integration | `test_duplicate_callback_ignored` (hard case 6) |
| FR-15 | US-15 | Biller Integration | `test_three_billers_same_interface` |
| FR-16 | US-16 | Fees & Commissions | `test_fee_rules_and_promotion` |
| FR-17 | US-17 | Fees & Commissions | `test_agent_commission_40_percent` |
| FR-18 | US-18 | Fraud Checks | `test_limits_reject_with_reason` |
| FR-19 | US-19 | Fraud Checks | `test_velocity_blocks_for_10_minutes` |
| FR-20 | US-20 | Payment Processing | `test_support_search_by_reference` |
| FR-21 | US-21 | Accounts & Wallet | `test_block_and_unblock_account` |
| FR-22 | US-22 | Notifications | `test_sms_and_push_on_completion` |
| FR-23 | US-23 | Notifications | `test_sms_down_retried_then_undelivered` (hard case 5) |
| FR-24 | US-24 | Configuration | `test_limit_change_without_restart` |
| FR-25 | US-25 | Audit (shared) | `test_every_money_movement_has_audit_record` |
| FR-26 | US-26 | Reconciliation | `test_settlement_difference_flagged` (hard case 7) |
| FR-27 | US-27 | Payment Processing | `test_refund_request_approval_flow` |
| FR-28 | US-28 | Reporting | `test_daily_totals_report` |
| (HC 4) | US-30 | Accounts & Wallet | `test_concurrent_payments_one_rejected` |
| (HC 8) | US-29 | Biller Integration | `test_new_biller_added_without_changing_modules` |

---

## 11. Assumptions and risks

| # | Assumption / risk | Mitigation |
|---|---|---|
| A1 | Billers are mock servers that follow the instructors' contract | Mock servers can be told to fail on purpose |
| A2 | One currency (EGP) with two decimal places | Decimal type everywhere; no floats |
| R1 | AI-generated money logic may contain rounding or double-entry mistakes | Worked examples in specs; tests first; peer review of every PR |
| R2 | Concurrency bugs under load | Database transactions and locking; concurrency test in CI |
| R3 | Time lost around the 12 December midterm | Plan Phase 2 milestones backwards from 18 December |

---

## 12. Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _YYYY-MM-DD_ | _name_ | First version |
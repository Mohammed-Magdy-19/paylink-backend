# PayLink: State Transitions Specification

> One-line purpose: Retry schedule after timeout, Unknown-state handling rules, and retry schedule tests.
> Part of the PayLink specs, companion to `requirements.md` v1.0.

> Where this file amends a story or NFR of `requirements.md`, this file applies.

| | |
|---|---|
| **Team** | _team name / members_ |
| **Phase** | 1: Requirements, design, DevOps foundation |
| **Version / date** | v1.0 / _YYYY-MM-DD_ |
| **Roles (Phase 1)** | Requirements & product lead: _name_ · Quality & DevOps lead: _name_ · Architecture lead: _name_ |

---

## Unknown state rules

- An `Unknown` payment is **never** refunded automatically.

---

## Amendments to existing acceptance criteria

| Item | Current text (short quote or summary) | Added or changed criterion |
|---|---|---|
| **US-13** | "when 1, 5 and 15 minutes pass, then the biller is re-queried (3 attempts), and after that the payment waits for reconciliation." | The 3 re-query attempts occur at **1, 5, and 15 minutes after the timeout**, and **each retry attempt (timestamp and outcome) is recorded in the payment history**. |

---

## Planned tests

| Story / NFR | Planned test name |
|---|---|
| US-13 | `test_retry_schedule_1_5_15` |

---

## Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _YYYY-MM-DD_ | _name_ | Split from the former specs.md (removed) |

Related files: [ledger-rules.md](ledger-rules.md) (held funds during `Unknown` and refund on `Failed`), [module-interfaces.md](module-interfaces.md) (`PAYMENT_PROCESSING`, `ILLEGAL_TRANSITION`, and `callbacks/retries` in `US-20`), [hard-cases.md](hard-cases.md) (hard case 2 / `US-13`).

# PayLink: Design Pattern Plan

> One-line purpose: Domain-logic coverage scope (NFR-6) and mapping of design patterns from the brief to PayLink modules.
> Part of the PayLink specs, companion to `requirements.md` v1.0.

> Where this file amends a story or NFR of `requirements.md`, this file applies.

| | |
|---|---|
| **Team** | _team name / members_ |
| **Phase** | 1: Requirements, design, DevOps foundation |
| **Version / date** | v1.0 / _YYYY-MM-DD_ |
| **Roles (Phase 1)** | Requirements & product lead: _name_ · Quality & DevOps lead: _name_ · Architecture lead: _name_ |

---

## Amendments to existing acceptance criteria

| Item | Current text (short quote or summary) | Added or changed criterion |
|---|---|---|
| **NFR-6** | "At least 70% line coverage on domain logic" | `"Domain logic"` is defined as the following modules: **Fees and Commissions**, **Payment Processing state logic**, **Ledger/Wallet**, and **Fraud Checks**. |

---

## Design patterns overview

| Pattern | Problem it solves | Module | Related spec file |
|---|---|---|---|
| Adapter and Factory | Integrates heterogeneous biller protocols behind one interface and instantiates the matching biller handler from configuration | Biller Integration | [module-interfaces.md](module-interfaces.md) |
| Strategy | Selects and applies configurable fee calculation rules per service and promotion | Fees & Commissions | [business-rules.md](business-rules.md) |
| State | Enforces legal payment life-cycle states and transitions (`requirements.md` section 5) | Payment Processing | [state-transactions.md](state-transactions.md) |
| Chain of Responsibility | Runs sequential fraud and limit checks (single limits, daily limit, velocity, account block) before holding funds | Fraud Checks | [business-rules.md](business-rules.md) |
| Observer | Triggers asynchronous SMS and push notifications on payment completion or failure without coupling notification failures to payment state | Notifications | [hard-cases.md](hard-cases.md) |
| Command | Encapsulates scheduled biller re-query retry attempts for `Unknown` payments | Biller Integration | [state-transactions.md](state-transactions.md) |

---

## Change history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | _YYYY-MM-DD_ | _name_ | Split from the former specs.md (removed) |

Related files: [business-rules.md](business-rules.md), [state-transactions.md](state-transactions.md), [ledger-rules.md](ledger-rules.md), [module-interfaces.md](module-interfaces.md), [hard-cases.md](hard-cases.md).

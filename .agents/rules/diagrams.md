# Diagram Rules

Applies to everything in `docs/design/diagrams/`.

## Format
- Source files only: `.puml` (PlantUML) or `.mmd` (Mermaid). Pick one tool per diagram and keep it. No screenshots.
- Required diagrams: `use-case`, `class-domain`, `sequence-pay-bill`, `sequence-refund-failed`, `state-payment`, `er-diagram`.
- Optional extras: `activity-pay-bill`, `component-modules`, `deployment-compose`. Only keep an extra if it adds information and stays consistent.
- File names are lowercase with hyphens. Each file starts with a comment: purpose, last updated, related requirements (US/FR ids).

## Consistency (graded)
- Use identical names across all diagrams: class names = ER entity names (singular/plural mapped consistently), states = the eight states in `AGENTS.md`, modules = the module names in the brief.
- The Wallet class and entity must show **available balance and held balance** (derived from LedgerEntry, not stored as an overwritten value).
- The state diagram must match the transition table exactly: no extra arrows, none missing, and a final marker only on Completed, Rejected, Refunded.
- The refund sequence must show: Failed → hold released → Refunded, with ledger entries, and must NOT refund an Unknown payment.
- The pay-bill sequence must show the order: limits check → inquiry → fee → fraud checks → hold → biller call → confirm → ledger/fee/commission → notification. It must also show the timeout branch.

## Quality
- Make sure the syntax renders. Say which renderer or command you used to check, or state clearly that you could not check it.
- After generating or editing a diagram, list any mismatch you found against other diagrams or specs. Do not claim consistency without checking.
- Keep each diagram focused and readable. Split a diagram instead of drawing 40 classes in one.
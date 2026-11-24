# Requirements Writing Rules

Applies to `docs/requirements.md` and any story or acceptance criteria.

## User stories
- ID format: `US-nn`, linked to `FR-n` from the brief. Keep the traceability table in section 10 updated whenever a story is added, removed or renamed.
- Form: "As a <role>, I want <goal> so that <benefit>."
- Acceptance criteria use **Given / When / Then** with concrete numbers (for example 350.00 bill + 2.50 fee = 352.50 total).
- Every story has a priority: Must, Should or Could. Never downgrade a Must from the brief.
- Each story must be testable. If you cannot imagine the test, rewrite the story.
- Cover failure paths, not only the happy path.

## Non-functional requirements
- Each NFR has a number and a measurement method. Reject vague words such as "fast", "secure", "robust" unless a number follows.

## Ambiguities and decisions
- When the brief is unclear, add a row to section 9 (question, source, decision). Do not decide silently.
- Propose a default and give the reason. I confirm the final decision.

## Consistency
- Business-rule numbers must match `docs/design/specs/business-rules.md`. Do not hardcode a different value anywhere.
- The minimum counts from the brief must stay satisfied: 25+ stories, 6+ measurable NFRs.
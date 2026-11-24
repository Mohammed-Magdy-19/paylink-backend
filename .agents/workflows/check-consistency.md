# Check Consistency

Audit Phase 1 documents for contradictions. Do not edit anything without my approval.

1. Read `docs/requirements.md`, all specs in `docs/design/specs/`, and all diagrams.
2. Check these items and report each as OK or MISMATCH with file and line:
   - The eight payment states and all transitions match across state spec, state diagram, class diagram and sequence diagrams.
   - Business-rule numbers (limits, fees, timeouts, retries, commission) match across requirements, specs and stories.
   - Class names, ER entities and module names match.
   - Wallet shows available and held balance, derived from the ledger.
   - Every Must FR has a user story, a module and a planned test in the traceability table.
   - The 8 hard cases each have a Given/When/Then and a test name.
3. Produce a short table of mismatches with a suggested fix.
4. Wait for my decision before changing any file.
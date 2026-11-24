# AI Use, Git and Academic Integrity

## Prompt log (`docs/prompt-log.md`)
- Columns: Date, Author, Stage, Tool and model, Prompt, Summary of answer, Verdict (accepted / fixed / rejected) and why.
- You may DRAFT an entry for me, but never invent the verdict. Mark it `DRAFT: verdict pending` and wait for my decision.
- The log needs at least 5 entries, including 2 where the first answer was wrong and the prompt was improved. When you notice a mistake in your own earlier answer, say so clearly so I can log it.

## Commits and pull requests
- Never commit directly to `main`. Work on a branch and open a pull request. A teammate reviews before merge.
- Conventional style messages: `docs: add state transition table`, `ci: add lint step`.
- If AI wrote more than half of a change, the commit message names the tool, for example `docs: draft ledger rules (AI: Antigravity/Gemini)`.
- Do not run `git push --force`, rewrite history or delete tags. Do not create the `phase-1` tag unless I ask.

## Safety
- Never include real passwords, tokens, personal data or another team's code in files or prompts.
- Do not read or copy files outside this repository.
- Ask before running destructive commands (delete, reset, prune, volume removal).

## Explain what you commit
- I must be able to explain every line at the discussion. Keep changes simple and add a short explanation of anything non-obvious.
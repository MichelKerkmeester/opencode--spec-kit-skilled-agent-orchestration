---
title: "Tasks: Copilot Writer Wiring"
importance_tier: "high"
contextType: "spec"
---
# Tasks

- [x] **T-01** — Replace UserPromptSubmit wrapper `bash: "true"` with Copilot `user-prompt-submit.js` invocation + `timeoutSec: 5`.
- [x] **T-02** — Replace SessionStart wrapper `bash: "true"` with Copilot `session-prime.js` invocation + `timeoutSec: 5`.
- [x] **T-03** — Validate JSON: `jq` PASS.
- [x] **T-04** — Standalone writer probe via `SPECKIT_COPILOT_INSTRUCTIONS_PATH` temp-file — managed block rendered with fresh `Refreshed:` timestamp.
- [ ] **T-05** — User runs live `copilot -p "wiring smoke"` from fresh shell; confirms `Refreshed:` advances in `$HOME/.copilot/copilot-instructions.md` AND `Source:` line says `userPromptSubmitted hook`.
- [x] **T-06** — `implementation-summary.md` authored with diff + probe evidence + smoke instructions.

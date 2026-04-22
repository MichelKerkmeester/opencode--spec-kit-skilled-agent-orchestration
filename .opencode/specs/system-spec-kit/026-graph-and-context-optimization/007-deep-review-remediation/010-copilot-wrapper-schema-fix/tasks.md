---
title: "Task Breakdown: Copilot Wrapper Schema Fix"
importance_tier: "high"
contextType: "spec"
---
# Tasks

- [x] **T-01** — Patch `.claude/settings.local.json`: added top-level `type`/`bash:"true"`/`timeoutSec:3` to all 4 matcher wrappers (UserPromptSubmit, PreCompact, SessionStart, Stop). *Evidence*: Edit diff + jq validation.
- [x] **T-02** — Validated JSON syntax: `jq . .claude/settings.local.json >/dev/null` → PASS.
- [ ] **T-03** — User runs live Copilot smoke: `copilot -p "schema smoke"` in fresh shell. *Blocked on user*.
- [ ] **T-04** — Inspect newest `~/.copilot/logs/process-*.log` for zero `Neither 'bash' nor 'powershell'` matches. *Depends on T-03*.
- [x] **T-05** — `implementation-summary.md` authored with diff + smoke instructions.
- [x] **T-06** — Cross-linked from `007-copilot-hook-parity-remediation/implementation-summary.md` §Known Limitations (items 6, 7).

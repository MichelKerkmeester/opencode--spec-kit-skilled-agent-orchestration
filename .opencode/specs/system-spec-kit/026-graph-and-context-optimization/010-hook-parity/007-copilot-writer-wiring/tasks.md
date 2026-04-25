---
title: "Tasks: Copil [system-spec-kit/026-graph-and-context-optimization/010-hook-parity/007-copilot-writer-wiring/tasks]"
description: 'title: "Tasks: Copilot Writer Wiring"'
trigger_phrases:
  - "tasks"
  - "copil"
  - "011"
  - "copilot"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-hook-parity/007-copilot-writer-wiring"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Wiring was applied then reverted along with 010 in 6cd00aa51b"
    next_safe_action: "Reapply UserPromptSubmit/SessionStart writer commands after 010 is reapplied"
    completion_pct: 35
    status: "reverted-needs-reapply"
---
# Tasks

- [ ] **T-01** — Reapply the `UserPromptSubmit` top-level writer command plus `timeoutSec: 5`. *Note*: reverted in `6cd00aa51b` — reapply required.
- [ ] **T-02** — Reapply the `SessionStart` top-level writer command plus `timeoutSec: 5`. *Note*: reverted in `6cd00aa51b` — reapply required.
- [ ] **T-03** — Re-validate `.claude/settings.local.json` after the top-level writer commands are restored.
- [ ] **T-04** — Re-run the standalone writer probe after the wrapper commands are restored so the current packet evidence is live again.
- [ ] **T-05** — User runs live `copilot -p "wiring smoke"` from a fresh shell after packets 010 and 011 are reapplied.
- [x] **T-06** — `implementation-summary.md` truth-synced to record the landing commit, revert commit, and reapply dependency.

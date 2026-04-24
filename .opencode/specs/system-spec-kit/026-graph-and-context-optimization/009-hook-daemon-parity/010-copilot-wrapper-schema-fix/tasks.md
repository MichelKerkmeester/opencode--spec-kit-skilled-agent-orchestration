---
title: "Task [system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/tasks]"
description: 'title: "Task Breakdown: Copilot Wrapper Schema Fix"'
trigger_phrases:
  - "task"
  - "tasks"
  - "010"
  - "copilot"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix"
    last_updated_at: "2026-04-23T15:20:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Patch reverted in 6cd00aa51b — fields no longer present in settings.local.json"
    next_safe_action: "Reapply top-level type/bash/timeoutSec fields to all four matcher wrappers"
    completion_pct: 40
    status: "reverted-needs-reapply"
---
# Tasks

- [ ] **T-01** — Reapply the top-level `type` / `bash: "true"` / `timeoutSec: 3` fields to all 4 matcher wrappers (UserPromptSubmit, PreCompact, SessionStart, Stop). *Note*: reverted in `6cd00aa51b` — reapply required.
- [ ] **T-02** — Re-verify `.claude/settings.local.json` shows those top-level fields on all 4 wrappers. *Note*: reverted in `6cd00aa51b` — reapply required.
- [ ] **T-03** — User runs live Copilot smoke: `copilot -p "schema smoke"` in fresh shell. *Blocked on user*.
- [ ] **T-04** — Inspect newest `~/.copilot/logs/process-*.log` for zero `Neither 'bash' nor 'powershell'` matches. *Depends on T-03*.
- [x] **T-05** — `implementation-summary.md` truth-synced to document the landing commit plus revert commit.
- [x] **T-06** — Parent packet rollup updated so packet 010 is marked `reverted-needs-reapply`.

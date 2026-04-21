---
title: "Tasks: CLI Runtime Executors (merged pointer)"
description: "Top-level task pointer. All work shipped. Detail in 001-executor-feature/tasks.md and 002-runtime-matrix/tasks.md."
trigger_phrases: ["cli runtime executors tasks"]
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/002-sk-deep-cli-runtime-execution"
    last_updated_at: "2026-04-18T16:30:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Merged tasks pointer created"
    next_safe_action: "Consult child task files"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: CLI Runtime Executors (merged pointer)

All tasks shipped. This top-level is a pointer; child packets hold the task ledgers.

## Child Task Ledgers

- **001-executor-feature** (ex-018) → `001-executor-feature/tasks.md`
  - 14 tasks across Phase A-E (schema, prompt-pack, YAML branch, review mirror, docs + tests)
- **002-runtime-matrix** (ex-019) → `002-runtime-matrix/tasks.md`
  - ~9 tasks across Phase A-C (per-kind validation, YAML branches for 3 new kinds, docs)

## Downstream

- `../002-cli-executor-remediation/tasks.md` — R1-R12 remediation tasks (38 tasks across 8 waves)

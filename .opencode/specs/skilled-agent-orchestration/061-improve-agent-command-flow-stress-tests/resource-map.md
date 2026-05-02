<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 061"
description: "Lean path ledger."
trigger_phrases: ["061 resource map"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/061-improve-agent-command-flow-stress-tests"
    last_updated_at: "2026-05-02T15:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored resource map"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Resource Map: 061

<!-- SPECKIT_LEVEL: 3 -->

## Files to Modify

| Path | Stage | Layer |
|---|---|---|
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md` | 2 | command-flow (CP-040) |
| `.../014-proposal-only-boundary.md` | 3 | body-level (CP-041) — materialize 5 required inputs |
| `.../015-active-critic-overfit.md` | 3 | body-level (CP-042) — materialize 5 required inputs |
| `.../016-legal-stop-gate-bundle.md` | 2 | command-flow (CP-043) |
| `.../017-improvement-gate-delta.md` | 2 | command-flow (CP-044) |
| `.../018-benchmark-completed-boundary.md` | 2 | command-flow (CP-045) |

## Files to Create

| Path | Stage |
|---|---|
| `.opencode/skill/sk-improve-agent/scripts/setup-cp-061-sandbox.sh` (or packet-local) | 1 |
| `test-report.md` (in this packet) | 5 |

## Source-of-Truth References (read-only)

| Path | Role |
|---|---|
| `../060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md` | §4 layer partition + §9 hand-off |
| `../062-improve-agent-executable-wiring/handover.md` | 062 substrate hand-off |
| `../059-agent-implement-code/test-report.md` | 11-section ANCHOR template |

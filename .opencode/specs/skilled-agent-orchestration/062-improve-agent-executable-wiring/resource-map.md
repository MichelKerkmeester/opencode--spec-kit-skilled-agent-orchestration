<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 062"
description: "Lean path ledger for executable-wiring packet."
trigger_phrases: ["062 resource map"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/062-improve-agent-executable-wiring"
    last_updated_at: "2026-05-02T14:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored resource map"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Resource Map: 062

<!-- SPECKIT_LEVEL: 3 -->

## Source of Truth (read-only)

| Path | Role |
|---|---|
| `../060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md` | Research synthesis (§5 + §9 are the implementation contract) |
| `../060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md` | R1 narrative (context for why 062 exists) |

## Files to Create

| Path | Stage |
|---|---|
| `.opencode/skill/sk-improve-agent/assets/benchmark-profiles/default.json` | 2 |
| `.opencode/skill/sk-improve-agent/assets/benchmark-fixtures/*.json` (2-3 files) | 2 |
| `.opencode/skill/sk-improve-agent/scripts/materialize-benchmark-fixtures.cjs` | 2 |

## Files to Modify

| Path | Stage | What |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs` | 3 | Consume materialized fixtures; emit report.json |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | 3 + 4 | Materializer + run-benchmark wiring; nested gateResults; benchmark_completed after report |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | 3 + 4 | Lockstep parity |
| `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` | 4 | Accept nested gateResults |
| `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs` | 4 | Consume nested gateResults; render in dashboard |
| `.opencode/skill/sk-improve-agent/SKILL.md` | 5 | Document 062's new shapes |
| RT-028 + RT-032 fixture scenarios | 5 | Reconcile naming/signals |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/01[3-8]-*.md` | 6 | Update CP-040..045 expected-signal shapes |
| Existing test files (journal, reducer, score-candidate) | 4 | Match new shapes |

## Tooling

| Tool | Purpose |
|---|---|
| `codex exec --model gpt-5.5 -c model_reasoning_effort=high -c service_tier=fast --sandbox workspace-write` | Implementation executor |
| `node generate-context.js` | JSON metadata bootstrap |
| `bash validate.sh --strict` | Spec folder shape verification |

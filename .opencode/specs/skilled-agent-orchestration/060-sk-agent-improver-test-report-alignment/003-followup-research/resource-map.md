<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 060/003"
description: "Lean path ledger for the followup research packet."
trigger_phrases: ["060/003 resource map"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research"
    last_updated_at: "2026-05-02T13:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored resource map"
    next_safe_action: "Run loop"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Resource Map: 060/003

<!-- SPECKIT_LEVEL: 3 -->

## Source of Truth (read-only this packet)

| Path | Role |
|---|---|
| `../002-stress-test-implementation/test-report.md` | R1 narrative + meta-finding |
| `../002-stress-test-implementation/stress-runs/stage4-summary.md` | R1 verdict table |
| `../002-stress-test-implementation/stress-runs/stage4-run-log.txt` | Full transcripts |
| `../001-deep-research-recommendations/research/research.md` | 854-line synthesis |
| `../../059-agent-implement-code/test-report.md` | Methodology template |

## Other meta-agents to classify (RQ-4)

| Path | Why classify |
|---|---|
| `.opencode/agent/write.md` | Documentation specialist — body or command level? |
| `.opencode/agent/improve-prompt.md` | Sibling to improve-agent — same architecture? |
| `.opencode/agent/debug.md` | 5-phase root-cause — body or command? |
| `.opencode/agent/deep-research.md` | LEAF dispatched by command — body or command? |
| `.opencode/agent/deep-review.md` | Sibling to deep-research — same? |
| `.opencode/agent/context.md` | Read-only retrieval — body or command? |
| `.opencode/agent/orchestrate.md` | Dispatcher — N/A or special case? |
| `.opencode/agent/review.md` | Code review — body or command? |
| `.opencode/agent/code.md` | Body-level (verified in 059) — confirm baseline |

## Outputs

- `research/iterations/iteration-{001..010}.md`
- `research/research.md` (synthesis)
- `research/deep-research-{config,state,strategy,dashboard}.{json,md,jsonl}`
- `research/findings-registry.json`
- `research/run-log.txt`

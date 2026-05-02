<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 060/001 — Deep Research Recommendations"
description: "Lean path ledger. 001 is research-only — no source-file changes outside the packet."
trigger_phrases: ["060/001 resource map"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations"
    last_updated_at: "2026-05-02T16:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Resource map updated with full added/updated file inventory"
    next_safe_action: "n/a — packet COMPLETE"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 060/001 — Deep Research Recommendations

<!-- SPECKIT_LEVEL: 3 -->

## Scope

Research-only packet. **No source-file changes outside the packet folder.** All outputs are research artifacts inside `001-deep-research-recommendations/`.

---

## Files Added (inside packet)

### Spec docs (8 markdown + 2 JSON)

```
.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/
├── spec.md
├── plan.md
├── tasks.md
├── checklist.md
├── decision-record.md
├── implementation-summary.md
├── handover.md
├── resource-map.md          (this file)
├── description.json
└── graph-metadata.json
```

### Research artifacts

```
.opencode/specs/.../001-deep-research-recommendations/research/
├── deep-research-config.json          (config + executor spec)
├── deep-research-state.jsonl          (event log: init/iteration/converged/complete)
├── deep-research-strategy.md          (research charter + 7 RQs + key questions)
├── deep-research-dashboard.md         (live status dashboard)
├── findings-registry.json             (open/resolved questions, key findings, ruled-out)
├── run-log.txt                        (full transcript of all copilot dispatches)
├── research.md                        (854-line synthesis — the source of truth)
├── iterations/
│   ├── iteration-001.md
│   ├── iteration-002.md
│   ├── iteration-003.md
│   ├── iteration-004.md
│   ├── iteration-005.md
│   ├── iteration-006.md
│   ├── iteration-007.md
│   ├── iteration-008.md
│   ├── iteration-009.md
│   └── iteration-010.md               (1614 total lines across 10 iterations)
├── prompts/
│   └── iteration-001.md ... iteration-010.md   (the prompt fed to copilot per iteration)
└── deltas/                            (empty — placeholder for future state-delta files)
```

```
.opencode/specs/.../001-deep-research-recommendations/research_archive/
                                       (empty — placeholder for archive lineage)
```

---

## Files Updated

**None.** Research-only scope per ADR-3.

---

## Files Referenced (NOT modified in 001)

| Path | Role |
|---|---|
| `.opencode/skill/sk-improve-agent/SKILL.md` | Primary research target (463 lines) |
| `.opencode/agent/improve-agent.md` | Primary research target (246 lines) |
| `.opencode/command/improve/agent.md` | Primary research target (456 lines) |
| `.opencode/skill/sk-improve-agent/references/` (12 docs) | Secondary surface |
| `.opencode/skill/sk-improve-agent/scripts/` (13 .cjs scripts) | Secondary surface |
| `.opencode/skill/sk-improve-agent/assets/` (6 items) | Secondary surface |
| `.opencode/specs/.../059-agent-implement-code/test-report.md` | Methodology reference (570 lines) |

---

## Outputs of this packet (consumed by 060/002 and 060/003)

- `research/research.md` — 854-line synthesis: gap analysis per RQ, 11 sketched CP-XXX scenarios, prioritized diff sketches, fixture-target recommendation, hand-off notes
- `implementation-summary.md` — RQ-by-RQ summary table, top recommendations, packet 061 hand-off notes

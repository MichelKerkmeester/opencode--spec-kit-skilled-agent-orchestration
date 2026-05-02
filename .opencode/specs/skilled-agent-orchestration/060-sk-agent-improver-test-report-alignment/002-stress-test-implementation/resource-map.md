<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 060/002 — Stress-Test Implementation"
description: "Lean path ledger. 002 made the first source-file changes outside the packet (improve-agent body + 4 mirrors, SKILL, 2 scripts, 2 YAMLs, root playbook index, 6 CP scenarios, test fixture). All shipped on commit 3b5f00ee4."
trigger_phrases: ["060/002 resource map"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T16:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Resource map updated with full added/updated file inventory from commit 3b5f00ee4"
    next_safe_action: "n/a — packet COMPLETE"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 060/002 — Stress-Test Implementation

<!-- SPECKIT_LEVEL: 3 -->

## Scope

First implementation packet. Applied 5 P0 + 1 P1 diff sketches from `001/research/research.md`, authored 6 stress-test scenarios + a fixture target, then ran R1 stress (scored 0/2/4 — surfaced the test-layer-selection meta-finding).

Shipped on commit **`3b5f00ee4`**.

---

## Files Added (outside packet)

### CP-XXX playbook scenarios (6 new files)

```
.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/
├── 013-skill-load-not-protocol.md           (CP-040 — 113 lines)
├── 014-proposal-only-boundary.md            (CP-041 — 115 lines)
├── 015-active-critic-overfit.md             (CP-042 — 108 lines)
├── 016-legal-stop-gate-bundle.md            (CP-043 — 112 lines)
├── 017-improvement-gate-delta.md            (CP-044 — 111 lines)
└── 018-benchmark-completed-boundary.md      (CP-045 — 112 lines)
```

### Fixture target (4-runtime mirror)

```
.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/
├── README.md                                (intentional flaws documented)
├── benchmark/sentinel.js                    (sentinel for old contract — retired by 062)
├── .opencode/agent/cp-improve-target.md     (canonical fixture agent)
├── .claude/agents/cp-improve-target.md      (mirror)
├── .gemini/agents/cp-improve-target.md      (mirror)
└── .codex/agents/cp-improve-target.toml     (mirror)
```

---

## Files Added (inside packet)

```
.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/
├── spec.md
├── plan.md
├── tasks.md
├── checklist.md
├── decision-record.md
├── implementation-summary.md
├── handover.md
├── resource-map.md                          (this file)
├── description.json
├── graph-metadata.json
├── test-report.md                           (570-line narrative; 11 ANCHOR pairs)
└── stress-runs/
    ├── stage4-summary.md                    (R1 verdict table)
    ├── stage4-run-log.txt                   (full transcripts)
    └── raw-verdicts.txt                     (per-CP verdicts)
```

---

## Files Updated (outside packet)

### Agent triad — 4-runtime mirror parity (CRITIC PASS section added)

```
.opencode/agent/improve-agent.md                    (canonical, +CRITIC PASS §6.5)
.claude/agents/improve-agent.md                     (mirror)
.gemini/agents/improve-agent.md                     (mirror)
.codex/agents/improve-agent.toml                    (mirror, toml-wrapped)
```

### Skill + helper scripts

```
.opencode/skill/sk-improve-agent/SKILL.md           (skill-load ≠ protocol-execution clarification)
.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs    (.gemini/agents mirror path fix)
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs     (--baseline + delta + thresholdDelta)
```

### Command YAMLs (auto + confirm lockstep)

```
.opencode/command/improve/assets/improve_improve-agent_auto.yaml      (legal_stop_evaluated + benchmark_completed + blocked_stop emissions)
.opencode/command/improve/assets/improve_improve-agent_confirm.yaml   (same)
```

### Playbook root index

```
.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md   (§10 + §16 updated for CP-040..045)
```

---

## Net stat (commit 3b5f00ee4)

**+3264 / -164 across 30 files.**

---

## Outputs of this packet (consumed by 060/003 + 062 + 061)

- R1 stress run results (0/2/4 PASS/PARTIAL/FAIL) — surfaced the meta-finding
- `test-report.md` — narrative + meta-finding (the source of the puzzle 060/003 solved)
- 6 CP-XXX scenarios (later modified by 062 for new shapes + by 061 for command-flow dispatch)

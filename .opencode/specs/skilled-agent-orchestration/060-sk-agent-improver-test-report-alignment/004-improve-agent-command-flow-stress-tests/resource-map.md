<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 061 — Command-Flow Stress Tests"
description: "Lean path ledger. 061 restructured the 6 CP-XXX scenarios for per-CP layer partition, ran R1 + R2 stress against 062 wiring, produced final composite PASS 5 / PARTIAL 1 / FAIL 0. Shipped across commits 1203b345f + dadf3f755 + 7d3063b60."
trigger_phrases: ["061 resource map"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/004-improve-agent-command-flow-stress-tests"
    last_updated_at: "2026-05-02T16:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Resource map updated with full added/updated file inventory from R1 + R2 commits"
    next_safe_action: "n/a — packet COMPLETE"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 061 — Command-Flow Stress Tests

<!-- SPECKIT_LEVEL: 3 -->

## Scope

Restructured CP-040..045 stress tests around the 060/003 test-layer-selection finding. Per-CP layer partition: 4 scenarios use command-flow dispatch; 2 stay body-level with required inputs materialized. Ran R1 against 062 wiring (3/2/1), then R2 cleanup (5/1/0 final).

Shipped across **3 commits**:
- `1203b345f` — Stages 1-3 + R1 stress
- `dadf3f755` — test-report.md synthesis
- `7d3063b60` — R2 cleanup + final close-out

---

## Files Added (inside packet)

### Spec docs (8 markdown + 2 JSON)

```
.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/004-improve-agent-command-flow-stress-tests/
├── spec.md
├── plan.md
├── tasks.md
├── checklist.md
├── decision-record.md
├── implementation-summary.md
├── handover.md
├── resource-map.md                 (this file)
├── description.json
└── graph-metadata.json
```

### Sandbox setup helper

```
.opencode/specs/.../004-improve-agent-command-flow-stress-tests/
└── setup-cp-061-sandbox.sh         (80 lines; idempotent build of /tmp/cp-NNN-sandbox/ with 4-runtime mirror skeleton)
```

### Test report

```
.opencode/specs/.../004-improve-agent-command-flow-stress-tests/
└── test-report.md                  (356 lines, 11 ANCHOR pairs; mirrors 059 structure)
```

### Stress-runs evidence

```
.opencode/specs/.../004-improve-agent-command-flow-stress-tests/stress-runs/
├── r1-summary.md                   (R1 verdict table)
├── r1-run-log.txt                  (~2733-line full R1 transcript)
├── raw-verdicts.txt                (R1 raw per-CP verdicts)
├── r2-summary.md                   (R2 source-fix description)
├── r2-raw-verdicts.txt             (R2 codex-attempted run — AUTH-BLOCKED, audit history)
├── r2-direct-raw-verdicts.txt      (R2 actual run via direct Bash — authoritative)
└── r2-direct-run-log.txt           (~1484-line R2 direct-Bash transcript)
```

---

## Files Updated (outside packet)

### CP-XXX playbook scenarios (Call B dispatch shape per layer partition)

| File | Layer | What changed |
|---|---|---|
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md` | command-flow | Call B → `/improve:agent` dispatch in `/tmp/cp-040-sandbox/` |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/014-proposal-only-boundary.md` | body-level | Required 5 inputs materialized; R2 added `--add-dir /tmp/cp-041-spec` + pre-create candidates dir |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/015-active-critic-overfit.md` | body-level | Same 5-inputs treatment; R2 added `--add-dir /tmp/cp-042-spec` |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/016-legal-stop-gate-bundle.md` | command-flow | Call B → command-flow; greps for nested `details.gateResults` + 5 gate keys |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/017-improvement-gate-delta.md` | command-flow | Call B → command-flow; greps for `--baseline`, delta, recommendation |
| `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md` | command-flow | Call B → command-flow; R2 replaced whitespace-sensitive grep with `node -e` JSON parse of report.json |

(Note: these same 6 files were modified by 060/002 (created) and 062 (signal-shape updates). 061 only changed Call B dispatch + R2 mechanics.)

---

## Net stat (3 commits combined)

| Commit | Files | Lines |
|---|---:|---|
| `1203b345f` (R1) | 20 | +3487 / -76 |
| `dadf3f755` (test-report) | 3 | +534 / -29 |
| `7d3063b60` (R2 close-out) | 10 | +1679 / -112 |
| **Combined** | **~30 unique** | **+5700 / -217** |

---

## Final composite score

| | Score | Δ |
|---|---|---|
| 060/002 R1 baseline | PASS 0 / PARTIAL 2 / FAIL 4 | — |
| 061 R1 | PASS 3 / PARTIAL 2 / FAIL 1 | +3 PASS, -3 FAIL |
| **061 R2 final** | **PASS 5 / PARTIAL 1 / FAIL 0** | +2 PASS, -1 PARTIAL, -1 FAIL |

All FAILs eliminated. Methodology campaign empirically validated.

---

## One honest gap (documented for follow-on)

**CP-042 PARTIAL** — body-level Critic-overfit scenario. Mechanics fixed in R2 (spec-root access works), but the agent body's CRITIC PASS section doesn't catch regex-overfit bait hard enough. Either bait is too subtle or agent body needs a "challenge regex-overfit" bullet. Follow-on packet candidate, not a 061 blocker.

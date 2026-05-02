<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
---
title: "Resource Map: 062 — sk-improve-agent Executable Wiring"
description: "Lean path ledger. 062 is the executable-wiring packet: added benchmark static assets + materializer; modified scripts/YAMLs/SKILL/RT-028+RT-032/CP-040..045/tests in lockstep. All shipped on commit 6374d5806."
trigger_phrases: ["062 resource map"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/005-improve-agent-executable-wiring"
    last_updated_at: "2026-05-02T16:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Resource map updated with full added/updated file inventory from commit 6374d5806"
    next_safe_action: "n/a — packet COMPLETE"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: 062 — sk-improve-agent Executable Wiring

<!-- SPECKIT_LEVEL: 3 -->

## Scope

Wired the executable producers + consumers across sk-improve-agent's command-flow pipeline so legal-stop, benchmark, and stop-reason evidence is grep-checkable and reducer-compatible. Decisions locked in 060/003 research §5: static skill assets, materializer alongside `run-benchmark.cjs`, auto+confirm YAML lockstep, nested `legal_stop_evaluated.details.gateResults`, SKILL canonical stop-reason enum.

Shipped on commit **`6374d5806`**.

---

## Files Added (outside packet)

### Static benchmark assets

```
.opencode/skill/sk-improve-agent/assets/benchmark-profiles/
└── default.json                                (profile JSON: fixtureDir, fixtures, outputsDir, metrics, thresholdDelta)

.opencode/skill/sk-improve-agent/assets/benchmark-fixtures/
├── fixture-baseline.json
├── fixture-improved.json
└── fixture-edge.json
```

### Materializer helper

```
.opencode/skill/sk-improve-agent/scripts/
└── materialize-benchmark-fixtures.cjs          (97 lines; reads profile, writes outputsDir/{id}.md before run-benchmark.cjs)
```

---

## Files Added (inside packet)

```
.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/005-improve-agent-executable-wiring/
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

---

## Files Updated (outside packet)

### Helper scripts

```
.opencode/skill/sk-improve-agent/scripts/
├── run-benchmark.cjs                           (consumes materialized fixtures, emits report.json + benchmark_run state row)
├── improvement-journal.cjs                     (validates nested details.gateResults; rejects non-canonical stop reasons)
└── reduce-state.cjs                            (consumes nested details.gateResults; surfaces journalSummary.latestLegalStop.gateResults)
```

### Command YAMLs (auto + confirm lockstep)

```
.opencode/command/improve/assets/improve_improve-agent_auto.yaml       (materializer→run-benchmark wiring; nested legal_stop_evaluated; benchmark_completed gated on report file)
.opencode/command/improve/assets/improve_improve-agent_confirm.yaml    (same — lockstep parity)
```

### Skill docs + references

```
.opencode/skill/sk-improve-agent/SKILL.md                              (static-asset benchmark location; materializer ownership; nested gate shape; stop-reason enum truth)
.opencode/skill/sk-improve-agent/README.md                             (top-level skill description align)
.opencode/skill/sk-improve-agent/changelog/v1.1.0.0.md                 (062 changes documented)
.opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md
.opencode/skill/sk-improve-agent/references/quick_reference.md
```

### Native RT scenarios (sk-improve-agent's own playbook)

```
.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md
.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md
```

### CP-XXX playbook scenarios (signal shapes updated for 062's emissions)

```
.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/
├── 013-skill-load-not-protocol.md              (CP-040)
├── 014-proposal-only-boundary.md               (CP-041)
├── 015-active-critic-overfit.md                (CP-042)
├── 016-legal-stop-gate-bundle.md               (CP-043 — nested gateResults greps)
├── 017-improvement-gate-delta.md               (CP-044)
└── 018-benchmark-completed-boundary.md         (CP-045 — report.json + status assertions)
```

### Existing tests (matched to new shapes)

```
.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/candidate-lineage.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts
.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/README.md
.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl
```

---

## Net stat (commit 6374d5806)

**+1182 / -117 across 39 files.** Test suite passes 91 tests / 193 expects, no regressions.

---

## Outputs of this packet (consumed by 061)

- Working benchmark pipeline (assets + materializer + runner producing `report.json`)
- Both YAMLs emit nested `legal_stop_evaluated.details.gateResults` matching reducer consumer shape
- Stop-reason enum reconciled (Option A: `plateau`/`benchmarkPlateau` removed from helper+tests; SKILL canonical)
- CP-040..045 expected-signal shapes ready for 061's stress reruns

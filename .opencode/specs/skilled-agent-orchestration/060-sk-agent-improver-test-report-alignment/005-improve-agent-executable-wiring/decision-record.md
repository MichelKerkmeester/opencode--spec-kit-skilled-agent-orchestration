<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
---
title: "Decision Record: 062"
description: "5 ADRs governing the executable wiring choices already locked from 060/003 research."
trigger_phrases: ["062 ADRs"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/005-improve-agent-executable-wiring"
    last_updated_at: "2026-05-02T14:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored 5 ADRs"
    next_safe_action: "Begin Stage 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Decision Record: 062

<!-- SPECKIT_LEVEL: 3 -->

## ADR-1: Benchmark assets are static skill assets

**Decision:** Benchmark profiles + fixtures live at `.opencode/skill/sk-improve-agent/assets/benchmark-profiles/*.json` + `assets/benchmark-fixtures/*.json`. NOT packet-local.

**Why:** Versioned with the skill. Reused across improvement runs (every dispatch shares the same baseline benchmark contract). Doesn't bloat each spec packet. User-decided after 060/003 research surfaced both options.

**Source:** 060/003/research/research.md §5 062 sketch (user-confirmed).

## ADR-2: Materializer ships alongside run-benchmark.cjs

**Decision:** `materialize-benchmark-fixtures.cjs` lives at `.opencode/skill/sk-improve-agent/scripts/`, adjacent to the runner that consumes its output.

**Why:** Adjacent ownership keeps the materializer + runner contract obvious. Both update together. Easier code review.

**Source:** 060/003/research/research.md §5 062 sketch.

## ADR-3: Auto + confirm YAML patched in lockstep

**Decision:** Every emission/wiring change applies to both `improve_improve-agent_auto.yaml` and `improve_improve-agent_confirm.yaml` in the same diff. No "auto-only first, confirm later."

**Why:** Producer/consumer compatibility — reducer/dashboard/tests can't fork by execution mode. One source-of-truth shape across both modes.

**Alternatives considered:** Defer confirm parity to a follow-on. Rejected because it creates a known-stale surface that the next packet has to reconcile.

## ADR-4: Legal-stop emission shape is nested details.gateResults

**Decision:** YAML emits `legal_stop_evaluated` with nested `details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}` — NOT flat `gateName/gateResult` fields.

**Why:** Reducer (reduce-state.cjs:213-217) reads `details.gateResults`. The flat shape is producer/consumer incompatible. Nested is what the consumer expects.

**Migration:** Optional flat-field reducer tolerance for one release if needed; deprecate after.

## ADR-5: Stop-reason enum truth lives in SKILL.md

**Decision:** SKILL.md is canonical for the stop-reason enum. `plateau` and `benchmarkPlateau` (currently in helper + tests, not in SKILL) get reconciled — either removed from helper/tests OR explicitly documented as deprecated compatibility aliases in SKILL.md.

**Why:** Three surfaces disagreeing is a recipe for silent drift. One canonical source forces alignment.

**Open question for 062 implementation:** which reconciliation direction (remove from helper/tests, or document as aliases). Let cli-codex propose based on actual usage during T-014.

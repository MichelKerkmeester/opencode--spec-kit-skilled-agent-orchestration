<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
---
title: "Plan: 062 — Executable Wiring"
description: "6-stage plan: scaffold + assets, materializer + benchmark wiring, legal-stop nested shape, stop-reason reconciliation, RT alignment, CP playbook updates."
trigger_phrases: ["062 plan"]
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/062-improve-agent-executable-wiring"
    last_updated_at: "2026-05-02T14:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Phase plan authored"
    next_safe_action: "Begin stage 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

# Plan: 062 — Executable Wiring

<!-- SPECKIT_LEVEL: 3 -->

## 1. OVERVIEW

Six stages, executed in dependency order per 060/003 research §9 hand-off. Total wall-time est: 1-2 hours autonomous via cli-codex.

| Stage | Output | Time |
|---|---|---|
| 1. Scaffold + bootstrap | spec packet metadata in place | ~5 min |
| 2. Static benchmark assets + materializer | profile JSON, fixture JSON, materialize-benchmark-fixtures.cjs | ~15 min |
| 3. run-benchmark.cjs wiring + auto/confirm YAML lockstep | benchmark step calls materializer then run-benchmark.cjs; emits benchmark_completed after report | ~20 min |
| 4. Legal-stop nested shape + reducer consumer + stop-reason enum truth | YAML emits nested gateResults; reducer reads it; stop-reason reconciled | ~20 min |
| 5. Native RT-028/RT-032 alignment + SKILL.md docs | RT scenarios pass; SKILL.md describes new state | ~15 min |
| 6. CP-040..045 playbook signal-shape updates + tests | playbook expected-signals match new shape; tests pass | ~15 min |

## 2. STAGE 1 — SCAFFOLD

1. Author 8 markdown files at packet root (this stage)
2. Bootstrap `description.json` + `graph-metadata.json` via `generate-context.js`
3. Strict-validate

## 3. STAGE 2 — STATIC BENCHMARK ASSETS + MATERIALIZER

1. Create `.opencode/skill/sk-improve-agent/assets/benchmark-profiles/default.json` with real `benchmark.fixtureDir`, `outputsDir`, fixture refs
2. Create 2-3 fixture JSON files at `.opencode/skill/sk-improve-agent/assets/benchmark-fixtures/*.json`
3. Author `materialize-benchmark-fixtures.cjs` in `scripts/` — reads profile, locates fixtures, writes `{outputsDir}/{fixture.id}.md` before `run-benchmark.cjs` consumes them

## 4. STAGE 3 — RUN-BENCHMARK + YAML LOCKSTEP

1. Modify `run-benchmark.cjs` to consume materialized fixtures + emit `report.json` with `status:"benchmark-complete"` and per-fixture metrics
2. Patch `improve_improve-agent_auto.yaml` benchmark step: `node materialize-benchmark-fixtures.cjs --profile <static-path>` then `node run-benchmark.cjs --profile <static-path> --outputs-dir <packet-local>`; emit `benchmark_completed` only after report file exists
3. Patch `improve_improve-agent_confirm.yaml` identically (lockstep)
4. Add `benchmark_run` state-log row from run-benchmark.cjs

## 5. STAGE 4 — LEGAL-STOP NESTED + REDUCER + STOP-REASON

1. Patch both YAMLs to emit `legal_stop_evaluated` with nested `details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}`
2. Update `reduce-state.cjs` to read `details.gateResults` and surface `latestLegalStop.gateResults`
3. Update `improvement-journal.cjs` event-type validation to accept the new nested shape
4. Stop-reason enum reconciliation: SKILL.md is canonical; remove `plateau`/`benchmarkPlateau` from helper + tests OR document them as deprecated aliases (pick one)
5. Update existing tests to match new shapes

## 6. STAGE 5 — NATIVE RT ALIGNMENT + SKILL.MD DOCS

1. Audit RT-028 + RT-032 native fixture scenarios for `/improve:improve-agent` naming drift, command names, target agent paths, event vocabulary, expected signal lists
2. Reconcile (rename/update as needed)
3. Run RT-028 + RT-032 end-to-end against the new wiring; confirm GREEN
4. Update SKILL.md sections for: benchmark static-asset location, materializer ownership, nested legal-stop shape, stop-reason enum truth, reducer behavior

## 7. STAGE 6 — CP PLAYBOOK + WRAP

1. Update CP-040..045 playbook files (`04--agent-routing/013-...` through `018-...`) — bump expected-signal shapes to match 062's new emissions (e.g., `details.gateResults.contractGate` instead of flat `gateResult`)
2. Run existing test suite to verify no regressions
3. Update `implementation-summary.md` with per-REQ status
4. Update `handover.md` with 061 ready-state pointer
5. Optional REQ-201: if scope stays small, run a single CP-XXX scenario against the new wiring to confirm GREEN; otherwise defer to 061

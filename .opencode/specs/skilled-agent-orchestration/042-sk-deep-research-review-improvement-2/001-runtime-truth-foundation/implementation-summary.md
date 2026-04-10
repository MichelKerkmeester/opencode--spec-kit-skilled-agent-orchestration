---
title: "Implementation Summary: Runtime Truth Foundation [042.001]"
description: "Deep-loop runtime contracts, stop-reason taxonomy, legal-stop gates, resume semantics, journals, dashboards, and behavior-first test coverage for sk-deep-research and sk-deep-review."
trigger_phrases:
  - "042.001"
  - "implementation summary"
  - "runtime truth"
  - "stop contract"
  - "legal stop"
importance_tier: "important"
contextType: "planning"
---
# Implementation Summary: Runtime Truth Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-sk-deep-research-review-improvement-2/001-runtime-truth-foundation |
| **Completed** | 2026-04-10 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep research and deep review now have explicit, auditable runtime truth. Every loop stop reports a named reason from a shared taxonomy, every stop decision passes through a legal-stop gate that checks convergence, coverage, and quality together, and every session carries a resume cursor that makes continuation deterministic rather than inferred.

### Stop Contract and Legal-Stop Gates

Both deep-loop products share a typed stop-reason taxonomy with named reasons (`converged`, `max_iterations`, `blocked`, `user_stop`, `error`). The legal-stop gate bundles convergence, coverage, and quality checks into a single binary decision. Blocked-stop events persist with gate results and recovery paths rather than silently terminating. The stop contract uses `stopReason`, `legalStop.blockedBy`, `legalStop.gateResults`, and `legalStop.replayInputs` fields.

### Resume and Continuation Lineage

Sessions now carry `continuedFromRun` semantics that work for both active resume (loop was blocked and continues) and completed-continue (loop finished and a new session extends the prior work). This lineage is explicit in commands, workflows, state contracts, and agent instructions.

### Journals and Observability

Separate append-only journal artifacts track lifecycle events, stop decisions, and recovery actions. Dashboard upgrades expose timing/tool/token histograms, state diffs, anomaly flags, convergence trends, and stop-decision drill-down. Reducer snapshot/compaction ensures durability for 100+ iteration packets with delta replay and periodic snapshot equivalence.

### Semantic Convergence

Convergence now uses typed decision traces that combine novelty, contradiction density, and citation overlap with existing statistical checks. Low novelty alone no longer permits STOP when coverage or verification blockers remain.

### Reducer Ownership and Agent Cleanup

Agent instruction field names and reducer ownership boundaries are normalized. Deep-review machine-owned strategy sections are reducer-owned and no longer directly agent-edited. This cleanup landed before broader runtime changes to prevent field-name conflicts.

### Behavior-First Tests

Behavioral test suites cover lifecycle, blocked-stop, replay, resume, compaction equivalence, and semantic convergence scenarios for both loops. Contract parity tests enforce alignment across commands, skills, agents, and runtime mirrors.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded through 5 internal sub-phases: runtime foundation, state/observability substrate, trust surfaces, behavior-first verification, and parity alignment. Changes touched 44 files across skill references, command docs, workflow YAML, agent instructions, reducer logic, config, and Vitest suites. Three rounds of deep review verified contract consistency, stop-gate behavior, and cross-surface alignment.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shared stop-reason taxonomy across both loops | One auditable vocabulary without pretending research and review are the same workflow (ADR-001) |
| Legal-stop gate bundles convergence + coverage + quality | Prevents premature STOP when only one metric is favorable (ADR-001) |
| Claim-verification ledger uses JSONL canonical storage | Append-only, replayable, and machine-parseable without adding a database dependency (ADR-002) |
| Dashboards stay generated Markdown backed by structured metrics | Keeps dashboards derivable from reducer state without introducing a rendering framework (ADR-003) |
| Council synthesis is opt-in | Avoids polluting default execution flow with multi-perspective overhead (ADR-004) |
| Journals and ledgers stay separate append-only artifacts | Separation preserves clear lifecycle boundaries and replay independence (ADR-010) |
| Behavioral testing moved forward in delivery order | Replay harnesses protect contract work while substrate and trust surfaces are being built (ADR-007) |
| Semantic convergence uses typed decision traces | Makes stop decisions explainable and auditable rather than hidden in scalar thresholds (ADR-008) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stop contract documented consistently across both loops | PASS |
| Legal-stop gate requires convergence + coverage + quality together | PASS |
| Blocked-stop persistence with gate results and recovery path | PASS |
| `continuedFromRun` semantics for active resume and completed-continue | PASS |
| Journals as separate append-only artifacts | PASS |
| Semantic convergence participates in typed stop-decision traces | PASS |
| Reducer-owned machine sections in deep-review | PASS |
| Agent instruction field names normalized | PASS |
| Contract parity tests for both loops | PASS |
| Behavioral tests cover lifecycle, blocked-stop, replay, resume | PASS |
| 3 rounds of deep review (0 P0, 3 P1 closed) | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 4b replay fixtures do not yet exist.** Deterministic replay gating for production promotion remains advisory-only until replay fixtures from Phase 1 traces are generated.
2. **Council synthesis and coordination board remain opt-in.** Default execution paths are unaffected; advanced modes require explicit activation.
<!-- /ANCHOR:limitations -->

---
title: "Implementation Summary: Wave Executor [042.003]"
description: "Orchestrator-managed parallel wave execution for deep research and deep review: fan-out/join proof, deterministic segmentation, activation gates, keyed merge, and 97 tests."
trigger_phrases:
  - "042.003"
  - "implementation summary"
  - "wave executor"
  - "segment planner"
  - "coordination board"
importance_tier: "important"
contextType: "planning"
---
# Implementation Summary: Wave Executor

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-sk-deep-research-review-improvement-2/003-wave-executor |
| **Completed** | 2026-04-10 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep research and deep review can now handle very large targets through orchestrator-managed parallel wave execution without abandoning the LEAF-worker model. The implementation adds deterministic segmentation, packet-local coordination, segment-level convergence, and auditable merge behavior on top of the Phase 002 coverage-graph foundation.

### Fan-Out/Join Proof

Workflow fan-out/join capability was proven through helper-module orchestration that safely performs parallel dispatch and join outside the YAML workflow surface. This was the hard prerequisite that blocked all wave-mode runtime work.

### Heuristic Segmentation and Prepass Artifacts

The v1 deterministic heuristic segmentation produces reproducible segment identity and ordering for both review files and research domains. Review targets get `hotspot-inventory.json` with file ranking, directory clusters, and coverage priorities. Research targets get `domain-ledger.json` with source domains, authority levels, and cluster assignments. Segment-plan versioning and activation-gate configuration are exposed through strategy and config surfaces.

### Graph-Enhanced Segmentation and Lifecycle

The v2 graph-enhanced segmentation wraps Phase 002 graph signals for per-segment convergence, pruning, and promotion decisions. The shared wave lifecycle manager handles fan-out, join, prune, promote, and merge transitions. The reducer-owned `board.json` tracks conflicts, dedupe, and promoted findings, while `dashboard.md` is derived and never directly maintained.

### Activation Gates

Wave mode only activates for 1000+ file review targets with hotspot spread or 50+ domain research targets with cluster diversity. Default single-stream deep research and deep review remain completely intact for smaller targets.

### Keyed Merge and Segment Lineage

The JSONL merge contract uses explicit key ordering by `sessionId`, `generation`, `segment`, `wave`, and `findingId` rather than append order. Segment provenance, dedupe, and conflict metadata survive repeated merges. Segment JSONL lineage is deterministic and auditable.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation proceeded through 3 sub-phases: fan-out/join prerequisite proof, heuristic segmentation with prepass artifacts, and graph-enhanced segmentation with lifecycle integration. 11 files were touched (9 new), adding approximately 3,300 lines. 97 tests cover planner determinism, lifecycle transitions, keyed merge provenance, resume safety, and default-path regression.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Helper-module orchestration for fan-out/join | The YAML workflow engine has no native parallel dispatch, so orchestration logic lives in CJS helpers |
| Orchestrator-layer parallelism, not LEAF-agent spawning | Workers stay LEAF; orchestration handles segmentation, fan-out, pruning, promotion, and merge |
| Reducer-owned `board.json` with derived `dashboard.md` | Board is the machine source of truth; dashboard is a human-readable projection |
| Deterministic keyed merge by explicit identifiers | Append-order dependence would break replay and produce non-deterministic merged outputs |
| Activation gates with explicit large-target thresholds | Prevents wave overhead for small targets where single-stream execution is already optimal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out/join proof via helper-module orchestration | PASS |
| Deterministic v1 segmentation for review and research | PASS (97 tests) |
| Activation gates prevent wave mode for small targets | PASS |
| Keyed merge preserves provenance, dedupe, and conflict metadata | PASS |
| `board.json` is reducer-owned, `dashboard.md` is derived | PASS |
| Default single-stream paths remain intact | PASS |
| Resume and fallback regression tests | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **V2 graph-enhanced segmentation depends on Phase 002 graph readiness.** If graph convergence signals are unavailable, segmentation falls back to v1 heuristic mode.
2. **Wave mode has not been exercised on production-scale targets yet.** Activation thresholds (1000+ files / 50+ domains) are based on design estimates; real production runs will validate them.
<!-- /ANCHOR:limitations -->

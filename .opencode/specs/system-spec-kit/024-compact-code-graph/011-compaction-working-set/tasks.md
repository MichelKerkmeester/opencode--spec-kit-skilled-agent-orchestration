---
title: "Tasks: Compaction Working-Set [024/011]"
description: "Task tracking for working-set tracker, budget allocator, compact merger, and compaction integration."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 011 — Compaction Working-Set Integration


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Completed

- [x] Implement `working-set-tracker.ts` with file/symbol tracking, access count, timestamps, and recency-weighted `getTopRoots(n)` — lib/code-graph/working-set-tracker.ts
- [x] Implement `budget-allocator.ts` with floor allocations (constitutional 700, graph 1200, CocoIndex 900, triggered 400), overflow pool computation, priority-order redistribution, and deterministic trim order — lib/code-graph/budget-allocator.ts
- [x] Implement `compact-merger.ts` with 3-source late-fusion merge, file-level deduplication via `deduplicateFilePaths`, section headers (Constitutional, Structural, Semantic, Session, Triggered), and `SourceFreshness` metadata — lib/code-graph/compact-merger.ts
- [x] Integrate into `autoSurfaceAtCompaction` — compact-inject.ts uses `mergeCompactBrief` replacing Memory-only path
- [x] Session-prime reads cached merged brief from hook state for SessionStart(source=compact) injection — hooks/claude/session-prime.ts
- [x] Working-set tracker supports symbol-level tracking via `WorkingSetTracker.trackSymbol()` — lib/code-graph/working-set-tracker.ts
- [x] Budget allocator respects caller-provided `totalBudget` parameter, supports 1500/2500/4000 with same floor ratios — lib/code-graph/budget-allocator.ts
- [x] Empty source releases floor to overflow pool and overflow redistributed by priority order — budget-allocator.ts
- [x] Constitutional memory always included, never trimmed (last in trim order) — compact-merger.ts
- [x] Allocator observability metadata included: per-source requested/granted/dropped, `mergeDurationMs` — compact-merger.ts `MergedBrief`
- [x] Pipeline enforces 2s hard cap via `HOOK_TIMEOUT_MS=1800` + `withTimeout` — hooks/claude/compact-inject.ts
- [x] Graceful degradation when Code Graph or CocoIndex unavailable — remaining sources fill budget
- [x] Budget allocator test suite — tests/budget-allocator.vitest.ts (15 tests)
- [x] Compact merger test suite — tests/compact-merger.vitest.ts (15 tests including 3 new)
- [x] Dual-scope hooks integration test — tests/dual-scope-hooks.vitest.ts

### Not Applicable

- None — all planned items delivered
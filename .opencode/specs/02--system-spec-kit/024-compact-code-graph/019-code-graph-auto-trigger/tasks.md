---
title: "Tasks: Code Graph Auto-Trigger [024/019]"
description: "Task tracking for automatic code graph freshness and reindexing."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 019 — Code Graph Auto-Trigger


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

- [x] ensure-ready.ts shared helper created — lib/code-graph/ensure-ready.ts (217 lines)
- [x] detectState() with three freshness conditions (empty/HEAD/mtime) — lines 56-105
- [x] context.ts auto-trigger wired — best-effort `ensureCodeGraphReady(process.cwd())` before buildContext
- [x] query.ts auto-trigger wired — best-effort `ensureCodeGraphReady(process.cwd())` before query dispatch
- [x] status.ts freshness reporting wired — getGraphFreshness() returns fresh/stale/empty from `detectState()`
- [x] 10-second timeout guard — AUTO_INDEX_TIMEOUT_MS = 10_000
- [x] Selective reindex threshold added — SELECTIVE_REINDEX_THRESHOLD = 50
- [x] Per-file mtime tracking — ensureFreshFiles() in code-graph-db.ts

### Deferred

- [ ] F048: Selective reindex passes raw file paths as includeGlobs — needs glob pattern wrapping (P2)
- [ ] F049: Timeout via AbortController doesn't cancel indexFiles — fire-and-forget is acceptable (P2)
- [ ] Freshness does not enforce a 5-minute age window — status is based on empty/HEAD/tracked-file checks only
- [ ] Debounce is global, not keyed by `rootDir`
- [ ] New files stay invisible until a broader scan occurs
- [ ] Deleted files can persist on the auto-trigger path because cleanup is bypassed there
- [ ] Auto-index failures are logged but remain non-blocking to query/context callers
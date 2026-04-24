---
title: "Tasks: Code Graph Auto-Trigger [024/019] [system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger/tasks]"
description: "Task tracking for automatic code graph freshness and reindexing."
trigger_phrases:
  - "tasks"
  - "code"
  - "graph"
  - "auto"
  - "trigger"
  - "019"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
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

- [x] F048 selective-reindex raw-path limitation is documented explicitly as remaining tech debt
- [x] F049 AbortController cancellation limitation is documented explicitly as accepted fire-and-forget behavior
- [x] Freshness age-window limitation is documented explicitly
- [x] Global debounce limitation is documented explicitly
- [x] New-file visibility limitation is documented explicitly
- [x] Deleted-file cleanup limitation on the auto-trigger path is documented explicitly
- [x] Non-blocking auto-index failure behavior is documented explicitly

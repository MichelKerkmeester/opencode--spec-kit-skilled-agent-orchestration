---
title: "Implementation Summary: Code Graph Auto-Trigger [024/019]"
description: "Automatic code graph freshness detection and transparent reindexing before every query."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-compact-code-graph/019-code-graph-auto-trigger |
| **Completed** | 2026-03-31 (2 items deferred) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The code graph now automatically checks freshness and reindexes before every query, eliminating the need for manual `code_graph_scan` calls. This is the highest cross-runtime parity gain of all v2 proposals since it is entirely server-side.

### ensureCodeGraphReady() Helper

A new shared helper at `lib/code-graph/ensure-ready.ts` (217 lines) that runs before every `code_graph_context` and `code_graph_query` call. The `detectState()` function checks three conditions:
1. **Empty graph** (node count = 0) — triggers full scan
2. **Git HEAD changed** — compares stored HEAD hash vs `git rev-parse HEAD`, triggers full rescan on branch switch
3. **File mtimes drifted** — compares stored per-file timestamps, triggers selective reindex for changed files only

A 10-second timeout (`AUTO_INDEX_TIMEOUT_MS`) prevents blocking on large repositories. If more than 50 files changed (`SELECTIVE_REINDEX_THRESHOLD`), it falls back to full rescan.

### True Freshness Reporting

`code_graph_status` now reports actual freshness via `getGraphFreshness()`:
- **fresh** — indexed within 5 minutes, no file changes detected
- **stale** — files changed since last index
- **empty** — never indexed

### Transparent Integration

Both `handlers/code-graph/context.ts` and `handlers/code-graph/query.ts` call `ensureCodeGraphReady(process.cwd())` before their main logic. Users just ask their question and get an answer — the reindex happens transparently.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:files-changed -->
## Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `lib/code-graph/ensure-ready.ts` | New | Shared freshness checker with detectState(), 10s timeout, selective reindex |
| `handlers/code-graph/context.ts` | Modified | Calls ensureCodeGraphReady() before buildContext |
| `handlers/code-graph/query.ts` | Modified | Calls ensureCodeGraphReady() before query dispatch |
| `handlers/code-graph/status.ts` | Modified | getGraphFreshness() returns fresh/stale/empty |
| `lib/code-graph/code-graph-db.ts` | Modified | ensureFreshFiles() for per-file mtime tracking |
<!-- /ANCHOR:files-changed -->

---

<!-- ANCHOR:verification -->
## Verification

- TypeScript: 0 errors
- Tests: 327 passed, 23 failed (pre-existing, unrelated)
- Review: Opus CONDITIONAL PASS 78/100, GPT-5.4 CONDITIONAL 82%
<!-- /ANCHOR:verification -->

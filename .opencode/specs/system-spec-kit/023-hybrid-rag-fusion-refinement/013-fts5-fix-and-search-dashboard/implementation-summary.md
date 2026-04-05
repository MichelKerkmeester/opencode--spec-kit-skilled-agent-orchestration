---
title: "Implementation Summary: FTS5 Fix, Search Dashboard, and DB Path Drift Fix"
description: "Post-implementation summary — to be completed after Items 3 and 4 are implemented."
trigger_phrases:
  - "fts5 fix implementation summary"
  - "db path drift implementation summary"
  - "search dashboard implementation summary"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: FTS5 Fix, Search Dashboard, and DB Path Drift Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: level_2/implementation-summary.md | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-fts5-fix-and-search-dashboard |
| **Completed** | 2026-04-01 — All 4 items implemented and verified |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All 4 items implemented, compiled, and verified at runtime.

### Item 1 — FTS5 Double-Quoting Fix

Multi-word searches now return FTS5-backed results. A guard at `sqlite-fts.ts` line 58 prevents tokens already wrapped in double quotes from being re-quoted, eliminating the invalid `""phrase""` syntax that caused SQLite to silently drop all FTS5 results for multi-word queries.

### Item 2 — Search Dashboard Redesign

The `/memory:search` output groups results by spec folder using leaf folder names (Design 10: folder-as-tree-group). Paths are no longer rendered at full length, making results scannable. Applied to both `.opencode/command/memory/search.md` and `.agents/commands/memory/search.toml`.

### Item 3 — DB Path Drift Fix (4-layer defense-in-depth)

Root cause: `resolve_database_path()` in `vector-index-store.ts` drifted to empty provider-specific databases after Voyage-4 lazy initialization. Four independent fixes applied:

1. **Path stabilization** (`vector-index-store.ts` lines 277-289): `resolve_database_path()` validates against drift — detects and logs when provider would derive a different path than the one already in use.
2. **Empty DB rebind guard** (`db-state.ts` lines 294-310): `reinitializeDatabase()` refuses to rebind consumers to an empty database (0 memories). Override available via `SPECKIT_FORCE_REBIND=true`.
3. **Startup health check** (`context-server.ts` lines 1368-1374): Database path logged on startup; initialization sequence confirms DB is populated before consumers activate.
4. **Connection caching** (`vector-index-store.ts` lines 763-771): Connections cached post-validation only, preventing stale references to drifted paths.

### Item 4 — Silent Failure Remediation

31+ warning logs added across 5 search pipeline files. Every `return []` or `return null` on unexpected conditions now logs a `console.warn` with `[module-name]` prefix before returning. Affected files: `hybrid-search.ts` (8+), `stage1-candidate-gen.ts` (11+), `vector-index-queries.ts` (12+). FTS scope filter updated to match exact-or-descendant folders via `LIKE ? || "/%"` pattern at `sqlite-fts.ts` lines 63-65.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/sqlite-fts.ts` | Modified | FTS5 double-quote guard + descendant scope filter |
| `mcp_server/lib/search/vector-index-store.ts` | Modified | Stable `resolve_database_path()`, connection caching |
| `mcp_server/core/db-state.ts` | Modified | Empty DB rebind guard in `reinitializeDatabase()` |
| `mcp_server/context-server.ts` | Modified | Startup health check + DB path logging |
| `mcp_server/lib/search/hybrid-search.ts` | Modified | 8+ warning logs on silent failure paths |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | 11+ warning logs on failure paths |
| `mcp_server/lib/search/vector-index-queries.ts` | Modified | 12+ warning logs on failure paths |
| `.opencode/command/memory/search.md` | Modified | Design 10 dashboard applied |
| `.agents/commands/memory/search.toml` | Modified | Design 10 dashboard applied |
| `mcp_server/handlers/memory-context.ts` | Modified | P0: folder discovery no longer promotes to specFolder filter |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | P0: sessionId removed from governance scope check; P1: activeChannels metric |
| `mcp_server/lib/search/pipeline/types.ts` | Modified | P1: `activeChannels` optional field in Stage1Output |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modified | P2: graph zero-contribution diagnostic warning |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All fixes applied directly to TypeScript source, compiled with `bun run build` (1210+ dist files), and verified at runtime. `memory_search("semantic search")` confirmed returning 5 results via hybrid pipeline (vector + keyword channels, cross-encoder reranking) in 812ms. Root cause investigation: 10 deep-research iterations + 10 deep-review iterations via Copilot CLI GPT 5.4 (documented in `scratch/`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guard pre-quoted tokens in `sqlite-fts.ts` rather than changing `bm25-index.ts` | The quoting in `bm25-index.ts` is intentional for the BM25 pipeline; the bug is in re-quoting at the FTS5 output stage only |
| Design 10 (folder-as-tree-group) selected for dashboard | Balances readability and information density; leaf folder names are unique enough for identification without full paths |
| Fail-closed on missing `MEMORY_DB_PATH` (Item 3, pending) | Silent fallback to a derived path is the source of the drift bug; fail-closed prevents the same class of error recurring |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| FTS5 guard present in sqlite-fts.ts line 58 | PASS |
| `bun run build` after FTS5 fix | PASS — exit 0 |
| Design 10 applied to search.md | PASS |
| Design 10 applied to search.toml | PASS |
| DB path drift fix — resolve_database_path() stabilized | PASS — lines 277-289 validated |
| Empty DB rebind guard in reinitializeDatabase() | PASS — lines 294-310, refuses empty rebind |
| Startup health check + DB path log | PASS — context-server.ts lines 1368-1374 |
| Silent failure remediation (31+ warnings) | PASS — hybrid-search, stage1, vector-index-queries |
| Runtime: memory_search returns results | PASS — 5 results, 812ms, hybrid pipeline |
| P0: memory_context focused mode returns results | PASS — 5 candidates found (was 0); folder discovery no longer filters |
| P0: sessionId not in governance scope check | PASS — 8 candidates in deep mode; no scope filtering despite ephemeral sessionId |
| P1: activeChannels in stage1 metadata | PASS — `activeChannels: 2` in hybrid mode |
| P2: graph zero-contribution diagnostic | PASS — all graphContribution fields 0 with rolloutState visible |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SPECKIT_FORCE_REBIND bypass**: The empty DB rebind guard can be overridden with `SPECKIT_FORCE_REBIND=true`. This is intentional for edge cases where provider-specific DBs are deliberately used, but could mask legitimate drift if set permanently.
2. **Warning log volume**: 31+ new warning logs fire only on actual failure paths, not normal operation. If a deployment has persistent misconfiguration, logs may be noisy until the root cause is fixed.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->

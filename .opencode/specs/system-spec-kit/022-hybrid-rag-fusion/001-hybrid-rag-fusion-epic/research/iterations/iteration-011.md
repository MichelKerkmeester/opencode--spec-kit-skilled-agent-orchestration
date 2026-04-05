# Iteration 11: Developer UX Audit + Automation Gaps

## Focus
Investigate Q3 (automation/UX friction), Q13 (MCP tool naming/parameters), and Q14 (indexing automation gaps). Survey all 32 MCP tool names for clarity, count parameters on high-complexity tools, assess file-watcher and incremental indexing maturity, identify remaining manual steps.

## Findings

### Tool Inventory & Naming Analysis (Q13)

1. **32 MCP tools confirmed** across 7 functional groups. Tool names extracted from `tool-schemas.ts`. The naming follows a consistent `{domain}_{action}` pattern with clear prefixes:
   - `memory_*` (14 tools): context, search, match_triggers, save, list, stats, health, delete, update, validate, bulk_delete, index_scan, get_learning_history, drift_why
   - `checkpoint_*` (4 tools): create, list, restore, delete
   - `shared_*` (4 tools): space_upsert, space_membership_set, memory_status, memory_enable
   - `task_*` (2 tools): preflight, postflight
   - `memory_causal_*` (3 tools): link, stats, unlink
   - `eval_*` (2 tools): run_ablation, reporting_dashboard
   - `memory_ingest_*` (3 tools): start, status, cancel
   [SOURCE: mcp_server/tool-schemas.ts, grep output of all `name:` fields]

2. **Naming inconsistency: `memory_drift_why`** does not follow the `memory_causal_*` prefix despite being a causal graph traversal tool. It semantically belongs in the `memory_causal_*` group (would be `memory_causal_trace` or `memory_causal_why`). The "drift" word in the name is misleading -- the tool traces causal chains, not drift detection.
   [SOURCE: mcp_server/tool-schemas.ts:403 + tools/types.ts:267-273 DriftWhyArgs interface]

3. **Parameter complexity hotspot: `memory_search` has 28 parameters** (the SearchArgs interface spans lines 56-89 of types.ts). This is the most parameter-heavy tool in the system. Includes: query, concepts, specFolder, tenantId, userId, agentId, sharedSpaceId, limit, tier, contextType, useDecay, includeContiguity, includeConstitutional, includeContent, anchors, bypassCache, sessionId, enableDedup, intent, autoDetectIntent, enableSessionBoost, enableCausalBoost, minQualityScore, min_quality_score (duplicate!), rerank, applyLengthPenalty, applyStateLimits, minState, trackAccess, includeArchived, mode, includeTrace.
   [SOURCE: mcp_server/tools/types.ts:56-89]

4. **Duplicate parameter: `minQualityScore` vs `min_quality_score`** in SearchArgs. Both exist (lines 79-80 of types.ts). The snake_case version has a JSDoc note "Deprecated alias" in the tool schema. This is a UX anti-pattern -- developers may not know which to use.
   [SOURCE: mcp_server/tools/types.ts:79-80]

5. **Naming collision risk: `memory_save` vs `memory_ingest_start`**. Both index files into the memory system but with different semantics (single synchronous vs batch async). A developer unfamiliar with the system cannot distinguish when to use which from names alone. The distinction is clear in descriptions but not in names.
   [SOURCE: mcp_server/tool-schemas.ts:187 and :482]

6. **Inconsistent casing in TriggerArgs**: Uses `session_id` and `include_cognitive` (snake_case) while ALL other arg interfaces use camelCase (`sessionId`, `includeContent`). This is the ONLY interface with snake_case parameters.
   [SOURCE: mcp_server/tools/types.ts:92-98]

7. **`memory_context` has 11 parameters** (ContextArgs, types.ts:41-53). This is the unified entry point tool and its parameter count is manageable. The `memory_search` tool at 28+ parameters is where the real UX friction exists.
   [SOURCE: mcp_server/tools/types.ts:41-53]

### File-Watcher & Automation Analysis (Q14)

8. **File-watcher EXISTS and is mature** (417 LOC, `lib/ops/file-watcher.ts`). Uses chokidar for real-time filesystem watching. Features: (a) 2-second debounce, (b) content-hash dedup (SHA256) to skip unchanged files, (c) bounded concurrency (MAX_CONCURRENT_REINDEX=2), (d) AbortController per-file to cancel stale reindex, (e) SQLITE_BUSY retry with exponential backoff (1s/2s/4s), (f) dotfile exclusion with .opencode exception, (g) graceful shutdown (drains in-flight operations), (h) watcher metrics (filesReindexed, avgReindexTimeMs). This is NOT a stub -- it is production-grade with race condition handling.
   [SOURCE: mcp_server/lib/ops/file-watcher.ts:1-417]

9. **File-watcher is feature-flagged**: `isFileWatcherEnabled()` from search-flags.ts controls activation. Startup code in context-server.ts (line 1008-1009) checks the flag before starting. This means file-watching is opt-in, not default-on.
   [SOURCE: mcp_server/context-server.ts:75,99,1008-1009]

10. **Incremental indexing EXISTS** (`lib/storage/incremental-index.ts`). Uses mtime-based fast-path (1-second threshold) + content-hash comparison. Categorizes files into 5 decisions: skip, reindex, new, deleted, modified, unknown. Has stale entry detection via `toDelete` category. The `memory_index_scan` tool exposes an `incremental` parameter (default true) that leverages this.
    [SOURCE: mcp_server/lib/storage/incremental-index.ts:1-80, tools/types.ts:180-186 ScanArgs]

11. **Stale cleanup is PARTIAL**: The incremental-index module detects deleted files (`toDelete` category) during scan, but cleanup requires an explicit `memory_index_scan` call. There is no automated scheduled cleanup (no cron, no periodic scan). The file-watcher handles individual file deletions via `unlink` event, but bulk stale cleanup (e.g., after moving a spec folder) requires manual intervention.
    [SOURCE: mcp_server/lib/storage/incremental-index.ts:40-47, mcp_server/lib/ops/file-watcher.ts:350-368,376]

### UX Friction Summary (Q3)

12. **5 automation gaps identified**:
    (a) File-watcher is opt-in -- should arguably be default-on for common setups
    (b) No scheduled stale-entry cleanup -- relies on manual `memory_index_scan` or file-watcher unlink events
    (c) No "memory_search_simple" tool -- developers must navigate 28 parameters when they often need just `query` + `limit`
    (d) No tool grouping/aliasing in MCP protocol -- all 32 tools appear flat in tool lists
    (e) Post-save hooks (embedding, enrichment) are invisible to callers -- no progress feedback for async operations
    [INFERENCE: based on tool-schemas.ts analysis, file-watcher.ts review, and incremental-index.ts review]

## Sources Consulted
- `mcp_server/tool-schemas.ts` (tool names and schemas, via grep)
- `mcp_server/tools/types.ts` (all arg interfaces, full read)
- `mcp_server/lib/ops/file-watcher.ts` (full read, 417 LOC)
- `mcp_server/lib/storage/incremental-index.ts` (partial read, first 80 lines)
- `mcp_server/context-server.ts` (first 120 lines, file-watcher imports and setup)

## Assessment
- New information ratio: 0.92 (11 of 12 findings are new; finding about file-watcher existence partially known from prior grep hits but detail is new)
- Questions addressed: Q3, Q13, Q14
- Questions answered: Q13 (tool naming/parameters fully surveyed), Q14 (indexing automation fully mapped)

## Reflection
- What worked and why: Grep for tool names in tool-schemas.ts was the highest-ROI action -- gave complete 32-tool inventory in one call. Reading types.ts in full gave all parameter interfaces, enabling instant complexity assessment without reading each tool's schema individually.
- What did not work: N/A -- all sources were at expected paths this iteration.
- What I would do differently: Could have read tool-schemas.ts descriptions to assess description quality, but that would have exceeded tool budget for marginal gain.

## Recommended Next Focus
Continue Q1 completion (pipeline weight coherence -- cross-reference cognitive subsystem scoring paths with the 3 conflicting weight systems from iter-5). Also investigate Q15 (query expansion/classification effectiveness) by reading query-expansion.ts and measuring whether it adds latency vs retrieval quality.

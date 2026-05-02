# Phase 12: Meta-Review Remediation — Agent Prompt

**Spec folder:** `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement`
**MCP server root:** `.opencode/skill/system-spec-kit/mcp_server`
**Review report:** `review/review-report.md` (v2 meta-review, 29 findings)
**Tasks:** `tasks.md` Phase 12 (T200-T272)

---

## Mission

Fix all 17 remaining code findings from the 10-iteration meta-review. Documentation findings (T220-T226, T254-T258) are already resolved. Use `codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto` for all parallel agent work.

**Important codex notes:**
- The `--full-auto` sandbox allows workspace writes — all MCP server files are within the workspace
- Each agent must write ONLY to its assigned files — no cross-agent file overlap
- After each batch, run `npx tsc --noEmit` and targeted vitest to verify

---

## Workstream 1: P0 Immediate — Checkpoint Scope Isolation (T200)

**Finding F-001:** `lib/storage/checkpoints.ts:1563-1570` uses `getCurrentMemoryIdsForSpecFolder()` which ignores caller scope when `spec_folder` is present. Clear path at `:861-863` deletes by `spec_folder` alone.

**Fix:**
1. Read `lib/storage/checkpoints.ts` — find `getCurrentMemoryIdsForSpecFolder` call in the restore path
2. Replace with the scoped variant that intersects `spec_folder` with `tenantId`/`userId`/`agentId`/`sharedSpaceId`
3. Update `clearTableForRestoreScope()` to add scope predicates to `DELETE FROM memory_index WHERE spec_folder = ?`
4. Add 3 tests: (a) scoped restore preserves other tenant's rows, (b) unscoped restore still works folder-wide, (c) merge-mode respects scope

**Codex prompt:**
```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix checkpoint restore scope isolation in .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts

PROBLEM: When a checkpoint has spec_folder, getCurrentMemoryIdsForSpecFolder() at line ~1563 ignores the caller's tenant/user/agent/sharedSpace scope. The clear path at ~861 deletes by spec_folder alone. A scoped restore can erase other tenants' rows.

FIX:
1. In the restore path around line 1563, when both checkpointSpecFolder and scope fields are present, use a scoped query that intersects spec_folder with the scope predicates instead of getCurrentMemoryIdsForSpecFolder()
2. In clearTableForRestoreScope around line 861, add tenant/user/agent/sharedSpace WHERE clauses alongside the spec_folder predicate when scope is provided
3. Add 3 tests in the appropriate test file: scoped restore preserves other tenant rows, unscoped restore works folder-wide, merge-mode respects scope

Do NOT modify any handler files. Only modify lib/storage/checkpoints.ts and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/checkpoints-storage.vitest.ts after your changes.
"
```

---

## Workstream 2: Code Correctness P1s (T210-T215)

These 6 fixes can run in parallel — each touches a different file.

### T210: Token-budget truncation fallback (F-002)

**File:** `lib/search/hybrid-search.ts:2136-2188`
**Fix:** When the greedy pass in `truncateToBudget()` returns 0 accepted rows, fall back to a summarized top result (same pattern as the single-result path at :2136-2154) instead of returning empty.

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix token-budget truncation in .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts

PROBLEM: truncateToBudget() around line 2157-2188 can return an empty array when every candidate exceeds the budget, causing valid searches to show 'no results'.

FIX: After the greedy loop, if accepted.length === 0 and there were candidates, keep the highest-ranked candidate with overflow metadata (like the single-result fallback at lines 2136-2154 already does). Add a test that verifies oversized-but-matching results still return at least one summarized result.

Only modify hybrid-search.ts and its test file.
"
```

### T211: Atomic save lock-before-promote (F-003)

**File:** `handlers/memory-save.ts:1210-1219`
**Fix:** Move the `withSpecFolderLock()` acquisition to BEFORE the `pendingPath` rename at line 1210-1213, so file promotion and DB mutation share one critical section.

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix atomic save TOCTOU race in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts

PROBLEM: atomicSaveMemory() at line ~1210 renames pendingPath to final path BEFORE acquiring the spec-folder mutex at ~1215 (inside processPreparedMemory at ~463). Two concurrent saves can overwrite each other.

FIX: Restructure so the spec-folder lock is acquired BEFORE the rename. Move the rename into the locked section. Keep rollback inside the same critical section. Add a test verifying concurrent saves are serialized.

Only modify handlers/memory-save.ts and test files.
"
```

### T212: PE filtering scope in vector query (F-004)

**File:** `handlers/pe-gating.ts:79-96`
**Fix:** Push governance scope into the vector query OR keep expanding the window until `limit` scoped matches are found.

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix PE filtering recall loss in .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts

PROBLEM: findSimilarMemories() at line ~79 calls vectorSearch with limit*3, then filters by scope at ~87-96. In a noisy multi-tenant corpus, all top matches can be out-of-scope, missing the real in-scope duplicate.

FIX: Either pass scope predicates into the vector query itself, or implement a paging loop that expands the window (limit*3 -> limit*6 -> limit*12) until either limit scoped matches are found or candidates are exhausted. Add a test with multi-tenant data showing the in-scope match is found.

Only modify handlers/pe-gating.ts and test files.
"
```

### T213: Deferred chunk anchor identity (F-005)

**File:** `handlers/chunking-orchestrator.ts:316-327`
**Fix:** Pass `anchorId: chunk.label` to `indexMemoryDeferred()` for chunk children, matching the embedded path at :301-315.

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix deferred chunk anchor identity in .opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts

PROBLEM: The deferred path at line ~316-327 calls indexMemoryDeferred without anchorId. The embedded path at ~301-315 correctly passes anchorId: chunk.label. Deferred children share null-anchor key, causing overwrites.

FIX: Pass anchorId: chunk.label to indexMemoryDeferred for chunk children, just like the embedded path. Add a test mixing successful and deferred chunk inserts verifying each chunk gets its own active-projection row.

Only modify handlers/chunking-orchestrator.ts and test files.
"
```

### T214: Anchor extraction gated on validation (F-006)

**File:** `lib/parsing/memory-parser.ts:845-863`
**Fix:** Make `extractAnchors()` check `validateAnchors()` first and refuse to return bodies when structural errors are detected.

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix anchor extraction safety in .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts

PROBLEM: extractAnchors() at line ~845 is regex-based and independent of validateAnchors() which uses a proper stack. Malformed anchors are detected by validation but still consumed by extraction, returning corrupted content.

FIX: Have extractAnchors() call validateAnchors() first. If validation reports structural errors, return an empty map or error marker instead of corrupted content. Add a test with crossed/unclosed anchors verifying extraction returns empty rather than wrong content.

Only modify lib/parsing/memory-parser.ts and test files.
"
```

### T215: Graph-signal cache invalidation (F-007)

**File:** `lib/graph/graph-signals.ts` + 3 direct writers
**Fix:** Add `clearGraphSignalsCache()` + `clearDegreeCacheForDb()` calls to all direct `causal_edges` mutation paths.

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix graph-signal cache invalidation in .opencode/skill/system-spec-kit/mcp_server/

PROBLEM: graph-signals.ts caches momentum/depth at module level. causal-edges.ts correctly clears it, but 3 other files mutate causal_edges directly without clearing:
- lib/search/vector-index-mutations.ts ~line 73-79 (memory removal)
- lib/learning/corrections.ts ~line 603-630 (correction edges)
- lib/search/graph-lifecycle.ts ~line 277-291 (edge strength updates)

FIX: Import and call clearGraphSignalsCache() and clearDegreeCacheForDb() in each of those 3 files after their causal_edges mutations. Add a test verifying cache is invalidated after each mutation path.

Modify: vector-index-mutations.ts, corrections.ts (if it exists, skip if not), graph-lifecycle.ts, and test files. Do NOT modify graph-signals.ts or causal-edges.ts.
"
```

---

## Workstream 3: Security P1s (T230-T231)

### T230: Shared-memory auth from server context (F-015)

**File:** `handlers/shared-memory.ts:143-212`
**Note:** This is architecturally sensitive. The fix depends on whether the MCP server has a server-owned auth context. If not, at minimum add validation that rejects requests where actor identity is clearly spoofable (e.g., require signed session tokens). If full server-auth is out of scope, add a clear code comment documenting the trust boundary and add input validation (non-empty, format check).

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Harden shared-memory auth in .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts

PROBLEM: validateCallerAuth at line ~143-212 trusts actorUserId/actorAgentId from tool arguments. Admin status is derived by comparing these to env vars. Any client can impersonate admin.

FIX (pragmatic — full server-auth is out of scope):
1. Add input validation: reject empty/whitespace actor IDs
2. Add a code comment documenting the trust boundary: 'SECURITY: Actor IDs are caller-supplied and not cryptographically bound to an authenticated session. In untrusted environments, wrap this handler behind authenticated transport middleware.'
3. If there is an existing session/auth middleware in the codebase, wire it in. If not, document the gap.
4. Add a test verifying empty/whitespace actor IDs are rejected.

Only modify handlers/shared-memory.ts and test files.
"
```

### T231: Constitutional cache keyed by DB path (F-016)

**File:** `lib/search/vector-index-store.ts:381-571`

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix constitutional cache DB isolation in .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts

PROBLEM: The constitutional cache at line ~566-571 keys only on (spec_folder, includeArchived). After set_active_database_connection at ~381-404 switches the DB, cached results from the old DB can leak into queries on the new DB.

FIX: Include the resolved db_path in cache keys, or clear the entire constitutional_cache and reset last_db_mod_time when set_active_database_connection changes the active connection. Add a test that switches DBs and verifies no stale cache entries leak.

Only modify lib/search/vector-index-store.ts and test files.
"
```

---

## Workstream 4: Maintainability P1s (T240-T241)

### T240: Schema contracts dedup (F-017)

**File:** `lib/search/vector-index-schema.ts`

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Deduplicate schema definitions in .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts

PROBLEM: memory_conflicts DDL is defined in 3 places: createMemoryConflictsTable() at ~178, migration v4 at ~401, and bootstrap at ~1962. Companion indexes duplicated similarly.

FIX: Make the bootstrap and migration v4 paths call createMemoryConflictsTable() and any shared index helpers instead of inlining DDL. Keep the canonical helper as the single source of truth. If migration v4 needs a legacy-shape table (different from current), leave it but add a comment explaining why it differs.

Only modify lib/search/vector-index-schema.ts. Run: npx vitest run tests/vector-index-schema.vitest.ts
"
```

### T241: Fallback policy consolidation (F-018)

**File:** `lib/search/hybrid-search.ts`

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Consolidate fallback policy in .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts

PROBLEM: The fallback ladder is implemented twice: searchWithFallback() at ~1553-1603 and collectRawCandidates() at ~1469-1538, with the same thresholds and retry logic that must be maintained in lockstep.

FIX: Extract a shared fallback plan executor (e.g., executeFallbackPlan()) that encapsulates threshold constants, channel overrides, and retry markers. Let searchWithFallback use it for post-fusion results and collectRawCandidates use it for raw candidates. The executor returns staged results; the caller decides post-processing.

Only modify lib/search/hybrid-search.ts and test files.
"
```

---

## Workstream 5: P2 Advisory Triage (T250-T253, T259-T260)

Run these as a single batch. Each is small and independent.

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "
Fix 6 P2 advisories across the MCP server at .opencode/skill/system-spec-kit/mcp_server/

1. embedding-cache.ts ~line 37: Add 'dimensions' to PRIMARY KEY so two dimension variants for the same content/model can coexist. Update INSERT OR REPLACE accordingly. If a migration is needed, add it to vector-index-schema.ts.

2. session-learning.ts ~line 661: In handleGetLearningHistory, normalize sessionId using normalizeSessionId() before using it in queries, matching the write-side behavior.

3. checkpoints.ts handler ~line 141-175: In validateCheckpointScope, trim and reject empty-string tenantId (require tenantId.trim().length > 0 when any actor or shared-space field is present).

4. lineage-state.ts ~line 801-980: Extract a shared loadLineageRowsForMemory() helper and reuse it across inspectLineageChain, summarizeLineageInspection, and the active/as-of resolution functions.

5. memory-save.ts ~lines 275-380: In rollback/cleanup catch blocks, preserve the original error as structured metadata (e.g., { rollbackError: err.message }) instead of reducing to boolean false. Surface in the warning/error response.

6. db-state.ts ~line 140-149: Make the listener path check the boolean return of rebindDatabaseConsumers and log an error if it returns false, instead of silently discarding the result.

For each fix, add or update a test. Run npx tsc --noEmit after all changes.
"
```

---

## Execution Plan

**Batch 1 (IMMEDIATE):** T200 (P0 checkpoint scope) — run solo, verify before continuing
**Batch 2 (PARALLEL):** T210-T215 (6 correctness P1s) — all independent files
**Batch 3 (PARALLEL):** T230-T231 (2 security P1s) — independent files
**Batch 4 (PARALLEL):** T240-T241 (2 maintainability P1s) — T241 shares hybrid-search.ts with T210, so run T210 first
**Batch 5 (SINGLE):** P2 advisory batch — 6 small fixes
**Batch 6 (VERIFICATION):** T270-T272 — full test suite, tsc, implementation-summary update, memory save

After each batch:
```bash
cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit && npx vitest run --reporter=verbose 2>&1 | tail -5
```

---

## Success Criteria

- 0 active P0 findings
- 0 active P1 findings
- All P2 advisories either fixed or explicitly deferred with reason
- `npx tsc --noEmit` clean
- Test suite passing (target: 8771+ tests, 327/328 files)
- Phase 12 checklist items (CHK-090 through CHK-105) all marked done
- `implementation-summary.md` updated with Phase 12 results
- Memory saved via `generate-context.js`

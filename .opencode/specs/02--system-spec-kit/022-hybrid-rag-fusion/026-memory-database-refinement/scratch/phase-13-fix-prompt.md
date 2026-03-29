# Phase 13: Research Refinement Implementation — Agent Prompt

**Spec folder:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/026-memory-database-refinement`
**MCP server root:** `.opencode/skill/system-spec-kit/mcp_server`
**Research report:** `research/research.md` (28 findings from 5-iteration deep research)
**Tasks:** `tasks.md` Phase 13 (T300-T352)

---

## Mission

Fix all 28 research findings from the 5-iteration deep research. Use up to 5 GPT-5.4 agents and 5 GPT-5.3-Codex agents via `codex exec` for parallel work.

**Agent commands:**
```bash
# GPT-5.4 (high reasoning, complex logic changes)
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "..."

# GPT-5.3-Codex (high reasoning, mechanical/cleanup tasks)
codex exec -m gpt-5.3-codex -c 'model_reasoning_effort="high"' --full-auto "..."
```

**Important notes:**
- Add `Skip all spec-folder gates. Pre-approved fix. No questions.` at the start of every prompt
- Each agent writes ONLY to its assigned files — no cross-agent file overlap
- After each batch, run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit && npx vitest run --reporter=verbose 2>&1 | tail -10`
- GPT-5.4 gets the hard concurrency/architecture/performance work
- GPT-5.3-Codex gets mechanical cleanup, index additions, and dead code removal

---

## Batch 1: Concurrency + Critical Error Recovery (5 agents — GPT-5.4)

These are the hardest fixes. Each requires understanding async control flow and transaction boundaries.

### Agent 1 (GPT-5.4): T300 — Checkpoint restore maintenance barrier

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Add a checkpoint restore maintenance barrier in .opencode/skill/system-spec-kit/mcp_server/

PROBLEM: restoreCheckpoint() performs a large scoped restore transaction then runs derived-table rebuilds, but nothing blocks ordinary mutation traffic (memory_save, memory_index_scan, bulk_delete) from entering during or after the restore lifecycle. Live writes during rebuild can create inconsistent derived state.

FIX:
1. Add a module-level restore_in_progress flag (or a DB-backed barrier) in lib/storage/checkpoints.ts
2. Set it BEFORE entering the restore transaction, clear it AFTER all post-restore rebuilds complete
3. In handlers/memory-save.ts, handlers/memory-index.ts, and any bulk mutation handler: check the barrier at entry and fail-fast with a clear error (e.g., E_RESTORE_IN_PROGRESS) if the barrier is held
4. Add tests: (a) barrier blocks concurrent save during restore, (b) barrier clears after successful restore, (c) barrier clears after failed restore (rollback)

Modify: lib/storage/checkpoints.ts, handlers/checkpoints.ts, handlers/memory-save.ts, handlers/memory-index.ts, and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/checkpoints-storage.vitest.ts tests/checkpoints-extended.vitest.ts"
```

### Agent 2 (GPT-5.4): T301 — Shared-space create race

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix shared-space concurrent create race in .opencode/skill/system-spec-kit/mcp_server/

PROBLEM: handleSharedSpaceUpsert() detects creation from a pre-read SELECT, then uses INSERT ON CONFLICT DO UPDATE. Two concurrent 'create' requests both see existingSpace=undefined, both report created=true, and both run the owner-bootstrap branch — upgrading a second caller to owner incorrectly.

FIX:
1. In handlers/shared-memory.ts: detect creation from the write result, not from the pre-read snapshot
2. Use INSERT ... ON CONFLICT(space_id) DO NOTHING RETURNING space_id for the create path — bootstrap owner only when the insert actually inserted a row (RETURNING returns data)
3. If RETURNING is empty (conflict), treat as update, not create — do NOT bootstrap owner
4. Add test: two concurrent create requests for the same space_id result in exactly one owner

Modify: handlers/shared-memory.ts, lib/collab/shared-spaces.ts, and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/shared-memory.vitest.ts"
```

### Agent 3 (GPT-5.4): T302 — Reconsolidation stale-merge guard

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix reconsolidation stale-merge race in .opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts

PROBLEM: executeMerge() reads the predecessor row, then awaits generateEmbedding() (slow). After the await, it archives the predecessor and inserts the merged successor using the stale pre-await row contents. If another writer modifies or deletes that memory during the embedding gap, the merge proceeds with stale data.

FIX:
1. Before the merge transaction commits: reload the predecessor row inside the transaction
2. Compare content_hash or updated_at with the value captured before the await
3. If the predecessor changed: abort the merge and return a 'predecessor_changed' status (do NOT force the stale merge through)
4. If the predecessor was archived or deleted: abort and return 'predecessor_gone'
5. Add tests: (a) merge aborts when predecessor changes during embedding, (b) merge succeeds when predecessor is unchanged

Modify: lib/storage/reconsolidation.ts and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/reconsolidation.vitest.ts"
```

### Agent 4 (GPT-5.4): T330 — Chunked save PE partial commit

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix chunked save partial commit in .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts

PROBLEM: After indexChunkedMemoryFile() completes (new chunks committed), the code calls recordCrossPathPeSupersedes() then markMemorySuperseded(). If markMemorySuperseded fails, the handler returns status:'error' but the new chunked parent/children are already committed. The caller sees failure but data is saved — retrying creates duplicates.

FIX:
1. Move the PE supersede logic (markMemorySuperseded + recordCrossPathPeSupersedes) into a single transactional finalize step that runs BEFORE or AS PART OF the chunk commit
2. If supersede fails: run compensating cleanup that deletes the newly created parent and child rows, THEN return error
3. Alternatively: extend indexChunkedMemoryFile() to accept a finalize callback that runs in the same final DB transaction
4. Add test: when markMemorySuperseded fails after chunking, the new chunk tree is cleaned up

Modify: handlers/memory-save.ts and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/handler-memory-save.vitest.ts"
```

### Agent 5 (GPT-5.4): T310 — Fallback pipeline split

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Optimize fallback pipeline in .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts

PROBLEM: executeFallbackPlan() calls hybridSearchEnhanced() for each fallback tier, which reruns the ENTIRE pipeline: vector retrieval, lexical retrieval, degree scoring, reranking, co-activation, folder scoring, confidence truncation, context headers, and token-budget truncation. The expensive post-fusion stages should run only once on the final tier, not on every fallback attempt.

FIX:
1. Split the pipeline into: collect candidates -> fuse -> decide tier -> enrich once
2. For fallback stages, use the existing stopAfterFusion:true or a dedicated pre-ranking path
3. Only run reranking, trace/header injection, co-activation, and token-budget truncation on the final merged candidate set after the last tier is chosen
4. Preserve all existing test behavior — fallback results should be identical, just computed faster
5. Add a test verifying that fallback queries only run enrichment once regardless of tier count

Modify: lib/search/hybrid-search.ts and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hybrid-search.vitest.ts"
```

---

## Batch 2: Performance + SQLite (5 agents — mixed GPT-5.4 and GPT-5.3-Codex)

Run after Batch 1 passes tsc + vitest. These are mostly independent file changes.

### Agent 6 (GPT-5.4): T311 + T312 — Token estimation cache + BM25 demotion

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix two search performance issues in .opencode/skill/system-spec-kit/mcp_server/

ISSUE 1 (T311): truncateToBudget() in lib/search/hybrid-search.ts calls estimateResultTokens() twice per result (once for totalTokens, once for greedy admission). estimateResultTokens uses JSON.stringify which is expensive.
FIX: Cache token estimates per result in a Map keyed by result.id for the current request. Compute once, reuse for both totalTokens and greedy admission. Replace JSON.stringify with a field-based estimator for known result shapes.

ISSUE 2 (T312): The in-memory BM25 engine in lib/search/bm25-index.ts scans every document for every search. rebuildFromDatabase() is a synchronous full reindex blocking startup.
FIX: Make FTS5 the default lexical engine. Demote in-memory BM25 to a narrow fallback/experimental channel behind a feature flag. Replace synchronous full rebuild with incremental maintenance keyed off changed row IDs, or defer to background warmup after startup.

Modify: lib/search/hybrid-search.ts, lib/search/bm25-index.ts, and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hybrid-search.vitest.ts tests/bm25-index.vitest.ts"
```

### Agent 7 (GPT-5.4): T320 + T322 — Dedup indexes + Co-activation batching

```
codex exec -m gpt-5.4 -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix two SQLite query optimization issues in .opencode/skill/system-spec-kit/mcp_server/

ISSUE 1 (T320): Save-path dedup queries in handlers/save/dedup.ts use nullable OR predicates ((? IS NULL AND col IS NULL) OR col = ?) that defeat all existing indexes. Called 3 times per save.
FIX: Rewrite checkExistingRow() and checkContentHashDedup() as dynamically assembled exact-match queries that only include scope columns present in the request. Replace (canonical_file_path = ? OR file_path = ?) with two direct probes. Add composite partial indexes in vector-index-schema.ts:
- (spec_folder, content_hash, embedding_status, tenant_id, user_id, agent_id, session_id, shared_space_id, id DESC) WHERE parent_id IS NULL
- (spec_folder, canonical_file_path, id DESC)

ISSUE 2 (T322): Co-activation in lib/cognitive/co-activation.ts has N+1 DB lookups — one SELECT per related ID. Stage-2 fusion calls getRelatedMemories(row.id).length per boosted row.
FIX: Batch memory detail fetches with a single WHERE id IN (...). Rewrite getCausalNeighbors() as a single SQL + JOIN. In stage-2 fusion, precompute neighbor counts instead of calling getRelatedMemories per row.

Modify: handlers/save/dedup.ts, lib/search/vector-index-schema.ts, lib/cognitive/co-activation.ts, lib/search/pipeline/stage2-fusion.ts, and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit"
```

### Agent 8 (GPT-5.3-Codex): T321 + T323 + T325 — Trigger cache + temporal index + working-memory indexes

```
codex exec -m gpt-5.3-codex -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix three SQLite index/query issues in .opencode/skill/system-spec-kit/mcp_server/

ISSUE 1 (T321): Trigger cache reload does a full table scan after every mutation. Add a partial index:
CREATE INDEX IF NOT EXISTS idx_trigger_cache_source ON memory_index(embedding_status, id) WHERE embedding_status = 'success' AND trigger_phrases IS NOT NULL AND trigger_phrases != '[]' AND trigger_phrases != ''
Also cache the prepared loader statement per connection in lib/parsing/trigger-matcher.ts.

ISSUE 2 (T323): Temporal-contiguity wraps created_at in functions, defeating index use. Rewrite getTemporalNeighbors() as a bounded range query on created_at first, then compute time_delta_seconds on the narrowed set. Add:
CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC)

ISSUE 3 (T325): Working-memory is missing order-aligned indexes. Add:
CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC)
CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC)
Also remove the SELECT COUNT(*) existence probe from upsertExtractedEntry() — rely on ON CONFLICT.

Modify: lib/parsing/trigger-matcher.ts, lib/cognitive/temporal-contiguity.ts, lib/cognitive/working-memory.ts, lib/search/vector-index-schema.ts, and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit"
```

### Agent 9 (GPT-5.3-Codex): T313 + T314 + T315 + T316 — Degree batch + graph FTS + fusion + MMR

```
codex exec -m gpt-5.3-codex -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix four search performance issues in .opencode/skill/system-spec-kit/mcp_server/

ISSUE 1 (T313): Degree scoring in lib/search/graph-search-fn.ts is N+1 SQL on cold cache. Batch candidate degree computation in one SQL: WHERE source_id IN (...) OR target_id IN (...) GROUP BY node_id. Cache global max alongside per-node cache.

ISSUE 2 (T314): Graph FTS query in lib/search/graph-search-fn.ts uses OR join shape causing duplicates + JS dedup. Rewrite as CTE that materializes matched rowids once, then UNION ALL source-side and target-side edge lookups. Cache FTS-table availability per bound database instance.

ISSUE 3 (T315): Adaptive fusion always runs standard fuse first. Expose a cheap getAdaptiveWeights(intent, documentType) helper in shared/algorithms/adaptive-fusion.ts. Let hybridSearchEnhanced() build fusionLists once using those weights.

ISSUE 4 (T316): MMR re-fetches embeddings from DB after vector channel already retrieved them. Let vector channel optionally return embedding buffers for top-K hits or maintain request-scoped cache. Replace reranked.find(...) with Map.

Modify: lib/search/graph-search-fn.ts, shared/algorithms/adaptive-fusion.ts, lib/search/hybrid-search.ts, and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/graph-signals.vitest.ts tests/hybrid-search.vitest.ts"
```

### Agent 10 (GPT-5.3-Codex): T303 + T324 + T331 + T332 + T333 — Scan cooldown + causal LIKE + error recovery

```
codex exec -m gpt-5.3-codex -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Fix five smaller issues in .opencode/skill/system-spec-kit/mcp_server/

ISSUE 1 (T303): Scan cooldown in handlers/memory-index.ts is a TOCTOU check. Convert to atomic lease: reserve scan slot in a transaction up front (store scan_started_at), reject if lease is fresh. Convert to last_index_scan on completion. Include expiry for crashed scans.

ISSUE 2 (T324): Causal-link resolution in handlers/causal-links-processor.ts uses leading-wildcard LIKE '%...%' that cannot use indexes. Resolve exact normalized paths through canonical_file_path/file_path equality first, reserve fuzzy matching for fallback. Batch reference resolution.

ISSUE 3 (T331): Safe-swap in handlers/chunking-orchestrator.ts deletes old children outside the transaction. Move old-child deletion into finalization transaction by nulling parent_id before commit. Use bulk delete helper.

ISSUE 4 (T332): All-chunks-failed rollback in handlers/chunking-orchestrator.ts can leave BM25 with new parent summary when existing parent is retained. Delay parent BM25 mutation until at least one chunk succeeds, or restore old payload on rollback.

ISSUE 5 (T333): Reconsolidation merge in lib/storage/reconsolidation.ts commits DB even if BM25 fails. Persist a bm25_repair_needed flag on the merged row when BM25 repair fails, so a future reconciler can retry.

Modify: handlers/memory-index.ts, core/db-state.ts, handlers/causal-links-processor.ts, handlers/chunking-orchestrator.ts, lib/storage/reconsolidation.ts, and test files.
Run: cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit"
```

---

## Batch 3: Dead Code Cleanup (1 agent — GPT-5.3-Codex)

Run after Batch 2 passes tsc + vitest. All mechanical cleanup.

### Agent 11 (GPT-5.3-Codex): T340-T346 — All dead code and debt

```
codex exec -m gpt-5.3-codex -c 'model_reasoning_effort="high"' --full-auto "Skip all spec-folder gates. Pre-approved fix. No questions.

Clean up 7 dead code and architectural debt items in .opencode/skill/system-spec-kit/mcp_server/

1. T340: Remove the dead eager-warmup branch from context-server.ts (the if(eagerWarmup) block around line 895-934). The flag hook shouldEagerWarmup() in shared/embeddings.ts hardcodes false. Remove both the branch and the inert flag check.

2. T341: Remove orphaned exports from tools/types.ts: MCPResponseWithContext and parseValidatedArgs (no in-repo callers).

3. T342: Trim unused lazy proxy exports from handlers/index.ts. Keep only the named handler functions that the server and tool dispatchers actually import. Remove: memorySearch, memoryTriggers, memoryCrud, memoryIngest, sessionLearning, causalGraph, evalReporting, memoryContext, sharedMemory (verify each has no callers before removing).

4. T343: Remove dead debug exports: getLastDegradedState() from lib/parsing/trigger-matcher.ts and _resetInitTracking() from lib/feedback/shadow-scoring.ts (no in-repo callers).

5. T344: Remove or inline orphaned type exports: PipelineOrchestrator from lib/search/pipeline/types.ts, InterferenceResult from lib/scoring/interference-scoring.ts, SurrogateMatchResult from lib/search/query-surrogates.ts (no in-repo callers).

6. T345: Rename tests/shared-memory-handlers.test-suite.ts to tests/shared-memory-handlers.vitest.ts. Delete the one-line tests/shared-memory.vitest.ts shim that just imports it.

7. T346: Unify score-resolution helpers. The canonical resolveEffectiveScore() is in lib/search/pipeline/types.ts. Make lib/search/confidence-scoring.ts and lib/response/profile-formatters.ts import and use that canonical version instead of their local duplicates.

For each change, verify no callers exist via grep before removing. Run npx tsc --noEmit after all changes. Run npx vitest run --reporter=verbose 2>&1 | tail -10 to verify no test regressions."
```

---

## Execution Plan

| Batch | Agents | Model | Tasks | Dependencies |
|-------|--------|-------|-------|-------------|
| **1** | 5 parallel | GPT-5.4 | T300, T301, T302, T310, T330 | None — all touch different files |
| **2** | 5 parallel | Mixed | T303, T311+T312, T313-T316, T320+T322, T321+T323+T325, T324+T331-T333 | After Batch 1 passes tsc. T311 shares hybrid-search.ts with T310 (Batch 1) |
| **3** | 1 | GPT-5.3-Codex | T340-T346 | After Batch 2 passes tsc |
| **4** | Verification | — | T350-T352 | After Batch 3 |

After each batch:
```bash
cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit && npx vitest run --reporter=verbose 2>&1 | tail -10
```

---

## Success Criteria

- 0 unfixed research findings (28/28 addressed)
- `npx tsc --noEmit` clean
- Test suite passing (target: 8858+ tests)
- All Phase 13 checklist items (CHK-110 through CHK-162) marked done
- `implementation-summary.md` updated with Phase 13 results
- Memory saved via `generate-context.js`
- Changelog created for v3.2.0.0

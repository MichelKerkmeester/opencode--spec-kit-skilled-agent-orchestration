# Review Iteration 10 — Database Schema (Part 2): Root Cause Synthesis

**Reviewer:** Copilot CLI / GPT 5.4 High  
**Dimension:** Final synthesis of all findings from iterations 1-9  
**Files reviewed:** `vector-index-schema.ts`, `vector-index-mutations.ts`, `lineage-state.ts`, `vector-index-store.ts`

---

## Root Cause Analysis

### Primary Root Cause: Empty `active_memory_projection` table

The `active_memory_projection` hypothesis is **mechanistically confirmed**: because ALL search/list/count paths use `INNER JOIN active_memory_projection p ON p.active_memory_id = m.id`, an empty projection table guarantees 0 results across every search channel.

### Why the table can be empty

1. **`initialize_db()` never backfills legacy `memory_index` rows** into `active_memory_projection`, even though `runLineageBackfill()` already knows how to do it (in `lineage-state.ts:1066-1205`).

2. **Normal save paths DO populate it** via `upsert_active_projection()` in `index_memory`, `index_memory_deferred`, and `update_memory`. So the bug only affects **pre-existing memories** that were saved before the projection table was introduced.

3. **Runtime DB selection** can point to a different (empty) provider-specific database. Live evidence found: `context-index.sqlite` has 1728 memory_index rows and 1708 projection rows; but the provider-specific DB `context-index__voyage__voyage-4__1024.sqlite` has 0/0/0 across all tables.

### Contributing Factors

The empty projection is catastrophic because of **52 silent failure points** (iteration 5) that catch errors and return `[]` instead of surfacing them. The pipeline orchestrator treats empty Stage 1 as a successful outcome (iteration 6), and the handler surfaces it as a normal "No matching memories found" (iteration 6).

---

## Ranked Root Cause Likelihood

| Rank | Root Cause | Likelihood | Evidence |
|------|-----------|------------|----------|
| 1 | **Active runtime DB path resolves to empty provider-specific DB** | HIGHEST | Live DB evidence: populated DB exists alongside empty provider DB |
| 2 | **No startup backfill for legacy DBs** — empty active_memory_projection | HIGH | `initialize_db()` confirmed missing backfill; 20 unprojected rows in populated DB |
| 3 | **Universal INNER JOIN gating** on active_memory_projection | HIGH | Makes causes 1 and 2 catastrophic |
| 4 | **FTS scope filter is exact-match only** (iteration 4) | MEDIUM | Drops child-folder results; amplifies other failures |
| 5 | **Embedding circuit breaker** tripped | MEDIUM | Can suppress vector lane for 60s; doesn't explain FTS returning 0 |
| 6 | **EMBEDDING_DIM desync** between provider and store | MEDIUM | Can cause permanent vector failure via dimension mismatch |
| 7 | **sqlite-vec load failure** | LOW-MEDIUM | Would disable vector channel entirely but FTS should still work |
| 8 | **R12 expansion silent zero-out** (iteration 5) | LOW | Only affects deep/expansion paths, not base hybrid |
| 9 | **BM25 warmup race** (iteration 4) | LOW | Temporary; only affects first few queries |
| 10 | **Feature flag misconfiguration** | LOW | No single flag disables all channels (iteration 7) |

---

## Recommended Fix Order

### Immediate (Emergency Fix)
```sql
-- Run on the ACTIVE runtime database (check DB path first!)
INSERT INTO active_memory_projection (logical_key, root_memory_id, active_memory_id, updated_at)
SELECT
  spec_folder || '::' || COALESCE(file_path, '_') || '::' || COALESCE(NULLIF(anchor_id, ''), '_'),
  id,
  id,
  COALESCE(updated_at, created_at, datetime('now'))
FROM memory_index
WHERE id NOT IN (SELECT active_memory_id FROM active_memory_projection);
```

### Proper Fix (Code Change)
1. Call `runLineageBackfill(database, { dryRun: false })` from `initialize_db()` after `create_schema()`/`ensure_schema_version()`
2. Add startup health check: if `memory_index` non-empty + `active_memory_projection` empty, log WARNING and trigger backfill
3. Add `assertInitialized()` guard for hybrid-search entrypoints (instead of silent `return []`)
4. Surface vector availability and projection health in `memory_stats` and search response metadata
5. Fix FTS scope filter to match exact-or-descendant folders (like BM25 does)

### Diagnostic Steps
1. Check which DB file is being used at runtime: look for `resolve_database_path` in logs
2. Run `SELECT COUNT(*) FROM active_memory_projection;` on the active DB
3. Run `SELECT COUNT(*) FROM memory_index;` to confirm data exists
4. Check for `sqlite-vec extension not available` or `[embeddings] Circuit breaker OPEN` in logs

---

## All P0 Findings Across 10 Iterations

| ID | Iteration | Finding | File |
|----|-----------|---------|------|
| F02-1 | 02 | Normal startup leaves active_memory_projection empty | `vector-index-store.ts:749-823` |
| F02-2 | 02 | Empty projection makes ALL search channels return 0 | `vector-index-queries.ts:259-267` |
| F02-3 | 02 | Count/stats/list queries also affected | `vector-index-store.ts:536-577` |
| F05-1 | 05 | R12 expansion silently zeros out Stage 1 | `stage1-candidate-gen.ts:804-830` |
| F05-2 | 05 | Deep variant fan-out can end with all-empty branches | `stage1-candidate-gen.ts:718-748` |
| F09-1 | 09 | Confirmed: active_memory_projection created but never backfilled | `vector-index-schema.ts:1080-1083` |

## All P1 Findings Across 10 Iterations

| ID | Iteration | Finding |
|----|-----------|---------|
| F01-1 | 01 | Vector channel uses different DB than FTS/BM25 |
| F02-4 | 02 | Normal writes cannot heal already-empty DB |
| F02-5 | 02 | Backfill exists but only in specific flows |
| F03-1 | 03 | Hybrid branch silently propagates 0 candidates |
| F03-2 | 03 | Handler hard-wires searchType to 'hybrid' |
| F04-1 | 04 | FTS scope filter is exact-match only |
| F05-3-7 | 05 | Vector/FTS/BM25 failures swallowed (5 findings) |
| F06-1 | 06 | Empty Stage 1 treated as successful outcome |
| F06-2 | 06 | Handler surfaces empty as normal "No matching memories" |
| F06-3 | 06 | Missing sqlite-vec fail-closes to [] |
| F07-1 | 07 | SPECKIT_ROLLOUT_PERCENT=0 disables most features |
| F07-2 | 07 | Embedding circuit breaker can suppress vector |
| F08-1 | 08 | EMBEDDING_DIM can desync provider from store |
| F08-2 | 08 | Auto-fallback to hf-local changes dimensions |
| F08-3 | 08 | Circuit breaker suppresses all embeddings for 60s |
| F10-5 | 10 | Runtime DB path may resolve to empty provider DB |

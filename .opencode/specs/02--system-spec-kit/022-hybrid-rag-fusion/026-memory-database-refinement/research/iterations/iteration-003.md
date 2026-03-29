# Iteration 003

## Focus
Q3: SQLite query optimization, with emphasis on missing indexes, unparameterized queries, N+1 patterns, unnecessary full table scans, and prepared statement reuse opportunities.

## Scope Read
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`

## Findings

### 1. Save-path dedup queries are index-hostile and are executed multiple times per save
- Impact: High
- Evidence:
  - `checkExistingRow()` mixes an `OR` path predicate with five nullable scope predicates of the form `((? IS NULL AND col IS NULL) OR col = ?)`, then orders by `id DESC LIMIT 1`: [dedup.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L116), [dedup.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L127)
  - `checkContentHashDedup()` repeats the same nullable-scope pattern on top of `spec_folder`, `content_hash`, `parent_id IS NULL`, and `embedding_status IN (?, ?)`, again with `ORDER BY id DESC LIMIT 1`: [dedup.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L188), [dedup.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts#L216)
  - The save path invokes these checks repeatedly: once for exact-path dedup and twice for content-hash dedup in `handleMemorySave()`: [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L548), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L632), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L734)
  - The schema only provides separate indexes for `spec_folder`, `content_hash`, `canonical_file_path`, and a broad governance scope tuple; it does not provide a composite index aligned to these dedup predicates: [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2261), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2271), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2277)
- Why it matters:
  - The nullable `OR` predicates make it hard for SQLite to use the existing indexes as seek predicates, especially when combined with the `(canonical_file_path = ? OR file_path = ?)` branch.
  - This sits on the hottest write path in the server and is paid before the save even reaches embedding, PE gating, or insert/update work.
- Recommendation:
  - Split these into dynamically assembled exact-match queries that only include scope columns actually present in the request instead of `(? IS NULL OR ...)` guards.
  - Replace `(canonical_file_path = ? OR file_path = ?)` with either two direct probes or a `UNION ALL`/fallback strategy so each branch can use its own index.
  - Add a composite partial index for the content-hash path, for example `(spec_folder, content_hash, embedding_status, tenant_id, user_id, agent_id, session_id, shared_space_id, id DESC) WHERE parent_id IS NULL`, and consider a sister index for exact-path dedup keyed by `(spec_folder, canonical_file_path, id DESC)` plus a file-path fallback.

### 2. Trigger cache reload does a fresh scan of all trigger-bearing memories after every mutation
- Impact: High
- Evidence:
  - Every mutation clears the trigger cache in `runPostMutationHooks()`: [mutation-hooks.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts#L27)
  - On the next cache miss, `trigger-matcher` loads every row whose `trigger_phrases` is non-empty and `embedding_status = 'success'`: [trigger-matcher.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts#L339)
  - The schema has `idx_embedding_status`, but there is no partial index tuned to the actual trigger-cache source predicate (`trigger_phrases IS NOT NULL`, not `'[]'`, not `''`, and `embedding_status = 'success'`): [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2264)
- Why it matters:
  - This turns the first trigger lookup after any save/update/delete into a broad scan of the memory table plus JSON parsing of every trigger-bearing row.
  - Because cache invalidation is mutation-driven, the cost reappears under active editing sessions instead of only at process startup.
- Recommendation:
  - Add a partial index aligned to the source query, for example `CREATE INDEX IF NOT EXISTS idx_trigger_cache_source ON memory_index(embedding_status, id) WHERE embedding_status = 'success' AND trigger_phrases IS NOT NULL AND trigger_phrases != '[]' AND trigger_phrases != ''`.
  - Cache the prepared loader statement per connection instead of recompiling it on every cache miss.
  - Longer term, consider normalizing organic trigger phrases into a side table so cache rebuild can read structured rows without full-table JSON parsing.

### 3. Co-activation still has N+1 database lookups and repeated statement compilation in the search hot path
- Impact: High
- Evidence:
  - `getRelatedMemories()` fetches `related_memories`, then loops and does one `SELECT ... FROM memory_index WHERE id = ?` per related ID: [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts#L146), [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts#L176)
  - `getCausalNeighbors()` repeats the same N+1 pattern after reading candidate neighbors from `causal_edges`: [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts#L270), [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts#L288)
  - `spreadActivation()` calls both neighbor loaders for each visited node, so the N+1 pattern compounds with graph traversal depth: [co-activation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts#L361)
  - Stage-2 fusion then calls `getRelatedMemories(row.id).length` inside a `results.map(...)` pass, so even the fan-out divisor calculation re-enters the DB per boosted row: [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L795), [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L802)
- Why it matters:
  - This sits directly in the ranking path, so query latency scales with both result breadth and graph neighborhood size.
  - The code recompiles the same one-row lookup statements inside inner loops instead of reusing them.
- Recommendation:
  - Batch memory detail fetches with a single `WHERE id IN (...)` per neighbor set instead of one lookup per neighbor.
  - Rewrite `getCausalNeighbors()` as a single SQL statement that resolves neighbor IDs and joins `memory_index` in one pass.
  - Introduce a small per-connection prepared-statement cache for the repeated `memory_index` row fetches.
  - For the fan-out divisor in stage 2, reuse the already materialized `related_memories` JSON length or precompute neighbor counts instead of calling `getRelatedMemories()` per row.

### 4. Temporal-contiguity queries defeat the available time indexes and miss a composite timeline index
- Impact: Medium
- Evidence:
  - `getTemporalNeighbors()` wraps `created_at` in `ABS(CAST((julianday(created_at) - julianday(?)) * 86400 AS INTEGER))`, both in `SELECT` and `WHERE`, which prevents direct use of the plain `created_at` index for range pruning: [temporal-contiguity.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts#L127)
  - `buildTimeline(specFolder)` filters by `spec_folder` and sorts by `created_at DESC`, but the schema only has separate indexes on `spec_folder` and `created_at`, not a composite `(spec_folder, created_at DESC)`: [temporal-contiguity.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts#L163), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2261), [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2262)
- Why it matters:
  - `getTemporalNeighbors()` is effectively a table scan plus computed sort, even though the table already tracks time with an indexable `created_at` column.
  - `buildTimeline(specFolder)` likely requires a temp sort for every scoped timeline request because no single index satisfies both the filter and the order.
- Recommendation:
  - Rewrite the neighbor search as a bounded range query on `created_at` first, then compute exact `time_delta_seconds` only on the narrowed candidate set.
  - Add `CREATE INDEX IF NOT EXISTS idx_spec_folder_created_at ON memory_index(spec_folder, created_at DESC)` for scoped timelines.
  - If archived/chunk rows are normally excluded in temporal views, consider a narrower partial index instead of indexing the full table.

### 5. Causal-link reference resolution does repeated full scans via leading-wildcard LIKE
- Impact: Medium
- Evidence:
  - `resolveMemoryReference()` falls back to `file_path LIKE '%...%'` and `title LIKE '%...%'`, both ordered by `id DESC LIMIT 1`: [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts#L79), [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts#L88), [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts#L104)
  - Those lookups run inside the per-reference loop in `processCausalLinks()`: [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts#L137), [causal-links-processor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts#L148)
  - The schema has `idx_file_path`, but a leading-wildcard `LIKE` cannot use it effectively: [vector-index-schema.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L2277)
- Why it matters:
  - A memory file with several causal references can trigger several table scans before inserting edges.
  - The same statements are also prepared afresh for each reference resolution.
- Recommendation:
  - Resolve exact normalized paths through `canonical_file_path`/`file_path` equality first and reserve fuzzy matching for an explicit fallback path.
  - If fuzzy path/title matching must stay, route it through FTS5 or a dedicated normalized lookup table instead of `%...%` scans over `memory_index`.
  - Batch distinct references and cache prepared statements so one save does not repeatedly compile the same lookup SQL.

### 6. Working-memory eviction and prompt-context queries are missing order-aligned indexes, and one UPSERT path still pays an avoidable existence probe
- Impact: Medium
- Evidence:
  - The working-memory schema defines only `idx_wm_session`, `idx_wm_attention(session_id, attention_score DESC)`, and `idx_wm_added`, plus the `UNIQUE(session_id, memory_id)` constraint: [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L46), [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L65)
  - `getSessionPromptContext()` orders by `attention_score DESC, last_focused DESC`, but no index covers the `last_focused` tiebreaker: [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L331), [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L342)
  - `enforceMemoryLimit()` evicts by `ORDER BY last_focused ASC, id ASC`, but there is no index aligned to that LRU walk: [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L520), [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L533)
  - `upsertExtractedEntry()` still does a `SELECT COUNT(*)` existence probe before an `INSERT ... ON CONFLICT DO UPDATE`, which doubles the read work for an operation that already has a uniqueness constraint to arbitrate conflicts: [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L447), [working-memory.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts#L455)
- Why it matters:
  - These queries are small per call, but they are part of the per-session interactive path where repeated milliseconds add up.
  - The extra pre-check also adds unnecessary statement compilation churn in a module that currently prepares ad hoc SQL inline.
- Recommendation:
  - Add `CREATE INDEX IF NOT EXISTS idx_wm_session_focus_lru ON working_memory(session_id, last_focused ASC, id ASC)`.
  - Add `CREATE INDEX IF NOT EXISTS idx_wm_session_attention_focus ON working_memory(session_id, attention_score DESC, last_focused DESC)`.
  - Remove the `SELECT COUNT(*)` preflight from `upsertExtractedEntry()` and rely on the existing `ON CONFLICT(session_id, memory_id)` path, only invoking eviction when the insert branch actually needs space.
  - Cache the common working-memory statements per DB connection to avoid reparsing them on every attention update.

## Additional Note
- I did not find a clear user-controlled SQL injection issue in the audited hot paths. The dynamic SQL I saw in this pass was limited to placeholder-list generation for `IN (...)` clauses or internal identifier interpolation for migrations/introspection. The bigger problems here are planner-hostile predicates, full scans, and repeated one-row lookups.

## Overall Assessment
- The highest-value SQLite work is on the save path and the search hot path, not on one-off admin/reporting handlers.
- Two broad themes repeat across the codebase:
  - predicates that look flexible in TypeScript but are hard for SQLite to optimize (`OR`, nullable scope guards, function-wrapped indexed columns)
  - repeated one-row lookups that should be batched or satisfied from already-materialized data
- If only two fixes get prioritized first, the best ROI looks like:
  - dedup-query rewrites plus composite partial indexes for `memory_save`
  - co-activation batching plus removal of per-row `getRelatedMemories()` calls from stage-2 fusion

# Iteration 9: Save Pipeline Robustness + Memory Quality Gates (Q11)

## Focus
Deep dive into the save pipeline (handlers/save/ directory, 7 modules + quality-loop.ts + pe-gating.ts) to answer Q11: Is the save pipeline robust? Are memory quality gates effective? Is dedup working? Examines the full save lifecycle from entry through dedup, embedding, PE arbitration, quality scoring, record creation, and post-insert enrichment.

## Findings

### 1. Save Pipeline Architecture: 7-Module Decomposition
The save pipeline is modularly decomposed into 7 files exported via `save/index.ts`:
- **dedup.ts** -- SHA-256 content-hash dedup + same-path metadata equivalence
- **embedding-pipeline.ts** -- Generate/cache embeddings with weighted document sections
- **pe-orchestration.ts** -- Prediction-error gate evaluation and action dispatch
- **create-record.ts** -- Actual memory_index row insertion
- **post-insert.ts** -- 4-step post-insert enrichment pipeline
- **response-builder.ts** -- Build MCP response objects
- **db-helpers.ts** -- Post-insert metadata application utilities
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:1-48]

### 2. Dedup Has TWO Layers: Same-Path + Cross-Path
**Layer 1 (same-path)**: `checkExistingRow()` finds existing memory by `canonical_file_path OR file_path` within the same spec_folder + scope (tenant/user/agent/session/shared_space). Returns `status: 'unchanged'` when content_hash matches, embedding status is valid (success|pending|partial), AND metadata is equivalent (trigger phrases, quality score, quality flags all compared). This prevents re-indexing identical files.

**Layer 2 (cross-path)**: `checkContentHashDedup()` finds any memory with the same content_hash across different file paths (excluding the same-path match via `samePathExclusion`). Returns `status: 'duplicate'` and skips embedding generation entirely. Only considers rows with `embedding_status IN ('success', 'partial')`.

**Gap**: Neither layer uses semantic (cosine) similarity for dedup. Content-hash dedup is exact-match only. Two files with 99% identical content but a single character difference will both be indexed. Semantic dedup is handled separately by the PE gate (Layer 3 below).
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:90-265]

### 3. Embedding Pipeline: Weighted Document Sections with Cache
The embedding pipeline implements a 2-tier cache strategy:
- **Tier 1**: Persistent SQLite cache via `lookupEmbedding(db, cacheKey, modelId)` -- checks before any API call
- **Tier 2**: Provider API call on cache miss, with deferred cache write (`pendingCacheWrite`)

**Weighted sections**: Content is pre-processed into `WeightedDocumentSections` before embedding -- title, decisions (extracted from ## Decisions heading), outcomes (from ## Key Outcomes), and general (remainder after stripping structural noise). This means the embedding is structurally-aware, not just bag-of-words.

**Async mode**: When `asyncEmbedding: true`, only checks cache. On cache miss, returns `status: 'pending'` with no API call. The memory is saved with pending status, creating a "lexical-only" index entry.

**Cache key**: Uses `computeContentHash(normalizeContentForEmbedding(content))` -- the model parameter is accepted but voided (`void model`), meaning cache keys are NOT model-scoped. **BUG**: If the embedding model changes, stale embeddings from the old model will be served from cache without regeneration.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:96-203]

### 4. Prediction-Error (PE) Gate: 5-Action Arbitration System
When an embedding exists and force=false, the save pipeline runs a PE arbitration:
1. `findSimilarMemories()` does vector search with `minSimilarity: 50` (50% cosine), `limit: 5`, scoped to spec_folder, excluding constitutional memories
2. `predictionErrorGate.evaluateMemory()` analyzes candidates and returns one of 5 actions:
   - **CREATE** -- Low similarity, proceed normally
   - **REINFORCE** -- High similarity duplicate; update FSRS stability via GRADE_GOOD, no new row
   - **SUPERSEDE** -- Contradiction detected; mark old memory as deprecated, create new
   - **UPDATE** -- High similarity with changes; append new version, deprecate old
   - **CREATE_LINKED** -- Related but distinct; create new with relationship

**Safety guard**: If REINFORCE/SUPERSEDE/UPDATE is returned without `existingMemoryId`, the system falls through to CREATE with a warning. This prevents null-reference crashes.

**Mutation ledger**: REINFORCE and UPDATE actions record mutations via `appendMutationLedgerSafe()` for audit trail.

**UPDATE uses append-only versioning**: Rather than modifying the existing row, UPDATE creates a NEW memory_index row, deprecates the old one, and records a lineage transition. This is an immutable append-only pattern.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:28-179]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:106-318]

### 5. Quality Loop: 4-Dimension Verify-Fix-Verify Gate
The quality loop (`quality-loop.ts`, 700 LOC) implements a pre-storage quality gate with:
- **4 dimensions**: triggers (0.25), anchors (0.30), budget (0.20), coherence (0.25)
- **Threshold**: 0.6 default
- **Auto-fix**: Up to 2 retry attempts with deterministic fixes (re-extract triggers from headings, close unclosed ANCHOR tags, trim to token budget)
- **Short-circuit**: If no fixes were applied in a retry, further retries are skipped

**Scoring details**:
- Triggers: 0 phrases=0.0, 1-3=0.5, 4+=1.0
- Anchors: none=0.5 (neutral), all paired=1.0, proportional deduction for broken pairs
- Budget: 2000 tokens (8000 chars at 4 chars/token), proportional penalty for oversize
- Coherence: 4 additive checks (non-empty +0.25, >50 chars +0.25, has headings +0.25, >200 chars +0.25), with deductions for future-dated completion claims and self-referential causal links

**Feature gated**: Behind `SPECKIT_QUALITY_LOOP` env var. When disabled, score is computed but `passed: true` is always returned. The quality gate is advisory-only when disabled.

**Eval integration**: Quality metrics are logged to `eval_metric_snapshots` table when `SPECKIT_EVAL_LOGGING=true`.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:1-700]

### 6. Post-Insert Enrichment: 4-Step Feature-Flagged Pipeline
After a memory row is inserted, `runPostInsertEnrichment()` runs 4 sequential steps, each independently feature-gated and try/catch wrapped:
1. **Causal links processing** -- Always runs if parsed data has causal links
2. **Entity extraction (R10)** -- Gated by `isAutoEntitiesEnabled()`; extracts, filters, stores entities + updates catalog
3. **Summary generation (R8)** -- Gated by `isMemorySummariesEnabled()`; generates embedding-based summary
4. **Entity linking (S5)** -- Gated by `isEntityLinkingEnabled() AND isAutoEntitiesEnabled()`; cross-document entity linking with density guard

**Isolation**: Each step is wrapped in its own try/catch, so one failure does not block subsequent steps. This is a strength -- the pattern matches the pipeline's defensive error handling philosophy.

**Density guard**: Entity linking has a built-in density guard that skips linking when edge density exceeds a threshold, preventing graph explosion.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:48-127]

### 7. Document-Type-Aware Weighting: 10-Level Hierarchy
The PE gating module implements document-type-aware importance weighting:
- constitutional: 1.0
- spec, decision_record: 0.8
- plan: 0.7
- tasks, implementation_summary, research: 0.6
- checklist, handover, memory: 0.5
- scratch: 0.25

Fallback: path-based heuristic -- `/scratch/` paths get 0.25, everything else 0.5. This weight is applied during both REINFORCE and UPDATE PE actions.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:74-98]

### 8. Scope-Aware Dedup: 5-Dimensional Tenant Isolation
Both dedup layers enforce scope isolation across 5 dimensions: tenantId, userId, agentId, sessionId, sharedSpaceId. Each dimension uses `((? IS NULL AND col IS NULL) OR col = ?)` SQL pattern for NULL-safe matching. This means:
- Two different tenants can have identical content without triggering dedup
- Shared spaces are isolated from private spaces
- Session-scoped memories only dedup within the same session

This is production-grade multi-tenancy support.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:98-131, 169-240]

### 9. Concurrency Gap: No Transaction Isolation in Dedup
The dedup check (`checkExistingRow` and `checkContentHashDedup`) runs as a SELECT, then the caller proceeds to INSERT. There is no transaction wrapping around the check-then-insert sequence in the dedup module itself. If two concurrent saves for identical content arrive simultaneously:
1. Both SELECT → find no existing match → both return null
2. Both proceed to INSERT → duplicate rows created
3. The PE gate (Layer 3) may catch this on the next save if embeddings are similar enough, but the first two concurrent saves will both succeed.

**Mitigation**: SQLite's write lock provides serialization for single-process usage. This is only a concern in multi-process scenarios or if the MCP server runs multiple worker threads.

**Contrast with UPDATE**: The `updateExistingMemory()` function uses `database.transaction()` for the append-version + deprecate-old + lineage-record sequence. This is correctly transactional. The initial dedup layer is not.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:90-160 (no transaction)]
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:256-306 (has transaction)]

### 10. Embedding Cache Key Bug: Model-Blind Cache
The `computeCacheKey()` function accepts a `model` parameter but explicitly voids it: `void model`. The cache key is computed solely from content hash. If the embedding model is swapped (e.g., from text-embedding-3-small to text-embedding-3-large), all existing cache entries will be served as if they were from the new model, producing dimension mismatches or degraded similarity scores.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:111-114]

### 11. Quality Loop Has Content Mutation Side Effect
When the quality loop applies auto-fixes (trigger phrase re-extraction, anchor normalization, content trimming), it returns `fixedContent` and `fixedTriggerPhrases`. The caller MUST use these mutated values for the final INSERT, and MUST recompute the content_hash. If the caller ignores the fixedContent, the stored content_hash will mismatch the actual stored content -- a data integrity violation.
[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts:596-633]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts` (48 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts` (265 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts` (203 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts` (179 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts` (127 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts` (373 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts` (700 lines)

## Assessment
- New information ratio: 0.91 (10 of 11 findings are fully new; finding 7 partially overlaps with iter-4 document type discussion)
- Questions addressed: [Q11]
- Questions answered: [Q11]

## Reflection
- What worked and why: Reading the save/index.ts barrel export first gave the complete module roster in 48 lines, making the 7-module architecture immediately visible. Reading dedup.ts and pe-gating.ts in full revealed the 3-layer dedup architecture (hash-exact, cross-path hash, semantic PE gate) that would be invisible from any single file.
- What did not work and why: No failures this iteration. All file paths were correct as provided by the dispatch context.
- What I would do differently: Would also read create-record.ts to understand how the quality loop's fixedContent is actually consumed. The content mutation side effect (finding 11) raises a caller-contract question that requires seeing the full save orchestrator.

## Recommended Next Focus
Iteration 10: Deep dive into Q12 (cognitive subsystem). List and read lib/cognitive/ directory -- 11 files including prediction-error-gate.ts (already partially seen via PE orchestration), FSRS scheduler, session cache, attention model. Assess whether the cognitive subsystem is over-engineered relative to actual retrieval quality impact.

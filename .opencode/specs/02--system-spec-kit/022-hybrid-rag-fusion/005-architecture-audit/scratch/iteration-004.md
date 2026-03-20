# Iteration 004 — Merged Findings

**Focus**: MCP search pipeline, storage/vector index, extraction/parsing/governance
**Agents**: copilot-C1 (search pipeline), copilot-C2 (storage/vector), codex-A1 (extraction/parsing)
**New findings**: 21

---

## P1 (HIGH)

### [LOGIC] Search pipeline: Stage 1 wraps legacy mini-pipeline (C1)
- **File(s)**: pipeline/orchestrator.ts:42-65, stage1-candidate-gen.ts:281-285, hybrid-search.ts:543-1057
- **Description**: Stage 1 delegates to `hybridSearch.searchWithFallback()` which already does routing, fusion, MPAB, rerank, MMR, co-activation, token-budget, header injection. Then Stages 2/3 re-do fusion/rerank. Biggest architectural issue — "V2 pipeline wraps legacy mini-pipeline."

### [BUG] Stage 3 rerank scores shadowed by Stage 2 aliases (C1)
- **File(s)**: pipeline/types.ts:48-67, stage3-rerank.ts:320-327, stage4-filter.ts:203-216
- **Description**: Score resolver prefers `intentAdjustedScore -> rrfScore` over `score`. Stage 3 overwrites only `score`/`rerankerScore`. Downstream ranking math still uses Stage 2 values. Reranking changes order transiently but effect is lost.

### [BUG] Score normalization inconsistent after fusion (C1)
- **File(s)**: stage2-fusion.ts:165-173, pipeline/types.ts:58-67, ranking-contract.ts:36-57
- **Description**: Stage 2 stores boosted values without clamping. `resolveEffectiveScore()` clamps to [0,1] but deterministic sorting uses raw >1 scores. Ranking based on different score ranges depending on code path.

### [BUG] Checkpoint restore is not full-consistency restore (C2)
- **File(s)**: mcp_server/lib/storage/checkpoints.ts:389-457, 696-723
- **Description**: Only snapshots 4 tables (memory_index, vec_memories, working_memory, causal_edges). Does NOT snapshot memory_lineage, active_memory_projection, memory_entities, etc. Restore leaves stale projection/lineage rows.

### [BUG] Reconsolidation leaves vector search out of sync (C2)
- **File(s)**: mcp_server/lib/storage/reconsolidation.ts:216-250, 360-378
- **Description**: `executeMerge()` regenerates embedding but doesn't update `embedding_status`, `embedding_model`, or `embedding_generated_at`. Vector search only returns `embedding_status = 'success'` rows.

### [LOGIC] Graph/lineage integrity enforced in code not schema (C2)
- **File(s)**: vector-index-schema.ts:331-345, 955-1023
- **Description**: No foreign keys on causal_edges, memory_lineage, active_memory_projection. Orphan prevention depends on every mutation calling right cleanup helper.

### [BUG] Governed saves lose session_id (A1)
- **File(s)**: scope-governance.ts:295, save/db-helpers.ts:13, save/create-record.ts:64
- **Description**: session_id validated but never persisted to memory_index. Same-path dedup filters on session_id. Governed session-scoped save fails to match own scope on next save.

### [BUG] Memory-type inference: Tier precedence misclassifies spec docs (A1)
- **File(s)**: memory-parser.ts:190, type-inference.ts:228, 246, memory-types.ts:348
- **Description**: Type inference checks tier before path rules. Default tiers collapse plan.md, tasks.md, checklist.md into 'declarative' instead of canonical 'procedural'/'prospective'. Skews decay/retention.

---

## P2 (MEDIUM)

### [LOGIC] Query understanding dropped between classifiers (C1)
- **File(s)**: stage1-candidate-gen.ts:281-285, hybrid-search.ts:64-83, 733-742

### [PERFORMANCE] Stage 1 duplicates embedding work 3-4x (C1)
- **File(s)**: stage1-candidate-gen.ts:263-265, 277-280, 543-545, 594-596

### [LOGIC] Error recovery per-feature not per-stage (C1)
- **File(s)**: orchestrator.ts:42-65, handlers/memory-search.ts:929-968

### [DEAD_CODE] reranker.ts, rsf-fusion.ts, cross-encoder local path (C1)
- **File(s)**: reranker.ts (standalone unused), rsf-fusion.ts (shadow-only), cross-encoder.ts:315-349

### [LOGIC] Transaction safety inconsistent across compound mutations (C2)
- **File(s)**: save/response-builder.ts:92-116, memory-bulk-delete.ts:208-225, transaction-manager.ts:197-203

### [LOGIC] No downgrade guard or eval DB versioning (C2)
- **File(s)**: vector-index-schema.ts:898-930, eval-db.ts:38-143

### [LOGIC] No purge policy for history/ledger/eval tables (C2)
- **File(s)**: history.ts:81-172, mutation-ledger.ts:89-130, eval-db.ts:38-143

### [LOGIC] Eval lacks indices on hot query columns (C2)
- **File(s)**: eval-db.ts:40-99, reporting-dashboard.ts:186-208

### [BUG] Redaction gate: 40-char hex allowlist can bypass secrets (A1)
- **File(s)**: mcp_server/lib/extraction/redaction-gate.ts:21, 35

### [BUG] Community persistence retains stale memberships (A1)
- **File(s)**: mcp_server/lib/graph/community-detection.ts:451, 490, 525

### [BUG] Trigger-matcher boosts don't affect truncation order (A1)
- **File(s)**: trigger-matcher.ts:460, 484, memory-triggers.ts:252

---

## P3 (LOW)

### [BUG] Entity extractor: Code-fence regex truncates c++, f#, objective-c (A1)
- **File(s)**: mcp_server/lib/extraction/entity-extractor.ts:87

---

## Statistics
- P1: 8, P2: 12, P3: 1 = 21 new
- Cumulative: 111 findings
- newInfoRatio: 0.57 (21/37)

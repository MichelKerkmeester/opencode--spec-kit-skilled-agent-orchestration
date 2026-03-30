---
title: "Tasks: Hybrid Search Pipeline Null DB Fix"
description: "Task breakdown for diagnosing and fixing the 0-result search pipeline bug caused by scope enforcement and TRM state filtering."
trigger_phrases:
  - "hybrid search fix tasks"
  - "search pipeline repair tasks"
  - "scope enforcement fix"
  - "TRM state filter fix"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Hybrid Search Pipeline Null DB Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Diagnose

- [x] T001 Verify data exists in FTS5, vec_memories, active_memory_projection (direct SQL)
- [x] T002 Check embedding_status distribution (996 success, 1 failed, 2 partial)
- [x] T003 Confirm sqlite-vec extension loaded (lsof on running process)
- [x] T004 Verify WAL checkpoint status (126/126 frames)
- [x] T005 Add diagnostic logging to hybrid-search.js (MODULE_ID, db, vectorSearchFn)
- [x] T006 Test fresh server startup — init() called correctly with same MODULE_ID
- [x] T007 Test direct module search — searchWithFallback returns 5+5 results
- [x] T008 Test V2 pipeline (executePipeline) — returns 0 despite 5+5 channel results
- [x] T009 Add per-filter diagnostics to stage1-candidate-gen.js
- [x] T010 Identify Bug 1: scope enforcement filters all (shouldApplyScope=true, 5→0)
- [x] T011 Identify Bug 2: TRM state filter removes all (minState='WARM', state=UNKNOWN)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fix

- [x] T012 Fix scope-governance.ts — change isScopeEnforcementEnabled() to opt-in
- [x] T013 Fix scope-governance.js (dist) — same change
- [x] T014 Fix memory-search.ts — remove minState='WARM' default
- [x] T015 Fix memory-search.js (dist) — same change
- [x] T016 Fix memory-context.ts — remove minState='WARM' hardcode (2 occurrences)
- [x] T017 Fix memory-context.js (dist) — same change
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verify & Cleanup

- [x] T018 Verify "semantic search" returns results (4 results, including #893 CocoIndex)
- [x] T019 Verify "SpecKit Phase System" returns results (5 results, including #325)
- [x] T020 Verify "compact code graph" returns results (5 results, including #45)
- [x] T021 Remove all diagnostic console.error statements from hybrid-search.js
- [x] T022 Remove all diagnostic console.error statements from stage1-candidate-gen.js
- [x] T023 Kill MCP server processes to apply fixes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Search Engine Optimization

> Source: 10-iteration deep research on live search pipeline post-fix. All tasks target `.opencode/skill/system-spec-kit/mcp_server/lib/` unless noted.

- [ ] T024 [P] RRF k-value 60 → 40 (`shared/algorithms/rrf-fusion.ts`)
  - Change the constant `K = 60` to `K = 40` in the RRF fusion algorithm
  - Rationale: k=60 tuned for 10k+ document corpora; k=40 better separates signal from noise at 999-memory scale
  - Acceptance: RRF scores for top-5 results show wider spread (less score compression)

- [ ] T025 [P] Token budget 1500 → 2500 (`handlers/memory-search.ts`, `architecture/layer-definitions.ts`)
  - Update token limit constant/default from 1500 to 2500 in both files
  - Rationale: 1500 truncates long memories at p95 length; 2500 matches observed max memory size
  - Acceptance: No memory content truncated in `memory_search` results for p95 memories

- [ ] T026 [P] Deprecated tier filter symmetry (`search/sqlite-fts.ts`, `search/bm25-index.ts`)
  - Unify the `status != 'deprecated'` exclusion clause to use identical SQL/filter logic in both files
  - Rationale: Two different filter implementations create inconsistent recall between FTS5 and BM25 channels
  - Acceptance: Both channels return identical sets when queried against same corpus slice

- [ ] T027 [P] R12 expansion gate relaxation (`search/embedding-expansion.ts`, `search/pipeline/stage1-candidate-gen.ts`)
  - Lower the R12 relevance threshold from 0.82 to 0.72 that gates candidate expansion
  - Rationale: 0.82 is too strict for borderline-relevant memories; 0.72 permits useful expansions without flooding
  - Acceptance: Expansion activates for queries returning 3–5 borderline-relevant candidates

- [ ] T028 [P] Cross-encoder metadata split + MMR diversity pass (`search/pipeline/stage3-rerank.ts`)
  - Split cross-encoder input so title and body are scored independently then combined
  - Add MMR (Maximal Marginal Relevance) diversity pass when cross-encoder reranker is unavailable
  - Rationale: Title+body concatenation dilutes title signal; missing MMR causes result clustering
  - Acceptance: Top-5 results show ≥3 distinct topic clusters; title-heavy memories rank appropriately

- [ ] T029 [P] Compound-term FTS5 phrase expansion (`search/bm25-index.ts`)
  - For multi-word queries (≥2 tokens), generate FTS5 phrase variant (`"token1 token2"`) alongside individual token queries
  - Rationale: "spec kit" only matches individual tokens, missing exact phrase occurrences in memories
  - Acceptance: `memory_search("spec kit")` returns memories containing the exact phrase "spec kit"

- [ ] T030 [P] related_memories format fix + Stage 2 co-activation injection (`search/pipeline/stage2-fusion.ts`, `search/co-activation.ts`)
  - Fix `co-activation.ts` to return memory IDs in the format expected by stage2 (integer vs. string mismatch)
  - Wire `stage2-fusion.ts` to inject co-activated memory IDs into the fusion candidate pool
  - Rationale: Co-activation IDs never enter fusion; related memories are computed but silently discarded
  - Acceptance: `memory_search` trace shows co-activated memories in Stage 2 inputCount

- [ ] T031 [P] Quality score backfill for 520 zero-score memories (`quality/save-quality-gate.ts`)
  - Add a backfill path in `save-quality-gate.ts` that scores memories with `quality_score = 0.0` on first read
  - Rationale: 520 memories have never been scored; zero quality scores suppress them in quality-filtered results
  - Acceptance: After backfill run, `SELECT COUNT(*) FROM memory_index WHERE quality_score = 0.0` returns < 50

- [ ] T032 [P] Lineage parent_id for chunk children (`search/chunking-orchestrator.ts`)
  - Ensure `chunking-orchestrator.ts` writes `parent_id` field when creating chunk children
  - Rationale: Missing parent_id breaks lineage graph traversal; chunk children appear as orphans
  - Acceptance: All chunk children have non-null `parent_id` in `memory_index`; lineage traversal returns full chain

- [ ] T033 [P] Per-stage timing persistence + cache hit/miss counters (`search/hybrid-search.ts`, `search/embedding-cache.ts`)
  - Persist per-stage durations from `hybrid-search.ts` to a structured trace field (not just console log)
  - Add hit/miss counters to `embedding-cache.ts` exposed via `getStats()` or similar
  - Rationale: Stage timings are logged but not persisted; cache effectiveness is unobservable
  - Acceptance: `memory_search(..., includeTrace: true)` response includes `stageDurations` map; `embedding-cache.getStats()` returns `{ hits, misses, hitRate }`
<!-- /ANCHOR:phase-4 -->

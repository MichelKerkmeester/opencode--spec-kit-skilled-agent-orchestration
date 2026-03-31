---
title: "Tasks: Hybrid Search Pipeline Null [02--system-spec-kit/023-esm-module-compliance/007-hybrid-search-null-db-fix/tasks]"
description: "Task breakdown for diagnosing and fixing the 0-result search pipeline bug caused by scope enforcement and TRM state filtering."
trigger_phrases:
  - "hybrid search fix tasks"
  - "search pipeline repair tasks"
  - "scope enforcement fix"
  - "trm state filter fix"
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

- [x] T024 [P] RRF k-value 60 → 40 (`shared/algorithms/rrf-fusion.ts`)
- [x] T025 [P] Token budget raised: L1 2000→3500, L2 2500→3500, focused 1500→3000, deep 2000→3500, resume 1200→2000
- [x] T026 [P] Deprecated tier filter added to FTS5 (`search/sqlite-fts.ts`)
- [x] T027 [P] R12 expansion gate ≤3→≤2 tokens (`search/embedding-expansion.ts`)
- [x] T028 [P] rerankProvider metadata in Stage 3 (`search/pipeline/stage3-rerank.ts`)
- [x] T029 [P] Compound-term FTS5 phrase expansion (`search/bm25-index.ts`)
- [x] T030 [P] related_memories scalar+object format + similarity scale fix 0.5→50 (`search/co-activation.ts`)
- [x] T031 [P] computeBackfillQualityScore() + wired into Stage 1 read path (`validation/save-quality-gate.ts`, `pipeline/stage1-candidate-gen.ts`)
- [x] T032 [P] Chunk children parent_id propagation (`handlers/chunking-orchestrator.ts`)
- [x] T033 [P] Embedding cache hit/miss counters + getCacheStats() (`cache/embedding-cache.ts`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Ultra-Think Review P1 Fixes

> Source: GPT-5.4 ultra-think review found 4 P1 issues in the Phase 4 changes.

- [x] T034 Remove minState:'WARM' from shadow-evaluation-runtime (`feedback/shadow-evaluation-runtime.ts`)
- [x] T035 Update tool-input-schema tests for simplified schemas (`tests/tool-input-schema.vitest.ts`)
- [x] T036 Fix scalar related_memories similarity scale 0.5→50 (`cognitive/co-activation.ts`)
- [x] T037 Wire computeBackfillQualityScore into Stage 1 candidate pipeline (`pipeline/stage1-candidate-gen.ts`)
<!-- /ANCHOR:phase-5 -->

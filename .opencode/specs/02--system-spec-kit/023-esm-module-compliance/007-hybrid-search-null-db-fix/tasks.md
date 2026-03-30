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

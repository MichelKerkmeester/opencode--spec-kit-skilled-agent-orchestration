---
title: "Tasks: feature-flag-reference [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "feature-flag-reference"
  - "feature flag reference"
  - "search pipeline"
  - "memory and storage"
  - "embedding and api"
importance_tier: "normal"
contextType: "general"
---
# Tasks: feature-flag-reference

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
## Phase 1: Setup

- [ ] T001 Build feature inventory for all seven catalog entries (`feature_catalog/20--feature-flag-reference/`)
- [ ] T002 Confirm env-var read-site baseline for SPECKIT, memory, and embedding mappings (`mcp_server/lib/search`, `mcp_server/lib/eval`, `shared/`)
- [ ] T003 [P] Define Source File integrity validation criteria for CI (`feature_catalog/20--feature-flag-reference/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 P0 Reconcile stale `SPECKIT_*` Source File mappings, including `SPECKIT_ABLATION`, `SPECKIT_RRF`, and `SPECKIT_LAZY_LOADING` (`.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/01-1-search-pipeline-features-speckit.md`)
- [ ] T005 [P] P0 Add CI validation script for Source File existence and env-var symbol presence (`feature_catalog/20--feature-flag-reference/`)
- [ ] T006 [P] P1 Update `MEMORY_DB_DIR` and `MEMORY_DB_PATH` mappings to `lib/search/vector-index-store.ts` (`.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/04-4-memory-and-storage.md`)
- [ ] T007 [P] P1 Update `EMBEDDINGS_PROVIDER` mapping to `shared/embeddings/factory.ts` (`.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md`)
- [ ] T008 [P] P1 Correct `EMBEDDING_DIM` mapping and clarify 768 compatibility semantics (`.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md`)
- [ ] T009 P2 Add regression coverage for barrel re-export drift and non-768 `EMBEDDING_DIM` behavior (`.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/04-4-memory-and-storage.md`, `.opencode/skill/system-spec-kit/feature_catalog/20--feature-flag-reference/05-5-embedding-and-api.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Verify all seven features remain represented with PASS/WARN/FAIL outcomes (`checklist.md`)
- [ ] T011 Verify preserved priority split remains P0=2, P1=3, P2=1 (`tasks.md`)
- [ ] T012 Update and validate cross-links and template-anchor integrity (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

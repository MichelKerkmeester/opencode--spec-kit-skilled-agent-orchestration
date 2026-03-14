---
title: "Tasks: feature-flag-reference [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2
trigger_phrases:
  - "feature-flag-reference"
  - "feature flag reference"
  - "mapping closeout"
importance_tier: "high"
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

- [x] T001 Build feature inventory for all seven catalog entries (`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/`) [EVIDENCE: Seven source docs confirmed under `19--feature-flag-reference`.]
- [x] T002 Confirm env-var mapping baseline for SPECKIT, memory, and embedding entries (`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`, `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md`, `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md`) [EVIDENCE: Corrected mapping rows present in catalog docs.]
- [x] T003 [P] Identify automated mapping guard for critical env-var path validity (`.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts`) [EVIDENCE: Guard test covers 8 mapping checks.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Mark stale mapping findings for F-01 as resolved based on corrected catalog entries (`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`) [EVIDENCE: `SPECKIT_ABLATION`, `SPECKIT_RRF`, and `SPECKIT_LAZY_LOADING` map to current source files.]
- [x] T005 [P] Mark source-integrity validation guard as implemented and verified (`.opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts`) [EVIDENCE: Guard test passed with 8/8 checks.]
- [x] T006 [P] Mark F-04 mapping drift as resolved (`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/04-4-memory-and-storage.md`) [EVIDENCE: `MEMORY_DB_DIR` and `MEMORY_DB_PATH` both map to `lib/search/vector-index-store.ts`.]
- [x] T007 [P] Mark F-05 provider mapping drift as resolved (`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md`) [EVIDENCE: `EMBEDDINGS_PROVIDER` maps to `shared/embeddings/factory.ts`.]
- [x] T008 [P] Mark F-05 dimension semantics mismatch as resolved (`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md`) [EVIDENCE: `EMBEDDING_DIM` semantics now document provider-default behavior and 768 short-circuit scope.]
- [x] T009 Close stale draft/pending language in phase 020 docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) [EVIDENCE: Status and task/checklist markers now indicate completed closeout state.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verify all seven features remain represented with current outcomes (`checklist.md`) [EVIDENCE: Checklist documents resolved mapping state with complete evidence coverage.]
- [x] T011 Run and record automated mapping guard output (`mcp_server`) [EVIDENCE: `npm run test -- tests/feature-flag-reference-docs.vitest.ts` passed: 1 file, 8 tests.]
- [x] T012 Validate markdown links and template-anchor integrity (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) [EVIDENCE: `validate.sh --no-recursive` for phase 020 passes.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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

---
title: "Tasks: retrieval-enhancements [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "retrieval enhancements tasks"
  - "hybrid rag fusion remediation"
  - "feature catalog backlog"
  - "tier 2 fallback"
  - "provenance envelope"
importance_tier: "normal"
contextType: "general"
---
# Tasks: retrieval-enhancements

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

- [x] T001 Build inventory for all 9 retrieval-enhancement features (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/`)
- [x] T002 Extract implementation and test ownership mappings per feature (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/*.md`)
- [x] T003 [P] Cross-reference feature set against NEW-085+ playbook scenarios (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Fix F-07 implementation mapping to `hybrid-search.ts` and `hybrid-search.vitest.ts` (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md`) — Evidence: Feature doc 07-tier-2-fallback updated with hybrid-search.ts ownership
- [x] T005 Replace placeholder channel tests with executable assertions (`mcp_server/tests/channel.vitest.ts`) — Evidence: 3 tests added to channel.vitest.ts (F07-CH-01/02/03)
- [x] T006 Fix F-08 provenance ownership mapping and add trace assertion coverage (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md`) — Evidence: Feature doc 08-provenance updated with search-results.ts, memory-search.ts, envelope.ts
- [x] T007 Add explicit token-estimate enforcement at hook output boundaries (`mcp_server/hooks/memory-surface.ts`) — Evidence: enforceAutoSurfaceTokenBudget() added to memory-surface.ts with 4000-token budget
- [x] T008 [P] Replace wildcard re-exports with explicit named exports (`mcp_server/lib/providers/embeddings.ts`, `mcp_server/lib/search/vector-index.ts`, `mcp_server/lib/utils/path-security.ts`) — Evidence: vector-index.ts wildcard re-exports replaced with explicit named exports
- [x] T009 [P] Replace empty catch blocks with typed logged handling (`mcp_server/lib/search/vector-index-queries.ts`, `mcp_server/lib/search/vector-index-schema.ts`) — Evidence: vector-index-queries.ts, vector-index-schema.ts empty catches replaced with logger.warn
- [x] T010 Add context-server pre-dispatch branch to F-01 source table (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md`) — Evidence: context-server.ts added to F-01 source table
- [x] T011 Align summary-channel contract docs with Stage-1 adaptation flow (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md`) — Evidence: F-05 summary-channel contract corrected: querySummaryEmbeddings returns lightweight hits, Stage-1 adapts to PipelineRow
- [x] T012 Add fallback exception logging in entity-linker helpers (`mcp_server/lib/search/entity-linker.ts`) — Evidence: entity-linker.ts getEdgeCount/getSpecFolder now log errors before fallback return
- [x] T013 Calibrate header-overhead reservation against actual header length (`mcp_server/lib/search/hybrid-search.ts`) — Evidence: Header overhead calibrated: CONTEXT_HEADER_MAX_CHARS=100, per-result x12->x26 tokens
- [x] T014 Add hook-level dispatch and compaction tests; remove stale retry references (`mcp_server/tests/`, `.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md`) — Evidence: 2 hook dispatch/compaction tests in dual-scope-hooks.vitest.ts
- [x] T015 Add constitutional enrichment integration tests for auto-surface path (`mcp_server/tests/retrieval-directives.vitest.ts`) — Evidence: 2 constitutional enrichment tests in retrieval-directives.vitest.ts
- [x] T016 Hook hierarchy cache invalidation and add cache behavior tests (`mcp_server/lib/search/spec-folder-hierarchy.ts`) — Evidence: 2 cache invalidation tests in spec-folder-hierarchy.vitest.ts
- [x] T017 Add Stage-1 summary merge/dedupe/threshold integration coverage (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`) — Evidence: 3 summary merge/dedupe/threshold tests in stage1-expansion.vitest.ts
- [x] T018 Add batched edge-count retrieval assertions (`mcp_server/tests/entity-linker.vitest.ts`) — Evidence: 4 batched edge-count tests in entity-linker.vitest.ts
- [x] T019 Add post-truncation ordering and budget interaction tests for contextual headers (`mcp_server/tests/hybrid-search-context-headers.vitest.ts`, `.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md`) — Evidence: 2 post-truncation ordering/budget tests in hybrid-search-context-headers.vitest.ts
- [x] T020 Replace deferred envelope branches with concrete payload validation (`mcp_server/tests/mcp-response-envelope.vitest.ts`) — Evidence: Deferred envelope branches replaced with 4 concrete payload validation tests in mcp-response-envelope.vitest.ts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Validate corrected source/test mappings across all 9 feature docs (`.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/`) — Evidence: automated reference validation returned `MISSING_TOTAL=0` for all backticked `mcp_server/...` source/test paths across feature docs 01-09.
- [x] T022 Execute targeted regression suites for fallback, provenance, and context-header flows (`mcp_server/tests/`) — Evidence: `npx vitest run tests/channel.vitest.ts tests/hybrid-search.vitest.ts tests/search-results-format.vitest.ts tests/mcp-response-envelope.vitest.ts tests/hybrid-search-context-headers.vitest.ts` passed (`5` files, `138` tests, `0` failures).
- [x] T023 Synchronize `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` with final verification evidence (`.opencode/specs/.../015-retrieval-enhancements/`) — Evidence: phase-3 verification status and checklist evidence synchronized on 2026-03-13.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0/P1 remediation evidence recorded in `checklist.md`
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

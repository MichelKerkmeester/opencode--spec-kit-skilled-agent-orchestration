---
title: "Tasks: 006 Search Query RAG Optimization"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task ledger for harness implementation, query-plan telemetry, planned follow-up workstreams, and verification."
trigger_phrases:
  - "006 search query rag optimization tasks"
  - "query plan telemetry tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-search-query-rag-optimization"
    last_updated_at: "2026-04-28T21:02:24Z"
    last_updated_by: "codex"
    recent_action: "Completed task ledger with verification evidence"
    next_safe_action: "Use harness for future optimization work"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:006-search-query-rag-optimization-tasks-20260428"
      session_id: "006-search-query-rag-optimization-20260428"
      parent_session_id: "019-search-query-rag-optimization-research"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 006 Search Query RAG Optimization

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

Harness setup and corpus infrastructure.

- [x] T001 Read Phase C report and synthesize scope. Evidence: `../../../011-mcp-runtime-stress-remediation/019-search-query-rag-optimization-research/research/research-report.md`.
- [x] T002 [P] Create search-quality corpus. Evidence: `mcp_server/tests/search-quality/corpus.ts`.
- [x] T003 [P] Create injectable search-quality harness. Evidence: `mcp_server/tests/search-quality/harness.ts`.
- [x] T004 [P] Create metrics module. Evidence: `mcp_server/tests/search-quality/metrics.ts`.
- [x] T005 Create baseline harness test. Evidence: `mcp_server/tests/search-quality/baseline.vitest.ts`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Query-plan telemetry and planned-workstream documentation.

- [x] T006 Create typed query-plan contract. Evidence: `mcp_server/lib/query/query-plan.ts`.
- [x] T007 Wire complexity query-plan emission. Evidence: `mcp_server/lib/search/query-classifier.ts`.
- [x] T008 Wire router query-plan emission. Evidence: `mcp_server/lib/search/query-router.ts`.
- [x] T009 Wire intent query-plan emission. Evidence: `mcp_server/lib/search/intent-classifier.ts`.
- [x] T010 Create query-plan emission tests. Evidence: `mcp_server/tests/query-plan-emission.vitest.ts`.
- [x] T011 Document workstreams 3-7 as planned in spec. Evidence: `spec.md`.
- [x] T012 Update parent phase manifest. Evidence: `../spec.md`.
- [x] T013 Author implementation summary with finding disposition. Evidence: `implementation-summary.md`.
- [x] T014 Update description and graph metadata. Evidence: `description.json`, `graph-metadata.json`.
- [x] T015 Mark final packet status complete. Evidence: `spec.md`, `graph-metadata.json`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run focused Vitest for search-quality baseline. Evidence: focused Vitest passed 2 files / 6 tests.
- [x] T017 Run focused Vitest for query-plan emission. Evidence: focused Vitest passed 2 files / 6 tests; existing classifier/router/intent sweep passed 3 files / 167 tests.
- [x] T018 Run `npm run typecheck`. Evidence: exit 0.
- [x] T019 Run `npm run build`. Evidence: exit 0.
- [x] T020 Run strict validator for this sub-phase. Evidence: strict validator PASS, 0 errors / 0 warnings.
- [x] T021 Run strict validator for source research packet. Evidence: strict validator PASS, 0 errors / 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or `[B]` with evidence.
- [x] No P0/P1 verification failure remains unreported. Evidence: focused tests, typecheck, and build exit 0.
- [x] Implementation summary records closed and planned findings. Evidence: `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source Research**: `../../../011-mcp-runtime-stress-remediation/019-search-query-rag-optimization-research/research/research-report`
<!-- /ANCHOR:cross-refs -->

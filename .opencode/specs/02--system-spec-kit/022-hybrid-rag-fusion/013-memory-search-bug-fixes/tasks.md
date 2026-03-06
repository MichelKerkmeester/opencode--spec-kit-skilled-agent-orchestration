---
title: "Tasks: Memory Search Bug Fixes (Unified)"
description: "Canonical Level 2 completed task breakdown for spec 013"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Search Bug Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |
| `[ ]` | Pending |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-a -->
## Phase A: Stateless Filename + Generic Slug Parity

- [x] T001 Keep stateless enrichment fallback flow in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`
- [x] T001a Restore invocation-local config state in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` after `runWorkflow()`
- [x] T001b Add workflow serialization guard in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` for overlapping `runWorkflow()` calls
- [x] T002 Add explicit stateless-only enrichment guard in `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts`
- [x] T003 Align generic task detection with slug behavior in `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts`
- [x] T004 Include `Implementation and updates` in generic classification parity
- [x] T005 Keep slug/title generation fed by enriched task while preserving `IMPL_TASK` honesty
- [x] T006 Add regression tests in `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`, including the workflow-level seam test preventing `CONFIG.DATA_FILE` leakage into a later stateless run
- [x] T006a Add concurrency regression coverage in `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` for overlapping serialized `runWorkflow()` calls
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Folder Discovery Follow-up

- [x] T007 Implement depth-limited recursive discovery (max depth 8) in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`
- [x] T008 Implement canonical-path root dedupe with first-candidate retention
- [x] T009 [P] Route staleness checks through recursive discovered spec folders
- [x] T009a Add stale-cache shrink regression follow-up coverage for deleted cached folders and cache regeneration behavior in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`
- [x] T010 Implement graceful empty-cache return for invalid/nonexistent non-empty explicit input paths
- [x] T011 Update unit coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts`
- [x] T012 Update integration coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`
- [x] T012a Add alias-root order determinism integration coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts`
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:phase-c -->
## Phase C: Verification + Canonical Doc Merge

- [x] T013 Run `npx tsc --noEmit`
- [x] T014 Run `npm run test:task-enrichment` and record the green 28-test result, including the new concurrency regression coverage
- [x] T015 Run `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts`
- [x] T016 Re-run `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` and record the green 28-test outcome, including alias-root order determinism coverage
- [x] T017 Run `npm run typecheck && npm run build` in `.opencode/skill/system-spec-kit` and record the passing result
- [x] T018 Run alignment drift check for the full `.opencode/skill/system-spec-kit` root
- [x] T018a Capture raw verification outputs under `scratch/verification-logs/` for reviewer-auditable command evidence
- [x] T018b Run the required memory-save workflow at the owning root spec and refresh packet indexing for immediate discoverability
- [x] T019 Merge duplicate root/addendum docs into canonical files only
- [x] T020 Remove addendum-named docs and retain standard packet names only
<!-- /ANCHOR:phase-c -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are complete.
- [x] Workflow-level seam coverage for stateless/file-backed config restoration and overlapping `runWorkflow()` serialization is recorded.
- [x] The stale-cache shrink follow-up fix and its regression coverage are recorded.
- [x] Alias-root order determinism integration coverage is recorded.
- [x] Both workstreams are represented in one canonical Level 2 packet.
- [x] Cross-references use standard filenames only.
- [x] Full workspace build pass is documented accurately.
- [x] The final folder-discovery integration green state is documented without stale failure notes.
- [x] Closure memory is saved using the supported owning-root workflow, and packet docs are refreshed in memory indexing.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Decision Record: `decision-record.md`
- Implementation Summary: `implementation-summary.md`
- Handover: `handover.md`
<!-- /ANCHOR:cross-refs -->

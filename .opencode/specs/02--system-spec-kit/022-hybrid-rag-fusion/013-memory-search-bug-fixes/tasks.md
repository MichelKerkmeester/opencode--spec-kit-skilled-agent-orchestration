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

- [x] T001 Keep stateless enrichment fallback flow in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (REQ-A01)
- [x] T001a Restore invocation-local config state in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` after `runWorkflow()` (REQ-A01)
- [x] T001b Add workflow serialization guard in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` for overlapping `runWorkflow()` calls (REQ-A01)
- [x] T002 Add explicit stateless-only enrichment guard in `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts` (REQ-A02)
- [x] T003 Align generic task detection with slug behavior in `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts` (REQ-A03)
- [x] T004 Include `Implementation and updates` in generic classification parity (REQ-A03)
- [x] T005 Keep slug/title generation fed by enriched task while preserving `IMPL_TASK` honesty and blocking later `specTitle` reselection through preferred-task fallback in file-backed/JSON mode (REQ-A04)
- [x] T006 Add regression tests in `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`, including the workflow-level seam test proving the later stateless run reaches the loader path with `CONFIG.DATA_FILE === null` (REQ-A05)
- [x] T006a Add concurrency regression coverage in `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` for overlapping serialized `runWorkflow()` calls (REQ-A05)
<!-- /ANCHOR:phase-a -->

---

<!-- ANCHOR:phase-b -->
## Phase B: Folder Discovery Follow-up

- [x] T007 Implement depth-limited recursive discovery (max depth 8) in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` (REQ-B01)
- [x] T008 Implement canonical-path root dedupe with first-candidate retention (REQ-B02)
- [x] T009 [P] Route staleness checks through recursive discovered spec folders (REQ-B03)
- [x] T009a Add stale-cache shrink and folder-set mismatch regression coverage for deleted cached folders, future-dated cache invalidation, and cache regeneration behavior in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` (REQ-B03)
- [x] T010 Implement graceful empty-cache return for invalid/nonexistent non-empty explicit input paths (REQ-B04)
- [x] T011 Update unit coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts` (REQ-B05)
- [x] T012 Update integration coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` (REQ-B05)
- [x] T012a Add alias-root order determinism integration coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` (REQ-B05)
<!-- /ANCHOR:phase-b -->

---

<!-- ANCHOR:phase-c -->
## Phase C: Verification + Canonical Doc Merge

- [x] T013 Run `npx tsc --noEmit`
- [x] T014 Run `npm run test:task-enrichment` and record the green 30-test result, including the new concurrency regression coverage
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

<!-- ANCHOR:phase-d -->
## Phase D: Voyage 4 Memory-Index Environment Fix

- [x] T021 Update `opencode.json` so `spec_kit_memory` keeps `EMBEDDINGS_PROVIDER=auto` for provider compatibility (REQ-C01)
- [x] T022 Remove literal `${VOYAGE_API_KEY}` and `${OPENAI_API_KEY}` interpolation from `opencode.json` so managed MCP workers use the parent shell/launcher environment (REQ-C02)
- [x] T023 Make `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` abort startup on embedding dimension mismatch instead of warning and continuing (REQ-C03)
- [x] T024 Add focused fatal-startup mismatch coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts` (REQ-C04)
- [x] T025 Run `npm run test --workspace=mcp_server -- tests/context-server.vitest.ts` and record the green 307-test result (REQ-C04)
- [x] T026 Re-run `npm run typecheck` and `npm run build` in `.opencode/skill/system-spec-kit`
- [x] T026a Run `npm run test --workspace=mcp_server -- tests/embeddings.vitest.ts` and record the green 14-test result proving auto-mode provider compatibility
- [x] T027 Verify managed startup via `~/.opencode/bin/opencode --print-logs --log-level DEBUG mcp list` reports `spec_kit_memory` connected with provider `voyage` and validated dimension `1024` (REQ-C05)
- [x] T028 Fix `memory_health` lazy provider reporting in `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` and add regression coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts` (REQ-C06)
- [x] T029 Run `npx vitest run tests/memory-crud-extended.vitest.ts` and record the green 68-test result (REQ-C06)
- [x] T030 Verify a real MCP SDK stdio client against `.opencode/skill/system-spec-kit/mcp_server/dist/context-server.js` returns healthy `memory_health` output with `provider: voyage`, `model: voyage-4`, and `dimension: 1024` (REQ-C05)
- [x] T031 Verify direct `handleMemoryIndexScan` for `02--system-spec-kit/022-hybrid-rag-fusion/013-memory-search-bug-fixes` completes with `failed: 0` (REQ-C05)
- [x] T032 Record the residual out-of-scope auth-failure diagnostic limitation honestly without re-opening runtime config scope
<!-- /ANCHOR:phase-d -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are complete.
- [x] Workflow-level seam coverage for stateless/file-backed config restoration and overlapping `runWorkflow()` serialization is recorded.
- [x] Preferred-task fallback no longer reselects `specTitle` in file-backed/JSON mode.
- [x] The stale-cache shrink follow-up fix and its regression coverage are recorded.
- [x] Future-dated cache invalidation on cached/discovered folder-set mismatch is recorded.
- [x] Alias-root order determinism integration coverage is recorded.
- [x] All workstreams are represented in one canonical Level 2 packet.
- [x] Cross-references use standard filenames only.
- [x] Full workspace build pass is documented accurately.
- [x] The final folder-discovery integration green state is documented without stale failure notes.
- [x] Closure memory is saved using the supported owning-root workflow, and packet docs are refreshed in memory indexing.
- [x] Auto-mode MCP runtime compatibility, parent-environment key sourcing, accurate lazy `memory_health` provider reporting, and fatal dimension-mismatch startup behavior are documented.
- [x] Direct built-runtime provider/dimension verification and packet indexing success are documented.
- [x] Residual out-of-scope auth-failure diagnostic limitation is documented honestly.
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

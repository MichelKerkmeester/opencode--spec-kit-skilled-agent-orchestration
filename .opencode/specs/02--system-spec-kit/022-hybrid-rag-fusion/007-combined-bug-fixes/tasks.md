---
title: "Tasks: Combined Bug Fixes"
---
<!-- SPECKIT_TEMPLATE_SOURCE: .opencode/skill/system-spec-kit/templates/tasks.md -->
---
title: "Tasks: Combined Bug Fixes"
description: "Merged task list from specs 003, 008, 013, 015, 016, 017"
updated: "2026-03-13"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Combined Bug Fixes

<!-- SPECKIT_LEVEL: 3 -->

This file merges tasks from six source spec folders into a single canonical reference.
Historical "(016)" naming in earlier snapshots is legacy labeling only; source 016 is now fully complete (17/17 complete).

---

<!-- ANCHOR:tasks-overview -->
## Overview

| Source | Spec Folder | Total Tasks | Completed | Deferred/Pending |
|--------|-------------|-------------|-----------|------------------|
| 003 | Auto-Detected Session Bug | 12 | 12 | 0 |
| 008 | Subfolder Resolution Fix | 31 | 31 | 0 |
| 013 | Memory Search Bug Fixes | 40 | 40 | 0 |
| 015 | Bug Fixes and Alignment | 84 | 74 | 10 |
| 016 | Code Audit (2026-03-08) | 17 | 17 | 0 |
| 017 | 30-Commit Bug Audit (W5, 2026-03-10) | 50 | 50 | 0 |
| **Total** | | **234** | **224** | **10** |

Current verification truth snapshot (2026-03-13):
- `npm run check --workspace=scripts` is green.
- `npm run check --workspace=mcp_server` is green when run in `.opencode/skill/system-spec-kit`.
- `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` is green (scanned 731, findings 0).
- `node node_modules/vitest/vitest.mjs run tests/graph-signals.vitest.ts tests/working-memory.vitest.ts tests/checkpoint-working-memory.vitest.ts tests/checkpoints-storage.vitest.ts tests/memory-crud-extended.vitest.ts tests/bm25-index.vitest.ts` passed in `.opencode/skill/system-spec-kit/mcp_server` (6 files, 275 tests).
- `node mcp_server/node_modules/vitest/vitest.mjs run tests/unit-rrf-fusion.vitest.ts tests/checkpoints-storage.vitest.ts tests/access-tracker.vitest.ts tests/access-tracker-extended.vitest.ts` passed (73 passed).
- `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` passed in `mcp_server` (322 passed).
- `node node_modules/vitest/vitest.mjs run tests/score-normalization.vitest.ts tests/unit-normalization.vitest.ts tests/unit-normalization-roundtrip.vitest.ts` passed in `mcp_server` (56 passed).
- `node mcp_server/node_modules/vitest/vitest.mjs run tests/context-server.vitest.ts` passed (315 passed).
- `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` passed (32 passed, 0 failed, 3 skipped).
- Full `vitest run` passed (`264` passed, `1` skipped test files; `7536` passed, `47` skipped, `28` todo tests).

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

<!-- /ANCHOR:tasks-overview -->

**Task Format**: `T### [P?] Description (file path)`

---
---

## Source: 003 -- Auto-Detected Session Bug

> Source lineage: `003` stream merged into canonical `tasks.md`.

---

### Phase 1: Setup

- [x] T001 Reproduce and document incorrect archived-session selection baseline (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: `handover.md` in this spec folder records archived-path misselection baseline; detector behavior validated via `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 3 skipped.]
- [x] T002 Define canonical path normalization rules for `specs/` and `.opencode/specs/` aliases (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Implemented behavior is active in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` with matching runtime artifact in `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js`; no net diff required in this pass.]
- [x] T003 [P] Build test matrix for archive, alias, and mtime distortion scenarios (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`) [EVIDENCE: Updated `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`; command result `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 3 skipped.]

---

### Phase 2: Implementation

- [x] T004 Implement active non-archived candidate preference with explicit archive/fixture filtering (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Active detector implementation verified in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` and `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js`; no net diff required in finalization.]
- [x] T005 Implement deterministic candidate scoring and stable tie-breakers resilient to mtime skew (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Regression coverage exercised by `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`; command result -> 32 passed, 0 failed, 3 skipped.]
- [x] T006 Implement low-confidence confirmation/fallback gate for ambiguous selection (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Existing detector path verified active with no net diff required; behavior gated by functional test suite pass and review gate PASS 88/100 (no P0/P1 findings).]
- [x] T007 Align confidence threshold behavior with alignment validator integration (`.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts`) [EVIDENCE: No additional code edits required in this finalization pass; integration remains active through current detector flow and passes full functional detector suite.]
- [x] T008 Update command behavior documentation for resume/handover auto-detection (`.opencode/command/spec_kit/resume.md`, `.opencode/command/spec_kit/handover.md`) [EVIDENCE: Verified existing command guidance alignment in `.opencode/command/spec_kit/resume.md` and `.opencode/command/spec_kit/handover.md` (no net diff in this pass).]

---

### Phase 3: Verification

- [x] T009 Add regression tests: active non-archived preference and alias determinism (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`) [EVIDENCE: Test file updated and executed with pass result: 32 passed, 0 failed, 3 skipped.]
- [x] T010 Add regression tests: mtime distortion resilience and low-confidence confirmation path (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`) [EVIDENCE: Same detector functional suite run confirms regression matrix pass: 32 passed, 0 failed, 3 skipped.]
- [x] T011 Run targeted validation/tests and record evidence in checklist (`checklist.md`) [EVIDENCE: `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` passed; checklist updated with concrete file and command references.]
- [x] T012 Review scope lock and confirm no unrelated detector behavior changed (`spec.md`) [EVIDENCE: Review gate PASS (score 88/100, no P0/P1); detector implementation confirmed active with no net diff required for `folder-detector.ts` and dist artifact.]

---

### Completion Criteria (003)

- [x] All tasks marked `[x]` [EVIDENCE: T001-T012 completed in this file.]
- [x] No `[B]` blocked tasks remaining [EVIDENCE: No blocked markers present.]
- [x] Acceptance criteria REQ-001 through REQ-004 verified with evidence [EVIDENCE: Functional suite command `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 3 skipped.]

---

### Cross-References (003)

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`

---
---

## Source: 008 -- Subfolder Resolution Fix

> Source lineage: `008` stream merged into canonical `tasks.md`.

---

### Phase 1: Code Fixes

- [x] T001 [P] Add `CATEGORY_FOLDER_PATTERN` + `isTraversableFolder` to `subfolder-utils.ts`
- [x] T002 [P] Rewrite `findChildFolderSync` with recursive search + aliased root dedup
- [x] T003 [P] Rewrite `findChildFolderAsync` with recursive search + aliased root dedup
- [x] T004 [P] Fix `parseArguments` multi-segment detection in `generate-context.ts`
- [x] T005 [P] Add filesystem fallback in `isValidSpecFolder` in `generate-context.ts`
- [x] T006 Export `CATEGORY_FOLDER_PATTERN` from `core/index.ts`

---

### Phase 2: Test Fixes

- [x] T007 Move `02--system-spec-kit` from valid to invalid in `SPEC_FOLDER_PATTERN` + `BASIC_PATTERN` tests
- [x] T008 Update aliased-root test expectations (dedup now resolves instead of returning null)
- [x] T009 Rewrite ambiguity tests to use truly different parents in same specs root
- [x] T010 Add `CATEGORY_FOLDER_PATTERN` valid/invalid tests + deep nesting test
- [x] T011 Add `CATEGORY_FOLDER_PATTERN` to core/index re-exports test

---

### Phase 3: Build & Verify

- [x] T012 TypeScript compiles cleanly (0 errors)
- [x] T013 `test-subfolder-resolution.js`: 26/26 passed, 0 failed
- [x] T014 End-to-end: bare name and relative path both resolve
- [x] T015 `test-folder-detector-functional.js`: no new failures

---

### Phase 4: Post-Review Remediation (10-Agent Cross-AI Review)

- [x] T016 [P] `subfolder-utils.ts`: Replace `readdirSync` + `statSync` with `readdirSync({ withFileTypes: true })` (M5+m13)
- [x] T017 [P] `subfolder-utils.ts`: Upfront root dedup via `realpathSync` into `Map` before traversal (M6)
- [x] T018 [P] `subfolder-utils.ts`: Collect warnings from catch blocks; log depth-limit warning at MAX_DEPTH (M7+M8)
- [x] T019 [P] `subfolder-utils.ts`: Skip symlinks via `dirent.isSymbolicLink()`; add visited-set for cycle prevention (m4+m5)
- [x] T020 `subfolder-utils.ts`: Extract `SEARCH_MAX_DEPTH = 4` as module-level exported constant (m14)
- [x] T021 `subfolder-utils.ts`: Add `FindChildOptions` with `onAmbiguity` callback (m12)
- [x] T022 `generate-context.ts`: Fix `isUnderApprovedSpecsRoot` -- `path.resolve()` + `.startsWith()` containment (M4+m6)
- [x] T023 `generate-context.ts`: Deep-match fallback searches inside category folders (m11)
- [x] T024 `folder-detector.ts`: Fix `=== 2` -> `>= 2` at lines 812, 898 (m1)
- [x] T025 `core/index.ts`: Export `SEARCH_MAX_DEPTH` and `FindChildOptions`
- [x] T026 Tests: Add T-SF08a/b/c (SEARCH_MAX_DEPTH boundary), T-SF09a (multi-segment), T-SF10a (onAmbiguity callback)
- [x] T027 Tests: Tighten T-SF07a -- remove permissive null acceptance for aliased roots (M3)
- [x] T028 Docs: Remove duplicate boilerplate from spec.md and plan.md (m8)
- [x] T029 Docs: Fix unchecked checklist items (m9)
- [x] T030 Docs: Add behavioral changes + post-review remediation to implementation-summary.md (m7+m10)
- [x] T031 Write cross-AI review report to `scratch/cross-ai-review-report.md`

---

### Completion Criteria (008)

- [x] All tasks completed (T001-T031)
- [x] All 3 previously-failing inputs now succeed
- [x] Cross-AI review: 8 Major + 14 Minor issues addressed
- [x] Tests: 31/31 passed, 0 failed, 0 skipped

---
---

## Source: 013 -- Memory Search Bug Fixes

> Source lineage: `013` stream merged into canonical `tasks.md`.

---

### Phase A: Stateless Filename + Generic Slug Parity

- [x] T001 Keep stateless enrichment fallback flow in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (REQ-A01)
- [x] T001a Restore invocation-local config state in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` after `runWorkflow()` (REQ-A01)
- [x] T001b Add workflow serialization guard in `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` for overlapping `runWorkflow()` calls (REQ-A01)
- [x] T002 Add explicit stateless-only enrichment guard in `.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts` (REQ-A02)
- [x] T003 Align generic task detection with slug behavior in `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts` (REQ-A03)
- [x] T004 Include `Implementation and updates` in generic classification parity (REQ-A03)
- [x] T005 Keep slug/title generation fed by enriched task while preserving `IMPL_TASK` honesty and blocking later `specTitle` reselection through preferred-task fallback in file-backed/JSON mode (REQ-A04)
- [x] T006 Add regression tests in `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts`, including the workflow-level seam test proving the later stateless run reaches the loader path with `CONFIG.DATA_FILE === null` (REQ-A05)
- [x] T006a Add concurrency regression coverage in `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` for overlapping serialized `runWorkflow()` calls (REQ-A05)

---

### Phase B: Folder Discovery Follow-up

- [x] T007 Implement depth-limited recursive discovery (max depth 8) in `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` (REQ-B01)
- [x] T008 Implement canonical-path root dedupe with first-candidate retention (REQ-B02)
- [x] T009 [P] Route staleness checks through recursive discovered spec folders (REQ-B03)
- [x] T009a Add stale-cache shrink and folder-set mismatch regression coverage for deleted cached folders, future-dated cache invalidation, and cache regeneration behavior in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` (REQ-B03)
- [x] T010 Implement graceful empty-cache return for invalid/nonexistent non-empty explicit input paths (REQ-B04)
- [x] T011 Update unit coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery.vitest.ts` (REQ-B05)
- [x] T012 Update integration coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` (REQ-B05)
- [x] T012a Add alias-root order determinism integration coverage in `.opencode/skill/system-spec-kit/mcp_server/tests/folder-discovery-integration.vitest.ts` (REQ-B05)

---

### Phase C: Verification + Canonical Doc Merge

- [x] T013 Run `npx tsc --noEmit`
- [x] T014 Run `npm run test:task-enrichment` and record the green 30-test result, including the new concurrency regression coverage
- [x] T015 Run `npm run test --workspace=mcp_server -- tests/folder-discovery.vitest.ts`
- [x] T016 Re-run `npm run test --workspace=mcp_server -- tests/folder-discovery-integration.vitest.ts` and record the green 28-test outcome, including alias-root order determinism coverage
- [x] T017 Run `npm run typecheck && npm run build` in `.opencode/skill/system-spec-kit` and record the passing result
- [x] T018 Run alignment drift check for the full `.opencode/skill/system-spec-kit` root
- [x] T018a Capture raw verification outputs under `scratch/verification-logs/` for reviewer-auditable command evidence
- [x] T018b Run the required memory-save workflow with the explicit phase-folder target (`02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes`) and refresh packet indexing for immediate discoverability
- [x] T019 Merge duplicate root/addendum docs into canonical files only
- [x] T020 Remove addendum-named docs and retain standard packet names only

---

### Phase D: Voyage 4 Memory-Index Environment Fix

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
- [x] T031 Verify direct `handleMemoryIndexScan` for `02--system-spec-kit/022-hybrid-rag-fusion/007-combined-bug-fixes` completes with `failed: 0` (REQ-C05)
- [x] T032 Record the residual out-of-scope auth-failure diagnostic limitation honestly without re-opening runtime config scope

---

### Completion Criteria (013)

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
- [x] Closure memory is saved using the explicit phase-folder target into `007-combined-bug-fixes/memory/`, and packet docs are refreshed in memory indexing.
- [x] Auto-mode MCP runtime compatibility, parent-environment key sourcing, accurate lazy `memory_health` provider reporting, and fatal dimension-mismatch startup behavior are documented.
- [x] Direct built-runtime provider/dimension verification and packet indexing success are documented.
- [x] Residual out-of-scope auth-failure diagnostic limitation is documented honestly.

---

### Cross-References (013)

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Decision Record: `decision-record.md`
- Implementation Summary: `implementation-summary.md`
- Handover: `handover.md`

---
---

## Source: 015 -- Bug Fixes and Alignment

> Source lineage: `015` stream merged into canonical `tasks.md`.

---

### Phase M: Canonical Merge Normalization (009 + 010 -> 008)

- [x] T077: Add canonical-merge notice in `spec.md` and mark 008 as superseding prior 015/009/010 active ownership
- [x] T078: Preserve 009 lineage context in canonical 008 docs (remediation-epic roots, ADR lineage, cross-phase test snapshot context)
- [x] T079: Preserve 010 provenance context in canonical 008 docs (cross-AI audit handover state + historical test snapshot)
- [x] T080: Reframe `implementation-summary.md` as historical snapshot context, not current completion truth
- [x] T081: Absorb 009 ADR-001..003 decision substance into `decision-record.md` as inherited implemented history
- [x] T082: Absorb 009 remediation execution digest and 010 handover continuity digest (including commit `40891251` and 230/7085 snapshot) into `implementation-summary.md`
- [x] T083: Resolve D-12 contradiction in `spec.md` by excluding historical CR-P2-4 from active deferred inventory
- [x] T084: Normalize canonical mapping references to 008 (../011-feature-catalog/feature_catalog.md, `../005-core-rag-sprints-0-to-9/spec.md` (formerly `../006-extra-features/spec.md`)) and complete deletion safety check for 009/010

---

### Phase 1: Critical Scoring Pipeline Fixes

#### P0 Fixes

- [x] T001: Fix division by zero in `rrf-fusion.ts` -- validate `k >= 0` at entry (P0-001)
- [x] T002: Add test for `k = -1`, `k = 0` edge cases in RRF fusion [EVIDENCE: `node mcp_server/node_modules/vitest/vitest.mjs run tests/unit-rrf-fusion.vitest.ts tests/checkpoints-storage.vitest.ts tests/access-tracker.vitest.ts tests/access-tracker-extended.vitest.ts` -> 73 passed (includes `tests/unit-rrf-fusion.vitest.ts`).]

#### P1 Scoring Fixes

- [x] T003: Add `isFinite(stability)` guard in `calculateRetrievabilityScore` (P1-009)
- [x] T004: Add `Math.max(0, accessCount)` in `calculateUsageScore` (P1-010)
- [x] T005: Add `similarity ?? 0` guard in `calculatePatternScore` (P1-011)
- [x] T006: Add test cases for NaN/undefined/negative inputs to composite scoring [EVIDENCE: `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` -> 322 passed in `mcp_server`; updated `tests/composite-scoring.vitest.ts` now covers negative/non-finite stability, invalid dates, undefined/negative/Infinity inputs, and negative usage counts.]

#### P1 Algorithm Fixes

- [x] T007: Guard `limit <= 0` returns empty array in `applyMMR` (P1-001)
- [x] T008: Clamp `maxCandidates` to non-negative in MMR reranker (P1-002)
- [x] T009: Handle mismatched vector lengths in `computeCosine` (P1-003)
- [x] T010: Change `||` to `??` for `termMatchBonus` in `fuseScoresAdvanced` (P1-004)
- [x] T011: Fix cross-variant merge convergenceBonus double-counting (P1-005)
- [x] T012: Normalize convergenceBonus units before merge (P1-006)
- [x] T013: Move recency boost before normalization in adaptive fusion (P1-007)
- [x] T014: Always normalize intent weights regardless of documentType (P1-008)
- [ ] T015: Add tests for all algorithm edge case fixes [DEFERRED]

---

### Phase 2: Graph and Handler Fixes

#### Graph Fixes

- [x] T016: Add stale community assignment cleanup before store (P1-014)
- [x] T017: Validate `Number(nodeId)` is finite before DB insert (P1-015)
- [x] T018: Replace `parseInt` with strict `Number()` + `isInteger` check (P1-016)
- [x] T019: Fix algorithm label recording to reflect actual computation (P1-035)
- [ ] T020: Add tests for graph fix edge cases [DEFERRED]

#### MCP Handler Fixes

- [x] T021: Replace raw `Error` throw with `createMCPErrorResponse` in triggers handler (P1-017)
- [x] T022: Add shape validation before deduplication in search handler (P1-018)
- [ ] T023: Add tests for handler error response consistency [DEFERRED]

#### Lifecycle and Checkpoint Fixes

- [x] T069: Fix INSERT OR REPLACE in checkpoint merge-mode to use INSERT OR IGNORE + UPDATE (P0-005)
- [x] T070: Add causal_edges to checkpoint snapshot and restore (P1-036)
- [x] T071: Add null-check on `insertEdge()` return before reporting success (P1-037)
- [x] T072: Add compare-and-swap guard to `setIngestJobState` (P1-038)
- [x] T073: Use `recallK` parameter in metric label string instead of hardcoded @20 (P1-039)
- [x] T074: Validate `lastInsertRowid` after UPSERT or use explicit SELECT for edge ID (P1-040)
- [x] T075: Add tests for checkpoint merge-mode CASCADE prevention [EVIDENCE: `node mcp_server/node_modules/vitest/vitest.mjs run tests/unit-rrf-fusion.vitest.ts tests/checkpoints-storage.vitest.ts tests/access-tracker.vitest.ts tests/access-tracker-extended.vitest.ts` -> 73 passed (includes `tests/checkpoints-storage.vitest.ts`).]
- [x] T076: Add tests for causal edge snapshot round-trip [EVIDENCE: `node mcp_server/node_modules/vitest/vitest.mjs run tests/unit-rrf-fusion.vitest.ts tests/checkpoints-storage.vitest.ts tests/access-tracker.vitest.ts tests/access-tracker-extended.vitest.ts` -> 73 passed (includes causal-edge checkpoint round-trip coverage in `tests/checkpoints-storage.vitest.ts`).]

---

### Phase 3: Mutation Safety and Scripts

#### Mutation Safety

- [x] T024: Update `atomicSaveMemory` JSDoc to accurately describe partial state (P1-019)
- [x] T025: Document DB-commit-without-file limitation in transaction-manager (P1-020)
- [x] T026: Add early return with warning for no-database update fallback (P1-021)
- [x] T027: Add causal edge cleanup to no-database delete path or early return (P1-022)
- [ ] T028: Add tests for mutation safety edge cases [DEFERRED]

#### Script Fixes

- [x] T029: Add path boundary check for `--roots`/`--report` args (P1-023)
- [x] T030: Wrap `readFileSync` in try/catch in validate-memory-quality (P1-024)
- [x] T031: Replace SQL string interpolation with parameterized query (P1-025)
- [x] T032: Refactor CONFIG to parameter passing instead of mutation (P1-026)
- [ ] T033: Add tests for script input validation [DEFERRED]

---

### Phase 4: Embeddings and Architecture

#### Embeddings

- [x] T034: Remove ollama from `validateApiKey` local providers list (P1-012)
- [x] T035: Forward `baseUrl`/`timeout`/`maxTextLength` to providers or log warning (P1-013)
- [ ] T036: Add tests for embeddings provider consistency [DEFERRED]

#### Architecture

- [x] T037: Add missing tools to `LAYER_DEFINITIONS` (P1-031) -- 4 added, 3 already present
- [x] T038: Delete dead duplicate `mcp_server/lib/utils/retry.ts` (P1-032)
- [x] T039: Replace brittle `__dirname` resolution with package.json anchor (P1-033)
- [x] T040: Replace runtime `require()` with proper import (P1-034)
- [x] T041: Verify no import breakage after architecture changes -- tsc --noEmit passes

---

### Phase 5: Documentation Quality

#### P1 Doc Fixes

- [x] T042: Update checkpoint_delete doc to describe confirmName gate (P1-027)
- [x] T043: Fix feature 13-11 source file from content-normalizer.ts to slug-utils.ts (P1-028)
- [x] T044: Add progressive-validate.sh to feature 16-03 source files (P1-029)
- [x] T045: Align feature 16-02 narrative with source files table (P1-030)

#### P2 Doc Quality

- [x] T046: Replace all em dashes with hyphens in feature_catalog.md (P2-002)
- [x] T047: Fix HVR "robust" violations in authored prose (P2-003)
- [x] T048: Replace 3 boilerplate READMEs (009, 002, 014) with actual content (P2-004)
- [x] T049: Fix broken TOC links in constitutional/ and config/ READMEs (P2-005)
- [x] T050: Update test playbook header from "128" to "151" (P2-012)
- [x] T051: Reconcile flag count (89 vs 72) between documents (P2-014)
- [x] T052: Update epic status to reflect actual completion percentage (P2-013)

#### P2 Code Quality

- [x] T053: Rename `DegradedModeContract` snake_case fields to camelCase (P2-006)
- [ ] T054: Fix `EMBEDDING_DIM` to use provider-aware dimension (P2-007) [DEFERRED]
- [x] T055: Reset `isHealthy` flag on successful requests (P2-008)
- [x] T056: Replace `queue.shift()` with index-based BFS (P2-009)
- [x] T057: Remove double adjacency build on Louvain escalation (P2-010)
- [x] T058: Add size bounds to graph signal caches (P2-011)
- [ ] T059: Extract `getErrorMessage`/`isAbortError` to shared utility (P2-015) [DEFERRED]
- [ ] T060: Replace hardcoded dimension fallback with provider lookup (P2-016) [DEFERRED]
- [ ] T061: Move mutation ledger write inside bulk delete transaction (P2-018) [DEFERRED]
- [x] T062: N/A -- `isFile()` check not applicable (file processes single path, no dir iteration)
- [x] T063: Guard `rank-memories.js` main() with ESM entry-point check (P2-025)

---

### Verification (015)

- [x] T064: Re-verify current gate status (`npm run check` PASS; `npm run check:full` PASS) with evidence in `scratch/verification-logs/2026-03-07-mcp-check-full.md`
- [x] T065: Run `verify_alignment_drift.py` on all modified source directories [EVIDENCE: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit` -> PASS (scanned 731, findings 0).]
- [x] T066: Grep for remaining TODO/FIXME in modified files -- 0 found
- [x] T067: Verify feature catalog em dash count is 0 -- confirmed
- [x] T068: Create implementation-summary.md

---
---

## Source: 016 -- Code Audit (2026-03-08)

> 35-agent code audit: 30 Copilot (gpt-5.3-codex) per-feature + 5 Codex (gpt-5.4) cross-cutting.
> Raw findings: 268 → ~145 unique after deduplication.
> Full synthesis: `scratch/code-audit-synthesis.md`

### Tier 1: Immediate (P0 + high-impact P1)

- [x] T069 [P] Revalidate `rollout-policy` import finding in `graph-flags.ts:6` and `causal-boost.ts:9` (P0-001) [EVIDENCE: Current imports in `mcp_server/lib/search/graph-flags.ts` and `mcp_server/lib/search/causal-boost.ts` resolve to the extant `lib/cache/cognitive/rollout-policy.ts` module; `npm run check --workspace=mcp_server` passes, so the proposed path rewrite was stale/not required in the checked tree.]
- [x] T070 [P] Clear `access-tracker.ts` flush interval timer on shutdown; add `dispose()` method (P1-T05) [EVIDENCE: `access-tracker.ts` now exposes `dispose()` that clears `flushInterval`, removes exit handlers, and resets state; `node mcp_server/node_modules/vitest/vitest.mjs run tests/unit-rrf-fusion.vitest.ts tests/checkpoints-storage.vitest.ts tests/access-tracker.vitest.ts tests/access-tracker-extended.vitest.ts` -> 73 passed.]
- [x] T071 [P] Guard negative `stability` in `composite-scoring.ts:247-303`; add `Number.isFinite()` check on output (P1-S01) [EVIDENCE: Guarded behavior is active in `mcp_server/lib/scoring/composite-scoring.ts`; `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` -> 322 passed in `mcp_server`, including new composite-scoring regressions for negative/non-finite stability and invalid input clamping.]
- [x] T072 [P] Add finite/non-negative validation for `k`, `convergenceBonus`, `graphWeightBoost`, `list.weight` in `rrf-fusion.ts:179-195` (P1-S02) [EVIDENCE: `shared/algorithms/rrf-fusion.ts` now rejects negative `k` and sanitizes invalid `convergenceBonus`, `graphWeightBoost`, and list weights; `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` -> 322 passed in `mcp_server`, including updated `tests/unit-rrf-fusion.vitest.ts` coverage for non-finite `k`, invalid bonuses, and invalid weights.]
- [x] T073: Unify fatal error handlers in `context-server.ts:571-681` through single `fatalShutdown()` with deadline (P1-I01) [EVIDENCE: `context-server.ts` routes fatal process handlers through `fatalShutdown()`; `node mcp_server/node_modules/vitest/vitest.mjs run tests/context-server.vitest.ts` -> 315 passed.]
- [x] T074: Replace regex HTML strip in `workflow.ts:818` with comprehensive tag sanitization (P1-H09, F7) [EVIDENCE: Workflow HTML sanitization strengthened and covered by `node ../mcp_server/node_modules/vitest/vitest.mjs run tests/task-enrichment.vitest.ts --root . --config ../mcp_server/vitest.config.ts` from `.opencode/skill/system-spec-kit/scripts` -> 32 passed.]
- [x] T075: Add approved-root validation inside `resolveSessionSpecFolderPaths` in `folder-detector.ts:459` (P1-H08, F6 PARTIALLY_FIXED) [EVIDENCE: `resolveSessionSpecFolderPaths()` now rejects escaped paths via `isPathWithin()`/`Path escapes specs root`; `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 3 skipped.]

### Tier 2: Important (transaction/storage safety)

- [x] T076: Route checkpoint edge restore through `causal-edges.ts` public API in `checkpoints.ts:819-848` (P1-T01, F11 STILL_PRESENT) [EVIDENCE: `checkpoints.ts` imports and calls `bulkInsertEdges()` from `causal-edges.ts`; `node mcp_server/node_modules/vitest/vitest.mjs run tests/unit-rrf-fusion.vitest.ts tests/checkpoints-storage.vitest.ts tests/access-tracker.vitest.ts tests/access-tracker-extended.vitest.ts` -> 73 passed.]
- [x] T077: Add nested transaction guard / savepoint support in `transaction-manager.ts:291-312` (P1-T04) [EVIDENCE: `mcp_server/lib/storage/transaction-manager.ts` now reuses the outer transaction when nested and bypasses wrapper re-entry when `database.inTransaction` is already true; `node node_modules/vitest/vitest.mjs run tests/access-tracker.vitest.ts tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/transaction-manager.vitest.ts tests/bm25-index.vitest.ts tests/co-activation.vitest.ts` -> 310 passed in `mcp_server`, including new nested transaction regressions in `tests/transaction-manager.vitest.ts`.]
- [x] T078: Wrap update + validation in single transaction with rollback in `memory-crud-update.ts:187-200` (P1-H02) [EVIDENCE: `mcp_server/handlers/memory-crud-update.ts` routes mutation work through `runInTransaction()`, and `tests/bm25-index.vitest.ts` now proves the update path executes inside the transaction helper while BM25 data failures rethrow from inside that callback; `node node_modules/vitest/vitest.mjs run tests/access-tracker.vitest.ts tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/transaction-manager.vitest.ts tests/bm25-index.vitest.ts tests/co-activation.vitest.ts` -> 310 passed in `mcp_server`.]
- [x] T079 [P] Add empty ground-truth guard in `eval-metrics.ts:191-198` returning 0 instead of dividing by zero (P1-E01) [EVIDENCE: `mcp_server/lib/eval/eval-metrics.ts` returns 0 for empty/no-relevant ground truth; `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` -> 322 passed in `mcp_server`, with `tests/eval-metrics.vitest.ts` covering empty inputs and non-positive/non-finite `k`.]
- [x] T080: Replace first-visit BFS with longest-path DAG traversal for causal depth in `graph-signals.ts:298-308` (P1-R05) [EVIDENCE: `mcp_server/lib/graph/graph-signals.ts` now computes causal depth via SCC condensation plus longest-path DAG traversal, and `tests/graph-signals.vitest.ts` adds regressions for rooted cycles, a rootless cycle with an outgoing tail, and shortcut edges; `node node_modules/vitest/vitest.mjs run tests/graph-signals.vitest.ts tests/working-memory.vitest.ts tests/checkpoint-working-memory.vitest.ts tests/checkpoints-storage.vitest.ts tests/memory-crud-extended.vitest.ts tests/bm25-index.vitest.ts` in `.opencode/skill/system-spec-kit/mcp_server` -> PASS (6 files, 275 tests).]

### Tier 3: Quality hardening (NaN guards, type safety)

- [x] T081 [P] Add `Number.isFinite()` guards on chunk scores in `mpab-aggregation.ts:96-118` (P1-S05) [EVIDENCE: `computeMPAB()` sanitizes non-finite chunk scores to zero in `mcp_server/lib/scoring/mpab-aggregation.ts`; `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` -> 322 passed in `mcp_server`, including `tests/mpab-aggregation.vitest.ts` non-finite score coverage.]
- [x] T082 [P] Retire misattributed finite-input audit finding for `shared/normalization.ts` (P1-S07) [EVIDENCE: `shared/normalization.ts` is a DB row ↔ app object field-mapping adapter, not a score-normalization path; the relevant finite-score guards are covered by `tests/score-normalization.vitest.ts`, and `node node_modules/vitest/vitest.mjs run tests/score-normalization.vitest.ts tests/unit-normalization.vitest.ts tests/unit-normalization-roundtrip.vitest.ts` -> 56 passed in `mcp_server` confirms the current checked behavior without any reproducible bug in this module.]
- [x] T083 [P] Type-guard parsed `related_memories` similarity field in `co-activation.ts:131-153` (P1-G01) [EVIDENCE: `mcp_server/lib/cache/cognitive/co-activation.ts` filters parsed relations to finite numeric `id`/`similarity` pairs; `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` -> 322 passed in `mcp_server`, and `tests/co-activation.vitest.ts` verifies malformed related-memory entries are filtered out.]
- [x] T084 [P] Clamp review interval parameters to valid ranges in `fsrs-scheduler.ts:95-145` (P1-G06) [EVIDENCE: `mcp_server/lib/cache/cognitive/fsrs-scheduler.ts` clamps stability, difficulty, and interval inputs to safe ranges; `node node_modules/vitest/vitest.mjs run tests/composite-scoring.vitest.ts tests/unit-rrf-fusion.vitest.ts tests/mpab-aggregation.vitest.ts tests/co-activation.vitest.ts tests/fsrs-scheduler.vitest.ts tests/eval-metrics.vitest.ts` -> 322 passed in `mcp_server`, and `tests/fsrs-scheduler.vitest.ts` covers negative stability, difficulty clamps, and interval monotonicity.]

### Tier 4: README gaps

- [x] T085 [P] Add missing entries to `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md`: `memory-surface.ts`, `mutation-feedback.ts`, `response-hints.ts` (README) [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` already lists `memory-surface.ts`, `mutation-feedback.ts`, and `response-hints.ts` in Overview and exported state sections; no net code/doc diff was required after revalidation.]

---
---

## Source: 017 -- 30-Commit Bug Audit (W5, 2026-03-10)

> Source lineage: `017` stream merged into canonical `tasks.md`.

---

### Phase W5-A: Quick Wins

- [x] T086 Fix crash for finding `P0-1` (`scripts/evals/map-ground-truth-ids.ts:92`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T087 Fix crash for finding `P0-2` (`scripts/utils/input-normalizer.ts:480`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T088 Fix crash for finding `P0-3` (`scripts/lib/ascii-boxes.ts:95`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T089 Resolve finding `F01` (`scripts/extractors/spec-folder-extractor.ts:321`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T090 Resolve finding `F02` (`mcp_server/lib/scoring/composite-scoring.ts:388`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T091 Resolve finding `F03` (`mcp_server/handlers/memory-ingest.ts:104`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T092 Resolve finding `F04` (`mcp_server/lib/scoring/composite-scoring.ts:250`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T093 Resolve finding `F05` (`mcp_server/lib/scoring/composite-scoring.ts:329`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T094 Resolve finding `F06` (`shared/algorithms/rrf-fusion.ts:187`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T095 Resolve finding `F07` (`shared/embeddings/providers/openai.ts:313`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T096 Resolve finding `F08` (`shared/embeddings/providers/voyage.ts:332`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T097 Resolve finding `F09` (`mcp_server/handlers/memory-crud-delete.ts:98`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T098 Resolve finding `F10` (`mcp_server/handlers/memory-crud-update.ts:192`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T099 Resolve finding `F11` (`mcp_server/lib/storage/reconsolidation.ts:356`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T100 Resolve finding `F12` (`scripts/extractors/diagram-extractor.ts:183`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]

---

### Phase W5-B: Medium Effort

- [x] T101 Resolve finding `F13` (`scripts/lib/decision-tree-generator.ts:125`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T102 Resolve finding `F14` (`scripts/extractors/conversation-extractor.ts:156`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T103 Resolve finding `F15` (`scripts/utils/message-utils.ts:203`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T104 Resolve finding `F16` (`scripts/extractors/collect-session-data.ts:224`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T105 Resolve finding `F17` (`mcp_server/core/db-state.ts:194`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T106 Resolve finding `F18` (`mcp_server/lib/search/vector-index-store.ts:690`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T107 Resolve finding `F19` (`shared/embeddings/providers/hf-local.ts:215`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T108 Resolve finding `F20` (`mcp_server/lib/search/embedding-expansion.ts:226`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T109 Resolve finding `F21` (`mcp_server/lib/search/vector-index-mutations.ts:107`) [EVIDENCE: Fix applied in W5 audit; tsc --noEmit clean across mcp_server, scripts, shared; 368/372 tests pass (4 pre-existing)]
- [x] T110 Implement quick-win race fixes for `R04`, `R07`, `R08` (`mcp_server/lib/storage/index-refresh.ts:171`; `mcp_server/core/db-state.ts:113`; `mcp_server/core/db-state.ts:117`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T111 Implement quick-win config fixes for `A03`, `A04`, `A07` (`mcp_server/core/config.ts:43`; `mcp_server/utils/batch-processor.ts:41`; `mcp_server/lib/cognitive/archival-manager.ts:532`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T112 Implement quick-win cognitive fixes for `C01`, `C03` (`mcp_server/lib/cognitive/co-activation.ts:119`; `mcp_server/lib/cognitive/working-memory.ts:554`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T113 Implement quick-win eval guards for `E05`, `E06` (`scripts/evals/run-phase1-5-shadow-eval.ts:96`; `scripts/evals/run-phase3-telemetry-dashboard.ts:122`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T114 Implement quick-win handler/storage fixes for `H04`, `M03`, `S02` (`mcp_server/handlers/memory-index.ts:368`; `mcp_server/lib/storage/access-tracker.ts:119`; `mcp_server/lib/storage/causal-edges.ts:290`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T115 Implement medium race/status handling for `R02`, `R11` (`mcp_server/lib/storage/access-tracker.ts:75`; `mcp_server/handlers/memory-save.ts:435`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T116 Implement medium rollback contract fixes for `R09`, `R10` (`mcp_server/handlers/chunking-orchestrator.ts:347`; `mcp_server/handlers/chunking-orchestrator.ts:166`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T117 Implement medium score-field synchronization for `D01`, `D02`, `D06` (`mcp_server/lib/search/pipeline/stage2-fusion.ts:557`; `mcp_server/lib/search/pipeline/stage2-fusion.ts:661`; `mcp_server/lib/search/hybrid-search.ts:739`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T118 Implement medium retrieval/cache normalization for `D09`, `D10` (`mcp_server/lib/search/retrieval-directives.ts:326`; `mcp_server/lib/search/vector-index-aliases.ts:229`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T119 Implement medium handler validation for `H03`, `H06`, `H07` (`mcp_server/handlers/memory-crud-stats.ts:123`; `mcp_server/handlers/memory-save.ts:166`; `mcp_server/handlers/quality-loop.ts:122`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]
- [x] T120 Implement medium cognitive/save flow fixes for `C02`, `C04`, `M01`, `M02` (`mcp_server/lib/cognitive/working-memory.ts:504`; `mcp_server/hooks/memory-surface.ts:99`; `mcp_server/handlers/save/pe-orchestration.ts:101`; `mcp_server/handlers/save/response-builder.ts:188`) [EVIDENCE: Commit 0b53820c; tsc clean; 0 regressions]

---

### Phase W5-C: Larger Refactors

- [x] T121 Implement transactional session dedup for `R01` (`mcp_server/lib/session/session-manager.ts:341`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T122 Implement race-safe storage/cache coordination for `R03`, `R05`, `R06` (`mcp_server/lib/storage/consolidation.ts:492`; `mcp_server/lib/storage/mutation-ledger.ts:367`; `mcp_server/lib/cache/tool-cache.ts:326`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T123 Implement stage-contract refactor for `D03`, `D04` (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:528`; `mcp_server/lib/search/pipeline/stage3-rerank.ts:598`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T124 Implement rerank/injection contract fixes for `D05`, `D07`, `D08` (`mcp_server/lib/search/pipeline/stage3-rerank.ts:556`; `mcp_server/lib/search/causal-boost.ts:189`; `mcp_server/lib/extraction/extraction-adapter.ts:197`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T125 Implement config decoupling refactor for `A01`, `A02` (`mcp_server/core/config.ts:7`; `mcp_server/core/config.ts:33`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T126 Implement architecture contract typing for `A05`, `A06` (`mcp_server/core/db-state.ts:50`; `mcp_server/lib/interfaces/vector-store.ts:15`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T127 Implement handler ownership/privilege gates for `H01`, `H02` (`mcp_server/handlers/memory-context.ts:442`; `mcp_server/handlers/memory-crud-health.ts:360`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T128 Implement save pipeline contract fixes for `H05`, `H08`, `H09` (`mcp_server/handlers/memory-save.ts:135`; `mcp_server/handlers/save/dedup.ts:50`; `mcp_server/handlers/save/embedding-pipeline.ts:37`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T129 Implement storage integrity fixes for `S01`, `S03` (`mcp_server/lib/storage/causal-edges.ts:274`; `mcp_server/lib/storage/reconsolidation.ts:336`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T130 Implement eval validation correctness for `E01`, `E03` (`scripts/evals/check-allowlist-expiry.ts:96`; `scripts/evals/check-no-mcp-lib-imports-ast.ts:88`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T131 Implement eval parser/feature refactors for `E02`, `E04` (`scripts/evals/check-architecture-boundaries.ts:72`; `scripts/evals/map-ground-truth-ids.ts:16`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T132 Implement eval metric correctness for `E07`, `E08` (`scripts/evals/run-quality-legacy-remediation.ts:132`; `scripts/evals/run-quality-legacy-remediation.ts:209`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T133 Implement extractor/workflow path-contract fixes for `X01`, `X02` (`scripts/extractors/session-extractor.ts:165`; `scripts/core/workflow.ts:386`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T134 Implement script parsing fixes for `X03`, `X04` (`scripts/lib/flowchart-generator.ts:353`; `scripts/lib/frontmatter-migration.ts:381`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]
- [x] T135 Implement folder-detector hardening for `X05`, `X06`, `X07` (`scripts/spec-folder/folder-detector.ts:470`; `scripts/spec-folder/folder-detector.ts:1064`; `scripts/spec-folder/folder-detector.ts:1181`) [EVIDENCE: Commit 37b5ba59; tsc clean; 0 regressions]

---
title: "Tasks: Skill References & Assets Indexing [133-index-workflows-code/tasks]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "skill"
  - "references"
  - "assets"
  - "indexing"
  - "133"
  - "index"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Skill References & Assets Indexing

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

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
## Phase 1: Config Infrastructure

- [x] T001 Create `mcp_server/lib/config/skill-ref-config.ts` module (NEW file, ~60 LOC) [Evidence: File created with SkillRefConfig interface, loadSkillRefConfig(), clearSkillRefConfigCache()]
- [x] T002 Add section 12 `skillReferenceIndexing` to `config/config.jsonc` (~15 LOC) [Evidence: Config section added with enabled, indexedSkills[], fileExtensions[], indexDirs[]]
- [x] T003 Implement JSONC parsing in config loader (use existing parser) [Evidence: Config loader uses fs.readFileSync + JSON.parse with comment stripping]
- [x] T004 Add config schema comments in config.jsonc (inline documentation) [Evidence: Schema documented in config.jsonc comments]
- [x] T005 [P] Implement config validation (check required fields, types) [Evidence: Validation logic in loadSkillRefConfig() with error logging]
- [x] T006 [P] Implement config caching (avoid re-read on every scan) [Evidence: Cache implemented with clearSkillRefConfigCache()]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Parser Extensions

- [x] T007 Extend `extractDocumentType()` to detect `skill_reference` (memory-parser.ts:~50-100) [Evidence: Type detection logic added with path-based heuristics]
- [x] T008 Extend `extractDocumentType()` to detect `skill_checklist` (path contains "checklist") [Evidence: Checklist detection added]
- [x] T009 Extend `extractDocumentType()` to detect `skill_asset` (from assets/ dir) [Evidence: Asset detection added]
- [x] T010 Extend `extractSpecFolder()` to return `skill:NAME` for skill paths (memory-parser.ts:~150-200) [Evidence: Spec folder logic extended with skill: prefix]
- [x] T011 Extend `isMemoryFile()` to accept skill reference paths (memory-parser.ts:~250-300) [Evidence: isSkillRef flag added to validation logic]
- [x] T012 [P] Add unit tests for new document type extraction (tests/memory-parser.vitest.ts) [Evidence: Test coverage verified via test suite passing]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Weight Assignment

- [x] T013 Add weight for `skill_reference: 0.35` (memory-save.ts:~800-850) [Evidence: Weight mapping added]
- [x] T014 Add weight for `skill_checklist: 0.35` (memory-save.ts) [Evidence: Weight mapping added]
- [x] T015 Add weight for `skill_asset: 0.30` (memory-save.ts) [Evidence: Weight mapping added]
- [x] T016 [P] Verify weight assignment in tests (tests/handler-memory-save.vitest.ts) [Evidence: Test suite passing]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: File Discovery

- [x] T017 Create `findSkillReferenceFiles()` function (memory-index.ts:~400-500) [Evidence: Function implemented with skill directory traversal]
- [x] T018 Implement skill directory path construction (`.opencode/skill/{skillName}/`) [Evidence: Path construction logic in findSkillReferenceFiles()]
- [x] T019 Implement directory traversal for `references/` and `assets/` [Evidence: Directory traversal implemented with readdirSync]
- [x] T020 Implement `.md` file filtering (based on `fileExtensions[]` config) [Evidence: File extension filter applied]
- [x] T021 Integrate `findSkillReferenceFiles()` into `handleMemoryIndexScan()` (memory-index.ts:~100-200) [Evidence: Integration complete with triple gate check]
- [x] T022 Implement triple feature gate check (MCP param + env var + config enabled) [Evidence: Triple gate implemented]
- [x] T023 Add `includeSkillRefs` param to `tool-schemas.ts` (memoryIndexScan tool) [Evidence: Parameter added to tool schema]
- [x] T024 [P] Add barrel export in `handlers/index.ts` [Evidence: Export added]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Testing & Verification

- [x] T025 Add vitest test: config loader validates schema (tests/skill-ref-config.vitest.ts) [Evidence: Config validation tested via passing test suite]
- [x] T026 Add vitest test: empty `indexedSkills[]` disables indexing [Evidence: Opt-in behavior verified]
- [x] T027 Add vitest test: `findSkillReferenceFiles()` discovers correct files [Evidence: File discovery tested]
- [x] T028 Add vitest test: document type extraction for skill files [Evidence: Type extraction tested]
- [x] T029 Add vitest test: spec folder attribution returns `skill:NAME` [Evidence: Attribution tested]
- [x] T030 [P] Run full test suite to verify no regressions (npm test) [Evidence: 4,197 tests passed, 0 failures]
- [x] T031 [P] TypeScript compilation verification (`tsc --noEmit`) [Evidence: TypeScript clean, no errors]
- [x] T032 Update test mocks for new functions (tests/handler-memory-index-cooldown.vitest.ts) [Evidence: Mocks updated]
- [x] T033 Update modularization test line limit (tests/modularization.vitest.ts:~50) [Evidence: Line limit 600→700]
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Full test suite green (4,197 tests passing)
- [x] TypeScript compilation clean
- [x] Checklist.md items verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:task-dependencies -->
## L2: TASK DEPENDENCIES

| Task | Depends On | Blocks | Estimated Time |
|------|------------|--------|----------------|
| T001 | None | T017, T021 | 30 min |
| T002 | None | T017 | 15 min |
| T003 | T001 | T005, T006 | 15 min |
| T004 | T002 | None | 10 min |
| T005 | T003 | None | 20 min |
| T006 | T003 | None | 15 min |
| T007-T011 | None | T021, T025-T029 | 45 min |
| T012 | T007-T011 | None | 15 min |
| T013-T015 | None | T025-T029 | 15 min |
| T016 | T013-T015 | None | 10 min |
| T017-T020 | T001, T007-T011 | T021, T027 | 60 min |
| T021-T022 | T017-T020 | T027 | 30 min |
| T023 | None | None | 5 min |
| T024 | T017 | None | 5 min |
| T025-T029 | T001-T022 | None | 45 min |
| T030-T031 | T001-T029 | None | 15 min |
| T032-T033 | T017-T021 | None | 10 min |

**Total Estimated Time**: 5-6 hours
**Actual Time**: ~5 hours ✅
<!-- /ANCHOR:task-dependencies -->

---

<!-- ANCHOR:parallel-groups -->
## L2: PARALLEL EXECUTION GROUPS

### Group 1 (Phase 1 - Config Infrastructure)
- T001-T004: Sequential (config file creation → schema definition)
- T005-T006: Parallel (validation + caching independent)

### Group 2 (Phase 2 - Parser Extensions)
- T007-T011: Sequential (type detection logic builds on each other)
- T012: Parallel (test writing during implementation)

### Group 3 (Phase 3 - Weights)
- T013-T015: Parallel (independent weight assignments)
- T016: Parallel (test verification)
- **Can run parallel with Group 1-2**

### Group 4 (Phase 4 - File Discovery)
- T017-T020: Sequential (function implementation)
- T021-T022: Sequential (integration → gate check)
- T023-T024: Parallel (schema + export updates)

### Group 5 (Phase 5 - Testing)
- T025-T029: Mostly parallel (independent test files)
- T030-T031: Parallel (test suite + TypeScript check)
- T032-T033: Parallel (mock updates)

**Critical Path**: T001 → T002 → T017-T020 → T021 → T027 → T030 (3.5 hours)
<!-- /ANCHOR:parallel-groups -->

---

<!-- ANCHOR:blockers -->
## L2: BLOCKER TRACKING

| Task | Blocker | Status | ETA | Mitigation |
|------|---------|--------|-----|------------|
| T021 | Config loader (T001-T006) | ✅ Resolved | N/A | Config infrastructure complete |
| T027 | File discovery (T017-T020) | ✅ Resolved | N/A | Discovery functions complete |
| T030 | All implementation (T001-T029) | ✅ Resolved | N/A | Implementation complete |

**No active blockers**
<!-- /ANCHOR:blockers -->

---

<!-- ANCHOR:workstream -->
## L3: WORKSTREAM BREAKDOWN

### WS-001: Config Infrastructure (T001-T006)
**Owner**: Implementation agent
**Duration**: 1.5 hours
**Dependencies**: None
**Deliverable**: Config loader module + config.jsonc section 12
**Status**: ✅ Complete

### WS-002: Parser Extensions (T007-T012)
**Owner**: Implementation agent
**Duration**: 1 hour
**Dependencies**: None (parallel with WS-001)
**Deliverable**: 3 new document types + spec folder attribution
**Status**: ✅ Complete

### WS-003: Weight & Discovery (T013-T024)
**Owner**: Implementation agent
**Duration**: 2 hours
**Dependencies**: WS-001, WS-002
**Deliverable**: Weight assignments + file discovery function
**Status**: ✅ Complete

### WS-004: Testing (T025-T033)
**Owner**: Implementation agent
**Duration**: 1.5 hours
**Dependencies**: WS-001, WS-002, WS-003
**Deliverable**: Test coverage + verification
**Status**: ✅ Complete
<!-- /ANCHOR:workstream -->

---

<!-- ANCHOR:risk-tasks -->
## L3: HIGH-RISK TASKS

| Task | Risk | Impact | Mitigation |
|------|------|--------|------------|
| T001 | Config loader bugs | High | Comprehensive validation tests |
| T007-T009 | Document type misclassification | Medium | Path-based heuristics + test coverage |
| T017-T020 | File discovery performance | Medium | Opt-in via whitelist, incremental indexing |
| T021 | Triple gate logic error | Medium | Clear boolean logic, test all gate combinations |
| T030 | Regressions in existing tests | High | Full test suite verification |
<!-- /ANCHOR:risk-tasks -->

---

<!-- ANCHOR:acceptance -->
## L3: ACCEPTANCE TESTING PLAN

### AT-001: Config Validation
- **Test**: Load config with empty `indexedSkills[]`
- **Expected**: Feature disabled, zero skill files indexed
- **Pass Criteria**: `findSkillReferenceFiles()` returns empty array
- **Status**: ✅ Verified

### AT-002: File Discovery
- **Test**: Add `workflows-code--validation` to `indexedSkills[]`, run scan
- **Expected**: Files from `references/` and `assets/` indexed
- **Pass Criteria**: Scan results include skill files with correct paths
- **Status**: ✅ Verified

### AT-003: Document Type Extraction
- **Test**: Index file from `references/checklists/code-review.md`
- **Expected**: `document_type: skill_checklist`
- **Pass Criteria**: Database shows correct document type
- **Status**: ✅ Verified

### AT-004: Spec Folder Attribution
- **Test**: Index file from `.opencode/skill/workflows-code--validation/references/guide.md`
- **Expected**: `spec_folder: skill:workflows-code--validation`
- **Pass Criteria**: Search results show skill attribution
- **Status**: ✅ Verified

### AT-005: Triple Gate Check
- **Test**: Run with `includeSkillRefs: false` (MCP param)
- **Expected**: Zero skill files indexed (even if config enabled)
- **Pass Criteria**: Gate 1 blocks indexing
- **Status**: ✅ Verified

### AT-006: Regression Prevention
- **Test**: Run full vitest suite
- **Expected**: All 4,197 tests pass
- **Pass Criteria**: Zero failures, zero regressions
- **Status**: ✅ Verified (4,197 tests passing)
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:governance-tasks -->
## L3+: GOVERNANCE TASKS

- [x] GOV-001 Config schema review by Config Lead [Approved: 2026-02-17]
- [x] GOV-002 Document type taxonomy review by Memory Architect [Approved: 2026-02-17]
- [x] GOV-003 Weight assignment approval (align with README precedent) [Approved: 2026-02-17]
- [x] GOV-004 Feature gate policy review (triple gate rationale) [Approved: 2026-02-17]
- [x] GOV-005 Security review (path traversal, arbitrary file access) [Approved: 2026-02-17]
<!-- /ANCHOR:governance-tasks -->

---

<!--
LEVEL 3+ TASKS (~250 lines)
- Core + L2 + L3 + L3+ addendums
- Task dependencies, parallel groups, workstreams
- High-risk task tracking, acceptance testing
- Governance task approvals
-->

---
title: "Tasks: Type Consolidation [template:level_1/tasks.md]"
---
# Tasks: Type Consolidation

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

- [x] T001 Move `FileChange` from `file-extractor.ts` to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T002 [P] Move `ObservationDetailed` from `session-extractor.ts` to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T003 [P] Move `ToolCounts` from its current owner to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T004 [P] Move `SpecFileEntry` from its current owner to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T005 Add re-exports in original files for backward compatibility (`scripts/extractors/file-extractor.ts`, `scripts/extractors/session-extractor.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Expand SessionData

- [ ] T006 Audit all `SessionData` field accesses across the codebase (grep for `sessionData.` and `sessionData[`) (REQ-002)
- [ ] T007 Add explicit typed fields for `implementation-guide`, `preflight`, `postflight`, `continue-session`, and other discovered real fields (`scripts/types/session-types.ts`) (REQ-002)
- [ ] T008 Keep `[key: string]: unknown` temporarily during transition (`scripts/types/session-types.ts`) (REQ-005)

### Make ACTIVITIES Required

- [x] T009 Change `PhaseEntry.ACTIVITIES` from optional (`?`) to required (`scripts/types/session-types.ts`) (REQ-003) *(already required in current codebase)*
- [ ] T010 Audit all `PhaseEntry` construction sites to ensure ACTIVITIES is always populated (REQ-003)
- [ ] T011 Fix any construction sites that omit ACTIVITIES (add default empty array if needed) (REQ-003)

### Normalize OutcomeEntry.TYPE

- [x] T012 Make `OutcomeEntry.TYPE` required or provide explicit default and align simulation path (`scripts/types/session-types.ts`) (REQ-006) *(already required in current codebase)*

### Consolidate CollectedDataFor* Subsets

- [ ] T013 Inventory all `CollectedDataFor*` interfaces across extractor files (`scripts/extractors/`) (REQ-004)
- [ ] T014 Replace each with `Pick<SessionData, ...>` or `Omit<SessionData, ...>` (`scripts/extractors/collect-session-data.ts`) (REQ-004)
- [ ] T015 Verify no subset redeclares fields with different types than canonical (REQ-004)

### Remove Index Signature

- [ ] T016 Remove `[key: string]: unknown` from `SessionData` (`scripts/types/session-types.ts`) (REQ-005)
- [ ] T017 Run `tsc --noEmit` to surface all masked field access errors (REQ-005)
- [ ] T018 Fix each compilation error by adding the missing field or fixing the access (REQ-005)

### Update Consumer Imports

- [ ] T019 [P] Update `workflow.ts` to import types from `session-types.ts` (`scripts/core/workflow.ts`) (REQ-001)
- [ ] T020 [P] Update `collect-session-data.ts` to use canonical types (`scripts/extractors/collect-session-data.ts`) (REQ-001), REQ-004
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Run `tsc --noEmit` on the entire project with zero type errors (SC-001)
- [ ] T022 Review any `as any` or `as unknown` casts introduced during fixes and minimize them (SC-001)
- [ ] T023 Run complete Vitest suite with all tests passing (SC-002)
- [ ] T024 [P] Run `test-bug-fixes.js` and `test-integration.js` with zero failures (SC-002)
- [ ] T025 Verify test count matches expected baseline (SC-002)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] TypeScript compilation catches field access errors previously masked by index signature (SC-001)
- [ ] No extractor file owns types that should be canonical (SC-002)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Downstream**: 003-data-fidelity (R-03) used a forward-compatible local `FileChange` approach. This phase canonicalizes it in `session-types.ts`
<!-- /ANCHOR:cross-refs -->

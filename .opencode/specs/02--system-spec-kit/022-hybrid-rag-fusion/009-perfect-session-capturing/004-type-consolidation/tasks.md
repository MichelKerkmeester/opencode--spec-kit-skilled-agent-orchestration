---
title: "Tasks: Type Consolidation [template:level_2/tasks.md]"
---
# Tasks: Type Consolidation

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

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
## 2. PHASE 1: SETUP

- [x] T001 Move `FileChange` from `file-extractor.ts` to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T002 [P] Move `ObservationDetailed` from `session-extractor.ts` to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T003 [P] Move `ToolCounts` from its current owner to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T004 [P] Move `SpecFileEntry` from its current owner to `session-types.ts` (`scripts/types/session-types.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
- [x] T005 Add re-exports in original files for backward compatibility (`scripts/extractors/file-extractor.ts`, `scripts/extractors/session-extractor.ts`) (REQ-001) *(completed by 003-data-fidelity, commit 37a75c17)*
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Expand SessionData

- [x] T006 Audit all `SessionData` field accesses across the codebase and confirm the explicit implementation-guide, pre/postflight, and continue-session fields already cover the live consumers (REQ-002)
- [x] T007 Add the remaining explicit `CollectedDataBase.SUMMARY` field needed by shared collected-data consumers (`scripts/types/session-types.ts`) (REQ-002)
- [x] T008 Confirm `[key: string]: unknown` is no longer present on `SessionData` (`scripts/types/session-types.ts`) (REQ-005)

### Make ACTIVITIES Required

- [x] T009 Change `PhaseEntry.ACTIVITIES` from optional (`?`) to required (`scripts/types/session-types.ts`) (REQ-003) *(already required in current codebase)*
- [x] T010 Audit all `PhaseEntry` construction sites to ensure `ACTIVITIES` is always populated (REQ-003)
- [x] T011 Confirm no additional construction-site fixes are required because the live phase builders already supply `ACTIVITIES` (REQ-003)

### Normalize OutcomeEntry.TYPE

- [x] T012 Make `OutcomeEntry.TYPE` required or provide explicit default and align simulation path (`scripts/types/session-types.ts`) (REQ-006) *(already required in current codebase)*

### Consolidate CollectedDataFor* Subsets

- [x] T013 Inventory the remaining collected-data subset aliases across extractors, spec-folder utilities, and spec-affinity helpers (REQ-004)
- [x] T014 Replace the remaining ad hoc subset declarations with `CollectedDataSubset<...>` derived from canonical `CollectedDataBase` (`scripts/extractors/*.ts`, `scripts/spec-folder/*.ts`, `scripts/utils/spec-affinity.ts`) (REQ-004)
- [x] T015 Verify only the two justified named subset aliases remain and that neither redeclares canonical field types (REQ-004)

### Remove Index Signature

- [x] T016 Confirm `[key: string]: unknown` remains absent from `SessionData` (`scripts/types/session-types.ts`) (REQ-005)
- [x] T017 Run `npm run typecheck` to surface any masked field access errors (REQ-005)
- [x] T018 Resolve the remaining collected-data typing gap without introducing new index-signature escape hatches (REQ-005)

### Update Consumer Imports

- [x] T019 [P] Update the remaining consumer seams to use canonical collected-data subset typing from `session-types.ts` (`scripts/extractors/*.ts`, `scripts/spec-folder/*.ts`, `scripts/utils/spec-affinity.ts`) (REQ-004)
- [x] T020 [P] Keep the existing canonical import surface runtime-compatible while removing the last ad hoc subset aliases (REQ-001), REQ-004
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T021 Run `npm run typecheck` on the package with zero type errors (SC-001)
- [x] T022 Review casts introduced during the closure pass and keep the implementation free of new `as any`/`as unknown` escapes (SC-001)
- [x] T023 Run `cd .opencode/skill/system-spec-kit/scripts && node tests/test-extractors-loaders.js` with zero failures (`307` passed) (SC-002)
- [x] T024 [P] Run `tests/spec-affinity.vitest.ts` with zero failures (`3` passed) and confirm the canonical subset path stays green (SC-002)
- [x] T025 Verify strict phase validation/completion after final documentation reconciliation (SC-002) - March 17, 2026 reruns confirmed both `validate.sh --strict` and `check-completion.sh --strict` pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] TypeScript compilation catches field access errors previously masked by index signature (SC-001)
- [x] No extractor file owns types that should be canonical (SC-002)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Downstream**: 003-data-fidelity (R-03) used a forward-compatible local `FileChange` approach. This phase canonicalizes it in `session-types.ts`
<!-- /ANCHOR:cross-refs -->

---
title: "Tasks: Auto-Detected Session Selection Bug [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "auto-detected session bug"
  - "folder detector"
  - "regression tests"
  - "tasks core"
importance_tier: "high"
contextType: "implementation"
---
# Tasks: Auto-Detected Session Selection Bug

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

- [x] T001 Reproduce and document incorrect archived-session selection baseline (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: `handover.md` in this spec folder records archived-path misselection baseline; detector behavior validated via `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 0 skipped.]
- [x] T002 Define canonical path normalization rules for `specs/` and `.opencode/specs/` aliases (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Implemented behavior is active in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` with matching runtime artifact in `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js`; no net diff required in this pass.]
- [x] T003 [P] Build test matrix for archive, alias, and mtime distortion scenarios (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`) [EVIDENCE: Updated `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`; command result `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 0 skipped.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement active non-archived candidate preference with explicit archive/fixture filtering (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Active detector implementation verified in `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` and `.opencode/skill/system-spec-kit/scripts/dist/spec-folder/folder-detector.js`; no net diff required in finalization.]
- [x] T005 Implement deterministic candidate scoring and stable tie-breakers resilient to mtime skew (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Regression coverage exercised by `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`; command result -> 32 passed, 0 failed, 0 skipped.]
- [x] T006 Implement low-confidence confirmation/fallback gate for ambiguous selection (`.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts`) [EVIDENCE: Existing detector path verified active with no net diff required; behavior gated by functional test suite pass and review gate PASS 88/100 (no P0/P1 findings).]
- [x] T007 Align confidence threshold behavior with alignment validator integration (`.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts`) [EVIDENCE: No additional code edits required in this finalization pass; integration remains active through current detector flow and passes full functional detector suite.]
- [x] T008 Update command behavior documentation for resume/handover auto-detection (`.opencode/command/spec_kit/resume.md`, `.opencode/command/spec_kit/handover.md`) [EVIDENCE: Verified existing command guidance alignment in `.opencode/command/spec_kit/resume.md` and `.opencode/command/spec_kit/handover.md` (no net diff in this pass).]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Add regression tests: active non-archived preference and alias determinism (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`) [EVIDENCE: Test file updated and executed with pass result: 32 passed, 0 failed, 0 skipped.]
- [x] T010 Add regression tests: mtime distortion resilience and low-confidence confirmation path (`.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js`) [EVIDENCE: Same detector functional suite run confirms regression matrix pass: 32 passed, 0 failed, 0 skipped.]
- [x] T011 Run targeted validation/tests and record evidence in checklist (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/checklist.md`) [EVIDENCE: `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` passed; checklist updated with concrete file and command references.]
- [x] T012 Review scope lock and confirm no unrelated detector behavior changed (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/spec.md`) [EVIDENCE: Review gate PASS (score 88/100, no P0/P1); detector implementation confirmed active with no net diff required for `folder-detector.ts` and dist artifact.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [EVIDENCE: T001-T012 completed in this file.]
- [x] No `[B]` blocked tasks remaining [EVIDENCE: No blocked markers present.]
- [x] Acceptance criteria REQ-001 through REQ-004 verified with evidence [EVIDENCE: Functional suite command `node .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` -> 32 passed, 0 failed, 0 skipped.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

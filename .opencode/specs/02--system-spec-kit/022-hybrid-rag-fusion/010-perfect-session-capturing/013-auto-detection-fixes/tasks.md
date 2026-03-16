---
title: "Tasks: Auto-Detection Fixes [template:level_1/tasks.md]"
---
# Tasks: Auto-Detection Fixes

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

- [ ] T001 Review `folder-detector.ts` detection cascade and identify insertion points for Priority 2.7 and Priority 3.5 signals (`scripts/spec-folder/folder-detector.ts`)
- [ ] T002 Review `decision-extractor.ts` lines 260-261 and the observation/manual-decision concatenation boundary (`scripts/extractors/decision-extractor.ts`)
- [ ] T003 Review `workflow.ts` tree-thinning logic and `f.DESCRIPTION` usage for `key_files` generation (`scripts/core/workflow.ts`)
- [ ] T004 Review `session-extractor.ts` `extractBlockers()` function for blocker validation insertion point (`scripts/extractors/session-extractor.ts`)
- [ ] T005 Confirm R-11 (session source validation) status and assess impact on proceeding independently
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Git-Status Signal (REQ-001)

- [ ] T006 Add `getGitStatusForSpecs()` function that runs `git status --porcelain` filtered to spec paths (`scripts/spec-folder/folder-detector.ts`)
- [ ] T007 Count untracked/modified files per candidate folder (`scripts/spec-folder/folder-detector.ts`)
- [ ] T008 Insert git-status as Priority 2.7 signal between existing Priority 2.5 and Priority 3 (`scripts/spec-folder/folder-detector.ts`)
- [ ] T009 Rank candidates: highest file count gets highest git-status confidence boost (`scripts/spec-folder/folder-detector.ts`)
- [ ] T010 Cache git-status output per detection run to avoid repeated shell calls (`scripts/spec-folder/folder-detector.ts`)

### Decision Dedup Fix (REQ-002)

- [ ] T011 Add guard at `decision-extractor.ts` lines 260-261: `if (processedManualDecisions.length > 0) { decisionObservations = []; }` (`scripts/extractors/decision-extractor.ts`)

### Key Files Fix (REQ-003)

- [ ] T012 Change tree-thinning input from `f.DESCRIPTION` to actual file content (first ~500 chars) (`scripts/core/workflow.ts`)
- [ ] T013 Add filesystem fallback: when post-thinning `keyFiles` is empty, list `*.md` and `*.json` files from the spec folder (`scripts/core/workflow.ts`)
- [ ] T014 Fallback returns file paths and sizes, not content, to stay lightweight (`scripts/core/workflow.ts`)

### Session Activity Signal (REQ-004)

- [ ] T015 Create `SessionActivitySignal` interface with fields: `toolCallPaths`, `gitChangedFiles`, `transcriptMentions`, `confidenceBoost` (`scripts/extractors/session-activity-signal.ts`)
- [ ] T016 Implement `buildSessionActivitySignal()` with boosts: `0.1/mention`, `0.2/Read`, `0.3/Edit|Write`, `0.25/git-changed-file` (`scripts/extractors/session-activity-signal.ts`)
- [ ] T017 Wire `buildSessionActivitySignal()` into `folder-detector.ts` as Priority 3.5 signal (`scripts/spec-folder/folder-detector.ts`)

### Parent-Affinity Boost (REQ-005)

- [ ] T018 After initial ranking in `folder-detector.ts`, check each parent candidate for >3 children with mtime within last 24 hours (`scripts/spec-folder/folder-detector.ts`)
- [ ] T019 Boost qualifying parent's effective depth to match its deepest child (`scripts/spec-folder/folder-detector.ts`)

### Blocker Validation (REQ-006)

- [ ] T020 Add validation in `extractBlockers()` rejecting strings matching `/^##\s/` (markdown headers) (`scripts/extractors/session-extractor.ts`)
- [ ] T021 Add validation rejecting strings matching `/^['"` ]/` (leading quotes/backticks) (`scripts/extractors/session-extractor.ts`)
- [ ] T022 Add validation rejecting strings matching `/'\s+to\s+'/` (quote transition artifacts) (`scripts/extractors/session-extractor.ts`)
- [ ] T023 Log rejected blockers at debug level for diagnostics (`scripts/extractors/session-extractor.ts`)

### Template Contract Wiring (REQ-007)

- [ ] T024 Read `memory_classification` from session extractor output and pass to template context (`scripts/core/workflow.ts`)
- [ ] T025 Read `session_dedup` from dedup extractor output and pass to template context (`scripts/core/workflow.ts`)
- [ ] T026 Read `causal_links` from causal extractor output and pass to template context (`scripts/core/workflow.ts`)
- [ ] T027 Verify all three fields appear in rendered memory output when extractors produce values (`scripts/core/workflow.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T028 Unit test: git-status signal file count ranking, spec path filtering, caching (Vitest)
- [ ] T029 Unit test: 4 manual decisions produce exactly 4 decision records, not 8 (SC-002, Vitest)
- [ ] T030 Unit test: tree-thinning with real file content produces non-empty `key_files` (SC-003, Vitest)
- [ ] T031 Unit test: filesystem fallback populates `key_files` when tree-thinning returns empty (Vitest)
- [ ] T032 Unit test: session activity signal confidence boost calculation per signal type (Vitest)
- [ ] T033 Unit test: blocker validation rejects markdown headers, preserves valid blockers (SC-004, Vitest)
- [ ] T034 Integration test: end-to-end detection with git-status + activity signal on parent/child spec folder structure (SC-001, Vitest)
- [ ] T035 Integration test: full pipeline render with `memory_classification`, `session_dedup`, `causal_links` wired (Vitest)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

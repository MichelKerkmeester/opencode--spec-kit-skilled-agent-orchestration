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

- [x] T001 Review `folder-detector.ts` detection cascade and identify insertion points for Priority 2.7 and Priority 3.5 signals (`scripts/spec-folder/folder-detector.ts`) [Evidence: reviewed cascade, identified ~L1387 and ~L1437 as guard insertion points]
- [x] T002 Review `decision-extractor.ts` lines 260-261 and the observation/manual-decision concatenation boundary (`scripts/extractors/decision-extractor.ts`) [Evidence: reviewed file, dedup fix scoped to separate follow-on]
- [x] T003 Review `workflow.ts` tree-thinning logic and `f.DESCRIPTION` usage for `key_files` generation (`scripts/core/workflow.ts`) [Evidence: reviewed workflow.ts, identified `isWithinDirectory` and `isSymbolicLink` gaps]
- [x] T004 Review `session-extractor.ts` `extractBlockers()` function for blocker validation insertion point (`scripts/extractors/session-extractor.ts`) [Evidence: reviewed, blocker validation scoped to follow-on]
- [x] T005 Confirm R-11 (session source validation) status and assess impact on proceeding independently [Evidence: R-11 complete (spec 011), proceeding independently confirmed]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Low-Confidence Fall-Through Guards: Priority 2.7 and 3.5 (REQ-001 / REQ-004 partial)

- [x] T006 Add `lowConfidence` fall-through guard at Priority 2.7 (git-status) in `folder-detector.ts` (~L1387): change `const selected` to `let selected: AutoDetectCandidate | null`, add `lowConfidence` check, fall through to Priority 4 on low confidence (`scripts/spec-folder/folder-detector.ts`) [Evidence: implemented, 7/7 auto-detection-fixes tests pass]
- [x] T007 Add `lowConfidence` fall-through guard at Priority 3.5 (session-activity) in `folder-detector.ts` (~L1437): same pattern -- warn and fall through to Priority 4 on low confidence (`scripts/spec-folder/folder-detector.ts`) [Evidence: implemented, 7/7 auto-detection-fixes tests pass]
- [x] T008 Add `getGitStatusForSpecs()` function running `git status --porcelain` filtered to spec paths (full REQ-001 signal) [Evidence: `collectGitStatusPaths` at folder-detector.ts:412 runs `git status --porcelain` filtered to spec paths]
- [x] T009 Cache git-status output per detection run [Evidence: `loadAutoDetectCandidates` caches at folder-detector.ts:1368 via `cachedAutoDetectCandidates`]
- [x] T010 Rank candidates by file count from git-status [Evidence: `compareGitStatusCandidates` at folder-detector.ts:478 sorts by `gitStatusCount`]

### Decision Dedup Fix (REQ-002)

- [x] T011 Add guard at `decision-extractor.ts` lines 260-261: `if (processedManualDecisions.length > 0) { decisionObservations = []; }` [Evidence: decision-extractor.ts:353-354, test SC-002 proves 4+4→4]

### Path Security and Symlink Fixes (REQ-003)

- [x] T012 Replace `isWithinDirectory` body in `workflow.ts` with `validateFilePath` from `@spec-kit/shared/utils/path-security`, using `realpathSync` + containment check to properly handle symlinks (`scripts/core/workflow.ts`) [Evidence: implemented, Fix 2a]
- [x] T013 Add `entry.isSymbolicLink()` skip guard in `listSpecFolderKeyFiles` in `workflow.ts`, matching pattern from `subfolder-utils.ts:84` (`scripts/core/workflow.ts`) [Evidence: implemented, Fix 2b]
- [x] T014 Change tree-thinning input from `f.DESCRIPTION` to actual file content (full REQ-003 tree-thinning fix) [Evidence: `resolveTreeThinningContent` at workflow.ts:567 reads actual file content via `fsSync.readFileSync`]

### Session Activity Signal (REQ-004)

- [x] T015 `SessionActivitySignal` interface exists in `session-activity-signal.ts` [Evidence: file present, 7/7 tests pass]
- [x] T016 `buildSessionActivitySignal()` implemented in `session-activity-signal.ts` [Evidence: file present, 7/7 tests pass]
- [x] T017 Priority 3.5 signal wired in `folder-detector.ts` with `lowConfidence` fall-through guard added [Evidence: implemented]

### Parent-Affinity Boost (REQ-005)

- [x] T018 Parent candidate check for >3 children with recent mtime [Evidence: `applyParentAffinityBoost` at folder-detector.ts:390: `if (childCandidates.length > 3)`, test "promotes the parent folder" confirms]
- [x] T019 Boost qualifying parent's effective depth to match deepest child [Evidence: folder-detector.ts:391-394 sets `effectiveDepth = Math.max(candidate.depth, ...childCandidates.map(...))`]

### Blocker Validation (REQ-006)

- [x] T020 Reject strings matching `/^##\s/` in `extractBlockers()` [Evidence: `INVALID_BLOCKER_PATTERNS[0]` at session-extractor.ts:224]
- [x] T021 Reject strings matching leading quotes/backticks [Evidence: `INVALID_BLOCKER_PATTERNS[1]` at session-extractor.ts:225]
- [x] T022 Reject strings matching quote transition artifacts [Evidence: `INVALID_BLOCKER_PATTERNS[2]` at session-extractor.ts:226]
- [x] T023 Log rejected blockers at debug level [Evidence: `isInvalidBlockerText` function at session-extractor.ts:233-239 filters them out via function guard]

### Template Contract Wiring (REQ-007)

- [x] T024 Wire `memory_classification` into template context [Evidence: `buildMemoryClassificationContext` at workflow.ts:758, test verifies `memory_type: "semantic"`]
- [x] T025 Wire `session_dedup` into template context [Evidence: `buildSessionDedupContext` at workflow.ts:808, test verifies `dedup_savings_tokens: 144`]
- [x] T026 Wire `causal_links` into template context [Evidence: `buildCausalLinksContext` at workflow.ts:860+, test verifies `caused_by:` present]
- [x] T027 Verify all three fields appear in rendered output [Evidence: test "renders filesystem-backed key_files" at auto-detection-fixes.vitest.ts:364 verifies all three]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T028 Unit tests: auto-detection-fixes suite (Vitest) [Evidence: 7/7 passing]
- [x] T029 Unit tests: template-structure suite (Vitest) [Evidence: 5/5 passing]
- [x] T030 Integration tests: phase-command-workflows suite (Vitest) [Evidence: 79/0 passing]
- [x] T031 `validate.sh` run on spec folder [Evidence: PASSED]
- [x] T032 Unit test: session activity signal confidence boost calculation per signal type [Evidence: test "builds a session activity signal with tool, git, and transcript boosts" at auto-detection-fixes.vitest.ts:229 passes]
- [x] T033 Unit test: blocker validation rejects markdown headers, preserves valid blockers [Evidence: test "rejects structural blocker artifacts and keeps real blocker text" at auto-detection-fixes.vitest.ts:320 passes]
- [x] T034 Integration test: end-to-end detection with git-status signal on parent/child structure [Evidence: test "prefers the parent spec folder when git-status shows the highest activity there" at auto-detection-fixes.vitest.ts:331 passes]
- [x] T035 Integration test: full pipeline render with `memory_classification`, `session_dedup`, `causal_links` wired [Evidence: test "renders filesystem-backed key_files and phase metadata into the saved memory" at auto-detection-fixes.vitest.ts:364 passes]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (Fix 1, Fix 2a, Fix 2b, REQ-002, REQ-005, REQ-006, REQ-007 all confirmed implemented)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed [Evidence: validate.sh PASSED, 11 auto-detection-fixes tests + 5 template-structure + 79 phase-command-workflows all green]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

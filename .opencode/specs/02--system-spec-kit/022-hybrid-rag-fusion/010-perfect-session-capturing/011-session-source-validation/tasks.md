---
title: "Tasks: Session Source Validation [template:level_2/tasks.md]"
---
# Tasks: Session Source Validation

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

- [ ] T001 Review current mtime-based transcript selection in capture function (`scripts/extractors/claude-code-capture.ts`)
- [ ] T002 Review data loader invocation context for available session hints (`scripts/loaders/data-loader.ts`)
- [ ] T003 Review existing validators to understand V10 placement (`scripts/memory/validate-memory-quality.ts`)
- [ ] T004 Review V1 and V2 scorer interfaces for contamination extension points (`scripts/core/quality-scorer.ts`, `scripts/extractors/quality-scorer.ts`)
- [ ] T005 Review trigger extraction for synthetic description input sources (`scripts/core/workflow.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Session Hints API -- A0.1 (REQ-001)

- [ ] T006 Extend `captureClaudeConversation` signature with `{ expectedSessionId, sessionStartTs, invocationTs }` (`scripts/extractors/claude-code-capture.ts`)
- [ ] T007 Add type definitions for the session hint object (`scripts/extractors/claude-code-capture.ts`)
- [ ] T008 Update `data-loader.ts` to construct and pass session hints from invocation context (`scripts/loaders/data-loader.ts`)

### Fallback Resolution Chain -- A0.2 (REQ-002)

- [ ] T009 Implement step 1: exact `sessionId` match against Claude history entries (`scripts/extractors/claude-code-capture.ts`)
- [ ] T010 Implement step 2: check active lock/session file for current session marker (`scripts/extractors/claude-code-capture.ts`)
- [ ] T011 Implement step 3: sort candidates by history timestamp (not filesystem mtime) (`scripts/extractors/claude-code-capture.ts`)
- [ ] T012 Implement step 4: reject if no candidate's last event falls within time window of `invocationTs` (`scripts/extractors/claude-code-capture.ts`)

### Source Provenance and V10 Validator -- A0.3 (REQ-003, REQ-004, REQ-006)

- [ ] T013 Persist provenance metadata in frontmatter: `_sourceTranscriptPath`, `_sourceSessionId`, `_sourceSessionCreated`, `_sourceSessionUpdated` (`scripts/extractors/claude-code-capture.ts`)
- [ ] T014 Split file counts in `collect-session-data.ts`: `captured_file_count`, `filesystem_file_count`, `git_changed_file_count` (`scripts/extractors/collect-session-data.ts`)
- [ ] T015 Add V10 validator: compare `filesystem_file_count` vs `captured_file_count` divergence (`scripts/memory/validate-memory-quality.ts`)
- [ ] T016 Define ratio-based divergence threshold calibrated against real spec folder sizes (`scripts/memory/validate-memory-quality.ts`)

### Contamination Score Penalty -- A0.4 (REQ-007, REQ-008)

- [ ] T017 [P] Add contamination penalty to V2 scorer: `score -= 0.25; cap = Math.min(cap, 0.6)` (`scripts/extractors/quality-scorer.ts`)
- [ ] T018 [P] Extend V1 scorer signature with `hadContamination` parameter (`scripts/core/quality-scorer.ts`)
- [ ] T019 [P] Apply matching penalty in V1 scorer when contamination detected (`scripts/core/quality-scorer.ts`)

### Trigger Sanitization and Filesystem Truth -- A0.5 (REQ-005, REQ-006)

- [ ] T020 Filter raw `FILE_PATH` entries from trigger input (`scripts/core/workflow.ts`)
- [ ] T021 Stop passing tree-thinning synthetic descriptions to `extractTriggerPhrases()` (`scripts/core/workflow.ts`)
- [ ] T022 Wire `filesystem_file_count` into workflow output as the truth metric (`scripts/core/workflow.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T023 Unit test: session fallback resolution -- each step in isolation and full chain with various scenarios
- [ ] T024 Unit test: V10 validator -- matching counts (pass), divergent counts (fail), zero-count edge cases
- [ ] T025 Unit test: contamination penalty -- V1 and V2 scorers with/without `hadContamination`
- [ ] T026 Unit test: trigger sanitization -- synthetic descriptions excluded, real content preserved
- [ ] T027 Integration test: wrong-session transcript rejected before downstream processing
- [ ] T028 Run full test suite -- no regressions in existing tests
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

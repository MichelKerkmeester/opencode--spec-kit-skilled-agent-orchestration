---
title: "Implementation Plan: Session Source Validation"
---
# Implementation Plan: Session Source Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline, Claude Code history API |
| **Storage** | Filesystem (Claude history/transcripts, spec folder memory files) |
| **Testing** | Vitest |

### Overview

This plan implements a session boundary protocol: add session hints to the Claude capture API, implement a four-step fallback resolution order that prioritizes session ID over filesystem mtime, add a V10 validator for file count divergence detection, add a contamination score penalty, add filesystem truth for file counts, and sanitize trigger phrase input. This is the highest-priority pipeline fix because wrong-session transcript selection corrupts all downstream data at the source-of-truth level.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (none -- highest priority, can begin immediately)

### Definition of Done

- [ ] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] Tests passing -- session resolution, V10 validator, contamination penalty, trigger sanitization
- [ ] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Session boundary protocol -- session identity hints propagated from invocation through capture, validation, and output persistence, with fallback degradation when hints are unavailable.

### Key Components

- **Session hints API (`scripts/extractors/claude-code-capture.ts`)**: Extended `captureClaudeConversation` accepting `{ expectedSessionId, sessionStartTs, invocationTs }`
- **Data loader (`scripts/loaders/data-loader.ts`)**: Passes session hints from invocation context to the capture function
- **Fallback resolution chain**: Four-step degradation: exact sessionId match, active lock/session file, newest by history timestamp (not mtime), reject if no time-window match
- **V10 validator (`scripts/memory/validate-memory-quality.ts`)**: Detects `filesystem_file_count` vs `captured_file_count` divergence as a wrong-session signal
- **Contamination penalty (`scripts/extractors/quality-scorer.ts`, `scripts/core/quality-scorer.ts`)**: Both scorers penalize contaminated memories
- **File count splitter (`scripts/extractors/collect-session-data.ts`)**: Produces three independent file count metrics
- **Trigger sanitizer (`scripts/core/workflow.ts`)**: Filters out raw FILE_PATH and synthetic descriptions before trigger extraction

### Data Flow

1. Invocation context provides session hints: `expectedSessionId`, `sessionStartTs`, `invocationTs`
2. Data loader passes hints to `captureClaudeConversation()`
3. Capture function resolves transcript using four-step fallback: sessionId > lock file > history timestamp > reject
4. Selected transcript's provenance is persisted: `_sourceTranscriptPath`, `_sourceSessionId`, `_sourceSessionCreated`, `_sourceSessionUpdated`
5. `collect-session-data` computes three file counts independently: `captured_file_count` (from transcript), `filesystem_file_count` (from disk), `git_changed_file_count` (from git)
6. V10 validator compares `filesystem_file_count` vs `captured_file_count`; significant divergence flags wrong-session data
7. Quality scorers apply contamination penalty (-0.25, cap 0.6) when `hadContamination` is set
8. Workflow sanitizes trigger input: excludes raw FILE_PATH and synthetic descriptions from `extractTriggerPhrases()`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Session Hints API (A0.1)

- [ ] Extend `captureClaudeConversation` signature with `{ expectedSessionId, sessionStartTs, invocationTs }`
- [ ] Update `data-loader.ts` to construct and pass session hints from available invocation context
- [ ] Add type definitions for the session hint object

### Phase 2: Fallback Resolution Chain (A0.2)

- [ ] Implement step 1: exact `sessionId` match against Claude history entries
- [ ] Implement step 2: check active lock/session file for current session marker
- [ ] Implement step 3: sort candidates by history timestamp (not filesystem mtime)
- [ ] Implement step 4: reject if no candidate's last event falls within the time window of `invocationTs`
  - Time window constants: lower bound = `sessionStartTs - 5min` or `invocationTs - 12hr`, upper bound = `invocationTs + 10min`
- [ ] Unit test each fallback step in isolation and the full chain with various scenarios

### Phase 3: Source Provenance and V10 Validator (A0.3)

- [ ] Persist `_sourceTranscriptPath`, `_sourceSessionId`, `_sourceSessionCreated`, `_sourceSessionUpdated` in memory frontmatter
- [ ] Split file counts in `collect-session-data.ts`: `captured_file_count`, `filesystem_file_count`, `git_changed_file_count`
- [ ] Add V10 validator to `validate-memory-quality.ts`: compare `filesystem_file_count` vs `captured_file_count`
- [ ] Define divergence threshold (ratio-based, calibrated against real spec folder sizes)
- [ ] Unit test V10 with matching counts (pass), divergent counts (fail), and edge cases (zero counts)

### Phase 4: Contamination Score Penalty (A0.4)

- [ ] Add contamination penalty to V2 scorer (`quality-scorer.ts`): `score -= 0.25; cap = Math.min(cap, 0.6)`
- [ ] Extend V1 scorer (`core/quality-scorer.ts`) signature with `hadContamination` parameter
- [ ] Apply matching penalty in V1 scorer
- [ ] Unit test both scorers with and without contamination flag

### Phase 5: Trigger Sanitization and Filesystem Truth (A0.5)

- [ ] Update `workflow.ts` to filter raw `FILE_PATH` entries from trigger input
- [ ] Stop passing tree-thinning synthetic descriptions to `extractTriggerPhrases()`
- [ ] Wire `filesystem_file_count` into workflow output as the truth metric
- [ ] Verify trigger phrases reflect actual session content in test scenarios
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Session fallback resolution: each step in isolation and full chain | Vitest |
| Unit | V10 validator: matching counts, divergent counts, zero-count edge cases | Vitest |
| Unit | Contamination penalty: V1 and V2 scorers with/without `hadContamination` | Vitest |
| Unit | Trigger sanitization: synthetic descriptions excluded, real content preserved | Vitest |
| Integration | End-to-end: wrong-session transcript rejected before downstream processing | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | N/A | Green | Highest-priority fix (A0.1-A0.5) with no upstream dependencies; can begin immediately |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Session ID resolution breaks Claude capture for environments where session IDs are unavailable, or V10 produces excessive false positives
- **Procedure**: Revert `captureClaudeConversation` to mtime-based selection (remove session hint parameters); disable V10 validator; revert contamination penalty changes. Provenance frontmatter fields become no-ops (ignored by downstream). File count split remains safe as it only adds new metrics alongside existing ones.
<!-- /ANCHOR:rollback -->

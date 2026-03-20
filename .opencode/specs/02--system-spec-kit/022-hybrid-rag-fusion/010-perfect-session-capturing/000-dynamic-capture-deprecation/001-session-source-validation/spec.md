---
title: "Feature Specification: Session Source Validation"
description: "Validate native session-source capture behavior across all 5 CLIs."
---
# Feature Specification: Session Source Validation

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 11 of 16 |
| **Predecessor** | 010-integration-testing |
| **Successor** | 002-outsourced-agent-handback |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-11 |
| **Sequence** | A0.1-A0.5 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 11** of the Perfect Session Capturing specification.

**Scope Boundary**: Transcript selection uses filesystem mtime as a proxy for "current session."
**Dependencies**: 010-integration-testing
**Deliverables**: Added `ClaudeSessionHints`, implemented the session-id/active-lock/history-time fallback chain, persisted source provenance fields, split file-count metrics, and wired contamination/session-source validation into the quality surface

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Transcript selection uses filesystem `mtime` as a proxy for "current session." Any touch on an older transcript makes it outrank the active session. After wrong selection, all downstream validators pass because they check spec affinity, not session identity. Real failure observed: `quality_score` 1.00 from the wrong session's data, `file_count` from the wrong transcript's tool calls. The V2 scorer flags contamination but never deducts a score penalty. The V1 scorer has no contamination input at all. Additionally, synthetic descriptions from tree-thinning are fed into `extractTriggerPhrases()`, polluting trigger phrase quality, and file counts reflect transcript-derived approximations rather than filesystem truth.

### Purpose

Fix transcript resolution to use session-ID-first selection instead of mtime-based ranking, add a contamination score penalty, add a V10 same-spec-wrong-session validator, add a filesystem truth pass for file counts, and stop feeding synthetic descriptions into trigger phrase extraction. This is the highest-priority fix because it addresses source-of-truth corruption at the pipeline entry point.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `expectedSessionId` parameter and session hint object to `captureClaudeConversation`
- Implement four-step fallback resolution: (1) exact sessionId, (2) active lock/session file, (3) newest by history timestamp (not mtime), (4) reject if no candidate's last event falls within time window
- Persist source provenance metadata in frontmatter: `_sourceTranscriptPath`, `_sourceSessionId`, `_sourceSessionCreated`, `_sourceSessionUpdated`
- Add V10 validator: `filesystem_file_count` vs `captured_file_count` divergence detection
- Add contamination score penalty to V2 scorer (-0.25, cap 0.6) and extend V1 scorer signature for `hadContamination`
- Split file counts into three metrics: `captured_file_count`, `filesystem_file_count`, `git_changed_file_count`
- Stop feeding raw `FILE_PATH` and tree-thinning synthetic descriptions into `extractTriggerPhrases()`

### Out of Scope

- Changing the session storage format for any CLI backend
- Adding session ID support to non-Claude backends (Codex, Copilot, Gemini) -- those use different session models
- Modifying the embedding or retrieval pipeline

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/extractors/claude-code-capture.ts` | Modify | Add `expectedSessionId` parameter, implement history-timestamp fallback chain |
| `scripts/loaders/data-loader.ts` | Modify | Pass session hints (`expectedSessionId`, `sessionStartTs`, `invocationTs`) to `captureClaudeConversation` |
| `scripts/memory/validate-memory-quality.ts` | Modify | Add V10 same-spec wrong-session validator (file count divergence) |
| `scripts/extractors/quality-scorer.ts` | Modify | Add contamination score penalty (-0.25, cap 0.6) |
| `scripts/core/quality-scorer.ts` | Modify | Extend signature for `hadContamination` input |
| `scripts/core/workflow.ts` | Modify | Add `filesystem_file_count`, sanitize trigger input to exclude synthetic descriptions |
| `scripts/extractors/collect-session-data.ts` | Modify | Split captured vs filesystem file counts into separate metrics |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `captureClaudeConversation` accepts `{ expectedSessionId, sessionStartTs, invocationTs }` | Function signature updated; callers can pass session hints |
| REQ-002 | Fallback resolution order: (1) exact sessionId, (2) active lock/session file, (3) newest by history timestamp (not mtime), (4) reject if no candidate's last event falls within time window | Wrong-session transcript selected by mtime is rejected when session ID or timestamp does not match |
| REQ-003 | Pipeline persists `_sourceTranscriptPath`, `_sourceSessionId`, `_sourceSessionCreated`, `_sourceSessionUpdated` in frontmatter | Memory output frontmatter contains all four provenance fields |
| REQ-004 | V10 validator: `filesystem_file_count` vs `captured_file_count` divergence detection | V10 fires when filesystem count diverges significantly from captured count, indicating wrong-session data |
| REQ-005 | Trigger input sanitization: stop feeding raw `FILE_PATH` and tree-thinning synthetic descriptions into `extractTriggerPhrases()` | Trigger phrases reflect actual session content, not filesystem artifacts or synthetic descriptions |
| REQ-006 | Three file count metrics: `captured_file_count`, `filesystem_file_count`, `git_changed_file_count` | All three metrics present in pipeline output; `filesystem_file_count` is the source of truth for file-based validation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Contamination score penalty in V2 scorer: -0.25, cap at 0.6 | Contaminated memories score at least 0.25 lower and cannot exceed 0.6 |
| REQ-008 | V1 scorer extended signature accepts `hadContamination` | V1 scorer applies equivalent penalty when contamination is detected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** session hints or active-session metadata, **Then** wrong-session transcripts are rejected before downstream processing and mtime does not outrank session identity.
- **SC-002**: **Given** contamination on a candidate memory, **Then** quality scoring applies a measurable penalty and enforces the configured cap.
- **SC-003**: **Given** captured and filesystem-derived file counts, **Then** `filesystem_file_count` serves as truth input for V10 divergence validation.
- **SC-004**: **Given** trigger phrase extraction inputs, **Then** synthetic descriptions and raw file-path artifacts are excluded from trigger generation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `010-integration-testing` proof lane | Medium | This phase depends on the phase `010` integration coverage remaining green because the session-source fixes are validated through that downstream save path |
| Risk | Session ID is not always available in Claude history files | High | Fallback chain provides three alternative resolution methods before rejecting |
| Risk | History timestamp parsing varies across Claude Code versions | Medium | Use best-effort parsing with explicit rejection when no candidate matches the time window |
| Risk | V10 divergence threshold produces false positives on small spec folders | Medium | Calibrate threshold against real spec folder sizes; use ratio-based detection, not absolute counts |
| Risk | Removing synthetic descriptions from trigger input reduces trigger phrase coverage | Low | Real session content should produce more relevant triggers; synthetic descriptions were noise |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-001**: ~~Session ID: require `expectedSessionId` (breaking change) or accept optionally with mtime fallback?~~ **RESOLVED**: `sessionHints` is optional (`ClaudeSessionHints` with nullable fields). The parameter is accepted optionally with fallback degradation when unavailable.
- **OQ-002**: ~~Contamination penalty ownership boundary: 011 triggers contamination detection and calls the `hadContamination` parameter defined by 001-quality-scorer-unification. 001 owns the scorer interface; 011 owns the validation trigger.~~ **RESOLVED**: Both V1 and V2 scorers already accept `hadContamination` and apply the -0.25 / cap 0.6 penalty. Ownership is shared: scorer interface is in the scorer modules; contamination detection trigger is in the validator.
<!-- /ANCHOR:questions -->

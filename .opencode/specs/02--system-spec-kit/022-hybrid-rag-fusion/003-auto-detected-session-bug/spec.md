---
title: "Feature Specification: Auto-Detected Session Selection Bug [template:level_2/spec.md]"
description: "Auto-detection can select archived or irrelevant spec folders by mtime alone, causing continuation commands to run in the wrong context. This spec defines deterministic folder selection and low-confidence confirmation behavior."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "auto-detected session bug"
  - "spec selection"
  - "resume command wrong folder"
  - "mtime distortion"
  - "spec core"
importance_tier: "high"
contextType: "implementation"
---
# Feature Specification: Auto-Detected Session Selection Bug

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
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-folder auto-detection can select stale or archived paths when recent modification time is misleading. In the reported failure, detection selected an archived folder instead of active work under `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`. This misroutes `/spec_kit:resume`, `/spec_kit:handover`, and related workflows to the wrong session context.

### Purpose
Ensure spec-folder auto-detection consistently prefers active non-archived work, handles `specs/` and `.opencode/specs/` aliases deterministically, and requires user confirmation when confidence is low.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deterministic candidate normalization and ranking in spec-folder auto-detection.
- Explicit preference for active non-archived folders over archived or fixture paths.
- Low-confidence confirmation or safe fallback behavior for ambiguous selections.

### Out of Scope
- Changes to memory embedding/index ranking unrelated to spec folder selection logic.
- New command features unrelated to auto-detected session selection.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/spec-folder/folder-detector.ts` | Modify | Canonicalize aliases, filter/score candidates, and enforce deterministic selection rules. |
| `.opencode/skill/system-spec-kit/scripts/spec-folder/alignment-validator.ts` | Modify | Align low-confidence decision thresholds and confirmation handling used by folder selection. |
| `.opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js` | Modify | Add regression tests for archive preference, alias normalization, and mtime distortion scenarios. |
| `.opencode/command/spec_kit/resume.md` | Modify | Update command behavior notes to match deterministic selection and low-confidence confirmation. |
| `.opencode/command/spec_kit/handover.md` | Modify | Keep handover command guidance consistent with new selection/fallback rules. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Prefer active non-archived specs | Given mixed candidates, auto-detection excludes archive and test-fixture folders by default and selects an active non-archived folder unless user explicitly provided a different path. |
| REQ-002 | Deterministic alias handling for `specs/` and `.opencode/specs/` | Equivalent folder targets resolve to one canonical identity and produce the same final selection regardless of alias form in input or filesystem ordering. |
| REQ-003 | Resist mtime distortion | Selection does not rely on raw mtime alone; regression tests prove correctness when unrelated bulk touch/re-index operations skew mtimes. |
| REQ-004 | Low-confidence confirmation/fallback | When top candidates are ambiguous or below confidence threshold, workflow requires explicit user confirmation or falls back to a safe deterministic option with a clear warning. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Selection rationale visibility | Logs or output explain why a folder was chosen (filters applied, confidence, and tie-break rationale) to support debugging. |
| REQ-006 | Regression coverage | Automated tests cover the four acceptance dimensions in REQ-001 through REQ-004 and fail on pre-fix behavior. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Auto-detection never selects a `z_archive` or test-fixture folder when an active non-archived candidate exists.
- **SC-002**: `specs/...` and `.opencode/specs/...` references resolve consistently to the same canonical selection result.
- **SC-003**: Test scenarios with intentionally distorted mtimes still choose the intended active folder.
- **SC-004**: Ambiguous selections trigger explicit confirmation or documented fallback behavior instead of silent misrouting.

### Acceptance Scenarios
- **Given** a candidate set with one active folder and one archived folder, **when** auto-detect runs, **then** the active non-archived folder is selected.
- **Given** equivalent folder references through `specs/` and `.opencode/specs/`, **when** selection executes, **then** canonical resolution yields the same final folder.
- **Given** mtimes are distorted by bulk touch operations, **when** ranking runs, **then** the selection remains stable for the true active folder.
- **Given** top candidates are close and below confidence threshold, **when** auto-detect cannot decide confidently, **then** it requests confirmation or applies deterministic fallback.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing folder-detection priority chain | Reordering priorities can regress CLI/data explicit path behavior | Preserve Priority 1 and Priority 2 precedence with regression tests. |
| Dependency | Alignment scoring thresholds | Mis-tuned threshold may over-prompt users | Keep threshold explicit and cover boundary values in tests. |
| Risk | Over-filtering candidate folders | Valid active folders could be excluded | Limit exclusions to archive/fixture patterns and add override path support. |
| Risk | Non-deterministic tie handling | Different environments may choose different folders | Define stable tie-breakers (confidence, canonical path, deterministic sort). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Auto-detection should complete in under 250ms p95 for up to 500 candidate folders on local disk.
- **NFR-P02**: Confirmation path should add no more than one prompt interaction in low-confidence mode.

### Security
- **NFR-S01**: Folder normalization must reject path traversal and preserve existing safe path handling.
- **NFR-S02**: Alias canonicalization must not allow selecting folders outside approved `specs/` or `.opencode/specs/` roots.

### Reliability
- **NFR-R01**: Same input and same filesystem state should always yield the same selected folder.
- **NFR-R02**: Selection behavior remains correct even when mtimes are uniformly modified by batch operations.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: if no explicit folder and no candidates exist, emit standard "no spec folder found" guidance.
- Maximum candidate set: deterministic ranking works with deep parent/child phase trees and many siblings.
- Invalid format: malformed spec folder identifiers are rejected with clear expected format messaging.

### Error Scenarios
- External service failure: if session-learning DB lookup fails, fall through to deterministic filesystem detection.
- Filesystem stat failure: unreadable candidates are skipped without aborting the whole selection flow.
- Concurrent access: if folder contents change during scan, re-sort remaining valid candidates and continue deterministically.

### State Transitions
- Partial completion: if confidence cannot be established, pause and require confirmation before proceeding.
- Session expiry: if prior active session no longer exists, select best active candidate and explain fallback reason.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Focused bug fix across detection logic, command docs, and targeted tests. |
| Risk | 18/25 | Misrouting risk is high because wrong folder corrupts downstream workflow context. |
| Research | 10/20 | Existing detector and alignment modules already identified; moderate analysis only. |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- No blocking open questions at documentation time; confirmation threshold constants may be tuned during implementation using test evidence.
<!-- /ANCHOR:questions -->

---

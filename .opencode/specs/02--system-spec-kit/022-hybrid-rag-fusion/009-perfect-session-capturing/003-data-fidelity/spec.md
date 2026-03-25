---
title: "Feature Specification: Data Fidelity"
description: "Preserve normalized data fidelity with visible drop reporting through the pipeline."
---
# Feature Specification: Data Fidelity

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
| **Completed** | 2026-03-17 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 3 |
| **Predecessor** | [002-contamination-detection](../002-contamination-detection/spec.md) |
| **Successor** | [004-type-consolidation](../004-type-consolidation/spec.md) |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-03 |
| **Sequence** | A2, D1, D2 |
<!-- /ANCHOR:metadata -->

---

### Phase Context

This is **Phase 3** of the Perfect Session Capturing specification.

**Scope Boundary**: Normalization is lossy at multiple pipeline boundaries.
**Dependencies**: 002-contamination-detection
**Deliverables**: Preserved ACTION/_provenance/_synthetic metadata fields through FILES normalization; coerced object-based facts to strings instead of dropping them
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Normalization is lossy at multiple pipeline boundaries. File metadata fields (`ACTION`, `_provenance`, `_synthetic`) are dropped during normalization. Object-based facts are silently discarded instead of being coerced to strings. Manual decision enrichment fields (`_manualDecision.fullText`, `chosenApproach`, `confidence`) are created by `transformKeyDecision()` but never consumed by `extractDecisions()`. Observation truncation to `MAX_OBSERVATIONS` happens silently with no logging. Tool-call detection, phase classification, and other shared logic is reimplemented across 2-3 extractors.

### Purpose

Preserve richer data through the normalization pipeline by retaining file metadata, coercing object-based facts, wiring manual decision enrichment into the extraction path, and adding truncation logging so data loss is visible rather than silent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Preserve `ACTION`, `_provenance`, `_synthetic` metadata fields through FILES normalization
- Coerce object-based facts to strings instead of dropping them
- Wire `_manualDecision` enrichment fields into `extractDecisions()` consumption
- Add warning log when observation truncation to `MAX_OBSERVATIONS` occurs

### Out of Scope

- Rewriting extractor architecture -- only extracting shared logic into a common module
- Changing `MAX_OBSERVATIONS` value -- the limit stays the same, only logging is added
- Modifying the template rendering pipeline -- only normalization and extraction boundaries change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/utils/input-normalizer.ts` | Modify | Preserve `ACTION`, `_provenance`, `_synthetic` in FILES normalization |
| `scripts/extractors/collect-session-data.ts` | Modify | Add warning log when observation count exceeds `MAX_OBSERVATIONS` |
| `scripts/extractors/decision-extractor.ts` | Modify | Read `_manualDecision.fullText`, `chosenApproach`, `confidence` enrichment fields |
| `scripts/extractors/file-extractor.ts` | Modify | Coerce object-based facts to strings instead of silently dropping them |
| `scripts/extractors/conversation-extractor.ts` | Modify | Coerce object-based facts to strings (same issue as file-extractor; R-03 applies here too) |
| `scripts/utils/fact-coercion.ts` | Create | Shared fact-coercion helper for displayable fact text with structured drop logging (REQ-005, REQ-006) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | FILES metadata preserved through normalization (`ACTION`, `_provenance`, `_synthetic`) | Normalized file entries retain these fields when present in raw input |
| REQ-002 | Object-based facts coerced to strings instead of silently dropped | Facts with object values appear as JSON-stringified entries rather than vanishing |
| REQ-003 | `_manualDecision` enrichment fields consumed by `extractDecisions()` | Decisions include `fullText`, `chosenApproach`, and `confidence` when `_manualDecision` is present |
| REQ-004 | Observation truncation to `MAX_OBSERVATIONS` logged with warning | A warning log entry is emitted when observations are truncated, showing original vs retained count |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Centralize shared extraction helpers (tool-call detection, phase classification, duration calculation, manual decision parsing) into a single shared module | Shared helpers imported by 2+ extractors; no reimplemented logic across extractor files |
| REQ-006 | Instrument silent data drops with counters/logging for filtered prompts, ignored object facts, discarded metadata | Each drop point emits a structured log entry with field path, drop reason, and count |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No silent data loss at pipeline boundaries -- every drop or truncation is either preserved or logged
- **SC-002**: Manual decision enrichment flows through from `transformKeyDecision()` to rendered output

### Acceptance Scenarios

1. **Given** normalized FILES entries with metadata fields, **when** normalization completes, **then** `ACTION`, `_provenance`, and `_synthetic` remain present when provided.
2. **Given** object-shaped fact payloads, **when** extraction runs, **then** facts are coerced into readable string output instead of being dropped.
3. **Given** enriched `_manualDecision` input, **when** decision extraction runs, **then** enriched values flow through into decision output.
4. **Given** more observations than `MAX_OBSERVATIONS`, **when** truncation occurs, **then** a structured warning records original and retained counts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | R-04 type consolidation (004-type-consolidation) | High | Canonical `FileChange` type must include metadata fields before normalization can preserve them; coordinate type definitions |
| Risk | Preserving additional metadata increases normalized payload size | Low | Metadata fields are small strings; no measurable performance impact expected |
| Risk | Object-to-string coercion may produce unhelpful stringified output | Medium | Use `JSON.stringify` with readable formatting; add type annotation prefix for clarity |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at this time -- requirements are fully specified from research R-03
<!-- /ANCHOR:questions -->

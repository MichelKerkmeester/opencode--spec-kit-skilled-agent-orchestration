---
title: "Implementation Plan: [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/003-data-fidelity/plan]"
description: "title: \"Implementation Plan: Data Fidelity\""
trigger_phrases:
  - "implementation"
  - "plan"
  - "003"
  - "data"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Data Fidelity

This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.


<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | generate-context.js pipeline (normalizer, extractors) |
| **Storage** | None (in-pipeline data preservation) |
| **Testing** | Vitest |

### Overview

This plan implements a data preservation pattern: extend normalized types to include metadata fields, fix coercion at each boundary where data is currently dropped, wire manual decision enrichment fields into the extraction path, and add truncation logging. The implementation order follows pipeline flow -- types first, then normalization, then extraction, then logging.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (R-04 type consolidation)

### Definition of Done

- [x] All acceptance criteria met (REQ-001 through REQ-006)
- [x] Tests passing -- no silent data loss at any boundary
- [x] Docs updated (spec/plan in this folder)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Data preservation -- extend normalized types, fix coercion at each boundary, wire enrichment fields, add observability.

### Key Components

- **`input-normalizer.ts`**: FILES normalization extended to carry `ACTION`, `_provenance`, `_synthetic` through to normalized output
- **`file-extractor.ts`**: Object-based fact handling changed from silent drop to `JSON.stringify` coercion
- **`decision-extractor.ts`**: `extractDecisions()` updated to read `_manualDecision.fullText`, `chosenApproach`, `confidence`
- **`collect-session-data.ts`**: Truncation logging added at `MAX_OBSERVATIONS` boundary

### Data Flow

1. Raw input arrives with FILES containing `ACTION`, `_provenance`, `_synthetic` metadata
2. `input-normalizer.ts` preserves metadata fields in normalized `FileChange` entries
3. `file-extractor.ts` processes facts -- objects are coerced to strings, not dropped
4. `decision-extractor.ts` reads `_manualDecision` enrichment from `transformKeyDecision()` output
5. `collect-session-data.ts` truncates observations at `MAX_OBSERVATIONS` with warning log
6. Preserved data flows through to template rendering
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Extend Normalized Types

- [x] Add `ACTION?: string`, `_provenance?: string`, `_synthetic?: boolean` to the `FileChange` interface (coordinate with R-04 if type is canonical there)
- [x] Ensure normalizer passthrough does not strip unknown fields

### Phase 2: Fix FILES Metadata Preservation

- [x] Update `input-normalizer.ts` to copy `ACTION`, `_provenance`, `_synthetic` from raw input to normalized entries
- [x] Add test: normalized output retains metadata when present in raw input
- [x] Add test: normalized output works correctly when metadata is absent (no breakage)

### Phase 3: Fix Object-Based Fact Coercion

- [x] Update `file-extractor.ts` to detect object-type facts
- [x] Coerce objects to `JSON.stringify(value, null, 2)` with a type prefix (e.g., `[object] ...`)
- [x] Add test: object facts appear as stringified entries, not missing entries

### Phase 4: Wire Manual Decision Enrichment

- [x] Update `extractDecisions()` in `decision-extractor.ts` to check for `_manualDecision`
- [x] When present, populate decision `fullText`, `chosenApproach`, `confidence` from enrichment
- [x] Add test: decisions include enrichment fields when `_manualDecision` is provided by `transformKeyDecision()`

### Phase 5: Add Truncation Logging

- [x] Add `console.warn` or structured logger call when observation count exceeds `MAX_OBSERVATIONS`
- [x] Log original count and retained count
- [x] Add test: warning is emitted when observations are truncated

### Phase 6: Centralize Shared Extraction Helpers

- [x] Extract shared fact-coercion helper into `scripts/utils/fact-coercion.ts` (REQ-005)
- [x] Update file, conversation, decision, and collect-session-data extractors to import the shared helper (REQ-005)

### Phase 7: Instrument Silent Data Drops

- [x] Add structured log entries for fact-coercion drop points with field path, drop reason, and count (REQ-006)
- [x] Ensure drop logs emit spec/session identifiers without content leakage (REQ-006)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | FILES metadata preservation through normalization | Vitest |
| Unit | Object-based fact coercion (object in, string out, not dropped) | Vitest |
| Unit | Manual decision enrichment consumption by `extractDecisions()` | Vitest |
| Unit | Observation truncation warning logging | Vitest |
| Integration | End-to-end: raw input with metadata and objects through to rendered output | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| R-04 type consolidation (004-type-consolidation) | Internal | Yellow | `FileChange` type must include metadata fields; if R-04 is not yet complete, metadata fields can be added as optional properties with a TODO for canonical migration |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Preserved metadata causes downstream rendering issues or test failures
- **Procedure**: Revert metadata field additions in `input-normalizer.ts`; object coercion and truncation logging are independent and can be reverted separately
<!-- /ANCHOR:rollback -->

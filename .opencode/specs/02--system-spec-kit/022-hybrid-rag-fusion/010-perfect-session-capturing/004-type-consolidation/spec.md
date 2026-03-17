---
title: "Feature Specification: Type Consolidation"
description: "Consolidate canonical shared types (FileChange, DecisionRecord, etc.) across the pipeline."
---
# Feature Specification: Type Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 4 of 16 |
| **Predecessor** | 003-data-fidelity |
| **Successor** | 005-confidence-calibration |
| **Handoff Criteria** | validate.sh + test suite passing |
| **R-Item** | R-04 |
| **Sequence** | A1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Canonical typing is partial and inverted. `session-types.ts` imports 4 core shapes (`FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry`) from extractor files instead of owning them, creating an inverted dependency where the type file depends on its consumers. `SessionData` uses `[key: string]: unknown` as an index signature, which masks 15+ undeclared but real fields and prevents TypeScript from catching field access errors. Eight or more `CollectedDataFor*` subset interfaces are scattered across extractor files, each redeclaring partial views of the same canonical data.

### Purpose

Move `FileChange`, `ObservationDetailed`, `ToolCounts`, and `SpecFileEntry` into `types/session-types.ts` as canonical definitions. Tighten `SessionData` by explicitly modeling its real fields and removing the `[key: string]: unknown` escape hatch. Consolidate the scattered `CollectedDataFor*` subsets using `Pick`/`Omit` from canonical types.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Canonicalize `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry` in `session-types.ts`
- Explicitly model `SessionData` fields for `implementation-guide`, `pre/postflight`, `continue-session`, and other known real fields
- Make `PhaseEntry.ACTIVITIES` required (always populated in practice)
- Consolidate `CollectedDataFor*` subsets using `Pick`/`Omit` from canonical types
- Remove `[key: string]: unknown` from `SessionData` after all fields are explicitly modeled

### Out of Scope

- Adding new fields to `SessionData` beyond what already exists undeclared -- only modeling what is already used
- Changing extractor behavior -- extractors continue to produce the same data, just with canonical types
- Refactoring extractor logic -- only import paths and type references change

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/types/session-types.ts` | Modify | Add 4 leaked types as canonical definitions, expand `SessionData` with explicit fields, make `PhaseEntry.ACTIVITIES` required |
| `scripts/extractors/file-extractor.ts` | Modify | Remove local `FileChange` definition, re-export from `session-types` |
| `scripts/extractors/session-extractor.ts` | Modify | Remove local type definitions, re-export from `session-types` |
| `scripts/extractors/collect-session-data.ts` | Modify | Use canonical types, replace local `CollectedDataFor*` with `Pick`/`Omit` from canonical |
| `scripts/core/workflow.ts` | Modify | Import types from `session-types` instead of extractor files |
| `scripts/extractors/conversation-extractor.ts` | Modify | Replace local `CollectedDataForConversation` with `Pick` from canonical type |
| `scripts/extractors/decision-extractor.ts` | Modify | Replace local `CollectedDataForDecisions` with `Pick` from canonical type |
| `scripts/extractors/diagram-extractor.ts` | Modify | Replace local `CollectedDataForDiagrams` with `Pick` from canonical type |
| `scripts/spec-folder/alignment-validator.ts` | Modify | Replace local `CollectedDataForAlignment` with `Pick`/`Omit` from canonical type |
| `scripts/utils/spec-affinity.ts` | Modify | Replace local `CollectedDataForSpecAffinity` with `Pick`/`Omit` from canonical type |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `FileChange`, `ObservationDetailed`, `ToolCounts`, `SpecFileEntry` canonical in `session-types.ts` | These types are defined in `session-types.ts` and all other files import from there |
| REQ-002 | `SessionData` explicitly models `implementation-guide`, `pre/postflight`, `continue-session` fields | These fields have typed declarations instead of relying on index signature |
| REQ-003 | `PhaseEntry.ACTIVITIES` made required (not optional) | TypeScript enforces presence of ACTIVITIES on all PhaseEntry values |
| REQ-004 | `CollectedDataFor*` subsets consolidated using `Pick`/`Omit` from canonical types | No more than 2 subset interfaces remain, derived from canonical types |
| REQ-005 | `[key: string]: unknown` removed from `SessionData` after explicit modeling | TypeScript compilation catches field access errors that were previously masked |
| REQ-006 | `OutcomeEntry.TYPE` handling normalized — make required or provide default | `OutcomeEntry.TYPE` is either required in the interface (always set on real path) or has an explicit default; simulation path aligned |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| — | None — all requirements are P0 for this foundational change | — |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: TypeScript compilation catches field access errors that were previously masked by the `[key: string]: unknown` index signature
- **SC-002**: No extractor file owns types that should be canonical -- all 4 leaked types live in `session-types.ts`

### Acceptance Scenarios

1. **Given** canonical type definitions are centralized, **when** extractor files import core shapes, **then** they import from `session-types.ts` instead of local type ownership.
2. **Given** `PhaseEntry` construction paths, **when** type checking runs, **then** `ACTIVITIES` is required and missing values are surfaced.
3. **Given** `SessionData` field usage outside declared keys, **when** index-signature removal is complete, **then** undeclared accesses fail type checking until modeled explicitly.
4. **Given** subset data interfaces in extractor modules, **when** consolidation is applied, **then** subsets derive from canonical types via `Pick`/`Omit` without redeclaration drift.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None -- foundational type change | N/A | This is the first phase in the A-sequence and has no upstream dependencies |
| Risk | Removing index signature exposes undiscovered field accesses | High | Run full TypeScript compilation after removal; fix all errors before merging |
| Risk | Extractor re-export changes break import paths in test files | Medium | Update test imports in the same changeset; run full test suite |
| Risk | `ACTIVITIES` made required may break code paths that construct `PhaseEntry` without it | Medium | Audit all `PhaseEntry` construction sites before making the field required |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at this time -- requirements are fully specified from research R-04
<!-- /ANCHOR:questions -->

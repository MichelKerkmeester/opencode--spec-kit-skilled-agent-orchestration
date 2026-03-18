---
title: "Feature Specification: Runtime Contract And Indexability [template:level_1/spec.md]"
description: "Document the shipped validation-rule metadata and explicit write/index disposition model for session capturing."
trigger_phrases:
  - "phase 018"
  - "runtime contract"
  - "indexability"
  - "write and index"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Runtime Contract And Indexability

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + phase-child-header | v2.2 -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 18 of 20 |
| **Predecessor** | 017-stateless-quality-gates |
| **Successor** | 019-source-capabilities-and-structured-preference |
| **Handoff Criteria** | The write/index policy is documented as shipped behavior and the next phase can build on that contract. |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-18 |
| **Branch** | `010-perfect-session-capturing/018-runtime-contract-and-indexability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Before this follow-up, the runtime contract for post-render validation still lived mostly in code and audit prose. Maintainers needed one phase-local spec that explains why write success and index success are no longer governed by a single boolean.

### Purpose
Document the shipped rule-metadata registry and the explicit `abort_write`, `write_skip_index`, and `write_and_index` dispositions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Validation rule metadata in `scripts/memory/validate-memory-quality.ts`
- Explicit write/index policy in `scripts/core/workflow.ts`
- Indexing status persistence in `scripts/core/memory-indexer.ts`
- Contract documentation updates in the session-capturing feature catalog and manual playbook

### Out of Scope
- Typed source-capability policy changes, which belong to phase `019`
- Retained live artifact refresh, which belongs to phase `020`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` | Modify | Add rule metadata and disposition helpers |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Replace the old boolean indexing gate with explicit dispositions |
| `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` | Modify | Persist the new indexing status values |
| `.opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/12-session-capturing-pipeline-quality.md` | Modify | Record the runtime contract clearly |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define first-class validation rule metadata | Each rule has severity, write/index policy, and rationale |
| REQ-002 | Use explicit write/index dispositions | The workflow uses `abort_write`, `write_skip_index`, or `write_and_index` |
| REQ-003 | Keep V10 indexable when upstream gates pass | V10-only saves can still write and index |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep write-only indexing policy explicit | Rules like V2 can write while intentionally skipping semantic indexing |
| REQ-005 | Persist indexing reason metadata | Metadata explains why indexing was skipped or allowed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase `018` explains the rule-metadata contract in one place.
- **SC-002**: Phase `018` records that V10-only failures can write and index.
- **SC-003**: Phase `018` records that some failures can intentionally write but skip indexing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current shipped runtime behavior | High | Document only what the runtime already does |
| Risk | Write and index semantics drift apart again | Medium | Keep the disposition model explicit in docs and tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Live retained proof is handled in phase `020`.
<!-- /ANCHOR:questions -->

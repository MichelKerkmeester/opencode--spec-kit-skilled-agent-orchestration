---
title: "Feature Specification: Research Remediation Merged Wave 1 and Wave 2 [template:level_1/spec.md]"
description: "This merged remediation phase preserves the shipped Wave 1 baseline and the Wave 2 hybrid-enrichment fixes in one canonical successor pack."
trigger_phrases:
  - "research remediation wave 2"
  - "018 research remediation"
  - "phase 1b remediation"
importance_tier: "high"
contextType: "implementation"
---
# Feature Specification: Research Remediation Merged Wave 1 and Wave 2

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-19 |
| **Branch** | `018-research-remediation` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Predecessor** | `017-json-primary-deprecation` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Wave 1 fixed the first large remediation set, but the hybrid-enrichment path still contained correctness gaps. Deep research found mutation safety issues, weak boundary validation, type-unsafe casts, inconsistent status and progress combinations, and tests that did not fully cover the enriched JSON-mode path.

### Purpose
This merged successor phase preserves the shipped Wave 1 baseline and adds the targeted hybrid-enrichment fixes needed for a trustworthy JSON-mode follow-up without splitting the remediation story across two leaf phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Preserve the shipped Wave 1 remediation baseline within this merged remediation phase.
- Fix Phase 1B hybrid-enrichment issues in workflow, input normalization, and session-data extraction.
- Add targeted tests for mutation safety, field validation, empty-string coalescing, and status-progress reconciliation.
- Document the implementation and verification evidence for both remediation waves in one canonical successor phase.

### Out of Scope
- Reopening the already-shipped Wave 1 changes except where Wave 2 builds on them.
- Broader Wave 3 research backlog items and medium/low follow-ups with no immediate correctness impact.
- Reclassifying the parent pack beyond the current direct-child phase layout.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | Modify | Fix hybrid-enrichment mutation safety and value-priority behavior |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | Modify | Reconcile status and completion-percent combinations |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modify | Preserve hybrid-enrichment blocks and validate constrained nested fields |
| `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modify | Cover JSON-mode hybrid-enrichment inputs and validation |
| `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` | Modify | Cover enrichment safety and mutation boundaries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Hybrid enrichment must not mutate caller-owned file arrays | Returned enriched file data no longer corrupts the original input object |
| REQ-002 | Structured session and git blocks must survive normalization safely | `session`, `git`, `sessionSummary`, and `keyDecisions` remain available after normalization |
| REQ-003 | Status and completion percent must be internally consistent | Impossible combinations are reconciled before rendered output is produced |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Empty strings in git string fields must fall through to detected values | Git metadata uses the correct `||` or `??` behavior by field type |
| REQ-005 | Boundary validation must reject invalid nested hybrid-enrichment fields | Invalid enums, booleans, and out-of-range counters fail validation |
| REQ-006 | Wave 2 tests must prove the hybrid-enrichment path is covered | The new runtime-memory-inputs and task-enrichment test blocks pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Wave 1 remains documented as the shipped baseline and Wave 2 adds the targeted hybrid-enrichment follow-up cleanly on top.
- **SC-002**: The Phase 1B fixes resolve the mutation, validation, and status-reconciliation issues identified by deep research.
- **SC-003**: The added Wave 2 tests pass and document the intended JSON-mode behavior.

### Acceptance Scenarios

1. **Given** the Wave 2 follow-up is applied on top of the Wave 1 baseline, **When** JSON-mode hybrid enrichment runs, **Then** nested session and git fields survive normalization and produce coherent output.
2. **Given** the new Phase 1B tests are run, **When** the mutation-safety, validation, and reconciliation checks execute, **Then** the targeted hybrid-enrichment path verifies cleanly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shipped Wave 1 remediation baseline | High | Keep the merged successor phase additive rather than rewriting the prior wave |
| Dependency | Phase 1B deep research findings | High | Implement the bounded corrective steps directly against the reported issues |
| Risk | Hybrid-enrichment fixes could regress prior JSON-mode behavior | Medium | Add narrow runtime-memory-inputs and task-enrichment tests for the changed paths |
| Risk | Value-priority fixes could mix field semantics | Medium | Keep string fields on `||` fallthrough and boolean fields on `??` semantics |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which of the remaining medium and low Phase 1B findings, if any, deserve a separate follow-up phase instead of staying deferred?
- Does the broader research backlog still need a Wave 3 package, or did Wave 1 plus Wave 2 close the last correctness-critical gaps?
<!-- /ANCHOR:questions -->

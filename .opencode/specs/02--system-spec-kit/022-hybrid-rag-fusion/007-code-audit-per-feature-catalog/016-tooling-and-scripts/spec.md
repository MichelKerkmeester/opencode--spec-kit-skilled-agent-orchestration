---
title: "Feature Specification: tooling-and-scripts [template:level_2/spec.md]"
description: "The tooling-and-scripts feature catalog audit covers eight features with mixed FAIL/WARN outcomes, but this phase lacked Level 2 template structure. This rewrite preserves scope and remediation intent while standardizing traceability."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "tooling and scripts"
  - "tooling-and-scripts"
  - "code audit"
  - "tree thinning"
  - "architecture boundary enforcement"
  - "progressive validation"
  - "file watcher"
  - "standalone admin cli"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: tooling-and-scripts

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
| **Created** | 2026-03-10 |
| **Branch** | `016-tooling-and-scripts` |
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../015-retrieval-enhancements/spec.md |
| **Next Phase** | ../017-governance/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Tooling and Scripts feature catalog audit (`feature_catalog/16--tooling-and-scripts/`) captures eight features and concrete FAIL/WARN findings, but the phase artifacts were not aligned to the Level 2 SpecKit structure. Without standardized anchors and sections, traceability between audit scope, remediation backlog, and verification status is weaker than required.

### Purpose
Create a Level 2-compliant specification that preserves the existing Tooling and Scripts audit intent and makes execution/verification consistent across phase artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `spec.md`, `tasks.md`, `plan.md`, and `checklist.md` to exact Level 2 template structure.
- Preserve the 8-feature Tooling and Scripts audit scope and criteria (correctness, standards, behavior, testing, playbook).
- Preserve prioritized remediation intent (P0/P1/P2) and verification context.

### Out of Scope
- Implementing production code fixes in `mcp_server/` and `scripts/` - this phase documents and structures remediation work only.
- Modifying `description.json` or anything under `memory/` or `scratch/` - explicitly excluded by request.
- Creating `implementation-summary.md` - not requested in this rewrite.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016-tooling-and-scripts/spec.md` | Modify | Rewrite scope and requirements into Level 2 spec template with required anchors/comments. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016-tooling-and-scripts/tasks.md` | Modify | Convert remediation backlog into Level 2 phased task structure. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016-tooling-and-scripts/plan.md` | Modify | Convert audit methodology into Level 2 implementation plan format. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/016-tooling-and-scripts/checklist.md` | Modify | Convert per-feature findings into Level 2 verification checklist format. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 phase documents conform to Level 2 templates exactly. | Each file includes YAML frontmatter, SPECKIT comments, and all required ANCHOR pairs in template order. |
| REQ-002 | Existing Tooling and Scripts audit content is preserved through structured mapping. | Feature inventory, audit criteria, and remediation themes remain represented in spec/plan/tasks/checklist. |
| REQ-003 | Required metadata values are consistent across rewritten artifacts. | Level is 2, status is Draft, and date fields are set to 2026-03-10 where present in templates. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Trigger phrases reflect folder and feature semantics. | Frontmatter includes tooling-and-scripts plus feature keywords (tree thinning, architecture boundary, progressive validation, watcher, admin CLI). |
| REQ-005 | Task/checklist states use markdown checkboxes and remain actionable. | Items use `- [ ]`/`- [x]` with preserved remediation intent and verification evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` match Level 2 template layout with intact anchors/comments.
- **SC-002**: All 8 Tooling and Scripts features remain represented in structured audit/remediation context.
- **SC-003**: P0/P1/P2 remediation intent remains traceable and verification-ready after rewrite.

### Acceptance Scenarios

1. **Given** the documented requirements for this phase, **When** a reviewer walks the updated packet, **Then** each requirement has a matching verification path in tasks and checklist artifacts.
2. **Given** current implementation behavior, **When** spec statements are compared with source and test references, **Then** no contradictory behavior claims remain in the phase packet.
3. **Given** the updated verification evidence, **When** checklist entries are audited, **Then** each completed P0/P1 item carries inline evidence and traceable context.
4. **Given** Level 2 template constraints, **When** the spec validator runs, **Then** acceptance-scenario coverage and section integrity checks pass without structural warnings.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feature_catalog/16--tooling-and-scripts/*.md` fidelity | Stale catalog mappings can propagate audit inaccuracies. | Preserve explicit file references and call out mapping gaps in tasks/checklist. |
| Dependency | Level 2 templates under `.opencode/skill/system-spec-kit/templates/level_2/` | Structural drift if alternate templates are used. | Use canonical in-repo Level 2 templates as the formatting source of truth. |
| Risk | Template migration may compress detailed findings | Remediation tasks may lose specificity if over-summarized. | Preserve each original remediation theme as discrete Phase 2 tasks. |
| Risk | External instruction file access unavailable (`/tmp`) | Direct instruction text could not be read in this environment. | Match in-repo Level 2 templates exactly and preserve requested metadata/checkbox/date constraints. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Rewritten artifacts should remain scannable and support quick triage by feature and priority.
- **NFR-P02**: Cross-file navigation between spec/plan/tasks/checklist should require minimal lookup effort.

### Security
- **NFR-S01**: Documentation must not include secrets or sensitive operational values.
- **NFR-S02**: Scope must remain constrained to the 4 requested files.

### Reliability
- **NFR-R01**: Anchor names and section ordering remain stable for validation tooling.
- **NFR-R02**: Priority/severity intent stays consistent across all rewritten artifacts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty category: keep section with explicit status/evidence instead of dropping it.
- High finding density: summarize by remediation theme while keeping issue identity.
- Invalid source mapping: treat stale/missing paths as explicit audit gaps.

### Error Scenarios
- External instruction file unavailable: fall back to canonical in-repo Level 2 templates.
- Catalog/code mismatch: preserve mismatch details as P0/P1 task entries.
- Concurrent edits: restrict updates to this folder's 4 documents only.

### State Transitions
- Draft to review: checklist verification counts must reflect actual checked items.
- Pending to complete: tasks/checklist can move from `[ ]` to `[x]` without structure changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four-document rewrite plus eight-feature audit context preservation |
| Risk | 17/25 | Multiple FAIL findings and mapping drifts must remain explicit |
| Research | 12/20 | Requires catalog-methodology-findings remap into strict template layout |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should checkpoint creation failure in admin CLI be promoted to a hard blocker or documented as best-effort behavior?
- Should watcher metrics export/test coverage be required before the Tooling and Scripts audit can be marked complete?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---
title: "Feature Specification: scoring-and-calibration [template:level_2/spec.md]"
description: "The scoring-and-calibration catalog has 17 features with mixed PASS/WARN/FAIL findings, but the phase documents are not aligned to Level 2 structure. This rewrite preserves findings while enforcing a verification-ready SpecKit format."
trigger_phrases:
  - "scoring"
  - "calibration"
  - "rrf"
  - "reranker"
  - "popularity"
  - "coherence"
  - "feature catalog"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: scoring-and-calibration

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
| **Branch** | `011-scoring-and-calibration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scoring-and-calibration feature catalog audit contains 17 features and substantial findings, but the phase documents are not formatted to the Level 2 SpecKit template. This makes verification less consistent and weakens traceability between scope, requirements, remediation tasks, and verification checkpoints.

### Purpose
Standardize this phase to Level 2 templates so the existing scoring-and-calibration findings are preserved and execution-ready.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `spec.md`, `tasks.md`, `plan.md`, and `checklist.md` to Level 2 template structure.
- Preserve feature inventory context and remediation backlog (P0/P1/P2).
- Preserve verification context, including major FAIL/WARN findings and test/playbook gaps.

### Out of Scope
- Changing implementation code in `mcp_server/` or `shared/` - tracked as remediation tasks only.
- Modifying `description.json`, `memory/`, or `scratch/` - explicitly excluded.
- Creating `implementation-summary.md` - not requested for this rewrite step.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/spec.md` | Modify | Reframe audit context into Level 2 spec structure |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/tasks.md` | Modify | Convert backlog into template-based phased task list |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/plan.md` | Modify | Convert methodology into Level 2 implementation plan |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/checklist.md` | Modify | Convert per-feature findings into verification checklist format |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 phase documents use Level 2 template structure | Each file includes Level 2 frontmatter, SPECKIT comments, and all required ANCHOR pairs |
| REQ-002 | Existing audit findings remain represented after rewrite | FAIL/WARN/PASS outcomes and remediation themes remain traceable across spec/tasks/checklist |
| REQ-003 | Required metadata values are set consistently | Level = 2, Status = Draft, and date fields use 2026-03-10 where applicable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Trigger phrases reflect scoring-and-calibration domain | Frontmatter includes scoring/calibration-specific keywords (e.g., rrf, reranker, coherence) |
| REQ-005 | Task and checklist state uses markdown checkboxes | All checklist/task states use `- [ ]` or `- [x]` notation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `spec.md`, `tasks.md`, `plan.md`, and `checklist.md` conform to Level 2 template layout with intact anchors.
- **SC-002**: The 17-feature scoring-and-calibration audit context remains preserved and actionable.
- **SC-003**: The remediation backlog remains prioritized and traceable (P0/P1/P2) in the rewritten tasks/checklist.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Level 2 template definitions in `.opencode/skill/system-spec-kit/templates/level_2/` | Wrong structure if templates drift | Mirror current in-repo template sections and anchors exactly |
| Dependency | Existing audit artifacts (`feature_catalog/*`, phase findings) | Loss of context if not mapped | Preserve findings by mapping remediation themes into requirements, tasks, and checklist evidence |
| Risk | Over-compression of detailed feature findings | Reduced usability for follow-up remediation | Keep key FAIL/WARN findings explicitly represented in checklist evidence and task descriptions |
| Risk | Template mismatch due inaccessible external instruction source | Potential formatting drift | Use canonical in-repo Level 2 templates as source of truth for structure |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each rewritten document should be scannable in under 5 minutes by a reviewer.
- **NFR-P02**: Cross-reference lookups between spec/plan/tasks/checklist should require at most 2 navigation hops.

### Security
- **NFR-S01**: Documentation must not introduce secrets, tokens, or sensitive environment values.
- **NFR-S02**: File scope must remain constrained to the 4 requested phase documents.

### Reliability
- **NFR-R01**: Template anchors and headings remain stable for automated tooling and validation.
- **NFR-R02**: Priority mapping (P0/P1/P2) remains consistent across documents.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty finding category: preserve section with explicit "NONE" rather than dropping context.
- Maximum finding density: summarize by remediation theme while retaining critical issue identity.
- Invalid format input: normalize prior bullet prose into table/list structures without losing meaning.

### Error Scenarios
- Missing external instruction file access: fallback to canonical in-repo Level 2 templates.
- Cross-document mismatch: resolve by preserving the stricter priority/severity interpretation.
- Concurrent edits to same phase docs: prefer deterministic template structure and explicit status markers.

### State Transitions
- Draft to review: checklist verification counts must reflect actual checked items.
- Pending to complete remediation: tasks can flip from `[ ]` to `[x]` without structural changes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Four document rewrites plus 17-feature context preservation |
| Risk | 18/25 | Potential loss of audit detail if remapped poorly |
| Research | 14/20 | Template conformance and priority mapping verification |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should per-feature playbook mapping (`NEW-050..065+`) be embedded directly in this phase checklist or maintained in feature files only?
- For unresolved WARN items, should future phases split catalog hygiene fixes from runtime code fixes?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

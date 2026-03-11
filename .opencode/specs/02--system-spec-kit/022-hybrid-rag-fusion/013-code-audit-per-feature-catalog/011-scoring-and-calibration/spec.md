---
# <!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
title: "Feature Specification: scoring-and-calibration [template:level_2/spec.md]"
description: "The scoring-and-calibration audit closed 17 cataloged features plus approved follow-up fixes for access-tracker flush behavior, targeted regressions, and RRF convergence wording. This spec records the true completed scope and aligned verification state."
template_source: "spec-core + level2-verify | v2.2"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-10 |
| **Branch** | `011-scoring-and-calibration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The scoring-and-calibration audit delivered code, test, and catalog fixes across 17 features, but the phase docs drifted after implementation. `spec.md` still described runtime work as out of scope, completion state was inconsistent across the Level 2 artifacts, and the approved follow-up fixes were not reflected in the closing narrative.

### Purpose
Capture the completed phase truthfully so reviewers can trace delivered work, follow-up fixes, and verification status without conflicting statements.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Preserve the full 17-feature scoring-and-calibration remediation scope in Level 2 completion docs.
- Record delivered code, test, and catalog work, including the approved follow-up fixes in `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts`, and `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`.
- Synchronize completion state, verification evidence, and summary language across all five Level 2 phase artifacts.

### Out of Scope
- Additional remediation beyond the already delivered scoring-and-calibration fixes and approved follow-up patch.
- Fresh workspace-wide verification beyond the targeted/package-local results already recorded for the implementation pass.
- Modifying `description.json`, `memory/`, or `scratch/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/spec.md` | Modify | Record the completed scope and aligned status |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/plan.md` | Modify | Reflect completed phases, done criteria, and truthful verification scope |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/tasks.md` | Modify | Preserve completed backlog and add follow-up tasks T022-T024 |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/checklist.md` | Modify | Inline verification evidence and follow-up-fix coverage |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/011-scoring-and-calibration/implementation-summary.md` | Modify | Summarize completed delivery and follow-up closure |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts` | Modify | Preserve accumulator state when threshold-triggered flush fails |
| `.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts` | Modify | Add threshold flush regression coverage |
| `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md` | Modify | Correct the RRF convergence wording to match shipped behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All five Level 2 phase documents reflect the completed implementation scope | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all report a completed state with no contradictory out-of-scope claims |
| REQ-002 | Blocker findings remain traceable to delivered remediation | The phase docs preserve the five FAIL resolutions plus follow-up corrections for access-tracker flush behavior and RRF convergence wording |
| REQ-003 | Follow-up fix coverage is explicit and completed | Tasks T022-T024 are recorded as done with evidence tied to the delivered code, test, and catalog changes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Verification claims stay truthful to actual rerun scope | The docs distinguish the earlier targeted implementation verification from this follow-up documentation-alignment pass |
| REQ-005 | Spec validation succeeds after alignment | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` returns exit code 0 or 1 for this folder |

### Acceptance Scenarios

- **Given** the phase is reviewed after follow-up fixes, **when** a reader checks scope, **then** the spec lists both the original remediation work and the approved follow-up patch.
- **Given** a reviewer compares `spec.md`, `plan.md`, `tasks.md`, and `checklist.md`, **when** they inspect status and completion state, **then** every artifact shows the phase as complete.
- **Given** a reviewer needs proof for the follow-up patch, **when** they inspect `tasks.md` and `checklist.md`, **then** they can trace T022-T024 to the access-tracker code, regression tests, and catalog correction.
- **Given** validation tooling scans the completed phase docs, **when** it resolves markdown references and template metadata, **then** the folder validates without error-level doc-integrity failures.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The completed scoring-and-calibration scope, including follow-up fixes, is represented consistently across all five Level 2 docs.
- **SC-002**: The 17-feature audit remains traceable to delivered code, test, and catalog work, including the five resolved FAIL findings and follow-up tasks T022-T024.
- **SC-003**: Validation passes without error-level documentation issues for this spec folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Level 2 templates in `.opencode/skill/system-spec-kit/templates/level_2/` | Template drift could invalidate validation | Mirror current headings, anchors, and template-source metadata |
| Dependency | Delivered artifacts in `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/` and `.opencode/skill/system-spec-kit/mcp_server/` | Missing trace links would make the completed docs non-auditable | Keep references repo-resolvable and tie follow-up tasks to concrete files |
| Risk | Overstating verification scope | Completion claims would become inaccurate | Separate earlier targeted implementation verification from the final doc-alignment validation pass |
| Risk | Leaving stale draft-era language in place | Reviewers could treat a completed phase as still open | Align metadata, scope, tasks, checklist, and implementation summary to the same completed state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The completed documentation set should stay scannable enough for a reviewer to verify closure in one pass.
- **NFR-P02**: Follow-up fixes should remain documented without implying broader reruns than actually occurred.

### Security
- **NFR-S01**: Documentation must not introduce secrets, tokens, or sensitive environment values.
- **NFR-S02**: File references must resolve within the repository and stay limited to the delivered scoring-and-calibration surfaces.

### Reliability
- **NFR-R01**: Template anchors and headings remain stable for automated tooling and validation.
- **NFR-R02**: Priority mapping (P0/P1/P2) remains consistent across documents and completed follow-up tasks.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty follow-up scope: do not invent new remediation beyond T022-T024.
- High-detail remediation history: summarize prior work without dropping the five FAIL resolutions.
- Markdown reference paths: use repo-resolvable `.md` paths so validation can resolve them.

### Error Scenarios
- Draft-era language survives in one artifact: treat the phase as incomplete until all five docs agree.
- Follow-up fixes are described as fresh broad verification: correct the language to reflect targeted scope only.
- Catalog wording diverges from shipped behavior: align the doc statement before closing the phase.

### State Transitions
- Draft to complete: status and scope language must change together across all Level 2 artifacts.
- Pending to complete remediation: tasks can flip from `[ ]` to `[x]` only when code, test, or catalog evidence exists.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | Five phase docs aligned against a completed 17-feature remediation set |
| Risk | 19/25 | Incorrect closure language would misstate implementation and verification truth |
| Research | 14/20 | Requires cross-checking spec docs against delivered code, tests, and catalog fixes |
| **Total** | **54/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS (RESOLVED)

- **Resolved (scope alignment):** Runtime and feature-catalog changes are part of the completed phase scope; they are no longer described as out of scope.
- **Resolved (follow-up patch closure):** The approved access-tracker regression fix, targeted test additions, and RRF wording correction are recorded as completed work in the same phase.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

---
title: "Feature Specification: ux-hooks [template:level_2/spec.md]"
description: "Audit the UX Hooks feature catalog for correctness, standards, behavior parity, and coverage gaps across 13 features. Produce prioritized findings that can drive implementation fixes and catalog alignment."
trigger_phrases:
  - "ux hooks"
  - "code audit"
  - "feature catalog"
  - "mutation hooks"
  - "checkpoint delete"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: ux-hooks

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
| **Created** | 2026-03-10 |
| **Branch** | `018-ux-hooks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The UX Hooks catalog includes 13 features whose documented "Current Reality" does not fully match implementation behavior in several high-impact areas. Findings include contract desynchronization (`confirmName` optionality), mixed-outcome auto-repair success over-reporting, silent hook failure handling, and stale test references. Without a structured audit artifact, remediation sequencing and verification remain inconsistent.

### Purpose
Create a feature-by-feature, evidence-backed audit that produces a prioritized remediation backlog and synchronized documentation targets for UX Hooks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 13 features in `feature_catalog/18--ux-hooks/` for correctness, standards alignment, behavior match, and test/playbook coverage.
- Capture per-feature findings with status (`PASS/WARN/FAIL`), issues, test gaps, and recommended fixes.
- Produce and maintain a prioritized remediation backlog (P0/P1/P2) with concrete source file targets.

### Out of Scope
- Implementing production code fixes in `mcp_server/` during this documentation pass - tracked separately in tasks.
- Auditing non-UX feature categories outside `feature_catalog/18--ux-hooks/` - separate audits own those categories.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/.../018-ux-hooks/spec.md` | Modify | Level 2 specification for UX Hooks audit scope and requirements |
| `.opencode/specs/.../018-ux-hooks/plan.md` | Modify | Methodology and execution plan mapped to Level 2 structure |
| `.opencode/specs/.../018-ux-hooks/tasks.md` | Modify | Prioritized remediation backlog and execution checklist |
| `.opencode/specs/.../018-ux-hooks/checklist.md` | Modify | Verification checklist with preserved feature findings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 13 UX Hooks features with structured findings | Every feature has status, code/standards notes, behavior match, test gaps, and recommended fix |
| REQ-002 | Produce actionable blocker findings for correctness/contract issues | Contract desync and mixed-repair outcome defects are explicitly captured with source references |
| REQ-003 | Preserve remediation backlog with explicit P0/P1/P2 prioritization | Backlog includes P0=2, P1=8, P2=7 items mapped to code or catalog files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Document test coverage and stale reference gaps | Missing `retry.vitest.ts` references and unasserted behavior paths are listed per impacted feature |
| REQ-005 | Capture playbook coverage outcomes for UX features | Features with missing NEW-095+ mappings are identified as coverage gaps |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: ✓ VERIFIED — All 13 features in `feature_catalog/18--ux-hooks/` audited with `PASS/WARN/FAIL` status, issue type, evidence, and recommended fix. Findings F-01–F-13 preserved in `checklist.md`.
- **SC-002**: ✓ VERIFIED — 17 tasks (P0=2, P1=8, P2=7) executed via 5 parallel agents; 439 tests across 7 files, all green. See `implementation-summary.md`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feature_catalog/18--ux-hooks/*.md` accuracy | Mis-prioritized fixes if catalog reality is stale | Cross-check each claim against source/test files before final status |
| Dependency | `mcp_server/handlers`, `mcp_server/hooks`, `mcp_server/tests` availability | Unable to validate behavior and test linkage | Use source references already captured in tasks/checklist where direct verification is unavailable |
| Risk | Stale test references (for example `retry.vitest.ts`) | False confidence in test coverage | Mark each stale reference explicitly and add catalog sync tasks |
| Risk | Silent catch behavior masks runtime failures | Hard-to-diagnose production regressions | Prioritize logging/observability tasks in P1 backlog |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit artifacts for all 13 features must be readable and scannable within a single review pass.
- **NFR-P02**: Priority and status metadata must allow deterministic triage without additional interpretation.

### Security
- **NFR-S01**: Documentation updates must not expose secrets, credentials, or sensitive runtime data.
- **NFR-S02**: Safety-critical contract requirements (for example required `confirmName`) must be unambiguous in specs/tasks.

### Reliability
- **NFR-R01**: Findings should remain reproducible from cited source paths and test references.
- **NFR-R02**: Template anchors/comments must remain intact to keep downstream tooling compatible.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Missing or empty feature files are recorded as explicit audit gaps.
- Maximum length: Large feature narratives are summarized into prioritized findings without dropping source references.
- Invalid format: Malformed markdown/frontmatter is treated as a documentation defect and flagged.

### Error Scenarios
- External service failure: If playbook metadata is unavailable, mark playbook coverage as `MISSING` with follow-up task.
- Network timeout: Not applicable for local audit execution; use existing references when live checks are blocked.
- Concurrent access: If source files change during audit, re-validate impacted findings before final sign-off.

### State Transitions
- Partial completion: Preserve completed feature findings and mark remaining features as pending.
- Session expiry: Audit can resume from saved spec/tasks/checklist artifacts without data loss.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 21/25 | 13-feature catalog, multiple handler/hook/test surfaces |
| Risk | 18/25 | Contract mismatch + silent failure patterns + stale test mapping |
| Research | 14/20 | Cross-file traceability and verification synthesis required |
| **Total** | **53/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should all `retry.vitest.ts` references be removed from UX feature catalog entries, or should a replacement test artifact be introduced?
- Should checkpoint delete success payload include both checkpoint id and deletion timestamp, or is name-level metadata sufficient?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

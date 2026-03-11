---
title: "Feature Specification: query-intelligence [template:level_2/spec.md]"
description: "Feature-centric code audit scope for the Query Intelligence category in hybrid-rag-fusion. Captures correctness, standards, behavior, testing, and playbook coverage requirements across six features with prioritized findings."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "query intelligence"
  - "query-intelligence"
  - "code audit"
  - "query complexity router"
  - "relative score fusion"
  - "channel min representation"
  - "dynamic token budget"
  - "query expansion"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: query-intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-03-10 |
| **Branch** | `012-query-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Query Intelligence phase already shipped code, test, and catalog fixes, but spec artifacts still contained docs-only framing and stale verification claims. This drift made completion status and evidence inconsistent across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.

### Purpose
Synchronize Level 2 spec artifacts to the verified implementation state so scope, completion, and verification evidence are accurate and internally consistent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Synchronize Level 2 artifacts to reflect verified implementation outcomes for Query Intelligence.
- Record code/test/catalog fixes already applied in prior review-fix tasks.
- Reconcile checklist body and summary totals so counts and completion status match.
- Keep deferred out-of-scope work explicitly marked.

### Out of Scope
- New production fixes beyond the verified patch set listed for this phase.
- Repo-wide lint/type debt cleanup causing `npm run check` failures outside task scope.
- Auditing categories outside `feature_catalog/12--query-intelligence/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/spec.md` | Modify | Rewrite to Level 2 spec template with mapped Query Intelligence audit scope. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/plan.md` | Modify | Update DoD and verification gates to match completed review-fix outcomes. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/tasks.md` | Modify | Align task evidence and verification metrics to verified repository state. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/checklist.md` | Modify | Reconcile checklist item statuses and summary totals with checklist body. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/012-query-intelligence/implementation-summary.md` | Modify | Record final implementation and verification outcomes with truthful metrics. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the verified implementation fixes applied during this phase with concrete file-level traceability. | Spec artifacts reference the completed fixes in `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/trace-propagation.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts`, and `.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md`, while also mirroring `.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts` as part of the verified targeted pass set. |
| REQ-002 | Preserve truthful verification outcomes across all in-scope Level 2 artifacts. | Artifacts consistently report: targeted tests passed (6 files, 165 tests), targeted ESLint passed on changed files, alignment verifier passed (0 findings), and `npm run check` failed for unrelated pre-existing repo-wide issues. |
| REQ-003 | Reconcile checklist item counts and completion totals. | Verification summary totals exactly match the checklist body and clearly identify deferred out-of-scope items. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep Level 2 structure intact while updating status content. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` retain anchors/SPECKIT comments/template sections while reflecting current state. |
| REQ-005 | Keep deferred work explicit and out-of-scope. | Deferred playbook work and unrelated repo-wide check failures remain clearly marked with rationale. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five in-scope artifacts report the same implementation and verification state without contradiction.
- **SC-002**: Checklist summary counts match checklist body counts exactly.
- **SC-003**: Out-of-scope deferred items remain explicit and justified.
<!-- /ANCHOR:success-criteria -->

---

## 6. ACCEPTANCE SCENARIOS

### Scenario 1 - Runtime fix traceability
**Given** the Query Intelligence phase shipped a real runtime propagation fix in `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
**When** the synchronized Level 2 artifacts describe phase scope and outcomes
**Then** they state that production code changed during this phase and do not describe the work as docs-only

### Scenario 2 - Verification status consistency
**Given** targeted verification passed for 6 files and 165 tests while `npm run check` still fails outside task scope
**When** a reviewer compares `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`
**Then** each artifact reports the same pass/warning split without overstating repo-wide health

### Scenario 3 - Checklist accounting accuracy
**Given** the checklist body contains completed, deferred, and optional items across P0, P1, and P2 priorities
**When** the verification summary totals are recalculated from the checklist body
**Then** the totals match exactly and deferred items remain explicitly identified

### Scenario 4 - Test-file traceability completeness
**Given** `.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts` appears in the verified targeted pass set
**When** task and specification artifacts summarize the verification surface
**Then** that file is mirrored as verification coverage without falsely claiming it was modified in this phase

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Verified review-fix outputs in code/tests/catalog | If docs diverge from merged implementation, completion claims become unreliable. | Use repository-verified changed-file list as source-of-truth for artifact synchronization. |
| Dependency | Validation scripts and targeted verification commands | Missing or stale command evidence can create false completion status. | Record exact verification outcomes, including known out-of-scope failures. |
| Risk | Checklist accounting drift | Summary totals can diverge from body status when items change. | Recount P0/P1/P2 directly from checklist body before finalizing summary table. |
| Risk | Overstating scope | Treating this as docs-only or full repo remediation misrepresents delivered work. | Keep scope explicit: implemented targeted fixes plus artifact synchronization only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit artifacts remain concise and scannable while preserving per-feature issue detail.
- **NFR-P02**: Findings support quick triage by maintaining explicit P0/P1/P2 priority mapping.

### Security
- **NFR-S01**: Audit outputs must not include secrets or sensitive runtime data.
- **NFR-S02**: Security-adjacent validation assumptions (if any) are explicitly marked when coverage is incomplete.

### Reliability
- **NFR-R01**: Findings remain reproducible via stable file-level references.
- **NFR-R02**: Prioritization and status remain consistent across spec, plan, tasks, and checklist.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. L2: EDGE CASES

### Data Boundaries
- Empty input: Features with no effective assertions are marked WARN/FAIL with explicit test-gap rationale.
- Maximum length: Long finding sets are split by feature and priority to preserve readability.
- Invalid format: Missing source/test references are treated as incomplete and require follow-up tasks.

### Error Scenarios
- External service failure: If test infrastructure is unavailable, verification is deferred with documented reason.
- Network timeout: Not applicable to this synchronization task; no new runtime network behavior added.
- Concurrent access: Edits are limited to `012-query-intelligence/` artifacts to avoid cross-phase collisions.

### State Transitions
- Partial completion: Keep unresolved checks and remediation tasks marked `[ ]`.
- Session expiry: Resume from anchored sections to keep deterministic updates across all five in-scope files.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | 6 features, 5 synchronized artifacts, multi-criteria audit output |
| Risk | 16/25 | Multiple FAIL findings and contradictory feature-to-code mappings |
| Research | 11/20 | Requires cross-referencing catalog, implementation, tests, and playbook |
| **Total** | **44/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 11. OPEN QUESTIONS

- No open technical questions for this synchronization task.
- Known warning remains: `npm run check` fails due to unrelated pre-existing repo-wide lint/type issues outside this phase scope.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

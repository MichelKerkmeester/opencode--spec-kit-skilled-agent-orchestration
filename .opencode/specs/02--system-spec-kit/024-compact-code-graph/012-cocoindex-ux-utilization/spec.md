<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Feature Specification: Phase 012 — CocoIndex UX, Utilization & Usefulness"
description: "Align the Phase 012 packet with actual CocoIndex behavior and remaining gaps."
trigger_phrases:
  - "phase 012"
  - "cocoindex"
  - "ux utilization usefulness"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Phase 012 — CocoIndex UX, Utilization & Usefulness

<!-- PHASE_LINKS: parent=../spec.md predecessor=011-compaction-working-set successor=013-correctness-boundary-repair -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
### 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-03-31 |
| **Branch** | `024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
### 2. PROBLEM & PURPOSE
### Problem Statement
Phase 012 improved CocoIndex visibility and routing, but the packet drifted away from the Level 2 template and from current implementation reality. Several claims were overstated: SessionStart only reports binary availability, PreCompact only adds hint text, `ccc_status` and `ccc_feedback` are lightweight helpers, README/tool-reference updates are still pending, and SessionStart does not trigger background CocoIndex re-indexing.

### Purpose
Keep this phase packet structurally compliant and factually accurate so implementation, review, and validation all reflect the same delivered state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
### 3. SCOPE
### In Scope
- Document the actual delivered behavior of SessionStart, PreCompact, `ccc_status`, `ccc_reindex`, and `ccc_feedback`
- Record manual build verification and hook smoke-test reality instead of claiming an automated verification script
- Mark unfinished work consistently across spec, plan, tasks, checklist, and implementation summary

### Out of Scope
- Adding `ensure_ready.sh` to SessionStart or otherwise guaranteeing CocoIndex readiness
- Executing or caching live CocoIndex semantic-neighbor queries during PreCompact
- Updating the broader CocoIndex README or tool reference in this phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Restore Level 2 structure and align requirements with current reality |
| `plan.md` | Modify | Restate implementation approach and verification using actual delivered behavior |
| `tasks.md` | Modify | Track completed work versus explicit not-implemented items |
| `checklist.md` | Modify | Rebuild the verification checklist with evidence and deferrals |
| `implementation-summary.md` | Modify | Correct metadata and summarize delivered scope and limitations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
### 4. REQUIREMENTS
### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The packet must use the Level 2 template structure with required anchors and section order. | `validate.sh` no longer reports missing Level 2 headers or anchors for packet docs. |
| REQ-002 | The packet must stop claiming automated build verification that does not exist. | Verification text describes manual `npm run build` output checks and hook smoke tests only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | SessionStart integration must be described as status-only. | Docs state it reports CocoIndex binary availability and does not call `ensure_ready.sh` or guarantee readiness. |
| REQ-004 | PreCompact semantic integration must be described as hint-only. | Docs state it adds prompt guidance only and does not execute or cache CocoIndex semantic-neighbor queries. |
| REQ-005 | `ccc_status` and `ccc_feedback` behavior must match the shipped helpers. | Docs describe `ccc_status` as availability/binaryPath/indexExists/indexSize and `ccc_feedback` as local JSONL append-only feedback. |
| REQ-006 | Unfinished documentation and automation work must stay marked as not implemented. | Docs consistently mark README/tool-reference updates and SessionStart background re-index as not implemented. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
### 5. SUCCESS CRITERIA
- **SC-001**: **Given** the packet is validated, **When** the validator checks template structure, **Then** it finds the required Level 2 headers and anchors.
- **SC-002**: **Given** a reader reviews SessionStart notes, **When** they compare them to the implementation, **Then** they see status-only binary reporting rather than readiness bootstrapping.
- **SC-003**: **Given** a reader reviews PreCompact behavior, **When** they inspect the packet, **Then** they see hint-text-only integration with no live CocoIndex query or cached snippet claims.
- **SC-004**: **Given** a reader reviews helper-tool behavior, **When** they inspect the packet, **Then** `ccc_status` and `ccc_feedback` descriptions match the shipped helper contracts.
- **SC-005**: Open gaps stay visible for follow-up work instead of being reported as complete.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing Phase 012 implementation state | Packet accuracy depends on matching shipped behavior | Keep statements limited to observed behavior and explicit gaps |
| Risk | Documentation overstating automation | Reviewers may assume readiness/bootstrap work exists | Mark non-implemented items plainly in every packet document |
| Risk | Validation drift | Packet remains noisy or fails strict checks | Use the Level 2 template structure and local cross-references only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Packet updates must keep verification guidance concise enough for quick manual review.

### Security
- **NFR-S01**: Packet text must not invent storage, bootstrap, or background execution behavior that is not implemented.

### Reliability
- **NFR-R01**: Cross-document statements about gaps and limitations must stay consistent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty validator context: packet still needs the required Level 2 headers and anchors.
- Partial implementation state: packet must record shipped behavior and unresolved gaps together.

### Error Scenarios
- CocoIndex binary missing: SessionStart reports unavailable status only.
- Build-verification script absent: packet must point to manual build checks rather than a nonexistent script.

### State Transitions
- Follow-up implementation: unchecked tasks can move to complete without rewriting packet structure again.
- Deferred documentation: unresolved README/tool-reference work remains tracked until a later phase closes it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Five packet docs updated with structural and factual corrections |
| Risk | 12/25 | Incorrect claims would mislead future implementation and review |
| Research | 8/20 | Requires reconciling packet text with delivered behavior |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

### 10. OPEN QUESTIONS
- Should a later phase add true SessionStart readiness bootstrapping, or remain status-only by design?
- Should PreCompact eventually cache semantic-neighbor snippets, or stay as routing guidance only?
<!-- /ANCHOR:questions -->
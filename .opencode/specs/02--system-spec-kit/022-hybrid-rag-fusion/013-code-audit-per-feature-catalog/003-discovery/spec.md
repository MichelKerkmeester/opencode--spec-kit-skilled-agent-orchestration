---
title: "Feature Specification: discovery [template:level_2/spec.md]"
description: "Audit Discovery feature catalog entries against implementation reality and tests, then capture prioritized follow-up work. Standardize findings using the Level 2 structure so verification stays consistent and traceable."
trigger_phrases:
  - "feature"
  - "specification"
  - "discovery"
  - "code audit"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: discovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-03-10 |
| **Branch** | `003-discovery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Discovery audit content exists, but phase documentation is not consistently represented in the Level 2 template structure. This inconsistency reduces comparability across phases and makes findings harder to verify and operationalize.

### Purpose
Provide a normalized Level 2 Discovery audit specification that clearly maps findings into actionable remediation and verification work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Discovery category audit coverage for `memory_list`, `memory_stats`, and `memory_health`
- Findings structure for correctness, standards alignment, behavior matching, test gaps, and playbook coverage
- Task-level mapping of P1/P2 follow-up work identified during the audit

### Out of Scope
- Implementing production handler fixes in `mcp_server/handlers/*` during this documentation phase - tracked in tasks
- Expanding this audit to non-Discovery feature categories - handled by separate phase folders

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/spec.md` | Modify | Rewrite to Level 2 specification template with mapped Discovery audit content |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/tasks.md` | Modify | Map Discovery findings into numbered implementation tasks |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/plan.md` | Modify | Convert methodology/checklist into Level 2 implementation plan format |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/checklist.md` | Modify | Reframe findings under Level 2 verification categories |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document all Discovery features (`F-01` to `F-03`) with consistent finding fields | Each feature includes status, code issues, standards review, behavior match, test gaps, playbook mapping, and recommended fixes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Capture `memory_stats` folder-total summary defect as implementation-ready tasking | `tasks.md` includes a numbered task referencing `mcp_server/handlers/memory-crud-stats.ts` and expected correction |
| REQ-003 | Capture `memory_health` `requestId` inconsistency as implementation-ready tasking | `tasks.md` includes a numbered task referencing `mcp_server/handlers/memory-crud-health.ts` and required response consistency |
| REQ-004 | Capture Discovery test coverage gaps and stale test references | `tasks.md` and `checklist.md` explicitly cover missing edge-case tests and stale `retry.vitest.ts` references |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 Discovery features are represented with structured audit findings.
- **SC-002**: Each feature has explicit status and issue categorization (code, standards, behavior, tests).
- **SC-003**: Test coverage gaps are documented for each feature with concrete follow-up direction.
- **SC-004**: Playbook coverage is mapped to EX-018, EX-019, and EX-020 or noted as a gap.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Discovery feature catalog documents | Incomplete or stale metadata can skew findings | Re-validate file references and scenario IDs during verification |
| Risk | Stale test file references (`retry.vitest.ts`) persist across docs | Follow-up implementation may target non-existent tests | Track cleanup as explicit tasks and checklist checks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Discovery audit artifacts should remain readable and reviewable in under 5 minutes per file.
- **NFR-P02**: Findings-to-task traceability should allow issue lookup in under 30 seconds.

### Security
- **NFR-S01**: Documentation must not introduce or expose secrets, credentials, or private paths.
- **NFR-S02**: Security-relevant findings (error output/path handling) must be explicitly tracked.

### Reliability
- **NFR-R01**: All required Level 2 anchors and metadata blocks remain present and syntactically valid.
- **NFR-R02**: Cross-file references (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) stay internally consistent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Discovery sections still render required Level 2 anchors and placeholders.
- Maximum length: Longer findings remain concise enough to fit checklist/task structures.
- Invalid format: Non-template headings are replaced with canonical Level 2 sections.

### Error Scenarios
- External service failure: Not applicable for doc rewrite; preserve references without executing services.
- Network timeout: Not applicable for local documentation update.
- Concurrent access: Conflicts should be resolved by preserving template structure first, then mapped content.

### State Transitions
- Partial completion: Any partially rewritten file is replaced with full template-compliant content.
- Session expiry: Re-run rewrite and verification using the same target folder and template source.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four files rewritten with strict template conformance |
| Risk | 12/25 | Low runtime risk; moderate process risk from template drift |
| Research | 8/20 | Existing findings are already available and mapped |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- ~~Should stale `retry.vitest.ts` references be removed from all related feature catalog files in the same follow-up change?~~ **Resolved**: Yes, removed from all 3 Discovery catalog files.
- Should `requestId` be included in successful `memory_health` responses as well as all error responses? **Deferred**: Not in scope for this phase. Currently included in all error responses only.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

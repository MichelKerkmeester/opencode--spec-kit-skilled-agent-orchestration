---
title: "Feature Specification: discovery [template:level_2/spec.md]"
description: "Align Discovery phase documentation with current on-disk handler, schema, feature-catalog, and test reality after latest fixes."
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
| **Updated** | 2026-03-11 |
| **Branch** | `003-discovery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Parts of the Discovery phase docs became stale after the latest handler and schema fixes. Several statements no longer match on-disk behavior or current verification evidence.

### Purpose
Make `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` fully match current Discovery implementation reality and focused verification outcomes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Discovery behavior documentation for `memory_list`, `memory_stats`, and `memory_health`
- Requirements and checklist coverage for MCP validation envelopes (`E_INVALID_INPUT` + `requestId`) on handler-level validation failures
- Documentation of `memory_list` resolved `sortBy` response field
- Documentation of `memory_stats` response `limit` field and validation for `includeScores`, `includeArchived`, and non-finite `limit`
- Documentation of `memory_health` public schema support for `confirmed` in auto-repair confirmation flow
- Final verification evidence: clean `tsc` run and targeted 5-file suite passing `89/89`

### Out of Scope
- Additional runtime code changes in `mcp_server/handlers/*`, `schemas/*`, or tests
- Audit updates for non-Discovery categories

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/spec.md` | Modify | Refresh requirements/success criteria to current Discovery reality |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/plan.md` | Modify | Refresh plan phases/testing evidence to finalized implementation state |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/tasks.md` | Modify | Refresh completed task list and verification tasks |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/checklist.md` | Modify | Refresh checklist evidence and remove stale claims |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/003-discovery/implementation-summary.md` | Modify | Refresh final summary to current behavior and verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document `memory_list` handler-level validation behavior | Docs state invalid `specFolder`, `includeChunks`, and non-finite `limit`/`offset` return MCP error envelopes with `code: E_INVALID_INPUT` and `data.details.requestId` |
| REQ-002 | Document `memory_list` response shape accurately | Docs state response includes resolved `sortBy` (`created_at` fallback) |
| REQ-003 | Document `memory_stats` validation and response behavior accurately | Docs state validation coverage for `includeScores`, `includeArchived`, and non-finite `limit` returns `E_INVALID_INPUT` envelopes with `requestId`, and success payload includes resolved `limit` |
| REQ-004 | Document `memory_health` confirmation schema reachability | Docs state public/runtime schemas accept `confirmed` for `autoRepair` confirmation flow |
| REQ-005 | Capture final focused verification evidence | Docs record `npx tsc --noEmit` clean and targeted suite passing `89/89` across the 5 named files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Remove stale Discovery claims | Remove outdated statements including "documentation phase", `48/48` count, old `computeFolderScores`-limit wording, and outdated Discovery-only `E_INVALID_INPUT` inconsistency limitation |
| REQ-007 | Keep all five phase docs synchronized | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` share consistent behavior statements and verification evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Discovery docs describe `memory_list` validation envelopes and resolved `sortBy` behavior accurately.
- **SC-002**: Discovery docs describe `memory_stats` validation envelopes and `limit` response field accurately.
- **SC-003**: Discovery docs describe `memory_health` schema support for `confirmed` accurately.
- **SC-004**: Discovery docs reference the rewritten Discovery feature catalog as current reality.
- **SC-005**: Verification evidence is updated to `tsc` clean plus targeted `89/89` tests across the five specified files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Current on-disk handler/schema/test files under `.opencode/skill/system-spec-kit/` | If these change again, docs can drift quickly | Anchor claims to currently verified file behavior and commands |
| Risk | Concurrent codebase updates by other contributors | Statements can become stale after doc refresh | Scope locked to current reality snapshot + explicit verification evidence |
| Risk | Focused verification is narrower than full-suite coverage | Potential regressions outside targeted scope remain unseen | Document focused scope explicitly and keep evidence command-level precise |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Discovery docs remain readable in under 5 minutes per file.
- **NFR-P02**: Behavior-to-evidence traceability lookup should take under 30 seconds per claim.

### Security
- **NFR-S01**: Documentation must not expose credentials or unsafe absolute paths.
- **NFR-S02**: Error envelope and `requestId` documentation should preserve observability without introducing sensitive data exposure.

### Reliability
- **NFR-R01**: Level 2 anchors and template markers remain intact in all five updated files.
- **NFR-R02**: Cross-file behavior statements are internally consistent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Non-finite numeric inputs (`limit`, `offset`) must be documented as validation errors, not clamped success paths.
- Unsupported `sortBy` values must be documented as fallback-to-`created_at`, with resolved value in response payload.

### Error Scenarios
- Handler-level validation failures must be documented as MCP error envelopes with `requestId`, not thrown errors.
- Schema-level acceptance for `confirmed` must be documented for both public schema and runtime args parsing.

### State Transitions
- If source code changes after this doc refresh, Discovery docs must be re-audited before reuse as evidence.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | Five spec artifacts refreshed and synchronized |
| Risk | 13/25 | Moderate drift risk due active concurrent code changes |
| Research | 9/20 | Required direct verification across handlers, schemas, tests, and catalog docs |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The previously stale Discovery statements targeted by this phase update are resolved in this revision.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

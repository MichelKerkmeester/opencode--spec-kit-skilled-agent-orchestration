---
title: "Feature Specification: retrieval-enhancements [template:level_2/spec.md]"
description: "Audit and align retrieval-enhancement feature documentation, code mappings, and test coverage for the hybrid RAG fusion catalog."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "retrieval enhancements"
  - "hybrid rag fusion"
  - "feature catalog"
  - "tier 2 fallback channel forcing"
  - "provenance rich response envelopes"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: retrieval-enhancements

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
| **Branch** | `015-retrieval-enhancements` |
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../014-pipeline-architecture/spec.md |
| **Next Phase** | ../016-tooling-and-scripts/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The retrieval-enhancements feature catalog captures nine high-complexity behaviors, but several entries are out of sync with current implementation and test ownership. Key mismatches (notably F-07 and F-08) and missing executable assertions reduce confidence in production behavior and audit traceability. Existing audit findings are detailed but need to be normalized into Level 2 template structure for consistent execution and verification.

### Purpose
Standardize the retrieval-enhancements audit into Level 2 format so remediation work can be executed, verified, and tracked consistently.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit and document all 9 retrieval-enhancement features in `feature_catalog/15--retrieval-enhancements/`.
- Preserve and prioritize the 17 identified remediation tasks across P0/P1/P2 severity.
- Capture code, behavior, testing, and playbook coverage gaps with source-level traceability.

### Out of Scope
- Implementing the remediation fixes in MCP server source files - tracked separately from this documentation rewrite.
- Modifying `description.json`, `memory/`, or `scratch/` artifacts - excluded by task constraints.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/015-retrieval-enhancements/spec.md` | Modify | Reframe audit objectives and requirements in Level 2 spec template. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/015-retrieval-enhancements/plan.md` | Modify | Convert methodology into Level 2 implementation plan format. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/015-retrieval-enhancements/tasks.md` | Modify | Convert 17-task remediation backlog into template task phases. |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/015-retrieval-enhancements/checklist.md` | Modify | Convert feature findings into Level 2 verification checklist format. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Correct F-07 tier-2 fallback source and test mapping to `hybrid-search.ts` and `hybrid-search.vitest.ts`. | Feature catalog references and linked tests point to actual `forceAllChannels` implementation and regression coverage. |
| REQ-002 | Replace placeholder/deferred channel assertions with executable behavior tests for fallback forcing. | `channel.vitest.ts` (or designated owner suite) contains runnable assertions for channel forcing behavior. |
| REQ-003 | Correct F-08 provenance source ownership and enforce trace field assertions when `includeTrace` is enabled. | Provenance owner files are documented and tests assert required `scores/source/trace` fields. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Address standards gaps (wildcard exports, silent catch blocks, weak logging paths) tied to F-01/F-06/F-09. | Affected files use explicit exports and typed, minimally logged exception handling. |
| REQ-005 | Align F-05 summary-channel contract docs with actual `SummarySearchResult[]` to Stage-1 adaptation flow. | Feature documentation and source table match implementation contract and integration boundaries. |
| REQ-006 | Close test gaps for hook lifecycle behavior, summary merge/dedupe/filtering, batched edge-count retrieval, and context header ordering. | Dedicated tests exist and exercise each behavior under normal and constrained conditions. |
| REQ-007 | Capture manual playbook mapping coverage (NEW-085+) for all nine features or explicitly document gaps. | Each feature has a mapped scenario ID or a documented "missing coverage" finding. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 features have structured PASS/WARN/FAIL outcomes with source-backed findings.
- **SC-002**: All 17 remediation tasks are retained and traceable to concrete files and behaviors.
- **SC-003**: P0 documentation and test-mapping mismatches (F-07, F-08) are explicitly resolved or blocked with clear ownership.

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
| Dependency | Feature catalog owners (`feature_catalog/15--retrieval-enhancements/`) | Incorrect ownership mapping can persist across audits. | Update source tables and add verification checks in checklist/tasks before completion. |
| Dependency | MCP server test suites (`mcp_server/tests/`) | Missing or deferred assertions can hide regressions. | Add targeted assertions for P0 behaviors and record evidence in checklist. |
| Risk | Stale references (for example missing `retry.vitest.ts`) | Audit credibility degrades if references are unresolved. | Remove stale references or restore files with explicit ownership notes. |
| Risk | Heuristic token/header budgets diverge from real usage | False confidence in retrieval budget guarantees. | Add explicit measurement-based enforcement and constrained-budget tests. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Retrieval-enhancements audit artifacts should remain reviewable in one pass (target: under 15 minutes to scan end-to-end).
- **NFR-P02**: Verification updates should keep per-feature evidence lookup under 60 seconds via direct file and line references.

### Security
- **NFR-S01**: No hardcoded secrets or sensitive runtime data may be introduced in audit artifacts.
- **NFR-S02**: Logged fallback diagnostics must avoid leaking sensitive content while preserving debugging context.

### Reliability
- **NFR-R01**: All anchor pairs in rewritten Level 2 docs must validate without orphaned markers.
- **NFR-R02**: P0 findings must remain explicitly represented across spec/tasks/checklist with no silent omission.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Features with no current playbook scenario must be marked as coverage gaps, not assumed covered.
- Maximum length: Large per-feature findings should be summarized in top-level sections with exact file/source references preserved.
- Invalid format: Broken file path or line references should be flagged as unresolved evidence and tracked in tasks.

### Error Scenarios
- External service failure: If auxiliary search/index tooling is unavailable, use local repository evidence and document reduced confidence.
- Network timeout: Validation/test runs should be retryable without rewriting findings or task IDs.
- Concurrent access: Documentation updates must not modify `memory/` or `scratch/` subdirectories during rewrite.

### State Transitions
- Partial completion: If only part of remediation can be verified, keep unchecked checklist items and record blockers explicitly.
- Session expiry: Re-entry should be possible from template anchors and task IDs without re-auditing all nine features.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | 9 features, 17 remediation tasks, multi-surface traceability. |
| Risk | 22/25 | Two FAIL-class feature mismatches and multiple missing executable tests. |
| Research | 16/20 | Cross-mapping needed across feature docs, implementation files, and test suites. |
| **Total** | **61/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should tier-2 fallback ownership remain in `hybrid-search.vitest.ts` exclusively, or be mirrored in channel-focused suites?
- Which exact manual playbook scenarios (beyond NEW-085+) should cover each of F-01 through F-09?
- Should token/header budget enforcement use a tokenizer-backed estimate or a calibrated deterministic approximation?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

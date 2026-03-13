---
title: "Feature Specification: bug-fixes-and-data-integrity [template:level_2/spec.md]"
description: "Audit and remediate bug-fix and data-integrity features in hybrid RAG fusion, correcting catalog-to-code mismatches and test coverage gaps across 11 features."
SPECKIT_TEMPLATE_SOURCE: "spec-core | v2.2"
trigger_phrases:
  - "bug fixes"
  - "data integrity"
  - "hybrid rag fusion"
  - "feature catalog"
  - "chunk deduplication"
  - "database safety"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: bug-fixes-and-data-integrity

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
| **Branch** | `008-bug-fixes-and-data-integrity` |
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../007-evaluation/spec.md |
| **Next Phase** | ../009-evaluation-and-measurement/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The bug-fixes-and-data-integrity feature catalog currently contains mismatches between "Current Reality" claims, implementation tables, and linked tests. Several high-impact gaps are documented, including incorrect source mappings, missing regression coverage, and unresolved behavior claims for safety-critical paths. Without alignment, the catalog can mislead implementation and verification work across the hybrid RAG fusion stack.

### Purpose
Produce a validated, feature-by-feature audit specification that aligns catalog claims, code references, and test expectations for all 11 bug-fix and data-integrity features.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all 11 features under `feature_catalog/08--bug-fixes-and-data-integrity/`.
- Document PASS/WARN/FAIL outcomes with code issues, behavior mismatches, test gaps, and playbook coverage.
- Define prioritized remediation tasks (P0/P1/P2) for catalog alignment, code hardening, and regression coverage.

### Out of Scope
- Editing `description.json` - excluded by task constraint.
- Writing to `memory/` or `scratch/` subdirectories - excluded by task constraint.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/08--bug-fixes-and-data-integrity/*.md` | Modify | Correct implementation/test tables and "Current Reality" wording where mismatched. |
| `mcp_server/lib/errors/index.ts` | Modify | Replace wildcard barrel exports with explicit named exports. |
| `mcp_server/shared/scoring/folder-scoring.ts` | Modify | Remove spread-based `Math.max` calls that can trigger `RangeError`. |
| `mcp_server/lib/search/hybrid-search.ts` | Modify | Align canonical ID dedup and co-activation source mapping and behavior assertions. |
| `mcp_server/handlers/chunking-orchestrator.ts` | Modify | Clarify or harden force-path swap semantics and rollback behavior. |
| `mcp_server/tests/*.vitest.ts` | Modify/Create | Add missing regressions for dedup, rollback, timestamp, and concurrency scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete structured audit for all 11 catalog features. | Each feature has Status (PASS/WARN/FAIL), code issues, standards notes, behavior mismatch notes, test gaps, and playbook coverage. |
| REQ-002 | Resolve critical catalog-to-code mismatches for F-05, F-06, and F-08. | Source and test tables match actual implementation paths, and critical behavior claims are evidence-backed. |
| REQ-003 | Publish prioritized remediation backlog. | Backlog includes 5 P0, 8 P1, and 1 P2 tasks with file-level references and clear expected outcomes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Map manual playbook coverage for EX-034 and NEW-040..049. | Every feature maps to playbook coverage or explicitly documents "MISSING/partial" with rationale. |
| REQ-005 | Define missing regression coverage for critical edge scenarios. | Regression plans exist for include-content dedup, stage-2 co-activation boost, staged swap rollback, timestamp format mismatch, and concurrent entry-limit stress. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 11/11 features in the bug-fix/data-integrity catalog have validated, evidence-backed audit records.
- **SC-002**: A remediation backlog with correct P0/P1/P2 prioritization is ready for implementation without additional discovery.

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
| Dependency | Feature catalog markdown and source references | If stale, audit conclusions may be inaccurate. | Re-verify file paths and line-level claims before final sign-off. |
| Dependency | `mcp_server` code and Vitest suites | Missing or drifting tests block verification. | Add/adjust targeted regression tests as part of remediation tasks. |
| Risk | Force-path safe-swap behavior ambiguity | Can cause destructive behavior under failure paths. | Either extend safe-swap semantics to force path or explicitly document destructive mode. |
| Risk | Large-array scoring paths still use spread max | Potential runtime `RangeError` under high cardinality inputs. | Replace spread-based max/min patterns and add >100k element regressions. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Audit artifact updates for all 11 features should be completable within one focused review cycle (<1 day).
- **NFR-P02**: Proposed code remediations must not introduce >5% p95 regression on affected search/save/session flows.

### Security
- **NFR-S01**: Remediation changes must preserve existing authentication and authorization behavior for MCP handlers.
- **NFR-S02**: No hardcoded secrets or unsafe SQL interpolation may be introduced in fix/test code.

### Reliability
- **NFR-R01**: Audit conclusions must be reproducible from cited files/tests with deterministic references.
- **NFR-R02**: Added regressions must fail before fixes and pass after fixes for each targeted bug class.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Catalog entries missing implementation/test tables are flagged as WARN/FAIL with explicit remediation.
- Maximum length: High-cardinality arrays (>100k items) must avoid spread-based max/min to prevent stack overflow.
- Invalid format: Mixed timestamp formats (`YYYY-MM-DD HH:MM:SS` vs ISO) must be normalized before lexical comparisons.

### Error Scenarios
- External service failure: If upstream embedding/search services fail, audit notes must separate runtime failures from catalog mismatches.
- Network timeout: Verification workflows should retry test execution and preserve partial findings with clear status.
- Concurrent access: Session entry-limit logic must remain correct under parallel writes and transaction contention.

### State Transitions
- Partial completion: Feature status can progress from FAIL/WARN to PASS only after code + tests + catalog evidence align.
- Session expiry: In-progress audit execution should retain findings artifacts without corrupting checklist/task state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 23/25 | 11 feature audits spanning catalog docs, runtime modules, and tests. |
| Risk | 22/25 | Multiple correctness and data-integrity edge paths with potential production impact. |
| Research | 16/20 | Requires cross-referencing catalog claims against code/test reality and playbook scenarios. |
| **Total** | **61/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. RESOLVED QUESTIONS

- **Force-path chunk re-indexing**: Documented as intentionally destructive by design with AI-WHY comment at `chunking-orchestrator.ts:166-168` (T009).
- **`.changes` UPDATE safety semantics**: `pe-gating.ts` is authoritative — uses `.changes === 0` guard for prediction-error gating (T001, B4 correction).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

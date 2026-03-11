---
title: "Feature Specification: evaluation-and-measurement [template:level_2/spec.md]"
description: "Evaluation-and-measurement audit findings show correctness bugs, behavior drift, and coverage gaps across 14 cataloged features. This spec defines remediation requirements and verification targets."
trigger_phrases:
  - "evaluation"
  - "measurement"
  - "feature audit"
  - "core metric computation"
  - "observer effect mitigation"
  - "shadow scoring"
  - "playbook mapping"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: evaluation-and-measurement

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
| **Branch** | `009-evaluation-and-measurement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The evaluation-and-measurement feature catalog contains 14 audited features with multiple FAIL and WARN outcomes, including metric correctness drift, missing observer-overhead implementation proof points, placeholder channel tests, and silent-failure handling. Existing documentation captures findings, but remediation requirements need to be normalized into Level 2 structures with measurable acceptance criteria.

### Purpose
Define a remediation-ready Level 2 specification that preserves all current audit findings and drives consistent implementation, verification, and playbook traceability.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Normalize the evaluation-and-measurement audit into Level 2 spec/task/plan/checklist structure.
- Preserve and map all 14 feature findings (PASS/WARN/FAIL), including P0/P1/P2 remediation priorities.
- Track NEW-050..072 playbook alignment and explicit source/test traceability gaps.

### Out of Scope
- Modifying `description.json` or any files under `memory/` and `scratch/` - explicitly excluded.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/.../009-evaluation-and-measurement/spec.md | Modify | Level 2 feature specification with mapped audit requirements |
| .opencode/specs/.../009-evaluation-and-measurement/tasks.md | Modify | Level 2 tasks document with phased remediation backlog |
| .opencode/specs/.../009-evaluation-and-measurement/plan.md | Modify | Level 2 implementation plan with phase dependencies and rollback |
| .opencode/specs/.../009-evaluation-and-measurement/checklist.md | Modify | Level 2 verification checklist preserving audit completion state |
| mcp_server/lib/eval/eval-metrics.ts | Modify | Precision/F1 dedupe fix (T005) |
| mcp_server/lib/eval/bm25-baseline.ts | Modify | Bootstrap CI iteration guard (T009) |
| mcp_server/lib/eval/eval-db.ts | Modify | closeEvalDb non-fatal logging (T008) |
| mcp_server/lib/eval/eval-logger.ts | Modify | Dual-table run counter bootstrap (T013) |
| mcp_server/lib/eval/ablation-framework.ts | Modify | queryCount persistence (T012) |
| mcp_server/lib/telemetry/consumption-logger.ts | Modify | Non-fatal catch logging (T010) |
| mcp_server/lib/telemetry/scoring-observability.ts | Modify | JSDoc error-behavior correction (R1 remediation) |
| mcp_server/tests/channel.vitest.ts | Modify | Replace placeholder tests (T007) |
| mcp_server/tests/eval-metrics.vitest.ts | Modify | Dedupe regression tests (T005) |
| mcp_server/tests/bm25-baseline.vitest.ts | Modify | Bootstrap CI edge-case tests (T009) |
| mcp_server/tests/eval-logger.vitest.ts | Modify | Dual-table bootstrap tests (T013) |
| mcp_server/tests/ablation-framework.vitest.ts | Modify | All-channel-fail tests (T012) |
| feature_catalog/09--evaluation-and-measurement/*.md | Modify | 14 catalog files aligned (T001-T003, T006, T011) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Correct duplicate-ID handling in precision/F1 computation. | `computePrecision`/`computeF1` use consistent ID deduplication semantics with recall/MAP, with duplicate-heavy edge-case tests added. |
| REQ-002 | Resolve observer-overhead behavior mismatch and silent schema catch paths. | p95 enabled-vs-disabled overhead check is either implemented with alerting or current-reality text is corrected; silent catches in listed paths emit non-fatal logs. |
| REQ-003 | Replace placeholder channel attribution tests with real assertions. | `channel.vitest.ts` validates real channel-attribution behavior and no longer uses tautological placeholder assertions. |
| REQ-004 | Preserve full 14-feature audit traceability in Level 2 docs. | All features remain represented with status-aligned remediation tasks and source/test references. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Eliminate silent-failure patterns in evaluation/telemetry helper paths. | `closeEvalDb`, consumption logger broad catches, and related paths emit explicit non-fatal logging behavior. |
| REQ-006 | Fix evaluation edge-case correctness for baseline persistence and run-ID bootstrap. | Ablation baseline query-count and eval-run counter initialization edge cases are covered by regression tests and produce deterministic values. |
| REQ-007 | Align feature narratives with implementation reality for metrics and observability. | Metric-count statements, scoring observability error behavior, and per-feature source/test mappings are documentation-consistent and verifiable. |
| REQ-008 | Complete per-feature mapping for cross-AI/test-quality claims. | F-12 and F-14 include file-level evidence links (source/tests/commits) for each claimed remediation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 evaluation-and-measurement features remain represented with explicit, testable remediation targets.
- **SC-002**: Existing FAIL findings are captured as blocker requirements with deterministic acceptance criteria.
- **SC-003**: Documentation, task planning, and verification status are synchronized with NEW-050..072 playbook mapping expectations.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Feature catalog (`feature_catalog/09--evaluation-and-measurement/`) | Stale catalog statements can invalidate remediation priorities | Reconcile every requirement against current-reality and cited code/test files |
| Dependency | MCP server eval/telemetry modules and tests | Missing or weak tests can mask correctness regressions | Add edge-case regression coverage before closing P0/P1 tasks |
| Risk | Documentation-to-code drift during remediation | Tasks may close without implementation parity | Require acceptance evidence and checklist updates per requirement |
| Risk | Playbook mapping remains phase-level only | Manual verification remains non-auditable per feature | Add explicit per-feature NEW-050..072 mapping or documented gaps |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Evaluation metric and reporting fixes should not materially regress evaluation runtime for baseline and ablation paths.
- **NFR-P02**: Added regression tests should stay within existing CI runtime tolerance for the MCP server test suite.

### Security
- **NFR-S01**: Telemetry and evaluation fixes must avoid broad silent-failure behavior that hides operational issues.
- **NFR-S02**: Source/test evidence links for cross-AI validations must avoid exposing sensitive data and keep repository-safe references.

### Reliability
- **NFR-R01**: Evaluation run identifiers and persisted report fields must remain deterministic across restart and failure scenarios.
- **NFR-R02**: Documentation claims for feature behavior must be reproducible from listed source and test artifacts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Duplicate memory IDs in ranked results should not inflate precision/F1 values.
- `computeBootstrapCI` must reject `iterations <= 0` and maintain valid percentile index behavior.
- Baseline snapshot persistence should keep accurate query counts even when all channel runs fail.

### Error Scenarios
- DB close or schema-ensure failures must log non-fatal diagnostics instead of silent suppression.
- Shadow scoring disabled paths must preserve attribution persistence safety without masking initialization errors.
- Cross-AI remediation claims without source mapping must be treated as unverified until evidence is attached.

### State Transitions
- Eval run counter initialization should remain monotonic across process restarts and both final/channel result tables.
- Observer-overhead verification should keep enabled/disabled transition behavior measurable and auditable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 14-feature audit with multi-surface remediation mapping |
| Risk | 20/25 | Multiple correctness and behavior-drift findings across eval/telemetry paths |
| Research | 16/20 | Requires cross-validation across catalog docs, runtime files, tests, and playbook |
| **Total** | **58/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS (RESOLVED)

- **Resolved (observer-overhead alert path):** Current-reality text is explicitly documentation-corrected in `03-observer-effect-mitigation.md` to state that automated p95 overhead alerting is not implemented; mitigation is fail-safe/non-fatal behavior.
- **Resolved (metric-count contract):** Evaluation-and-measurement feature docs and `eval-metrics.ts` consistently document the 12-metric contract (7 core + 5 diagnostic).
- **Resolved (non-fatal logging policy for eval/telemetry):** Policy is standardized as: catch blocks log `console.warn` with module prefix + function context + normalized error message (`err instanceof Error ? err.message : String(err)`), do not block user-facing operations, and return fallback values.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

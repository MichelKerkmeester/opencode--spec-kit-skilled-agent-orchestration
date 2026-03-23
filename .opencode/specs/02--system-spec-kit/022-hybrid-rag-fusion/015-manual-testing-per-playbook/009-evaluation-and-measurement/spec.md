---
title: "Feature Specification: Manual Testing — Evaluation and Measurement"
description: "Test specification for the 16 manual test scenarios in the evaluation-and-measurement phase of the hybrid-rag-fusion playbook."
trigger_phrases:
  - "manual testing"
  - "evaluation and measurement"
  - "eval database and schema"
  - "ablation study framework"
  - "shadow scoring channel attribution"
  - "int8 quantization evaluation"
  - "memory roadmap baseline"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Manual Testing — Evaluation and Measurement

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
| **Created** | 2026-03-22 |
| **Branch** | `015-manual-testing-per-playbook/009-evaluation-and-measurement` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [008-bug-fixes-and-data-integrity](../008-bug-fixes-and-data-integrity/spec.md) |
| **Successor** | [010-graph-signal-activation](../010-graph-signal-activation/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The evaluation-and-measurement category covers 16 scenarios that verify the correctness of the retrieval evaluation framework — including the eval DB schema, metric computation, ablation studies, shadow scoring, and ground truth tooling. These scenarios require structured manual execution to confirm that the measurement pipeline produces accurate, reproducible results.

### Purpose

Execute all 16 playbook scenarios, record pass/fail for each with evidence, and confirm the evaluation-and-measurement subsystem is functioning correctly before marking this phase complete.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Manual execution of all 16 scenarios listed in section 4
- Pass/fail recording per scenario with evidence notes
- Checklist sign-off for each P0 item

### Out of Scope

- Automated CI evaluation runs — separate pipeline concern
- New metric implementation — this is verification only
- Other playbook phases

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `checklist.md` | Modify | Mark items as each scenario completes |
| `tasks.md` | Modify | Mark tasks complete as scenarios pass |
| `implementation-summary.md` | Modify | Fill in after all scenarios executed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

All 16 scenarios must be executed and pass before this phase is marked complete.

| ID | Scenario ID | Scenario Title | Acceptance Criteria |
|----|-------------|----------------|---------------------|
| REQ-001 | 005 | Evaluation database and schema (R13-S1) | eval_metric_snapshots table exists; schema matches expected columns; insert and query succeed |
| REQ-002 | 006 | Core metric computation (R13-S1) | Recall@K and MRR values compute correctly for a known ground truth query set |
| REQ-003 | 007 | Observer effect mitigation (D4) | Evaluation queries do not trigger strengthening updates; trackAccess=false is respected |
| REQ-004 | 008 | Full-context ceiling evaluation (A2) | Full-context mode returns all memories; ceiling Recall@K is 1.0 for known queries |
| REQ-005 | 009 | Quality proxy formula (B7) | Quality proxy score matches expected formula output for a test memory sample |
| REQ-006 | 010 | Synthetic ground truth corpus (G-NEW-1, G-NEW-3 phase A) | Synthetic query corpus is generated and stored; queries map to known relevant memories |
| REQ-007 | 011 | BM25-only baseline (G-NEW-1) | BM25-only search returns results; Recall@K is recorded as baseline metric |
| REQ-008 | 012 | Agent consumption instrumentation (G-NEW-2) | Agent call telemetry is logged; consumption counts are accessible via stats |
| REQ-009 | 013 | Scoring observability (T010) | Score breakdown is visible in trace output; all channel contributions are reported |
| REQ-010 | 014 | Full reporting and ablation study framework (R13-S3) | `eval_run_ablation` executes; per-channel Recall@K deltas are written to eval DB |
| REQ-011 | 015 | Shadow scoring and channel attribution (R13-S2) | Shadow scoring runs alongside live scoring; attribution breakdown matches expected format |
| REQ-012 | 072 | Test quality improvements | Test coverage for evaluation tools is present; known edge cases are exercised |
| REQ-013 | 082 | Evaluation and housekeeping fixes | Stale eval records are cleaned up; no duplicate snapshot rows for same run |
| REQ-014 | 088 | Cross-AI validation fixes (Tier 4) | Evaluation results are consistent across AI providers; no provider-specific scoring drift |
| REQ-015 | 090 | INT8 quantization evaluation (R5) | INT8-quantized embedding path produces results; Recall@K degradation is within accepted threshold |
| REQ-016 | 126 | Memory roadmap baseline snapshot | Baseline snapshot is captured; Recall@K values are persisted for future regression comparison |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 16 scenarios execute without blocking errors
- **SC-002**: All 16 P0 checklist items are checked with evidence
- **SC-003**: No scenario produces a regression finding that was not already tracked
- **SC-004**: implementation-summary.md is filled in with pass/fail results and date
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Running MCP server with eval_run_ablation enabled | Scenarios 014, 015 require SPECKIT_ABLATION=true | Set env flag before running those scenarios |
| Dependency | Ground truth corpus (scenario 010) must precede 011 | BM25 baseline needs corpus to query against | Run 010 before 011 in all cases |
| Dependency | eval_metric_snapshots table (scenario 005) must exist for 006, 014 | Schema must be present before metric runs | Run 005 first; verify table before proceeding |
| Risk | INT8 quantization path (090) requires optional dependency | node-llama-cpp or INT8 backend may not be installed | Note as SKIP with environment detail if dependency absent |
| Risk | Cross-AI scenario (088) requires multiple provider configs | May not be testable in single-provider environment | Document provider used; note if multi-provider test was skipped |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at this time. All scenario definitions are complete in the playbook.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each scenario completes within 120 seconds of manual steps
- **NFR-P02**: `eval_run_ablation` completes within 60 seconds for the default query set

### Security
- **NFR-S01**: No secrets written to scratch/ during testing
- **NFR-S02**: Eval DB writes go to isolated test instance, not production

### Reliability
- **NFR-R01**: Scenarios 010, 011, 014 must each run at least twice to confirm reproducibility
- **NFR-R02**: Any scenario that fails must be re-run after environment reset before recording FAIL
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty ground truth corpus: Scenario 011 baseline requires corpus — document if corpus is empty
- Zero-result ablation: `eval_run_ablation` with no ground truth returns empty metrics — record as expected behavior
- Missing eval table: Scenario 006 fails if 005 was not run first — enforce order dependency

### Error Scenarios
- `SPECKIT_ABLATION` not set: Scenarios 014, 015 will return error or no-op — document flag value used
- INT8 backend absent: Scenario 090 step that requires quantized path should be marked SKIP-ENV rather than FAIL
- Cross-AI provider unavailable (088): Mark as SKIP-ENV if second provider cannot be configured
<!-- /ANCHOR:edge-cases -->

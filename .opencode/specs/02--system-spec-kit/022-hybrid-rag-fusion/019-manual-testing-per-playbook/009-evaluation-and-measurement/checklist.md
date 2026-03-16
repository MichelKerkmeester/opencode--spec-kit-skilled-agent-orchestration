---
title: "Verification Checklist: manual-testing-per-playbook evaluation-and-measurement phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 009 evaluation-and-measurement manual tests covering NEW-005 through NEW-015, NEW-072, NEW-082, NEW-088, NEW-090, and NEW-126."
trigger_phrases:
  - "evaluation and measurement checklist"
  - "phase 009 verification"
  - "measurement testing checklist"
  - "NEW-005 NEW-126 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook evaluation-and-measurement phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope is locked to 16 evaluation-and-measurement tests (NEW-005, NEW-006, NEW-007, NEW-008, NEW-009, NEW-010, NEW-011, NEW-012, NEW-013, NEW-014, NEW-015, NEW-072, NEW-082, NEW-088, NEW-090, NEW-126) with no out-of-group scenarios included [EVIDENCE: scope table in `spec.md` lists exactly 16 rows]
- [x] CHK-002 [P0] Exact prompts, execution types, and pass criteria were extracted from `../../manual_testing_playbook/manual_testing_playbook.md` for all 16 scenarios [EVIDENCE: testing strategy table in `plan.md` matches playbook rows for all 16 test IDs]
- [x] CHK-003 [P0] Feature catalog links for all 16 tests point to the correct `09--evaluation-and-measurement/` files [EVIDENCE: spec.md scope table links 16 distinct catalog entries under `09--evaluation-and-measurement/`]
- [ ] CHK-004 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] NEW-005 documents the eval DB/schema isolation check with isolated table evidence, retrieval event rows, and main DB integrity confirmation [EVIDENCE: spec.md REQ-001 and plan.md Phase 2 step]
- [x] CHK-011 [P0] NEW-006 documents the core metric battery (precision, recall, MRR, NDCG) with all values expected in [0,1] range [EVIDENCE: spec.md REQ-002 and plan.md testing strategy row]
- [x] CHK-012 [P0] NEW-007 documents the observer-effect mitigation check with forced logging-failure injection and comparison of search output with and without the fault [EVIDENCE: spec.md REQ-003 and plan.md testing strategy row]
- [x] CHK-013 [P0] NEW-008 documents the full-context ceiling evaluation with title-summary corpus setup, ceiling vs hybrid vs BM25 comparison, and ceiling >= all baselines acceptance rule [EVIDENCE: spec.md REQ-004 and plan.md testing strategy row]
- [x] CHK-014 [P0] NEW-009 documents the quality proxy manual verification with log export, manual worksheet, stored value comparison, and 0.01 tolerance acceptance rule [EVIDENCE: spec.md REQ-005 and plan.md testing strategy row]
- [x] CHK-015 [P0] NEW-010 documents the synthetic ground-truth corpus audit with >=3 intent categories, >=5 hard negatives, and >=3 non-trigger prompts acceptance rule [EVIDENCE: spec.md REQ-006 and plan.md testing strategy row]
- [x] CHK-016 [P0] NEW-011 documents the BM25-only baseline measurement with non-BM25 channels disabled, two runs for determinism, and MRR@5 acceptance check [EVIDENCE: spec.md REQ-007 and plan.md testing strategy row]
- [x] CHK-017 [P0] NEW-012 documents agent consumption instrumentation behavior in inert mode with handler wiring trace, gate state confirmation, and no-telemetry-output acceptance rule [EVIDENCE: spec.md REQ-008 and plan.md testing strategy row]
- [x] CHK-018 [P0] NEW-013 documents scoring observability with sampled-row logging at expected rate, forced write-error injection, and graceful fallback acceptance check [EVIDENCE: spec.md REQ-009 and plan.md testing strategy row]
- [x] CHK-019 [P0] NEW-014 documents the ablation and reporting workflow with channel-off ablation, persisted snapshot inspection, and dashboard text/JSON output acceptance check [EVIDENCE: spec.md REQ-010 and plan.md testing strategy row]
- [x] CHK-020 [P0] NEW-015 documents shadow scoring deactivation with shadow-flag toggling, unchanged live-ranking confirmation, and attribution metadata continuity check [EVIDENCE: spec.md REQ-011 and plan.md testing strategy row]
- [x] CHK-021 [P0] NEW-072 documents the test quality inspection with teardown, assertion specificity, and flake signal review [EVIDENCE: spec.md REQ-012 and plan.md testing strategy row]
- [x] CHK-022 [P0] NEW-082 documents the evaluation and housekeeping reliability check with unique run-ID verification, upsert consistency, and boundary-guard rejection of invalid values [EVIDENCE: spec.md REQ-013 and plan.md testing strategy row]
- [x] CHK-023 [P0] NEW-088 documents the cross-AI validation fix verification with per-tier-4-fix inspection, representative flow execution, and regression check [EVIDENCE: spec.md REQ-014 and plan.md testing strategy row]
- [x] CHK-024 [P0] NEW-090 documents the INT8 quantization decision review with metrics-against-no-go criteria comparison and documented rationale if criteria change [EVIDENCE: spec.md REQ-015 and plan.md testing strategy row]
- [x] CHK-025 [P0] NEW-126 documents the memory roadmap baseline snapshot suite with the exact command `cd .opencode/skill/system-spec-kit/mcp_server && npm test -- --run tests/memory-state-baseline.vitest.ts` and all-tests-passing acceptance check [EVIDENCE: spec.md REQ-016 and plan.md testing strategy row]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] NEW-005 has been executed and eval DB schema dump, retrieval event rows, and main DB integrity evidence are captured [EVIDENCE: execution log attached]
- [ ] CHK-031 [P0] NEW-006 has been executed and per-metric output showing precision, recall, MRR, and NDCG values in [0,1] range is captured [EVIDENCE: execution log attached]
- [ ] CHK-032 [P0] NEW-007 has been executed and search output and timing comparison during forced logging failure are captured [EVIDENCE: execution log attached]
- [ ] CHK-033 [P0] NEW-008 has been executed and ceiling ranking output with comparison table against hybrid and BM25 baselines is captured [EVIDENCE: execution log attached]
- [ ] CHK-034 [P0] NEW-009 has been executed and log export, manual worksheet, and stored proxy comparison evidence are captured [EVIDENCE: execution notes attached]
- [ ] CHK-035 [P0] NEW-010 has been executed and corpus audit report with intent counts, hard negatives, and tier histogram is captured [EVIDENCE: inspection notes attached]
- [ ] CHK-036 [P0] NEW-011 has been executed and baseline output with MRR@5 and BM25-only trace across two runs is captured [EVIDENCE: execution log attached]
- [ ] CHK-037 [P0] NEW-012 has been executed and instrumentation trace showing handler wiring, gate state, and absence of telemetry output is captured [EVIDENCE: execution log attached]
- [ ] CHK-038 [P0] NEW-013 has been executed and observability log rows, forced-error output, and sampling-rate verification evidence are captured [EVIDENCE: execution log attached]
- [ ] CHK-039 [P0] NEW-014 has been executed and ablation snapshots plus dashboard text or JSON output with per-channel metrics are captured [EVIDENCE: execution log attached]
- [ ] CHK-040 [P0] NEW-015 has been executed and search output showing attribution metadata and unchanged live ranking is captured [EVIDENCE: execution log attached]
- [ ] CHK-041 [P0] NEW-072 has been executed and test inspection notes covering teardown, assertion specificity, and flake signals are captured [EVIDENCE: inspection notes attached]
- [ ] CHK-042 [P0] NEW-082 has been executed and eval run output, run ID evidence, upsert verification, and boundary guard check evidence are captured [EVIDENCE: execution log attached]
- [ ] CHK-043 [P0] NEW-088 has been executed and fix-location inspection notes, representative flow output, and regression check evidence are captured [EVIDENCE: inspection notes attached]
- [ ] CHK-044 [P0] NEW-090 has been executed and metrics summary and documented decision rationale are captured [EVIDENCE: inspection notes attached]
- [ ] CHK-045 [P0] NEW-126 has been executed and targeted test transcript showing persisted snapshots and missing-context fallback coverage is captured [EVIDENCE: test output attached]
- [ ] CHK-046 [P0] Each of the 16 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes]
- [ ] CHK-047 [P1] Coverage summary reports 16/16 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P0] No secrets or credentials were added to evaluation-and-measurement phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-051 [P1] Sandbox and DB isolation guidance for NEW-005, NEW-082, and NEW-126 does not instruct reviewers to log raw absolute DB paths or expose eval store internals [EVIDENCE: plan.md Phase 2 and Phase 3 steps use disposable/checkpointed paths without raw path logging]
- [ ] CHK-052 [P2] Open questions about shared-vs-disposable sandbox for NEW-005, NEW-082, and NEW-126 are resolved before those scenarios run in a shared environment [EVIDENCE: open questions in spec.md addressed or deferred with rationale]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook rows for NEW-005 through NEW-015, NEW-072, NEW-082, NEW-088, NEW-090, and NEW-126]
- [ ] CHK-061 [P0] All four phase documents are synchronized: scenario names, prompts, and execution types are consistent across spec, plan, tasks, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-062 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `009-evaluation-and-measurement/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `009-evaluation-and-measurement/` [EVIDENCE: directory listing confirms four files]
- [ ] CHK-071 [P1] No unrelated files were added outside the `009-evaluation-and-measurement/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-072 [P2] Memory save was triggered after phase packet creation to make evaluation-and-measurement context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 0/27 |
| P1 Items | 6 | 0/6 |
| P2 Items | 3 | 0/3 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

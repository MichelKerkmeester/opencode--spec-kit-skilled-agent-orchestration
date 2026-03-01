---
title: "Tasks: 006-hybrid-rag-fusion-logic-improvements [template:level_3+/tasks.md]"
description: "Task format uses task id, priority tag, optional parallel marker, description, and file path with measurable acceptance and dependency mapping."
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "hybrid rag"
  - "fusion improvements"
  - "cross-system hardening"
  - "bug prevention"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: 006-hybrid-rag-fusion-logic-improvements

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[P0]`/`[P1]`/`[P2]` | Priority |

**Task Format**: `T### [priority] [P optional] Description (file path)`
<!-- /ANCHOR:notation -->

---

## Prior-Work Carry-Forward

| Prior Spec | Required Carry-Forward in 006 | Expansion in 006 Tasks |
|------------|-------------------------------|-------------------------|
| `002-hybrid-rag-fusion` | Preserve tri-hybrid + MMR/TRM baseline | Extend with graph-contract calibration and cognitive weighting controls |
| `003-index-tier-anomalies` | Keep canonical path and tier precedence as hard invariants | Add parser/index automation and storage-ledger reliability gates |
| `004-frontmatter-indexing` | Keep normalized frontmatter + idempotent reindex | Add CRUD re-embed metadata consistency and docs/schema governance checks |
| `005-auto-detected-session-bug` | Keep low-confidence routing safeguards and archive exclusion behavior | Extend to session-learning quality/performance and runbook automation |

## Subsystem-to-Task Coverage

| Scoped Subsystem Area | Task Coverage |
|-----------------------|---------------|
| Retrieval/fusion pipeline | T005, T008, T020 |
| Graph/causal contracts + relation scoring | T006 |
| Cognitive/attention-decay + FSRS ranking | T007 |
| Session manager + session-learning quality/performance | T009, T010 |
| Memory CRUD + metadata re-embedding consistency | T011 |
| Parser/indexing invariants + index health automation | T012, T014 |
| Storage reliability + mutation ledger consistency | T013, T021 |
| Telemetry/trace schema governance + docs drift prevention | T015, T016 |
| Deferred/skipped-path test hardening | T019 |
| Automation loops + operational self-healing runbooks | T017, T018, T021 |

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Cross-System Audit and Continuity Lock

- [x] T001 [P0] Build ten-subsystem contract map across retrieval, graph, cognitive, session, CRUD, parser/index, storage, telemetry, tests, and operations (`spec.md`, audit artifacts)
- [x] T002 [P0] Capture baseline fixture corpus and metrics (latency, quality, misroute, stale-embed backlog, recovery timing) (`mcp_server/tests/*`, benchmark scripts) [EVIDENCE: `scratch/w6-baseline-metrics-sweep.md`]
- [x] T003 [P0] Create ranked seam-risk register with owner and mitigation for each subsystem (`spec.md`, `plan.md`, `decision-record.md`)
- [x] T004 [P1] Validate continuity assumptions from `002/003/004/005` and map to 006 requirement IDs (`spec.md`, `plan.md`, `tasks.md`)
- [x] T025 [P0] Lock relation-score adjudication corpus policy (shared vs domain-specific corpus) with approved fixture governance (`spec.md`, `decision-record.md`, ranking fixtures)
- [x] T026 [P0] Lock cognitive-weight policy scope (global bounds vs intent-scoped bounds) and rollout defaults (`spec.md`, `decision-record.md`, scoring fixtures)
- [x] T027 [P1] Lock self-healing auto-remediation policy (auto-apply vs operator acknowledgement by failure class) with escalation guardrails (`plan.md`, `checklist.md`, runbook artifacts) [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md` runbook drill entries]
<!-- /ANCHOR:phase-1 -->

### Phase 1 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T001 | None | Contract map includes input/output invariants for all ten subsystem areas. |
| T002 | T001 | Baseline metrics are reproducible with command references and fixture versioning. |
| T003 | T001, T002 | Top risks are ranked by impact/likelihood and have named owner + mitigation path. |
| T004 | T001 | All inherited assumptions from `002`-`005` map to explicit controls in `006` artifacts. |
| T025 | T001, T002, T003 | Relation-score adjudication corpus policy is approved with fixture manifest and replay evidence. |
| T026 | T002, T003 | Cognitive-weight policy scope is approved with ablation evidence and rollout-bound definition. |
| T027 | T003 | Self-healing auto-remediation policy is approved with failure-class matrix and escalation/rollback guardrails. |

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Ranking and Channel Contract Hardening

- [x] T005 [P0] Implement bounded retrieval/fusion guardrails with deterministic tie and fallback behavior (`lib/search/adaptive-fusion.ts`, `lib/search/hybrid-search.ts`)
- [x] T006 [P0] Formalize graph/causal channel contracts and calibrate relation scoring (`lib/search/co-activation.ts`, `lib/scoring/*`, tests)
- [x] T007 [P0] Integrate cognitive/attention-decay and FSRS modifiers with bounded contribution (`lib/scoring/*`, `lib/search/*`)
- [x] T008 [P1] [P] Emit debug diagnostics for channel contributions, cognitive modifiers, and low-confidence rationale (`handlers/memory-search.ts`, telemetry interfaces)
<!-- /ANCHOR:phase-2 -->

### Phase 2 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T005 | T002, T003 | Deterministic regression fixtures pass with stable ranked outputs and fallback order. |
| T006 | T002, T003, T025 | Graph contract tests pass and relation ordering reaches Kendall tau >= 0.75 on adjudicated fixture. |
| T007 | T002, T005, T026 | NDCG@5 improves >= 8% on long-tail fixture with <= 3% regression on primary fixture and 5-25% cognitive weight bound. |
| T008 | T005, T006, T007 | Debug metadata includes ranked-channel/cognitive rationale without sensitive data leakage. |

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Session and State Integrity Hardening

- [x] T009 [P0] Improve session manager selection quality and latency with ambiguity handling (`lib/session/*`, folder/session selection handlers)
- [x] T010 [P0] Harden session-learning pipeline freshness, feedback hygiene, and performance instrumentation (`lib/session-learning/*`, tests)
- [x] T011 [P0] Enforce memory CRUD to re-embedding consistency workflow with backlog SLA guards (`handlers/memory-crud.ts`, embedding queue orchestration)
- [x] T012 [P0] Add parser/indexing invariant checks and index-health automation hooks (`lib/parsing/memory-parser.ts`, `handlers/memory-index.ts`)
- [x] T013 [P0] Implement transaction recovery and mutation-ledger consistency checks (`lib/storage/sqlite-transaction-recovery.ts`, `lib/storage/mutation-ledger.ts`)
- [x] T014 [P1] [P] Add auto-reconcile hooks for index/ledger divergence with bounded retry policy (`scripts/ops/*`, storage/index handlers)
<!-- /ANCHOR:phase-3 -->

### Phase 3 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T009 | T004, T008 | Session misroute rate <= 1% and p95 selection <= 250ms on 500-candidate fixture. |
| T010 | T004, T009 | Session-learning freshness checks prevent stale updates and batch p95 <= 400ms. |
| T011 | T004, T010 | 100% CRUD mutations trigger re-embed reconciliation; stale backlog >15m remains zero in validation run. |
| T012 | T004, T011 | CI fails on canonical path, tier precedence, or metadata invariant violations with actionable diagnostics. |
| T013 | T012 | Recovery replay preserves committed mutations (RPO 0) and completes <= 120s in simulation. |
| T014 | T012, T013 | Divergence auto-reconcile executes deterministic retry and escalates after bounded attempts. |

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Telemetry Governance and Operational Automation

- [x] T015 [P0] Define canonical telemetry/trace schema and enforce payload validation (`lib/telemetry/trace-schema.ts`, emitters, tests) [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md` command 4]
- [x] T016 [P0] Implement documentation drift prevention checks for telemetry and operational contracts (`scripts/spec-folder/alignment-validator.ts`, docs validation hooks) [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md` command 4]
- [x] T017 [P1] Draft and verify runbooks for index drift, session ambiguity, ledger mismatch, and telemetry drift (`plan.md`, `checklist.md`, ops docs) [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md` commands 5-6]
- [x] T018 [P1] [P] Wire self-healing automation loops and operational checks into CI/scheduled runs (`scripts/ops/*`, CI config)
<!-- /ANCHOR:phase-4 -->

### Phase 4 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T015 | T008, T012 | All trace payloads validate against schema registry in tests and CI checks. |
| T016 | T015 | Schema/doc mismatch fails validation with field-level diffs and remediation hints. |
| T017 | T013, T016, T027 | Four runbook drill classes documented with trigger, command set, owner, and escalation path. |
| T018 | T014, T017, T027 | Self-healing checks detect/remediate four known failure classes with simulated MTTR <= 10 minutes. |

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification Hardening and Governance Closure

- [x] T019 [P0] Expand and close deferred/skipped-path tests from `002`/`003`/`004`/`005` lineage (`mcp_server/tests/*`, script tests) [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md` commands 2-3]
- [x] T020 [P0] Run consolidated performance/reliability verification (retrieval, session, recovery, automation) against required thresholds [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md`, `scratch/w6-baseline-metrics-sweep.md`]
- [x] T021 [P1] Execute failure-injection drills for recovery and self-healing paths and capture evidence (`scripts/ops/*`, verification artifacts) [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md` commands 5-6]
- [x] T022 [P1] Synchronize checklist evidence and sign-off model across all Level 3+ docs (`checklist.md`, `spec.md`) [EVIDENCE: docs sync closure dated 2026-02-22]
- [x] T023 [P1] Finalize decision record and implementation summary with delivered subsystem evidence (`decision-record.md`, `implementation-summary.md`)
- [ ] T024 [P2] Save context snapshot after implementation completion (`memory/` via generate-context script) [DEFERRED: memory snapshot generation intentionally not executed in this closure pass because user scope is markdown-only updates in this folder; reclassified from completed to deferred per governance review]
- [x] T028 [P0] Execute global quality sweep across all implemented updates/new features and publish evidence in `global-quality-sweep.md` [EVIDENCE: `global-quality-sweep.md` EVT-001]
- [x] T029 [P0] Run global bug detection sweep and close all discovered P0/P1 defects; publish closure evidence in `global-quality-sweep.md` [EVIDENCE: `global-quality-sweep.md` EVT-002]
- [x] T030 [P1] Complete `sk-code--opencode` compliance audit for all changed/added code paths and capture findings in `global-quality-sweep.md` [EVIDENCE: `global-quality-sweep.md` EVT-003]
- [x] T031 [P1] Apply conditional standards update only if architecture mismatch is confirmed; document rationale/evidence in `global-quality-sweep.md` [EVIDENCE: `global-quality-sweep.md` EVT-004 (`N/A`, no mismatch detected)]
<!-- /ANCHOR:phase-5 -->

### Phase 5 Task Matrix

| Task ID | Depends On | Acceptance Criteria |
|---------|------------|---------------------|
| T019 | T015, T018 | Deferred/skipped inventory is closed or explicitly approved with owner and re-entry condition. |
| T020 | T005, T007, T009, T010, T013, T018 | Thresholds met: retrieval p95, session p95, recovery timing, and automation overhead budgets. |
| T021 | T017, T018 | Failure-injection drill results include pass/fail, remediation time, and follow-up action entries. |
| T022 | T019, T020 | All P0 checklist items complete; P1 items complete or approved deferred with rationale. |
| T023 | T022 | ADRs, implementation summary, and sign-off status are synchronized and evidence-backed. |
| T024 | T023 | Context snapshot saved with final status, blockers, and next-step handoff. |
| T028 | T019, T020, T021 | Global quality sweep executed across all implemented updates/new features with complete evidence entries in `global-quality-sweep.md`. |
| T029 | T028 | Bug detection sweep completed with unresolved defect counts `P0=0` and `P1=0`, evidence published in `global-quality-sweep.md`. |
| T030 | T028 | `sk-code--opencode` compliance audit covers all changed/added code paths with evidence and closure state captured in `global-quality-sweep.md`. |
| T031 | T030 | If architecture mismatch exists, standards update is documented with rationale and evidence; otherwise marked approved `N/A` with rationale in `global-quality-sweep.md`. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Decision-lock tasks `T025`, `T026`, and `T027` are closed before Phase 2 starts
- [x] Performance, recovery, and automation gates passed [EVIDENCE: `scratch/final-quality-evidence-2026-02-22.md`, `scratch/w6-baseline-metrics-sweep.md`]
- [x] `T028` and `T029` are closed with evidence in `global-quality-sweep.md`
- [x] `T030` and `T031` are closed, or `T031` is approved `N/A` with explicit rationale/evidence in `global-quality-sweep.md`
- [x] Governance approval workflow updated to approved state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Global Quality Sweep**: See `global-quality-sweep.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
TASKS FILE
Actionable task breakdown with dependency and acceptance matrices across all scoped subsystems.
-->

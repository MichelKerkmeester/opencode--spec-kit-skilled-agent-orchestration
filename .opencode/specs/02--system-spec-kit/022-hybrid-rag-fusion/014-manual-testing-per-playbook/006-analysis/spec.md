---
title: "Feature Specification: manual-testing-per-playbook analysis phase [template:level_1/spec.md]"
description: "Phase 006 documents the analysis manual test packet for the Spec Kit Memory system. It breaks seven analysis scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "analysis manual testing"
  - "phase 006 analysis"
  - "causal graph manual tests"
  - "hybrid rag fusion analysis playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook analysis phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
| **Predecessor Phase** | `005-lifecycle` |
| **Successor Phase** | `007-evaluation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual analysis scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated analysis packet, Phase 006 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single analysis-focused specification that maps all seven Phase 006 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook. EX-021 is a destructive scenario (causal edge deletion) and MUST run only in a disposable sandbox spec folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| EX-019 | Causal edge creation (memory_causal_link) | [`../../feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md`](../../feature_catalog/06--analysis/01-causal-edge-creation-memorycausallink.md) | `Link source->target supports strength 0.8` | `memory_causal_link({ sourceId:"<memory-id-a>", targetId:"<memory-id-b>", relation:"supports", strength:0.8 })` -> `memory_drift_why({ memoryId:"<memory-id-b>", direction:"both", maxDepth:4 })` |
| EX-020 | Causal graph statistics (memory_causal_stats) | [`../../feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md`](../../feature_catalog/06--analysis/02-causal-graph-statistics-memorycausalstats.md) | `Return causal stats and coverage` | `memory_causal_stats()` |
| EX-021 | Causal edge deletion (memory_causal_unlink) [DESTRUCTIVE] | [`../../feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md`](../../feature_catalog/06--analysis/03-causal-edge-deletion-memorycausalunlink.md) | `Delete causal edge by ID in sandbox` | `memory_drift_why({ memoryId:"<sandbox-memory-id>", direction:"both", maxDepth:4 })` -> `memory_causal_unlink({ edgeId:<edge-id-from-trace> })` -> `memory_drift_why({ memoryId:"<sandbox-memory-id>", direction:"both", maxDepth:4 })` |
| EX-022 | Causal chain tracing (memory_drift_why) | [`../../feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md`](../../feature_catalog/06--analysis/04-causal-chain-tracing-memorydriftwhy.md) | `Trace both directions to depth 4` | `memory_drift_why(memoryId,direction:both,maxDepth:4)` |
| EX-023 | Epistemic baseline capture (task_preflight) | [`../../feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md`](../../feature_catalog/06--analysis/05-epistemic-baseline-capture-taskpreflight.md) | `Create preflight for pipeline-v2-audit` | `task_preflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore)` |
| EX-024 | Post-task learning measurement (task_postflight) | [`../../feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md`](../../feature_catalog/06--analysis/06-post-task-learning-measurement-taskpostflight.md) | `Complete postflight for pipeline-v2-audit` | `task_postflight(specFolder,taskId,knowledgeScore,uncertaintyScore,contextScore)` |
| EX-025 | Learning history (memory_get_learning_history) | [`../../feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md`](../../feature_catalog/06--analysis/07-learning-history-memorygetlearninghistory.md) | `Show completed learning history` | `memory_get_learning_history(specFolder,onlyComplete:true)` |

### Out of Scope
- Executing the seven analysis scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-analysis phases from `001-retrieval/` through `019-feature-flag-reference/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 006 analysis requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 006 analysis execution plan and review workflow |
| `tasks.md` | Create | Phase 006 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 006 verification checklist with P0/P1/P2 items |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document EX-019 causal edge creation with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if edge appears in chain trace after `memory_causal_link` and is visible in `memory_drift_why` response |
| REQ-002 | Document EX-020 causal graph statistics with its exact prompt, single-call command sequence, evidence target, and feature link. | PASS if coverage and edge metrics are returned by `memory_causal_stats` |
| REQ-003 | Document EX-021 causal edge deletion (destructive) with its exact sandbox prompt, three-step command sequence, evidence target, and feature link. | PASS if deleted edge is absent from the post-deletion `memory_drift_why` trace; MUST run in disposable sandbox only |
| REQ-004 | Document EX-022 causal chain tracing with its exact bidirectional trace prompt, command sequence, evidence target, and feature link. | PASS if causal path is returned in both directions |
| REQ-005 | Document EX-023 epistemic baseline capture with its exact preflight prompt, command sequence, evidence target, and feature link. | PASS if baseline record is persisted with all required fields |
| REQ-006 | Document EX-024 post-task learning measurement with its exact postflight prompt, command sequence, evidence target, and feature link. | PASS if delta and Learning Index record are saved; taskId must match EX-023 preflight |
| REQ-007 | Document EX-025 learning history with its exact filtered history prompt, command sequence, evidence target, and feature link. | PASS if completed learning cycles are listed from `memory_get_learning_history` |

No P1 items are defined for this phase; all seven analysis scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 analysis tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for EX-019, EX-020, EX-021, EX-022, EX-023, EX-024, and EX-025 will be collected.
- **SC-003**: Reviewers can audit every Phase 006 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) which includes verdict and coverage rules.
- **SC-004**: EX-021 is explicitly flagged as destructive and its sandbox isolation requirement is documented in both `spec.md` and `plan.md`.
- **SC-005**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) (verdict rules) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/06--analysis/`](../../feature_catalog/06--analysis/) | Supplies feature context for each analysis scenario | Keep every test row linked to its mapped analysis feature file |
| Dependency | MCP runtime plus causal graph and learning data | Required to execute `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_drift_why`, `task_preflight`, `task_postflight`, and `memory_get_learning_history` scenarios safely | Run stateful and destructive tests in an isolated sandbox and preserve checkpoint instructions in the plan |
| Risk | EX-021 permanently deletes a causal edge from the graph | High | Restrict `memory_causal_unlink` execution to a disposable sandbox spec folder and record a named checkpoint for rollback evidence before running; abort and mark blocked if sandbox isolation cannot be confirmed |
| Risk | EX-023 and EX-024 share a `(specFolder, taskId)` pair and must run in sequence | Medium | Create preflight (EX-023) before postflight (EX-024) in the same session; record both `specFolder` and `taskId` values before execution to prevent mismatch errors |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which disposable sandbox spec folder should Phase 006 reviewers use for EX-021 to ensure the deleted edge cannot affect active project data?
- What `specFolder` and `taskId` values should be used for EX-023 and EX-024 to guarantee consistency across testers and machines?
<!-- /ANCHOR:questions -->

---

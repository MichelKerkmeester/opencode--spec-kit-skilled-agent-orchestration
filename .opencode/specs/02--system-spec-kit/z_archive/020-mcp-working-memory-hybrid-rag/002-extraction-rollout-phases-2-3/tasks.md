---
title: "Tasks: Extraction and Rollout Package (Phase 2, 3) [002-extraction-rollout-phases-2-3/tasks]"
description: "Tracking document synchronized with root execution state; historical execution closure retained and post-research wave transition mapping recorded."
trigger_phrases:
  - "tasks"
  - "extraction"
  - "and"
  - "rollout"
  - "package"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Extraction and Rollout Package (Phase 2, 3)

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-package-tasks | v1.1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked by dependency |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:package-task-groups -->
## 1. Package Task Groups

### Group A - Phase 2 Extraction and Redaction
- [x] EXR-001 Complete extraction adapter tasks (`T029-T037`).
- [x] EXR-002 Complete calibrated redaction tasks (`T035a-T035e`).
- [x] EXR-003 Complete causal boost tasks (`T038-T044`).
- [x] EXR-004 [B:EXR-001,EXR-002,EXR-003] Complete prompt injection/integration tasks (`T045-T055`). [Evidence: root `tasks.md` marks `T054` and `T055` complete with signed review packets and dark-launch checklist execution.]

### Group B - Phase 3 Rollout
- [x] EXR-010 Complete telemetry and logging tasks (`T056-T060`).
- [x] EXR-011 [B:EXR-010] Complete staged rollout tasks (`T061-T066`). [Status: administratively closed per user directive.]
- [x] EXR-012 [B:EXR-011] Complete runbook and documentation tasks (`T067-T070`). [Status: administratively closed per user directive.]
<!-- /ANCHOR:package-task-groups -->

<!-- ANCHOR:dependency-sync -->
## 2. Dependency and Sync Tasks

- [x] EXR-020 Confirm package 001 hard-gate completion before `EXR-001` starts.
- [x] EXR-021 Confirm package 003 quality signals are available before full rollout.
- [x] EXR-022 Confirm root mappings remain synchronized in `../tasks.md` and `../checklist.md`.
<!-- /ANCHOR:dependency-sync -->

<!-- ANCHOR:evidence -->

## 3. Evidence Requirements

- [x] EXR-E01 Extraction metrics evidence attached (precision/recall).
- [x] EXR-E02 Retrieval stability evidence attached (MRR comparison).
- [x] EXR-E03 Rollout and rollback evidence attached (telemetry logs and runbook output).
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:completion -->
## 4. Completion Conditions

- [x] All `EXR-001` through `EXR-012` completed.
- [x] All `EXR-E01` through `EXR-E03` completed.
- [x] Staged rollout evidence and rollback readiness documented.
- [x] Root mapping remains synchronized.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:post-research-transition -->
## 5. Post-Research Wave Transition

- [x] EXR-030 Publish Wave 1 ownership handoff (`C136-08`, `C136-09`, `C136-10`, `C136-12`, `C136-01`, `C136-02`, `C136-03`) to package `../004-post-research-wave-1-governance-foundations/`, including explicit ownership for adaptive fusion, typed trace envelope, artifact-aware routing, and degraded-mode contract readiness.
- [x] EXR-031 Publish Wave 2 ownership handoff (`C136-04`, `C136-05`, `C136-11`) to package `../005-post-research-wave-2-controlled-delivery/`, including append-only ledger plus sync/async and deterministic-tool operationalization scope.
- [x] EXR-032 Publish Wave 3 ownership handoff (`C136-06`, `C136-07`) to package `../006-post-research-wave-3-outcome-confirmation/`, including capability truth matrix longitudinal confirmation ownership.
- [x] EXR-033 Confirm root synchronization for wave packages in `../spec.md`, `../plan.md`, `../tasks.md`, and `../checklist.md`.
- [x] EXR-034 Record handoff sequencing lock: Wave 1 (`004`) -> Wave 2 (`005`) -> Wave 3 (`006`) with no backlog-ID remapping.
- [x] EXR-035 Preserve historical evidence while appending transition context (no deletion of Phase 2/3 completion records).

Tracking document synchronized with root execution state; historical execution closure retained and post-research wave transition mapping recorded.
<!-- /ANCHOR:post-research-transition -->

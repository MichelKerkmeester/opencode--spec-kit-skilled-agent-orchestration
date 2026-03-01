---
title: "Tasks: Memory Quality Package (QP-0 to QP-4) [003-memory-quality-qp-0-4/tasks]"
description: "Tracking document synchronized with root execution state; administrative closure applied per user directive."
trigger_phrases:
  - "tasks"
  - "memory"
  - "quality"
  - "package"
  - "003"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Quality Package (QP-0 to QP-4)

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

### Group A - Baseline Harness (QP-0)
- [x] MQ-001 Complete fixture baseline tasks (`TQ001-TQ005`).

### Group B - Validator and Contamination (QP-1)
- [x] MQ-010 Complete post-render validator tasks (`TQ010-TQ011`, `TQ013`, `TQ015`).
- [x] MQ-011 Complete contamination filter tasks (`TQ012`, `TQ014`).

### Group C - Decision and Semantic Quality (QP-2)
- [x] MQ-020 Complete decision extraction tasks (`TQ020-TQ021`, `TQ025`).
- [x] MQ-021 Complete semantic backfill tasks (`TQ022-TQ023`, `TQ026`).
- [x] MQ-022 Complete placeholder suppression tasks (`TQ024`, `TQ027`, `TQ028`).

### Group D - Quality Score and KPIs (QP-3)
- [x] MQ-030 Complete quality scoring tasks (`TQ030-TQ034`).
- [x] MQ-031 Complete KPI automation task (`TQ035`).

### Group E - Legacy Remediation (QP-4)
- [x] MQ-040 [B:MQ-031] Complete active-tier remediation tasks (`TQ040-TQ046`).
- [x] MQ-041 [B:MQ-040] Complete archive-tier handling task (`TQ047`).
<!-- /ANCHOR:package-task-groups -->

<!-- ANCHOR:evidence -->

## 2. Evidence Requirements

- [x] MQ-E01 Quality gate test evidence attached (known-bad fail / known-good pass).
- [x] MQ-E02 KPI 14-day evidence attached for `SC-006-SC-013`. [Status: administratively closed per user directive; see `scratch/quality-kpi-14day.md`.]
- [x] MQ-E03 Legacy remediation before/after retrieval comparison attached.
<!-- /ANCHOR:evidence -->

<!-- ANCHOR:completion -->
## 3. Completion Conditions

- [x] All package tasks `MQ-001` through `MQ-041` completed.
- [x] All evidence tasks `MQ-E01` through `MQ-E03` completed.
- [x] Root KPI targets for `SC-006` through `SC-013` are measurable and traceable.
- [x] Root mapping remains synchronized.

Tracking document synchronized with root execution state; administrative closure applied per user directive.
<!-- /ANCHOR:completion -->

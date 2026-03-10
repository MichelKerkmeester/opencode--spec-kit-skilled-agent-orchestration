---
title: "Tasks: evaluation-and-measurement [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "evaluation"
  - "measurement"
  - "core metric computation"
  - "observer effect mitigation"
  - "shadow scoring"
importance_tier: "normal"
contextType: "general"
---
# Tasks: evaluation-and-measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Align metric-count contract (11 vs 12) across feature docs and eval-metrics references (`feature_catalog/09--evaluation-and-measurement/`, `mcp_server/lib/eval/eval-metrics.ts`)
- [ ] T002 Add missing per-feature source/test mappings for F-03, F-04, F-05, F-12, and F-14 (`feature_catalog/09--evaluation-and-measurement/`)
- [ ] T003 [P] Add explicit NEW-050..072 playbook coverage mapping (or documented gaps) for each of the 14 features (`feature_catalog/09--evaluation-and-measurement/`)
- [ ] T004 [P] Define non-fatal logging policy for currently silent evaluation and telemetry catch blocks (`mcp_server/lib/eval/`, `mcp_server/lib/telemetry/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Fix duplicate-ID precision/F1 inflation by applying dedupe semantics consistent with recall/MAP (`mcp_server/lib/eval/eval-metrics.ts`, `mcp_server/tests/eval-metrics.vitest.ts`)
- [ ] T006 Implement or document-correct observer p95 enabled-vs-disabled overhead behavior and alerting path (`mcp_server/lib/eval/`, `feature_catalog/09--evaluation-and-measurement/03-observer-effect-mitigation.md`)
- [ ] T007 Replace placeholder channel attribution assertions with real channel-attribution behavior tests (`mcp_server/tests/channel.vitest.ts`, `mcp_server/lib/eval/channel-attribution.ts`)
- [ ] T008 Replace silent close catch in eval DB helpers with non-fatal warning logging (`mcp_server/lib/eval/eval-db.ts`)
- [ ] T009 Guard bootstrap confidence interval iteration bounds and add invalid-input coverage (`mcp_server/lib/eval/bm25-baseline.ts`, `mcp_server/tests/bm25-baseline.vitest.ts`)
- [ ] T010 Add non-fatal logging for broad consumption logger catch paths (`mcp_server/lib/telemetry/consumption-logger.ts`, `mcp_server/tests/consumption-logger.vitest.ts`)
- [ ] T011 Align scoring observability behavior/docs for failure reporting semantics (`mcp_server/lib/telemetry/scoring-observability.ts`, `feature_catalog/09--evaluation-and-measurement/09-scoring-observability.md`)
- [ ] T012 Fix ablation baseline query-count persistence when all channel runs fail (`mcp_server/lib/eval/ablation-framework.ts`, `mcp_server/tests/ablation-framework.vitest.ts`)
- [ ] T013 Fix eval run counter bootstrap to derive max run ID from both final and channel result tables (`mcp_server/lib/eval/eval-logger.ts`, `mcp_server/tests/eval-logger.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 [P] Add edge-case regression tests for duplicate IDs, bootstrap CI bounds, and baseline query-count persistence (`mcp_server/tests/`)
- [ ] T015 [P] Validate observer-overhead and channel-attribution coverage against current-reality claims (`mcp_server/tests/`, `feature_catalog/09--evaluation-and-measurement/`)
- [ ] T016 Verify all 14 features include auditable source/test evidence links and cross-AI remediation traceability (`feature_catalog/09--evaluation-and-measurement/`)
- [ ] T017 Synchronize `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` status/summary counts after verification (`009-evaluation-and-measurement/*.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

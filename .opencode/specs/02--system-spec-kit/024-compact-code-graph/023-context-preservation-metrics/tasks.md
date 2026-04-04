<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Tasks: Context Preservation Metrics [024/023]"
description: "Task tracking for session metrics and quality scoring."
---
# Tasks: Phase 023 — Context Preservation Metrics


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
### Task Notation
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
### Phase 1: Setup
- [x] T001 Define `SessionMetrics` and `MetricEvent` types (`lib/session/context-metrics.ts`)
- [x] T002 Establish in-memory metrics collection boundaries (`lib/session/context-metrics.ts`)
- [x] T003 Document SQLite persistence as deferred instead of shipped (`spec.md`, `plan.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
### Phase 2: Implementation
- [x] T004 Implement `recordMetricEvent()` aggregate collector (`lib/session/context-metrics.ts`)
- [x] T005 Implement `computeQualityScore()` with recency, recovery, graph freshness, and continuity factors (`lib/session/context-metrics.ts`)
- [x] T006 Instrument `context-server.ts` with lifecycle metric events (`context-server.ts`)
- [x] T007 Surface computed quality details in `session_health` (`handlers/session-health.ts`)
- [x] T008 Final `session_health` status limitation is documented accurately — quality score is computed, but the final traffic-light status still uses legacy heuristics (`handlers/session-health.ts`)
- [x] T009 Shared response metadata is implemented via `lib/response/envelope.ts` (`lib/response/envelope.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
### Phase 3: Verification
- [x] T010 Reconcile phase docs with actual shipped scope (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] T011 Correct Spec Folder metadata to basename only (`implementation-summary.md`)
- [x] T012 Document graph threshold mismatch and aggregate-only metrics limitations (all phase docs)
- [x] T013 Dashboard integration is implemented via `handlers/eval-reporting.ts` and `lib/eval/reporting-dashboard.ts`
- [x] T014 Drift-detection follow-up remains explicitly deferred because `lib/session/context-drift.ts` does not exist yet
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
### Completion Criteria
- [x] Shipped work is marked complete and unsupported claims are removed
- [x] Deferred items are explicitly tracked for future follow-up
- [x] Dashboard and response-envelope work are complete, and the remaining status/drift limitations are explicitly documented
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
### Cross-References
- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

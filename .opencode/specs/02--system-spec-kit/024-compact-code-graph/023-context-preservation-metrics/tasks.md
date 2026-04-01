---
title: "Tasks: Context Preservation Metrics [024/023]"
description: "Task tracking for session metrics and quality scoring."
---
# Tasks: Phase 023 — Context Preservation Metrics

<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Define `SessionMetrics` and `MetricEvent` types (`lib/session/context-metrics.ts`)
- [x] T002 Establish in-memory metrics collection boundaries (`lib/session/context-metrics.ts`)
- [x] T003 Document SQLite persistence as deferred instead of shipped (`spec.md`, `plan.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement `recordMetricEvent()` aggregate collector (`lib/session/context-metrics.ts`)
- [x] T005 Implement `computeQualityScore()` with recency, recovery, graph freshness, and continuity factors (`lib/session/context-metrics.ts`)
- [x] T006 Instrument `context-server.ts` with lifecycle metric events (`context-server.ts`)
- [x] T007 Surface computed quality details in `session_health` (`handlers/session-health.ts`)
- [ ] T008 Align final `session_health` status with computed quality score (`handlers/session-health.ts`)
- [ ] T009 Implement shared response metadata via `lib/response/envelope.ts` (`lib/response/envelope.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Reconcile phase docs with actual shipped scope (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] T011 Correct Spec Folder metadata to basename only (`implementation-summary.md`)
- [x] T012 Document graph threshold mismatch and aggregate-only metrics limitations (all phase docs)
- [ ] T013 Add dashboard integration for Phase C (`handlers/eval-reporting.ts`, `lib/eval/reporting-dashboard.ts`)
- [ ] T014 Add drift detection after baseline data exists (`lib/session/context-drift.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Shipped work is marked complete and unsupported claims are removed
- [x] Deferred items are explicitly tracked for future follow-up
- [ ] Dashboard, response envelope, status unification, and persistence work completed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

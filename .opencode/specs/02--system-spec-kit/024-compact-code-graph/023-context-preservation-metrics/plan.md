---
title: "Plan: Context Preservation Metrics [024/023]"
description: "Implementation order for session metrics collection and quality scoring."
---
# Implementation Plan: Phase 023 — Context Preservation Metrics

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server |
| **Framework** | Internal session and handler modules |
| **Storage** | In-memory only for this phase |
| **Testing** | TypeScript validation, review findings, manual doc reconciliation |

### Overview
This phase delivered metrics collection and quality score computation, but not the full reporting architecture originally described. The plan record now reflects the actual implementation boundary: aggregate in-memory counters, computed quality factors, legacy-driven final health status, and deferred dashboard, envelope, and persistence work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and limitations are documented in `spec.md`
- [x] Deferred work is identified and bounded
- [x] Dependencies on Phase 018 and existing health reporting are explicit

### Definition of Done
- [x] Metrics collection and scoring scope match the documented implementation
- [x] Deferred items are named consistently across spec docs
- [x] Implementation summary metadata uses the folder basename only
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Incremental observability added to the existing session-management flow.

### Key Components
- **`lib/session/context-metrics.ts`**: Records aggregate session metrics and computes quality factors
- **`handlers/session-health.ts`**: Surfaces computed quality details while final health status still follows legacy heuristics
- **`context-server.ts`**: Emits lifecycle metric events at key interaction points

### Data Flow
Lifecycle events are recorded in memory, the scorer derives quality factors from that in-process state, and `session_health` reads those factors. Dashboard reporting, shared response envelope wiring, and persistent storage are still outside the shipped path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Define `SessionMetrics` and `MetricEvent` types
- [x] Establish in-memory collector boundaries
- [x] Defer SQLite persistence explicitly

### Phase 2: Core Implementation
- [x] Implement `recordMetricEvent()` for aggregate counters
- [x] Implement `computeQualityScore()` with recency, recovery, graph freshness, and continuity factors
- [x] Wire instrumentation into `context-server.ts`
- [x] Expose computed quality details through `session_health`
- [ ] Replace legacy `session_health` final status with computed quality score

### Phase 3: Verification
- [x] Review implementation against shipped files and handlers
- [x] Correct phase documentation to match actual behavior
- [ ] Complete dashboard integration and response envelope work in a later phase
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `computeQualityScore()` and metrics collector behavior | Existing TypeScript test coverage and code review evidence |
| Integration | `session_health` consumption of computed quality data | Handler and server inspection |
| Manual | Documentation consistency across phase files | Direct spec doc review |

### Known Limitations to Carry Forward
- Final `session_health` status is not yet sourced from the computed quality score.
- Graph freshness expectations differ between scorer logic and session snapshot reporting.
- No persisted metrics history exists because storage is still in-memory only.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 018 session health tool | Internal | Green | Needed for current status and quality reporting path |
| `session-snapshot` freshness rules | Internal | Yellow | Threshold mismatch remains unresolved |
| `eval_reporting_dashboard` integration | Internal | Yellow | Metrics are not visible in dashboard output until Phase C lands |
| `lib/response/envelope.ts` | Internal | Yellow | Shared response metadata path remains unimplemented |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Documentation or implementation claims drift from the actual shipped behavior.
- **Procedure**: Revert inaccurate claims, keep only verified implementation details, and preserve deferred items as explicit follow-up work.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Metrics Types + Collector) ──► Phase 2 (Scoring + Wiring) ──► Phase 3 (Verification + Doc Repair)
                                                     └──────────────► Future Phase C (Dashboard / Envelope / Persistence)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core implementation |
| Core | Setup, Phase 018 health tool | Verification and follow-on reporting work |
| Verify | Core | Accurate phase record |
| Future reporting | Core, threshold alignment | Dashboard visibility and persistent analysis |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours for shipped scope** |

The original 650-1170 LOC estimate assumed dashboard and drift-detection work. With Phases C and D deferred, the effective shipped scope is substantially smaller.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Deferred items identified before claiming completion
- [x] No persistence or dashboard behavior claimed without implementation evidence
- [x] Spec folder metadata path checked against basename rule

### Rollback Procedure
1. Remove claims that `session_health` status is fully quality-score driven.
2. Remove claims that dashboard, envelope, or SQLite integration shipped.
3. Re-run spec validation and reconcile remaining doc drift.
4. Notify future phase owners through the updated limitations list.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

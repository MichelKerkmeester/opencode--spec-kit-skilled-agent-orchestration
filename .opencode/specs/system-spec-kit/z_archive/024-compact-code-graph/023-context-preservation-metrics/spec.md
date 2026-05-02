---
title: "Feature Specification: Phase 023 — [system-spec-kit/024-compact-code-graph/023-context-preservation-metrics/spec]"
description: "Template compliance shim section. Legacy phase content continues below."
trigger_phrases:
  - "feature"
  - "specification"
  - "phase"
  - "023"
  - "spec"
  - "context"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/023-context-preservation-metrics"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
# Feature Specification: Phase 023 — Context Preservation Metrics

<!-- PHASE_LINKS: parent=../spec.md predecessor=022-gemini-hook-porting successor=024-hookless-priming-optimization -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
### 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete with deferred items |
| **Created** | 2026-03-31 |
| **Branch** | `024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
### 2. PROBLEM & PURPOSE
### Problem Statement
We needed a way to measure how well session context survives across runtimes instead of relying on parity claims and anecdotal failures. The phase shipped metrics collection and quality scoring, but the current phase record overstated what was delivered and no longer reflects the known gaps in status derivation, graph freshness thresholds, persistence, and reporting.

### Purpose
Document the implemented metrics baseline accurately so future phases build on the real system state instead of the intended design.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
### 3. SCOPE
### In Scope
- In-memory metrics collection for session lifecycle, recovery, graph freshness, and spec transitions
- Quality score computation for session context health
- Phase record corrections for deferred and not implemented items

### Out of Scope
- Shared response envelope integration via `lib/response/envelope.ts`
- Dashboard integration in `eval_reporting_dashboard`
- SQLite-backed persistence for collected metrics

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/session/context-metrics.ts` | Modify/Create | Metrics collector and quality score computation |
| `handlers/session-health.ts` | Modify | Consume computed quality data while legacy status remains in place |
| `context-server.ts` | Modify | Record lifecycle metric events |
| `lib/response/envelope.ts` | Planned only | No implementation landed in this phase |
| `handlers/eval-reporting.ts` | Planned only | Dashboard integration deferred |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
### 4. REQUIREMENTS
### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Record session lifecycle and recovery metrics in-process | Metrics collector stores timestamps and counters for start, resume, clear, recovery, graph checks, and context switches |
| REQ-002 | Compute a quality score from collected metrics | `computeQualityScore()` returns `healthy`, `degraded`, or `critical` with factor details |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Expose quality scoring through session health reporting | `session_health` surfaces computed quality information even if final status remains on legacy heuristics |
| REQ-004 | Document implementation gaps explicitly in the phase record | Spec, plan, tasks, checklist, and implementation summary all reflect the same deferred items and limitations |
| REQ-005 | Preserve current aggregate-only metrics design | Phase docs state that `toolName` was dropped, counters are aggregate only, and persistence remains in-memory |

### Acceptance Scenarios

- **Given** a session starts or resumes, **when** instrumentation runs, **then** the system records lifecycle metrics in memory.
- **Given** a health check runs, **when** quality scoring executes, **then** factor-level quality data is computed for the active session.
- **Given** the code graph age exceeds the stricter scorer threshold, **when** docs describe graph freshness, **then** they must note the current 1-hour vs 24-hour mismatch.
- **Given** a reader reviews this phase after completion, **when** they compare phase docs, **then** they see the same deferred dashboard, envelope, and persistence limitations everywhere.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
### 5. SUCCESS CRITERIA
- **SC-001**: The phase record no longer claims dashboard, SQLite persistence, or response envelope integration as implemented.
- **SC-002**: The documentation clearly states that `session_health` still uses legacy heuristics for final status despite computed quality scoring.
- **SC-003**: The documentation captures the graph freshness threshold mismatch and aggregate-only in-memory metrics design.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 018 session health tool | Health reporting depends on existing `session_health` behavior | Document current coupling and defer full status unification |
| Risk | Legacy status heuristics diverge from computed quality | Readers may assume quality score directly drives health status | Call out the limitation in every phase artifact |
| Risk | Graph threshold mismatch | Operators may read stale graph state as healthy | Document the 1-hour vs 24-hour mismatch and carry it as follow-up work |
| Risk | In-memory aggregate counters only | Metrics reset on restart and lose per-tool detail | Keep the limitation explicit until persistence and richer dimensions are added |

### Known Limitations
1. Quality score is computed, but `session_health` status still follows legacy heuristics.
2. Graph freshness thresholds do not match: `computeQualityScore()` uses 1 hour while `session-snapshot` still uses 24 hours.
3. Metrics are aggregate counters only. `toolName` was dropped and SQLite persistence was not implemented.
4. `lib/response/envelope.ts` was planned but not implemented.
5. Phase C dashboard integration remains deferred.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Metrics collection must remain lightweight enough for per-request use inside the MCP server.
- **NFR-P02**: Quality scoring should run from in-memory session data without requiring blocking persistence.

### Security
- **NFR-S01**: Metrics documentation must not imply storage beyond the current in-memory process boundary.
- **NFR-S02**: No new external reporting surface is considered shipped until dashboard integration actually lands.

### Reliability
- **NFR-R01**: Phase documentation must reflect actual behavior, not intended architecture.
- **NFR-R02**: Deferred items must be named consistently across all phase docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty metrics state: quality scoring can still run, but outputs should be read as heuristic and partial.
- Process restart: in-memory counters reset and historical metrics are lost.
- Missing per-tool dimensions: aggregate counters cannot answer tool-level usage questions.

### Error Scenarios
- Legacy status divergence: computed quality and final traffic-light status may disagree.
- Threshold mismatch: graph may be considered stale by scoring logic but still fresh in snapshot reporting.
- Deferred reporting surface: dashboard readers cannot inspect these metrics in `eval_reporting_dashboard` yet.

### State Transitions
- Session recovery attempted: quality factors update even though final session status remains legacy-driven.
- Dashboard phase not shipped: implementation remains limited to collection and scoring.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Multiple runtime-facing metrics behaviors and deferred reporting work |
| Risk | 17/25 | Documentation drift could mislead later phases about shipped behavior |
| Research | 10/20 | Requires reconciling scorer, snapshot, and reporting expectations |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
### 10. OPEN QUESTIONS
- When should `session_health` switch from legacy heuristics to the computed quality score as its canonical status?
- Should graph freshness thresholds be unified at 1 hour, 24 hours, or made configurable per runtime?
<!-- /ANCHOR:questions -->

---
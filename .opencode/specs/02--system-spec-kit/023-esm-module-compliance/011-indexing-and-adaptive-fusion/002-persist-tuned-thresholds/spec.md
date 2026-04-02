---
title: "Feature Specification: Phase 2 — Persist Tuned Thresholds"
description: "SQLite persistence for adaptive ranking thresholds that are currently lost on process restart."
trigger_phrases:
  - "persist tuned thresholds"
  - "adaptive thresholds sqlite"
  - "adaptive_thresholds table"
  - "threshold persistence"
  - "WeakMap threshold cache"
importance_tier: "normal"
contextType: "implementation"
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-wire-promotion-gate |
| **Successor** | 003-real-feedback-labels |
| **Handoff Criteria** | Thresholds persisted in SQLite; get/set verified by tests |

### Phase Context

This is **Phase 2** of the adaptive-ranking-prerequisites specification.

**Scope Boundary**: SQLite persistence for `adaptive_thresholds` only. No changes to the promotion gate wiring (Phase 1) or feedback label logic (Phase 3).

**Dependencies**:
- Phase 1 (001-wire-promotion-gate) must complete first — it wires the call that triggers `tuneAdaptiveThresholdsAfterEvaluation()`

**Deliverables**:
- `adaptive_thresholds` SQLite table created via `ensureAdaptiveTables()`
- `setAdaptiveThresholdOverrides()` writes to SQLite
- `getAdaptiveThresholdConfig()` reads from SQLite with WeakMap as in-process cache
- Tests proving persistence survives get/set cycles and cache invalidation

---

# Feature Specification: Phase 2 — Persist Tuned Thresholds

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (with review findings) |
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/024-compact-code-graph` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-wire-promotion-gate |
| **Successor** | 003-real-feedback-labels |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`tuneAdaptiveThresholdsAfterEvaluation()` in `adaptive-ranking.ts` stores adjusted thresholds (`maxAdaptiveDelta`, `signalWeights`, `minSignalsForPromotion`) in a `WeakMap` keyed by the DB object. These values are lost on every process restart, meaning the adaptive tuning loop can never accumulate improvement across sessions.

### Purpose

Persist the tuned threshold values to SQLite so that every process start resumes from the last tuned state, enabling the adaptive ranking system to improve incrementally over time.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `adaptive_thresholds` SQLite table inside `ensureAdaptiveTables()`
- Modify `setAdaptiveThresholdOverrides()` to write rows to that table
- Modify `getAdaptiveThresholdConfig()` to read from SQLite on cache miss (WeakMap remains the in-process cache layer)
- Vitest tests: persistence across set/get cycle, and resilience when WeakMap cache is cold

### Out of Scope

- Changes to the promotion gate wiring — handled in Phase 1
- Real feedback label ingestion — handled in Phase 3
- Migration or versioning of the `adaptive_thresholds` table schema beyond initial creation
- Exposing threshold values via MCP tool responses

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Modify | Add table DDL, SQLite read/write for threshold get/set |
| `mcp_server/tests/adaptive-ranking.vitest.ts` | Modify | Add two persistence tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `ensureAdaptiveTables()` creates `adaptive_thresholds` table | Table exists after calling the function on a fresh DB; calling it twice does not error (idempotent) |
| REQ-002 | `setAdaptiveThresholdOverrides()` writes threshold values to SQLite | After a set call, a direct SQL `SELECT` on `adaptive_thresholds` returns the written values |
| REQ-003 | `getAdaptiveThresholdConfig()` reads from SQLite when WeakMap cache is cold | After process-equivalent cache reset, `get` returns the previously persisted values |
| REQ-004 | WeakMap acts as in-process cache (no redundant SQL reads) | A second `get` within the same process does not issue a second SQL SELECT |
| REQ-005 | Persistence test: set then get returns correct values | Vitest assertion passes with matching threshold object |
| REQ-006 | Cache-invalidation test: get after cache clear returns SQLite values | Test manually clears WeakMap entry, calls get, asserts values from SQLite |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Full vitest suite passes with no regressions | `pnpm vitest run` exits 0 after changes |
### Acceptance Scenarios

**Given** a fresh in-memory SQLite DB with `ensureAdaptiveTables()` called, **When** `setAdaptiveThresholdOverrides(db, { maxAdaptiveDelta: 0.3, signalWeights: { recency: 0.6 }, minSignalsForPromotion: 5 })` is called, **Then** `getAdaptiveThresholdConfig(db)` returns exactly `{ maxAdaptiveDelta: 0.3, signalWeights: { recency: 0.6 }, minSignalsForPromotion: 5 }`.

**Given** the WeakMap cache entry is cleared after a set/get round-trip, **When** `getAdaptiveThresholdConfig(db)` is called again on the same DB, **Then** it returns the same persisted values by reading from SQLite (not from memory).

**Given** `ensureAdaptiveTables()` has been called but no thresholds have been set, **When** `getAdaptiveThresholdConfig(db)` is called, **Then** it returns the compiled-in default threshold values without throwing.

**Given** `setAdaptiveThresholdOverrides()` is called twice with different values, **When** `getAdaptiveThresholdConfig(db)` is called after the second set, **Then** it returns the second (most recent) values — verifying upsert semantics.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `adaptive_thresholds` table is created idempotently by `ensureAdaptiveTables()`
- **SC-002**: A set/get round-trip returns the exact values written, verified by test assertion
- **SC-003**: Cold-cache get (WeakMap entry absent) reads from SQLite and repopulates the cache
- **SC-004**: Full vitest suite passes with no regressions
- **SC-005**: Total new LOC is within the 80–120 range specified for this phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 (001-wire-promotion-gate) | `tuneAdaptiveThresholdsAfterEvaluation()` call path must exist before persistence is useful | Phase 1 must merge first; this phase can be coded in parallel but integration-tested only after Phase 1 |
| Risk | SQLite schema drift if `adaptive_thresholds` columns change later | Stored thresholds become unreadable | Use `IF NOT EXISTS` DDL; document column contract in code comment |
| Risk | WeakMap key lifecycle — DB object replaced between calls | Cache miss on every call, performance regression | Ensure the same DB reference is passed throughout the server lifecycle; document assumption |
| Risk | Concurrent writes in test isolation | Flaky test results | Use in-memory SQLite (`:memory:`) for tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `setAdaptiveThresholdOverrides()` use `INSERT OR REPLACE` (upsert) or separate INSERT/UPDATE logic? Upsert preferred for simplicity — confirm no conflict with existing rows.
- Is there a single canonical DB reference passed server-wide, or could multiple DB instances exist? The WeakMap caching strategy depends on this being stable.
<!-- /ANCHOR:questions -->

---

**Post-Implementation Review Findings**

> Deep review completed (15 iterations across two rounds). All P1 findings are fixed. No deferred items remain.

| Priority | Status | Finding |
|----------|--------|---------|
| P1 | FIXED | Missing index on `adaptive_signal_events` — added `idx_adaptive_signal_events_memory_type` covering `(memory_id, signal_type)` to prevent full-table scans in signal label queries. |
| P1 | FIXED | Default thresholds not cached in WeakMap on the cold path (no prior DB row) — now the compiled-in defaults are stored in the WeakMap after a no-row read, so subsequent calls in the same process avoid redundant SQL. |
| P1 | FIXED | WeakMap cache can be stale in multi-connection scenarios (e.g., separate MCP server processes sharing the same SQLite file). Added a process-local version counter that increments on every `setAdaptiveThresholdOverrides()` call; each WeakMap entry stores the version it was cached at and is invalidated on mismatch. |
| P2 | NOTED | `INSERT OR REPLACE` semantics will silently wipe any future columns added to `adaptive_thresholds` if they are not included in the replacement row. Consider migrating to `ON CONFLICT DO UPDATE SET` for forward compatibility. |

---

## L2: NON-FUNCTIONAL REQUIREMENTS

<!-- ANCHOR:nfr -->
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | SQLite read on cold cache completes within 5 ms | Measured in test with in-memory DB |
| NFR-002 | No blocking I/O in hot path when WeakMap cache is warm | Confirmed by code inspection |
<!-- /ANCHOR:nfr -->

---

## L2: EDGE CASES

<!-- ANCHOR:edge-cases -->
- **No prior row in DB**: `getAdaptiveThresholdConfig()` must return compiled-in defaults, not throw or return null
- **Partial threshold row**: If only some columns are present (schema evolves), fall back to defaults for missing fields
- **`ensureAdaptiveTables()` called before any set**: Table exists but is empty; get returns defaults
<!-- /ANCHOR:edge-cases -->

---

## L2: COMPLEXITY ASSESSMENT

<!-- ANCHOR:complexity -->
| Dimension | Score | Notes |
|-----------|-------|-------|
| LOC estimate | ~80–120 | DDL + read/write helpers + 2 tests |
| Files affected | 2 | `adaptive-ranking.ts`, vitest file |
| External dependencies | 0 | Uses existing `better-sqlite3` instance |
| Risk level | Low | Isolated to two functions and table DDL |
<!-- /ANCHOR:complexity -->

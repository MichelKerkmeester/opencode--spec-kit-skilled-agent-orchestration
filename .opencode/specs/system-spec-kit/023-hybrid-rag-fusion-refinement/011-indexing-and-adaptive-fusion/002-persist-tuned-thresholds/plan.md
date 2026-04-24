---
title: "Im [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds/plan]"
description: "Adds SQLite persistence for adaptive ranking thresholds in adaptive-ranking.ts, with WeakMap as in-process cache."
trigger_phrases:
  - "persist tuned thresholds plan"
  - "adaptive thresholds implementation"
  - "ensureadaptivetables plan"
  - "threshold sqlite implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Phase 2 — Persist Tuned Thresholds

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (strict) |
| **Framework** | None — direct `better-sqlite3` usage |
| **Storage** | SQLite via existing DB instance passed to adaptive-ranking functions |
| **Testing** | Vitest with in-memory SQLite |

### Overview

This phase adds a single SQLite table (`adaptive_thresholds`) and modifies two functions in `adaptive-ranking.ts`. `setAdaptiveThresholdOverrides()` gains an upsert write; `getAdaptiveThresholdConfig()` gains a SQLite read on WeakMap cache miss. Two new Vitest tests verify the round-trip and cold-cache behaviour. No new npm dependencies are required.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 1 (001-wire-promotion-gate) merged or its changes are available on the branch
- [x] Problem statement clear: WeakMap-only storage loses thresholds on restart
- [x] Success criteria measurable: set/get round-trip test + cache-miss test both pass
- [x] Files to change identified: `adaptive-ranking.ts` and its vitest file

### Definition of Done

- [ ] `adaptive_thresholds` table DDL present in `ensureAdaptiveTables()` with `IF NOT EXISTS`
- [ ] `setAdaptiveThresholdOverrides()` upserts to SQLite and updates WeakMap
- [ ] `getAdaptiveThresholdConfig()` reads SQLite on cache miss and populates WeakMap
- [ ] Two new tests pass: persistence round-trip and cold-cache read
- [ ] `pnpm vitest run` exits 0 with no regressions
- [ ] Total new/changed LOC within 80–120
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-layer read cache: SQLite (durable) backed by WeakMap (in-process, zero-latency hot path).

### Key Components

- **`ensureAdaptiveTables(db)`**: Extends existing function to also `CREATE TABLE IF NOT EXISTS adaptive_thresholds`
- **`setAdaptiveThresholdOverrides(db, overrides)`**: Upserts the three threshold fields (`maxAdaptiveDelta`, `signalWeights`, `minSignalsForPromotion`) then updates the WeakMap cache
- **`getAdaptiveThresholdConfig(db)`**: Checks WeakMap first; on miss, queries `adaptive_thresholds`, merges with compiled-in defaults, stores in WeakMap, returns result

### Data Flow

```
tuneAdaptiveThresholdsAfterEvaluation()
  └─► setAdaptiveThresholdOverrides(db, adjusted)
        ├─► INSERT OR REPLACE INTO adaptive_thresholds (...)
        └─► thresholdCache.set(db, adjusted)   // WeakMap update

getAdaptiveThresholdConfig(db)
  ├─► thresholdCache.has(db)?  → return cached value  [warm path]
  └─► SELECT * FROM adaptive_thresholds WHERE id = 1
        ├─► row found  → merge with defaults → cache → return
        └─► no row     → return compiled-in defaults (no cache set)
```

### Table Schema

```sql
CREATE TABLE IF NOT EXISTS adaptive_thresholds (
  id                      INTEGER PRIMARY KEY DEFAULT 1,
  max_adaptive_delta      REAL    NOT NULL,
  signal_weights          TEXT    NOT NULL,   -- JSON blob
  min_signals_for_promotion INTEGER NOT NULL,
  updated_at              INTEGER NOT NULL    -- Unix ms
);
```

`id = 1` is a singleton row; upsert targets it via `INSERT OR REPLACE`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Table DDL

- [ ] Locate `ensureAdaptiveTables()` in `adaptive-ranking.ts`
- [ ] Append `CREATE TABLE IF NOT EXISTS adaptive_thresholds (...)` DDL
- [ ] Verify no TypeScript errors: `pnpm tsc --noEmit`

### Phase 2: Write Path — `setAdaptiveThresholdOverrides()`

- [ ] Add `INSERT OR REPLACE INTO adaptive_thresholds` statement with bound parameters
- [ ] Serialize `signalWeights` to JSON string before binding
- [ ] After successful write, update WeakMap entry
- [ ] Verify `pnpm tsc --noEmit` still clean

### Phase 3: Read Path — `getAdaptiveThresholdConfig()`

- [ ] Add WeakMap cache-hit check at top of function (return early if present)
- [ ] On cache miss: execute `SELECT` on `adaptive_thresholds WHERE id = 1`
- [ ] Deserialize `signal_weights` JSON string back to object
- [ ] Merge DB row with compiled-in defaults (DB values win)
- [ ] Populate WeakMap with merged result before returning
- [ ] Handle no-row case: return defaults without caching

### Phase 4: Tests

- [ ] Open `mcp_server/tests/adaptive-ranking.vitest.ts`
- [ ] Add test: create in-memory DB → call `ensureAdaptiveTables` → `setAdaptiveThresholdOverrides` → `getAdaptiveThresholdConfig` → assert values match
- [ ] Add test: repeat above but manually delete WeakMap entry (or use a fresh WeakMap) before get → assert SQLite values returned
- [ ] Run `pnpm vitest run` — all tests pass

### Phase 5: Verification

- [ ] `pnpm tsc --noEmit` exits 0
- [ ] `pnpm vitest run` exits 0
- [ ] Count new LOC — confirm within 80–120
- [ ] No placeholder text remains in spec/plan/tasks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit — persistence round-trip | `setAdaptiveThresholdOverrides` + `getAdaptiveThresholdConfig` | Vitest, in-memory SQLite |
| Unit — cold-cache read | `getAdaptiveThresholdConfig` after WeakMap entry removed | Vitest, in-memory SQLite |
| Regression — full suite | All existing adaptive-ranking tests | `pnpm vitest run` |

All tests use an in-memory SQLite instance (`:memory:`) to avoid test isolation issues and I/O latency.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 — 001-wire-promotion-gate | Internal (predecessor phase) | Must be merged first | Integration tests cannot verify end-to-end tuning → decouple unit tests to unblock |
| `better-sqlite3` | External npm package | Already installed | N/A |
| `adaptive-ranking.ts` existing `ensureAdaptiveTables()` | Internal function | Present in codebase | DDL addition is an append; no refactor needed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Type errors introduced, test regressions, or SQLite schema conflict with existing tables
- **Procedure**: `git revert` the two modified files; `adaptive_thresholds` table in any existing DBs is harmless (empty) and does not need to be dropped
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

<!-- ANCHOR:phase-deps -->
| Phase | Depends On | Notes |
|-------|-----------|-------|
| Phase 2 (DDL) | None | Can start immediately |
| Phase 3 (write path) | Phase 2 DDL merged | Table must exist |
| Phase 4 (read path) | Phase 2 DDL merged | Read from empty table returns defaults |
| Phase 5 (tests) | Phases 3 + 4 complete | Both get and set must be implemented |
| Phase 6 (verification) | Phase 5 tests pass | Final sign-off |
<!-- /ANCHOR:phase-deps -->

---

## L2: EFFORT ESTIMATION

<!-- ANCHOR:effort -->
| Task | Estimate |
|------|----------|
| Table DDL addition | 15 min |
| `setAdaptiveThresholdOverrides()` write path | 30 min |
| `getAdaptiveThresholdConfig()` read/cache path | 30 min |
| Two Vitest tests | 30 min |
| TypeScript check + full vitest run | 15 min |
| **Total** | **~2 hours** |
<!-- /ANCHOR:effort -->

---

## L2: ENHANCED ROLLBACK

<!-- ANCHOR:enhanced-rollback -->
- The `adaptive_thresholds` table uses `id = 1` singleton; existing DBs without the table are unaffected until `ensureAdaptiveTables()` runs again
- If a future schema migration is needed, the `updated_at` column provides a version signal
- No data loss risk: the WeakMap fallback means the system degrades gracefully to compiled-in defaults if SQLite read fails
<!-- /ANCHOR:enhanced-rollback -->

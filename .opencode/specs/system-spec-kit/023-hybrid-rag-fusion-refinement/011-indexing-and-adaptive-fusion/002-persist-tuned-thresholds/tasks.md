---
title: "T [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds/tasks]"
description: "Task breakdown for adding SQLite persistence to adaptive ranking threshold get/set functions."
trigger_phrases:
  - "persist tuned thresholds tasks"
  - "adaptive thresholds tasks"
  - "phase 2 threshold tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/002-persist-tuned-thresholds"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["tasks.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 2 — Persist Tuned Thresholds

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P0/P1] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Table DDL**

- [x] T001 [P0] Add `adaptive_thresholds` table DDL to `ensureAdaptiveTables()` using `CREATE TABLE IF NOT EXISTS` with columns: `id INTEGER PRIMARY KEY DEFAULT 1`, `max_adaptive_delta REAL`, `signal_weights TEXT` (JSON blob), `min_signals_for_promotion INTEGER`, `updated_at INTEGER` (`mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [x] T002 [P0] Verify `pnpm tsc --noEmit` exits 0 after DDL addition
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Write Path — `setAdaptiveThresholdOverrides()`**

- [x] T003 [P0] Modify `setAdaptiveThresholdOverrides()` to execute `INSERT OR REPLACE INTO adaptive_thresholds` with bound parameters for all three threshold fields (`mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [x] T004 [P0] Serialize `signalWeights` to JSON string before binding to `signal_weights` column (`mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [x] T005 [P0] After successful SQLite write, update WeakMap cache entry with new values (`mcp_server/lib/cognitive/adaptive-ranking.ts`)

**Read Path — `getAdaptiveThresholdConfig()`**

- [x] T006 [P0] Add WeakMap cache-hit check at top of `getAdaptiveThresholdConfig()` — return early when entry is present (warm path, no SQL) (`mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [x] T007 [P0] On WeakMap cache miss, execute `SELECT * FROM adaptive_thresholds WHERE id = 1`; deserialize `signal_weights` JSON string back to object (`mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [x] T008 [P0] Merge SQLite row with compiled-in defaults (DB values take precedence); store merged result in WeakMap before returning (`mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [x] T009 [P0] Handle no-row case: return compiled-in defaults without populating WeakMap (`mcp_server/lib/cognitive/adaptive-ranking.ts`)

**Tests**

- [x] T010 [P0] Add persistence round-trip test: create in-memory DB → `ensureAdaptiveTables` → `setAdaptiveThresholdOverrides(db, overrides)` → `getAdaptiveThresholdConfig(db)` → assert returned values match written values (`mcp_server/tests/adaptive-ranking.vitest.ts`)
- [x] T011 [P0] Add cold-cache test: after round-trip, remove WeakMap entry (or use fresh WeakMap) → call `getAdaptiveThresholdConfig(db)` again → assert SQLite-backed values are returned correctly (`mcp_server/tests/adaptive-ranking.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P0] Run full vitest suite: `pnpm vitest run` — assert exit 0 and zero regressions
- [x] T013 [P0] Run `pnpm tsc --noEmit` — assert exit 0 after all changes combined
- [x] T014 [P0] Confirm total new/changed LOC is within the 80–120 target (`git diff --stat`)
- [x] T015 [P1] Update this tasks.md: mark completed tasks `[x]` with brief evidence notes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `pnpm tsc --noEmit` exits 0
- [x] `pnpm vitest run` exits 0 with no regressions
- [x] Two new tests (T010, T011) pass
- [x] Handoff criteria met: thresholds persisted in SQLite; get/set verified by tests
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent spec**: `../spec.md`
- **Parent plan**: `../plan.md`
- **Predecessor**: `../001-wire-promotion-gate/tasks.md`
- **Successor**: `../003-real-feedback-labels/tasks.md`
<!-- /ANCHOR:cross-refs -->

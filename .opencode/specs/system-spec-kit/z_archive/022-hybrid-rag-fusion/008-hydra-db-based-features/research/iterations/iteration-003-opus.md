# Iteration 3 — Opus Agent: Adaptive Ranking (Phase 4) + Schema FK Analysis

**Focus:** Adaptive ranking module, shadow scoring data integrity, schema-level FK gap quantification
**Files examined:**
- `mcp_server/lib/cache/cognitive/adaptive-ranking.ts` (533 lines)
- `mcp_server/lib/cognitive/adaptive-ranking.ts` (duplicate copy)
- `mcp_server/tests/adaptive-ranking.vitest.ts` (213 lines)
- `mcp_server/lib/search/vector-index-schema.ts` (Hydra table DDL)
- `mcp_server/handlers/memory-search.ts` (pipeline integration, lines 1025-1030)
- `mcp_server/lib/storage/access-tracker.ts` (signal recording site, line 160)

---

## Part A: Adaptive Ranking Module Bugs

### Bug 16 — Global mutable state for threshold overrides (Severity: Medium)

**File:** `adaptive-ranking.ts:96`
**Line:** `let adaptiveThresholdOverrides: AdaptiveThresholdOverrides = {};`

The threshold override state is a module-level mutable variable. `setAdaptiveThresholdOverrides()` and `tuneAdaptiveThresholdsAfterEvaluation()` both mutate this global. Because the MCP server is a long-running process:

1. **Threshold drift across searches:** `tuneAdaptiveThresholdsAfterEvaluation()` permanently mutates the in-process thresholds. If called multiple times, the weights ratchet monotonically (outcome weight keeps increasing by 0.005, or correction weight keeps decreasing by 0.005) with no convergence bound. The clamping only applies to `maxAdaptiveDelta` and `minSignalsForPromotion`, not to signal weights themselves.
2. **No persistence:** Overrides are lost on restart, causing a behavior cliff — tuned thresholds vanish silently.
3. **No concurrency guard:** Multiple concurrent handler calls could see partially-applied overrides.

### Bug 17 — `resetAdaptiveState` is not transactional (Severity: Medium)

**File:** `adaptive-ranking.ts:236-246`

```typescript
const clearedSignals = database.prepare('DELETE FROM adaptive_signal_events').run().changes;
const clearedRuns = database.prepare('DELETE FROM adaptive_shadow_runs').run().changes;
```

Two separate DELETE statements run outside a transaction. If the process crashes between them, `adaptive_signal_events` is cleared but `adaptive_shadow_runs` retains stale proposals referencing now-deleted signals. This is the same systemic transaction boundary pattern from iterations 1-2.

### Bug 18 — `buildAdaptiveShadowProposal` mixes read and write without transaction (Severity: Medium-High)

**File:** `adaptive-ranking.ts:453-532`

The function performs:
1. Multiple reads from `adaptive_signal_events` (per-memory signal deltas at line 474 via `getSignalDelta`, bulk signal counts at lines 485-490)
2. A write to `adaptive_shadow_runs` (line 526-529)

All without a transaction wrapper. Between the signal reads and the shadow-run write, another concurrent call (e.g., from `access-tracker.ts` recording a new signal) could insert new signals, making the persisted `proposal_json` inconsistent with the signals that actually existed at read time.

### Bug 19 — Unbounded `adaptive_shadow_runs` table growth (Severity: Low-Medium)

**File:** `adaptive-ranking.ts:525-529`

Every call to `buildAdaptiveShadowProposal` inserts a new row into `adaptive_shadow_runs` with a full JSON serialization of the proposal. There is no retention policy, no cleanup, and no index on `created_at`. Over time:
- The table grows unboundedly with potentially large `proposal_json` blobs.
- `summarizeAdaptiveSignalQuality` queries `COUNT(*)` and `ORDER BY id DESC` on this table (lines 355-364), which degrades as it grows.

### Bug 20 — Signal weight drift has no convergence bounds (Severity: Medium)

**File:** `adaptive-ranking.ts:396-403`

In `tuneAdaptiveThresholdsAfterEvaluation`:
- The "good signal" branch increments `outcome` weight by +0.005 each call (line 399)
- The "low signal" branch decrements `correction` weight by -0.005 each call (line 403)

Neither branch clamps the signal weights — only `maxAdaptiveDelta` and `minSignalsForPromotion` have clamp functions. After 20 "good" tuning calls, `outcome` weight would be 0.12 (6x default). After 20 "bad" calls, `correction` would be -0.13 (4.3x default magnitude). This can cause:
- Shadow scores to diverge dramatically from production scores
- The bounded delta (max 0.12) to be hit on every memory, making all shadow scores identical at the boundary

### Bug 21 — Duplicate module files (Severity: Low but structural)

Two copies of the adaptive ranking module exist:
- `mcp_server/lib/cache/cognitive/adaptive-ranking.ts` (the canonical one, imported by handlers and tests)
- `mcp_server/lib/cognitive/adaptive-ranking.ts` (a copy at a different path)

The test imports from `../lib/cache/cognitive/adaptive-ranking`, and the handler (`memory-search.ts:39`) also imports from `../lib/cache/cognitive/adaptive-ranking`. The `lib/cognitive/` copy is dead code or a stale artifact, creating confusion and maintenance risk.

---

## Part B: Test Coverage Gaps

### Gap 1 — No test for promoted mode applying shadow scores to production results

The test suite verifies `mode === 'promoted'` in the proposal but never asserts that promoted-mode proposals actually alter the returned search results. In the handler (`memory-search.ts:1025-1030`), the proposal is computed but the result set is NOT re-ordered even in promoted mode — the proposal is only attached as metadata. This is either:
- A deliberate design choice (shadow-only, with "promoted" being a metadata label), OR
- A missing feature: promoted mode should re-rank results but doesn't

### Gap 2 — No test for memory deletion orphaning signals

No test verifies what happens when a memory referenced by `adaptive_signal_events.memory_id` is deleted from `memory_index`. Since there's no FK constraint (see Part C), signals for deleted memories persist and continue to influence `getSignalDelta` if a new memory is created with the same `id` (SQLite AUTOINCREMENT doesn't reuse IDs, but the risk exists with manual ID assignment or backup restoration).

### Gap 3 — No concurrent access test

No test simulates concurrent `recordAdaptiveSignal` + `buildAdaptiveShadowProposal` calls to verify the lack of transaction boundaries doesn't cause data inconsistency.

### Gap 4 — No test for the `adaptiveThresholdOverrides` global leak between tests

The test suite uses `afterEach(() => resetAdaptiveThresholdOverrides())`, which is correct. However, the tuning test at line 165 calls `tuneAdaptiveThresholdsAfterEvaluation` which mutates the global, and subsequent assertions at line 199 call `buildAdaptiveShadowProposal` relying on the mutated state. There is no test that verifies the reset actually restores defaults after tuning (the afterEach handles it, but the behavior isn't explicitly tested).

---

## Part C: Schema-Level FK Analysis — Hydra Tables

### Tables with FK constraints: 1 of 12

| Table | Has FK? | FK Target | ON DELETE |
|-------|---------|-----------|-----------|
| `working_memory` | **YES** | `memory_index(id)` | `SET NULL` |

### Tables WITHOUT FK constraints: 11 of 12

| Table | `memory_id` column? | Orphan risk on memory delete |
|-------|---------------------|------------------------------|
| `memory_lineage` | YES (PK) | **HIGH** — lineage rows persist after memory deletion, `root_memory_id` and `predecessor_memory_id` become dangling |
| `active_memory_projection` | YES (`active_memory_id`, `root_memory_id`) | **HIGH** — projection points to deleted memory, search returns stale logical_key mapping |
| `degree_snapshots` | YES | **MEDIUM** — historical snapshot data accumulates for deleted memories |
| `community_assignments` | YES (UNIQUE) | **MEDIUM** — community membership for deleted memory persists, skews community detection |
| `adaptive_signal_events` | YES | **MEDIUM** — signals for deleted memory persist, influence shadow scoring for wrong IDs |
| `adaptive_shadow_runs` | NO (stores proposal_json with memory IDs) | **LOW** — historical audit data, but contains stale references in JSON blobs |
| `shared_spaces` | NO (no memory_id) | N/A — space-level entity, no direct memory reference |
| `shared_space_members` | NO (references space_id) | **LOW** — orphan if shared_space is deleted without cleaning members |
| `shared_space_conflicts` | YES (`existing_memory_id`, `incoming_memory_id`) | **MEDIUM** — conflict records reference deleted memories |
| `governance_audit` | YES (nullable) | **LOW** — audit log, acceptable to retain historical references |
| `archival_stats` | NO | N/A — key-value store, no memory reference |

### Orphan Risk Quantification

- **Critical path tables (search-affecting):** 4 tables (`memory_lineage`, `active_memory_projection`, `adaptive_signal_events`, `community_assignments`) have no FK and directly influence search scoring or ranking. Deleting a memory without cleaning these tables will produce incorrect search results.
- **Audit/historical tables:** 3 tables (`degree_snapshots`, `shared_space_conflicts`, `governance_audit`) retain stale references but don't affect correctness, only storage and diagnostic accuracy.
- **Cascade gap:** Only `working_memory` has `ON DELETE SET NULL`. None of the 11 other tables have any cascade behavior.

### The `active_memory_projection` FK was intentionally removed

At `vector-index-schema.ts:1010-1025`, there is explicit migration code that detects if `active_memory_projection` has a FOREIGN KEY and removes it by recreating the table without the FK. The comment context suggests this was done to avoid cascade-delete issues, but it trades cascade safety for orphan risk without adding compensating cleanup logic.

---

## Part D: Pipeline Integration Assessment

### How adaptive ranking integrates with search

1. `memory-search.ts:1025` calls `buildAdaptiveShadowProposal()` AFTER the pipeline has already produced final results
2. The shadow proposal is attached to the response as `extraData.adaptiveShadow` (metadata only)
3. Even in `mode === 'promoted'`, the production result order is NOT modified — the proposal is purely informational

**Data integrity risk:** The shadow proposal is computed using the database at a different point in time than the pipeline results. The pipeline results use the vector index DB, while adaptive signals use the same DB but different tables. If a memory is deleted between pipeline execution and shadow proposal computation (possible with concurrent requests), the shadow proposal will reference memory IDs that no longer exist in the result set. The `results.map(() => '?')` parameter binding at line 488 would still execute correctly, but the proposal would contain stale data.

### `access-tracker.ts` signal recording (line 160)

The access tracker records adaptive signals inside a try-catch but outside the access count update transaction. If the signal write fails, the access count is still incremented but no signal is recorded, creating a silent divergence between access frequency data and adaptive signal data.

---

## Summary of New Findings (Iteration 3)

| ID | Type | Severity | Module | Description |
|----|------|----------|--------|-------------|
| Bug-16 | Bug | Medium | adaptive-ranking | Global mutable threshold state — no persistence, no concurrency guard |
| Bug-17 | Bug | Medium | adaptive-ranking | `resetAdaptiveState` deletes from 2 tables without transaction |
| Bug-18 | Bug | Medium-High | adaptive-ranking | `buildAdaptiveShadowProposal` mixes reads/writes without transaction |
| Bug-19 | Bug | Low-Medium | adaptive-ranking | Unbounded `adaptive_shadow_runs` growth, no retention policy |
| Bug-20 | Bug | Medium | adaptive-ranking | Signal weight drift has no convergence bounds after repeated tuning |
| Bug-21 | Dead code | Low | adaptive-ranking | Duplicate module at `lib/cognitive/` vs `lib/cache/cognitive/` |
| FK-01 | Schema gap | High | vector-index-schema | 11 of 12 Hydra tables lack FK constraints to `memory_index` |
| FK-02 | Schema gap | High | vector-index-schema | `active_memory_projection` FK was intentionally removed without compensating cleanup |
| FK-03 | Schema gap | Medium | vector-index-schema | `shared_space_members` has no FK to `shared_spaces`, orphan on space deletion |
| Gap-1 | Test gap | Medium | adaptive-ranking test | No test that promoted mode re-orders results (or verifies it doesn't) |
| Gap-2 | Test gap | Medium | adaptive-ranking test | No test for signal orphaning after memory deletion |
| Gap-3 | Test gap | Low | adaptive-ranking test | No concurrent access test |

**Cumulative bug count (iterations 1-3):** 21 bugs + 3 schema gaps + 3 test gaps

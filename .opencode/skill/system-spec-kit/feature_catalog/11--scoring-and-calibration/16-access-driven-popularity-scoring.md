---
title: "Access-driven popularity scoring"
description: "Describes the batched access counting with soft-accumulator pattern that feeds popularity signals into composite scoring and drives archival dormancy detection."
---

# Access-driven popularity scoring

## 1. OVERVIEW

Describes the batched access counting with soft-accumulator pattern that feeds popularity signals into composite scoring and drives archival dormancy detection.

Memories that get looked up frequently are probably more useful than ones that sit untouched. This feature counts how often each memory is retrieved and gives frequently accessed ones a higher score, like how a popular library book gets a front-of-shelf display. It also helps identify neglected memories that might be candidates for archiving.

---

## 2. CURRENT REALITY

The access tracker (`lib/storage/access-tracker.ts`) implements batched access counting with a soft-accumulator pattern. Each retrieval hit increments an in-memory accumulator by 0.1. When the accumulator exceeds the 0.5 threshold, a database write flushes the accumulated count to the `access_count` column in `memory_index` and updates `last_accessed`. This batching reduces write amplification from high-frequency search operations.

The `access_count` feeds into composite scoring as a popularity signal, boosting frequently retrieved memories. The accumulator map is capped at 10,000 entries to prevent unbounded memory growth. Access data also drives the archival manager's dormancy detection: memories with no recent access are candidates for automatic archival. The tracker currently exposes accumulator and scoring helpers such as `getAccumulatorState()`, `calculatePopularityScore()` and `calculateUsageBoost()`, rather than a separate `getAccessStats()` API.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Batched access tracking with accumulator |
| `mcp_server/lib/scoring/composite-scoring.ts` | Lib | Composite scoring incorporating access counts |
| `mcp_server/lib/cognitive/archival-manager.ts` | Lib | Dormancy detection using access data |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/access-tracker.vitest.ts` | Access tracker tests |
| `mcp_server/tests/access-tracker-extended.vitest.ts` | Access tracker extended tests |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Access-driven popularity scoring
- Current reality source: audit-D04 gap backfill

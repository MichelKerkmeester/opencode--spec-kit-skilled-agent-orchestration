# Access-driven popularity scoring

## Current Reality

The access tracker (`lib/storage/access-tracker.ts`) implements batched access counting with a soft-accumulator pattern. Each retrieval hit increments an in-memory accumulator by 0.1. When the accumulator exceeds the 0.5 threshold, a database write flushes the accumulated count to the `access_count` column in `memory_index` and updates `last_access_at`. This batching reduces write amplification from high-frequency search operations.

The `access_count` feeds into composite scoring as a popularity signal, boosting frequently retrieved memories. The accumulator map is capped at 10,000 entries to prevent unbounded memory growth. Access data also drives the archival manager's dormancy detection: memories with no recent access are candidates for automatic archival. The tracker exposes `getAccessStats()` for observability.

## Source Files

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

## Source Metadata

- Group: Scoring and calibration
- Source feature title: Access-driven popularity scoring
- Current reality source: audit-D04 gap backfill

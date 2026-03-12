# Access-driven popularity scoring

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Access-driven popularity scoring.

## 2. CURRENT REALITY

The access tracker (`lib/storage/access-tracker.ts`) implements batched access counting with a soft-accumulator pattern. Each retrieval hit increments an in-memory accumulator by 0.1. When the accumulator exceeds the 0.5 threshold, a database write flushes the accumulated count to the `access_count` column in `memory_index` and updates `last_access_at`. This batching reduces write amplification from high-frequency search operations.

The `access_count` feeds into composite scoring as a popularity signal, boosting frequently retrieved memories. The accumulator map is capped at 10,000 entries to prevent unbounded memory growth. Access data also drives the archival manager's dormancy detection: memories with no recent access are candidates for automatic archival. The tracker exposes `getAccessStats()` for observability.

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

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Access-driven popularity scoring
- Current reality source: audit-D04 gap backfill

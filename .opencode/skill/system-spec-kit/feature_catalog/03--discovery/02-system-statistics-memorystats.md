---
title: "System statistics (memory_stats)"
description: "Covers the discovery dashboard that reports memory counts, embedding status, tier breakdown and ranked folder summaries."
---

# System statistics (memory_stats)

## 1. OVERVIEW

Covers the discovery dashboard that reports memory counts, embedding status, tier breakdown and ranked folder summaries.

This is the dashboard for your knowledge base. It tells you how many memories you have, how they are organized, which folders are most active and how large the database is. Think of it like the storage settings page on your phone that shows you how much space each app is using.

---

## 2. CURRENT REALITY

`memory_stats` returns the discovery dashboard for the memory database: total memory count, embedding status breakdown, oldest/newest timestamps, total trigger phrase count, tier breakdown, database size, last indexed timestamp, graph channel metrics and the ranked folder summary.

Folder ranking supports four modes: `count`, `recency`, `importance`, and `composite`. Count mode ranks directly from `memory_index`. The scoring-based modes build folder rankings from `embedding_status = 'success'` rows and use `folderScoring.computeFolderScores()` before applying ranking-specific sorts. If scoring fails, the handler falls back to count-based folder totals.

The response now reports `totalSpecFolders` from the full filtered/scored set before pagination slicing, so the summary stays accurate when `limit` truncates `topFolders`. The payload also includes the resolved `limit`, which makes truncation behavior explicit for callers and tests.

Direct handler validation failures return MCP error envelopes with `E_INVALID_INPUT` and `data.details.requestId` for invalid `folderRanking`, invalid `excludePatterns`, invalid `includeScores`/`includeArchived`, or non-finite `limit` values. Although the validation text still says "regex pattern strings," the runtime treats `excludePatterns` as plain string patterns and applies case-insensitive substring matching when filtering folders. Aggregate-query and folder-ranking failures return MCP error envelopes instead of raw throws.

Embedding-status totals now treat `partial` as a first-class state instead of silently dropping it. `get_status_counts()` initializes and returns a `partial` bucket, and `get_stats()` includes that bucket in the headline total. That keeps `memory_stats` aligned with chunked and partially indexed rows that already exist elsewhere in the vector-index state model.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/memory-crud-stats.ts` | Handler validation, aggregate queries, folder ranking, and response shaping |
| `mcp_server/handlers/memory-crud.ts` | Public CRUD exports and snake_case compatibility aliases |
| `mcp_server/lib/scoring/folder-scoring.ts` | Archive detection and folder scoring for non-count rankings |
| `mcp_server/lib/search/hybrid-search.ts` | Supplies graph channel metrics |
| `mcp_server/lib/search/vector-index.ts` | Database access facade used by the handler |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-stats-edge.vitest.ts` | Limit behavior, validation envelopes, archived/excluded folder filtering, ranking modes, and `totalSpecFolders` regression coverage |
| `mcp_server/tests/handler-memory-crud.vitest.ts` | Public export and direct validation coverage |
| `mcp_server/tests/memory-crud-extended.vitest.ts` | Happy-path stats structure, scoring fallback, and composite-score payload coverage |

---

## 4. SOURCE METADATA

- Group: Discovery
- Source feature title: System statistics (memory_stats)
- Current reality source: `mcp_server/handlers/memory-crud-stats.ts` and discovery test coverage

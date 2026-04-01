---
title: "Dual-level retrieval"
description: "Adds a retrievalLevel parameter (local|global|auto) to memory_search, where auto mode falls back to community search on weak results, enabling both fine-grained and topic-level retrieval in a single query, gated by the SPECKIT_DUAL_RETRIEVAL flag."
---

# Dual-level retrieval

## 1. OVERVIEW

Adds a `retrievalLevel` parameter (`local`|`global`|`auto`) to `memory_search`, where auto mode falls back to community search on weak results. This enables callers to explicitly request fine-grained local retrieval, broad community-level global retrieval, or let the system decide based on result quality.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_DUAL_RETRIEVAL=false` to disable.

The `memory_search` handler accepts a `retrievalLevel` parameter with three modes: `local` runs standard retrieval channels only, `global` runs community-level search only, and `auto` (default) runs local retrieval first and falls back to community search when results are weak or empty. The flag and parameter are registered in `search-flags.ts`. Auto mode uses the same confidence thresholds as the empty-result recovery system to determine when fallback is needed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-search.ts` | Handler | `retrievalLevel` parameter handling and mode dispatch |
| `mcp_server/lib/search/search-flags.ts` | Lib | Flag registration and `retrievalLevel` parameter definition |

### Tests

| File | Focus |
|------|-------|
| — | — |

---

## 4. SOURCE METADATA

- Group: Retrieval enhancements
- Source feature title: Dual-level retrieval
- Graduated via: 009-graph-retrieval-improvements
- Kill switch: SPECKIT_DUAL_RETRIEVAL=false

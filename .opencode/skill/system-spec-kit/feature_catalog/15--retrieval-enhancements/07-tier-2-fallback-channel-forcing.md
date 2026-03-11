# Tier-2 fallback channel forcing

## Current Reality

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Tiered fallback orchestration; sets `forceAllChannels: true` during Tier-2 degradation |
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Regression `C138-P0-FB-T2` for Tier-2 forced-channel fallback |
| `mcp_server/tests/channel-enforcement.vitest.ts` | Channel enforcement tests |
| `mcp_server/tests/channel-representation.vitest.ts` | Channel representation tests |
| `mcp_server/tests/channel.vitest.ts` | Channel general tests |

## Source Metadata

- Group: Alignment remediation (Phase 016)
- Source feature title: Tier-2 fallback channel forcing
- Current reality source: feature_catalog.md

# Tier-2 fallback channel forcing

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. IN SIMPLE TERMS](#5--in-simple-terms)

## 1. OVERVIEW

Tier-2 fallback channel forcing sets `forceAllChannels: true` during quality fallback so all retrieval channels execute regardless of simple-route reduction.

## 2. CURRENT REALITY

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Tiered fallback orchestration, sets `forceAllChannels: true` during Tier-2 degradation |
| `mcp_server/lib/search/channel-enforcement.ts` | Lib | Channel enforcement |
| `mcp_server/lib/search/channel-representation.ts` | Lib | Channel min-representation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Regression `C138-P0-FB-T2` for Tier-2 forced-channel fallback |
| `mcp_server/tests/channel-enforcement.vitest.ts` | Channel enforcement tests |
| `mcp_server/tests/channel-representation.vitest.ts` | Channel representation tests |
| `mcp_server/tests/channel.vitest.ts` | Channel general tests |

## 4. SOURCE METADATA

- Group: Alignment remediation (Phase 016)
- Source feature title: Tier-2 fallback channel forcing
- Current reality source: feature_catalog.md

## 5. IN SIMPLE TERMS

Normally the search system skips some search methods when a question seems simple. But when results come back poor, this fallback kicks in and forces every search method to run. It is a safety net that says "the shortcut did not work, so try everything before giving up."

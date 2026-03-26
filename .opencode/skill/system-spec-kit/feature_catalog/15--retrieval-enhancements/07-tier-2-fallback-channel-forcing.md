---
title: "Tier-2 fallback channel forcing"
description: "Tier-2 fallback channel forcing sets `forceAllChannels: true` during quality fallback so all retrieval channels execute regardless of simple-route reduction."
---

# Tier-2 fallback channel forcing

## 1. OVERVIEW

Tier-2 fallback channel forcing sets `forceAllChannels: true` during quality fallback so all retrieval channels execute regardless of simple-route reduction.

Normally the search system skips some search methods when a question seems simple. But when results come back poor, this fallback kicks in and forces every search method to run. It is a safety net that says "the shortcut did not work, so try everything before giving up."

---

## 2. CURRENT REALITY

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Tiered fallback orchestration that sets `forceAllChannels: true` during Tier-2 degradation for simple-routed queries |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | Regression `C138-P0-FB-T2` for Tier-2 forced-channel fallback |

---

## 4. SOURCE METADATA

- Group: Alignment remediation (Phase 016)
- Source feature title: Tier-2 fallback channel forcing
- Current reality source: FEATURE_CATALOG.md

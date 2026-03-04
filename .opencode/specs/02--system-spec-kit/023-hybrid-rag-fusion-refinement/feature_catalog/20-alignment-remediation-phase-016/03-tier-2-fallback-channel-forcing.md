# Tier-2 fallback channel forcing

## Current Reality

A `forceAllChannels` option was added to hybrid search. When the tier-2 quality fallback activates, it now sets `forceAllChannels: true` to ensure all retrieval channels execute, bypassing the simple-route channel reduction that could skip BM25 or graph channels. Regression test `C138-P0-FB-T2` verifies the behavior.

---

## Source Metadata

- Group: Alignment remediation (Phase 016)
- Source feature title: Tier-2 fallback channel forcing
- Summary match found: Yes
- Summary source feature title: Tier-2 fallback channel forcing
- Current reality source: feature_catalog.md

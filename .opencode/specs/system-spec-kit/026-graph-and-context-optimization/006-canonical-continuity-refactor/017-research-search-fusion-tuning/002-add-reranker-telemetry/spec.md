---
title: "Add Reranker Cache Telemetry"
status: complete
level: 2
type: implementation
parent: 017-research-search-fusion-tuning
created: 2026-04-12
---

# Add Reranker Cache Telemetry

## Scope

Add hit, miss, stale-hit, and eviction counters to the cross-encoder cache. Expose the counters through the existing status surface so cache TTL can be tuned with real usage data instead of guesswork.

## Key Files

- `mcp_server/lib/search/cross-encoder.ts` (cache logic around line 115, status surface around line 499)

## Out of Scope

- Changing the cache TTL or eviction policy itself; this phase only adds observability.
- Dashboard or visualization work.

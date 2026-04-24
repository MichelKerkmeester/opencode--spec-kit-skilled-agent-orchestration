---
title: "...on/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry/spec]"
description: 'title: "Add Reranker Cache Telemetry"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "spec"
  - "002"
  - "add"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/002-add-reranker-telemetry"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
created: 2026-04-12
level: 2
parent: 001-search-fusion-tuning
status: complete
type: implementation
---
# Add Reranker Cache Telemetry

## Scope

Add hit, miss, stale-hit, and eviction counters to the cross-encoder cache. Expose the counters through the existing status surface so cache TTL can be tuned with real usage data instead of guesswork.

## Key Files

- `mcp_server/lib/search/cross-encoder.ts` (cache logic around line 115, status surface around line 499)

## Out of Scope

- Changing the cache TTL or eviction policy itself; this phase only adds observability.
- Dashboard or visualization work.

---
title: "...rch-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/decision-record]"
description: 'title: "Remove Cross-Encoder Length Penalty - Decision Record"'
trigger_phrases:
  - "rch"
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "decision record"
  - "remove"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
status: planned
---
# Decision Record
## ADR-001: Keep `applyLengthPenalty` as a Temporary No-Op
**Context:** `../research/research.md:81-93` shows the actual scoring regression lives in `mcp_server/lib/search/cross-encoder.ts:62-218,392-455`, but the `applyLengthPenalty` flag is still referenced by schemas, tool metadata, handlers, pipeline config, cache keys, and shadow replay.
**Decision:** Remove the length-penalty behavior now, but keep the `applyLengthPenalty` argument accepted and inert for one compatibility cycle.
**Rationale:** This removes the continuity-search regression immediately without forcing a broader contract cleanup across the same release slice.
**Consequences:** Tests must be rewritten around compatibility-only behavior, the cache may temporarily retain separate `lp` buckets, and a later follow-on phase must retire the public flag completely.

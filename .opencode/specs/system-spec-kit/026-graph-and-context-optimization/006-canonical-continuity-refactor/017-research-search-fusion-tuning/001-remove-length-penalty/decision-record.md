---
title: "Remove Cross-Encoder Length Penalty - Decision Record"
status: planned
---
# Decision Record
## ADR-001: Keep `applyLengthPenalty` as a Temporary No-Op
**Context:** `../research/research.md:81-93` shows the actual scoring regression lives in `mcp_server/lib/search/cross-encoder.ts:62-218,392-455`, but the `applyLengthPenalty` flag is still referenced by schemas, tool metadata, handlers, pipeline config, cache keys, and shadow replay.
**Decision:** Remove the length-penalty behavior now, but keep the `applyLengthPenalty` argument accepted and inert for one compatibility cycle.
**Rationale:** This removes the continuity-search regression immediately without forcing a broader contract cleanup across the same release slice.
**Consequences:** Tests must be rewritten around compatibility-only behavior, the cache may temporarily retain separate `lp` buckets, and a later follow-on phase must retire the public flag completely.

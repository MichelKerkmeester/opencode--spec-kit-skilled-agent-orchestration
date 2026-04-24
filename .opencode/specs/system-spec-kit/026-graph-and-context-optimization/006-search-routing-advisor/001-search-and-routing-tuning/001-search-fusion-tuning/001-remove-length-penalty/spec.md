---
title: "...ion/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/spec]"
description: 'title: "Remove Cross-Encoder Length Penalty"'
trigger_phrases:
  - "ion"
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "spec"
  - "001"
  - "remove"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty"
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
# Remove Cross-Encoder Length Penalty

## Scope

Delete the length penalty logic from the cross-encoder reranker entirely. In an embedded RAG system the documents are fixed-size spec-doc artifacts -- penalizing 78.6% of the corpus for exceeding 2000 characters is counterproductive. Short-doc boosting (< 50 chars) is equally unjustified and should be removed in the same pass.

## Key Files

- `mcp_server/lib/search/cross-encoder.ts` (length penalty logic around line 62)

## Out of Scope

- Fusion weights, cache TTL, or any other cross-encoder parameter.
- Adding replacement normalization logic; removal only.

---
title: "...tion/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/spec]"
description: 'title: "Raise Minimum Rerank Candidate Threshold"'
trigger_phrases:
  - "tion"
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "spec"
  - "004"
  - "raise"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum"
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
# Raise Minimum Rerank Candidate Threshold

## Scope

Increase `MIN_RESULTS_FOR_RERANK` from 2 to 4-5. Reranking only 2 documents wastes an API call with minimal ordering gain. The exact value should be validated against typical candidate-set sizes in production queries.

## Key Files

- `mcp_server/lib/search/pipeline/stage3-rerank.ts` (constant around line 49)

## Out of Scope

- Changing the reranker provider fallback order or score normalization.
- Maximum candidate cap adjustments.

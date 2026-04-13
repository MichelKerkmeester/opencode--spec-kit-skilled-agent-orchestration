---
title: "Raise Minimum Rerank Candidate Threshold"
status: complete
level: 2
type: implementation
parent: 017-research-search-fusion-tuning
created: 2026-04-12
---

# Raise Minimum Rerank Candidate Threshold

## Scope

Increase `MIN_RESULTS_FOR_RERANK` from 2 to 4-5. Reranking only 2 documents wastes an API call with minimal ordering gain. The exact value should be validated against typical candidate-set sizes in production queries.

## Key Files

- `mcp_server/lib/search/pipeline/stage3-rerank.ts` (constant around line 49)

## Out of Scope

- Changing the reranker provider fallback order or score normalization.
- Maximum candidate cap adjustments.

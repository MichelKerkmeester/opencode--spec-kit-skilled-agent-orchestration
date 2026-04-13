---
title: "Remove Cross-Encoder Length Penalty"
status: complete
level: 2
type: implementation
parent: 001-search-fusion-tuning
created: 2026-04-12
---

# Remove Cross-Encoder Length Penalty

## Scope

Delete the length penalty logic from the cross-encoder reranker entirely. In an embedded RAG system the documents are fixed-size spec-doc artifacts -- penalizing 78.6% of the corpus for exceeding 2000 characters is counterproductive. Short-doc boosting (< 50 chars) is equally unjustified and should be removed in the same pass.

## Key Files

- `mcp_server/lib/search/cross-encoder.ts` (length penalty logic around line 62)

## Out of Scope

- Fusion weights, cache TTL, or any other cross-encoder parameter.
- Adding replacement normalization logic; removal only.

---
title: "Raise Minimum Rerank Candidate Threshold - Decision Record"
status: planned
---
# Decision Record
## ADR-001: Set the Stage 3 Minimum to 4, Not 5
**Context:** `../research/research.md:161-184` found the threshold is enforced only in Stage 3, and `../research/research.md:167-170` showed that moving directly to `5` would also disable reranking on 4-result continuity queries.
**Decision:** Raise `MIN_RESULTS_FOR_RERANK` to `4` in `mcp_server/lib/search/pipeline/stage3-rerank.ts:50,321`.
**Rationale:** `4` removes the low-value 2-result and 3-result reranks while preserving neural ordering for 4-result sets, which is the safer first move.
**Consequences:** Threshold-sensitive Stage 3 regression fixtures must be updated, local GGUF reranking inherits the same policy shift, and any future move beyond `4` should wait for telemetry rather than guesswork.

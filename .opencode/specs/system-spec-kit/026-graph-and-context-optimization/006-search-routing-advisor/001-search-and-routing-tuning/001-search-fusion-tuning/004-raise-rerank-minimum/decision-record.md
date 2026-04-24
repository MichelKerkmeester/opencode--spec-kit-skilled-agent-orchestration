---
title: "...arch-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/decision-record]"
description: 'title: "Raise Minimum Rerank Candidate Threshold - Decision Record"'
trigger_phrases:
  - "arch"
  - "routing"
  - "advisor"
  - "001"
  - "search"
  - "decision record"
  - "004"
  - "raise"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["decision-record.md"]
status: planned
---
# Decision Record
## ADR-001: Set the Stage 3 Minimum to 4, Not 5
**Context:** `../research/research.md:161-184` found the threshold is enforced only in Stage 3, and `../research/research.md:167-170` showed that moving directly to `5` would also disable reranking on 4-result continuity queries.
**Decision:** Raise `MIN_RESULTS_FOR_RERANK` to `4` in `mcp_server/lib/search/pipeline/stage3-rerank.ts:50,321`.
**Rationale:** `4` removes the low-value 2-result and 3-result reranks while preserving neural ordering for 4-result sets, which is the safer first move.
**Consequences:** Threshold-sensitive Stage 3 regression fixtures must be updated, local GGUF reranking inherits the same policy shift, and any future move beyond `4` should wait for telemetry rather than guesswork.

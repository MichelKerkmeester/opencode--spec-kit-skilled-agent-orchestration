---
title: "...ion/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/plan]"
description: 'title: "Remove Cross-Encoder Length Penalty - Execution Plan"'
trigger_phrases:
  - "ion"
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "plan"
  - "001"
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
    key_files: ["plan.md"]
parent_spec: 001-remove-length-penalty/spec.md
status: complete
---
# Execution Plan
## Approach
This phase removes the reranker's content-length math from `mcp_server/lib/search/cross-encoder.ts` because the research showed the penalty demotes the natural size of spec-doc artifacts instead of improving relevance. The implementation stays narrow: delete the scoring behavior, keep the public `applyLengthPenalty` option as a temporary no-op, and move all compatibility cleanup into a later phase.

The work should follow telemetry, because `../research/research.md:95-133,273-289` recommends adding cache observability first. Test updates are part of the same slice because the current suites still assert the old short/long penalty math.

## Steps
1. Remove `LENGTH_PENALTY`, `calculateLengthPenalty()`, `applyLengthPenalty()`, and the reranker scoring branch in `mcp_server/lib/search/cross-encoder.ts:62-218,392-455`, following `../research/research.md:81-93`.
2. Keep `applyLengthPenalty` accepted but inert in the request path that still reaches `mcp_server/lib/search/cross-encoder.ts:392-455` and `mcp_server/lib/search/pipeline/stage3-rerank.ts:148,311-389`, as directed by `../research/research.md:85-93,247-249`.
3. Rewrite the penalty-focused assertions in `mcp_server/tests/cross-encoder.vitest.ts:8-21,150-177` and `mcp_server/tests/cross-encoder-extended.vitest.ts:74-141` so they prove length no longer changes reranker scores, per `../research/research.md:85-86,90-93`.
4. Patch any remaining length-penalty expectations in `mcp_server/tests/search-extended.vitest.ts:199` and `mcp_server/tests/search-limits-scoring.vitest.ts:158`, then confirm the phase does not remove schema or tool-surface compatibility before the planned cleanup follow-on.

## Verification
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.
- Run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts tests/search-extended.vitest.ts tests/search-limits-scoring.vitest.ts`.
- Confirm the `applyLengthPenalty` option still exists in the request path while reranked scores remain unchanged by content length.

## Risks
- Removing the helper but accidentally changing the request contract would break the compatibility strategy described in `../research/research.md:81-93`.
- Leaving stale test expectations behind would make this phase look complete while search-scoring suites still encode the old behavior.
- Keeping the inert flag means the cache-key `lp` bit may continue to create temporary duplicate buckets until a later cleanup removes it.

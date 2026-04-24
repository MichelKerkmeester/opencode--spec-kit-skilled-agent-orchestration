---
title: "...on/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/tasks]"
description: 'title: "Remove Cross-Encoder Length Penalty - Tasks"'
trigger_phrases:
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "tasks"
  - "remove"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
status: complete
---
# Tasks
- [x] T-01: Neutralize the length-penalty helpers in `mcp_server/lib/search/cross-encoder.ts:62-218` so the compatibility surface remains available while penalty math returns a no-op, per `../research/research.md:81-93`.
- [x] T-02: Remove the live scoring effect from `mcp_server/lib/search/cross-encoder.ts:392-455` while keeping the `applyLengthPenalty` option accepted and inert across the Stage 3 call path in `mcp_server/lib/search/pipeline/stage3-rerank.ts:148,311-389`.
- [x] T-03: Replace the threshold-math assertions in `mcp_server/tests/cross-encoder.vitest.ts:8-21,150-177` with compatibility-only assertions that prove content length no longer changes reranker scores.
- [x] T-04: Replace the helper-behavior assertions in `mcp_server/tests/cross-encoder-extended.vitest.ts:74-141` and refresh the related no-op compatibility expectations in the surrounding search-scoring suites.
- [x] T-05: Re-check the request contract surfaces cited in `../research/research.md:85-86` and confirm this phase does not remove schema, tool metadata, handler defaults, or shadow-replay support.
- [x] T-06: Remove the retired `applyLengthPenalty` cache-key split in `mcp_server/lib/search/cross-encoder.ts` so no-op flag variance no longer fragments reranker cache buckets, and prove the change in `mcp_server/tests/cross-encoder.vitest.ts`.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts tests/search-extended.vitest.ts tests/search-limits-scoring.vitest.ts`
- [x] T-V3: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/cross-encoder.vitest.ts`

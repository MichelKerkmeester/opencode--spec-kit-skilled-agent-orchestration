---
title: "...ion/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum/tasks]"
description: 'title: "Raise Minimum Rerank Candidate Threshold - Tasks"'
trigger_phrases:
  - "ion"
  - "006"
  - "search"
  - "routing"
  - "advisor"
  - "tasks"
  - "004"
  - "raise"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/004-raise-rerank-minimum"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
status: complete
---
# Tasks
- [x] T-01: Change `MIN_RESULTS_FOR_RERANK` from `2` to `4` in `mcp_server/lib/search/pipeline/stage3-rerank.ts:50,321`, following `../research/research.md:177-184`.
- [x] T-02: Expand the first three threshold-sensitive fixtures in `mcp_server/tests/stage3-rerank-regression.vitest.ts:42,70,93` so they operate on 4-result sets instead of 2-result sets.
- [x] T-03: Add explicit boundary assertions in `mcp_server/tests/stage3-rerank-regression.vitest.ts` for `3 results => applied === false` and `4 results => applied === true`, per `../research/research.md:179-184`.
- [x] T-04: Verify that `mcp_server/tests/cross-encoder.vitest.ts:177` and `mcp_server/tests/cross-encoder-extended.vitest.ts:349` stay outside the threshold-sensitive patch unless the Stage 3 boundary moves.
- [x] T-05: Add or update GGUF-path coverage so the Stage 3 minimum change is proven against the local reranker path too.
## Verification
- [x] T-V1: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`
- [x] T-V2: `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts tests/local-reranker.vitest.ts`

---
title: "...06-search-routing-advisor/001-search-and-routing-tuning/001-search-fusion-tuning/001-remove-length-penalty/checklist]"
description: 'title: "Remove Cross-Encoder Length Penalty - Checklist"'
trigger_phrases:
  - "search"
  - "routing"
  - "advisor"
  - "001"
  - "checklist"
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
    key_files: ["checklist.md"]
status: complete
---
# Verification Checklist
## P0 (Blocking)
- [x] The reranker no longer applies any content-length multiplier in `mcp_server/lib/search/cross-encoder.ts:62-218,392-455`. Evidence: `calculateLengthPenalty()` returns `1.0`, and `applyLengthPenalty()` returns an unchanged clone.
- [x] The `applyLengthPenalty` option still traverses the request path without changing scores, matching `../research/research.md:81-93`. Evidence: `stage3-rerank.ts` still forwards `applyLengthPenalty`, while `cross-encoder.ts` keeps the flag inert and `cross-encoder-extended.vitest.ts` checks unchanged provider scores.
- [x] `cross-encoder`, `search-extended`, and `search-limits-scoring` suites pass after the behavior change. Evidence: the current targeted `npx vitest run` passed with 15 files and 363 tests, including these suites.
## P1 (Should Fix)
- [x] `mcp_server/tests/cross-encoder.vitest.ts` and `mcp_server/tests/cross-encoder-extended.vitest.ts` assert compatibility behavior instead of old threshold math. Evidence: both suites now assert deterministic cache keys and no-op length-penalty behavior.
- [x] The phase leaves schema, tool metadata, handler defaults, and shadow replay intact for one compatibility cycle. Evidence: `search-limits-scoring.vitest.ts` still verifies handler and Stage 3 `applyLengthPenalty` plumbing without removing the public option.
- [x] The temporary cache-key duplication risk from the inert `lp` flag is documented for the later cleanup phase. Evidence: superseded by a stronger runtime fix: `generateCacheKey()` now ignores retired `lp` bits and `rerankResults()` caches without flag variance.
## P2 (Advisory)
- [x] Follow-on cleanup scope for removing the public `applyLengthPenalty` contract is noted explicitly. Evidence: `implementation-summary.md` sets the next safe action to retire the flag in a dedicated cleanup phase, and `decision-record.md` records the later follow-on removal.
- [x] Shadow or replay verification confirms there is no hidden dependency on the removed helper names. Evidence: `tasks.md` T-05 kept schema, handler defaults, and shadow replay support intact, while the targeted cross-encoder/search verification runs stayed green.

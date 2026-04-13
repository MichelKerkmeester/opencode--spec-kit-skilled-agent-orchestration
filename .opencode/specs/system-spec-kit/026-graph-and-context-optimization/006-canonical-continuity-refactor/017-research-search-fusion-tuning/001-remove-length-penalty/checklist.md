---
title: "Remove Cross-Encoder Length Penalty - Checklist"
status: planned
---
# Verification Checklist
## P0 (Blocking)
- [ ] The reranker no longer applies any content-length multiplier in `mcp_server/lib/search/cross-encoder.ts:62-218,392-455`.
- [ ] The `applyLengthPenalty` option still traverses the request path without changing scores, matching `../research/research.md:81-93`.
- [ ] `cross-encoder`, `search-extended`, and `search-limits-scoring` suites pass after the behavior change.
## P1 (Should Fix)
- [ ] `mcp_server/tests/cross-encoder.vitest.ts` and `mcp_server/tests/cross-encoder-extended.vitest.ts` assert compatibility behavior instead of old threshold math.
- [ ] The phase leaves schema, tool metadata, handler defaults, and shadow replay intact for one compatibility cycle.
- [ ] The temporary cache-key duplication risk from the inert `lp` flag is documented for the later cleanup phase.
## P2 (Advisory)
- [ ] Follow-on cleanup scope for removing the public `applyLengthPenalty` contract is noted explicitly.
- [ ] Shadow or replay verification confirms there is no hidden dependency on the removed helper names.

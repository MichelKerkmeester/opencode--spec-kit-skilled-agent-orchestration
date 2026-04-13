# Iteration 32: Second-Order Effects of Retiring the Length Penalty

## Focus
Look for unintended runtime or maintenance consequences now that the length penalty is retired but the compatibility flag still exists.

## Findings
1. The scoring behavior is genuinely retired: `calculateLengthPenalty()` now always returns `1.0`, `applyLengthPenalty()` clones the result set unchanged, and the targeted scoring tests assert that content length no longer changes reranker scores. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:230] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:235] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:176]
2. Cache behavior improved in the intended direction. The cache key now ignores the legacy flag and varies only by provider, query, and canonicalized document IDs, so identical rerank calls no longer split across `applyLengthPenalty=true/false` buckets. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:431] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:482]
3. The remaining cost is maintenance, not ranking quality: the handler and Stage 3 still thread the compatibility flag, the source-analysis tests still assert that plumbing exists, and `generateCacheKey()` keeps a stale "option bits" signature/comment even though option bits are no longer used in the key. That is low runtime risk but real post-removal cleanup debt. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:923] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:229] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:246]

## Ruled Out
- Expecting the retired length penalty to still create meaningful ranking drift in the shipped runtime.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`

## Assessment
- New information ratio: 0.14
- Questions addressed: `RQ-14`
- Questions answered: none fully; this pass covered the length-penalty half of the second-order-effects question

## Reflection
- What worked and why: Checking the cache key and the test slice alongside the scoring helper made it easy to separate behavioral retirement from cleanup residue.
- What did not work and why: The compatibility plumbing still creates enough surface area that a future reader could mistakenly think the flag still matters.
- What I would do differently: When retiring a scoring branch, add one explicit code comment or test title saying "compatibility-only" at the highest-level call site.

## Recommended Next Focus
Examine the small-result-set behavior after `MIN_RESULTS_FOR_RERANK = 4`, especially where MMR still remains active.

# Iteration 001 - Correctness

Scope: production/test code referenced by descendant implementation summaries and graph metadata. Spec docs were read only for scope.

Findings:

| ID | Severity | Evidence | Summary |
| --- | --- | --- | --- |
| F-IMPL-P1-001 | P1 | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:758`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:792`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:813`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296` | Tier 3 cache lookup is keyed by chunk hash and scope, but cached packet-level/prompt context is not validated before reuse. |
| F-IMPL-P1-002 | P1 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:374` | Reranker cache key uses provider/query/document IDs, while Stage 3 sends mutable display text. |
| F-IMPL-P2-001 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:246`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:252`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:147` | `generateCacheKey` accepts `optionBits` but ignores it, making the helper easy to misuse for future cache-discriminating options. |

Verification: scoped vitest failed on `mcp_server/tests/adaptive-fusion.vitest.ts:268`; isolated adaptive-fusion rerun passed.

Churn: 0.38.

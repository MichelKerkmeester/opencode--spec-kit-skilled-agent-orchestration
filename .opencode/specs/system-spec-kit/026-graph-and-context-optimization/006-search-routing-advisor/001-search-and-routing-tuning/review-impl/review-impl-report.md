# Implementation Deep Review Report

## 1. Executive Summary

Verdict: FAILING VERIFICATION, with no P0 production issue found.

Counts: P0 0, P1 5, P2 3. Confidence: medium-high. The strongest findings are the stale/cache-context risks in content routing and reranking, plus non-hermetic verification. The scoped vitest pack was run ten times: 6 passed and 4 failed on the same adaptive-fusion degraded-mode assertion. `npx tsc --noEmit` passed.

## 2. Scope

Audited 24 production/test code files:

| File |
| --- |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts` |
| `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` |
| `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts` |
| `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts` |

Spec docs and metadata were used only to discover the code scope. Findings citing only `.md`, `description.json`, or `graph-metadata.json` were rejected.

## 3. Method

- Read root and descendant graph metadata / implementation summaries to resolve code files.
- Read production and packet-linked test files with line numbers.
- Checked git history for implementation context with `git log --oneline --max-count=20 -- <audited files>`.
- Ran the scoped vitest pack ten times.
- Ran an isolated `adaptive-fusion.vitest.ts` reproduction, which passed.
- Ran `npx tsc --noEmit`, which passed.

## 4. Findings By Severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 finding identified | N/A |

### P1

| ID | Dimension | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| F-IMPL-P1-001 | correctness | Tier 3 routing cache can reuse a decision after packet-level context changes | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:758`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:792`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:813`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296` | Include routing-affecting context in cache keys or validate cache entries before reuse. |
| F-IMPL-P1-002 | correctness | Reranker cache key ignores document content, so updated memories can receive stale scores | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:248`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:374` | Include content hash/version in reranker cache key or invalidate on text changes. |
| F-IMPL-P1-003 | robustness | Provider document limits are declared and tested but not enforced before outbound requests | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:41`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:49`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:57`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:293` | Cap/reject over-limit document arrays before calling providers. |
| F-IMPL-P1-004 | testing | Adaptive fusion degraded-mode test is non-hermetic in the scoped packet run | `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:240`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:242`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:259`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:268`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:356`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:370` | Isolate the module mock and expected standard output so file ordering cannot change the assertion. |
| F-IMPL-P1-005 | testing | Fallback tests inherit live provider environment and can call external rerankers | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:213`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:228`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:231`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:291`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:456` | Clear provider env and reset reranker provider/session state in fallback tests. |

### P2

| ID | Dimension | Finding | Evidence | Recommendation |
| --- | --- | --- | --- | --- |
| F-IMPL-P2-001 | correctness | `generateCacheKey` keeps a generic `optionBits` parameter but silently ignores it | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:246`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:252`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:147` | Rename, remove, or constrain the compatibility argument. |
| F-IMPL-P2-002 | robustness | Provider helpers trust reranker response indexes without validating bounds | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:308`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:350`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:386` | Validate provider response indexes before dereferencing `documents[item.index]`. |
| F-IMPL-P2-003 | testing | Malformed provider response paths are not covered by packet-linked tests | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:150`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:226`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:271`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:302`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:344`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:380` | Add malformed 200-response tests for Voyage, Cohere, and local reranker payloads. |

## 5. Findings By Dimension

| Dimension | Findings |
| --- | --- |
| correctness | F-IMPL-P1-001, F-IMPL-P1-002, F-IMPL-P2-001 |
| security | No direct production security hole identified; F-IMPL-P1-005 has external-call test-isolation implications |
| robustness | F-IMPL-P1-003, F-IMPL-P2-002 |
| testing | F-IMPL-P1-004, F-IMPL-P1-005, F-IMPL-P2-003 |

## 6. Adversarial Self-Check For P0

No P0 was found. P0 candidates rejected:

| Candidate | Evidence | Why Not P0 |
| --- | --- | --- |
| Stale Tier 3 cache | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:758`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:813` | Wrong routing semantics are plausible, but no demonstrated data loss/crash/security bypass. |
| Stale reranker scores | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:433`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:485` | Search ranking can be wrong for cache TTL, but no destructive behavior. |
| Provider test leakage | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:213`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405` | Can call external providers during tests, but not a production auth bypass. |

## 7. Remediation Order

1. Fix F-IMPL-P1-004 first so the packet verification command is trustworthy.
2. Fix F-IMPL-P1-005 by forcing fallback tests into a no-provider environment.
3. Fix F-IMPL-P1-001 by validating routing cache context or widening cache keys.
4. Fix F-IMPL-P1-002 by adding content hash/version to reranker cache keys.
5. Fix F-IMPL-P1-003 by enforcing provider max-document limits before request serialization.
6. Add malformed provider response validation/tests for F-IMPL-P2-002 and F-IMPL-P2-003.
7. Clean up F-IMPL-P2-001 after cache semantics are settled.

## 8. Test Additions Needed

| Need | Target |
| --- | --- |
| Full scoped-pack regression for adaptive-fusion T12 that passes repeatedly under adjacent test files | `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts` |
| Tier 3 cache miss when same chunk hash is requested under different `packet_level` or prompt version | `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` |
| Reranker cache invalidation when same document IDs have changed content | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` |
| Provider max-document capping for Voyage, Cohere, and local | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` |
| Malformed provider response tests: missing arrays, non-array payloads, out-of-range indexes, invalid scores | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` |
| Explicit no-provider setup around fallback tests | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts` |

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New Findings | Churn | Verification |
| --- | --- | --- | --- | --- |
| 001 | correctness | F-IMPL-P1-001, F-IMPL-P1-002, F-IMPL-P2-001 | 0.38 | FAIL |
| 002 | security | F-IMPL-P1-005 | 0.13 | FAIL |
| 003 | robustness | F-IMPL-P1-003, F-IMPL-P2-002 | 0.25 | FAIL |
| 004 | testing | F-IMPL-P1-004, F-IMPL-P2-003 | 0.25 | PASS |
| 005 | correctness | None | 0.00 | PASS |
| 006 | security | None | 0.00 | PASS |
| 007 | robustness | None | 0.00 | PASS |
| 008 | testing | None | 0.00 | PASS |
| 009 | correctness | None | 0.00 | PASS |
| 010 | security | None | 0.00 | FAIL |

Stop reason: max iterations reached. All four dimensions were covered at least twice. The scoped vitest command is not currently reliable enough to claim a clean completion gate.

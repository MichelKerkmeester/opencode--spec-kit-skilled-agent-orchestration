# Implementation Deep Review Report

## 1. Executive summary

Verdict: changes are functional but not release-clean. The production telemetry surface works in the happy path, and the scoped vitest suite passes, but the audit found cache correctness and test determinism gaps that should be fixed before relying on the counters for tuning decisions.

Counts: P0 = 0, P1 = 3, P2 = 3. Confidence: medium-high. The highest-risk issue is that cache identity ignores document content while returning cached rerank scores.

## 2. Scope

Audited code files:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Production reranker and cache telemetry implementation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` | Public API and base behavior tests |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` | Provider path, cache, and telemetry tests |

Read for caller context, not counted as modified packet code:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | Primary production caller of `rerankResults()` |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Search limit and request normalization context |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Pre-rerank result limiting context |

Spec docs and metadata drift were explicitly excluded. No finding relies only on `.md`, `description.json`, or `graph-metadata.json` evidence.

## 3. Method

Ran the scoped verification command once at baseline and once per iteration:

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts --reporter=default`

Result: all runs passed, 2 test files and 61 tests. The first run used the default reporter and showed live provider-path warnings in `cross-encoder.vitest.ts`; iterations 002-010 used dot reporter and passed.

Checked implementation history with:

`git log -n 3 --oneline -- .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`

Relevant commits observed: `d8ea31810c` telemetry implementation, `22c1c33a94` cache key option-bit follow-up, `4e60c007fa` test follow-up.

Used `rg`, `nl -ba`, `git show`, and `git blame` to verify code layout, call sites, and telemetry-specific changed lines.

## 4. Findings by severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 found | N/A |

### P1

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| DRI-F001 | correctness | Cache key ignores document content, so same IDs can reuse stale rerank scores. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:254`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:434`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:439` |
| DRI-F002 | testing | Base cross-encoder tests can hit live provider resolution instead of a deterministic no-provider setup. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:218`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:221`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:405`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:206` |
| DRI-F003 | testing | Telemetry tests do not exercise stale-hit or eviction counters. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:152`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:442`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:445`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:433` |

### P2

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| DRI-F004 | robustness | Provider response indices are trusted before validating they point at submitted documents. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:308`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382` |
| DRI-F005 | security | Reranker cache uses a 32-bit non-cryptographic hash with no collision validation. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:259`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:265`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:435` |
| DRI-F006 | robustness | Provider `maxDocuments` configuration is declared but not enforced by `rerankResults()`. | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:31`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:41`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:57`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:458` |

## 5. Findings by dimension

| Dimension | Findings |
| --- | --- |
| correctness | DRI-F001 |
| security | DRI-F005 |
| robustness | DRI-F004, DRI-F006 |
| testing | DRI-F002, DRI-F003 |

## 6. Adversarial self-check for P0

No P0 was found.

Checked the likely escalation candidates:

| Candidate | Why not P0 |
| --- | --- |
| DRI-F001 stale rerank cache | It can return wrong rerank scores, but entries expire after `CACHE_TTL` and the main pipeline remaps result rows by ID before returning user-visible rows. |
| DRI-F005 hash collision | A collision can cause wrong cached results, but cache size is bounded at `MAX_CACHE_ENTRIES` and there is no evidence of data loss, auth bypass, or crash-only path. |
| DRI-F004 malformed provider response | `rerankResults()` catches provider errors and falls back to positional scoring, so main-path impact is degraded ranking rather than crash. |

## 7. Remediation order

1. Fix DRI-F001 by including document content hashes, content version, or a stable input digest in the reranker cache key. Preserve provider and query in the key.
2. Fix DRI-F002 by isolating provider env in `cross-encoder.vitest.ts` or forcing `useCache:false` plus no-provider env setup for fallback tests.
3. Fix DRI-F003 by adding tests for stale cache expiry and LRU eviction telemetry.
4. Fix DRI-F004 by filtering provider result rows to valid integer indices before mapping to documents.
5. Fix DRI-F006 by enforcing `PROVIDER_CONFIG[provider].maxDocuments` before provider dispatch.
6. Fix DRI-F005 by replacing the simple 32-bit hash with a stronger digest or storing original key material for collision validation.

## 8. Test additions needed

| Test | Purpose |
| --- | --- |
| Same IDs with changed content should miss cache | Protect DRI-F001 and prove stale score reuse is gone |
| Same IDs in different order should preserve correct `originalRank` or define that rank is not cache-stable | Clarify cache contract |
| Base tests clear provider env before `rerankResults()` calls | Protect DRI-F002 |
| Expired cache entry increments `misses`, `staleHits`, and `evictions` | Protect stale telemetry |
| Cache over `MAX_CACHE_ENTRIES` increments `evictions` and caps entries | Protect eviction telemetry |
| Provider returns out-of-range index | Protect DRI-F004 |
| Direct `rerankResults()` with more than provider max documents | Protect DRI-F006 |

## 9. Appendix: iteration list and churn

| Iteration | Dimension | New findings | Churn |
| --- | --- | --- | --- |
| 001 | correctness | DRI-F001 | 1.00 |
| 002 | security | DRI-F005 | 0.24 |
| 003 | robustness | DRI-F004, DRI-F006 | 0.33 |
| 004 | testing | DRI-F002, DRI-F003 | 0.41 |
| 005 | correctness | none | 0.08 |
| 006 | security | none | 0.04 |
| 007 | robustness | none | 0.08 |
| 008 | testing | none | 0.11 |
| 009 | correctness | none | 0.04 |
| 010 | security | none | 0.03 |

Artifacts:

- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/iterations/iteration-001.md` through `iteration-010.md`
- `review-impl/deltas/iter-001.jsonl` through `iter-010.jsonl`
- `review-impl/review-impl-report.md`

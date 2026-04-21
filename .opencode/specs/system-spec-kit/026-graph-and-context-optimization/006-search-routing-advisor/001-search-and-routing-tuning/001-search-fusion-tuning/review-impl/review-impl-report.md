# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

The implementation does remove the live cross-encoder length-penalty effect: `calculateLengthPenalty()` returns `1.0`, `applyLengthPenalty()` is a score/order-preserving no-op, Stage 3 still forwards the compatibility flag, and the reranker cache no longer splits on retired `lp` option bits.

Counts: P0 0, P1 1, P2 3. Confidence: high for the P1 test isolation issue because the scoped vitest run visibly exercised the live-provider fallback path; medium-high for the P2 robustness items because they are line-evident but not reproduced as failing tests during this read-only audit.

## 2. Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Production implementation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` | Packet-linked test |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` | Packet-linked test |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts` | Verification test from implementation summary |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts` | Verification test from implementation summary |

Context-only code read:

| File | Reason |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | Verify Stage 3 compatibility flag forwarding |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Verify cross-encoder feature gate behavior |

Spec docs and metadata were used only to resolve scope. They were not reviewed for drift and are not used as finding evidence.

## 3. Method

- Read `implementation-summary.md` and `graph-metadata.json` to identify claimed code files.
- Read the five audited code/test files with line numbers.
- Checked file-specific git history for `d8ea31810c`, `22c1c33a94`, and `4e60c007fa`.
- Ran scoped vitest 10 times using:
  `cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/cross-encoder.vitest.ts tests/cross-encoder-extended.vitest.ts tests/search-extended.vitest.ts tests/search-limits-scoring.vitest.ts --reporter=default`
- Ran `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit`.

Verification result: 10/10 scoped vitest runs passed; typecheck passed.

## 4. Findings By Severity

### P0

| ID | Finding | Evidence | Status |
| --- | --- | --- | --- |
| None | No P0 findings identified | N/A | N/A |

### P1

| ID | Finding | Evidence | Recommendation |
| --- | --- | --- | --- |
| F-IMPL-P1-001 | Fallback tests inherit live provider environment and can call external rerankers | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:213`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:228`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:231`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:291`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:219` | Clear `VOYAGE_API_KEY`, `COHERE_API_KEY`, and `RERANKER_LOCAL` around fallback tests and reset crossEncoder state. |

### P2

| ID | Finding | Evidence | Recommendation |
| --- | --- | --- | --- |
| F-IMPL-P2-001 | `generateCacheKey` keeps a generic `optionBits` parameter but silently ignores it | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:246`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:252`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:257`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:147` | Rename/remove/constrain the compatibility argument so future options cannot silently collide. |
| F-IMPL-P2-002 | Direct provider helpers trust reranker response indexes without validating bounds | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:308`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:346`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:350`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:382`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:386` | Validate response indexes before dereferencing documents. |
| F-IMPL-P2-003 | Malformed provider response paths are not covered by packet-linked tests | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:150`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:226`, `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:271`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:302`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:344`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:380` | Add malformed 200-response tests for all providers. |

## 5. Findings By Dimension

| Dimension | Findings |
| --- | --- |
| correctness | F-IMPL-P2-001 |
| security | None |
| robustness | F-IMPL-P2-002 |
| testing | F-IMPL-P1-001, F-IMPL-P2-003 |

## 6. Adversarial Self-Check For P0

No P0 findings were identified. P0 candidates checked and rejected:

| Candidate | Code Evidence | Why Not P0 |
| --- | --- | --- |
| Test env leaks external reranker calls | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:213`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:219` | Required test fix, but not a production auth bypass, data loss path, or guaranteed crash. |
| Malformed reranker indexes | `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:304`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:308` | `rerankResults()` catches provider errors and falls back; direct helper exports remain brittle but not release-blocking. |

## 7. Remediation Order

1. Fix F-IMPL-P1-001 by making fallback tests hermetic. This should be first because it affects verification trust and can make the suite call real providers.
2. Fix F-IMPL-P2-002 by validating provider response indexes and score shape.
3. Add F-IMPL-P2-003 malformed response tests while implementing F-IMPL-P2-002.
4. Address F-IMPL-P2-001 in the cleanup phase already suggested by the implementation summary: retire or rename the compatibility `optionBits` surface.

## 8. Test Additions Needed

| Need | Target File |
| --- | --- |
| Clear provider env in fallback-oriented tests and assert provider is `none` rather than relying on failed fetch fallback | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts` |
| Malformed 200 Voyage response: missing `data`, non-array `data`, out-of-range index, invalid score | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` |
| Malformed 200 Cohere/local responses: missing `results`, non-array `results`, out-of-range index, invalid score | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts` |
| Explicit cache helper compatibility test that documents `optionBits` is retired-only, not a generic option-discriminator surface | `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts` |

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New Findings | Ratio | Churn | Verification |
| --- | --- | --- | --- | --- | --- |
| 001 | correctness | F-IMPL-P2-001 | 0.08 | 0.08 | PASS |
| 002 | security | None | 0.00 | 0.00 | PASS |
| 003 | robustness | F-IMPL-P2-002 | 0.08 | 0.08 | PASS |
| 004 | testing | F-IMPL-P1-001 | 0.31 | 0.31 | PASS with observed provider warnings |
| 005 | correctness | None | 0.00 | 0.00 | PASS |
| 006 | security | None | 0.00 | 0.00 | PASS |
| 007 | robustness | None | 0.00 | 0.04 | PASS |
| 008 | testing | F-IMPL-P2-003 | 0.08 | 0.08 | PASS |
| 009 | correctness | None | 0.00 | 0.00 | PASS |
| 010 | security | None | 0.00 | 0.00 | PASS |

Stop reason: max iterations reached. All four dimensions were covered at least twice.


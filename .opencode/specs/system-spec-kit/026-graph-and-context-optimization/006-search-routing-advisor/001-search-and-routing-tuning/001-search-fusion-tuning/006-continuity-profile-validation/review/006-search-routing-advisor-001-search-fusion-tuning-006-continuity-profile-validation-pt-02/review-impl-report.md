# Implementation Deep Review Report

## 1. Executive Summary

Verdict: changes need remediation before being treated as production-hard. The scoped tests pass, but the implementation has four P1 issues: one correctness mismatch, one security trust-boundary gap, one robustness cache-collision risk, and one test-design gap.

Counts: P0 = 0, P1 = 4, P2 = 2. Confidence: medium-high. Evidence is from production/test code only; spec-doc/metadata-only findings were intentionally excluded.

## 2. Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Production router and Tier 3 prompt |
| `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts` | Continuity K-sweep fixture |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Router and prompt contract tests |

Not reviewed for drift: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`.

## 3. Method

Ran the required scoped Vitest command once per iteration:

`cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/k-value-optimization.vitest.ts tests/content-router.vitest.ts --reporter=default`

All 10 runs passed: 2 test files, 40 tests.

Git history checked:

- `29624f3a71 feat(026): implement all 5 remaining gap phases`
- `2270dfb71f feat: land prompt quality and continuity updates`

Exact-code search used `rg` for `continuity`, `metadata_only`, `buildTier3Prompt`, `target_doc`, `target.docPath`, and K-optimization symbols.

## 4. Findings By Severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 findings identified | N/A |

### P1

| ID | Finding | Evidence |
| --- | --- | --- |
| IMPL-P1-001 | Tier 3 prompt says `metadata_only` targets `implementation-summary.md`, while router code/tests use `spec-frontmatter` | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1074`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1273`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:663` |
| IMPL-P1-002 | Tier 3 `target_doc` / `target_anchor` are accepted from model output without allowlist validation | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:837`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859` |
| IMPL-P1-003 | Tier 3 cache key hashes truncated normalized text, so distinct long chunks can share cache entries | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:483`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1130` |
| IMPL-P1-004 | Continuity K=60 validation hardcodes rankings instead of exercising retrieval/fusion behavior | `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:43`, `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:417`, `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:428` |

### P2

| ID | Finding | Evidence |
| --- | --- | --- |
| IMPL-P2-001 | `InMemoryRouterCache` ignores injected `now` and uses `Date.now()` for expiry | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:319`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:327`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470` |
| IMPL-P2-002 | Prompt tests assert wording but do not exercise Tier 3 `metadata_only` normalization | `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:560`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:584`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:655` |

## 5. Findings By Dimension

Correctness: IMPL-P1-001, IMPL-P1-003.

Security: IMPL-P1-002.

Robustness: IMPL-P1-003, IMPL-P2-001.

Testing: IMPL-P1-004, IMPL-P2-002.

## 6. Adversarial Self-Check For P0

No P0 was promoted. The strongest candidate was IMPL-P1-002 because untrusted Tier 3 output can control `target_doc`, but this review did not prove a downstream arbitrary write path inside the scoped files. The code-level expected-vs-actual remains serious:

- Expected: category selects one of the router's known targets via `buildTarget()`.
- Actual: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687` and `:688` copy model-provided `target_doc` and `target_anchor` into the final routing target after only string/type checks at `:859` and `:860`.

## 7. Remediation Order

1. Fix IMPL-P1-002 by deriving Tier 3 targets from `buildTarget(finalCategory, ...)` unless the raw target passes a strict allowlist for that category.
2. Fix IMPL-P1-001 by choosing one canonical metadata write target and making prompt, `buildTarget()`, and tests agree.
3. Fix IMPL-P1-003 by separating full-content cache identity from prompt/embedding truncation.
4. Replace or supplement IMPL-P1-004's static rankings with a fixture that invokes the actual retrieval/fusion scorer.
5. Wire `InMemoryRouterCache` to an injected clock or document it as wall-clock only.
6. Add Tier 3 metadata normalization tests that would fail on the current prompt/target mismatch.

## 8. Test Additions Needed

- Tier 3 `metadata_only` classifier response with `target_doc: "implementation-summary.md"` should assert the final normalized target is the canonical metadata target.
- Tier 3 response with `target_doc: "../outside.md"` or an unknown doc should be refused or normalized to a safe category target.
- Two long chunks with identical first 2048 normalized characters but different endings should not reuse the same Tier 3 cache entry.
- Continuity K fixture should feed query/corpus data through the same retrieval/fusion path used by production before `optimizeKValuesByIntent()`.
- Cache expiry test should use an injected deterministic clock.

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New findings | Churn |
| --- | --- | ---: | ---: |
| 001 | correctness | 1 | 1.00 |
| 002 | security | 1 | 0.50 |
| 003 | robustness | 2 | 0.50 |
| 004 | testing | 2 | 0.40 |
| 005 | correctness | 0 | 0.00 |
| 006 | security | 0 | 0.00 |
| 007 | robustness | 0 | 0.00 |
| 008 | testing | 0 | 0.00 |
| 009 | correctness | 0 | 0.00 |
| 010 | security | 0 | 0.00 |

Convergence note: all four dimensions were covered at least once. Three consecutive iterations with churn <= 0.05 occurred by iteration 007, but the loop continued to iteration 010 to satisfy the requested 10-iteration implementation pass.

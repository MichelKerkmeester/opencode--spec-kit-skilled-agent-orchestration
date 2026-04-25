# Iteration 18: Test Fallout for MIN_RESULTS_FOR_RERANK = 4

## Focus
Identify which tests break when Stage 3 no longer reranks 2-document fixtures and convert that into concrete phase-004 implementation guidance.

## Findings
1. `stage3-rerank-regression.vitest.ts` is the main direct casualty: the first three regression tests call `applyCrossEncoderReranking()` with only 2 input rows and currently expect `result.applied === true`. Those fixtures must be expanded to at least 4 rows if phase `004` raises the threshold to 4. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:42] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:70] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:93] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:116]
2. The `executeStage3()` regression at line 142 is unaffected because it disables cross-encoder reranking (`rerank: false`) and only exercises MMR/non-embedded row preservation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:142]
3. Direct `crossEncoder.rerankResults()` suites in `cross-encoder.vitest.ts`, `cross-encoder-extended.vitest.ts`, and `reranker-eval-comparison.vitest.ts` do not need threshold updates, because they bypass the Stage 3 minimum guard entirely. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:177] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:349] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts:325]
4. Safe phase-004 guidance:
   - change the constant to `4`
   - expand the three direct Stage 3 regression fixtures from 2 rows to 4 rows
   - add one new negative-boundary test for 3 rows
   - leave direct cross-encoder tests untouched unless they accidentally imported the Stage 3 helper later. [INFERENCE: keeps the change localized to the policy layer that owns the threshold]

## Ruled Out
- Mass-editing every reranker test file after raising the Stage 3 minimum; the threshold blast radius is narrower than that.

## Dead Ends
- Treating the evaluation-comparison suite as evidence for Stage 3 threshold behavior; it tests the reranker module directly.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/reranker-eval-comparison.vitest.ts`

## Assessment
- New information ratio: 0.58
- Questions addressed: `RQ-9`
- Questions answered: `RQ-9`

## Reflection
- What worked and why: Searching the tests by helper name immediately separated threshold-sensitive fixtures from direct module tests.
- What did not work and why: The current regression suite never explicitly documents that it depends on the threshold being `2`.
- What I would do differently: Name boundary-sensitive fixtures after the policy they depend on, not just the module under test.

## Recommended Next Focus
Trace the K-sweep harnesses and decide which one can absorb continuity-specific queries with the lowest implementation cost.

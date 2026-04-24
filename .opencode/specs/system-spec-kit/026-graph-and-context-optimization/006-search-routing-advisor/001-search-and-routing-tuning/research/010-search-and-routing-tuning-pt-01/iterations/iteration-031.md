# Iteration 31: SKILL.md Alignment and Regression Coverage

## Focus
Verify whether `SKILL.md` describes the shipped search behavior accurately and cross-check that claim against the current regression surface.

## Findings
1. `SKILL.md` is materially more accurate than the other two target docs. Its search-architecture summary correctly states the 4-stage shape, the `MIN_RESULTS_FOR_RERANK = 4` gate, the compatibility-only `applyLengthPenalty`, and the new cache telemetry surface without claiming that Stage 3 already consumes the continuity profile end to end. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:592]
2. The regression surface reflects the same split: resume-mode tests explicitly assert that canonical resume must not call `handleMemorySearch()`, the adaptive-ranking suite allows `detectedIntent='understand'` alongside `adaptiveFusionIntent='continuity'`, and the intent-classifier suite only proves that `INTENT_LAMBDA_MAP.continuity` exists. There is still no test proving that Stage 3 selects the continuity lambda from a resume-style search configuration. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:6] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:260] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:677]
3. Targeted verification stays green despite that gap. The reranker/no-op slice (`stage3-rerank-regression`, `cross-encoder`, `search-limits-scoring`) passed in this run, and the resume/adaptive-ranking/lambda-map slice (`memory-context.resume-gate-d`, `adaptive-ranking`, `intent-classifier`) also passed. That supports the conclusion that the remaining issue is a missing end-to-end contract, not a currently failing regression. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:136] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:176] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:156]

## Ruled Out
- Assuming the existing test surface already proves Stage 3 continuity-lambda behavior just because the map entry and resume tests both exist.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`

## Assessment
- New information ratio: 0.18
- Questions addressed: `RQ-13`
- Questions answered: `RQ-13` — `SKILL.md` is aligned, but `ARCHITECTURE.md` and `configs/README.md` overstate the live continuity-to-Stage3 behavior

## Reflection
- What worked and why: Treating `SKILL.md` as a summary surface and the tests as executable claims made the doc audit much sharper.
- What did not work and why: The current test suite proves the individual pieces but still leaves the continuity-to-Stage3 handoff implicit.
- What I would do differently: Add one contract-style test for the chosen Stage 3 intent source whenever a new internal profile is introduced.

## Recommended Next Focus
Check for second-order runtime effects from the shipped no-op length-penalty change before moving to the rerank-threshold follow-up.

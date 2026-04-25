# Iteration 12: Length Penalty Test Fallout and Safe Phase-001 Guidance

## Focus
Identify which tests will fail when length-penalty behavior disappears and turn that into concrete implementation guidance for phase `001-remove-length-penalty`.

## Findings
1. The length-penalty behavior is asserted directly in at least four suites: `cross-encoder.vitest.ts`, `cross-encoder-extended.vitest.ts`, `search-extended.vitest.ts`, and `search-limits-scoring.vitest.ts`. Those tests currently pin the exact thresholds (`50`, `2000`) and penalties (`0.9`, `0.95`) rather than merely verifying reranker behavior. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts:8] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts:74] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts:199] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:178]
2. `search-limits-scoring.vitest.ts` also performs source-analysis checks that explicitly search for `calculateLengthPenalty` and `applyLengthPenalty` strings in handler and Stage 3 source, so deleting those symbols without rewriting the tests will fail even if runtime behavior is correct. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:231] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:248] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts:267]
3. The safest phase-001 patch is:
   - delete `LENGTH_PENALTY`, `calculateLengthPenalty()`, and `applyLengthPenalty()` from `cross-encoder.ts`
   - keep the `applyLengthPenalty` option accepted and forwarded for one compatibility cycle, but make it a no-op
   - rewrite tests from "penalty math exists" to "flag is inert / reranker output no longer changes by content length". [INFERENCE: aligns runtime removal with the existing public request contract]
4. Because the user explicitly decided to remove the penalty entirely, there is no value in preserving threshold constants in hidden form. Any remaining flag should be documented as compatibility-only and scheduled for follow-up cleanup after callers/tests stop referencing it. [INFERENCE: user decision removes the need for shadow threshold tuning]

## Ruled Out
- Replacing the deleted penalty with a higher threshold in phase `001`; that contradicts the user’s explicit removal decision.

## Dead Ends
- Keeping the constants in code "just for tests". That would preserve dead behavior rather than removing it.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-extended.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-limits-scoring.vitest.ts`

## Assessment
- New information ratio: 0.67
- Questions addressed: `RQ-6`
- Questions answered: `RQ-6`

## Reflection
- What worked and why: Test-first blast-radius mapping translated the abstract removal decision into an immediately actionable implementation checklist.
- What did not work and why: The packet sub-phase spec understates how much test cleanup phase `001` really owns.
- What I would do differently: Mark source-analysis tests as high-risk whenever a phase proposes deleting named helpers.

## Recommended Next Focus
Map the reranker cache observability gap and decide the smallest status shape that can expose hit/miss data without inventing a new telemetry subsystem.

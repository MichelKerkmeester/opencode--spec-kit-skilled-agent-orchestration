# Iteration 24: Safe K-Sweep Harness Extension

## Focus
Determine how to extend the K-sweep harness for continuity validation without breaking the current evaluation tests or forcing premature public-intent type expansion.

## Findings
1. The safest first extension is additive continuity fixtures in `k-value-optimization.vitest.ts`. The current suite only asserts best-K results for `literal_lookup` and `understand`, so a new `continuity` bucket can be added without disturbing those expectations as long as its assertions are scoped to the new bucket or to metric presence. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:98]
2. `optimizeKValuesByIntent()` is already the right seam because it groups queries by arbitrary string keys and returns per-intent metrics keyed the same way. No `IntentClass` expansion is required for the narrow continuity benchmark. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:402] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:494] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:509]
3. The typed judged sweep should stay deferred. `JudgedQuery.intent` and the fixture helper `makeJudgedQuery(intent: IntentClass, ...)` are both union-locked, so continuity would force a broader type/test migration for little immediate benefit. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:325] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:339] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:670] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:57]
4. The implementation-ready recommendation is therefore: keep continuity K validation in `k-value-optimization.vitest.ts` first, use continuity-resume and decision-recovery prompts, and only widen into the judged sweep if a real public continuity intent is later approved. [INFERENCE: keeps evaluation additive and decoupled from public-intent scope]

## Ruled Out
- Using ground-truth or typed judged-sweep expansion as the first continuity benchmark step.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts`

## Assessment
- New information ratio: 0.11
- Questions addressed: `RQ-10`
- Questions answered: none newly answered; this was a validation-path pass

## Reflection
- What worked and why: Reading both the untyped and typed evaluation harnesses made the low-risk additive path obvious.
- What did not work and why: The packet’s early wording made "the K sweep" sound singular when the repo actually maintains two evaluation paths with different coupling.
- What I would do differently: Split future evaluation recommendations into "additive fixture work" versus "type-surface expansion" from the outset.

## Recommended Next Focus
Use the risk register and K-harness conclusions to lock the final implementation order, answer the remaining phase-003 scope question, and refresh `research.md` for handoff.

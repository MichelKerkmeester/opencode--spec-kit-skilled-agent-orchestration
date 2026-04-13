# Iteration 19: Continuity-Specific K-Sweep Extension Path

## Focus
Determine how to extend the repo’s K-sweep harness with continuity-oriented judged queries while keeping the implementation blast radius as small as possible.

## Findings
1. The lowest-blast-radius extension point is `optimizeKValuesByIntent()` via `IntentKOptimizationQuery`. That path already accepts `intent: string`, so continuity-specific query labels can be added immediately without changing the `IntentClass` union. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:402] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:494]
2. The higher-blast-radius path is the judged sweep (`JudgedQuery`, `runJudgedKSweep()`), because `JudgedQuery.intent` is typed as `IntentClass`, which currently excludes `continuity`. Extending that harness would require a union change plus broader judged-sweep test updates. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:339] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:670] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts:12]
3. The repo already has a template for precomputed per-K rankings in `k-value-optimization.vitest.ts`, so continuity-specific judged queries can be added there first using realistic continuity prompts such as:
   - "resume the packet from the last safe action"
   - "what changed in this spec folder since the last session"
   - "where was this implementation decision recorded"
   - "continue the canonical continuity refactor". [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:19] [INFERENCE: continuity prompts should target spec-doc recovery and decision resumption]
4. Safe K-sweep guidance is therefore staged:
   - phase 1: add `continuity` rows to `optimizeKValuesByIntent()` fixtures and judge their best K
   - phase 2: only if public continuity intent ships, extend `IntentClass` and `runJudgedKSweep()` so continuity participates in the typed judged harness too. [INFERENCE: separates evaluation work from public intent-system expansion]

## Ruled Out
- Starting with `runJudgedKSweep()` for continuity before the profile/intent question is settled.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-judged-sweep.vitest.ts`

## Assessment
- New information ratio: 0.66
- Questions addressed: `RQ-10`
- Questions answered: `RQ-10`

## Reflection
- What worked and why: Comparing the typed and untyped K-sweep paths exposed a clear "cheap first, broader later" implementation route.
- What did not work and why: The packet wording implied a single harness, but the repo actually has two distinct K-evaluation paths with different coupling.
- What I would do differently: Audit the type surface of evaluation helpers before assuming a new query class belongs everywhere.

## Recommended Next Focus
Close the resumed loop with a cross-phase synthesis that turns iterations 11-19 into concrete guidance for implementation phases `001`-`004` and the K-sweep extension.

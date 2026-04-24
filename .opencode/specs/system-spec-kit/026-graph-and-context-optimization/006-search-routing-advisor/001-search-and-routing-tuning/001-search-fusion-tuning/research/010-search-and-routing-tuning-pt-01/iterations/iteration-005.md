# Iteration 5: RRF K-Sensitivity and Intent Sweep

## Focus
Understand whether the repo already contains evidence for better RRF K values and whether continuity-style intents should use a different K than the current default.

## Findings
1. Shared RRF fusion defaults to `k=40`, includes a flat `0.10` convergence bonus, and applies a default graph boost of `1.5` when graph has no explicit weight. [SOURCE: .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:22]
2. The K-sensitivity analysis utility sweeps `{10,20,40,60,80,100,120}` but uses `K=60` as its analysis baseline, which is notable because production default is `40`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:127]
3. The optimization test fixture expects `literal_lookup -> K=10` and `understand -> K=80`, which means the codebase already encodes the idea that different intents benefit from different top-heaviness. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:98]

## Ruled Out
- None this iteration.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts:22`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:127`
- `.opencode/skill/system-spec-kit/mcp_server/tests/k-value-optimization.vitest.ts:98`

## Assessment
- New information ratio: 0.55
- Questions addressed: `RQ-1`
- Questions answered: none

## Reflection
- What worked and why: The repo's own eval tooling gave a direct answer about K sensitivity without needing to invent a new metric.
- What did not work and why: The harness does not directly label a continuity intent, so mapping it to packet needs remains an inference step.
- What I would do differently: Compare continuity behavior against `find_spec` and `find_decision` next instead of defaulting to `understand`.

## Recommended Next Focus
Translate the weight and K findings into continuity-query priorities and separate vector-only tuning from hybrid continuity tuning.

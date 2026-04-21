# Iteration 001 - Correctness

## Scope

Primary files read:

- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`

Verification:

- Scoped Vitest command: exit 1
- TypeScript was not run in this iteration.
- Git history checked: `d8ea31810c` added the continuity profile line; later commits changed only tests in this local scope.

## Findings

### IMPL-F001 - P1 - Prototype-key intent strings bypass the unknown-intent default path

`getAdaptiveWeights()` accepts a raw `string` intent at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:138` and indexes a plain object at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:142`. The profile map itself is a normal object at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:60`, so inherited names such as `__proto__` and `constructor` are not guaranteed to behave like ordinary unknown intent strings. After the lookup, the code immediately assumes numeric weights while summing fields at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:170`.

Expected behavior: every unrecognized intent string should use `DEFAULT_WEIGHTS`.

Actual risk: prototype-key strings can avoid the `?? { ...DEFAULT_WEIGHTS }` branch and produce invalid or missing numeric weights, which can then change channel inclusion in `adaptiveFuse()`.

Evidence that tests do not cover this edge: the unknown-intent test only uses `unknown_intent_xyz` at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:100`.

## Ruled Out

- No public `IntentType` expansion was found in `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts`; the type still lists 7 intents.

## Churn

New findings: P1=1, P2=0. New findings ratio: 0.28.

# Iteration 004 - Testing

## Scope

Primary files read:

- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`
- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`

Verification:

- Scoped Vitest command: exit 1.
- Failure observed at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:268`.

## Findings

### IMPL-F003 - P1 - Scoped Vitest verification is red and flaky in the adaptive-fusion degradation path

The required scoped Vitest command fails on the degradation test at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:268`. The test mocks `fuseResultsMulti` to throw on the first invocation at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:249`, then compares the fallback result to a second `standardFuse()` call at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:266`.

The production branch under test catches adaptive fusion failures at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:396` and computes a standard fallback at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:401`. The failed assertion showed the fallback result ordered as `sem-1, sem-2, sem-3, kw-1, kw-2, kw-3`, while the later `standardFuse()` reference ordered as `sem-1, kw-1, sem-2, kw-2, sem-3, kw-3`.

Expected behavior: the degradation-path regression test should be deterministic and green, or should assert the actual fallback contract without comparing against a second call that can observe a different mocked/module state.

Actual risk: the packet's required verification is currently not reliable enough to guard the continuity profile.

## Churn

New findings: P1=1. New findings ratio: 0.31.

# Iteration 008 - Testing

## Scope

Primary files read:

- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`

Verification:

- Scoped Vitest command: exit 1.
- Grep checked profile coverage for graph fields.

## Findings

### IMPL-F005 - P2 - Graph field validation omits the new continuity profile

The continuity profile defines both `graphWeight` and `graphCausalBias` at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`. The graph field validation test uses `PROFILE_NAMES = ['understand', 'find_spec', 'fix_bug', 'add_feature', 'refactor']` at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:358`, so it never checks continuity in the numeric graph field and range assertions that follow.

There is a continuity test at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:307`, but it only checks semantic-vs-keyword and graph-vs-recency ordering. It does not assert `graphCausalBias` type/range for the new profile.

Expected behavior: any profile added to `INTENT_WEIGHT_PROFILES` should be part of the shared graph-field profile validation.

## Churn

New findings: P2=1. New findings ratio: 0.08.

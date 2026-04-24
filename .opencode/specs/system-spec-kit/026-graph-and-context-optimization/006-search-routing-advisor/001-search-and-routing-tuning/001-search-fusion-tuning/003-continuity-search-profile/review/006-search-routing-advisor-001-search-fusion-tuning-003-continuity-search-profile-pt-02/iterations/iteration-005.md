# Iteration 005 - Correctness

## Scope

Primary files read:

- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`

Verification:

- Scoped Vitest command: exit 1.
- Grep checked whether continuity is included in document-type test loops.

## Findings

### IMPL-F004 - P1 - Continuity weights are not protected from generic document-type retuning

The continuity profile is declared with the researched `0.52 / 0.18 / 0.07 / 0.23` weights at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`. The implementation then applies generic document-type adjustments to any intent when `documentType` is present at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:148`, including the implementation branch at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:156`.

The continuity-specific regression only checks the no-document-type call at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:108`. The document-type loop excludes continuity by iterating only `understand`, `fix_bug`, `add_feature`, and `refactor` at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:134`.

Expected behavior: either continuity should be explicitly exempt from document-type retuning, or tests should assert the intended retuned continuity values.

Actual risk: a caller that combines `intent='continuity'` with a document type can silently stop using the researched continuity profile.

## Churn

New findings: P1=1. New findings ratio: 0.20.

# Iteration 003 - Robustness

## Scope

Primary files read:

- `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts`

Verification:

- Scoped Vitest command: exit 0 in this repeated run.
- TypeScript was not rerun in this iteration.
- Grep checked `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` and document-type adjustment coverage.

## Findings

### IMPL-F002 - P1 - Unbounded DOC_TYPE_WEIGHT_FACTOR can return negative or invalid fusion weights

The document-type factor is read directly with `parseFloat(...) || 1.2` at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:86`. It is then used without finite/range validation, while `inverseFactor` is derived as `2 - DOC_TYPE_WEIGHT_FACTOR` at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:149`.

The adjustment branches clamp only one side of the affected weights: keyword is capped above but not below at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:153`, recency is capped above but not below at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:158`, and semantic is capped above but not below in the research branch at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:163`.

Expected behavior: an env-tunable multiplier should reject or clamp non-finite, negative, and extreme values before it can produce invalid weights.

Actual risk: a negative or extreme process env value can make returned weights negative or numerically unstable. Downstream fusion uses `> 0` channel gates at `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:210` and `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:218`, so this can silently drop a channel rather than fail clearly.

Evidence that tests do not cover the env edge: the document-type test checks only sum bounds at `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:132` and does not mutate the env factor.

## Churn

New findings: P1=1. New findings ratio: 0.24.

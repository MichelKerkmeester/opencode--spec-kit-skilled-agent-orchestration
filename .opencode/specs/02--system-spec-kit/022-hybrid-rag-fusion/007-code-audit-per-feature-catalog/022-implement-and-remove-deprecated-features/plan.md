---
title: "Plan: Implement + Remove Deprecated Features"
---
# Plan

## Execution: 5 GPT-5.4 Agents (Single Wave, Parallel)

### Agent 1 — REMOVE: Channel Attribution

**Delete files:**
- `mcp_server/lib/eval/channel-attribution.ts`
- `mcp_server/tests/channel.vitest.ts`
- `feature_catalog/09--evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md`
- `manual_testing_playbook/09--evaluation-and-measurement/015-shadow-scoring-and-channel-attribution-r13-s2.md`

**Clean imports:**
- `tests/shadow-scoring.vitest.ts:26` — remove import line
- `tests/mpab-quality-gate-integration.vitest.ts:43-44` — remove import lines

**Clean references in:**
- `feature_catalog/feature_catalog.md` — remove shadow scoring section
- `feature_catalog/feature_catalog_in_simple_terms.md` — remove section
- `mcp_server/lib/eval/README.md` — remove channel-attribution entries

### Agent 2 — REMOVE: Fusion Shadow V2 + Eval Ceiling

**Delete files:**
- `shared/algorithms/fusion-lab.ts`
- `mcp_server/tests/fusion-lab.vitest.ts`
- `mcp_server/lib/eval/eval-ceiling.ts`
- `mcp_server/tests/ceiling-quality.vitest.ts`
- `feature_catalog/11--scoring-and-calibration/23-fusion-policy-shadow-v2.md`
- `feature_catalog/09--evaluation-and-measurement/04-full-context-ceiling-evaluation.md`
- `manual_testing_playbook/11.../170-fusion-policy-shadow-v2...md`
- `manual_testing_playbook/09.../008-full-context-ceiling-evaluation-a2.md`

**Clean:**
- `shared/algorithms/index.ts:8-10` — delete commented export lines
- `feature_catalog/feature_catalog.md` — remove both sections
- `feature_catalog/feature_catalog_in_simple_terms.md` — remove both sections
- `manual_testing_playbook/manual_testing_playbook.md` — remove both entries
- `mcp_server/lib/eval/README.md` — remove eval-ceiling entries

### Agent 3 — IMPLEMENT: Graph Calibration Profiles

1. Remove `@deprecated` from `graph-calibration.ts:14`
2. Import + wire `applyCalibrationProfile()` in `stage2-fusion.ts` after graph signals (~L635)
3. Guard with `if (isGraphCalibrationProfileEnabled()) { ... }`
4. Update `feature_catalog/10.../15-graph-calibration-profiles.md` — remove DEPRECATED, describe as active
5. Update `feature_catalog.md` + `feature_catalog_in_simple_terms.md`
6. Run `npx vitest run tests/graph-calibration.vitest.ts`

### Agent 4 — IMPLEMENT: Temporal Contiguity Layer

1. Remove `@deprecated` from `temporal-contiguity.ts:7`
2. Add `isTemporalContiguityEnabled()` to `search-flags.ts` (graduated, default ON)
3. Import + wire `vectorSearchWithContiguity()` in `stage1-candidate-gen.ts` (vector channel, before fusion)
4. Guard with `if (isTemporalContiguityEnabled()) { ... }`
5. Update `feature_catalog/10.../11-temporal-contiguity-layer.md` — remove DEPRECATED, describe as active
6. Update `feature_catalog.md` + `feature_catalog_in_simple_terms.md`
7. Run `npx vitest run tests/temporal-contiguity.vitest.ts`

### Agent 5 — IMPLEMENT: Consumption Logger

1. In `consumption-logger.ts:23`, change `return false` to `return isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`
2. Import `isFeatureEnabled` from rollout-policy
3. Add to rollout-policy or search-flags as graduated (default ON)
4. Verify handler wiring at `memory-search.ts:969`, `memory-context.ts:1155`, `memory-triggers.ts:449`
5. Update `feature_catalog/09.../08-agent-consumption-instrumentation.md` — describe as active
6. Update `feature_catalog.md` + `feature_catalog_in_simple_terms.md`
7. Run `npx vitest run tests/consumption-logger.vitest.ts`

## Post-Wave Verification

1. Run full test suite
2. Grep for deleted module names (expect 0 hits)
3. Grep for new imports (verify wiring)
4. Spot-check 3 catalog entries

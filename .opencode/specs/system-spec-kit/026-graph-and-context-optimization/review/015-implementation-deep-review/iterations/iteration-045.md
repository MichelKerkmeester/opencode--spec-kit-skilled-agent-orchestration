# Iteration 45 - test-quality - tests

## Dispatcher
- iteration: 45 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:35:03Z

## Files Reviewed
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review/review/deep-review-config.json
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-implementation-deep-review/review/deep-review-state.jsonl
- .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/anchor-merge-operation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-db.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/archive/coverage-graph-tools.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/assistive-reconsolidation.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/atomic-index-memory.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/checkpoint-completeness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/upsert.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
- .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **`causal-fixes.vitest.ts` never executes the production `relations` filter path for `memory_drift_why`.** The T203 cases build an unfiltered chain with `getCausalChain()` and then filter `fullChain.children` inside the test itself, while the only handler-level assertion is that `handleMemoryDriftWhy` is a function. The real contract lives in `handleMemoryDriftWhy()` and `filterChainByRelations()`, where `relations` are validated and applied after traversal. If the handler stopped honoring `relations`, these tests would still pass. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:163-189`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:258-286`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:338-423`.

```json
{
  "claim": "The T203 'relations filter' coverage is a false positive: it filters arrays in test code instead of invoking handleMemoryDriftWhy with a relations argument, so regressions in the production filter path would not fail the suite.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:163-189",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:258-286",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:338-423"
  ],
  "counterevidenceSought": "Searched the reviewed causal-fixes suite for any call that passes relations into handleMemoryDriftWhy or otherwise asserts the handler response payload after filtering; the only handler check is typeof handleMemoryDriftWhy === 'function'.",
  "alternativeExplanation": "The author may have intended this file as a storage-layer smoke test and expected handler coverage elsewhere, but within the reviewed iteration set there is no companion test that exercises the server-side relations gate the comments describe.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if another active suite outside the reviewed surface already invokes memory_drift_why with relations and asserts the filtered response shape end to end."
}
```

2. **The flag-on adaptive-fusion tests do not verify that adaptive mode changes the returned ranking at all.** `T10` asserts only the computed weights, `C138-T3` claims to test different rankings but again only compares `weights.semanticWeight`, and `T11` only checks that dark-run diff fields exist. The shipped implementation's contract is the `results: adaptiveResults` branch when adaptive mode is enabled. A regression that returned `standardFuse(...)` results while preserving weight bookkeeping would leave the main flag-on suite green. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:169-177`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:215-229`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:322-332`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:356-418`.

```json
{
  "claim": "The adaptive-fusion suite does not actually prove that enabling adaptive mode changes the returned results ordering; it mostly asserts weight metadata, so a no-op implementation could still pass.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:169-177",
    ".opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:215-229",
    ".opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:322-332",
    ".opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:356-418"
  ],
  "counterevidenceSought": "Checked the reviewed adaptive-fusion suite for any flag-ON assertion that compares result.results against standardFuse output or compares enabled result IDs across intents; none were present beyond empty-input and flag-OFF checks.",
  "alternativeExplanation": "The authors may have intentionally limited this suite to weight-profile validation and delegated output-order checks to another layer, but no reviewed test on this surface exercises the enabled branch's returned ranking contract directly.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if another active suite already asserts that flag-on hybridAdaptiveFuse returns a materially different results ordering than standardFuse for representative mixed semantic/keyword inputs."
}
```

### P2 Findings
- **`T12` validates a hand-built `DegradedModeContract` object instead of driving `hybridAdaptiveFuse()` through its real error branch.** The production degraded response is assembled only inside the `catch` path when `adaptiveFuse()` throws, but the test just instantiates a local object and then re-checks the happy path. That leaves `failureMode`, `fallbackMode`, `confidenceImpact`, and `retryRecommendation` unprotected against regressions in the actual fallback logic. Evidence: `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:233-269`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:397-411`.

## Traceability Checks
- `memory_drift_why` advertises server-side relation filtering and validates `relations` before trimming the flattened chain, but the reviewed T203 suite does not trace that contract through the handler surface. Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:258-286`, `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:380-423`, `.opencode/skill/system-spec-kit/mcp_server/tests/causal-fixes.vitest.ts:163-189`.
- The adaptive-fusion implementation promises that the enabled path returns `adaptiveResults`, yet the reviewed tests mostly validate weight math rather than that returned-results behavior. Evidence: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:414-418`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:169-177`, `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:322-332`.

## Confirmed-Clean Surfaces
- **`adaptive-ranking.vitest.ts`**: this suite hits live persistence and stage-2 integration rather than pure literals; it creates real SQLite state, calls `executeStage2()`, and verifies threshold persistence / cache refresh behavior against the adaptive-ranking implementation.
- **`atomic-index-memory.vitest.ts`**: the assertions are behaviorally meaningful for routed writes, rejection rollback, retry exhaustion, and shared-lock serialization; they exercise the real file-promotion contract instead of only checking helper shapes.
- **`checkpoint-completeness.vitest.ts`**: this is a substantive end-to-end restore test that snapshots authoritative tables, runs `createCheckpoint()` plus `restoreCheckpoint()`, and then compares restored database state against the captured baseline.

## Next Focus
- Iteration 46 should keep mining live test suites for false positives in handler-facing contracts, especially any cases that claim end-to-end coverage while only asserting local object shapes or metadata side effects.

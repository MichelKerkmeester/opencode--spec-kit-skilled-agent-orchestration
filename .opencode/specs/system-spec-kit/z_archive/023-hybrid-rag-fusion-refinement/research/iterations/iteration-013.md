# Iteration 13: Test Coverage Analysis for Proposed Changes

## Focus
Assess test coverage across the Spec Kit Memory MCP server search pipeline. Map existing tests to each of the 7 proposed backlog changes (P1-3 recency fusion, P1-4 GRAPH_WEIGHT_CAP, RECONSOLIDATION default-enable, QUALITY_LOOP default-enable, P2-4 doc-type shift, P3 NOVELTY_BOOST cleanup, P3 hasTriggerMatch). Identify gaps and propose minimal test additions.

## Findings

### 1. Test Suite Inventory: 100+ vitest files covering the MCP server

The `mcp_server/tests/` directory contains 100+ `.vitest.ts` files. Key files relevant to the proposed changes:

| Test File | Pipeline Stage / Feature | Relevance |
|-----------|------------------------|-----------|
| `stage2-fusion.vitest.ts` | Stage 2 fusion scoring, graph signals, feedback, rollout states | P1-3 (recency), P1-4 (graph cap) |
| `search-flags.vitest.ts` | Feature flag defaults, toggle behavior | RECONSOLIDATION, QUALITY_LOOP defaults |
| `graph-flags.vitest.ts` | Graph unified flag toggle | P1-4 (graph cap) |
| `graph-regression-flag-off.vitest.ts` | Graph regression when flags off | P1-4 (graph cap) |
| `cold-start.vitest.ts` | NOVELTY_BOOST (calculateNoveltyBoost) | P3 NOVELTY_BOOST cleanup |
| `composite-scoring.vitest.ts` | Composite scoring with recency weights | P1-3 (recency) |
| `reconsolidation.vitest.ts` | Reconsolidation enable/disable, flag gating | RECONSOLIDATION default-enable |
| `assistive-reconsolidation.vitest.ts` | Assistive reconsolidation flag | RECONSOLIDATION |
| `mpab-quality-gate-integration.vitest.ts` | Quality gate + reconsolidation integration | RECONSOLIDATION + QUALITY_LOOP |
| `integration-search-pipeline.vitest.ts` | End-to-end pipeline (module loading, input validation) | All changes |
| `intent-classifier.vitest.ts` | Intent weights including recency | P1-3 (recency), P2-4 (doc-type) |
| `rollout-policy.vitest.ts` | `isFeatureEnabled()` function | RECONSOLIDATION, QUALITY_LOOP |
| `memory-save-ux-regressions.vitest.ts` | Save UX with QUALITY_LOOP env | QUALITY_LOOP |
| `adaptive-ranking.vitest.ts` / `adaptive-ranking-e2e.vitest.ts` | Adaptive ranking modes | General pipeline |
| `artifact-routing.vitest.ts` | Artifact strategy recencyBias | P1-3 (recency) |

[SOURCE: Glob output from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/`]

### 2. Stage 2 Fusion Test Coverage: Strong for graph signals, weak for recency

`stage2-fusion.vitest.ts` covers:
- Learned-trigger feedback signal application (weight applied exactly once, no double-scaling)
- Graph walk rollout states (`off`, `trace_only`, `bounded_runtime`) with deterministic ordering
- Graph bonus capping (`appliedBonus: 0.03`, `capApplied: true`)
- Score alias consistency (`score === rrfScore === intentAdjustedScore` when no adjustments)
- Degradation when DB unavailable (fusion continues)
- All graph signal mocks (applyGraphSignals, applyCommunityBoost, coActivation)

**MISSING for P1-3 (recency fusion):** No test for a recency bonus step in stage2. The test imports do not include `computeRecencyScore` and the test input fixtures (`createStage2Input`) do not include `created_at` timestamps on candidates. When the recency step is added, new tests will need:
- Candidates with varying `created_at` timestamps
- Verification that recency bonus is additive and capped at 0.10
- Verification that recency bonus interacts correctly with graph bonus
- Verification that recency does not apply when it would exceed the cap

**MISSING for P1-4 (GRAPH_WEIGHT_CAP):** The stage2 test verifies `appliedBonus: 0.03` (the STAGE2_GRAPH_BONUS_CAP), but does not directly test the GRAPH_WEIGHT_CAP constant at 0.05. The cap is applied in `graph-calibration.ts`, not in stage2 directly. Need to verify `graph-calibration` has its own test or add one.

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:1-270`]

### 3. Feature Flag Test Coverage: Reconsolidation explicitly tested as opt-in

`search-flags.vitest.ts` line 71-78 explicitly tests:
```
it('defaults graduated gates on while keeping reconsolidation opt-in', () => {
    expect(isReconsolidationEnabled()).toBe(false);  // <-- THIS WILL BREAK
```

Line 112-121 also tests reconsolidation's strict opt-in behavior:
```
it('reconsolidation only enables for an explicit true value', () => {
    process.env.SPECKIT_RECONSOLIDATION = '1';
    expect(isReconsolidationEnabled()).toBe(false);  // strict true-only
    delete process.env.SPECKIT_RECONSOLIDATION;
    expect(isReconsolidationEnabled()).toBe(false);  // default off
```

**BREAKING for RECONSOLIDATION default-enable:** Changing `isReconsolidationEnabled()` to use `isFeatureEnabled()` will BREAK at least 3 test assertions:
1. Line 77: `expect(isReconsolidationEnabled()).toBe(false)` --> must become `toBe(true)`
2. Line 117: `'1'` behavior may change (isFeatureEnabled treats `'1'` as truthy)
3. Line 119-120: `delete` / undefined behavior must change to `toBe(true)`

Additionally, `reconsolidation.vitest.ts` (lines 217-248) has its own flag toggle tests that will also need updating.

**QUALITY_LOOP:** `memory-save-ux-regressions.vitest.ts` references `SPECKIT_QUALITY_LOOP` in env setup/teardown but the flag default assertion needs to be verified. The `rollout-policy.vitest.ts` tests `isFeatureEnabled()` generically and would automatically cover QUALITY_LOOP if it uses the standard isFeatureEnabled pattern.

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/search-flags.vitest.ts:71-121`]
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation.vitest.ts:217-248`]

### 4. NOVELTY_BOOST Test Coverage: Comprehensive, cleanup is safe

`cold-start.vitest.ts` has two describe blocks for `calculateNoveltyBoost`:
- "flag disabled (default)" -- tests return 0 when unset or "false"
- "feature removed (always returns 0)" -- tests return 0 even when "true" (9+ test cases with stubEnv)

The test descriptions already document that the feature is removed. The describe block names and test assertions confirm: removing `calculateNoveltyBoost()`, its 3 constants, and related metadata fields will require:
- Removing the 2 describe blocks in `cold-start.vitest.ts` (~200 lines)
- Updating any `calculateCompositeScore` tests that reference `noveltyBoostApplied`/`noveltyBoostValue` metadata
- No other test files import `calculateNoveltyBoost` directly

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts:1-60`]

### 5. Integration/E2E Test Coverage: Shallow module-loading level

`integration-search-pipeline.vitest.ts` is the closest to an E2E test but it is primarily a module-loading and input-validation smoke test. It:
- Imports handler, hybrid-search, vector-index, bm25-index
- Verifies modules are defined
- Tests valid/invalid input handling with DB error tolerance
- Does NOT exercise the full stage1->stage2->stage3->stage4 pipeline with real data

There is no integration test that:
- Sends a query through all 4 pipeline stages with fixture data
- Verifies end-to-end score ordering after fusion
- Tests feature flag combinations affect ranking output

This means proposed changes lack a regression safety net at the integration level. Each change relies on unit-level tests only.

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/integration-search-pipeline.vitest.ts:1-80`]

### 6. Doc-Type Shift (P2-4): No direct test for DOC_TYPE_WEIGHT_SHIFT

The doc-type weight shift logic lives in `shared/algorithms/adaptive-fusion.ts`. Grep for `DOC_TYPE_WEIGHT_SHIFT` across tests returned no results. The `intent-classifier.vitest.ts` tests weight profiles per intent but does not test the shift mechanism itself. The `composite-scoring.vitest.ts` has a recency weight test (`expect(weights.recency).toBe(0.10)`) but no doc-type shift proportionality test.

**MISSING:** No test verifies that the flat +/-0.1 shift is applied correctly, and no test would catch a change to proportional shifting. A new test is needed.

[SOURCE: Grep for DOC_TYPE_WEIGHT_SHIFT across tests/ -- 0 results]
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:175-500`]

### 7. Coverage Gap Matrix Per Proposed Change

| Proposed Change | Has Unit Test? | Has Integration Test? | Test Will Break? | New Test Needed? |
|----------------|---------------|----------------------|-----------------|-----------------|
| P1-3: Recency fusion signal | NO | NO | N/A | YES -- stage2 recency step test |
| P1-4: GRAPH_WEIGHT_CAP 0.05->0.15 | Partial (stage2 tests graph bonus cap at 0.03, not the 0.05 cap) | NO | NO (different cap) | YES -- graph-calibration cap test |
| RECONSOLIDATION default-enable | YES (explicit opt-in tests) | NO | YES (3+ assertions) | Update existing tests |
| QUALITY_LOOP default-enable | Indirect (env setup/teardown only) | NO | Possibly | Verify + update flag defaults |
| P2-4: Doc-type proportional shift | NO | NO | N/A | YES -- adaptive-fusion weight shift test |
| P3: NOVELTY_BOOST cleanup | YES (comprehensive, already documents removal) | NO | YES (remove ~200 lines) | Remove existing tests |
| P3: hasTriggerMatch word-boundary | NO (query-classifier.vitest.ts tests classifier, not word boundaries) | NO | N/A | Optional -- P3 priority |

## Ruled Out
- Searching for graph-calibration-specific tests (no file named `graph-calibration.vitest.ts` exists in tests/)
- Full E2E pipeline testing with real DB fixtures (integration test is module-loading only, not exercising real data flow)

## Dead Ends
- None this iteration. All investigation paths yielded actionable findings.

## Sources Consulted
- Glob: `**/*.vitest.ts` in mcp_server directory (100+ test files discovered)
- Read: `stage2-fusion.vitest.ts` (lines 1-270) -- fusion regression coverage
- Read: `search-flags.vitest.ts` (lines 1-140) -- feature flag defaults
- Read: `graph-flags.vitest.ts` (lines 1-48) -- graph unified flag
- Read: `cold-start.vitest.ts` (lines 1-60) -- novelty boost tests
- Read: `integration-search-pipeline.vitest.ts` (lines 1-80) -- E2E pipeline
- Grep: `isFeatureEnabled|RECONSOLIDATION|QUALITY_LOOP|NOVELTY_BOOST|recency|GRAPH_WEIGHT_CAP|DOC_TYPE_WEIGHT_SHIFT` across tests/ (80 matches)

## Assessment
- New information ratio: 0.57
- Questions addressed: All 6 (test files inventory, fusion stage coverage, integration tests, feature flag tests, per-change regression coverage, new tests needed)
- Questions answered: All 6

## Reflection
- What worked and why: Glob for `*.vitest.ts` plus targeted Grep for feature-specific terms (RECONSOLIDATION, GRAPH_WEIGHT_CAP, etc.) gave a complete map of which tests exist for which features in one pass. Reading the actual test assertions (not just file names) was essential -- `search-flags.vitest.ts` line 77 explicitly encodes the opt-in assumption that will break.
- What did not work and why: Initial Glob with `*.{test,vitest,spec}.{ts,js}` picked up 100+ node_modules results, wasting a tool call. The more specific `**/tests/*.vitest.ts` pattern was needed.
- What I would do differently: Start with the more specific Glob pattern to avoid node_modules noise. Also would have checked for a vitest config file to understand test organization upfront.

## Recommended Next Focus
Proceed to final synthesis. All original questions, all P1/P2/P3 items, and now test coverage are fully mapped. The research has reached diminishing returns -- 12 of 13 iterations have produced actionable findings with declining novelty (0.57 this iteration). Recommend: synthesize all findings into research/research.md with the complete backlog, test impact matrix, and implementation order.

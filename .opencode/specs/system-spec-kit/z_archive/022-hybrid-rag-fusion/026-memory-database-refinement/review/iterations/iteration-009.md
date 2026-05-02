# Iteration 009: Feature Flag Interactions

## Findings

### [P1] `SPECKIT_GRAPH_REFRESH_MODE=off` does not actually disable graph-lifecycle enrichment while entity linking stays enabled
**File**
`.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`

**Issue**
The save pipeline treats graph refresh and entity linking as interchangeable gates for `onIndex()`. Disabling graph refresh with `SPECKIT_GRAPH_REFRESH_MODE=off` does not stop deterministic graph edge creation or LLM backfill as long as `SPECKIT_ENTITY_LINKING` remains enabled, and `SPECKIT_ENTITY_LINKING` is default-on. That makes the "graph refresh off" control incomplete and contradicts the published contract that LLM graph backfill becomes a no-op when graph refresh is off.

**Evidence**
- `runPostInsertEnrichment()` calls `onIndex(...)` when `isGraphRefreshEnabled() || isEntityLinkingEnabled()` in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:166-172`.
- `isEntityLinkingEnabled()` is a default-on graduated flag in `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:246-251`.
- `resolveGraphRefreshMode()` correctly resolves `off`, but `onIndex()` ignores that mode and only short-circuits when `SPECKIT_ENTITY_LINKING` is false in `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:53-57` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:479-483`.
- The feature-flag reference claims `SPECKIT_LLM_GRAPH_BACKFILL` is a "No-op when SPECKIT_GRAPH_REFRESH_MODE is off" in `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:97`.

**Fix**
Make `onIndex()` respect `resolveGraphRefreshMode()` directly, or gate the `post-insert.ts` call on graph-refresh state for graph-lifecycle work and keep entity-linking-only behavior in the dedicated R10/S5 branch. If LLM backfill is meant to require graph refresh, add an explicit `isGraphRefreshEnabled()` check before scheduling it.

### [P1] `SPECKIT_CONSUMPTION_LOG` is simultaneously documented as inert and implemented as a live default-on flag
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md`
`.opencode/skill/system-spec-kit/references/config/environment_variables.md`
`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md`
`.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts`

**Issue**
The codebase has two incompatible truths for the same flag. The implementation still treats `SPECKIT_CONSUMPTION_LOG` as a graduated default-on gate and the tests verify live logging when the flag is unset, but the telemetry README says the flag is deprecated, inert, and hardcoded to `false`. That is not just doc drift: operators reading the telemetry docs will think no consumption data is being recorded when the logger is still active by default.

**Evidence**
- `isConsumptionLogEnabled()` delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')` in `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:82-85`, so unset means enabled.
- The telemetry README says the flag is "inert" and that `isConsumptionLogEnabled()` returns `false` in `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:104` and `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:318-326`.
- The general env-var reference says the default is `OFF` in `.opencode/skill/system-spec-kit/references/config/environment_variables.md:320`.
- The feature-flag reference says the default is `true` and the logger stays active unless explicitly disabled in `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-telemetry.md:34`.
- The tests assert that logging occurs when the flag is unset and stops only when set to `false`/`0` in `.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:462-475` and `.opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:529-553`.

**Fix**
Pick one state and align all surfaces. If the flag is meant to be inert, hardcode the helper to `false`, delete the live logging expectations, and scrub the feature catalog/env docs. If the flag is meant to stay live, delete the "deprecated/inert" claims from the telemetry README and set every docs table to default-on.

### [P2] `SPECKIT_GRAPH_WALK_ROLLOUT` documentation still advertises an unsupported `full` state
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
`.opencode/skill/system-spec-kit/references/config/environment_variables.md`
`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`
`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`

**Issue**
The runtime only supports `off`, `trace_only`, and `bounded_runtime`, but the environment-variable reference still documents `full` as a valid `SPECKIT_GRAPH_WALK_ROLLOUT` value. An operator following that doc will silently fall back to the inherited/default ladder instead of enabling a distinct full mode, because no such state exists in code.

**Evidence**
- `GraphWalkRolloutState` is defined as `'off' | 'trace_only' | 'bounded_runtime'`, and `resolveGraphWalkRolloutState()` recognizes only those values plus boolean aliases in `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:192-206`.
- The graph-walk compatibility shim exposes only those three states and treats runtime enablement as `bounded_runtime` only in `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:21-41`.
- The env-var reference still lists `off, bounded_runtime, full` in `.opencode/skill/system-spec-kit/references/config/environment_variables.md:217`.
- The feature-flag reference already documents the correct enum (`off`, `trace_only`, `bounded_runtime`) in `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:79`.

**Fix**
Remove `full` from the env-var reference, or add explicit code handling plus tests for a true `full` state. Right now the safer fix is documentation correction because the runtime/test surface only supports the 3-state ladder.

### [P2] Shared-memory roadmap defaults are still documented as `true` in telemetry docs even though config/runtime now default them off
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md`
`.opencode/skill/system-spec-kit/references/config/environment_variables.md`
`.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`

**Issue**
The default-off fix for shared-memory roadmap metadata landed in code, but not all docs were updated. `capability-flags.ts` now forces the roadmap capability default to `false` to match the live shared-spaces runtime gate, yet the telemetry README still advertises `SPECKIT_MEMORY_SHARED_MEMORY` as default `true`. That leaves telemetry/documentation consumers with the exact stale default the code was trying to eliminate.

**Evidence**
- `getMemoryRoadmapCapabilityFlags()` explicitly passes `false` for `sharedMemory` and comments that this is to match runtime gate behavior in `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts:141-146`.
- `isSharedMemoryEnabled()` says the live runtime default is OFF unless env/config explicitly enables it in `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts:175-190`.
- The telemetry README still lists `SPECKIT_MEMORY_SHARED_MEMORY` with default `true` in `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:95-101`.
- The broader env/docs surfaces already say OFF in `.opencode/skill/system-spec-kit/references/config/environment_variables.md:341` and `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:87`.

**Fix**
Update the telemetry README to `false` and remove any "default-on roadmap capability" wording for shared memory. The code and the other flag references are already aligned on default-off.

### [P2] Some SPECKIT flags are still frozen at import time instead of using the dynamic helper pattern
**File**
`.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts`
`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`

**Issue**
Most graduated flags in this server are resolved dynamically through `isFeatureEnabled()` or a per-call helper, but a few still snapshot process env at module import. That means toggling those flags within a live process does not behave like the rest of the flag surface, and callers can get stale behavior until the module is reloaded.

**Evidence**
- `co-activation.ts` computes `parsedBoostFactor` and `CO_ACTIVATION_CONFIG.enabled` from env at module load in `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:22-34`, and `isEnabled()`/`boostScore()` reuse that frozen object in `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts:81-103`.
- Stage 2 fusion consumes the frozen `CO_ACTIVATION_CONFIG.boostFactor` directly in `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:797-800`.
- `corrections.ts` snapshots `SPECKIT_RELATIONS` into `ENABLE_RELATIONS` at import time in `.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:151`, then all later gates reuse that constant in `.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:222-223` and `.opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts:282-283`.
- The co-activation tests have to `resetModules()` to observe env changes, which is a tell that the config is import-time cached rather than dynamically resolved in `.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:78-99`.

**Fix**
Replace import-time env snapshots with getter functions that parse env on demand, matching the rest of the feature-flag surface. If performance matters, cache only derived numeric values behind an explicit refresh hook rather than at module import.

## Summary
P0: 0, P1: 2, P2: 3

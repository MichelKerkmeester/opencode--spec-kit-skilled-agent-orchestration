# Iteration 005

## Focus
Q5: Dead code, unused exports, orphaned test helpers, and architectural debt accumulated during the four fix sprints plus Phase 12 remediation.

## Scope And Method
- Scanned `.opencode/skill/system-spec-kit/mcp_server/` for exported symbols, stale wrappers, skipped tests, and feature-flag branches.
- Cross-checked candidate exports with project-wide `rg` usage searches.
- Prioritized only high-confidence findings where the declaration exists but no live callers were found, or where the branch is provably unreachable.

## Findings

### 1. Dead eager-warmup branch is still shipped even though the flag hook is inert
- Evidence:
  - `.opencode/skill/system-spec-kit/shared/embeddings.ts:307-313` documents `SPECKIT_EAGER_WARMUP` / `SPECKIT_LAZY_LOADING` as inert and hard-returns `false` from `shouldEagerWarmup()`.
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:895-934` still carries the full eager-warmup branch plus legacy log messaging.
- Impact:
  - The `if (eagerWarmup)` path is unreachable in the current codebase.
  - Startup logic, tests, and docs still imply a configurable behavior that no longer exists.
- Safe cleanup action:
  - Remove the eager-warmup branch from `context-server.ts`.
  - Delete or rewrite docs/tests that still describe `SPECKIT_EAGER_WARMUP` and `SPECKIT_LAZY_LOADING` as functional runtime switches.
  - Keep one short compatibility note in release notes if external users may still recognize those names.
- Removal safety: High. The deciding function is a hardcoded `false`, so deleting the dead branch does not change runtime behavior.

### 2. `tools/types.ts` exposes orphaned API surface
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:12-34` exports `MCPResponseWithContext` and `parseValidatedArgs()`.
  - Project-wide search in the MCP server returns no internal references beyond those declarations.
- Impact:
  - This creates a larger public surface than the runtime actually uses.
  - `parseValidatedArgs()` duplicates validation entry behavior that call sites are not consuming.
- Safe cleanup action:
  - Remove both exports if they were never intended as package API.
  - If they must remain for compatibility, add an explicit deprecation comment and a dedicated regression test that proves an external consumer still exists.
- Removal safety: High for internal cleanup; Medium if the package export contract is treated as public outside this repo.

### 3. `handlers/index.ts` still exports lazy sub-module proxies that no runtime path uses
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:296-309` exports `memorySearch`, `memoryTriggers`, `memorySave`, `memoryCrud`, `memoryIndex`, `memoryBulkDelete`, `checkpoints`, `sessionLearning`, `causalGraph`, `evalReporting`, `memoryContext`, `memoryIngest`, and `sharedMemory`.
  - Project-wide search found no direct `.memorySearch`, `.memoryTriggers`, `.memoryCrud`, `.memoryIngest`, `.sessionLearning`, `.causalGraph`, `.evalReporting`, `.memoryContext`, or `.sharedMemory` usage in the MCP server.
- Impact:
  - The barrel exports more than the server, tools, or tests consume.
  - Each proxy keeps extra lazy-loader surface area alive and makes the barrel look more stable/public than it really is.
- Safe cleanup action:
  - Remove the unused proxy exports and keep only the named handler functions that the server and tool dispatchers actually import.
  - If one or two proxies are meant for debugging, move them behind a clearly named `__testables` or `__internal` export.
- Removal safety: High after one repo-wide usage sweep plus test run.

### 4. A few runtime modules still export debug or placeholder symbols with no callers
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:448-449` exports `getLastDegradedState()` with no in-repo callers.
  - `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts:202-206` exports `_resetInitTracking()` but the function body does not reset anything and has no callers.
- Impact:
  - `getLastDegradedState()` looks like a supported debug API but is not exercised.
  - `_resetInitTracking()` is worse than dead code: it advertises test-only behavior but currently does nothing.
- Safe cleanup action:
  - Remove the exports if no external consumer exists.
  - If the degraded-state accessor is still useful for tests, move it into a `__testables` object.
  - If `_resetInitTracking()` is needed, implement a real reset path; otherwise delete it.
- Removal safety: High.

### 5. Several exported types look like leftover public surface rather than active contracts
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:352-359` exports `PipelineOrchestrator`, but no in-repo references exist.
  - `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts:18-22` exports `InterferenceResult`, but no in-repo references exist.
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-surrogates.ts:57-67` exports `SurrogateMatchResult`, but no in-repo references exist.
- Impact:
  - These types expand the apparent API surface and invite drift between docs and reality.
  - Because they are type-only, they do not hurt runtime directly, but they add maintenance noise after heavy churn.
- Safe cleanup action:
  - Remove the `export` modifier or inline the types near their actual consumer if they are purely local concepts.
  - Keep them exported only if a package-level contract or generated docs require them.
- Removal safety: High.

### 6. Shared-memory test discovery still depends on a shim file instead of normal test naming
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts:13-16` only includes `tests/**/*.{vitest,test}.ts`.
  - `.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.test-suite.ts:1-31` contains the actual suite.
  - `.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory.vitest.ts:1` exists only to import that suite file.
- Impact:
  - The wrapper is not harmful, but it is test-discovery debt and obscures the actual test file.
  - Anyone scanning the tree could misread the real suite as orphaned because its filename does not match Vitest discovery.
- Safe cleanup action:
  - Rename `shared-memory-handlers.test-suite.ts` to `shared-memory-handlers.vitest.ts`.
  - Delete the one-line `shared-memory.vitest.ts` shim.
- Removal safety: High.

### 7. Score-resolution logic is duplicated and already diverged
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:48-58` defines canonical `resolveEffectiveScore()` using `intentAdjustedScore -> rrfScore -> score -> similarity`.
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:106-119` duplicates the same fallback chain locally.
  - `.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:123-129` uses a reduced helper that only considers `score` and `similarity`.
- Impact:
  - The formatter can report a different "top result score" than the pipeline and confidence subsystems use.
  - This is not dead code, but it is architectural debt caused by local helper drift after the refinement sprints.
- Safe cleanup action:
  - Promote a single score-resolution helper and reuse it in profile formatting, confidence scoring, and any other readout layer.
  - Add a small regression test proving score formatting respects `intentAdjustedScore` and `rrfScore`.
- Removal safety: High once the consumer types are normalized.

## Lower-Signal Debt Worth A Separate Sweep
- `.opencode/skill/system-spec-kit/mcp_server/tests/sparse-first-graph.vitest.ts:1-31` is a fully skipped spec-ahead suite. If the sparse-first policy is still planned, either export the needed helpers and enable the tests or delete the file until implementation resumes.
- `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts:16-29` still carries a stale TODO and old size commentary for `memory-save`; this is doc/test debt rather than dead runtime code.

## Recommended Cleanup Order
1. Delete the dead eager-warmup path and legacy flag references.
2. Trim unused exports from `tools/types.ts`, `handlers/index.ts`, and the two debug helpers.
3. Rename the shared-memory suite to a normal Vitest filename and remove the shim.
4. Unify score-resolution helpers to one canonical implementation.
5. Decide whether the skipped sparse-first suite is roadmap scaffolding or dead test baggage, then either enable or remove it.

## Confidence
High. Every primary finding above is backed by direct code inspection plus project-wide usage searches; the only medium-risk part is whether some unused exports are intentionally preserved for external consumers outside this repo.

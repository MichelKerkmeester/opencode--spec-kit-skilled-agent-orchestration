# Iteration 017 — D2: Module dependency graph health

## Focus
I mapped the internal dependency graph for `.opencode/skill/system-spec-kit/mcp_server/`, excluding tests and `dist/`, using `rg` import/require enumeration plus a resolved relative-import graph. The pass checked circular imports, dead exported symbols, direct 50+ dependent hot spots, and longest dependency-chain depth.

## Actions Taken
- Ran `rg -n "(^|[[:space:]])(import|export)[[:space:]].*from[[:space:]]+['\"]|require\\(['\"]"` over `mcp_server`, excluding tests and `dist`, to enumerate import/require evidence.
- Built a resolved graph over 529 non-test source files and 1,319 internal import edges, resolving `.js` import specifiers back to checked-in `.ts` sources.
- Verified both circular import candidates by reading `lib/session/session-snapshot.ts`, `hooks/memory-surface.ts`, `lib/graph/community-detection.ts`, `lib/graph/community-storage.ts`, and `lib/graph/community-summaries.ts`.
- Checked direct dependent counts; no non-test module reached 50 direct dependents. Highest direct dependents were `lib/search/search-flags.ts` at 45, `utils/index.ts` at 31, and `lib/search/vector-index.ts` at 27.
- Computed the longest acyclic dependency chain after collapsing cycles: 14 edges, starting at `handlers/memory-crud.ts:9` and ending at `skill_advisor/lib/metrics.ts` via `skill_advisor/lib/prompt-cache.ts:7`.
- Searched dead-export candidates with non-test `rg` checks for `getDetectedRuntime`, `buildAdvisorHookResultFromRecommendations`, and `normalizeAdapterOutput`.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-017-D2-01 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:9` | Runtime circular import: `session-snapshot.ts` imports `isSessionPrimed()` and `getLastActiveSessionId()` from `hooks/memory-surface.ts:132` and `hooks/memory-surface.ts:142`, while `memory-surface.ts:13` imports `buildStructuralBootstrapContract()` from `session-snapshot.ts:210`. `getSessionSnapshot()` then calls those hook functions at `session-snapshot.ts:136` and `session-snapshot.ts:178-179`, while `buildPrimePackage()` calls `buildStructuralBootstrapContract()` at `memory-surface.ts:476`. This is a value-level cycle, so initialization order can become fragile as either module grows top-level work. | Break the cycle by moving the priming accessors into a small `lib/session/session-priming-state.ts`, or by moving `buildStructuralBootstrapContract()` out of `session-snapshot.ts` into a hook-neutral bootstrap-contract module. |
| F-017-D2-02 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-summaries.ts:8` | Source graph cycle in community modules: `community-summaries.ts:8` imports `CommunityResult` from `community-detection.ts:10`, `community-detection.ts:8` imports runtime functions `getCommunities()` and `storeCommunities()` from `community-storage.ts:50` and `community-storage.ts:87`, and `community-storage.ts:7-8` imports types from both peer modules. The two back edges are type-only, so this is not currently a runtime loop, but it couples detection, storage, and summary types into one strongly connected component. | Extract shared types (`CommunityResult`, `CommunitySummary`, `StoredCommunity`) into `lib/graph/community-types.ts`; keep storage and summary modules depending inward on shared types, not on each other. |
| F-017-D2-03 | P2 | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:300` | Dead-export scan found exported non-test symbols with no non-test import/use in `mcp_server`: `getDetectedRuntime()` at `context-server.ts:300` and `buildAdvisorHookResultFromRecommendations()` at `skill_advisor/lib/skill-advisor-brief.ts:182`. The same scan found `normalizeAdapterOutput` at `skill_advisor/lib/normalize-adapter-output.ts:116`, but that one is explicitly marked `@deprecated`, so it looks like an intentional compatibility alias rather than removable dead code. | Remove or make private the two undocumented dead exports if no external API contract exists. If they are intentionally exported for external/tests-only use, add a short compatibility comment like the `normalizeAdapterOutput` alias uses. |

## Questions Answered
- Are there circular imports? Yes: two strongly connected components after excluding tests. One is value-level session/hook coupling; one is type-level community graph coupling.
- Are there dead exports? Yes, at least two non-test exported symbols have no non-test importer/use inside `mcp_server`; the broader export scan produced many public/type/test-only candidates, so only manually verified symbols are reported as findings.
- Are there hot-spot modules with 50+ dependents? No direct non-test import hot spots reached 50 dependents. The highest direct module was `lib/search/search-flags.ts` with 45.
- What is the longest dependency chain depth? 14 resolved internal import edges after collapsing cycles. Example start: `handlers/memory-crud.ts:9` imports `memory-crud-health.ts`; the chain proceeds through save/indexing/search graph lifecycle modules and ends at `skill_advisor/lib/prompt-cache.ts:7` importing `skill_advisor/lib/metrics.ts`.

## Questions Remaining
- Whether public CLI/plugin entrypoints outside `mcp_server` intentionally consume `getDetectedRuntime()` or `buildAdvisorHookResultFromRecommendations()` despite no checked-in non-test import evidence.
- Whether the import graph should treat `import type` edges as architectural coupling for CI enforcement, or only flag value-level cycles.
- Whether direct dependent count is the intended hot-spot metric; transitive dependency counts are much higher and could be useful for a separate blast-radius report.

## Next Focus
Follow-on work should add a lightweight dependency-health check that excludes tests consistently, reports value-level cycles separately from type-only cycles, and emits a top-N direct-dependent report before thresholds become regressions.

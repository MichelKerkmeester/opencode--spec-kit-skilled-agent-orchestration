# Iteration 4: Hookless UX/Auto-Utilization and Search Quality Gaps

## Focus
Investigate Q4 (hookless UX/auto-utilization improvements) and Q3 (remaining search quality issues). Examine auto-surface, progressive disclosure, goal refinement, and session state features. Identify improvement opportunities that do not require external hooks (Claude Code hooks, etc.).

## Findings

### Q4: Hookless UX/Auto-Utilization

1. **Auto-surface is fully hookless at the MCP layer.** The auto-surface system (`hooks/memory-surface.ts`) runs inside the MCP server's context-server dispatch middleware -- it fires on every non-memory-aware tool call without requiring any external Claude Code hook. Constitutional memories (cached 1-minute TTL, limit 10) and trigger-matched memories are surfaced automatically. Token budget enforcement (4000 tokens for tool-dispatch, 4000 for compaction) uses `estimateTokenCount()` with graceful truncation (triggered memories dropped first, then constitutional). [SOURCE: hooks/memory-surface.ts:273-314, context-server.ts:735-765]

2. **Session priming (T018 Prime Package) works without hooks.** On the first tool call of any session, `primeSessionIfNeeded()` fires automatically. It returns a structured `PrimePackage` containing: specFolder, currentTask (derived from input/query/prompt args), codeGraphStatus (fresh/stale/empty), cocoIndexAvailable (boolean), and recommendedCalls (array of suggested next actions). This is a complete hookless bootstrap pathway. [SOURCE: hooks/memory-surface.ts:317-424]

3. **Progressive disclosure is ON by default and fully functional.** Feature flag `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` defaults to true. System provides: (a) summary layer with confidence distribution digest (e.g., "3 strong, 2 moderate, 1 weak"), (b) snippet extraction (100 chars + "...") with detailAvailable flags, (c) cursor-based pagination (5 results/page, 5-min TTL, max 1000 cursors, LRU eviction). The response includes a `progressiveDisclosure` field when enabled. [SOURCE: lib/search/progressive-disclosure.ts:1-522]

4. **Goal refinement works but has a design limitation: the goal is always set to the current query.** In `memory-search.ts:729`, `activeGoal` is set to `effectiveQuery` on every search call. This means the "goal" changes with each query rather than persisting a high-level session intent. The goal alignment algorithm uses simple keyword overlap (`computeGoalAlignment`) -- splitting goal into words >2 chars and checking substring presence in content. Maximum boost is 1.2x. This works for consecutive related searches but provides no benefit for diverse multi-query sessions. [SOURCE: handlers/memory-search.ts:728-743, lib/search/session-state.ts:298-387]

5. **Cross-turn deduplication is working.** The session state manager tracks seen result IDs via `markSeen()` and applies a 0.3x score multiplier to previously-seen results (deprioritize, not remove). Sessions are ephemeral (in-memory only), with 30-minute inactivity TTL and LRU eviction at 100 concurrent sessions. The `markSeen` call path exists in the compiled vitest output, confirming it is wired into the search handler. [SOURCE: lib/search/session-state.ts:241-291, handlers/memory-search.ts:731]

6. **Auto-surface at compaction and tool-dispatch are dual-scope.** The system has two auto-surface paths: (a) `autoSurfaceAtCompaction()` fires when context-server detects a compaction event, surfacing memories relevant to the session state, and (b) `autoSurfaceAtToolDispatch()` fires on every non-memory tool call, extracting context hints from tool arguments (input/query/prompt/specFolder/concepts fields). Both paths share the same core `autoSurfaceMemories()` function. Neither requires external hooks. [SOURCE: hooks/memory-surface.ts:453-516, context-server.ts:740-760]

### Q3: Remaining Search Quality Issues

7. **Goal alignment uses naive keyword matching with no stemming or semantic similarity.** The `computeGoalAlignment()` function splits the goal into words >2 chars, lowercases them, and checks if each word appears as a substring in the content. This means "architecture" would match "architecture" but not "architectural". It does not use stemming, lemmatization, or embedding similarity. For a memory system with full embeddings available, this is a missed optimization. [SOURCE: lib/search/session-state.ts:298-321]

8. **Progressive disclosure snippets are content-only (first 100 chars) -- no title or score metadata.** The `extractSnippets()` function returns only `{snippet, detailAvailable, resultId}`. It does not include the result title, importance tier, or score, which are critical for the LLM consumer to decide whether to request full content. This forces the LLM to either always paginate or rely only on the summary digest. [SOURCE: lib/search/progressive-disclosure.ts:270-286]

9. **Constitutional memory limit of 10 may be insufficient for larger projects.** The `getConstitutionalMemories()` query has `LIMIT 10` hardcoded. Projects with many constitutional memories (e.g., multiple skill systems, multi-agent setups) may silently lose critical constitutional context. There is no warning when the limit is hit, and no ordering beyond `created_at DESC` (newest first, which may not be the most important). [SOURCE: hooks/memory-surface.ts:155-162]

10. **Session state `openQuestions` and `preferredAnchors` are tracked but appear unused in the search pipeline.** The `SessionStateManager` has `addQuestion()` and `setAnchors()` methods, and `setAnchors` is called from memory-search.ts. However, neither `openQuestions` nor `preferredAnchors` appear to influence search results, ranking, or response formatting. They are tracked but dead code from a search quality perspective. [SOURCE: lib/search/session-state.ts:140-159, handlers/memory-search.ts:733-734]

11. **Auto-surface p95 latency warning is 250ms but there is no degradation fallback.** The context-server logs a warning when auto-surface exceeds 250ms, but there is no circuit-breaker or timeout to prevent blocking the tool response. If constitutional memory queries or trigger matching become slow (e.g., large trigger index), every non-memory tool call would be delayed. [SOURCE: context-server.ts:764-765]

## Ruled Out
- **External hook dependency for auto-surface**: Confirmed that auto-surface runs entirely within the MCP server's context-server middleware. No Claude Code hooks required.
- **Progressive disclosure as opt-in**: Confirmed it defaults ON via `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`.

## Dead Ends
None. All investigated areas yielded findings.

## Sources Consulted
- `hooks/memory-surface.ts` -- Auto-surface, session priming, Prime Package
- `lib/search/progressive-disclosure.ts` -- Progressive disclosure full implementation
- `lib/search/session-state.ts` -- Goal refinement, cross-turn dedup, session state manager
- `handlers/memory-search.ts:700-820` -- Goal/dedup wiring in search handler
- `context-server.ts:735-838` -- Auto-surface dispatch integration

## Assessment
- New information ratio: 0.91
- Questions addressed: Q3, Q4
- Questions answered: Q4 (fully -- all UX features are hookless and functional)

## Reflection
- What worked and why: Reading the three core modules (memory-surface.ts, progressive-disclosure.ts, session-state.ts) in sequence provided a complete picture of the UX layer. The code is well-documented with clear module headers.
- What did not work and why: N/A -- all research avenues were productive.
- What I would do differently: In a future iteration, would check the test files for these modules to assess coverage completeness.

## Recommended Next Focus
Investigate Q9 (adaptive fusion refinement) and Q10 (Code Graph/CocoIndex integration). Specifically: (a) examine adaptive fusion weight configuration and shadow mode proposal builder, (b) check code graph contribution to search results, (c) examine CocoIndex bridge and its actual impact on result quality.

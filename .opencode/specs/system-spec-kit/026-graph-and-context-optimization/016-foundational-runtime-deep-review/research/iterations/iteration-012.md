# Iteration 12 — Domain 1: Silent Fail-Open Patterns (2/10)

## Investigation Thread
I re-checked the exact runtime slices requested for this domain after deduplicating against Iterations 003, 007, 008, and 011 plus the Phase 015 review. This pass only keeps fail-open branches that still looked novel: status surfaces that keep returning success-shaped payloads after autosave failure, query misconfiguration, candidate-window starvation, or partial enrichment loss. The previously documented `graph-metadata-parser.ts:223-255` legacy-fallback issue and the basic reconsolidation "all candidates filtered out" path were intentionally not repeated.

## Findings

### Finding R12-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Lines:** `85-105, 112-117, 313-317`
- **Severity:** P1
- **Description:** Trigger: autosave is enabled and `generate-context.js` is missing, times out, or exits non-zero. Caller perception: the stop hook finished normally with `autosaveMode: "enabled"`, so continuity autosave either ran or at least has a surfaced outcome. Reality: `runContextAutosave()` only logs warn-level failures and returns `void`, and `SessionStopProcessResult` has no autosave success/failure field, so the hook returns a success-shaped result with no machine-readable indication that continuity capture was dropped.
- **Evidence:** `runContextAutosave()` treats only `status === 0` as success and otherwise logs `Context auto-save failed` before returning with no propagated status [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:85-105`]. The exported result shape only includes `touchedPaths`, `parsedMessageCount`, `autosaveMode`, and `producerMetadataWritten`, so the final response cannot distinguish "autosave enabled" from "autosave succeeded" [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:112-117,313-317`]. Direct replay coverage keeps autosave disabled and only asserts the happy producer-metadata path, not any failed autosave reporting contract [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop-replay.vitest.ts:14-56`].
- **Downstream Impact:** Stop-hook callers and continuity monitors can treat a failed autosave as a normal completed stop event, leaving session summaries unsaved until a later manual recovery. The blast radius is the whole hook-based continuity lane for Claude sessions that rely on stop-hook autosave as their last write.

### Finding R12-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- **Lines:** `26-29, 441-549`
- **Severity:** P2
- **Description:** Trigger: a caller supplies any non-empty `edgeType`, including an unsupported or misspelled one. Caller perception: the graph query succeeded and legitimately found zero matching edges. Reality: the handler never validates `edgeType` against an allowed set; it uppercases the string and passes it straight into the DB query helpers, so an invalid edge type silently degrades into an `ok` response with an empty edge list.
- **Evidence:** `resolveRequestedEdgeType()` accepts any trimmed string and uppercases it without validation [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:26-29`]. The one-hop switch branches then call `queryEdgesFrom()` / `queryEdgesTo()` with that value and still return `status: "ok"` unless the operation itself is unknown [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:441-549`]. The direct handler tests only exercise valid explicit edge types (`imports`, `overrides`) and do not cover unsupported values [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-query-handler.vitest.ts:66-107`].
- **Downstream Impact:** Agents can misread a typo or stale edge-type contract as "no structural relationships exist," which can suppress dependency tracing, impact analysis, and graph-based debugging. The blast radius includes every caller that relies on empty edge arrays as authoritative absence instead of input validation failure.

### Finding R12-003
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- **Lines:** `283-294`
- **Severity:** P2
- **Description:** Trigger: the top vector-search window is dominated by out-of-scope rows, while an in-scope near-duplicate exists just below the hard-coded over-fetch horizon. Caller perception: governed reconsolidation found no eligible similar memories, so the normal create path is correct. Reality: candidate selection limits the raw vector search to `(opts.limit ?? 3) * 3` before governance filtering, so in-scope candidates can be silently starved out of consideration even though they exist.
- **Evidence:** `findSimilar` caps `vectorSearch()` at `(opts.limit ?? 3) * 3`, then applies `candidateMatchesRequestedScope(...)` and only afterwards slices to the requested limit [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:283-294`]. The dedicated regression test only locks in the simpler case where the fetched candidates are all cross-scope and the bridge quietly falls back to `earlyReturn === null`; it does not test whether lower-ranked in-scope candidates are lost below the capped pre-filter window [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:255-330`].
- **Downstream Impact:** Governed saves can accumulate duplicate or near-duplicate memories even when valid in-scope candidates exist, because the bridge reports an ordinary "no candidate" outcome instead of "candidate search window exhausted by out-of-scope rows." The blast radius is every save-time dedup/reconsolidation flow that depends on governed scope matching.

### Finding R12-004
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `96-105`
- **Severity:** P2
- **Description:** Trigger: causal-link enrichment runs, but one or more references are unresolved. Caller perception: causal-link enrichment succeeded because `enrichmentStatus.causalLinks` is marked `true` and the save response only exposes a normal causal-links summary. Reality: `post-insert.ts` flips the causal-links status to success before checking `unresolved.length`, so partial lineage loss is reduced to a log warning instead of a surfaced enrichment gap.
- **Evidence:** After `processCausalLinks(...)` returns, `post-insert.ts` immediately sets `enrichmentStatus.causalLinks = true` and then merely warns if unresolved references remain [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:96-105`]. The causal-links helper explicitly returns unresolved references in normal, non-throwing flows [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-helpers.vitest.ts:680-710`]. The response builder only emits a generic partial-enrichment warning when some enrichment boolean is `false`, so unresolved causal refs stay below that warning threshold [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:315-321`].
- **Downstream Impact:** Save callers can believe packet lineage and causal graph edges were fully applied when some references were actually dropped. The blast radius is every consumer that trusts save-time causal enrichment to keep dependency and decision graphs complete.

### Finding R12-005
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `159-173`
- **Severity:** P2
- **Description:** Trigger: entity linking is skipped by the density guard. Caller perception: entity linking completed, because the step reports success and no partial-enrichment warning is emitted. Reality: `runEntityLinkingForMemory()` can explicitly return `skippedByDensityGuard === true` with zero links created, but `post-insert.ts` still sets `enrichmentStatus.entityLinking = true`, collapsing a deliberate "did not run" outcome into success.
- **Evidence:** The entity-linking branch logs the density-guard skip and then unconditionally sets `enrichmentStatus.entityLinking = true` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:159-173`]. The linker test suite proves that density-guard skips are a first-class helper outcome with `linksCreated === 0` and `skippedByDensityGuard === true` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/entity-linker.vitest.ts:520-545`]. As with causal links, the response builder only surfaces partial enrichment when a boolean remains `false` [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:315-321`].
- **Downstream Impact:** Cross-document entity edges can be absent while save responses still present entity linking as completed, which obscures graph sparsity and weakens follow-on search or relationship analysis. The blast radius is the save-time graph/linking freshness contract for dense specs and dense memory neighborhoods.

## Novel Insights
- The most important new pattern was **status erasure at the response boundary**, not just low-level warning-only handling: `session-stop.ts` and `post-insert.ts` both have machine-readable result objects, but those objects still flatten failed, partial, or skipped work into ordinary success-shaped outcomes.
- `reconsolidation-bridge.ts` has a second silent-degrade mode beyond Iteration 11's "all fetched candidates filtered out" case: even eligible governed candidates can be missed when the pre-filter search window is too small.
- Rechecking `graph-metadata-parser.ts:223-255` confirmed that the requested slice still only yielded the already-documented R11-002 legacy-fallback problem; this iteration did not find a distinct new fail-open path there worth repeating.

## Next Investigation Angle
Follow these degraded contracts into their immediate consumers: Claude continuity readers that trust `autosaveMode`, save-response consumers that trust `postInsertEnrichment`, and graph-query callers that treat empty result sets as authoritative. The next pass should map which higher-level APIs preserve these ambiguity signals and which ones erase them completely.

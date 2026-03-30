# Iteration 053: Code Graph for Session Working Set Tracking

## Focus

Determine how the planned code graph should preserve an AI session's structural working set across compaction, using the current retrieval session state, session boost pipeline, and prior compaction synthesis as the baseline.

## Findings

1. Our current session tracking is split across two mechanisms, and neither one tracks code files or symbols directly.

   `session-state.ts` is an in-memory retrieval-session manager. It stores `sessionId`, `activeGoal`, `seenResultIds`, `openQuestions`, `preferredAnchors`, `createdAt`, and `updatedAt`; it is explicitly ephemeral, uses a 30-minute TTL, and evicts beyond 100 sessions. Its behaviors are also retrieval-oriented: `deduplicateResults()` deprioritizes already-seen result IDs, and `refineForGoal()` boosts result content aligned with the active goal. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:6-14`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:32-40`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:118-159`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:233-380`]

   The currently inspected production wiring updates `activeGoal` and `preferredAnchors` during `memory_search`, then applies `refineForGoal()`. In other words: what is live today is "query/result state", not "code artifact state". [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:690-705`]

   `session-boost.ts` is separate again. It reads persisted `working_memory` rows by `session_id` and `memory_id`, converts `attention_score` into a bounded score boost, and applies that boost during hybrid fusion. The underlying `working_memory` table stores memory-oriented metadata such as `attention_score`, `last_focused`, `focus_count`, `mention_count`, `source_tool`, and `source_call_id`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:73-109`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:129-203`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:45-71`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:381-499`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:736-748`]

   Conclusion: today we have session state for retrieval and attention state for memories, but no durable model of "files/symbols this coding session actually touched."

2. The code graph should enhance session tracking by turning touched artifacts into structural neighborhoods rather than raw file lists.

   Iteration 045 already established the right preservation unit: a ranked structural working set built from "what the AI touched", plus nearby dependencies and verification surfaces. That aligns with DR-010, which explicitly separates CocoIndex as the semantic layer from code graph as the structural layer: semantic seeds first, structural expansion second. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:9-15`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:17-26`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-105`]

   Concretely, the graph's job here is not broad code search. Its job is: given touched files or symbols, recover the directly adjacent implementation surface the model will probably need next, such as imports, exports, callers, callees, tests, and config/runtime wiring.

3. The structural definition of a working set should be: seeds plus their 1-hop structural neighbors.

   A useful v1 structural working set is:

   - Seed files: files read, written, diffed, mentioned explicitly, or surfaced in errors/tests during the active session.
   - Seed symbols: functions, classes, methods, constants, tests, or configs resolved from those touched files and references.
   - 1-hop neighbors: direct imports/exports, caller/callee links, defining file links, test links, and config/runtime links for the seed symbols/files.

   This matches iteration 045's description of preserving active files/symbols first, then dependency neighbors, then verification surface. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:17-26`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:181-188`]

   Structural formula:

   ```text
   working_set_v1 =
     seed_files
     union seed_symbols
     union one_hop(seed_symbols, edges = imports|exports|calls|defines|tested_by|configures)
     union owner_files(one_hop_symbols)
   ```

4. The working set should be computed from the union of touched artifacts, then expanded through the graph.

   The right seed set is broader than "edited symbols only". Iteration 045's recommended extractor already includes recently edited files, recent reads, explicit mentions, recent errors, and last test commands. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:187-204`]

   Recommended computation:

   1. Collect session seeds from tool events and transcript facts:
      `read`, `write`, `edit`, `diff`, `reference`, `error`, `test`.
   2. Resolve any symbol-level seeds from edited regions or explicit symbol references.
   3. Expand only the edited or explicitly referenced symbols through the code graph.
   4. Keep read-only file seeds at file granularity unless symbol resolution is cheap and confident.
   5. Add verification companions: tests touching edited code, configs/runtime entrypoints directly connected to edited symbols.

   This keeps the working set grounded in actual session behavior while still giving the compaction layer structural adjacency.

5. The best maintenance strategy is hybrid: maintain seed events incrementally, compute graph expansion on demand at compaction time.

   Pure incremental expansion is too eager: it would require keeping graph-neighbor projections up to date on every read/edit/reference event, even though most sessions never compact. Pure on-demand reconstruction is too lossy unless we persist the underlying touch history. The better split is:

   - Incrementally append or upsert lightweight access events during the session.
   - Compute the expanded, ranked structural neighborhood only when compaction or resume actually needs it.

   This recommendation also fits the current architecture. `context-server.ts` already recognizes compaction-lifecycle `memory_context(mode:"resume")` calls, and `autoSurfaceAtCompaction()` already expects a bounded session-context summary with a 4,000-token budget. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:328-356`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:286-316`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:58-74`]

   Conclusion: track seeds continuously, project structure lazily.

6. The working set should feed compaction as a ranked structural brief, not as raw graph output.

   Iteration 045 already answered the transport question: graph data should pass through a projection layer that emits a compact structural package for the compaction hook. The package should contain active symbols, top adjacent files, critical edges, relevant tests, and unresolved breakpoints. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:59-82`]

   That package slots into the existing compaction transport:

   ```text
   session access log
   -> seed extraction
   -> code graph expansion
   -> ranking
   -> compact structural brief
   -> PreCompact cache
   -> SessionStart(source=compact) reinjection
   ```

   This is consistent with DR-006: precompute before compaction, inject after compaction. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:58-67`]

7. The right default expansion radius is 1-hop, with tightly gated 2-hop fallback.

   For compaction, 1-hop is the right default because it preserves immediate implementation adjacency without exploding token cost. Iteration 045's v1 edge list already points to the highest-yield edge types: `imports`, `exports`, `calls`, `defines`, `tested_by`, and `configures`. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:181-205`]

   Recommended policy:

   - Default: 1-hop neighbors for edited or explicitly referenced symbols.
   - Optional 2-hop: only when the seed set is very small and the extra hop stays inside the same connected implementation slice.
   - Never blanket-expand 2-hop across all touched files in v1.

   In practice, the highest-value 2-hop cases are usually "edited symbol -> direct callee/import -> defining test or config". That is still a narrow path expansion, not a general neighborhood explosion.

8. Large working sets should be reduced by tiering, clustering, and budget-aware truncation, not by arbitrary file-count cuts.

   The existing `working_memory` table is a useful warning sign here: it is capped at 7 entries and optimized for memory attention, not for code working-set preservation. Reusing that exact capacity model would be too small for sessions that touch dozens of files. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:27-31`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:519-541`]

   Recommended reduction strategy when a session touches 50+ files:

   - Always keep all edited files and edited symbols.
   - Group the remainder by connected component or feature slice.
   - Prefer components with tests, runtime wiring, or explicit user mentions.
   - Within each component, keep the top-ranked symbols/files and collapse the rest into a one-line summary.
   - Drop 2-hop neighbors first, then low-frequency read-only leaves, then semantically weak neighbors.

   This preserves the "shape" of the current task rather than flattening everything into a long, low-signal list.

9. CocoIndex relevance scores should be used as a semantic boost on top of structural ranking, not as the primary definition of the working set.

   DR-010 is explicit: CocoIndex handles semantic code search; code graph handles structural relationships; the intended enrichment flow is CocoIndex seeds followed by code-graph structural expansion. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-105`]

   Iteration 045 proposed exactly the right composite score shape:

   ```text
   compaction_priority =
     access_weight
     + explicit_mention
     + graph_proximity
     + test_coupling
     + semantic_boost
   ```

   [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:190-205`]

   Recommendation: use CocoIndex only after structural expansion, to rerank within the candidate neighborhood. "Structurally adjacent and semantically relevant" should rank highest; "structurally adjacent but semantically cold" should still beat "semantically similar but structurally distant" for compaction continuity.

10. The working set should carry rich session metadata so compaction can explain why each artifact matters.

   Minimum metadata for each working-set item:

   - `filePath`
   - `symbolId` and `symbolName` when known
   - `symbolKind` (`function`, `class`, `method`, `test`, `config`, etc.)
   - `accessTypes` (`read`, `write`, `reference`, `error`, `test`)
   - `firstTouchedAt` and `lastTouchedAt`
   - `touchCount`
   - `sourceTool` / `sourceCallId` when available
   - `sessionRole` (`seed`, `neighbor`, `test`, `config`, `entrypoint`)
   - `hopDistance`
   - `structuralEdges` summary (`imports`, `called_by`, `calls`, `tested_by`, `configures`)
   - `semanticScore` or `semanticBoost` when CocoIndex is applied
   - `compactionPriority`

   The rationale comes from the current memory attention schema and the compaction architecture: our current persisted session metadata already tracks timestamps, counts, and provenance for memory items, and the compaction path already expects a budgeted, human-readable result rather than opaque IDs. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:45-59`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:75-99`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:193-205`]

## Evidence

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:6-14`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:32-40`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:118-159`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts:233-380`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:690-705`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:73-109`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts:129-203`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:736-748`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:27-31`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:45-99`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:381-541`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:328-356`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:286-316`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:58-67`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-105`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:9-15`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:17-26`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:59-82`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-209`

## New Information Ratio (0.0-1.0)

0.57

## Novelty Justification

Iteration 045 already established that compaction should preserve a ranked structural working set and that CocoIndex and code graph should remain complementary. The new contribution here is narrower and more implementation-facing: it maps that architecture onto the actual session mechanisms already in the repo. Specifically, this iteration distinguishes retrieval session state from persisted memory attention state, shows that neither currently captures code artifacts, defines the structural working set as seeds plus 1-hop neighbors, recommends a hybrid maintenance model (incremental seed logging plus on-demand graph expansion), and proposes the metadata and ranking policy needed to feed a compaction brief without overloading the existing `working_memory` system.

## Recommendations for Our Implementation

1. Add a dedicated code working-set tracker rather than overloading `session-state.ts` or `working_memory`.
2. Track session seeds incrementally on every file/symbol access event: `read`, `write`, `reference`, `error`, and `test`.
3. Resolve symbols for writes and explicit references first; keep passive reads at file level unless symbol resolution is cheap.
4. Expand through the code graph only at compaction or resume-precompute time, with 1-hop as the default radius.
5. Rank candidates with a composite score: edit strength, explicit mention, graph proximity, verification coupling, and CocoIndex semantic boost.
6. Emit a compact structural brief that explains why each retained artifact matters, then inject it through the existing compact lifecycle path.
7. Treat large sessions as graph clustering problems: preserve edited clusters fully and summarize low-signal peripheral clusters.
8. Keep CocoIndex and code graph separate by role: semantic candidate seeding vs structural neighborhood expansion.

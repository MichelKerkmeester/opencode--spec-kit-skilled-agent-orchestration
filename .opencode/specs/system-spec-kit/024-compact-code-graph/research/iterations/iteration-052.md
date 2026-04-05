# Iteration 052: Compaction Pipeline — 3-Source Merge Strategy

## Focus

Define the merge contract for the PreCompact compaction cache when three sources are combined under a 4,000-token ceiling:

1. Memory: constitutional memories plus triggered memories from the existing auto-surface hook
2. CocoIndex: semantic code neighbors of the active working set
3. Code Graph: structural neighbors such as imports, callers, tests, and config/runtime links

The goal is not just "retrieve from three places," but to decide retrieval order, fusion order, deduplication, ranking, freshness, multi-language behavior, and the exact payload shape that should be cached in PreCompact and injected by `SessionStart(source=compact)`.

## Findings

1. The optimal strategy is staged late fusion, not naive serial merge.

   The existing packet already points to a late-fusion architecture: keep structural, semantic, and session context separate, then merge in a compaction scorer/projection layer before caching and injection. The strongest evidence is the architecture synthesis from iteration 045 and the unified packet synthesis in `research.md`, both of which separate working-set extraction, graph expansion, semantic retrieval, and final projection. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:159-173`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:312-339`]

   Recommended retrieval order:

   - Stage 0: derive the active working set from transcript/tool state
   - Stage 1a: run Memory auto-surface immediately and pin it as a guaranteed source
   - Stage 1b: run CocoIndex over active symbols/files in parallel
   - Stage 2: expand Code Graph from active symbols plus top CocoIndex hits used as structural seeds
   - Stage 3: fuse all candidates with a shared scorer, then project into the compact payload

   This is stronger than `Memory -> Code Graph -> CocoIndex` because the packet already says `code_graph_context` should accept CocoIndex results as seeds for structural expansion, and the revised compaction pipeline explicitly lists semantic retrieval before structural expansion. At the same time, Memory should still start immediately because the current hook guarantees constitutional+triggered surfacing and already has compaction-specific budget enforcement. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/plan.md:104-106`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:500-512`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:188-223`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-316`]

   Inference from the sources: the best implementation is "Memory pinned in parallel, semantic seeds before structural expansion, merge last."

2. Conflict handling should merge entities, not duplicate blocks, and should preserve provenance from every source.

   If the same file or symbol appears in both CocoIndex and Code Graph, we should not print it twice in the final injected payload. Instead, the merge layer should produce one canonical candidate keyed by `symbolId` when available, or `filePath` as a fallback, with per-source provenance retained in the cached JSON. Code Graph should contribute structural rationale (`imported by`, `calls`, `tested_by`), while CocoIndex contributes semantic rationale (`matched active symbol`, `conceptual neighbor`). Iteration 044 strongly supports this because it requires stable node IDs, explicit file/range/signature metadata, and late fusion between memory and graph rather than store collapse. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:117-135`]

   Recommended conflict rule:

   - Same symbol from multiple sources: keep one symbol entry with merged reasons
   - Same file from multiple sources but different symbols: keep one file entry plus child symbol bullets
   - Same file with no reliable symbol identity: keep the richer source summary and append the secondary source as an attribution line

   Inference from the sources: deduplicating the display layer while retaining source provenance in cache is the only way to avoid wasting the 4,000-token budget on repeated file paths.

3. The cached payload should be structured JSON, but the injected payload should be structured markdown-like sections.

   The packet already distinguishes the cache artifact from the model-visible output. Iteration 025 is explicit that hook stdout should be a concise brief, not raw MCP JSON, and iteration 039 concludes that compact code context should be emitted as structured sections rather than as one undifferentiated blob. Iteration 045 then narrows the intended brief to compact markdown sections such as active goal, top files/symbols, pending verification, and likely next targets. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-025.md:15-25`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:173-187`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:255-286`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:193-199`]

   Recommended format split:

   - PreCompact cache file: JSON envelope with normalized candidates, scores, provenance, freshness, and rendered summary fragments
   - SessionStart injection: stable markdown-like sections rendered from that JSON

   Recommended injected section order:

   1. `State`
   2. `Next Steps`
   3. `Blockers`
   4. `Durable Rules` or `Critical Memory`
   5. `Active Files and Symbols`
   6. `Structural Neighbors`
   7. `Semantic Neighbors`
   8. `Verification Surface`
   9. `Freshness / Warnings`

4. Ranking should use a hard-priority layer for memory, then additive scoring for code candidates.

   The current memory surface logic already gives us the priority contract for durable memory: constitutional memories are always fetched, triggered memories are added next, and budget trimming removes triggered entries before constitutional entries. That means constitutional memory is not just "high score"; it is effectively pinned. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:159-185`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-016.md:64-71`]

   For non-memory candidates, the packet already proposes an additive relevance model and a relevance ordering: recency, explicit mention, graph proximity, verification coupling, and semantic similarity. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:332-339`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:190-199`]

   Recommended ranking model:

   - Band A: constitutional memories, always pinned unless the entire merge must hard-fail
   - Band B: triggered memories and session brief fields, strongly favored
   - Band C: code candidates ranked by additive score

   Proposed v1 code-candidate score:

   `final = 0.25 explicit_mention + 0.25 session_recency + 0.20 graph_proximity + 0.15 verification_coupling + 0.10 semantic_relevance + 0.05 multi_source_bonus`

   Then apply:

   - `freshness_factor`: `hot=1.0`, `warm=0.9`, `stale=0.75`
   - `budget_penalty` for verbose candidates that duplicate already-kept coverage

   This also matches the current budget contract: the dynamic token budget module only computes an advisory budget, so the compaction merger itself must own trimming and ordering. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:5-9`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:54-90`]

5. The merged payload should look like a compact recovery brief with explicit source-derived sections, not a source dump.

   A concrete v1 injected payload should look like this:

   ```md
   ## State
   Working on compact-context recovery for `024-compact-code-graph`.
   Active surfaces: `compact-inject.ts`, `session-prime.ts`, memory auto-surface hook, future `code_graph_context`.

   ## Next Steps
   1. Build the PreCompact fusion layer that merges Memory, CocoIndex, and Code Graph into one cache file.
   2. Rank merged candidates by recency, structural proximity, and verification coupling.
   3. Render a stable compact brief for `SessionStart(source=compact)`.

   ## Durable Rules
   - Constitutional memory: preserve existing auto-surface semantics; drop triggered items before constitutional items when over budget.
   - Hooks rule: PreCompact caches, SessionStart injects.

   ## Active Files and Symbols
   - `scripts/hooks/claude/compact-inject.ts`
     Why: PreCompact cache writer for compaction recovery.
   - `scripts/hooks/claude/session-prime.ts`
     Why: SessionStart compact injector.
   - `autoSurfaceAtCompaction(sessionContext)`
     Why: existing guaranteed memory surface path.

   ## Structural Neighbors
   - `context-server.ts`
     Relation: calls `autoSurfaceAtCompaction(...)` for `memory_context(mode="resume")`.
   - `memory-surface.ts`
     Relation: enforces 4,000-token compaction budget, trims triggered before constitutional.
   - `hook-session-start.vitest.ts`
     Relation: verification surface for compact injection behavior.

   ## Semantic Neighbors
   - `research.md` Part VI
     Match: "CocoIndex bridge", "semantic neighbors", "compaction pipeline".
   - `iteration-045.md`
     Match: "structural vs semantic vs session context", "working-set augmenter".

   ## Verification Surface
   - Pending: test merged payload truncation under 4,000 tokens.
   - Pending: confirm stale graph warning behavior when Code Graph is warm/stale.

   ## Freshness / Warnings
   - Memory: hot/warm, generated during compaction
   - CocoIndex: warm, semantic index timestamp 2026-03-30T...
   - Code Graph: stale=false, indexedAt=2026-03-30T...
   ```

   This shape is consistent with the packet's existing hook recommendations: concise brief, compact markdown, active files/symbols, structural edges, tests/status, and durable rules. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-025.md:21-25`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:159-173`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:193-205`]

6. Multi-language active symbols should be merged through a normalized edge vocabulary, but cross-language graph links must stay conservative.

   The current code-graph plan is already scoped to JS/TS, Python, and Shell with a standardized capture vocabulary, while CocoIndex already supports 28+ languages with function-level chunking. That means the right v1 contract is:

   - language-specific symbol extraction inside the graph
   - source-agnostic semantic retrieval from CocoIndex
   - normalized compaction edge kinds such as `imports`, `calls`, `tested_by`, and `configures`

   [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/plan.md:97-106`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:463-468`]

   Recommended policy for mixed-language working sets:

   - JS/TS <-> JS/TS: use symbol-level graph edges normally
   - Python <-> Python: use symbol/file edges normally
   - Shell: prefer file-level and command-surface edges unless symbol resolution is genuinely reliable
   - Cross-language relationships: use conservative file/package/workflow edges such as `invokes`, `configures`, or `validates`; do not invent symbol-level call chains unless the parser can prove them

   Inference from the sources: CocoIndex should do more of the cross-language conceptual bridging, while Code Graph should stay conservative and structural.

7. The merge should happen in PreCompact, not be split across PreCompact and SessionStart, except for fallback repair.

   The packet's architecture decision is already explicit: PreCompact computes and caches, `SessionStart(source=compact)` injects. Splitting CocoIndex into SessionStart would reintroduce variable latency and drift at exactly the point where the packet wants deterministic post-compaction recovery. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:58-74`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:170-173`]

   Recommended execution policy:

   - PreCompact: compute all three sources, deduplicate, rank, render, cache
   - SessionStart(compact): inject cached rendered brief only
   - SessionStart fallback: if cache missing, corrupt, or clearly expired, degrade to `memory_context({ mode: "resume", profile: "resume" })` plus auto-surface rather than rerunning the full 3-source merge in the foreground

   This also matches iteration 045's explicit fallback recommendation when graph data is missing or stale. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:201-205`]

8. Deduplication should be entity-level first, file-level second, never section-level only.

   File-level dedup alone is too coarse because the same file can matter for very different reasons. A file might appear from CocoIndex because one function semantically matches the task, while the Code Graph points to a separate caller or test symbol in the same file. Because Code Graph is designed around stable node IDs and CocoIndex works at function-level chunking, the natural dedup key is the symbol when available. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:119-123`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:463-466`]

   Recommended two-pass dedup:

   - Pass 1: symbol-level merge on `symbolId` or `(filePath, signature/name, language)`
   - Pass 2: file-level consolidation for leftover file-only candidates
   - Pass 3: render-time suppression so the same file path is not repeated across sections unless the reason materially changes

   Recommended "richer version" rule:

   - prefer the entry with both structural and semantic rationale
   - otherwise prefer the structurally closer entry
   - otherwise prefer the semantically stronger entry
   - always preserve provenance in cache

9. Freshness should be explicit per source, and Memory is not literally "always fresh."

   The user premise is directionally right but slightly too strong. In the current implementation, triggered memories are matched live from the compaction context, but constitutional memories are cached for 60 seconds at module scope. So Memory is the freshest source operationally, but not a literal zero-cache source. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:49-55`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:79-118`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:196-223`]

   For Code Graph, the packet already recommends a hybrid freshness model and explicit freshness metadata (`hot`, `warm`, `stale`, partial-state warnings). [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:248-263`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:42-50`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:75-80`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:266-277`]

   Recommended freshness policy:

   - Memory: `hot` if generated in current PreCompact run; `warm` if constitutional cache reused within TTL
   - CocoIndex: `warm` by default unless the index exposes a fresher status API later
   - Code Graph: `hot|warm|stale` with `indexedAt`, `partial`, and `warnings[]`
   - Overall merged payload: include the worst-source freshness plus per-source details

   Recommended behavior:

   - never silently drop stale graph/semantic context if it still explains the working set
   - prefer stale-but-known-good with warnings over blocking compaction
   - if stale data would mislead the model, omit that section and state why

10. The minimum viable merge is fixed-order concatenation with section headers, but it should be treated as a fallback, not the target design.

   If we need a v0 path quickly, the minimum viable implementation is:

   - trim each source independently to a micro-budget
   - concatenate in fixed section order
   - render with explicit headers
   - stop once the total estimated token count reaches the compaction budget

   This is consistent with the packet's structured-output guidance and the existing hook guidance to emit concise sections rather than raw JSON. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-025.md:21-25`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:173-187`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:281-286`]

   Recommended fixed-order fallback:

   1. `State / Next / Blockers`
   2. `Critical Memory`
   3. `Structural Neighbors`
   4. `Semantic Neighbors`
   5. `Verification Surface`
   6. `Freshness / Warnings`

   But this should remain a fallback mode only. The full implementation should add entity-level deduplication, multi-source provenance, additive ranking, and freshness-aware trimming.

## Evidence

- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:49-55`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:79-118`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-223`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-316`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:5-9`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:38-48`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/dynamic-token-budget.ts:54-90`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-399`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/decision-record.md:58-74`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/plan.md:97-106`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:248-263`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:300-339`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:463-468`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/research.md:500-512`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-016.md:64-71`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-025.md:15-25`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:173-187`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:255-286`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:42-50`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:75-80`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:117-140`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:266-277`
- `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:159-205`

## New Information Ratio (0.0-1.0)

0.61

## Novelty Justification

Earlier iterations already established the main ingredients independently:

- Memory auto-surface and its truncation behavior
- code graph as structural working-set augmentation
- CocoIndex as the semantic layer
- PreCompact cache plus SessionStart inject as the transport model

What was still missing was the actual merge contract. This iteration adds that missing implementation layer:

- retrieval order versus final section order
- pinned-memory plus additive candidate ranking
- entity-level deduplication with provenance retention
- separate cache JSON versus injected markdown rendering
- freshness policy across the three sources
- a concrete fallback definition for the "just concatenate with headers" version

That is meaningfully new because it turns prior architectural direction into a buildable fusion design rather than another high-level endorsement of "hybrid context."

## Recommendations for Our Implementation

1. Build a dedicated `mergeCompactContext()` layer in PreCompact that accepts:
   - `memory`
   - `cocoindex`
   - `codeGraph`
   - `sessionBrief`
   - `budget`

2. Keep two representations:
   - canonical cache JSON with scores, provenance, and freshness
   - rendered compact brief for `SessionStart(source=compact)`

3. Pin constitutional memory first, then triggered memory/session brief, then rank code candidates with the additive formula from Finding 4.

4. Use symbol-first deduplication. Fall back to file-level merge only when symbol identity is missing or unreliable.

5. Make Code Graph expansion depend on both active symbols and top CocoIndex hits, not just active files.

6. Add explicit freshness metadata per source and do not silently pretend all three sources are equally current.

7. Keep SessionStart fast and deterministic: read cache, render, inject. Only use foreground retrieval as an error-path fallback.

8. If implementation needs a fast first milestone, ship the fixed-section concatenation fallback first, but keep the cache schema compatible with later entity-level fusion so v0 does not become a dead end.

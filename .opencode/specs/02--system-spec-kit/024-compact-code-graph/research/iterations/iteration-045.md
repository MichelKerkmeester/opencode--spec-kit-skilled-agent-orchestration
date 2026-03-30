# Iteration 045: Code Graph for Context Compaction — Architecture Synthesis

## Focus

Synthesize the prior packet research on hooks, resume flows, tree-sitter, repo maps, and hybrid retrieval into one answer to the core question: how should structural code understanding improve AI session continuity when context is compacted?

## Findings

1. A code graph can improve context compaction by turning "what the AI touched" into a ranked structural working set instead of a flat text summary.

   The current packet already proves that our compaction path needs a concise, budgeted payload rather than raw search output: `context-server.ts` treats `memory_context(mode:"resume")` as a compaction lifecycle call, routes it through `autoSurfaceAtCompaction()`, and stores surfaced context in response metadata before budget enforcement. `autoSurfaceAtCompaction()` itself is already a bounded preservation hook with a dedicated 4,000-token budget. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-399`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:52-55`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:283-317`]

   A code graph fits this need because it can compress many lines of code into a smaller structure: "active symbol `X` in file `A` depends on symbol `Y` in file `B`; failing test `T` exercises both." That is exactly the kind of high-value information that survives compaction better than raw file snippets. Prior packet research on aider shows the same pattern: a repository map is useful because it preserves important classes, functions, signatures, and dependency-ranked files while staying inside a token budget. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md`] [SOURCE: https://aider.chat/docs/repomap.html]

   Inference from the sources: for compaction, the graph's job is not "answer every structural query." Its job is to project the current session into a compact structural brief that preserves topology, ownership, and likely next navigation steps.

2. After compaction, the most important code context to preserve is the active working set, not the whole repository.

   The working set should be preserved in this order:
   1. Active files and symbols: files edited, read repeatedly, or explicitly mentioned by the user.
   2. Dependency neighbors: imports, exported APIs, callers, callees, parent classes, and config files required to reason about the active symbols.
   3. Verification surface: failing tests, test files covering edited code, commands already run, and observed errors.
   4. Session intent anchors: current task, blockers, next step, and any design choice already made.
   5. Stable cross-session rules: constitutional memory, project conventions, and spec-packet state.

   This ordering aligns with both our own resume research and external tool patterns. The packet already shows that compact and resume flows need brief state, next steps, and blockers, not just search results. Cursor's public docs also emphasize preserving recent changes, repository-scoped memories, and indexed codebase context; Cody emphasizes repository/file context plus explicit `@` mentions of files and symbols; aider emphasizes the most relevant ranked files and definitions rather than the whole repo. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:20-25`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:45-53`] [SOURCE: https://docs.cursor.com/en/context/codebase-indexing] [SOURCE: https://docs.cursor.com/context/%40-symbols/%40-recent-changes] [SOURCE: https://docs.cursor.com/en/context/memories] [SOURCE: https://sourcegraph.com/docs/cody/clients/cody-with-sourcegraph] [SOURCE: https://aider.chat/docs/repomap.html]

3. Structural code understanding helps prioritize what to keep after compaction because it answers "what is adjacent to the current work?" better than semantic search alone.

   Semantic retrieval is strong at "find code related to this concept." Structural retrieval is stronger at "what must I keep so the model can continue this exact implementation thread?" The packet's own search internals already separate these concerns: the current `graph` channel is a causal-memory graph over memories, not a code-structure graph, while CocoIndex is a chunk-embedding semantic channel. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23-72`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:1-220`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md`]

   A code graph adds ranking signals that semantic search usually misses:
   - Direct import/export relationships
   - Caller/callee proximity
   - Shared test coverage
   - Shared config/runtime wiring
   - Symbol centrality inside the local subgraph
   - Distance from recently edited nodes

   Inference from the sources: structural ranking should sit between transcript recency and semantic similarity. If the AI just edited `session-prime.ts`, then the import chain, hook registration file, and tests asserting compact/resume behavior are more preservation-worthy than a semantically similar but structurally distant file.

4. Structural context, semantic context, and session context are separate context types and should stay separate in storage and scoring.

   Proposed definitions:

   - Structural context:
     Facts about code topology. Files, symbols, imports, exports, callers, callees, inheritance, test-to-code links, config-to-runtime links, and ranked graph neighborhoods.

   - Semantic context:
     Conceptual similarity and natural-language relevance. "authentication retry flow", "context compaction", "resume brief", "how does startup recovery work?" This is where CocoIndex-style embeddings and memory semantic search shine.

   - Session context:
     The ephemeral state of the current run. User goal, files touched, tools used, commands executed, failures observed, hypotheses formed, next step, blockers, and decisions made this session.

   Cursor's docs split context into intent and state; that maps cleanly to our model if we treat session context as the active state layer and structural plus semantic context as retrieval layers that support it. Cursor memories and project rules then look like durable session-derived context, while codebase indexing looks like semantic code context. [SOURCE: https://docs.cursor.com/en/guides/working-with-context] [SOURCE: https://docs.cursor.com/en/context/memories] [SOURCE: https://docs.cursor.com/context/rules] [SOURCE: https://docs.cursor.com/en/context/codebase-indexing]

   Recommendation: do not collapse these into one "context blob." Keep three separate stores or envelopes, then merge late during compaction.

5. A code graph channel should feed the compaction hook through a projection layer, not by dumping raw graph nodes into `PreCompact`.

   The corrected packet architecture already says `PreCompact` should precompute and cache, while `SessionStart(source=compact)` should inject the human-readable result. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:3-6`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md:17-31`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:58-74`] [SOURCE: https://code.claude.com/docs/en/hooks-guide]

   Therefore the compaction path should be:

   `session transcript + working-set tracker`
   -> `active files/symbols`
   -> `code graph expansion`
   -> `semantic + memory retrieval`
   -> `compaction scorer`
   -> `compact structural brief`
   -> cache on `PreCompact`
   -> inject on `SessionStart(source=compact)`

   The key design choice is that the graph channel should produce a compact "structural context package" such as:

   - active symbols
   - top adjacent files
   - critical edges and why they matter
   - relevant tests
   - unresolved breakpoints such as "edited implementation but not test/config"

   That package is the graph's compaction output. The graph itself remains an internal retrieval substrate.

6. Code graph data should materially improve recovery speed after compaction because it reduces re-discovery work.

   Without structural preservation, the model often has to spend early post-compaction turns re-finding the active file, re-discovering entry points, and re-linking implementation files to tests and configs. A structural context package short-circuits that by immediately restoring:
   - where the current work lives,
   - which nearby files are likely next,
   - which verification surfaces are still pending,
   - which symbol or dependency boundaries matter.

   This matches the explicit goal of Claude Code's compaction reinjection pattern and the repository-map pattern used by aider. Claude's docs recommend `SessionStart` with `compact` matching to re-inject critical context after compaction. aider's docs describe the repo map as giving the model enough understanding of the rest of the repo to continue work efficiently. [SOURCE: https://code.claude.com/docs/en/hooks-guide] [SOURCE: https://aider.chat/docs/repomap.html]

   Inference from the sources: the strongest recovery gain will likely come not from more text, but from fewer navigation turns after compaction.

7. The strongest signals for "currently relevant code" are recency, explicit mention, graph proximity, and verification coupling.

   Recommended v1 relevance signals, highest to lowest:

   1. Recently edited files and symbols
   2. Files explicitly named by the user or tool inputs
   3. Files repeatedly read in the last N turns
   4. Imports/exports directly connected to edited files
   5. Caller/callee neighbors of edited symbols
   6. Tests covering or naming the active files or symbols
   7. Files appearing in recent errors, stack traces, or failed commands
   8. Files in the same spec folder or command/runtime surface
   9. Recent git diff neighbors, PR history, or recent changes metadata
   10. High-centrality files inside the local subgraph

   External tools repeatedly converge on the same signal families:
   - Cursor exposes `@Recent Changes`, codebase indexing, and PR search.
   - Cody prioritizes current repository and current file, then lets users `@` mention files, symbols, directories, and repositories.
   - Continue exposes `@Codebase`, `@Repository Map`, `@Code`, and `@Git Diff` as separate context providers.
   - aider boosts graph ranking using current chat files and mentioned identifiers.
   [SOURCE: https://docs.cursor.com/context/%40-symbols/%40-recent-changes] [SOURCE: https://docs.cursor.com/en/context/codebase-indexing] [SOURCE: https://sourcegraph.com/docs/cody/clients/cody-with-sourcegraph] [SOURCE: https://docs.continue.dev/customize/custom-providers] [SOURCE: https://docs.continue.dev/customize/deep-dives/custom-providers] [SOURCE: https://aider.chat/docs/repomap.html]

   Recommendation: in v1, keep the scorer simple and additive. Use transcript recency + explicit mentions + graph distance + test coupling before attempting learned ranking.

8. Other tools already manage context windows with code awareness, but each emphasizes a different layer.

   - Claude Code:
     Lifecycle-aware transport. Its hook system explicitly supports re-injecting critical context after compaction via `SessionStart` with a `compact` matcher. This is the closest direct analogue to our hook architecture. [SOURCE: https://code.claude.com/docs/en/hooks-guide]

   - aider:
     Token-budgeted structural repo map. It sends a concise repository map with relevant files, definitions, signatures, and graph-ranked snippets instead of the entire repo. This is the clearest open-source model for compact structural summaries. [SOURCE: https://aider.chat/docs/repomap.html]

   - Cursor:
     Semantic codebase indexing plus session/history-aware signals. Cursor indexes files with embeddings, tracks recent changes, stores repo-scoped memories, and can pull historical PR context into the conversation. This is a strong example of combining semantic context, session memory, and code-history context. [SOURCE: https://docs.cursor.com/en/context/codebase-indexing] [SOURCE: https://docs.cursor.com/context/%40-symbols/%40-recent-changes] [SOURCE: https://docs.cursor.com/en/context/memories] [SOURCE: https://docs.cursor.com/context/rules]

   - Sourcegraph Cody:
     Search-first, repo-aware context selection. Cody defaults to current repository/file context and lets the user expand with `@` mentions for files, symbols, directories, repositories, and web URLs. This is strong at explicit context targeting and search-backed expansion. [SOURCE: https://sourcegraph.com/docs/cody/clients/cody-with-sourcegraph]

   - Continue:
     Composable context-provider architecture. Continue separates `@Codebase`, `@Repository Map`, `@Code`, and `@Git Diff`, which is strong evidence that structural summaries, semantic snippets, and diff/session state are best treated as distinct context providers. [SOURCE: https://docs.continue.dev/customize/custom-providers] [SOURCE: https://docs.continue.dev/customize/deep-dives/custom-providers] [SOURCE: https://docs.continue.dev/customize/model-roles/embeddings]

   Synthesis: no single tool is doing exactly our target architecture, but the winning pattern is consistent across them: combine a compact structural view, a semantic retrieval layer, and an explicit representation of the current working state.

9. The ideal architecture combines code graph, memory system, and compaction hooks as separate layers with late fusion.

   Recommended architecture:

   1. Session state tracker
      Input: transcript tail, recent tool calls, edited/read files, failures, git diff, spec folder, commands run.
      Output: active working set and session brief.

   2. Code graph index
      Input: tree-sitter extraction into file/symbol/edge tables.
      Output: structural neighbors, graph-ranked files/symbols, test links, config/runtime links.

   3. Semantic retrieval layer
      Input: current task wording and active symbols/files.
      Output: conceptually relevant code snippets and memories.

   4. Durable memory layer
      Input: constitutional memory, relevant packet memory, resume summaries, prior decisions.
      Output: cross-session non-code context.

   5. Compaction scorer and projection layer
      Input: outputs from 1-4.
      Output: token-budgeted compact package with:
      - state
      - next steps
      - blockers
      - active files/symbols
      - key structural edges
      - tests/commands/status
      - durable rules

   6. Hook transport
      `PreCompact`: compute and cache package.
      `SessionStart(source=compact)`: inject cached package.
      `SessionStart(source=resume)`: use `memory_context({ mode: "resume", profile: "resume" })` and optionally augment with graph-derived working-set reconstruction.

   This preserves the packet's existing decisions: hooks remain transport, `memory_context` remains the canonical resume primitive, and code graph stays a sibling retrieval channel rather than a replacement for semantic search. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md:72-77`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:16-36`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:48-74`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md`]

10. A practical v1 should add code graph to the existing compaction pipeline as a narrow working-set augmenter, not as a full graph product.

   Recommended v1 scope:

   - Add a lightweight code graph store:
     `code_files`, `code_symbols`, `code_edges`, and `code_test_links`

   - Start with only the edges that matter most for compaction:
     `imports`, `exports`, `calls`, `defines`, `tested_by`, `configures`

   - Build a working-set extractor from transcript/tool state:
     recently edited files, recent reads, explicit file mentions, recent errors, last test commands

   - Add a compaction ranker:
     `score = session_recency + explicit_mention + graph_proximity + test_coupling + semantic_boost`

   - Add a graph-to-brief formatter:
     produce a compact markdown block with:
     - active goal
     - top files/symbols
     - why each is relevant
     - pending verification
     - next likely navigation targets

   - Integrate into the existing hook path:
     `compact-precompute` computes the package and caches it
     `session-prime` injects it for `source=compact`
     if graph data is missing or stale, degrade to current `memory_context(... profile:"resume")` + auto-surface behavior

   - Defer these to v2:
     full cross-language graph completeness, learned ranking, UI graph inspection, graph-aware MCP query tools, incremental AST retention in memory, or replacing CocoIndex

   This v1 respects the packet's existing architecture and the deferred clean-room code-graph decision. It uses code graph specifically to improve compaction fidelity and recovery speed, not to broaden scope into a separate search product on day one. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:48-56`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-031.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md`]

## Evidence

- Live repo compaction path and budgets:
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`

- Packet architecture and prior synthesis:
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/001-precompact-hook/spec.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/002-session-start-hook/spec.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-031.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-033.md`

- External references used for the cross-tool comparison:
  - Anthropic Claude Code hooks guide: https://code.claude.com/docs/en/hooks-guide
  - aider repository map docs: https://aider.chat/docs/repomap.html
  - Cursor codebase indexing: https://docs.cursor.com/en/context/codebase-indexing
  - Cursor recent changes: https://docs.cursor.com/context/%40-symbols/%40-recent-changes
  - Cursor memories: https://docs.cursor.com/en/context/memories
  - Cursor rules: https://docs.cursor.com/context/rules
  - Sourcegraph Cody context selection: https://sourcegraph.com/docs/cody/clients/cody-with-sourcegraph
  - Continue context providers: https://docs.continue.dev/customize/custom-providers
  - Continue repository map provider: https://docs.continue.dev/customize/deep-dives/custom-providers
  - Continue embeddings role: https://docs.continue.dev/customize/model-roles/embeddings

## New Information Ratio (0.0-1.0)

0.63

## Novelty Justification

Earlier iterations established the individual pieces: Claude lifecycle hooks, resume formatting, tree-sitter viability, aider repo-map, and CocoIndex separation. This iteration adds the missing synthesis layer. The new value is the architecture answer to "how does code graph concretely improve compaction?" rather than "is code graph interesting in general?" Specifically, it defines:

- the active working set as the preservation unit,
- a three-way separation between structural, semantic, and session context,
- the graph-to-brief projection layer required for `PreCompact`,
- a concrete relevance signal hierarchy for "currently relevant code",
- and a narrow v1 that fits the existing packet instead of expanding into a separate graph product.

## Recommendations for Our Implementation

1. Treat code graph as a compaction-quality subsystem first, not a general search feature first.
2. Preserve the active working set, not the whole repository, after compaction.
3. Keep structural context, semantic context, and session context as separate channels with late fusion.
4. Add a code-graph projection layer that emits a compact structural brief rather than raw nodes and edges.
5. Score relevance using simple additive signals in v1: recent edits, explicit mentions, graph distance, and test coupling.
6. Reuse the existing hook transport design: `PreCompact` computes and caches, `SessionStart(source=compact)` injects.
7. Keep `memory_context({ mode: "resume", profile: "resume" })` as the canonical fallback when graph data is missing.
8. Start with a minimal graph schema and only the edge types that improve compaction decisions immediately.
9. Use aider-style token-budget discipline for structural summaries and Cursor-style recency/history signals for freshness.
10. Defer full graph-query tooling until the compaction working-set path is proven useful in real sessions.

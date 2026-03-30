# Iteration 051: Incremental Index Coordination — CocoIndex + Code Graph Sync

## Focus

Determine how our planned structural code graph index should coordinate with the already-deployed CocoIndex semantic index so both stay useful without creating a brittle shared-refresh system. This pass focuses on change detection, watcher strategy, freshness exposure, branch-switch behavior, rebuild cost, and the smallest safe MVP coordination model.

## Findings

1. CocoIndex should be treated as an independently managed semantic index whose freshness is refreshed through its own daemon and command surfaces, not as a watcher we control directly.

   The local CocoIndex docs are explicit about what is public: `ccc index` performs incremental updates on subsequent runs, `ccc search --refresh` forces a refresh before search, and the MCP `search` tool defaults `refresh_index` to `true`. The same docs also describe a daemon that auto-starts, continues background indexing after client disconnect, and serves search over IPC. What the docs do not document is a public "shared file watcher" contract, a Git-status-based detector, or a stable event stream we should subscribe to. That means the safest implementation assumption is: CocoIndex internally decides how to notice or reconcile file changes, while our integration should rely only on the supported refresh surfaces (`ccc index`, CLI `--refresh`, MCP `refresh_index`) and its reported status/freshness metadata. [SOURCE: `.opencode/skill/mcp-coco-index/references/tool_reference.md:80-104`] [SOURCE: `.opencode/skill/mcp-coco-index/references/tool_reference.md:203-247`] [SOURCE: `.opencode/skill/mcp-coco-index/SKILL.md:265-306`] [SOURCE: `.opencode/skill/mcp-coco-index/SKILL.md:372-377`]

   Inference: because the daemon exists and indexing can continue after client disconnect, CocoIndex likely has its own internal scheduling and refresh logic. But the packet evidence does not prove a repo-local file watcher API, so our design should not depend on one.

2. The code graph should detect file changes with a hybrid model: chokidar for live edits, content-hash comparison for skip logic, and Git-based reconciliation for startup and offline drift.

   The packet already converged on this design. The plan for the code graph MVP names "content hash + chokidar file watching" directly, while iteration 041 adds the missing operational detail: use `chokidar` for local development events, keep `git status --porcelain`-style reconciliation for startup/manual refresh, and use Tree-sitter `edit + reparse(oldTree) + changed_ranges()` to narrow the structural re-index work to impacted declarations and edges. This is stronger than raw `fs.watch`, which has well-documented platform caveats, and stronger than Git-only polling, which is not real-time. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:92-106`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:11-19`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:248-263`] [SOURCE: https://nodejs.org/api/fs.html] [SOURCE: https://github.com/paulmillr/chokidar] [SOURCE: https://git-scm.com/docs/git-status/2.40.0.html] [SOURCE: https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html]

3. The two systems should not share a watcher in the MVP; they should watch independently and coordinate at the freshness layer.

   Our packet already states that graph-specific incremental updates remain independent of CocoIndex, and the CocoIndex docs describe a daemonized background system with its own concurrency caveats around repeated `refresh_index=true` requests. A shared watcher would create coupling at the least stable seam: event delivery, debounce timing, error propagation, and branch-switch recovery. It also risks turning one indexer's outage into a shared outage. The cleaner design is: each index owns its own refresh cadence, but both publish comparable freshness records that a higher-level orchestration layer can inspect. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:472-487`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-105`] [SOURCE: `.opencode/skill/mcp-coco-index/SKILL.md:372-377`]

   Inference: a shared event bus may become worthwhile later, but only after both indexers have stable standalone behavior and we know coordination, not indexing itself, is the bottleneck.

4. Mixed freshness is normal, so the system must tolerate "semantic fresh / structural stale" and "structural fresh / semantic stale" without pretending both are equally current.

   The packet's API research already recommends that stale graph data should still be returned when useful, but with explicit freshness metadata and warnings, while repair happens in the background or on scoped demand. That same pattern should apply to the combined system. If CocoIndex is fresher than the graph, semantic recall can still seed candidate files while structural expansion is marked stale or partial. If the graph is fresher than CocoIndex, structural neighborhood answers can still be served, but semantic similarity should be marked stale and potentially trigger a CocoIndex refresh on the next semantic query. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:75-125`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:266-277`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:309-332`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:201-205`]

5. Freshness should be exposed to the AI as two per-index states plus one aggregate state, not as a single opaque "index is fresh" boolean.

   The code graph API design already proposes a `freshness` envelope with `state`, `indexedAt`, `stale`, and `partial`, and separately proposes a dedicated `code_graph_status` tool for freshness, coverage, errors, and active jobs. For dual-index coordination, that pattern should be generalized into:

   - `semanticFreshness`: CocoIndex state
   - `structuralFreshness`: code graph state
   - `combinedFreshness`: aggregate summary for the orchestration layer

   Each should include at least `state`, `indexedAt`, `stale`, `partial`, `jobState`, and `warnings[]`. Aggregate state should be derived, not stored as source of truth. Example states: `fresh`, `refreshing`, `stale`, `missing`, `partial`, `error`. This lets the AI choose whether to trust current results, ask for a scoped refresh, or proceed with explicit caveats. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:13-18`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:75-125`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:309-332`]

6. The right coordination strategy is loosely coupled coordination via shared freshness metadata and repair policy, not tight coupling through a shared watcher or atomic dual-index transaction.

   Our packet already frames CocoIndex and the code graph as complementary but independent systems: "what resembles what" versus "what connects to what." That separation argues against a tightly coupled event bus or a single transaction boundary. The graph research also converged on background-first indexing plus scoped repair when stale, which maps naturally to a coordination layer that compares timestamps, pending jobs, and stale flags before deciding whether to use cached results, request a scoped repair, or warn. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-105`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:246-263`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:266-277`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:209-209`]

   Recommended contract:

   - CocoIndex owns semantic indexing
   - code graph owns structural indexing
   - orchestration compares freshness and decides whether to trust, warn, or refresh
   - neither indexer blocks the other from making progress

7. Branch switches should be handled as warm-path reconciliation events for both systems, with full rebuild reserved for drift, corruption, or schema/model change.

   CocoIndex's own skill guidance says to suggest reindexing after branch switches, major refactors, or large merges. The code graph packet independently classifies branch switches, pulls/merges, dependency changes, and grammar/schema changes as broader async rebuild triggers rather than per-save hot-path events. That suggests the coordination rule: on branch switch, both systems mark their freshness as suspect, run reconciliation, and only escalate to full rebuild when the delta is large enough or the index format changed. For the code graph that means scanning changed/deleted/renamed files and using content hashes and invalidation classes; for CocoIndex it means invoking its normal incremental rebuild path rather than assuming a watcher remained valid across checkout. [SOURCE: `.opencode/skill/mcp-coco-index/SKILL.md:345-347`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:15-19`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:250-255`] [SOURCE: https://git-scm.com/docs/git-status/2.40.0.html]

8. Rebuild cost is asymmetric: CocoIndex is the more expensive index to refresh, while the code graph should be cheaper for scoped updates but still non-trivial for full-project invalidation.

   The CocoIndex docs say first indexing typically takes 1-5 minutes and later runs are incremental. Its pipeline includes scanning, chunk splitting, embedding generation, and vector storage, which is inherently heavier than syntax parsing alone and may also involve remote embedding APIs. By contrast, the code graph's hot path is expected to be "parse one file, extract local symbols/edges, update SQLite," and iteration 041 argues the parser itself is unlikely to be the dominant cost; downstream invalidation and dependency propagation matter more. Iteration 038 adds the strongest concrete Tree-sitter benchmark in the packet: parsing a 2,157-line Rust file in 6.48 ms, with incremental updates generally under 1 ms. That does not make the whole graph free, but it does support the cost ranking: full CocoIndex rebuild > full graph rebuild > graph scoped update. [SOURCE: `.opencode/skill/mcp-coco-index/references/tool_reference.md:80-104`] [SOURCE: `.opencode/skill/mcp-coco-index/SKILL.md:278-306`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:19-20`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:174-178`]

9. Coordination should be batched, but not atomically coupled: on file save, enqueue both refresh paths, let each finish on its own cadence, and update freshness state independently.

   The graph packet already rejects the idea that every query should synchronously trigger repo-wide refresh, and CocoIndex's own docs warn about concurrent `refresh_index=true` requests. Together those point away from a strict "update both indexes atomically before answering anything" design. The better model is:

   - on save/add/remove/rename: emit one logical "workspace changed" event
   - enqueue semantic refresh work for CocoIndex
   - enqueue structural refresh work for the code graph
   - let each worker debounce/coalesce independently
   - update dual freshness metadata as each completes

   If one finishes first, the AI sees partial freshness rather than waiting for artificial atomicity. [SOURCE: `.opencode/skill/mcp-coco-index/SKILL.md:372-377`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:42-50`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:266-277`]

10. The MVP coordination model should be fully independent refresh cycles with freshness metadata exposed everywhere; anything tighter is premature.

   This is the smallest design that aligns with the packet's current decisions. The research summary already says graph-specific incremental updates remain independent of CocoIndex. The code graph API work already insists on freshness metadata, stale-result warnings, and explicit maintenance surfaces. And the architectural synthesis already treats graph absence or staleness as a graceful degradation path, not a system-wide failure. So the MVP answer to this entire topic is:

   - independent CocoIndex refresh cycle
   - independent code graph refresh cycle
   - shared freshness vocabulary
   - orchestration layer that understands mixed freshness
   - graceful degradation instead of synchronized blocking

   That gives us the operational truth the AI actually needs without forcing us to solve cross-index distributed coordination in v1. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:472-487`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:13-18`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:75-125`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:201-205`]

## Evidence

- Local CocoIndex command and refresh behavior:
  - `.opencode/skill/mcp-coco-index/references/tool_reference.md:21-24`
  - `.opencode/skill/mcp-coco-index/references/tool_reference.md:80-104`
  - `.opencode/skill/mcp-coco-index/references/tool_reference.md:203-247`
  - `.opencode/skill/mcp-coco-index/SKILL.md:265-306`
  - `.opencode/skill/mcp-coco-index/SKILL.md:345-377`
- Local code graph architecture and coordination guidance:
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:92-106`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-118`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:246-263`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:459-487`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-038.md:174-178`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:9-19`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:42-50`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:13-18`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:75-125`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:156-171`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:212-213`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:266-277`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:309-332`
  - `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:201-205`
- External references:
  - Node `fs.watch` caveats: https://nodejs.org/api/fs.html
  - Chokidar watcher behavior: https://github.com/paulmillr/chokidar
  - Git status porcelain for reconciliation: https://git-scm.com/docs/git-status/2.40.0.html
  - Tree-sitter incremental parsing and changed ranges: https://tree-sitter.github.io/tree-sitter/using-parsers/3-advanced-parsing.html
  - LSP incremental change model: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/
  - Clangd dynamic + background index split: https://clangd.llvm.org/design/indexing
  - Rust-analyzer incremental architecture: https://rust-analyzer.github.io/book/contributing/architecture.html
  - Sourcegraph auto-indexing freshness patterns: https://sourcegraph.com/docs/code-navigation/auto-indexing

## New Information Ratio (0.0-1.0)

0.71

## Novelty Justification

Iteration 041 already answered how a code graph should stay fresh by itself. The new value here is the coordination layer: this pass separates "how the graph updates" from "how two different indexes should coexist" and makes the missing design decision explicit. The main new conclusion is that we should not invent a shared watcher or atomic cross-index pipeline in v1 because the evidence supports independent indexers, asymmetric rebuild costs, mixed-freshness handling, and orchestration through metadata rather than through shared mutation plumbing.

## Recommendations for Our Implementation

1. Keep CocoIndex and code graph refresh cycles fully independent in v1.
2. Add a shared freshness vocabulary used by both systems: `fresh`, `refreshing`, `stale`, `partial`, `missing`, `error`.
3. Expose `semanticFreshness`, `structuralFreshness`, and `combinedFreshness` on every graph-aware orchestration response.
4. Use `chokidar` plus content-hash guards plus Git reconciliation for the code graph; do not depend on CocoIndex internals for change detection.
5. On branch switch or large merge, mark both indexes suspect and enqueue reconciliation rather than forcing an unconditional full rebuild.
6. Let semantic and structural refresh jobs debounce and complete independently; never require atomic dual success before serving usable partial results.
7. Add a small coordinator utility that compares `indexedAt`, `stale`, `partial`, active job state, and last error from both systems and returns repair hints.
8. Prefer scoped graph repair first because it is cheaper; reserve heavy CocoIndex refreshes for semantic queries, major repo churn, or explicit repair requests.
9. Surface warnings when one lane is stale but the other is usable instead of silently mixing old and new evidence.
10. Revisit shared event plumbing only after both standalone indexers are proven stable and coordination overhead shows up in real usage.

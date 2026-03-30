# Iteration 050: Compact Repo Map Generation — Structural Graph + CocoIndex

## Focus

Determine how to generate compact, query-aware repository maps by combining two assets we now have: a structural code graph (tree-sitter + SQLite with nodes, edges, and files) and CocoIndex semantic search results. The goal is to move from "repo map as static outline" toward "repo map as a token-budgeted structural projection of the code most relevant to the current task." This iteration specifically answers how aider's repo-map works, how our typed graph improves on it, how CocoIndex should influence ranking, what output shape is best for LLMs, and what the right MVP is for `024-compact-code-graph`. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:155-246`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-105`] [SOURCE: https://aider.chat/docs/repomap.html] [SOURCE: https://aider.chat/2023/10/22/repomap.html]

## Findings

1. aider's repo-map pipeline is the correct baseline, but it should be treated as a projection algorithm, not as our storage model.

   The current upstream aider design is:
   1. collect active chat files, all other repo files, mentioned file names, and mentioned identifiers for the current turn;
   2. parse files with tree-sitter using per-language `*-tags.scm` queries;
   3. reduce captures into lightweight `def` and `ref` tags;
   4. build `defines`, `references`, and `definitions` lookup tables;
   5. construct a weighted file-to-file `MultiDiGraph` where edges mean "this file references an identifier defined in that file";
   6. run a PageRank-style ranking with personalization and heuristically weighted identifiers;
   7. redistribute rank back onto `(file, identifier)` pairs;
   8. fit the result to the active token budget with pruning/binary-search-style budget fitting;
   9. render the survivors as a text tree of file paths plus lines of interest and signatures.

   That is an excellent open-source recipe for "how to turn structural facts into a compact prompt artifact." It is not a full graph service: aider computes a fresh ranked text summary for prompt injection, whereas we should preserve the graph as first-class structured data and treat repo maps as one output mode. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`] [SOURCE: https://aider.chat/docs/repomap.html] [SOURCE: https://aider.chat/2023/10/22/repomap.html]

2. Our code graph improves on aider because we have exact typed relationships instead of inferred file-level identifier coupling.

   aider's graph is pragmatic but lossy: it infers structural importance from identifier definition/reference patterns and ultimately ranks files. Our planned schema stores explicit `code_files`, `code_nodes`, and `code_edges`, with edge kinds `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, and `REFERENCES`. That means we can rank at two levels:
   - node level: exact symbol, signature, export status, range, and parent/container;
   - file/package level: file centrality, package entry points, and cross-package boundaries.

   This is a material upgrade over aider in four ways:
   - we can distinguish edge semantics instead of treating all evidence as generic "reference";
   - we can operate on exact symbols instead of only file-level rankings;
   - we can answer directed graph queries like `calls_to`, `inherits_from`, and `implements`;
   - we can project the same graph into different formats: outline, repo map, adjacency brief, or debug neighborhood.

   In short: aider is "references imply structure"; our design is "structure is stored explicitly, then ranked." [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:169-244`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:92-106`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:95-105`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:20-48`]

3. CocoIndex relevance should act as a query-conditioned prior that seeds and boosts the structural ranking, not as a replacement for it.

   The strongest combined flow is:
   1. run CocoIndex on the current task/query to get the top semantic hits;
   2. map each hit span to the best overlapping structural node or file neighborhood;
   3. expand the graph outward by typed edges from those seeds;
   4. rerank the resulting subgraph using both semantic and structural signals;
   5. emit a token-budgeted repo map.

   CocoIndex is the right recall engine because it retrieves by meaning; the graph is the right precision engine because it knows exact topology. Earlier packet work already established that CocoIndex chunks are structure-aware but not symbol-identical, so the correct bridge is "semantic hit overlaps node(s)," not "semantic chunk is the node." Recommended v1 scoring order is:
   - explicit user mentions and active files/symbols,
   - CocoIndex hit score on overlapping nodes,
   - graph proximity to active/seed nodes,
   - typed-edge importance (`CALLS` and `IMPORTS` above weaker `REFERENCES`),
   - verification coupling (tests, errors, config/runtime links),
   - local centrality within the induced subgraph.

   Practical recommendation: use CocoIndex as a bounded boost, not the dominant score. A semantically similar but structurally distant file should not outrank a direct caller, imported module, or failing test neighbor of the active symbol. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:95-105`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:28-40`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:96-118`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:7-23`] [SOURCE: `.opencode/skill/mcp-coco-index/references/settings_reference.md:144-159`] [SOURCE: `.opencode/skill/mcp-coco-index/references/tool_reference.md:266-272`]

4. The optimal repo-map format for LLM consumption is compact, path-first, symbol-rich, and relevance-annotated, with structure preserved and prose used sparingly.

   The packet's earlier compact-representation research already converged on Tier A as "repository map: file paths + ranked symbols + signatures + imports" and on structured sections rather than one undifferentiated blob. The best repo-map format is therefore not a raw JSON edge dump and not a prose summary of the whole repository. It should be a compact structural view with four ingredients:
   - file or package path;
   - top symbols with signature/kind/export info;
   - one-hop structural hints when needed (`imports`, `called by`, `implements`, `entry point`);
   - short inclusion reason, ideally 3-8 words.

   Recommended Tier A text shape:

   ```text
   packages/memory/memory-context.ts
     - handleMemoryContext(args): Promise<MCPResponse) [function, seed]
       called by: context-server.ts
       uses: query-router.ts, profile-formatters.ts
       why: top semantic hit + direct caller

   packages/memory/query-router.ts
     - routeQuery(args): SearchPlan [function]
       imported by: handleMemoryContext
       why: imported dependency
   ```

   For tool surfaces, the same content should also exist as structured data with `nodes`, `edges`, `freshness`, and `warnings`, but the LLM-facing repo map should stay mostly path + symbol + minimal adjacency. Richer JSON is for machines and follow-up tools; the map itself should optimize scanability. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:198-217`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:12-19`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:114-137`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:62-125`] [SOURCE: https://aider.chat/docs/repomap.html]

5. Repo maps should be generated on demand from a precomputed structural index, not precomputed as static prompt artifacts.

   The right split is:
   - precompute and incrementally maintain the structural graph;
   - generate repo maps dynamically per query, task, or active working set.

   This preserves freshness, makes token budgeting query-specific, and allows CocoIndex to influence ranking in real time. A static precomputed repo map can still exist as a fallback project outline or cold-start aid, but it should not be the primary product because the whole point of combining graph + CocoIndex is task sensitivity. The graph index is the durable asset; the repo map is a just-in-time view over it. That mirrors the strongest part of aider's design while avoiding its limitation of collapsing structure too early. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:7-18`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:173-177`] [SOURCE: https://aider.chat/docs/repomap.html]

6. The right size for a repo map in our system is Tier A's 1K-4K token range, with 1.5K-2K as the default target and 4K as the hard ceiling for research/debug flows.

   The packet already defined Tier A as 1K-4K tokens, which is broader than aider's typical 1K budget but fits our three-tier model. That range is still correct after combining structural graph and CocoIndex because the added value is better ranking, not radically larger payloads. Recommended sizing policy:
   - 800-1200 tokens: quick orientation or single-package tasks;
   - 1500-2200 tokens: default dynamic repo map for implementation/debug;
   - 2500-4000 tokens: research/refactor views where a wider structural neighborhood matters.

   Budget should be spent roughly in this order:
   - 15-20% on path/package headers and entry points,
   - 55-65% on top symbols and adjacency hints,
   - 15-25% on verification surfaces and next likely navigation targets.

   If the working set exceeds budget, cut breadth before depth: keep fewer files, but preserve signatures and the strongest edges for the files that remain. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:198-217`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:37-45`] [SOURCE: https://aider.chat/docs/repomap.html]

7. For monorepos or large codebases, repo maps should be package-scoped first and only cross package boundaries when a strong structural or semantic signal justifies it.

   The API-design iteration already converged on explicit `workspaceRoot`, `projectId`, `packageId`, and `relativeFilePath`, plus package-aware entry points and cross-package dependency edges. That should directly shape repo-map generation:
   - start with the active package or package(s) containing the semantic seeds;
   - expand one hop within the package first;
   - cross package boundaries only for imports, entry points, or direct callers/callees above threshold;
   - emit package-local maps with a small "cross-package frontier" section rather than a monorepo-wide flat list.

   This avoids the classic monorepo failure mode where "important" utility packages crowd out the local task package. It also makes "entry points" mean "public surface of this package," which is what the model usually needs. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:281-307`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:221-246`] [SOURCE: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/]

8. The repo map should include structural signatures by default and CocoIndex-derived summaries only selectively.

   Signatures, symbol kinds, export status, and typed neighbors should remain the default Tier A payload because they are stable, cheap, and grounded in the structural index. CocoIndex-generated natural-language summaries are useful, but only when they clarify why a symbol matters or when the symbol name/signature is too opaque. Good candidates are:
   - top 1-3 semantic seed symbols;
   - unusually generic names (`run`, `handle`, `process`);
   - large module-level pseudo-nodes in Python/Shell;
   - ambiguous bridge/config files where structure alone is not self-explanatory.

   That means the map should not become a wall of summaries. Use structural signatures everywhere, and optionally add a terse "why this matters" note informed by CocoIndex relevance. This preserves scanability and avoids spending Tier A budget on prose that belongs in Tier B symbol summaries. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:202-217`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:24-60`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:7-23`] [SOURCE: `.opencode/skill/mcp-coco-index/references/settings_reference.md:144-159`]

9. Freshness should be maintained by incrementally updating the structural index and regenerating repo maps from fresh graph state when requested.

   The freshness model already researched for the graph fits repo maps directly:
   - hot path: per-file incremental updates on save with tree-sitter edit/reparse and targeted edge invalidation;
   - warm path: background catch-up on branch switch, pull, or dependency/config changes;
   - cold path: full rebuild on demand, corruption recovery, or grammar/schema change.

   Repo maps themselves do not need independent persistence beyond a short-lived cache keyed by query + working set + budget + freshness version. If the graph is fresh, the repo map is cheap to regenerate. If the graph is stale, the map should surface that explicitly in metadata or a warning block rather than pretending to be exact. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:248-260`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:9-18`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:35-50`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:117-125`]

10. The right MVP is a query-ranked dynamic repo map built from the precomputed structural graph, with static outlines only as fallback.

   Between the two candidate MVPs, dynamic wins. A static structural outline would prove the graph exists, but it would not prove the graph plus CocoIndex combination is better than either system alone. The smallest useful MVP is:
   - precompute `code_files`, `code_nodes`, `code_edges`;
   - accept task text plus optional active file/symbol seeds;
   - optionally query CocoIndex for semantic seeds;
   - map hits to nodes;
   - expand 1-2 hops across `CALLS`, `IMPORTS`, `EXTENDS`, `IMPLEMENTS`, and `CONTAINS`;
   - rank nodes/files with a simple additive scorer;
   - emit a Tier A repo map plus structured metadata.

   Keep a static package/file outline as a fallback when there is no query or when CocoIndex is unavailable, but the MVP should be query-ranked from day one. Otherwise we would be building only the "structural outline" half of the design and postponing the actual value of the hybrid. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:93-106`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:95-105`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:50-58`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-209`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:45-70`]

## Evidence (cite sources/URLs or file:line citations)

- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:9-50`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:9-18`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:20-48`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:62-125`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:281-307`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:28-40`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:96-118`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-209`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:7-23`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:45-70`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:155-246`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-118`
- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:92-106`
- `.opencode/skill/mcp-coco-index/references/settings_reference.md:144-159`
- `.opencode/skill/mcp-coco-index/references/tool_reference.md:266-272`
- https://aider.chat/docs/repomap.html
- https://aider.chat/2023/10/22/repomap.html
- https://github.com/Aider-AI/aider/blob/main/aider/repomap.py
- https://github.com/Aider-AI/aider/blob/main/aider/coders/base_coder.py
- https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/python-tags.scm
- https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/javascript-tags.scm
- https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/

## New Information Ratio (0.0-1.0)

0.61

## Novelty Justification

This iteration is not a first-discovery pass; it is a synthesis pass that turns several previously separate findings into one implementation-ready repo-map design. The net-new value is the integration logic: treating aider as the projection baseline, the structural graph as the storage/ranking substrate, CocoIndex as the semantic prior, and the repo map itself as a dynamic Tier A view rather than a static outline or raw graph dump. The strongest new conclusions are that query-ranked dynamic maps should be the MVP, CocoIndex summaries should be selective rather than default, package-scoped maps should be the monorepo default, and semantic hits should map to structural nodes via overlap rather than identity.

## Recommendations for Our Implementation

1. Build `repo_map_generate(query, seeds, budgetTokens, scope)` as a projection over `code_files`, `code_nodes`, and `code_edges`, not as a separate persistent store.

2. Use aider's ranking pipeline as the conceptual baseline, but replace its inferred file graph with our explicit typed-edge graph and exact symbol nodes.

3. Add a bridge layer from CocoIndex hit spans to structural nodes using overlap/enclosing-node resolution; do not store semantic chunks as graph nodes.

4. Start with a simple additive scorer:
   - active mention/working-set boost,
   - CocoIndex overlap boost,
   - typed graph proximity,
   - verification coupling,
   - local centrality.

5. Prefer edge types in this order for v1 repo-map expansion: `CALLS`, `IMPORTS`, `EXTENDS`/`IMPLEMENTS`, `CONTAINS`, then weaker `REFERENCES`.

6. Emit Tier A maps as path-first compact text with signatures and terse adjacency hints, while also returning structured `nodes`, `edges`, `freshness`, and `warnings` for tooling.

7. Default to 1.5K-2K tokens, allow up to 4K for research/debug, and prune breadth before removing symbol signatures.

8. Scope monorepo maps to `packageId` by default, with a small explicit cross-package frontier instead of a repository-wide flat ranking.

9. Cache the structural index aggressively, but cache generated repo maps only briefly and invalidate them whenever graph freshness version, budget, query, or working set changes.

10. Ship the MVP as a query-ranked dynamic map with static outline fallback. A static-only MVP would prove indexing but would not validate the structural-graph-plus-CocoIndex design that this packet is trying to establish.

exec
/bin/zsh -lc './.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/024-compact-code-graph --no-recursive' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
diff --git a/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-050.md b/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-050.md
new file mode 100644
index 0000000000000000000000000000000000000000..8cf0623c5588089438efbb56bfb9cba02593ebd3
--- /dev/null
+++ b/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-050.md
@@ -0,0 +1,206 @@
+# Iteration 050: Compact Repo Map Generation — Structural Graph + CocoIndex
+
+## Focus
+
+Determine how to generate compact, query-aware repository maps by combining two assets we now have: a structural code graph (tree-sitter + SQLite with nodes, edges, and files) and CocoIndex semantic search results. The goal is to move from "repo map as static outline" toward "repo map as a token-budgeted structural projection of the code most relevant to the current task." This iteration specifically answers how aider's repo-map works, how our typed graph improves on it, how CocoIndex should influence ranking, what output shape is best for LLMs, and what the right MVP is for `024-compact-code-graph`. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:155-246`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-105`] [SOURCE: https://aider.chat/docs/repomap.html] [SOURCE: https://aider.chat/2023/10/22/repomap.html]
+
+## Findings
+
+1. aider's repo-map pipeline is the correct baseline, but it should be treated as a projection algorithm, not as our storage model.
+
+   The current upstream aider design is:
+   1. collect active chat files, all other repo files, mentioned file names, and mentioned identifiers for the current turn;
+   2. parse files with tree-sitter using per-language `*-tags.scm` queries;
+   3. reduce captures into lightweight `def` and `ref` tags;
+   4. build `defines`, `references`, and `definitions` lookup tables;
+   5. construct a weighted file-to-file `MultiDiGraph` where edges mean "this file references an identifier defined in that file";
+   6. run a PageRank-style ranking with personalization and heuristically weighted identifiers;
+   7. redistribute rank back onto `(file, identifier)` pairs;
+   8. fit the result to the active token budget with pruning/binary-search-style budget fitting;
+   9. render the survivors as a text tree of file paths plus lines of interest and signatures.
+
+   That is an excellent open-source recipe for "how to turn structural facts into a compact prompt artifact." It is not a full graph service: aider computes a fresh ranked text summary for prompt injection, whereas we should preserve the graph as first-class structured data and treat repo maps as one output mode. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`] [SOURCE: https://aider.chat/docs/repomap.html] [SOURCE: https://aider.chat/2023/10/22/repomap.html]
+
+2. Our code graph improves on aider because we have exact typed relationships instead of inferred file-level identifier coupling.
+
+   aider's graph is pragmatic but lossy: it infers structural importance from identifier definition/reference patterns and ultimately ranks files. Our planned schema stores explicit `code_files`, `code_nodes`, and `code_edges`, with edge kinds `CONTAINS`, `CALLS`, `IMPORTS`, `EXPORTS`, `EXTENDS`, `IMPLEMENTS`, and `REFERENCES`. That means we can rank at two levels:
+   - node level: exact symbol, signature, export status, range, and parent/container;
+   - file/package level: file centrality, package entry points, and cross-package boundaries.
+
+   This is a material upgrade over aider in four ways:
+   - we can distinguish edge semantics instead of treating all evidence as generic "reference";
+   - we can operate on exact symbols instead of only file-level rankings;
+   - we can answer directed graph queries like `calls_to`, `inherits_from`, and `implements`;
+   - we can project the same graph into different formats: outline, repo map, adjacency brief, or debug neighborhood.
+
+   In short: aider is "references imply structure"; our design is "structure is stored explicitly, then ranked." [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:169-244`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:92-106`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:95-105`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:20-48`]
+
+3. CocoIndex relevance should act as a query-conditioned prior that seeds and boosts the structural ranking, not as a replacement for it.
+
+   The strongest combined flow is:
+   1. run CocoIndex on the current task/query to get the top semantic hits;
+   2. map each hit span to the best overlapping structural node or file neighborhood;
+   3. expand the graph outward by typed edges from those seeds;
+   4. rerank the resulting subgraph using both semantic and structural signals;
+   5. emit a token-budgeted repo map.
+
+   CocoIndex is the right recall engine because it retrieves by meaning; the graph is the right precision engine because it knows exact topology. Earlier packet work already established that CocoIndex chunks are structure-aware but not symbol-identical, so the correct bridge is "semantic hit overlaps node(s)," not "semantic chunk is the node." Recommended v1 scoring order is:
+   - explicit user mentions and active files/symbols,
+   - CocoIndex hit score on overlapping nodes,
+   - graph proximity to active/seed nodes,
+   - typed-edge importance (`CALLS` and `IMPORTS` above weaker `REFERENCES`),
+   - verification coupling (tests, errors, config/runtime links),
+   - local centrality within the induced subgraph.
+
+   Practical recommendation: use CocoIndex as a bounded boost, not the dominant score. A semantically similar but structurally distant file should not outrank a direct caller, imported module, or failing test neighbor of the active symbol. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:95-105`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:28-40`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:96-118`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:7-23`] [SOURCE: `.opencode/skill/mcp-coco-index/references/settings_reference.md:144-159`] [SOURCE: `.opencode/skill/mcp-coco-index/references/tool_reference.md:266-272`]
+
+4. The optimal repo-map format for LLM consumption is compact, path-first, symbol-rich, and relevance-annotated, with structure preserved and prose used sparingly.
+
+   The packet's earlier compact-representation research already converged on Tier A as "repository map: file paths + ranked symbols + signatures + imports" and on structured sections rather than one undifferentiated blob. The best repo-map format is therefore not a raw JSON edge dump and not a prose summary of the whole repository. It should be a compact structural view with four ingredients:
+   - file or package path;
+   - top symbols with signature/kind/export info;
+   - one-hop structural hints when needed (`imports`, `called by`, `implements`, `entry point`);
+   - short inclusion reason, ideally 3-8 words.
+
+   Recommended Tier A text shape:
+
+   ```text
+   packages/memory/memory-context.ts
+     - handleMemoryContext(args): Promise<MCPResponse) [function, seed]
+       called by: context-server.ts
+       uses: query-router.ts, profile-formatters.ts
+       why: top semantic hit + direct caller
+
+   packages/memory/query-router.ts
+     - routeQuery(args): SearchPlan [function]
+       imported by: handleMemoryContext
+       why: imported dependency
+   ```
+
+   For tool surfaces, the same content should also exist as structured data with `nodes`, `edges`, `freshness`, and `warnings`, but the LLM-facing repo map should stay mostly path + symbol + minimal adjacency. Richer JSON is for machines and follow-up tools; the map itself should optimize scanability. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:198-217`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:12-19`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:114-137`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:62-125`] [SOURCE: https://aider.chat/docs/repomap.html]
+
+5. Repo maps should be generated on demand from a precomputed structural index, not precomputed as static prompt artifacts.
+
+   The right split is:
+   - precompute and incrementally maintain the structural graph;
+   - generate repo maps dynamically per query, task, or active working set.
+
+   This preserves freshness, makes token budgeting query-specific, and allows CocoIndex to influence ranking in real time. A static precomputed repo map can still exist as a fallback project outline or cold-start aid, but it should not be the primary product because the whole point of combining graph + CocoIndex is task sensitivity. The graph index is the durable asset; the repo map is a just-in-time view over it. That mirrors the strongest part of aider's design while avoiding its limitation of collapsing structure too early. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:7-18`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:173-177`] [SOURCE: https://aider.chat/docs/repomap.html]
+
+6. The right size for a repo map in our system is Tier A's 1K-4K token range, with 1.5K-2K as the default target and 4K as the hard ceiling for research/debug flows.
+
+   The packet already defined Tier A as 1K-4K tokens, which is broader than aider's typical 1K budget but fits our three-tier model. That range is still correct after combining structural graph and CocoIndex because the added value is better ranking, not radically larger payloads. Recommended sizing policy:
+   - 800-1200 tokens: quick orientation or single-package tasks;
+   - 1500-2200 tokens: default dynamic repo map for implementation/debug;
+   - 2500-4000 tokens: research/refactor views where a wider structural neighborhood matters.
+
+   Budget should be spent roughly in this order:
+   - 15-20% on path/package headers and entry points,
+   - 55-65% on top symbols and adjacency hints,
+   - 15-25% on verification surfaces and next likely navigation targets.
+
+   If the working set exceeds budget, cut breadth before depth: keep fewer files, but preserve signatures and the strongest edges for the files that remain. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:198-217`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:37-45`] [SOURCE: https://aider.chat/docs/repomap.html]
+
+7. For monorepos or large codebases, repo maps should be package-scoped first and only cross package boundaries when a strong structural or semantic signal justifies it.
+
+   The API-design iteration already converged on explicit `workspaceRoot`, `projectId`, `packageId`, and `relativeFilePath`, plus package-aware entry points and cross-package dependency edges. That should directly shape repo-map generation:
+   - start with the active package or package(s) containing the semantic seeds;
+   - expand one hop within the package first;
+   - cross package boundaries only for imports, entry points, or direct callers/callees above threshold;
+   - emit package-local maps with a small "cross-package frontier" section rather than a monorepo-wide flat list.
+
+   This avoids the classic monorepo failure mode where "important" utility packages crowd out the local task package. It also makes "entry points" mean "public surface of this package," which is what the model usually needs. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:281-307`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:221-246`] [SOURCE: https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/]
+
+8. The repo map should include structural signatures by default and CocoIndex-derived summaries only selectively.
+
+   Signatures, symbol kinds, export status, and typed neighbors should remain the default Tier A payload because they are stable, cheap, and grounded in the structural index. CocoIndex-generated natural-language summaries are useful, but only when they clarify why a symbol matters or when the symbol name/signature is too opaque. Good candidates are:
+   - top 1-3 semantic seed symbols;
+   - unusually generic names (`run`, `handle`, `process`);
+   - large module-level pseudo-nodes in Python/Shell;
+   - ambiguous bridge/config files where structure alone is not self-explanatory.
+
+   That means the map should not become a wall of summaries. Use structural signatures everywhere, and optionally add a terse "why this matters" note informed by CocoIndex relevance. This preserves scanability and avoids spending Tier A budget on prose that belongs in Tier B symbol summaries. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:202-217`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md:24-60`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:7-23`] [SOURCE: `.opencode/skill/mcp-coco-index/references/settings_reference.md:144-159`]
+
+9. Freshness should be maintained by incrementally updating the structural index and regenerating repo maps from fresh graph state when requested.
+
+   The freshness model already researched for the graph fits repo maps directly:
+   - hot path: per-file incremental updates on save with tree-sitter edit/reparse and targeted edge invalidation;
+   - warm path: background catch-up on branch switch, pull, or dependency/config changes;
+   - cold path: full rebuild on demand, corruption recovery, or grammar/schema change.
+
+   Repo maps themselves do not need independent persistence beyond a short-lived cache keyed by query + working set + budget + freshness version. If the graph is fresh, the repo map is cheap to regenerate. If the graph is stale, the map should surface that explicitly in metadata or a warning block rather than pretending to be exact. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:248-260`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:9-18`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:35-50`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:117-125`]
+
+10. The right MVP is a query-ranked dynamic repo map built from the precomputed structural graph, with static outlines only as fallback.
+
+   Between the two candidate MVPs, dynamic wins. A static structural outline would prove the graph exists, but it would not prove the graph plus CocoIndex combination is better than either system alone. The smallest useful MVP is:
+   - precompute `code_files`, `code_nodes`, `code_edges`;
+   - accept task text plus optional active file/symbol seeds;
+   - optionally query CocoIndex for semantic seeds;
+   - map hits to nodes;
+   - expand 1-2 hops across `CALLS`, `IMPORTS`, `EXTENDS`, `IMPLEMENTS`, and `CONTAINS`;
+   - rank nodes/files with a simple additive scorer;
+   - emit a Tier A repo map plus structured metadata.
+
+   Keep a static package/file outline as a fallback when there is no query or when CocoIndex is unavailable, but the MVP should be query-ranked from day one. Otherwise we would be building only the "structural outline" half of the design and postponing the actual value of the hybrid. [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:93-106`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:95-105`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:50-58`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-209`] [SOURCE: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:45-70`]
+
+## Evidence (cite sources/URLs or file:line citations)
+
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-032.md:9-45`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-039.md`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-041.md:9-50`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:9-18`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:20-48`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:62-125`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:281-307`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:28-40`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:96-118`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:177-209`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:7-23`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/iterations/iteration-047.md:45-70`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/research/research.md:155-246`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:94-118`
+- `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:92-106`
+- `.opencode/skill/mcp-coco-index/references/settings_reference.md:144-159`
+- `.opencode/skill/mcp-coco-index/references/tool_reference.md:266-272`
+- https://aider.chat/docs/repomap.html
+- https://aider.chat/2023/10/22/repomap.html
+- https://github.com/Aider-AI/aider/blob/main/aider/repomap.py
+- https://github.com/Aider-AI/aider/blob/main/aider/coders/base_coder.py
+- https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/python-tags.scm
+- https://github.com/Aider-AI/aider/blob/main/aider/queries/tree-sitter-language-pack/javascript-tags.scm
+- https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/
+
+## New Information Ratio (0.0-1.0)
+
+0.61
+
+## Novelty Justification
+
+This iteration is not a first-discovery pass; it is a synthesis pass that turns several previously separate findings into one implementation-ready repo-map design. The net-new value is the integration logic: treating aider as the projection baseline, the structural graph as the storage/ranking substrate, CocoIndex as the semantic prior, and the repo map itself as a dynamic Tier A view rather than a static outline or raw graph dump. The strongest new conclusions are that query-ranked dynamic maps should be the MVP, CocoIndex summaries should be selective rather than default, package-scoped maps should be the monorepo default, and semantic hits should map to structural nodes via overlap rather than identity.
+
+## Recommendations for Our Implementation
+
+1. Build `repo_map_generate(query, seeds, budgetTokens, scope)` as a projection over `code_files`, `code_nodes`, and `code_edges`, not as a separate persistent store.
+
+2. Use aider's ranking pipeline as the conceptual baseline, but replace its inferred file graph with our explicit typed-edge graph and exact symbol nodes.
+
+3. Add a bridge layer from CocoIndex hit spans to structural nodes using overlap/enclosing-node resolution; do not store semantic chunks as graph nodes.
+
+4. Start with a simple additive scorer:
+   - active mention/working-set boost,
+   - CocoIndex overlap boost,
+   - typed graph proximity,
+   - verification coupling,
+   - local centrality.
+
+5. Prefer edge types in this order for v1 repo-map expansion: `CALLS`, `IMPORTS`, `EXTENDS`/`IMPLEMENTS`, `CONTAINS`, then weaker `REFERENCES`.
+
+6. Emit Tier A maps as path-first compact text with signatures and terse adjacency hints, while also returning structured `nodes`, `edges`, `freshness`, and `warnings` for tooling.
+
+7. Default to 1.5K-2K tokens, allow up to 4K for research/debug, and prune breadth before removing symbol signatures.
+
+8. Scope monorepo maps to `packageId` by default, with a small explicit cross-package frontier instead of a repository-wide flat ranking.
+
+9. Cache the structural index aggressively, but cache generated repo maps only briefly and invalidate them whenever graph freshness version, budget, query, or working set changes.
+
+10. Ship the MVP as a query-ranked dynamic map with static outline fallback. A static-only MVP would prove indexing but would not validate the structural-graph-plus-CocoIndex design that this packet is trying to establish.

 exited 2 in 1527ms:
✗ ANCHORS_VALID: ANCHOR tags missing in 4 major spec document(s); 21 required anchor(s) missing
    - spec.md: No ANCHOR tags found (required for structured retrieval)
    - plan.md: No ANCHOR tags found (required for structured retrieval)
    - checklist.md: No ANCHOR tags found (required for structured retrieval)
    - decision-record.md: No ANCHOR tags found (required for structured retrieval)
    - spec.md: Missing required anchor 'problem'
    - spec.md: Missing required anchor 'scope'
    - spec.md: Missing required anchor 'requirements'
    - spec.md: Missing required anchor 'success-criteria'
    - spec.md: Missing required anchor 'risks'
    - spec.md: Missing required anchor 'questions'
    - plan.md: Missing required anchor 'summary'
    - plan.md: Missing required anchor 'quality-gates'
    - plan.md: Missing required anchor 'architecture'
    - plan.md: Missing required anchor 'phases'
    - plan.md: Missing required anchor 'testing'
    - plan.md: Missing required anchor 'dependencies'
    - plan.md: Missing required anchor 'rollback'
    - checklist.md: Missing required anchor 'protocol'
    - checklist.md: Missing required anchor 'pre-impl'
    - checklist.md: Missing required anchor 'code-quality'
    - checklist.md: Missing required anchor 'testing'
    - checklist.md: Missing required anchor 'security'
    - checklist.md: Missing required anchor 'docs'
    - checklist.md: Missing required anchor 'file-org'
    - checklist.md: Missing required anchor 'summary'
✓ COMPLEXITY_MATCH: No declared level found in spec.md (using inferred level)
✓ EVIDENCE_CITED: All completed P0/P1 items have evidence
✗ FILE_EXISTS: Missing 1 required file(s)
    - tasks.md
✓ FOLDER_NAMING: Folder name '024-compact-code-graph' follows naming convention
⚠ FRONTMATTER_VALID: Found 2 frontmatter issue(s)
    - spec.md: Missing SPECKIT_TEMPLATE_SOURCE marker (may not be from template)
    - plan.md: Missing SPECKIT_TEMPLATE_SOURCE marker (may not be from template)
✗ LEVEL_MATCH: Level consistency errors
    - Required file missing for Level 3: tasks.md
    - checklist.md does not declare a level (expected Level 3)
    - spec.md does not declare a level (expected Level 3)
✓ LINKS_VALID: Wikilink validation skipped (set SPECKIT_VALIDATE_LINKS=true to enable)
⚠ PHASE_LINKS: 20 phase link issue(s) found
    - Parent spec.md missing 'PHASE DOCUMENTATION MAP' section
    - 001-precompact-hook/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)
    - 002-session-start-hook/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)
    - 003-stop-hook-tracking/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)
    - 004-cross-runtime-fallback/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)
    - 005-command-agent-alignment/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)
    - 006-documentation-alignment/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)
    - 007-testing-validation/spec.md missing parent back-reference (expected: '| **Parent Spec** | ../spec.md |' or 'parent:' field)
    - 002-session-start-hook/spec.md missing predecessor reference (001-precompact-hook)
    - 003-stop-hook-tracking/spec.md missing predecessor reference (002-session-start-hook)
    - 004-cross-runtime-fallback/spec.md missing predecessor reference (003-stop-hook-tracking)
    - 005-command-agent-alignment/spec.md missing predecessor reference (004-cross-runtime-fallback)
    - 006-documentation-alignment/spec.md missing predecessor reference (005-command-agent-alignment)
    - 007-testing-validation/spec.md missing predecessor reference (006-documentation-alignment)
    - 001-precompact-hook/spec.md missing successor reference (002-session-start-hook)
    - 002-session-start-hook/spec.md missing successor reference (003-stop-hook-tracking)
    - 003-stop-hook-tracking/spec.md missing successor reference (004-cross-runtime-fallback)
    - 004-cross-runtime-fallback/spec.md missing successor reference (005-command-agent-alignment)
    - 005-command-agent-alignment/spec.md missing successor reference (006-documentation-alignment)
    - 006-documentation-alignment/spec.md missing successor reference (007-testing-validation)
✓ PLACEHOLDER_FILLED: No unfilled placeholders found
✓ PRIORITY_TAGS: All checklist items have priority context
⚠ SECTION_COUNTS: Section counts below expectations for Level 3
    - spec.md has 9 sections, expected at least 10 for Level 3
    - plan.md has 5 sections, expected at least 8 for Level 3
    - Found 0 requirements, expected at least 8 for Level 3
    - Found 0 acceptance scenarios, expected at least 6 for Level 3
⚠ SECTIONS_PRESENT: Missing 6 recommended section(s)
    - spec.md: Problem Statement
    - spec.md: Requirements
    - plan.md: Technical Context
    - checklist.md: Verification Protocol
    - checklist.md: Code Quality
    - decision-record.md: Consequences
✗ SPEC_DOC_INTEGRITY: 3 spec documentation integrity issue(s) found
    - checklist.md references missing markdown file: .claude/CLAUDE.md
    - plan.md references missing markdown file: .claude/CLAUDE.md
    - spec.md references missing markdown file: .claude/CLAUDE.md
✗ TEMPLATE_HEADERS: 29 structural template deviation(s) found in 4 file(s)
    - spec.md: Missing required section header matching 'EXECUTIVE SUMMARY'
    - spec.md: Missing required section header matching '1. METADATA'
    - spec.md: Missing required section header matching '2. PROBLEM & PURPOSE'
    - spec.md: Missing required section header matching '3. SCOPE'
    - spec.md: Missing required section header matching '4. REQUIREMENTS'
    - spec.md: Missing required section header matching '5. SUCCESS CRITERIA'
    - spec.md: Missing required section header matching '6. RISKS & DEPENDENCIES'
    - spec.md: Missing required section header matching '7. NON-FUNCTIONAL REQUIREMENTS'
    - spec.md: Missing required section header matching '8. EDGE CASES'
    - spec.md: Missing required section header matching '9. COMPLEXITY ASSESSMENT'
    - spec.md: Missing required section header matching '10. RISK MATRIX'
    - spec.md: Missing required section header matching '11. USER STORIES'
    - spec.md: Missing required section header matching '12. OPEN QUESTIONS'
    - spec.md: Missing required section header matching 'RELATED DOCUMENTS'
    - plan.md: Missing required section header matching '1. SUMMARY'
    - plan.md: Missing required section header matching '2. QUALITY GATES'
    - plan.md: Missing required section header matching '3. ARCHITECTURE'
    - plan.md: Missing required section header matching '4. IMPLEMENTATION PHASES'
    - plan.md: Missing required section header matching '5. TESTING STRATEGY'
    - plan.md: Missing required section header matching '7. ROLLBACK PLAN'
    - checklist.md: Missing required section header matching 'Verification Protocol'
    - checklist.md: Missing required section header matching 'Pre-Implementation'
    - checklist.md: Missing required section header matching 'Code Quality'
    - checklist.md: Missing required section header matching 'Testing'
    - checklist.md: Missing required section header matching 'Security'
    - checklist.md: Missing required section header matching 'Documentation'
    - checklist.md: Missing required section header matching 'File Organization'
    - checklist.md: Missing required section header matching 'Verification Summary'
    - checklist.md: H1 should start with '# Verification Checklist:' (found: '# Checklist: Hybrid Context Injection')
    - spec.md: Extra custom section header '## Summary' does not exist in the active template
    - spec.md: Extra custom section header '## Problem' does not exist in the active template
    - spec.md: Extra custom section header '## Solution: Hybrid Approach' does not exist in the active template
    - spec.md: Extra custom section header '## Architecture' does not exist in the active template
    - spec.md: Extra custom section header '## Related Systems' does not exist in the active template
    - spec.md: Extra custom section header '## Key Findings from Research' does not exist in the active template
    - spec.md: Extra custom section header '## Runtime Support Matrix' does not exist in the active template
    - spec.md: Extra custom section header '## Phases' does not exist in the active template
    - spec.md: Extra custom section header '## Out of Scope' does not exist in the active template
    - plan.md: Extra custom section header '## Implementation Strategy' does not exist in the active template
    - plan.md: Extra custom section header '## Phase Overview' does not exist in the active template
    - plan.md: Extra custom section header '## File Locations (iteration 014)' does not exist in the active template
    - plan.md: Extra custom section header '## Risk Mitigation' does not exist in the active template
    - checklist.md: Extra custom section header '## P0 — Must Pass' does not exist in the active template
    - checklist.md: Extra custom section header '## P1 — Should Pass' does not exist in the active template
    - checklist.md: Extra custom section header '## P2 — Nice to Have' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-002: Hybrid Hook + Tool Architecture' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-003: Direct Import over MCP Call for Hook Scripts' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-004: Phase Decomposition' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-005: Build Clean-Room Code Graph (Deferred)' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-006: PreCompact Precompute + SessionStart Inject (Architecture Correction)' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-007: Pass `profile: "resume"` for Compact Brief Format' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-008: Separate `session_token_snapshots` Table for Token Tracking' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-009: Copilot/Gemini Hooks — v1 Policy Suppression, Not Permanent Exclusion' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-010: CocoIndex as Complementary Semantic Layer' does not exist in the active template
    - decision-record.md: Extra custom section header '## DR-011: Code Graph Research Scope Revised' does not exist in the active template
✗ TEMPLATE_SOURCE: Template source header missing in 4 file(s)
    - spec.md: Missing <!-- SPECKIT_TEMPLATE_SOURCE: ... --> header
    - plan.md: Missing <!-- SPECKIT_TEMPLATE_SOURCE: ... --> header
    - checklist.md: Missing <!-- SPECKIT_TEMPLATE_SOURCE: ... --> header
    - decision-record.md: Missing <!-- SPECKIT_TEMPLATE_SOURCE: ... --> header
✓ TOC_POLICY: TOC policy passed: no TOC headings in non-research spec documents

───────────────────────────────────────────────────────────────


  Summary: Errors: 6  Warnings: 5

  RESULT: FAILED



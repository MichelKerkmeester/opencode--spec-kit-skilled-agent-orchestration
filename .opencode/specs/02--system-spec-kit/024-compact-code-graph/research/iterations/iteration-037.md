# Iteration 037: Code Graph Representations for AI

## Focus

Survey the main code graph representations used in academic ML-for-code research and production code-intelligence systems, then determine which graph layers are most useful for AI coding assistants and which ones are compact enough to project into an LLM context window.

## Findings

1. The practical taxonomy of code graphs breaks into ten useful families: AST, AST-path graphs, CFG, DFG, PDG, code property graph (CPG), call graph, import graph, dependency graph, and class hierarchy graph.

   A helpful way to think about them is by what they preserve:
   - AST: syntactic containment and node order.
   - AST-path graph: selected paths through the AST, usually between terminals or symbols.
   - CFG: possible execution order.
   - DFG: value provenance and use-def relations.
   - PDG: combined control and data dependence.
   - CPG: a layered union of syntax, control flow, data flow, and type/system metadata.
   - Call graph: which callable may invoke which callable.
   - Import graph: source-level `import`/`include`/`require`/`use` relations.
   - Dependency graph: broader file, package, module, or build dependency relations.
   - Class hierarchy: inheritance and interface implementation structure.

   Joern's CPG documentation is especially clear that modern CPGs merge classic program representations into one layered, attributed multigraph, including AST, CFG, and dependence layers. [Sources: https://docs.joern.io/code-property-graph/ ; https://cpg.joern.io/]

2. Each graph type is best suited to a different family of tasks, and they are not interchangeable.

   - AST is best for syntax-aware editing, formatting-safe rewrites, symbol extraction, and code chunking.
   - AST-path representations are best when we want a compact structural encoding for ML or prompt projection.
   - CFG is best for reachability, branch-sensitive reasoning, dead-code checks, and path feasibility.
   - DFG is best for value tracking, variable misuse, semantic similarity, bug-finding, and code search where "what value reaches here?" matters.
   - PDG is best for slicing, vulnerability analysis, and explanations that need both control and data dependence.
   - Call graphs are best for impact analysis, caller/callee expansion, and retrieval around a function.
   - Import and dependency graphs are best for repository navigation, architecture understanding, and file-ranking.
   - Class hierarchy graphs are best for polymorphic dispatch, interface implementation lookup, and OO API understanding.

   CodeQL's docs line up closely with this separation: it exposes AST, control-flow, call-graph, and data-flow views as different query surfaces, while Joern treats combined graphs as a heavier analysis substrate. [Sources: https://codeql.github.com/docs/codeql-language-guides/analyzing-control-flow-in-python/ ; https://codeql.github.com/docs/codeql-language-guides/navigating-the-call-graph/ ; https://codeql.github.com/docs/codeql-language-guides/analyzing-data-flow-in-go/ ; https://docs.joern.io/code-property-graph/]

3. For AI/ML research, the major trend has been to move from plain token sequences toward structurally selective graphs rather than toward "maximally rich" graphs.

   The sequence baseline is represented by CodeBERT, which is strong for NL-code alignment but does not inject an explicit program graph. The graph turn starts with program-graph work such as Learning to Represent Programs with Graphs and GREAT, which combine syntax and semantic edges. GraphCodeBERT makes the strongest argument for selective structure: it explicitly uses data flow instead of full AST because data flow is a semantic structure and avoids the deep hierarchy of AST, making the model more efficient. More recent work such as AST-T5 shows that syntax-aware structure still helps, but it does so via AST-aware segmentation and corruption rather than by materializing a huge general-purpose graph. [Sources: https://www.microsoft.com/en-us/research/publication/codebert-a-pre-trained-model-for-programming-and-natural-languages/ ; https://openreview.net/forum?id=BJOFETxR- ; https://openreview.net/forum?id=B1lnbRNtwr ; https://openreview.net/forum?id=jLoC4ez43PZ ; https://proceedings.mlr.press/v235/gong24c.html]

4. The graph types with the highest payoff for AI coding assistants are usually lighter than the graph types with the highest payoff for static security analysis.

   Inference from the sources: interactive coding assistants benefit most from graph layers that help retrieve the right code quickly and explain local impact clearly. That usually means:
   - import/dependency graph for file- and module-level scoping,
   - call graph for expansion around active functions,
   - symbol/type/class graph for definitions and implementations,
   - small local AST or AST-path context for syntax-preserving edits,
   - selective DFG neighborhoods for bug-fixing, refactoring, or security-sensitive reasoning.

   By contrast, full PDG/CPG layers are most valuable when precision and vulnerability reasoning matter more than latency or prompt budget. This matches production platforms too: Sourcegraph's precise navigation centers on symbol/occurrence relations, Semgrep starts from AST/pattern/dataflow, and CodeQL exposes rich flow libraries but keeps them behind an offline indexing/query system rather than directly dumping full graphs into prompts. [Sources: https://sourcegraph.com/docs/code-search/code-navigation ; https://sourcegraph.com/docs/code-navigation/precise-code-navigation ; https://sourcegraph.com/docs/code-navigation/search-based-code-navigation ; https://semgrep.dev/docs/writing-rules/pattern-syntax ; https://semgrep.dev/docs/writing-rules/data-flow/taint-mode/overview ; https://codeql.github.com/docs/codeql-language-guides/navigating-the-call-graph/ ; https://codeql.github.com/docs/codeql-language-guides/analyzing-data-flow-in-go/]

5. Building each graph type requires different tooling, and the cheapest successful pipeline is usually layered rather than uniform.

   Practical build stack by graph type:
   - AST: parser or compiler frontend such as tree-sitter, Babel, TypeScript compiler API, Roslyn, javac, Clang, or language-native parsers.
   - AST-path graph: AST plus a path-extraction routine over selected terminals/symbol nodes.
   - Import graph: AST queries over import/include nodes, plus module-resolution rules.
   - Dependency graph: import graph plus package-manifest and build-system edges.
   - Class hierarchy: parser plus type resolution or compiler symbol tables.
   - Call graph: symbol table plus type resolution; for dynamic languages, often approximate unless backed by richer analysis.
   - CFG: compiler or static-analysis IR that models branching and exceptional flow.
   - DFG: SSA/use-def or taint/dataflow engine.
   - PDG/CPG: whole-program static-analysis framework that can derive dependence layers from CFG/DFG/type information.

   Joern is a good example of the "rich framework" route: it uses language-specific frontends and emits a layered CPG. Sourcegraph is a good example of the "compiler-indexer" route: language-specific indexers emit SCIP for precise navigation. Semgrep is a good example of the "AST first, optional deeper flow" route. [Sources: https://docs.joern.io/ ; https://docs.joern.io/quickstart/ ; https://sourcegraph.com/docs/code-navigation/precise-code-navigation ; https://github.com/scip-code/scip ; https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-intro ; https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-data-flow]

6. The cost curve rises sharply as we move from syntax graphs to semantic and dependence graphs.

   A compact cost/richness ladder is:
   - Lowest cost: AST, import graph, symbol table.
   - Low-to-moderate cost: dependency graph, class hierarchy.
   - Moderate cost: approximate call graph.
   - Moderate-to-high cost: precise call graph, interprocedural CFG, DFG.
   - Highest cost: PDG and CPG overlays.

   The hidden costs are not only parsing time. They include type resolution, build-environment replication, index freshness, cross-file linking, dynamic dispatch approximation, storage size, and graph maintenance after edits. Semgrep documents this trade-off directly: Community Edition stays intraprocedural for speed, while cross-file analysis trades more time and memory for deeper results. Sourcegraph draws a similar line between search-based heuristics and uploaded precise indexes. GraphCodeBERT's design choice to prefer DFG over full AST is also an efficiency argument from the ML side. [Sources: https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-intro ; https://sourcegraph.com/docs/code-navigation/search-based-code-navigation ; https://sourcegraph.com/docs/code-navigation/precise-code-navigation ; https://openreview.net/forum?id=jLoC4ez43PZ]

7. Modern code-intelligence platforms do not converge on one universal graph; they converge on different representations for different product surfaces.

   - CodeQL uses extracted language databases and exposes AST, control flow, call graph, type hierarchy, and local/global data flow through query libraries. It is rich, analysis-oriented, and intentionally offline/indexed.
   - Semgrep Community Edition is AST and pattern centric, with semantic equivalence helpers and intraprocedural analysis; Semgrep Code/Pro adds cross-function and cross-file dataflow and taint traces.
   - Sourcegraph uses two representations: search-based navigation from text plus syntax-level heuristics, and precise navigation from uploaded SCIP indexes containing compiler-derived symbol/occurrence relations.

   So the industry pattern is not "build one giant graph and use it everywhere." It is "choose the cheapest representation that supports the product interaction." [Sources: https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-java/ ; https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-go/ ; https://codeql.github.com/docs/codeql-language-guides/analyzing-control-flow-in-python/ ; https://semgrep.dev/docs/writing-rules/pattern-syntax ; https://semgrep.dev/docs/writing-rules/data-flow/taint-mode/overview ; https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-intro ; https://sourcegraph.com/docs/code-search/code-navigation ; https://sourcegraph.com/docs/code-navigation/precise-code-navigation ; https://sourcegraph.com/docs/code-navigation/search-based-code-navigation ; https://github.com/scip-code/scip]

8. The most compact and token-efficient graph representations for LLM consumption are not full graphs; they are graph projections.

   The best prompt-facing shapes are:
   - AST paths rather than full ASTs.
   - symbol/occurrence summaries rather than full CFG/PDG dumps.
   - top-k import and dependency neighbors rather than whole-repo graphs.
   - caller/callee egonets around the active symbol rather than whole call graphs.
   - tiny DFG slices around suspicious variables rather than whole-program data flow.
   - ranked repo maps that combine file paths, signatures, and a few important edges.

   Evidence points in the same direction from multiple angles:
   - GraphCodeBERT says DFG is more efficient than AST for structure-aware modeling.
   - code2vec and code2seq compress structure into AST paths/path-contexts.
   - AST-T5 keeps structure without requiring complex program analyses.
   - Sourcegraph's SCIP representation is symbol/occurrence oriented, not full AST/PDG.
   - aider-style repo maps show that ranked symbol/file summaries are useful prompt projections even without a full semantic graph in the context window.

   Inference for LLM system design: "store rich, serve compact" is the right architecture. [Sources: https://openreview.net/forum?id=jLoC4ez43PZ ; https://code2vec.com/ ; https://code2seq.com/ ; https://proceedings.mlr.press/v235/gong24c.html ; https://github.com/scip-code/scip ; https://sourcegraph.com/docs/code-navigation/precise-code-navigation]

9. The key academic papers cluster by what structure they privilege.

   Recommended paper map:
   - CodeBERT (2020): strong sequence baseline for NL-code tasks, useful comparison point because it is not graph-first.
   - Learning to Represent Programs with Graphs (ICLR 2018): foundational multi-relational program-graph work with GGNNs.
   - Global Relational Models of Source Code / GREAT (ICLR 2020): combines transformer-style global modeling with graph relations.
   - GraphCodeBERT (ICLR 2021): the clearest selective-structure paper for assistants; uses DFG, not AST.
   - code2vec (POPL 2019): compact AST-path representation for code embeddings.
   - code2seq (ICLR 2019): AST-path representation for sequence generation.
   - AST-T5 (ICML 2024): newer syntax-aware pretraining that preserves AST structure without heavy static analysis.
   - Modeling and Discovering Vulnerabilities with Code Property Graphs (2014): foundational security/program-analysis paper behind CPG tooling.

   Together, these papers show a recurring pattern: compact syntactic structure helps, semantic flow helps more for reasoning-heavy tasks, and the highest-precision program-analysis graphs are best kept as retrieval/indexing infrastructure rather than prompt payloads. [Sources: https://www.microsoft.com/en-us/research/publication/codebert-a-pre-trained-model-for-programming-and-natural-languages/ ; https://openreview.net/forum?id=BJOFETxR- ; https://openreview.net/forum?id=B1lnbRNtwr ; https://openreview.net/forum?id=jLoC4ez43PZ ; https://code2vec.com/ ; https://code2seq.com/ ; https://proceedings.mlr.press/v235/gong24c.html ; https://docs.joern.io/code-property-graph/]

10. For our implementation, a layered compact graph is the best fit: start with retrieval-valuable edges, then add selective semantic edges only where they pay for themselves.

   Inference from the research:
   - v1 should emphasize symbol definitions, references, imports, exports, file-level dependencies, class/type declarations, and a lightweight caller/callee graph.
   - v2 can add optional local DFG slices for bug-fixing, vulnerability inspection, and variable-centric explanations.
   - Full PDG/CPG construction should remain an offline or optional enrichment path, not the baseline graph served to the assistant.

   This gives us the assistant-relevant benefits of structure without inheriting the latency, storage, and token costs of a full program-analysis graph on every request. [Sources: https://openreview.net/forum?id=jLoC4ez43PZ ; https://sourcegraph.com/docs/code-navigation/precise-code-navigation ; https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-intro ; https://docs.joern.io/code-property-graph/]

## Evidence (cite sources/URLs)

1. https://www.microsoft.com/en-us/research/publication/codebert-a-pre-trained-model-for-programming-and-natural-languages/
2. https://openreview.net/forum?id=BJOFETxR-
3. https://openreview.net/forum?id=B1lnbRNtwr
4. https://openreview.net/forum?id=jLoC4ez43PZ
5. https://proceedings.mlr.press/v235/gong24c.html
6. https://code2vec.com/
7. https://code2seq.com/
8. https://docs.joern.io/code-property-graph/
9. https://docs.joern.io/
10. https://cpg.joern.io/
11. https://codeql.github.com/docs/codeql-language-guides/analyzing-control-flow-in-python/
12. https://codeql.github.com/docs/codeql-language-guides/navigating-the-call-graph/
13. https://codeql.github.com/docs/codeql-language-guides/analyzing-data-flow-in-go/
14. https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-go/
15. https://codeql.github.com/docs/codeql-language-guides/codeql-library-for-java/
16. https://semgrep.dev/docs/writing-rules/pattern-syntax
17. https://semgrep.dev/docs/writing-rules/data-flow/taint-mode/overview
18. https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-intro
19. https://semgrep.dev/docs/semgrep-code/semgrep-pro-engine-data-flow
20. https://sourcegraph.com/docs/code-search/code-navigation
21. https://sourcegraph.com/docs/code-navigation/precise-code-navigation
22. https://sourcegraph.com/docs/code-navigation/search-based-code-navigation
23. https://github.com/scip-code/scip

## New Information Ratio (0.0-1.0)

0.76

## Novelty Justification

Earlier packet research already established that tree-sitter, aider-style repo maps, and CocoIndex are relevant building blocks. This iteration adds a broader research-layer synthesis that was not previously captured: a clear taxonomy of code graph types, a task-to-graph suitability map, a comparison of graph richness versus construction cost, an industry comparison across CodeQL/Semgrep/Sourcegraph, and a direct recommendation about which graph projections are compact enough for LLM consumption. The most important new conclusion is that the right design is not "full code property graph in prompt," but "rich graph in storage, compact graph projection for the model."

## Recommendations for Our Implementation

1. Build the graph in layers, not as one monolithic IR.
   - Base layer: symbols, definitions, references, imports, exports, file dependencies, class/type declarations.
   - Expansion layer: approximate caller/callee edges.
   - Optional semantic layer: local DFG slices around selected variables or findings.

2. Keep prompt-facing output as compact graph projections.
   - Preferred shapes: repo map, top-k dependency neighbors, active-symbol caller/callee egonet, AST-path snippets, small data-flow slices.
   - Avoid serializing whole ASTs, full CFGs, or full PDGs into context.

3. Use tree-sitter or compiler indexers for the cheap structural layers.
   - tree-sitter is enough for AST, import/export extraction, symbol declarations, and lightweight file graphs.
   - Bring in type-aware compiler/indexer data only where needed for call graph precision.

4. Treat call graphs as useful but approximate by default.
   - Start with static direct-call edges plus method-name/type-resolution heuristics.
   - Mark confidence or edge kind instead of pretending all dynamic dispatch is precise.

5. Reserve rich dependence graphs for offline enrichment.
   - PDG/CPG should be optional analysis assets for deep inspections, not baseline context payloads.

6. Adopt a "store rich, serve compact" contract.
   - Persist graph facts in structured tables.
   - Generate multiple projections from the same graph: retrieval/ranking view, prompt-summary view, and future visualization/debug view.

7. Benchmark graph utility by assistant task, not only by parser completeness.
   - Measure improvement on repo navigation, file ranking, impact analysis, edit locality, and bug-fix retrieval before adding heavier graph layers.

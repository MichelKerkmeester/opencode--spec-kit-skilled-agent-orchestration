# Iteration 042: Code-Aware RAG Pipelines — Best Practices

## Focus

Investigate state-of-the-art code-aware RAG patterns, with emphasis on how repository structure, code graphs, code embeddings, code-documentation links, reranking, and evaluation differ from document-oriented RAG. Compare those practices against our current hybrid retrieval stack (`vector + FTS5 + BM25 + graph + degree`) to identify what is already strong and what is still missing for a genuinely code-aware pipeline.

## Findings

1. **Code-aware RAG is not just "document RAG over source files".** In document RAG, the core unit is usually a prose chunk and the retrieval problem is mostly semantic or lexical similarity. In code-aware RAG, the retrieval unit is usually a program artifact such as a function, method, class, symbol neighborhood, import chain, or API example. Repository-level benchmarks such as RepoBench and SWE-QA exist precisely because single-file or snippet-only evaluation misses cross-file dependencies, architecture, and multi-hop reasoning. Code-aware RAG therefore needs to preserve symbol boundaries, repository topology, and execution-relevant relationships that document RAG can often ignore.

2. **The strongest pattern is hybrid seed retrieval plus graph expansion, not graph-only retrieval.** The best code-aware design I found is: retrieve seed nodes with dense and lexical search, then expand or constrain them with a structural code graph. GraphCoder and CodexGraph both argue that similarity-only retrieval has low recall on repository-scale tasks, especially when the answer depends on repository-specific structure rather than local lexical overlap. In practice, this means embeddings should find likely symbols/files quickly, while the graph should recover the surrounding call/import/dependency neighborhood needed for multi-hop grounding. This is also consistent with broader GraphRAG research: graph retrieval is most useful when the task is hierarchical or multi-hop, while vanilla RAG remains stronger for direct fact lookup.

3. **For embedding models, the listed options do not play the same role.** My current recommendation is:
   `voyage-code-3`: best specialized retriever among the listed options for code-heavy corpora, based on Voyage's official model docs and vendor-reported code-retrieval evaluations. It is explicitly optimized for code retrieval and has long context plus dimension/quantization flexibility.
   `text-embedding-3-large`: strongest OpenAI general-purpose embedding option for mixed code+docs corpora when you want one general retriever and easy shortening via dimensions. This is an inference from OpenAI's official embedding guidance plus model positioning, not a code-specific claim from OpenAI.
   `CodeBERT`: still a credible self-hosted baseline for code search and a useful reranker/fine-tuning starting point, but it is an older academic model rather than the frontier production choice.
   `StarCoder`: not a primary embedding model. It is a code generation model family, so it fits better as a generator or synthetic query/context augmenter than as the main retriever.
   The practical implication is that "best embedding model" depends on corpus mix. For pure code retrieval, a code-optimized model wins. For mixed code, docs, issues, and plans, a strong general embedding model or a dual-index strategy is often better.

4. **Chunking should be structure-aware and symbol-first.** The most useful recent result here is cAST, which shows that line-based chunking often breaks semantic structure, while AST-based chunking improves both retrieval and end-to-end generation. My recommended default is:
   primary chunk: function or method
   secondary chunk: class or cohesive type section
   tertiary chunk: file summary or module synopsis
   graph-only unit: statement/block neighborhoods when needed for very fine-grained reasoning
   File-level chunks should usually be fallback or summary artifacts, not the main embedding unit, because they dilute signal and make reranking harder. The better pattern is small, self-contained code units linked to larger parent summaries and graph neighborhoods.

5. **GraphRAG for code should mean graph-conditioned retrieval over repository structure, not generic knowledge-graph ceremony.** In the code setting, GraphRAG is most useful when the graph is built from repository-native relationships: containment, imports, calls, inheritance, overrides, references, tests, docs, ownership, and possibly execution/dataflow edges. The graph is then used for:
   seed expansion around retrieved symbols
   path-based evidence assembly for cross-file questions
   context packing that prefers connected evidence over isolated neighbors
   selective traversal for multi-hop tasks
   The broader GraphRAG literature warns that graph methods frequently underperform vanilla RAG on many real tasks when graph construction is weak or the task is not multi-hop. For code, this means graph retrieval should be selective and query-aware, not always-on at full breadth.

6. **Code and documentation should be modeled as linked but distinct retrieval objects.** DocPrompting and the 2025 API-documentation study both point in the same direction: documentation can substantially help code generation, and example code matters more than descriptive prose alone. That argues for a first-class code-doc relationship in the index:
   code node -> linked docstring/API docs/examples/tests
   documentation chunk -> linked symbols/files/packages
   retrieval should be typed by query intent
   natural-language API question: doc-first, then linked code
   bug/localization question: code-first, then linked docs/tests/issues
   architecture question: graph-first neighborhood, then file/class summaries
   The key mistake to avoid is flattening code and docs into one undifferentiated bag of chunks.

7. **The best reranking strategy is multi-stage and intent-aware.** A strong code retrieval stack should use:
   stage 1 candidate generation: dense + lexical + graph channels
   stage 2 precision rerank: cross-encoder or local reranker over query-candidate pairs
   stage 3 packing/diversity: MMR or coverage-aware context assembly
   stage 4 graph validation: prefer connected evidence over disconnected high-score fragments
   This is partly a synthesis from the literature and partly an implementation inference from our current stack. The literature makes clear that retrievers still struggle when lexical overlap is weak, and that generators often fail to use extra context well. That makes high-precision reranking and context packing disproportionately important for code RAG.

8. **Evaluation must separate retrieval quality from coding-task quality.** The metrics that matter most are:
   retrieval: Recall@k, NDCG@k, MRR, hit rate by query type, symbol coverage, cross-file coverage, path coverage for multi-hop questions
   end-to-end generation: pass@k, exact match where appropriate, unit/integration test pass rate, issue-resolution success, answer groundedness
   system metrics: latency, token cost, context-pack size, reranker cost, stale-context rate
   repo-specific diagnostics: which edge types were useful, whether the answer needed cross-file reasoning, and whether retrieved evidence formed a connected neighborhood
   RepoBench is especially useful because it explicitly separates retrieval, completion, and pipeline tasks. CodeRAG-Bench is useful because it mixes multiple context sources. SWE-QA matters because it stresses repository-level questions rather than just completion.

9. **The common failure modes of code RAG are now fairly clear.** The recurring ones across papers are:
   semantically bad chunking that splits functions or merges unrelated code
   lexical mismatch between query and relevant code
   graph construction errors or incomplete graph coverage
   retrieving topically similar code that is structurally irrelevant
   over-expanding high-degree hubs and drowning the model in neighbors
   stale or low-quality documentation, especially docs without good examples
   generator underuse of retrieved context because the pack is too long, too noisy, or poorly ordered
   benchmark contamination or evaluation protocols that reward shortcut retrieval instead of repository reasoning
   A practical corollary is that "more retrieved context" is often worse unless the context is structure-preserving and query-aligned.

10. **Our current hybrid search is a strong foundation, but it is not yet state-of-the-art code-aware RAG.** Relative to the literature, our strengths are real:
   we already fuse multiple channels rather than betting on dense retrieval alone
   we already include graph and degree signals
   we already use RRF-style fusion, MMR-style reranking hooks, and evaluation-mode safeguards
   we already treat retrieval as a pipeline rather than a single ANN lookup
   But our current graph channel is still a memory/causal/hierarchy graph, not a repository-native code graph built from symbols, imports, calls, or AST/dataflow structure. That means our system is closer to advanced hybrid document RAG with graph augmentation than to GraphCoder/CodexGraph-style code-aware retrieval. The missing state-of-the-art pieces are: symbol-level structural chunking, code-specific embeddings or dual-index retrieval, code-doc link modeling, graph expansion around symbol seeds, query-intent routing for code tasks, and repository-level benchmark evaluation. So the verdict is: **architecturally aligned with modern hybrid RAG, but not yet a full code-aware RAG pipeline.**

## Evidence

External sources:

- RepoBench benchmark for repository-level retrieval, completion, and pipeline evaluation: https://arxiv.org/abs/2306.03091
- CodeRAG-Bench on when retrieval helps code generation, with mixed-source retrieval and failure analysis: https://arxiv.org/abs/2406.14497
- cAST on AST-based structural chunking for code RAG: https://arxiv.org/abs/2506.15655
- GraphCoder on coarse-to-fine retrieval with a code context graph: https://openreview.net/pdf?id=ifHCDkFxL6
- CodexGraph on graph-database interfaces for repository-scale code retrieval/navigation: https://aclanthology.org/2025.naacl-long.7/
- RAG vs GraphRAG systematic evaluation: https://arxiv.org/abs/2502.11371
- When to use Graphs in RAG / GraphRAG-Bench: https://arxiv.org/abs/2506.05690
- DocPrompting: Generating Code by Retrieving the Docs: https://openreview.net/forum?id=ZTCxT2t2Ru
- API documentation retrieval for code generation, with findings on example code value: https://arxiv.org/abs/2503.15231
- CodeBERT paper: https://arxiv.org/abs/2002.08155
- StarCoder paper summary and arXiv link: https://huggingface.co/papers/2305.06161
- OpenAI embedding guidance and model positioning:
  https://platform.openai.com/docs/api-reference/embeddings/create?lang=node.js
  https://platform.openai.com/docs/guides/tools-file-search/
  https://openai.com/index/new-embedding-models-and-api-updates/
- Voyage code embedding and reranking docs:
  https://blog.voyageai.com/2024/12/04/voyage-code-3/
  https://blog.voyageai.com/2024/12/04/code-retrieval-eval/
  https://blog.voyageai.com/2025/02/24/joining-mongodb/
  https://docs.voyageai.com/reference/reranker-api
  https://docs.voyageai.com/reference/contextualized-embeddings-api

Internal repo evidence:

- Current channel exposure includes `vector`, `fts5`, `bm25`, `graph`, and `degree`: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:245-248`
- Hybrid search initialization wires vector search plus graph search: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:955-967`
- Current hybrid pipeline explicitly combines BM25, FTS, vector, graph, RRF fusion, MMR, local reranking, routing, and confidence/token-budget logic: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:9-27`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:75-110`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:840-920`
- Current graph channel is a causal/hierarchy retrieval layer backed by `causal_edges`, FTS5 matching, and typed degree weighting rather than a repository-native code graph: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35-55`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:88-153`

## New Information Ratio (0.0-1.0)

0.74

## Novelty Justification

This iteration adds material that is not present in the earlier packet research. The strongest new pieces are:

- recent code-RAG-specific literature rather than the earlier hook/context-preservation focus
- concrete guidance on AST/symbol-aware chunking
- a sharper distinction between graph-conditioned code retrieval and generic GraphRAG
- a practical model ranking across OpenAI, Voyage, CodeBERT, and StarCoder by role rather than by vague "best model" language
- an explicit mapping between state-of-the-art code-aware RAG patterns and our current `vector + FTS5 + BM25 + graph + degree` implementation

## Recommendations for Our Implementation

1. Keep the current hybrid foundation, but introduce a real code graph channel built from symbols and repository structure rather than only memory/causal edges.
2. Index at multiple structural levels: function/method as the primary retrievable unit, class/file summaries as parent context, and graph neighborhoods for cross-file assembly.
3. Treat code and documentation as separate but linked corpora. Retrieve them differently depending on query intent.
4. Add query-intent routing for code tasks:
   bug/debug -> favor lexical identifiers, stack traces, tests, recent edits
   architecture/explanation -> favor graph expansion and summaries
   API usage -> favor docs/examples, then linked code
   code generation/completion -> favor symbol-neighborhood retrieval
5. Use a code-specialized embedding path for code nodes. The cleanest design is probably dual-index retrieval: one code-focused index and one mixed text/docs/issues index.
6. Add a precision rerank stage over the fused candidate set, ideally with a cross-encoder-style reranker or a strong local reranker, then use MMR/coverage-aware packing after reranking.
7. Prefer AST/symbol-aware chunking over fixed line windows. Line windows can remain as a backstop, not the primary representation.
8. Evaluate the resulting system on both retrieval and end-to-end repo tasks. At minimum, track Recall@k/NDCG@k, cross-file coverage, pass@k or test success, latency, and token cost by query class.
9. Be selective about graph use. Graph expansion should trigger mainly for cross-file, multi-hop, architecture, and dependency questions rather than every query.
10. Position the current system honestly: we already have an advanced hybrid retrieval base, but the next milestone is "code-aware hybrid RAG" rather than claiming we already have it.

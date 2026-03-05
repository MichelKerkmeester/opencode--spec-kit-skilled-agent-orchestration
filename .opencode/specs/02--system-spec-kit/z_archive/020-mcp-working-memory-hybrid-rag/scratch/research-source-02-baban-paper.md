# Source Research 02 - Baban et al. (KDD 2025)

## 1) Executive summary

The paper proposes an agentic hybrid-RAG pipeline that combines lexical retrieval (BM25), semantic retrieval (Sentence-BERT embeddings), weighted ensembling, and LLM-based contextual reordering orchestrated via LangGraph. Reported outcomes are a 4x latency reduction (43s to 11s) and +7% Top-10 accuracy versus a static hybrid baseline, with statistically significant gains across 500 queries. [CITATION: p.1 Abstract; p.5 Section 6.2 Table 2; p.5 Section 6.3 Table 3; p.5 Section 6.1 Table 1]

## 2) System/method architecture overview

- Two parallel retrieval branches: BM25 keyword retrieval and embedding-based vector retrieval, each with dedicated filtering agents. [CITATION: p.2 Section 3.3]
- A Complexity Analysis Agent estimates query complexity and sets branch weights before retrieval. [CITATION: p.2 Section 3.4; p.3 Query Complexity Estimation]
- A Comparison Agent merges branch outputs via weighted scoring; an LLM Reordering Agent performs final context-aware reranking. [CITATION: p.3 pseudocode steps 6-7; p.2 Section 3.1.4]
- Orchestration is modeled as a DAG with node-level agents, edge-defined control flow, and supervisor/control logic for dynamic execution changes. [CITATION: p.3 Architecture Overview; Figure 1]

## 3) Core logic flows and data abstractions

- Core flow (paper pseudocode): complexity estimate -> dynamic weight assignment -> parallel retrieval -> filtering -> weighted score fusion -> LLM reranking -> return top-k. [CITATION: p.3 pseudocode]
- Weighted fusion abstraction: R_combined = w_bm25 * score(R_kw) + w_embed * score(R_vec). [CITATION: p.3 pseudocode step 6]
- Message abstractions exchanged between agents: partial scores (IDs/ranks/confidence), context flags (query type, token length, entity counts), and error signals (fallback/timeout/low quality). [CITATION: p.3 Message Structure]
- Query complexity is treated as a routing/control signal to bias lexical vs semantic emphasis. [CITATION: p.3 Query Complexity Estimation]

## 4) Integration mechanisms

- LangGraph is used for asynchronous message passing, modular orchestration, and parallel execution of independent retrieval/filtering work. [CITATION: p.2 Section 3.2; p.4 Framework Independence]
- LangChain is integrated at the reranking stage to reorder top candidate documents by deeper contextual semantics. [CITATION: p.2 Section 3.1.4; p.6 Section 6.6]
- Retriever stack integration includes BM25 + vector similarity over Sentence-BERT embeddings, with ensemble composition on top. [CITATION: p.2 Sections 3.1.1-3.1.3; p.4 Section 4.4]
- The authors explicitly position architecture as framework-agnostic despite LangGraph implementation (possible with CrewAI/AutoGen/custom DAGs). [CITATION: p.4 Framework Independence]

## 5) Design patterns/architectural decisions

- Parallel branch execution for latency reduction and throughput. [CITATION: p.2 Section 3.3; p.4 benefits bullet "Efficiency"]
- Dynamic control by query-complexity-driven weighting (adaptive retrieval policy). [CITATION: p.2 Section 3.4; p.3 Query Complexity Estimation]
- Staged retrieval pipeline: retrieve -> filter -> compare/fuse -> rerank. [CITATION: p.3 pseudocode; Figure 1]
- Loose coupling via protocolized message bus and explicit error signaling/retry handling. [CITATION: p.2 Section 3.5; p.3 Message Structure]
- Modularity/extensibility: plug-in new domain retrievers/agents into DAG with limited architectural changes. [CITATION: p.4 benefits bullet "Scalability"]

## 6) Technical dependencies/requirements

- Runtime/hardware used in experiments: 8-core CPU, 32 GB RAM, NVIDIA RTX 3090. [CITATION: p.4 Section 5]
- Software stack: Python 3.10, LangChain v0.1.19, LangGraph v0.0.14, Faiss vector indexing. [CITATION: p.4 Section 5]
- Data/eval setup dependencies: 100K-document corpus, 500 manually annotated queries, 3 annotators with majority-vote relevance labels. [CITATION: p.4 Sections 4.1-4.2]

## 7) Limitations/threats to validity

- Dependence on embedding quality is explicitly acknowledged; degraded embedding quality can hurt relevance. [CITATION: p.6 Section 6.6; p.6-7 Conclusion limitations]
- Multi-agent coordination overhead is acknowledged as a trade-off even with performance gains. [CITATION: p.6 Section 6.6; p.6-7 Conclusion limitations]
- Scalability claims are partly preliminary ("preliminary experiments") rather than fully exhaustive production evidence. [CITATION: p.6 Section 6.5]
- Reproducibility artifacts were promised for release (future tense), so replication readiness depends on artifact publication timing. [CITATION: p.5 reproducibility paragraph; p.4 Section 4.3 final paragraph]

## 8) Key learnings for TARGET_SYSTEM_DESCRIPTION=system-spec-kit + Spec Kit Memory MCP

1. Use a complexity-aware retrieval policy switch in MCP memory context retrieval (simple intent -> lexical-heavy, complex intent -> semantic-heavy) instead of fixed static weights. [CITATION: p.2 Section 3.1.3; p.3 Query Complexity Estimation]
2. Keep retrieval as a composable DAG with explicit stage boundaries (retrieval/filter/fuse/rerank) to support observability and targeted tuning. [CITATION: p.3 Figure 1 + pseudocode]
3. Standardize inter-agent message schema (scores, flags, errors) for predictable orchestration and fault handling in memory pipelines. [CITATION: p.3 Message Structure]
4. Prefer parallel branch execution for latency-sensitive MCP calls, with selective fallback when quality signals are low. [CITATION: p.4 benefits bullet "Efficiency"; p.3 Message Structure Error Signals]
5. Validate retrieval changes with both quality and latency metrics, plus significance testing over per-query outputs (not only aggregate means). [CITATION: p.4 Section 4.3; p.5 Section 6.1 Table 1]

## 9) Concrete citations (page/section/table/figure)

- p.1 Abstract: claimed gains (4x latency, +7% accuracy), workflow components.
- p.2 Section 3.1.1-3.1.4: BM25, embeddings, 30/70 weighting rationale, LangChain reordering.
- p.2 Sections 3.2-3.5: agent definition, LangGraph orchestration, branch split, communication protocol.
- p.3 Figure 1 and orchestration pseudocode: end-to-end logic, weighted combination formula, top-k output.
- p.4 Framework Independence: framework-agnostic design claim; p.4 Section 4.1-4.4 and 5: dataset, metrics, baselines, environment.
- p.5 Table 1, Table 2, Table 3: statistical significance and headline performance comparisons.
- p.6 Table 4: ablation outcome favoring 30% BM25 / 70% embedding.
- p.6 Section 6.5-6.6 and p.6-7 Conclusion: scalability/limitations and trade-offs.

## 10) [Assumes: X] + confidence

- [Assumes: PDF text extraction is accurate enough for section/table/figure identification despite formatting artifacts from ACM two-column layout extraction.]
- [Assumes: Reported benchmark numbers are internally consistent and no hidden preprocessing differences materially alter baseline fairness.]
- [Assumes: "Framework independence" means conceptual portability, not guaranteed drop-in parity across orchestration frameworks.]
- Confidence: 87/100

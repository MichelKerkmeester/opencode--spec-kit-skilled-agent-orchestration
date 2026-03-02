# Wave 2: Blind Spot Analysis -- Gaps Missing from All 4 Research Documents

> **Date:** 2026-02-26
> **Method:** Systematic gap detection across 140-analysis, 140-recommendations, 141-analysis, 141-recommendations
> **Purpose:** Identify important topics and considerations that are ABSENT from the research corpus

---

## 1. User Experience Gaps (Agent-as-Consumer)

### 1.1 Result Format Impact on Agent Comprehension -- NOT ANALYZED

None of the documents examine how the FORMAT of returned results affects the consuming AI agent's ability to use them. The research focuses entirely on ranking quality (which result is returned) but ignores presentation quality (how the result is consumed).

**Missing questions:**
- Does returning raw memory content vs. a structured summary affect agent task completion rate?
- Should results include relevance explanations ("This memory was surfaced because...") to help the agent decide whether to use it?
- Do agents perform better when results include source attribution metadata or when they receive clean content only?
- Is there a threshold where more metadata (scores, sources, confidence) becomes noise that degrades agent comprehension?

**Why it matters:** The entire system exists to serve AI agents. Optimizing ranking without optimizing consumption is like improving a restaurant's ingredient sourcing while ignoring how the food is plated.

### 1.2 Token Efficiency of Returned Results -- PARTIALLY ADDRESSED

The documents mention token budgets (500-2000 per tool) and dynamic token allocation (R6, LightRAG pattern). However, no analysis exists of:

- **Token waste rate:** What percentage of tokens in returned results are actually used by the consuming agent? If 60% of returned content is ignored, the ranking is less important than the content extraction.
- **Result density:** Is a 200-token summary of the top-1 memory more useful than returning 5 full memories consuming 2000 tokens?
- **Compression strategies:** Could memory content be pre-summarized at different granularities (50-token, 200-token, full) and served based on the query's token budget?

### 1.3 Optimal Result Count -- NOT ANALYZED

The documents assume the existing `limit` parameter (default 10-20) is appropriate. No analysis exists of:

- **Diminishing returns curve:** At what position do additional results stop helping the agent? Is position 3 the cutoff, or position 7?
- **Confidence-based truncation:** Should the system return fewer results when top results are highly confident, and more results when confidence is low?
- **Task-dependent cardinality:** Does `fix_bug` intent benefit from 1-2 precise results while `understand` intent benefits from 5-10 diverse results?

The 141-recommendations mention `R15: Query Complexity Router` which adjusts limits (3/10/20) by complexity, but this is based on intuition, not evidence. No document cites research on optimal result count for AI agent consumers.

---

## 2. Operational Gaps

### 2.1 Monitoring and Alerting -- NOT ANALYZED

R13 designs an evaluation framework with offline metrics. None of the documents discuss:

- **Online monitoring:** Real-time alerts when search latency exceeds thresholds (the 500ms target is mentioned but no monitoring mechanism is proposed)
- **Channel health monitoring:** How to detect when a channel has silently degraded (e.g., vector search returns zero results for 50+ consecutive queries)
- **Embedding provider health:** What happens when HuggingFace API is down? No fallback or circuit-breaker strategy is discussed
- **Database health:** WAL file growth, vacuum scheduling, index bloat detection
- **Alert thresholds:** When should the system notify the user that retrieval quality has degraded?

### 2.2 Database Backup and Recovery -- NOT ANALYZED

The documents mention `checkpoint_create` for memory state preservation but do not discuss:

- **SQLite file-level backup:** How to safely backup the database while the MCP server is running (WAL mode considerations)
- **Corruption recovery:** What to do if the SQLite database becomes corrupted (sqlite-vec is a C extension that could crash)
- **Embedding recovery:** If embeddings are lost, can they be regenerated? What is the cost? (R18 partially addresses this with embedding cache, but not as a disaster recovery mechanism)
- **Point-in-time recovery:** Can the system recover to a specific state beyond the checkpoint mechanism?

### 2.3 Migration Rollback Strategies -- PARTIALLY ADDRESSED

R5 mentions a "dual-store" migration path for INT8 quantization, and R8 mentions "DROP COLUMN to rollback." However:

- **No general migration framework:** What happens when R8 (add summary column) + R16 (add encoding_intent column) + R18 (add embedding_cache table) all need schema changes? No migration versioning or ordering strategy exists.
- **Forward/backward compatibility:** If schema is migrated forward, can the previous version of the MCP server still operate? No compatibility matrix is provided.
- **Data migration testing:** No strategy for testing schema migrations on a copy before applying to the live database.

### 2.4 Performance Regression Detection -- PARTIALLY ADDRESSED

R13's evaluation framework includes metric snapshots, and the shadow scoring (Section 7.5) provides A/B comparison. Missing:

- **Automated regression gates:** No CI/CD integration is proposed. How do schema changes or code changes get validated against retrieval quality before deployment?
- **Latency budgets per pipeline stage:** The total 500ms target exists but no per-stage budgets are defined (e.g., vector search < 50ms, RRF fusion < 10ms, reranking < 100ms)
- **Regression attribution:** If MRR@5 drops after deploying R1+R4 simultaneously, how do you determine which caused the regression? No isolation strategy beyond feature flags.

---

## 3. Testing Gaps

### 3.1 Current Test Coverage and Quality -- MENTIONED BUT NOT ANALYZED

The 141-analysis mentions "158 existing tests" and the 141-recommendations say "All 158 existing tests must pass." However, no document analyzes:

- **What do the 158 tests actually cover?** Unit tests? Integration tests? End-to-end tests? What percentage of the search pipeline is covered?
- **Test quality:** Are the tests testing the right things? Do they verify ranking quality or just "no crashes"?
- **Test gaps:** Which components have zero test coverage? Is `composite-scoring.ts` (593 lines) tested? Is `rrf-fusion.ts` tested?
- **Test infrastructure:** Is there a test fixture with realistic memory data, or do tests use synthetic minimal data?

### 3.2 Testing Ranking Quality Without Ground Truth -- PARTIALLY ADDRESSED

R13 proposes building ground truth via synthetic pairs, implicit feedback, and LLM-as-judge. Missing:

- **Interleaving experiments:** The documents only discuss shadow scoring (run both, show one). Online interleaving (randomly show results from either pipeline) is more statistically powerful and is not mentioned.
- **Inversion rate metric:** A simple diagnostic -- "how often does position 2 get selected over position 1?" -- is not proposed but would immediately reveal ranking quality issues without ground truth.
- **Pairwise preference testing:** Rather than absolute relevance judgments (0-3 grades), pairwise comparisons ("Is result A or B more relevant?") are easier to collect and more reliable. Not discussed.
- **Calibration testing:** Are the scores well-calibrated? Does a score of 0.8 actually mean 80% likelihood of relevance? No calibration analysis is proposed.

### 3.3 Integration Testing Strategy -- NOT ANALYZED

The recommendations propose 31 changes touching the entire search pipeline. No document discusses:

- **Integration test design:** How to verify that R1 (MPAB) + R4 (degree channel) + R2 (channel diversity) produce correct combined behavior
- **Pipeline snapshot testing:** Capturing the full ranked output for a test query and comparing against a golden snapshot
- **Chaos testing:** What happens when one channel fails? Does the system degrade gracefully or crash?
- **Contract testing:** Between the spec-kit logic layer and the MCP server boundary (identified as blurred in G11/G12)

---

## 4. Scaling Gaps

### 4.1 Multi-User Scenarios -- NOT ANALYZED

The documents explicitly note "Single-user agent workflows" but do not analyze:

- **Why single-user is an assumption, not a requirement:** Could multiple Claude instances share the same memory? Could a team of developers use the same spec-kit memory?
- **Tenant isolation:** If multi-user becomes needed, what architectural changes would be required? (Separate databases? Row-level security? Per-user embedding spaces?)
- **Shared vs. private memories:** In a team setting, some memories should be shared (project decisions) and some private (personal preferences). The 6-tier importance model doesn't capture this distinction.

### 4.2 Concurrent Access Patterns -- NOT ANALYZED

SQLite in WAL mode supports concurrent reads but only one writer. No document discusses:

- **Write contention:** What happens when `memory_save` and `memory_index_scan` run simultaneously?
- **Read-during-write consistency:** Can a search return partial results if indexing is in progress?
- **Lock timeout:** What is the behavior when the database lock is held too long?
- **Session isolation:** The working memory and session dedup features assume a single active session. What if multiple sessions exist concurrently (e.g., multiple Claude Code windows)?

### 4.3 Memory Growth Rate and Cleanup Policies -- PARTIALLY ADDRESSED

The 5-state lifecycle (HOT through ARCHIVED) and deprecation tiers exist. Missing:

- **Growth projections:** How fast does the database grow in typical usage? Per-day, per-week, per-month estimates?
- **Automatic cleanup triggers:** When does ARCHIVED content get deleted? Is there a total size cap?
- **Embedding storage growth:** At what point does the embedding table dominate total database size?
- **Chunk proliferation:** Each chunked memory creates N additional rows. What is the chunk:parent ratio over time?
- **Garbage collection for orphans:** What happens to chunks when their parent is deleted? Causal edges when nodes are deleted?

---

## 5. Alternative Approaches Not Considered

### 5.1 Late Interaction Models (ColBERT) -- MENTIONED IN PASSING ONLY

The 140-recommendations "Missed Opportunities" table lists "ColBERT multi-vector" with a one-line note. No substantive analysis exists of:

- **How ColBERT works:** Per-token embeddings with MaxSim operation, enabling much richer matching than single-vector
- **Why it might be better for agent memory:** Agent queries are often complex multi-part questions. ColBERT's token-level matching handles these naturally.
- **Storage and performance trade-offs:** ColBERT requires storing N embeddings per memory (one per token). Storage grows 50-100x. Is this viable at current scale?
- **ColBERTv2 and PLAID:** More recent variants with compression that might be practical

### 5.2 Learned Sparse Representations (SPLADE) -- MENTIONED IN PASSING ONLY

The same "Missed Opportunities" table notes SPLADE. No analysis of:

- **How SPLADE replaces BM25:** Generates importance-weighted sparse vectors that capture semantic expansion
- **Relevance to the FTS5/BM25 redundancy:** The 141-analysis identifies HIGH correlation between FTS5 and BM25 (Section 5.2). SPLADE could replace BOTH with a single, superior lexical channel.
- **JavaScript/TypeScript compatibility:** Are there SPLADE implementations or ONNX models that run in Node.js?

### 5.3 Hybrid Dense-Sparse (Pinecone, Qdrant, Weaviate approaches) -- NOT ANALYZED

No document examines how production vector databases handle hybrid search:

- **Pinecone's sparse-dense:** Single query produces both dense and sparse vectors, searched in a unified index
- **Qdrant's named vectors:** Store multiple vector representations per point, each searchable independently
- **Weaviate's hybrid search:** BM25 + dense vector with configurable alpha parameter

These approaches are directly relevant because the system already does hybrid search. Understanding how production systems solve fusion could inform better architectural decisions.

### 5.4 Fine-Tuning Embeddings on the Corpus -- NOT ANALYZED

All documents treat embedding models as fixed black boxes. No analysis of:

- **Sentence transformer fine-tuning:** Fine-tuning on (query, relevant memory) pairs could dramatically improve vector search quality
- **Contrastive learning:** Using `memory_validate(wasUseful=true/false)` as positive/negative training signal
- **Matryoshka representation learning:** Train embeddings that work at multiple dimensionalities (mentioned in passing but not analyzed)
- **Practical barriers:** Data volume needed, computation cost, model hosting, versioning

### 5.5 BM25-Only Baseline Comparison -- NOT ANALYZED

This is the most significant methodological gap. No document establishes how well a simple BM25-only baseline performs. Without this:

- It is impossible to know if the 4-channel hybrid approach actually outperforms a single well-tuned channel
- The complexity cost of maintaining 4 channels, RRF fusion, and multi-stage reranking might not be justified
- The 141-analysis identifies FTS5+BM25 HIGH correlation, suggesting one lexical channel might suffice

**A baseline ablation study should be the FIRST action, not an afterthought.** R13 designs evaluation infrastructure but never proposes measuring channel ablation as a priority.

---

## 6. Philosophical/Foundational Gaps

### 6.1 Is Retrieval the Right Paradigm? -- NOT QUESTIONED

All 4 documents assume the retrieval-augmented paradigm is correct and focus on optimizing within it. No document questions whether:

- **Graph databases (Neo4j, etc.):** Would a property graph with traversal queries (Cypher, Gremlin) be more natural for agent memory than vector similarity search? The system already has a causal graph -- should it BE the primary access method?
- **Relational queries:** Many agent memory lookups are structured ("Find the decision for spec 003", "Get all memories about RRF fusion"). These are relational queries wearing a semantic-search costume. SQL might be faster, simpler, and more reliable.
- **LLM-based reasoning over all memories:** At current scale (hundreds of memories), could the agent simply receive ALL memory titles/summaries in context and let the LLM select relevant ones? This eliminates retrieval errors entirely at the cost of token consumption.
- **Programmatic access patterns:** How often does the agent actually need semantic search vs. structured lookup? If 70% of queries are "find by spec folder" or "find by trigger phrase," the semantic pipeline is wasted for those queries.

### 6.2 Is 4-Channel Hybrid Inherently Better Than Well-Tuned Single Channel? -- NOT ANALYZED

The documents assume more channels = better retrieval. No analysis of:

- **Ensemble overhead vs. benefit:** Adding channels increases complexity, latency, and maintenance burden. At what point does marginal diversity improvement NOT justify the cost?
- **Weak channel dilution:** If the graph channel (lowest developed) contributes noise more often than signal, it could REDUCE overall quality despite adding diversity
- **The 141-analysis itself identifies the problem:** FTS5 and BM25 are highly correlated (Section 5.2), meaning the system is effectively running 3 channels (vector, lexical, graph) while paying the complexity cost of 4. Nobody recommends consolidating the redundant channels.
- **Optimal channel count:** Literature on learning-to-rank and ensemble methods provides guidance on optimal ensemble size. None of this literature is cited.

### 6.3 The Indexing vs. Retrieval Investment Decision -- RAISED BUT NOT RESOLVED

The 141-analysis Section 2.3 raises the "Intelligence Conservation Law" (where to invest intelligence: index-time vs. query-time) but does not resolve it for this system:

- **Current state:** The system invests moderately at both index-time (embeddings) and query-time (multi-stage pipeline). Is this the right balance?
- **Alternative strategy:** Invest heavily at index-time (richer representations: summaries, entities, relationships, multi-vector embeddings) and simplify the query-time pipeline. This trades indexing cost for retrieval simplicity and reliability.
- **The cost asymmetry:** Indexing happens once per memory. Retrieval happens many times. Richer indexing amortizes well. No document performs this amortization analysis.

### 6.4 The Feedback Loop Bootstrap Problem -- NOT ANALYZED

Multiple recommendations (R11, R13, N3, N4) depend on feedback data that does not yet exist:

- **R13** needs query-result-selection triples, but `learnFromSelection` is dead code (no data collected)
- **R11** needs reinforcement signals, but the system has no mechanism to track which query led to which selection
- **N3** (consolidation) needs retrieval traversal logs, but no traversal logging exists
- **N4** (cold-start boost) needs creation timestamps (which exist) but also needs a baseline to calibrate against (which does not exist)

**The chicken-and-egg problem:** You need the evaluation framework (R13) to validate the improvements, but you need the improvements to generate the evaluation data. The documents propose building R13 first, but do not address how to bootstrap ground truth when no implicit feedback exists.

---

## 7. Security and Privacy Gaps -- NOT ANALYZED

None of the documents discuss:

- **Memory content sensitivity:** Memories may contain API keys, passwords, or sensitive business logic. Are they encrypted at rest?
- **Access control:** The constitutional tier implies safety-critical content. Who can modify constitutional memories? Is there an audit trail?
- **Memory poisoning:** If an attacker can inject memories (via spec folder creation), they can influence all future agent decisions. No threat model exists.
- **Embedding inversion attacks:** Research shows embeddings can be inverted to reconstruct original text. If embeddings are stored in FP32, they are effectively plaintext.

---

## 8. Cost Analysis Gaps -- NOT ANALYZED

No document provides:

- **Embedding generation cost:** How much does it cost (in API calls and latency) to index 100 memories? 1000?
- **Per-query cost breakdown:** What is the dollar cost per search query? (Embedding the query + cross-encoder reranking calls)
- **Cost comparison of recommendations:** R8 (summaries via LLM) and R10 (entity extraction via LLM) add LLM calls at index time. What is the incremental cost?
- **Cost-quality Pareto frontier:** At what cost level does quality plateau? Could a cheaper approach achieve 90% of the quality at 10% of the cost?

---

## Summary of Gap Severity

| Gap Category | Severity | Rationale |
|---|---|---|
| **BM25-only baseline missing** | CRITICAL | Cannot justify complexity without baseline comparison |
| **Agent consumption analysis** | HIGH | System exists to serve agents; format/count analysis absent |
| **Test coverage analysis** | HIGH | 31 recommendations proposed without understanding current test state |
| **Monitoring/alerting** | HIGH | Production system with no operational observability plan |
| **Feedback bootstrap problem** | HIGH | Circular dependency in R11/R13/N3/N4 not addressed |
| **Multi-channel justification** | MEDIUM | Assumed but unproven that 4 channels > well-tuned 1 channel |
| **Concurrent access** | MEDIUM | SQLite WAL limitations not analyzed for real usage patterns |
| **Security/privacy** | MEDIUM | No threat model for a system that stores and retrieves decisions |
| **Cost analysis** | MEDIUM | No cost modeling despite LLM-dependent recommendations |
| **Alternative paradigms** | LOW-MEDIUM | Retrieval may not be optimal but is the established approach |
| **ColBERT/SPLADE analysis** | LOW | Mentioned in passing; full analysis would be nice but not blocking |
| **Multi-user scenarios** | LOW | Single-user is the current reality; future concern |

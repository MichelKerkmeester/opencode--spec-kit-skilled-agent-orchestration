# Actionable Recommendations: Upgrading `system-speckit` Memory MCP

<!-- ANCHOR:decision-executive-summary-138 -->
## 1. Executive Summary

The `system-speckit` memory Model Context Protocol (MCP) server currently provides semantic retrieval (`memory_search`, `memory_context`) and cognitive features like attention decay and causal linking. However, as the repository of specification documents and memories grows, flat vector search inevitably suffers from precision degradation, redundancy, and context window saturation. 

Based on the analysis of `graphrag_mcp`, `WiredBrain`, `ragflow`, and the Tri-Hybrid RAG paradigms, we can significantly upgrade the MCP server’s retrieval architecture. The focus is on implementing **Hybrid Tri-Search** (combining SQL metadata, BM25, and embeddings), **Reciprocal Rank Fusion (RRF)**, and **Maximal Marginal Relevance (MMR)** to drastically improve the fidelity and diversity of the context payloads.
<!-- /ANCHOR:decision-executive-summary-138 -->

<!-- ANCHOR:decision-applicable-patterns-for-our-use-case-138 -->
## 2. Applicable Patterns for Our Use Case

### 2.1 Hybrid Tri-Search (Metadata + FTS5 + Vectors)
**Why it applies:** `system-speckit` currently filters by `specFolder`, `minState`, and `tier`. However, purely semantic vector search often misses exact technical identifiers (e.g., `REQ-006`, variable names, specific component IDs). 
**Action:** Implement SQLite FTS5 (Full-Text Search) for sparse BM25 scoring. The new pipeline will be: 
1. **Metadata Filter (SQL):** `WHERE tier IN (...) AND state >= (...)`
2. **Dense Search (Vector):** Cosine similarity for semantic meaning.
3. **Sparse Search (FTS5):** Keyword precision for exact matches.

### 2.2 Reciprocal Rank Fusion (RRF)
**Why it applies:** Combining vector similarity scores (0.0 to 1.0) with BM25 scores (unbounded) is mathematically challenging. 
**Action:** Discard the absolute scores and use the RRF ordinal formula to merge the two lists. This guarantees that memories highly ranked in *both* semantic meaning and exact keywords bubble to the top.

### 2.3 Maximal Marginal Relevance (MMR) for Token Efficiency
**Why it applies:** The LLM context window is a scarce resource (Token Budget: ~2000 for `memory_context`). Standard vector search often returns 5 variations of the same decision record.
**Action:** Implement MMR to penalize redundant memories. The MCP server will dynamically re-rank candidates, ensuring the final context payload is diverse and provides maximum information density per token.

### 2.4 Hierarchical Addressing (Pre-filtering)
**Why it applies:** WiredBrain proves that reducing the search space by 99.9% before vector search is the key to scaling on low-VRAM machines.
**Action:** While `system-speckit` uses `specFolder` as a hard filter, we can extend this by automatically inferring the "Gate/Branch" (e.g., `frontend`, `backend`, `infrastructure`, `documentation`) using a lightweight classifier, allowing cross-folder searches to remain highly precise.
<!-- /ANCHOR:decision-applicable-patterns-for-our-use-case-138 -->

<!-- ANCHOR:decision-integration-opportunities-138 -->
## 3. Integration Opportunities

The `system-speckit` memory MCP is built on SQLite (with an assumed vector extension like `sqlite-vss` or a separate vector store). SQLite natively supports the `FTS5` extension. 
*   **Database Schema Update:** We can create a virtual `FTS5` table tracking the `title`, `triggerPhrases`, and `content` of each memory.
*   **Causal Graph Expansion:** The `memory_causal_link` relationships (caused, enabled, supersedes) effectively form a graph. We can use SQLite Recursive CTEs (`WITH RECURSIVE`) to execute the `memory_drift_why` logic entirely within the database engine, returning 1-hop and 2-hop memory clusters identically to `graphrag_mcp`.
<!-- /ANCHOR:decision-integration-opportunities-138 -->

<!-- ANCHOR:decision-architecture-improvements-we-could-adopt-138 -->
## 4. Architecture Improvements We Could Adopt

### 4.1 RAG Fusion (Multi-Query Orchestration)
For the `memory_context(mode="deep")` tool, implement RAG Fusion. Instead of relying on the single user prompt, the MCP server internally calls a fast, cheap LLM pass (or uses the prompt directly) to generate 3 derivative queries:
1. `Original: "How does the caching system work?"`
2. `Variant 1: "Redis cache invalidation strategy"`
3. `Variant 2: "Cache hit ratio optimization"`
The server runs Hybrid Search on all three, fusing the results via RRF.

### 4.2 Transparent Reasoning Module (TRM) Fallback
Adopt WiredBrain’s TRM philosophy: "Integrity over Speed." 
If `memory_search` yields an RRF top score below a critical threshold (e.g., evidence gap detected), the MCP server should explicitly inject a system warning into the payload:
`[WARNING: Low confidence memory match. Synthesize from first-principles or use websearch tools instead of relying on this context.]`
<!-- /ANCHOR:decision-architecture-improvements-we-could-adopt-138 -->

<!-- ANCHOR:decision-implementation-strategies-prioritized-by-impact-effort-138 -->
## 5. Implementation Strategies (Prioritized by Impact/Effort)

### Phase 1: RRF + BM25 Integration (High Impact, Low Effort)
1.  **Migration:** Add an `FTS5` virtual table to the SQLite memory database.
2.  **Indexing:** Modify `generate-context.js` to insert the memory `content` and `triggerPhrases` into the `FTS5` table alongside the vector generation.
3.  **Retrieval:** In `memory_search`, execute the `FTS5` query and the `Vector` query in parallel. 
4.  **Fusion:** Implement the `RRF = 1 / (60 + rank)` formula in TypeScript to sort the final list.

### Phase 2: Token-Optimized Diversity via MMR (High Impact, Medium Effort)
1.  **Retrieval:** Fetch the top 20 results via the Phase 1 RRF pipeline.
2.  **MMR Reranking:** In TypeScript, implement the MMR equation. Since we already have the embeddings for the top 20 candidates, computing the pairwise cosine similarities takes milliseconds.
3.  **Truncation:** Select the top 5 diverse memories and return them to the LLM, ensuring the 2000-token budget is spent efficiently.

### Phase 3: RAG Fusion for `mode="deep"` (Medium Impact, Medium Effort)
1.  **Tool Update:** When `memory_context` is invoked with `mode="deep"`, intercept the query.
2.  **Expansion:** Use the current LLM connection to generate 2-3 query variants.
3.  **Parallel Execution:** Run the Phase 1+2 pipeline asynchronously for all variants (`Promise.all`), merging the arrays via RRF.

### Phase 4: Autonomous KG Extraction (High Impact, High Effort)
1.  **Extraction:** During `generate-context.js`, use a lightweight NER (Named Entity Recognition) script or an LLM call to extract structural entities (e.g., `Class: DatabaseConnection`, `Component: AuthGuard`) from the memory content.
2.  **Storage:** Store these in a relational `entities` and `memory_entities` mapping table.
3.  **Graph Search:** Allow the MCP to return not just the memory, but its related components via SQL joins, effectively mirroring the capabilities of `graphrag_mcp`.
<!-- /ANCHOR:decision-implementation-strategies-prioritized-by-impact-effort-138 -->

<!-- ANCHOR:decision-potential-risks-or-considerations-138 -->
## 6. Potential Risks or Considerations

*   **Latency vs. Real-time Needs:** RAG Fusion (Multi-Query) adds a network hop (LLM call) *before* the database is queried. This should be strictly limited to `mode="deep"` to prevent degrading the UX of fast, conversational agent interactions.
*   **MMR Compute Overhead:** MMR requires O(N²) similarity calculations. If N > 100, doing this in JavaScript/TypeScript might block the event loop. We must enforce a hard limit (e.g., N=30) before applying MMR.
*   **Database Synchronization:** Keeping the FTS5 table, relational metadata, and vector index in perfect sync during `memory_update` or `memory_delete` requires robust SQL transactions.
<!-- /ANCHOR:decision-potential-risks-or-considerations-138 -->

<!-- ANCHOR:decision-specific-code-patterns-and-techniques-138 -->
## 7. Specific Code Patterns and Techniques

### 7.1 Reciprocal Rank Fusion (TypeScript Pattern)
```typescript
function reciprocalRankFusion(vectorResults, bm25Results, k = 60) {
    const scores = new Map<number, number>(); // memoryId -> score

    // Score Vector Results
    vectorResults.forEach((mem, index) => {
        const rank = index + 1;
        scores.set(mem.id, (scores.get(mem.id) || 0) + (1 / (k + rank)));
    });

    // Score BM25 Results
    bm25Results.forEach((mem, index) => {
        const rank = index + 1;
        scores.set(mem.id, (scores.get(mem.id) || 0) + (1 / (k + rank)));
    });

    // Sort by combined RRF score descending
    return Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id);
}
```

### 7.2 Maximal Marginal Relevance (TypeScript Pattern)
```typescript
function calculateMMR(candidateEmbeddings, selectedEmbeddings, lambda = 0.5) {
    let maxMmrScore = -Infinity;
    let bestCandidateIndex = -1;

    for (let i = 0; i < candidateEmbeddings.length; i++) {
        const candidate = candidateEmbeddings[i];
        
        // Sim(d_i, Query) is pre-calculated from the vector search
        const relevance = candidate.similarityToQuery; 
        
        // Max_Sim(d_i, d_selected)
        let maxSimilarityToSelected = 0;
        for (const selected of selectedEmbeddings) {
            const sim = cosineSimilarity(candidate.vector, selected.vector);
            if (sim > maxSimilarityToSelected) maxSimilarityToSelected = sim;
        }

        // MMR Equation
        const mmrScore = (lambda * relevance) - ((1 - lambda) * maxSimilarityToSelected);
        
        if (mmrScore > maxMmrScore) {
            maxMmrScore = mmrScore;
            bestCandidateIndex = i;
        }
    }
    return bestCandidateIndex;
}
```
<!-- /ANCHOR:decision-specific-code-patterns-and-techniques-138 -->

<!-- ANCHOR:decision-migration-and-adoption-pathways-138 -->
## 8. Migration and Adoption Pathways

1.  **Database Migration Script:** Create an SQLite migration script to instantiate the `FTS5` table and backfill it with existing data from the `memories` table.
2.  **Tool Cache Invalidation:** The addition of BM25 and RRF will fundamentally alter ranking. We must ensure the `bypassCache` flag is triggered or the MCP cache is cleared upon deployment.
3.  **Progressive Rollout:** Introduce the Tri-Hybrid pipeline as a new `mode="fusion"` in the `memory_context` tool first. Once latency and precision are validated against the `memory_health` and `memory_stats` metrics, promote it to override the default `mode="auto"`.
4.  **Learning History Tracking:** Utilize the existing `task_preflight` and `task_postflight` tools (Learning Index LI) to empirically measure if the RRF/MMR contexts lead to higher `ContextImprovement` scores during standard coding tasks.
<!-- /ANCHOR:decision-migration-and-adoption-pathways-138 -->


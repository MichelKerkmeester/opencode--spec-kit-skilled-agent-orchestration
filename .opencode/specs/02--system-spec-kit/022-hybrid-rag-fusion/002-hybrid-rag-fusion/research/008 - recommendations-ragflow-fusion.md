# Actionable Recommendations: Agentic Context & Fusion Memory MCP (Agent 4)

<!-- ANCHOR:decision-applicable-patterns-for-our-use-case-138 -->
## 1. Applicable Patterns for Our Use Case
The `system-speckit` memory MCP server operates on a strict ~2000 token budget for its `memory_context` tool. To optimize this, the MCP must adopt **Reciprocal Rank Fusion (RRF)**, **Multi-Query Generation (RAG Fusion)**, and **Maximal Marginal Relevance (MMR)**.
<!-- /ANCHOR:decision-applicable-patterns-for-our-use-case-138 -->

<!-- ANCHOR:decision-integration-opportunities-138 -->
## 2. Integration Opportunities
- **BM25 + Vector Fusion via RRF:** `system-speckit` can implement SQLite FTS5 alongside its existing vector search. RRF will serve as the integration layer, effortlessly merging the keyword exact-matches with semantic approximations.
- **MMR Reranking Node:** Before returning the final array of memories to the LLM, a lightweight TypeScript MMR function can prune the payload, maximizing the diversity of the decisions and implementation summaries provided.
<!-- /ANCHOR:decision-integration-opportunities-138 -->

<!-- ANCHOR:decision-architecture-improvements-we-could-adopt-138 -->
## 3. Architecture Improvements We Could Adopt
- **Template-Based Extraction:** When `generate-context.js` indexes a spec document, it should use template-based parsing. For example, explicitly separating the `Checklist` from the `Decision Record` and tagging them with metadata, allowing the MCP server to filter `contextType=decision` vs `contextType=task`.
<!-- /ANCHOR:decision-architecture-improvements-we-could-adopt-138 -->

<!-- ANCHOR:decision-implementation-strategies-prioritized-138 -->
## 4. Implementation Strategies (Prioritized)
1. **Phase 1: Hybrid BM25 + Vector + RRF (High Impact, Low Effort)**
   - Add an FTS5 virtual table to the memory database.
   - Run FTS5 and Vector searches concurrently in `memory_search`.
   - Fuse the results using RRF in TypeScript and return the top K.
2. **Phase 2: MMR Diversity Pruning (High Impact, Medium Effort)**
   - Extract embeddings for the top 20 RRF candidates.
   - Implement MMR to select the top 5 most diverse, high-relevance memories.
3. **Phase 3: RAG Fusion for `mode="deep"` (Medium Impact, High Effort)**
   - Trigger multi-query generation within the MCP server when `mode="deep"` is specified, expanding the initial prompt to 3 variants to ensure absolute recall.
<!-- /ANCHOR:decision-implementation-strategies-prioritized-138 -->

<!-- ANCHOR:decision-specific-code-patterns-138 -->
## 5. Specific Code Patterns
### Maximal Marginal Relevance (MMR) in TypeScript
```typescript
function applyMMR(candidates: Memory[], lambda: number = 0.5, limit: number = 5): Memory[] {
    const selected: Memory[] = [];
    while (selected.length < limit && candidates.length > 0) {
        let bestIndex = -1;
        let maxMmr = -Infinity;

        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            const relevance = candidate.similarityScore; // from vector DB
            let maxSimToSelected = 0;

            for (const s of selected) {
                const sim = computeCosine(candidate.embedding, s.embedding);
                if (sim > maxSimToSelected) maxSimToSelected = sim;
            }

            const mmrScore = (lambda * relevance) - ((1 - lambda) * maxSimToSelected);
            if (mmrScore > maxMmr) {
                maxMmr = mmrScore;
                bestIndex = i;
            }
        }
        selected.push(candidates[bestIndex]);
        candidates.splice(bestIndex, 1);
    }
    return selected;
}
```
<!-- /ANCHOR:decision-specific-code-patterns-138 -->

<!-- ANCHOR:decision-migration-or-adoption-pathways-138 -->
## 6. Migration or Adoption Pathways
Deploy MMR behind a feature flag (`enableDedup=true` handles session deduplication, but we can add `applyDiversity=true` for MMR). Roll out FTS5/RRF fusion as the default backend behavior for all `memory_search` queries, instantly upgrading the exact-match recall capabilities of the MCP server.
<!-- /ANCHOR:decision-migration-or-adoption-pathways-138 -->


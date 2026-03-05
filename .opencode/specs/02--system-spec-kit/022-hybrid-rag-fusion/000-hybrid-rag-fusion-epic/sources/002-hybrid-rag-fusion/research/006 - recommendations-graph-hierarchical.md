# Actionable Recommendations: Graph-Augmented Memory MCP (Agent 3)

<!-- ANCHOR:decision-applicable-patterns-for-our-use-case-138 -->
## 1. Applicable Patterns for Our Use Case
The `system-speckit` memory MCP server can immediately benefit from **Graph-Augmented Retrieval**. The server currently supports `memory_causal_link` (caused, enabled, supersedes). By treating the SQLite database as an implicit Knowledge Graph, we can upgrade `memory_search` to return vector matches *plus* their 1-hop causal neighbors automatically.
<!-- /ANCHOR:decision-applicable-patterns-for-our-use-case-138 -->

<!-- ANCHOR:decision-integration-opportunities-138 -->
## 2. Integration Opportunities
- **SQLite Recursive CTEs:** Since `system-speckit` already stores causal links, we can use `WITH RECURSIVE` queries in SQLite to fetch connected memories. 
- **SetFit/Heuristic Gate Routing:** Implement a lightweight classification step that maps user queries to specific `specFolders` or `tiers` before vector search, mirroring WiredBrain's 99.9% search reduction.
<!-- /ANCHOR:decision-integration-opportunities-138 -->

<!-- ANCHOR:decision-architecture-improvements-we-could-adopt-138 -->
## 3. Architecture Improvements We Could Adopt
- **Transparent Reasoning Module (TRM):** Implement a "Confidence Threshold" in the MCP response. If similarity scores are below 0.60, the MCP returns a warning: `[EVIDENCE GAP DETECTED: Synthesize from first principles]`, preventing the LLM from hallucinating on poor context.
<!-- /ANCHOR:decision-architecture-improvements-we-could-adopt-138 -->

<!-- ANCHOR:decision-implementation-strategies-prioritized-138 -->
## 4. Implementation Strategies (Prioritized)
1. **Phase 1: 1-Hop Graph Context Expansion (High Impact, Low Effort)**
   - Modify the `memory_search` MCP tool. After fetching the top K semantic matches, run a subsequent SQL query against the `causal_links` table to fetch connected memories (e.g., `sourceId` and `targetId`).
   - Append these connected memories to the context payload.
2. **Phase 2: TRM Implementation (Medium Impact, Low Effort)**
   - Implement a soft-block in the MCP response format when the highest cosine similarity is low, explicitly instructing the LLM to doubt the retrieved context.
<!-- /ANCHOR:decision-implementation-strategies-prioritized-138 -->

<!-- ANCHOR:decision-specific-code-patterns-138 -->
## 5. Specific Code Patterns
### Recursive Graph Expansion in SQLite (TypeScript)
```typescript
async function fetchGraphNeighbors(memoryIds: string[]): Promise<any[]> {
    const placeholders = memoryIds.map(() => '?').join(',');
    const query = `
        SELECT m.*, c.relation 
        FROM causal_links c
        JOIN memories m ON (c.sourceId = m.id OR c.targetId = m.id)
        WHERE (c.sourceId IN (${placeholders}) OR c.targetId IN (${placeholders}))
          AND m.id NOT IN (${placeholders}) -- exclude already fetched
    `;
    return await db.all(query, [...memoryIds, ...memoryIds]);
}
```
<!-- /ANCHOR:decision-specific-code-patterns-138 -->

<!-- ANCHOR:decision-migration-or-adoption-pathways-138 -->
## 6. Migration or Adoption Pathways
Introduce `enableCausalBoost=true` as an optional flag in the `memory_context` tool. If enabled, the system will seamlessly expand the vector search with relational edges, progressively rolling out the GraphRAG capability without breaking existing workflows.
<!-- /ANCHOR:decision-migration-or-adoption-pathways-138 -->


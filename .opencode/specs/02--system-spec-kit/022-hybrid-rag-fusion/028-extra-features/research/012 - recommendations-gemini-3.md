# Document 2 - Actionable Recommendations: system-spec-kit Memory MCP Evolution

## Executive Summary
This document translates the architectural insights from Cognee, QMD, and the ArtemXTech stack into actionable, prioritized improvements for the `system-spec-kit` and its MCP Server (`@spec-kit/mcp-server` v1.7.2). Our goal is to enhance context preservation, lower token consumption, and improve structural reasoning while maintaining the system's reliance on SQLite and hybrid search.

---

## 1. Applicable Patterns for Our Use Case

*   **Triple-Store Emulation via SQLite:** We can mimic Cognee's Graph DB natively in our existing SQLite index by expanding `SPECKIT_ENTITY_LINKING` into explicit node/edge tables.
*   **Contextual Path Trees:** QMD's context tree maps perfectly onto our `specs/###-short-name/` structure.
*   **Frontmatter-First Loading:** Adapting Artem’s Obsidian metadata queries to optimize `memory_list()` and candidate generation in `memory_search()`.
*   **Session State Indexing:** Turning `sk-git` and `system-spec-kit` tool traces into auto-indexed background memories.

---

## 2. Integration Opportunities & Architecture Improvements

### 2.1 Contextual Trees for Spec Folders (High Impact, Low Effort)
Currently, `memory_search()` returns chunks of text with some metadata. 
**Improvement:** Implement QMD’s Contextual Tree pattern. Since spec folders follow a strict hierarchy (`specs/007-auth/001-login`), the MCP server should dynamically prepend a "Domain Context" string to all returned search results originating from that folder.
*   *Implementation:* Modify `memory_search()` to resolve the parent `spec.md` of any retrieved memory chunk, extracting the Level 1 `## Goal` block, and injecting it as a lightweight header (`[Context: Auth System > Login]`) into the `ContextEnvelope`.

### 2.2 Frontmatter-First Paging (High Impact, Medium Effort)
The `system-spec-kit` MCP token budget (L1:2000, L2:1500) can easily be exhausted by dense files.
**Improvement:** Adopt Artem's token-saving strategy. Create a new mode in `memory_context(mode='discovery')` or modify `memory_list()`.
*   *Implementation:* Instead of returning the `content` field, return only the YAML frontmatter, `MEMORY_TITLE`, and auto-extracted entities. Allow the agent to use a secondary call (like `read_file` or a targeted `memory_search`) to pull the full body only if the metadata matches its current strategy.

### 2.3 Structural Graph Overlay (Medium Impact, High Effort)
`system-spec-kit` currently supports `SPECKIT_AUTO_ENTITIES` for linking. To reach Cognee-level reasoning, we need true graph traversal.
**Improvement:** Build a lightweight relational triple-store on top of the existing SQLite `context-index.sqlite`. 
*   *Implementation:* During `memory_save()`, run a lightweight extraction prompt (or use the existing entity extraction) to strictly output JSON arrays of `[Source, Relationship, Target]`. Store these in a new SQLite table `memory_edges`. 
*   *Query:* Add a `memory_traverse(entity, depth=2)` MCP tool that allows the agent to recursively walk relationships (e.g., `UserAuth` -> *blocks* -> `DatabaseMigration`).

### 2.4 Auto-Indexing Ephemeral Sessions (Medium Impact, Low Effort)
*   *Assumes: `system-spec-kit` has access to the current session's tool execution history or shell logs.*
**Improvement:** Prevent context loss between CLI sessions. Implement an ArtemXTech-style "Session Hook". 
*   *Implementation:* Extend the `generate-context.js` script to ingest the last 50 lines of `.vscode/sessions.json` or CLI trace history. Automatically write this to `scratch/session-log.md` and index it silently via `memory_index_scan()`. 

### 2.5 LLM Re-Ranking / Query Expansion (High Impact, Medium Effort)
Currently, `SPECKIT_ADAPTIVE_FUSION` uses intent-aware weighted Reciprocal Rank Fusion (RRF) across Vector + BM25.
**Improvement:** Adopt QMD's `query` mode. RRF is fast but lacks contextual reasoning. 
*   *Implementation:* Introduce an optional `SPECKIT_LLM_RERANK` feature flag. After RRF generates the top 15 candidates, use the agent's active LLM context (via a lightweight pre-flight prompt) to score the relevance of the 15 chunks against the user's intent. Return only the top 5 re-ranked results.

---

## 3. Implementation Strategies (Prioritized)

| Priority | Feature | Strategy |
| :--- | :--- | :--- |
| **1** | **Contextual Spec Trees** | Update `mcp_server/lib/search/pipeline.ts`. Parse `spec.md` at index time and store a `domain_context` column in SQLite. Append to results. |
| **2** | **Frontmatter Paging** | Modify `memory_list` to accept an `includeBody=false` parameter. Expose this broadly to `@context` agents. |
| **3** | **LLM Re-ranking Expansion** | Add a new layer to the search architecture (candidate generation → fusion → **reranking** → filtering). Fall back to RRF if `SPECKIT_LLM_RERANK=false`. |
| **4** | **SQLite Graph Overlay** | Define schema `CREATE TABLE edges (source_id, target_id, relation_type)`. Update `SPECKIT_ENTITY_LINKING` logic to populate this during `generate-context.js`. |

---

## 4. Specific Code Patterns to Leverage

### Pattern 1: Contextual Tree Injection (TypeScript snippet for MCP)
```typescript
// During retrieval formatting in search-pipeline.ts
function injectContextualTree(memoryChunk: MemoryResult, vaultRoot: string): string {
    // If the memory lives in specs/005-database/memory/file.md
    if (memoryChunk.specFolder) {
        const specSummary = getSpecSummary(memoryChunk.specFolder); // Fetched from local cache
        return `[Domain Context: ${memoryChunk.specFolder} - ${specSummary}]
${memoryChunk.content}`;
    }
    return memoryChunk.content;
}
```

### Pattern 2: Triple-Store Edge Schema (SQLite)
Leverage existing SQLite DB rather than introducing a heavy dependency like Kuzu.
```sql
CREATE TABLE causal_edges (
    edge_id TEXT PRIMARY KEY,
    source_memory_id TEXT NOT NULL,
    target_memory_id TEXT NOT NULL,
    relation_type TEXT CHECK(relation_type IN ('IMPLEMENTS', 'BLOCKS', 'DEPRECATES', 'RELATES_TO')),
    weight REAL DEFAULT 1.0,
    FOREIGN KEY(source_memory_id) REFERENCES working_memory(id)
);
```

---

## 5. Potential Risks or Considerations

*   **Token Budget Blowout (Context Trees):** Injecting Contextual Trees into every search result will consume the strict L2 token budget (1500 chars/3.5) faster. We must strictly truncate the injected context to < 100 characters.
*   **Latency Spikes (LLM Reranking):** QMD can rerank fast because the model is pinned in local VRAM. `system-spec-kit` likely relies on API calls. Reranking via external API will add 1-3 seconds to `memory_search()`, necessitating an async UX or strict timeout fallbacks.
*   **Graph Maintenance Complexity:** Implementing the SQLite Graph Overlay risks the same "cascade delete" issues seen in Cognee. We must ensure that `memory_delete()` triggers use SQLite `ON DELETE CASCADE` constraints to clean up orphaned edges automatically.

---

## 6. Migration and Adoption Pathways

1.  **Phase 1 (Immediate - v1.8.0):** Implement Frontmatter Paging (`memory_list(includeBody: false)`) and Contextual Spec Trees. These require zero schema changes to the `context-index.sqlite`.
2.  **Phase 2 (Near Term - v1.9.0):** Introduce `SPECKIT_LLM_RERANK` behind a default-off feature flag. Monitor the 4-dimension retrieval telemetry (`SPECKIT_EXTENDED_TELEMETRY`) to compare latency/quality vs standard RRF.
3.  **Phase 3 (Long Term - v2.0.0):** Expand the `SPECKIT_ENTITY_LINKING` database schema to include the `causal_edges` table, officially bridging `system-spec-kit` from a Vector+BM25 store into a true Semantic Graph system analogous to Cognee.

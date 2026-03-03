# Document 2: Actionable Recommendations for System-Spec-Kit Memory

Based on the architectural analysis of Cognee and QMD, the following are concrete, actionable recommendations to enhance our internal System-Spec-Kit Memory MCP server. They are designed to improve retrieval precision, reduce cloud dependencies, and formalize structural graph reasoning.

---

## 1. Implement Local On-Device Reranking (Inspired by QMD)

**Context:** Currently, our architecture utilizes `SPECKIT_CROSS_ENCODER` which relies on external provider logic or complex pipeline integrations. QMD proves that local, small-parameter models (like `qwen3-reranker-0.6B`) provide enterprise-grade reranking via `node-llama-cpp` with zero cloud latency.

**Implementation Strategy:**
1.  **Adopt `node-llama-cpp`:** Integrate `node-llama-cpp` as a peer dependency specifically for the reranking stage in `lib/search/hybrid-search.ts`.
2.  **Pipeline Adjustment:** Allow the existing 5-channel fusion (RRF) to generate a broader "Top 50" candidate pool. Pass this pool to the local GGUF reranker to select the final "Top 10" candidates to be sent back to the LLM.
3.  **Fallback Logic:** If the host machine lacks sufficient VRAM (e.g., <16GB), automatically fallback to the existing algorithmic RRF/MMR pipeline.

**Specific Code Pattern:**
```typescript
// lib/search/local-reranker.ts
import { getLlama, LlamaChatSession } from "node-llama-cpp";

export async function rerankCandidates(query: string, candidates: MemoryRow[]): Promise<MemoryRow[]> {
    if (!process.env.ENABLE_LOCAL_RERANKER) return candidates;
    
    // Load a lightweight 0.5B reranker model
    const llama = await getLlama();
    const model = await llama.loadModel({ modelPath: "./models/bge-reranker-base.gguf" });
    const context = await model.createContext();
    
    // Rerank logic: score query against each candidate content
    for (const candidate of candidates) {
        candidate.rerankScore = await computeCrossEncoderScore(context, query, candidate.content_text);
    }
    
    return candidates.sort((a, b) => b.rerankScore - a.rerankScore).slice(0, 10);
}
```
*Impact/Effort:* **High Impact / Medium Effort.** Significantly boosts the relevance of surfaced context without touching cloud APIs.

---

## 2. Formalize the "Cognify" ETL Step for the Causal Graph (Inspired by Cognee)

**Context:** We currently have an excellent 6-type causal graph (`caused`, `supersedes`, `contradicts`, etc.) and basic entity linking (`SPECKIT_ENTITY_LINKING`). However, relationships are mostly created manually via the `memory_causal_link` tool or implicitly.

**Implementation Strategy:**
1.  **Automated Extraction Pipeline:** Create an explicit ETL layer during `memory_save`. Before a memory is saved to the SQLite database, pass it through a structured LLM extraction prompt (using the standard coding LLM, e.g., Claude/Gemini) that strictly outputs JSON matching our `causal_edges` schema.
2.  **Schema Enforcement:** Ask the LLM to identify if the current implementation summary *supersedes* any past implementations stored in the vector database.
3.  **Implicit to Explicit Nodes:** Treat every `specFolder` name as a master node in the graph, and explicitly link new memories to these master nodes during the `memory_index_scan`.

**Integration Opportunity:**
Enhance the existing `Prediction Error Gating` logic in `lib/cognitive/prediction-error-gate.ts`. When a `HIGH_MATCH` (0.90-0.94) is detected, automatically trigger the Cognify step to ask the LLM: *"Does Document A supersede Document B, or do they contradict?"* and automatically write the resulting `causal_edge`.

*Impact/Effort:* **High Impact / High Effort.** Requires reliable JSON output and token budgeting during the save operation, but dramatically improves the `memory_drift_why` tool.

---

## 3. Real-Time Filesystem Watching (Addressing Identified Constraints)

**Context:** Our current constraint is that the index relies on MCP startup or manual `memory_index_scan` triggers. This creates a desync if a developer modifies a `.md` file directly in their IDE. 

**Implementation Strategy:**
1.  **Chokidar Integration:** Implement a lightweight background file watcher using a library like `chokidar` in a new module: `core/file-watcher.ts`.
2.  **Debounced Hashing:** Watch the `MEMORY_BASE_PATH` specifically for `*.md` files. On a `change` event, wait 5 seconds (debounce), then compute the SHA-256 content hash (reusing our existing logic in `lib/parsing/memory-parser.ts`). 
3.  **Targeted Re-indexing:** If the hash differs from the database, silently invoke the `memory_save()` flow in the background, updating the `sqlite-vec` embeddings and `memory_fts` tables without requiring an explicit agent tool call.

*Impact/Effort:* **Medium Impact / Low Effort.** Solves a major UX friction point with minimal architectural changes, keeping the memory state seamlessly synchronized with the filesystem.

---

## 4. Unify the "Tri-Store" Abstraction (Architectural Cleanup)

**Context:** We currently use SQLite for everything (`sqlite-vec` for vectors, FTS5 for text, standard tables for edges). While technically unified, the code in `lib/storage/` handles these concepts somewhat fluidly. Cognee's strict logical separation of Relational, Vector, and Graph operations is cleaner for maintenance.

**Implementation Strategy:**
Refactor the `lib/storage/` layer to expose three distinct internal interfaces that map to the underlying SQLite implementation.
1.  `IVectorStore` -> Manages `vec_memories` table and ANN queries.
2.  `IGraphStore` -> Manages `causal_edges` table and recursive CTEs for relationship traversal.
3.  `IDocumentStore` -> Manages `memory_index`, `memory_fts`, and `checkpoints`.

This prevents bleeding SQL logic into the cognitive scoring modules and allows us to easily swap `sqlite-vec` for LanceDB or Qdrant in the future if we hit performance limits on massive monorepos.

---

## 5. Leverage ANCHOR Tags for Graph Entity Resolution

**Context:** We currently use ANCHOR tags (`<!-- ANCHOR: decisions -->`) for token-efficient retrieval. We can extend this brilliant pattern to solve graph ingestion.

**Implementation Strategy:**
Instead of passing full documents to the LLM to extract relationships (which is expensive), we enforce a convention where explicitly tagged anchors are automatically registered as specific graph nodes. 
*   Content inside `<!-- ANCHOR: architecture -->` is automatically vectorized and registered as an `ArchitectureNode`.
*   Content inside `<!-- ANCHOR: dependencies -->` is registered as a `DependencyNode`.

By combining our existing ANCHOR parsing (`lib/chunking/anchor-chunker.ts`) with Cognee's GraphRAG philosophy, we can build a deterministic knowledge graph *without* the expensive LLM "Cognify" step, simply by parsing markdown structure.

**Potential Risks & Considerations:**
*   **VRAM Contention (Rerankers):** If we adopt local GGUF rerankers, we must ensure it doesn't starve the primary IDE LLM (e.g., Copilot/Cursor) of GPU resources. The fallback to algorithmic RRF must be robust.
*   **Database Locking:** Real-time file watching (Recommendation 3) combined with agent-driven `memory_save` operations could cause SQLite `SQLITE_BUSY` locks. We must strictly enforce WAL (Write-Ahead Logging) mode and use robust retry mechanisms in `lib/storage/`.

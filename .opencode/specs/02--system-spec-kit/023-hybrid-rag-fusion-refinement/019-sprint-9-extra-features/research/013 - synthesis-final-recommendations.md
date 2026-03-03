# Synthesis: Cross-AI Research Recommendations for system-spec-kit

## Methodology

This synthesis analyzes 12 research documents produced by 6 independent AI agents across 2 platforms:

- **Codex agents (C1, C2, C3):** gpt-5.3-codex via Codex CLI, each producing an analysis + recommendations pair (files 001-006)
- **Gemini agents (G1, G2, G3):** Gemini 3.1-pro-preview via Gemini CLI, each producing an analysis + recommendations pair (files 007-012)

Each agent independently analyzed three sources:
1. **Cognee** (`topoteretes/cognee`) -- an enterprise graph-vector memory engine with ECL pipeline and MCP exposure
2. **QMD** (`tobi/qmd`) -- a local-first hybrid search engine for Markdown with BM25 + vector + reranking
3. **ArtemXTech X post** (status/2028330693659332615) -- a practitioner signal about session continuity and context engineering

**Consensus scoring:** Each recommendation is scored by (a) how many of the 6 agents independently surfaced it, (b) whether both Codex AND Gemini platforms agree (stronger cross-model signal), and (c) specificity of the recommendation (abstract advice vs. concrete code patterns).

**Source material notes:** Codex agents had deeper access to raw source code files and provided precise URL references. Gemini agents found a LinkedIn mirror of the ArtemXTech post (yielding richer insights from that source) and demonstrated familiarity with the existing system-spec-kit codebase internals, referencing specific config flags and file paths. This complementarity strengthens the synthesis: Codex provides outside-in architectural analysis while Gemini provides inside-out integration-ready patterns.

**Limitation:** All 6 agents reported that the X post was partially or fully inaccessible via direct fetch. Gemini agents compensated by finding a LinkedIn mirror. ArtemXTech-derived insights should be treated as provisional until the exact post content is verified.

---

## Executive Summary

Seven recommendations achieved the strongest consensus across the 6-agent, 2-platform research process:

1. **Adopt hybrid multi-strategy retrieval** with pluggable search modes and a strategy dispatch registry -- unanimously recommended by all 6 agents (the single strongest signal in the entire corpus).
2. **Build a lightweight knowledge graph overlay on SQLite** with explicit entity-relationship edges to capture structural spec relationships that vector search misses -- recommended by 5 of 6 agents with cross-platform agreement.
3. **Redesign the MCP tool surface** with strict schema validation, intent-split tools, and stable versioned contracts -- recommended by 5 of 6 agents.
4. **Inject contextual trees** that prepend hierarchical domain context to returned memory chunks, leveraging the spec folder hierarchy -- recommended by 4 of 6 agents with cross-platform agreement.
5. **Return source-rich structured results** with provenance metadata, scoring transparency, and stable document handles -- recommended by 4-5 of 6 agents.
6. **Implement local on-device reranking** using GGUF models via `node-llama-cpp` for near-cloud-quality relevance without API latency -- recommended by 3 agents with concrete code patterns.
7. **Add async ingestion pipelines with job status tracking** for non-blocking memory processing that respects MCP timeout constraints -- recommended by 3 Codex agents.

---

## Tier 1: Strong Consensus (4-6 agents agree)

### 1.1 Hybrid Multi-Strategy Retrieval

**Consensus: 6/6 agents | Cross-platform: YES | Source: QMD-inspired (primary), Cognee-inspired (secondary)**

Every agent recommended evolving from a single search mode to a pluggable multi-strategy retrieval system. The approaches vary in specifics but converge on the same architecture: multiple retrieval backends fused through Reciprocal Rank Fusion (RRF) with optional reranking.

**Why it matters:** Single-mode search (pure vector or pure keyword) fails systematically. Exact identifiers like `specs/121-child` need lexical matching. Conceptual queries like "where did we discuss database migrations?" need semantic search. Hybrid fusion eliminates the single-signal brittleness that plagues current retrieval.

**Agent perspectives:**
- C1 proposes a **strategy dispatch registry** mapping strategy names to functions
- C2 proposes **typed query plans** with explicit `lex`, `vec`, and `hyde` modes for deterministic routing
- C3 proposes **fast/deep/auto lanes** with a retrieval cost governor that short-circuits expensive expansion when lexical confidence is high
- G1 proposes **SQLite FTS5 + sqlite-vec** as the unified backend for BM25 + vector
- G2/G3 propose **local GGUF reranking** as the quality-boosting final stage

**Implementation sketch** (synthesized from C1 + C2 + C3):
```typescript
// Strategy dispatch registry (C1 pattern)
const strategies = {
  semantic: semanticSearch,
  keyword: keywordSearch,
  hybrid: hybridSearch,
  recency: recencyBoostSearch,
};

// Typed query plan (C2 pattern)
const SearchInput = z.object({
  query: z.string().min(2),
  strategy: z.enum(["semantic", "keyword", "hybrid", "auto"]).default("hybrid"),
  scope: z.array(z.string()).optional(),
  topK: z.number().int().min(1).max(50).default(10),
});

// Fast-lane short-circuit (C3 pattern)
async function search(input: SearchInput) {
  const lexResults = await keywordSearch(input.query);
  if (lexResults[0]?.score > STRONG_SIGNAL_THRESHOLD) {
    return lexResults; // Skip expensive expansion
  }
  const semResults = await semanticSearch(input.query);
  const fused = reciprocalRankFusion([lexResults, semResults], { k: 60 });
  return applyTopRankBonus(fused).slice(0, input.topK);
}
```

---

### 1.2 Lightweight Knowledge Graph Overlay on SQLite

**Consensus: 5/6 agents (C1, C3, G1, G2, G3) | Cross-platform: YES | Source: Cognee-inspired (concept), QMD-inspired (local SQLite implementation)**

Five agents independently concluded that pure vector+keyword search is insufficient for spec-kit memory because specs have explicit structural relationships (spec A depends on spec B, decision X supersedes decision Y) that are structural, not semantic. All five recommend implementing this as a lightweight SQLite extension rather than introducing a heavy graph database like Neo4j.

**Why it matters:** When an agent asks "what does this change affect?", vector similarity returns topically related chunks. A graph overlay can traverse actual dependency edges to return structurally connected specs -- a fundamentally different and more reliable answer.

**Where agents diverge:** C1 and G1 recommend simple static edges (declared at authoring time). G2 recommends an automated "Cognify" ETL step that uses LLM extraction to discover relationships during `memory_save`. G3 takes the middle ground with a lightweight extraction prompt. This is the primary tension in the corpus: manual vs automated graph population.

**Implementation sketch** (synthesized from G2 + G3):
```sql
-- SQLite graph overlay schema (G2/G3 pattern)
CREATE TABLE memory_edges (
    edge_id TEXT PRIMARY KEY,
    source_memory_id TEXT NOT NULL,
    target_memory_id TEXT NOT NULL,
    relation_type TEXT CHECK(relation_type IN (
        'DEPENDS_ON', 'IMPLEMENTS', 'BLOCKS',
        'SUPERSEDES', 'CONTRADICTS', 'SUPPORTS'
    )),
    weight REAL DEFAULT 1.0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(source_memory_id) REFERENCES working_memory(id) ON DELETE CASCADE
);

-- Graph traversal via recursive CTE
WITH RECURSIVE graph AS (
    SELECT target_memory_id, relation_type, 1 as depth
    FROM memory_edges WHERE source_memory_id = ?
    UNION ALL
    SELECT e.target_memory_id, e.relation_type, g.depth + 1
    FROM memory_edges e JOIN graph g ON e.source_memory_id = g.target_memory_id
    WHERE g.depth < 3
)
SELECT * FROM graph;
```

---

### 1.3 MCP Tool Contract Redesign

**Consensus: 5/6 agents (C1, C2, C3, G1, G3) | Cross-platform: YES | Source: QMD-inspired (Zod schemas, tool split), Cognee-inspired (lifecycle tools)**

Five agents recommend a fundamental redesign of the MCP tool surface. The current approach of a few general-purpose tools should be replaced with intent-split tools backed by strict input validation.

**Why it matters:** When an LLM selects a tool, ambiguous tool descriptions cause misrouting. Separating `memory_query` (ranked retrieval) from `memory_get` (exact fetch) from `memory_status` (health check) dramatically improves tool selection accuracy by the calling model.

**Implementation sketch** (synthesized from C1 + C2 + C3):
```typescript
// Strict MCP schema validation (C1 pattern, QMD-inspired)
const MemoryQueryInput = z.object({
  query: z.string().min(2),
  strategy: z.enum(["semantic", "keyword", "hybrid"]).default("hybrid"),
  topK: z.number().int().min(1).max(50).default(10),
  includeSources: z.boolean().default(true),
});

// Intent-split tool surface (C2 + C3 pattern)
const TOOLS = {
  // Retrieval
  "memory_query":     { schema: MemoryQueryInput, handler: rankedRetrieval },
  "memory_get":       { schema: MemoryGetInput,   handler: exactFetch },
  "memory_multi_get": { schema: MultiFetchInput,  handler: batchFetch },
  // Operations
  "memory_status":    { schema: z.object({}),      handler: healthCheck },
  "memory_list":      { schema: ListInput,         handler: listEntries },
  "memory_delete":    { schema: DeleteInput,       handler: softDelete },
  "memory_prune":     { schema: PruneInput,        handler: pruneStale },
  // Ingestion
  "memory_save":      { schema: SaveInput,         handler: ingestContent },
  "memory_index_status": { schema: JobInput,       handler: checkJobStatus },
};
```

---

### 1.4 Contextual Trees for Spec Folder Hierarchy

**Consensus: 4/6 agents (C2, C3, G1, G3) | Cross-platform: YES | Source: QMD-inspired**

Four agents recommend injecting hierarchical domain context into returned memory chunks. Since spec folders follow a strict hierarchy (`specs/007-auth/001-login`), retrieved chunks should include the parent spec's goal or description so the agent understands the broader context without making additional round-trips.

**Why it matters:** An isolated memory chunk about "login token expiration" is ambiguous. Prepending `[Context: Auth System > Login Phase]` eliminates the need for the agent to separately load the parent spec, saving tokens and reducing hallucination from decontextualized chunks.

**Implementation sketch** (from G1 + G3):
```typescript
// Context tree injection during retrieval (G3 pattern)
function injectContextualTree(chunk: MemoryResult): string {
    if (chunk.specFolder) {
        const specSummary = getSpecSummary(chunk.specFolder); // Cached at index time
        return `[Context: ${chunk.specFolder} - ${specSummary}]\n${chunk.content}`;
    }
    return chunk.content;
}
```

**Risk flagged by G3:** Injecting context into every result can blow token budgets. Strict truncation to under 100 characters per context header is recommended.

---

### 1.5 Source-Rich Structured Results with Provenance

**Consensus: 4-5/6 agents (C1, C2, C3 strongly; G2, G3 partially) | Cross-platform: YES | Source: Both QMD-inspired (metadata) and Cognee-inspired (provenance)**

Multiple agents converge on returning structured envelopes rather than raw text from retrieval tools. Results should include stable IDs, source file paths, section anchors, score breakdowns, and retrieval method traces.

**Why it matters:** Downstream agents can reason over structured fields (filtering by `kind: "decision"` or `score > 0.8`) rather than parsing prose. Scoring transparency enables debugging and builds operator trust.

**Implementation sketch** (from C1 + C2):
```json
{
  "id": "mem_abc123",
  "namespace": "specs/121-child",
  "content": "Gate 3 HARD BLOCK applies to all file modifications",
  "kind": "decision",
  "source": {
    "file": "specs/121-child/plan.md",
    "section": "## Risks",
    "line_start": 42,
    "timestamp": "2026-03-03T12:00:00Z"
  },
  "scores": {
    "lexical": 0.72,
    "semantic": 0.85,
    "fusion": 0.81,
    "rerank": null
  },
  "trace": {
    "strategies_run": ["keyword", "semantic"],
    "strategies_skipped": ["recency"],
    "reason": "strong-lexical-signal"
  }
}
```

---

## Tier 2: Moderate Consensus (2-3 agents agree)

### 2.1 Async Ingestion Pipeline with Job Status

**Consensus: 3/6 agents (C1, C2, C3 -- Codex only) | Source: Cognee-inspired**

All three Codex agents recommend borrowing Cognee's background task pattern. Long-running ingestion or re-indexing operations should return a job ID immediately and expose progress via a separate status tool, avoiding MCP timeout failures.

**Note on partial agreement:** Gemini agents do not make this a primary recommendation, likely because they prioritized retrieval quality improvements. This represents a Codex vs Gemini divergence in prioritization, not in value assessment.

**Implementation sketch** (from C2):
```typescript
// Async ingestion tools
"memory_ingest_start":  // Returns { jobId: "job_xyz" } immediately
"memory_ingest_status": // Input: { jobId }, Returns: { state: "embedding", progress: 0.6 }
"memory_ingest_cancel": // Input: { jobId }, Returns: { cancelled: true }

// State machine: queued -> parsing -> embedding -> indexing -> complete | failed
```

---

### 2.2 Local On-Device Reranking via GGUF Models

**Consensus: 3/6 agents (G2, G3 strongly; C3 partially) | Source: QMD-inspired**

Both Gemini-2 and Gemini-3 identify local cross-encoder reranking as the single highest-ROI retrieval improvement. QMD's use of `node-llama-cpp` with small GGUF reranker models (0.5B-0.6B parameters) demonstrates that near-cloud-quality relevance scoring is achievable entirely on-device.

**Implementation sketch** (from G2):
```typescript
// lib/search/local-reranker.ts
import { getLlama } from "node-llama-cpp";

export async function rerankCandidates(
  query: string,
  candidates: MemoryRow[]
): Promise<MemoryRow[]> {
    if (!process.env.ENABLE_LOCAL_RERANKER) return candidates; // Fallback to RRF

    const llama = await getLlama();
    const model = await llama.loadModel({
      modelPath: "./models/bge-reranker-base.gguf"
    });
    const context = await model.createContext();

    for (const candidate of candidates) {
        candidate.rerankScore = await computeCrossEncoderScore(
          context, query, candidate.content_text
        );
    }

    return candidates.sort((a, b) => b.rerankScore - a.rerankScore).slice(0, 10);
}
```

**Risk flagged by G2/G3:** VRAM contention with primary IDE LLM (Copilot/Cursor). Fallback to algorithmic RRF/MMR must be robust. Recommended threshold: disable local reranker if system VRAM < 16GB.

---

### 2.3 Warm Server / Daemon Mode with Multi-Transport

**Consensus: 3-4/6 agents (C2, C3, +G2/G3 implicitly) | Source: QMD-inspired**

Multiple agents note that MCP servers suffer from repeated cold-start penalties. QMD's approach of maintaining an HTTP daemon mode with warm model/index caches and a 5-minute idle disposal window significantly reduces Time-to-First-Byte on follow-up queries.

**Recommended transport matrix:**
- `stdio`: Local single-client runs (default for CLI agents)
- `http`: Shared daemon for multi-agent/IDE scenarios with `/health` endpoint
- `sse`: Optional for streaming results

---

### 2.4 Backend / Storage Adapter Abstraction

**Consensus: 3/6 agents (C1, C2, G2) | Cross-platform: YES | Source: Cognee-inspired (extensibility), QMD-inspired (simplicity)**

Three agents recommend abstracting the storage layer behind clean interfaces. G2 provides the most concrete proposal: expose `IVectorStore`, `IGraphStore`, and `IDocumentStore` interfaces that map to the underlying SQLite implementation, enabling future swaps to LanceDB, Qdrant, or pgvector without touching retrieval logic.

---

### 2.5 Metadata-First / Frontmatter Querying

**Consensus: 2/6 agents (G1, G3) | Source: ArtemXTech-inspired**

Both Gemini agents that accessed the ArtemXTech LinkedIn mirror recommend a "metadata-first" retrieval mode that returns only structured frontmatter (titles, entities, status) before loading full document bodies. This achieves significant token savings by letting the agent decide which memories warrant full loading.

**Implementation sketch** (from G3):
```typescript
// Modify memory_list to accept a lightweight mode
memory_list({ specFolder: "specs/012-feature", includeBody: false })
// Returns: [{ id, title, kind, entities, status, lastModified }]
// Agent inspects metadata, then calls memory_get(id) for full content
```

---

### 2.6 Namespace / Database Management

**Consensus: 2/6 agents (C1, C2) | Source: QMD-inspired**

Two Codex agents recommend QMD-style namespace management primitives (`list_namespaces`, `create_namespace`, `switch_namespace`, `delete_namespace`) for project/phase isolation.

---

### 2.7 Session Continuity Primitives

**Consensus: 2/6 agents (C3, G3) | Cross-platform: YES | Source: ArtemXTech-inspired**

Two agents (one from each platform) address the "AI amnesia" problem highlighted by ArtemXTech. C3 proposes a `memory_continue` tool that returns an anchored summary (state + decisions + next steps + open risks). G3 proposes auto-indexing ephemeral session logs into searchable long-term memory.

**Implementation sketch** (from C3):
```json
{
  "spec_folder": "specs/123-example",
  "state": "Phase 2 in progress, blocking on auth dependency",
  "decisions": ["Chose SQLite over Postgres for v1"],
  "next_steps": ["Implement FTS5 index", "Add reranker flag"],
  "open_risks": ["VRAM contention on low-end machines"],
  "evidence_refs": ["mem_01ab23", "mem_9fd210"],
  "generated_at": "2026-03-03T10:15:00Z"
}
```

---

## Tier 3: Unique High-Value Insights

### 3.1 ANCHOR Tags as Graph Entity Resolution Nodes (G2 only)

The most creative unique insight across all 12 documents. Gemini-2 proposes extending the existing ANCHOR tag system (`<!-- ANCHOR: decisions -->`) to automatically register tagged sections as typed graph nodes. Content inside `<!-- ANCHOR: architecture -->` becomes an `ArchitectureNode`; content inside `<!-- ANCHOR: dependencies -->` becomes a `DependencyNode`.

**Why this is valuable:** It builds a deterministic knowledge graph *without* the expensive LLM "Cognify" step, using existing markdown conventions. This is a pragmatic middle ground between manual edge declaration and full automated extraction.

### 3.2 Smart Markdown Chunking at AST Level (G1)

Gemini-1 recommends parsing markdown with `remark` or `marked` to index each heading as a separate retrievable node. This enables a new MCP tool `read_spec_section(filePath, heading)` that retrieves 30 lines instead of 300, achieving massive token savings.

### 3.3 Real-Time Filesystem Watching (G2)

Gemini-2 identifies a specific operational pain: the memory index desyncs when developers edit `.md` files directly in their IDE. The solution is a `chokidar`-based file watcher with debounced hashing and targeted re-indexing. Impact is medium, effort is low, and it eliminates a significant UX friction point.

**Risk:** Concurrent file-watching writes combined with agent-driven `memory_save` operations could cause SQLite `SQLITE_BUSY` locks. WAL mode enforcement and retry mechanisms are mandatory.

### 3.4 Dynamic Server Instructions at MCP Initialization (C2)

Codex-2 uniquely recommends generating a concise memory index overview (counts, scopes, stale flags) at MCP server startup and injecting it into the server's initial instructions. Inspired by QMD's `buildInstructions()` function, this gives the calling model immediate awareness of what memory is available.

---

## Implementation Roadmap

All 6 agents agree on a phased approach with the same ordering. The synthesized roadmap below reconciles the different timeline estimates.

### Phase 1: Foundation (1-3 weeks)
**Focus: MCP contract hardening + context enrichment**

| Item | Effort | Impact | Dependencies |
|------|--------|--------|-------------|
| Strict MCP schemas with Zod validation | Low | High | None |
| Split tool surface by intent | Low | High | Schema layer |
| Source-rich result envelopes | Low | High | Schema layer |
| Context tree injection for spec folders | Low | High | None |
| Metadata-first querying mode | Low-Med | High | None |
| Structured status endpoint | Low | Medium | None |

**Expected outcome:** Immediate reliability boost, better model tool routing, reduced token waste.

### Phase 2: Retrieval Quality (2-4 weeks)
**Focus: Hybrid retrieval + scoring improvements**

| Item | Effort | Impact | Dependencies |
|------|--------|--------|-------------|
| Hybrid retrieval strategy registry | Medium | High | Phase 1 schemas |
| Fast-lane short-circuit heuristics | Medium | High | Strategy registry |
| RRF fusion with position-aware blending | Medium | High | Strategy registry |
| Scoring transparency in results | Low-Med | Medium | Result envelopes |
| Smart Markdown chunking (AST-level) | Medium | Medium | None |

**Expected outcome:** Better relevance, lower false positives, reduced latency for simple queries.

### Phase 3: Advanced Features (3-6 weeks)
**Focus: Graph overlay + reranking + operational maturity**

| Item | Effort | Impact | Dependencies |
|------|--------|--------|-------------|
| Local GGUF reranking with fallback | Medium | High | Phase 2 pipeline |
| SQLite graph overlay (memory_edges) | Medium-High | High | Phase 1 schemas |
| Async ingestion pipeline with job status | Medium | Medium-High | None |
| Warm server / daemon mode (HTTP) | Medium | Medium | None |
| Backend adapter interfaces | Medium | Medium | Graph overlay |

**Expected outcome:** Production-grade retrieval with structural reasoning capabilities.

### Phase 4: Innovation (ongoing)
**Focus: Experimental features gated behind flags**

| Item | Effort | Impact | Dependencies |
|------|--------|--------|-------------|
| ANCHOR tags as graph entity nodes | Low-Med | Medium-High | Graph overlay |
| Session continuity (memory_continue) | Medium | Medium | Result envelopes |
| Real-time filesystem watching | Low | Medium | None |
| Automated "Cognify" ETL extraction | High | High (long-term) | Graph overlay + LLM budget |
| Namespace management tools | Low-Med | Medium | None |

**Expected outcome:** Differentiated capabilities that push beyond QMD/Cognee patterns.

---

## Risks & Considerations

### Cross-Cutting Risks (identified by multiple agents)

1. **Complexity creep / over-engineering** (flagged by C1, C2, C3, G1)
   The full Cognee-level architecture is too heavy for spec-kit's use case. Mitigation: feature flags, phased rollout, "blessed defaults" philosophy. Start narrow (spec memory only), add providers incrementally.

2. **Retrieval quality regressions** (flagged by C1, C2, C3)
   Hybrid ranking tuning can silently degrade. Mitigation: build a golden query benchmark suite from real spec-kit queries and tie it to CI. Track hit@k and time-to-correct-context metrics.

3. **VRAM contention with local rerankers** (flagged by G2, G3)
   Running a 0.6B reranker alongside primary IDE LLM may starve GPU resources on machines with < 32GB unified memory. Mitigation: automatic VRAM detection with fallback to algorithmic RRF. Default the reranker to OFF and let users opt in.

4. **SQLite locking under concurrent writes** (flagged by G2)
   Filesystem watching + agent-driven saves could cause `SQLITE_BUSY` errors. Mitigation: strictly enforce WAL mode, implement retry with exponential backoff in the storage layer.

5. **Token budget blowout from context injection** (flagged by G3)
   Injecting contextual trees into every result can exhaust strict token budgets (L2: 1500 chars). Mitigation: truncate injected context to < 100 characters per result.

6. **Schema/migration churn** (flagged by C1, C2)
   Embedding model or dimension changes can invalidate existing indexes. Mitigation: versioned index metadata with background re-indexing jobs. Version MCP tool contracts (`v1`, `v1.1`) and maintain aliases during transitions.

7. **Context rot from aggressive summarization** (flagged by G3, via ArtemXTech)
   Repeated compaction cycles lose nuanced technical details. Mitigation: preserve original content alongside summaries; use summaries for discovery, originals for deep retrieval.

### Assumptions to Validate

- Current system-spec-kit memory MCP uses a primarily untyped or loosely typed search interface (assumed by C1, C2)
- Spec folders and phase paths are stable enough to serve as retrieval hierarchy anchors (assumed by C2)
- Host machines will have sufficient compute for local embedding + optional reranking (assumed by G2, G3)
- The ArtemXTech post content matches the LinkedIn mirror used by Gemini agents (assumed due to X inaccessibility)

---

## Appendix: Source Attribution Matrix

Legend: Each cell indicates what the agent specifically contributed for that theme. Empty cells mean the agent did not address this theme as a recommendation.

| Recommendation Theme | C1 (Codex-1) | C2 (Codex-2) | C3 (Codex-3) | G1 (Gemini-1) | G2 (Gemini-2) | G3 (Gemini-3) |
|---|---|---|---|---|---|---|
| **T1: Hybrid multi-strategy retrieval** | Strategy dispatch registry | lex/vec/hyde typed query plans | fast/deep/auto lanes + RRF fusion skeleton | SQLite FTS5 + sqlite-vec backend | Local GGUF reranker via node-llama-cpp | SPECKIT_LLM_RERANK feature flag |
| **T1: Graph overlay on SQLite** | spec-task-file-decision edges | -- | Hierarchical context graph with link edges | DEPENDS_ON / IMPLEMENTS / BLOCKS edges | Cognify ETL + ANCHOR-to-node mapping + Tri-store interfaces | Triple-store emulation + memory_traverse tool |
| **T1: MCP tool contract redesign** | Zod schemas + stable tool names | query/get/multi_get/status split | ingest/retrieve/ops/explain grouping | read_spec_section + speckit_get_status tools | -- | memory_traverse + memory_list parameters |
| **T1: Contextual trees** | -- | Global-spec-phase-file inheritance | workspace-spec-phase-artifact-memory hierarchy | Prepend parent spec context (code example) | -- | Domain context injection (code example) |
| **T1: Source-rich structured results** | JSON envelope with score/kind/source | Structured return with id/score/line_start | Score components + reason codes + doc handles | -- | Telemetry references | Extended telemetry references |
| **T2: Async ingestion + job status** | Pipeline state machine | ingest_start/status/cancel tools | memory_index_start/status | -- | Targeted re-indexing (partial) | -- |
| **T2: Local GGUF reranking** | -- | -- | Reranking in fusion (partial) | -- | node-llama-cpp code pattern + fallback logic | SPECKIT_LLM_RERANK flag + latency concern |
| **T2: Warm server / daemon mode** | -- | stdio vs HTTP transport | Multi-transport + warm cache + health endpoint | -- | VRAM pooling (implicit) | Cold-start penalty telemetry |
| **T2: Backend adapter abstraction** | VectorStore / Embedding adapters | Direct vs API mode | Shared memory backend | -- | IVectorStore / IGraphStore / IDocumentStore | -- |
| **T2: Metadata-first querying** | -- | -- | -- | checklist.md to JSON (code example) | -- | includeBody=false paging |
| **T2: Namespace management** | list/create/switch/delete primitives | Named indexes for isolation | -- | -- | -- | -- |
| **T2: Session continuity** | -- | -- | memory_continue + snapshot payload | -- | -- | Session hooks + auto-indexing |
| **T3: ANCHOR as graph nodes** | -- | -- | -- | -- | Anchors as typed graph nodes (unique insight) | -- |
| **T3: Smart MD chunking (AST)** | -- | -- | -- | Heading-based nodes + read_spec_section tool | -- | -- |
| **T3: Filesystem watching** | -- | -- | -- | -- | Chokidar + debounced hashing | -- |
| **T3: Dynamic server instructions** | -- | Dynamic instructions at init (from QMD buildInstructions) | -- | -- | -- | -- |

### Source Inspiration Summary

| Pattern Origin | Key Contributions | Primary Agents |
|---|---|---|
| **Cognee-inspired** | Graph overlay, ECL pipeline, async background processing, search-type dispatch, lifecycle tools, ontology enforcement | C1, C3, G2, G3 |
| **QMD-inspired** | Hybrid retrieval, Zod schemas, context trees, local GGUF reranking, SQLite FTS5+vec, tool surface split, warm daemon mode, smart chunking | All 6 agents |
| **ArtemXTech-inspired** | Frontmatter-first querying, session continuity, session auto-indexing, context rot awareness, "time-to-first-useful-memory" principle | C3, G1, G3 |

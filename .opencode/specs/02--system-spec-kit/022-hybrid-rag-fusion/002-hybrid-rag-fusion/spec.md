---
title: "Spec: 138-hybrid-rag-fusion (Unified Context Engine) [002-hybrid-rag-fusion/spec]"
description: "This specification details the Level 3+ architectural upgrade of the system-speckit memory Model Context Protocol (MCP) server. The goal is to transform the server from a collec..."
trigger_phrases:
  - "spec"
  - "138"
  - "hybrid"
  - "rag"
  - "fusion"
  - "002"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Spec: 138-hybrid-rag-fusion (Unified Context Engine)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## 0. Metadata

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-20 |
| **Parent Spec** | `N/A (root docs intentionally removed)` |
| **Successor** | `002-hybrid-rag-fusion` |

<!-- ANCHOR: spec-summary-138 -->
## 1. Executive Summary
This specification details the Level 3+ architectural upgrade of the `system-speckit` memory Model Context Protocol (MCP) server. The goal is to transform the server from a collection of isolated retrieval engines into a cohesive **Unified Context Engine**. Based on an exhaustive 6-round multi-agent research sprint covering modern RAG paradigms (RAGFlow, GraphRAG, WiredBrain), the MCP server will activate its dormant Tri-Hybrid capabilities (Vector, BM25, FTS5) and fuse them via Reciprocal Rank Fusion (RRF). 

To strictly enforce token budgets and prevent LLM hallucination, the system introduces Maximal Marginal Relevance (MMR) pruning for payload diversity, and a Transparent Reasoning Module (TRM) to gate low-confidence contexts. Crucially, this massive capability upgrade requires **zero schema migrations**; all logic executes natively on the existing v15 SQLite schema via TypeScript orchestration.
<!-- /ANCHOR: spec-summary-138 -->

<!-- ANCHOR: spec-background-138 -->
## 2. Background and Problem Statement
Currently, `system-speckit`'s `memory_context` and `memory_search` tools rely predominantly on flat vector similarity (`sqlite-vec`) and unweighted FTS5 `MATCH` queries. 
*   **The "Lost in the Middle" Problem:** Returning large payloads of semantically identical chunks (e.g., 5 versions of the same implementation summary) wastes the strict 2000-token limit and dilutes LLM attention.
*   **Integration Fragmentation:** Advanced modules like `adaptive-fusion.ts` (for intent-weighted RRF) and `co-activation.ts` (for spreading graph activation) exist fully implemented in the codebase but are physically disconnected from the primary `hybridSearchEnhanced()` pipeline.
*   **Silent Failure:** If a niche technical query returns low-quality nearest neighbors, the LLM hallucinates an answer based on noise because the MCP server provides no metadata indicating low confidence.
<!-- /ANCHOR: spec-background-138 -->

<!-- ANCHOR: spec-requirements-138 -->
## 3. Core Requirements
### 3.1 Hard Constraints
*   **Zero Schema Migrations:** All capabilities MUST execute on the existing v15 SQLite schema (`memories`, `memory_fts`, `causal_edges`, `memory_index`). No external databases (Pinecone, Neo4j) are permitted.
*   **Token Efficiency:** Context payloads MUST strictly respect the 2000-token limit (approximately 8,000 ASCII characters). If MMR cannot prune sufficiently, the array must be forcibly truncated.
*   **Dependency Minimization:** The upgrade must only rely on `sqlite-vec`, `sqlite3`, and standard Node.js libraries. `remark` and `remark-gfm` are permitted exclusively for Phase 4 ingest-time AST parsing.

### 3.2 Performance Budget (120ms Limit for `mode="auto"`)
The entire `hybridSearchEnhanced()` pipeline must execute within 120ms to prevent blocking the MCP protocol or causing LLM timeout warnings.
| Stage | Operation | Latency Budget |
| :--- | :--- | :--- |
| **L0** | Intent Classification (Centroid Dot Product) | 2ms |
| **L1** | Parallel Scatter (`Promise.all`) | 60ms |
| | - Vector Search (`sqlite-vec`) | *35ms* |
| | - FTS5 Search (Weighted BM25) | *15ms* |
| | - Graph Search (Recursive CTE) | *45ms* |
| **L2** | Adaptive RRF Fusion | 5ms |
| **L3** | Post-Fusion MMR Reranking | 8ms |
| **L4** | TRM Z-Score Confidence Check | 1ms |
| **L5** | Markdown Serialization & Metadata formatting | 5ms |
| **Total** | | **~81ms** (39ms buffer) |

### 3.3 Functional Requirements
*   **Orchestrated Retrieval:** The pipeline MUST fuse Vector, FTS5, BM25, and Causal Graph traversals into a single unified RRF ranking.
*   **Semantic Diversity:** The system MUST implement Cosine Maximal Marginal Relevance (MMR) post-fusion to penalize duplicate information.
*   **Fallback Safety:** The LLM MUST receive explicit `[EVIDENCE GAP DETECTED]` warnings when the Gaussian distribution of RRF scores falls below a critical Z-score threshold.
<!-- /ANCHOR: spec-requirements-138 -->

<!-- ANCHOR: spec-scope-138 -->
## 4. Scope Boundaries

### In-Scope (4 Implementation Phases)
*   **Phase 0:** Activation of dormant logic (`adaptive-fusion`, `co-activation`, `useGraph`).
*   **Phase 1:** Implementation of post-fusion Cosine MMR and Gaussian Confidence Checks (TRM).
*   **Phase 2:** Modification of FTS5 queries for multi-field weighting (Title vs. Body) and CTEs for edge-strength multipliers.
*   **Phase 3:** Server-side rule-based query expansion exclusively for `mode="deep"`.
*   **Phase 4:** Deep document parsing (`remark`), automated entity linking, and query-independent PageRank authority scoring.

### Cognitive Layer Enhancements (In-Scope)
*   Transitioning `intent-classifier.ts` from regex to embedding centroid matching.
*   Running `prediction-error-gate.ts` on read-time retrieved payloads to flag contradictions.
*   Modulating FSRS tier decay (Constitutional memories decay at 0.1x, Scratch at 3.0x).

### Out-of-Scope
*   Migration to dedicated vector databases (e.g., Pinecone, Qdrant) or Graph databases (Neo4j).
*   Client-side LLM query expansion (latency prohibitive due to the LLM-in-MCP paradox).
*   Any modification to the `causal_links` or `memories` table schemas.
<!-- /ANCHOR: spec-scope-138 -->

<!-- ANCHOR: spec-architecture-138 -->
## 5. Target Architecture & Data Contracts

### 5.1 Orchestration Flow
The execution flow within `lib/search/hybrid-search.ts` will transition from a linear flow to a scatter-gather orchestrator:
1.  **Intent Classification:** Identify user goal (e.g., `bug_fix` vs `exploration`).
2.  **Scatter:** Execute Vector, Weighted FTS5, and Graph Traversal (`useGraph: true`) concurrently via `Promise.all`.
3.  **Gather & Fuse:** Pipe all returned chunks into `adaptive-fusion.ts` utilizing RRF with intent-specific weights.
4.  **Evaluate (TRM):** Check Z-scores of the RRF distribution. If low, flag the metadata array.
5.  **Prune (MMR):** Filter the top-20 RRF results down to the top-5 most *diverse* memories using `lambda`.

### 5.2 TypeScript Interfaces
```typescript
interface SearchResult {
  id: number;
  score: number; // The final fused RRF score
  content: string;
  embedding: Float32Array; // Passed through for O(N^2) MMR calculation
  metadata: {
    title: string;
    spec_folder: string;
    importance_tier: string;
  };
}

interface TRMMetadata {
  evidenceGapDetected: boolean;
  zScore: number;
  mean: number;
  stdDev: number;
  warnings: string[]; // E.g., ["[EVIDENCE GAP: Low confidence match. Synthesize from first principles.]"]
}

interface EnhancedMCPResponse {
  payload: string; // The markdown string fed to the LLM
  trm: TRMMetadata;
  metrics: {
    latencyMs: number;
    tokensConsumed: number;
    sourcesHit: string[];
  };
}
```
<!-- /ANCHOR: spec-architecture-138 -->

---

## Acceptance Scenarios

1. Intent classifier computes centroid vectors at module initialization.
2. Centroid-based scoring influences final intent classification output.
3. Graph-enabled hybrid search path fuses vector/FTS/graph channels.
4. MMR and evidence-gap modules execute without regression.
5. Updated intent test suite passes with centroid coverage checks.
6. Root integration tasks/checklists reflect this workstream as complete.

## AI Execution Protocol

### Pre-Task Checklist
- Confirm target files and test scope.
- Confirm no schema migration is introduced.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| Scope | Edit only planned files for this phase |
| Verification | Run targeted tests before completion |

### Status Reporting Format
- `STATE`, `ACTIONS`, `RESULT`

### Blocked Task Protocol
1. Stop edits for blocked area.
2. Capture error/output evidence.
3. Apply one bounded workaround, then escalate if unresolved.

## Structured Requirements

| ID | Requirement |
|----|-------------|
| REQ-001 | Activate graph, BM25, and vector channels in hybrid retrieval. |
| REQ-002 | Keep retrieval pipeline within p95 <= 120ms. |
| REQ-003 | Apply MMR for diversity on fused results. |
| REQ-004 | Apply evidence-gap confidence signaling. |
| REQ-005 | Preserve zero-schema-migration constraint. |
| REQ-006 | Add centroid-based intent scoring internals. |
| REQ-007 | Add coverage tests for centroid scoring behavior. |
| REQ-008 | Maintain backward-compatible MCP interfaces. |

## Risks and Dependencies

- Dependency: existing SQLite/FTS/vector stack remains available.
- Risk: retrieval quality regression if channel weights drift.
- Mitigation: targeted regression tests and integration checks.

## Completion Criteria

- All tasks/checklist items are marked complete with evidence.
- Targeted intent classifier tests pass.
- Consolidated child-folder lifecycle and supplemental records are present in this folder.

## Acceptance Scenario Details

- **Given** centroid seeds are loaded, **When** classifier initializes, **Then** seven centroids exist.
- **Given** canonical intent query text, **When** centroid scores are computed, **Then** expected intent receives top score.
- **Given** empty query input, **When** classifier runs, **Then** `understand` fallback is returned safely.
- **Given** routing query for bug fix, **When** classification runs, **Then** `fix_bug` remains correctly detected.
- **Given** updated tests, **When** vitest runs, **Then** centroid suites pass.
- **Given** closure documents, **When** folder consolidation checks run, **Then** `002-hybrid-rag-fusion` is the canonical active RAG folder.

## Consolidation Addendum (2026-02-22)

- Consolidated command-alignment outcomes are recorded in `supplemental/command-alignment-summary.md`.
- Consolidated non-skill-graph outcomes are recorded in `supplemental/non-skill-graph-consolidation-summary.md`.
- Supplemental index is maintained in `supplemental-index.md`.

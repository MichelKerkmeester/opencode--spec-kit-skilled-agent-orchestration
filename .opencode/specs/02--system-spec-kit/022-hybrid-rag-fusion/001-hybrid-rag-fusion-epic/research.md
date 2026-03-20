---
title: "Consolidated research"
---
# Consolidated research

Consolidated from the following source docs:
- sources/002-hybrid-rag-fusion/research.md
- sources/006-hybrid-rag-fusion-logic-improvements/research.md

<!-- AUDIT-2026-03-08: Historical folder name mapping for consolidated source references below.
  Pre-consolidation name         → Current folder
  002-hybrid-rag-fusion          → 002-indexing-normalization
  003-index-tier-anomalies       → 002-indexing-normalization
  004-frontmatter-indexing       → 002-indexing-normalization
  002-auto-detected-session-bug  → 002-indexing-normalization
  006-hybrid-rag-fusion-logic-improvements → content merged into this epic (001-hybrid-rag-fusion-epic)
  SOURCE citations referencing these paths are historical and point to pre-consolidation locations.
-->

## Source: 002-hybrid-rag-fusion

---
title: "Research: Practical Integration Roadmap -- Skill Graphs x Hybrid RAG Fusion [002-hybrid-rag-fusion/research]"
description: "The original 001 plan (Phases 0-5) was designed before the skill graph system (002) existed. Now that 002 is complete (412 nodes, 627 edges, 9 skills, SGQS parser/executor, grap..."
trigger_phrases:
  - "research"
  - "practical"
  - "integration"
  - "roadmap"
  - "skill"
  - "002"
  - "hybrid"
importance_tier: "normal"
contextType: "research"
---
# Research: Practical Integration Roadmap -- Skill Graphs x Hybrid RAG Fusion

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

## 1. Metadata

| Field | Value |
|-------|-------|
| **Research ID** | R-138-003 |
| **Topic** | Skill Graph integration into Hybrid RAG Fusion pipeline |
| **Status** | COMPLETE |
| **Date** | 2026-02-20 |
| **Scope** | Concrete integration plan with file paths, function signatures, LOC, and priority ordering |
| **Evidence Grade** | A (all claims verified against live source files) |

---

## 2. Investigation Report

### Request Summary

The original 001 plan (Phases 0-5) was designed before the skill graph system (002) existed. Now that 002 is complete (412 nodes, 627 edges, 9 skills, SGQS parser/executor, graph-enrichment.ts), the question is: how should the 001 phases be MODIFIED to incorporate skill graph intelligence?

### Critical Discovery: The `graphSearchFn` is NULL in Production

The single most important finding in this investigation:

**`hybridSearch.init()` is called WITHOUT the `graphFn` argument in all production code paths.**

Evidence:

```typescript
// context-server.ts:566
hybridSearch.init(database, vectorIndex.vectorSearch);

// db-state.ts:140
if (hybridSearch) hybridSearch.init(database, vectorIndex.vectorSearch);
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts:566`]
[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:140`]

The `init()` function signature accepts three parameters:

```typescript
function init(
  database: Database.Database,
  vectorFn: VectorSearchFn | null = null,
  graphFn: GraphSearchFn | null = null  // <-- NEVER PASSED
): void
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:69-77`]

This means:
- `useGraph` defaults to `true` (line 227)
- But `graphSearchFn` remains `null` (line 63)
- The guard `if (useGraph && graphSearchFn)` at line 270 ALWAYS fails
- **The graph channel is enabled but receives nothing. It is a dead code path in production.**

This is the single highest-impact integration point.

### Recommendations Summary

1. **Phase 0+ (Highest Priority):** Wire a `graphSearchFn` implementation that queries BOTH the causal edge graph AND the SGQS skill graph. This alone closes the biggest gap.
2. **Phase 1+:** Add graph distance as an MMR diversity signal alongside cosine similarity.
3. **Phase 2+:** Add skill graph edge type weights to the RRF scoring matrix.
4. **NEW Phase 0.5:** Make the skill graph a first-class retrieval channel with a dedicated search function.
5. Reorder: Do Phase 0+ BEFORE Phase 1, because it activates an existing channel that currently receives nothing.

---

## 3. Executive Overview

### Architecture: Current State vs. Target State

```
CURRENT STATE (001 complete, 002 complete, NOT INTEGRATED):

  Query ──► Intent Classifier ──► Scatter
                                    ├── Vector Search (sqlite-vec) ──┐
                                    ├── FTS5 Search ────────────────┤
                                    ├── BM25 Search ────────────────┤
                                    └── Graph Search (NULL fn) ─────┤  ← DEAD PATH
                                                                    │
                                         RRF Fusion ◄──────────────┘
                                              │
                                    Adaptive Weights (intent-based)
                                              │
                                    Co-activation (BFS spreading)
                                              │
                                    MMR Reranker (diversity)
                                              │
                                    Evidence Gap Detector (TRM)
                                              │
                                    Cross-Encoder Reranker
                                              │
                                         ► Results

SGQS (Separate, Disconnected):

  query() ──► buildSkillGraph(skillRoot) ──► tokenize() ──► parse() ──► execute()
                    │                                                       │
              412 nodes, 627 edges                                   SGQSResult
              (rebuilt from filesystem                            {columns, rows, errors}
               on every call)

TARGET STATE (integrated):

  Query ──► Intent Classifier ──► Scatter
                                    ├── Vector Search (sqlite-vec) ──┐
                                    ├── FTS5 Search ────────────────┤
                                    ├── BM25 Search ────────────────┤
                                    └── Graph Search (SGQS+Causal)──┤  ← LIVE PATH
                                                                    │
                                         RRF Fusion ◄──────────────┘
                                              │                 ▲
                                    Adaptive Weights ──────────── graph weight column
                                              │
                                    Co-activation (BFS + SGQS neighbors)
                                              │
                                    MMR Reranker (cosine + graph distance)
                                              │
                                    Evidence Gap Detector (TRM)
                                              │
                                    Cross-Encoder Reranker
                                              │
                                         ► Results
```

---

## 4. Core Architecture: The Integration Surface

### 4.1 Where SGQS Meets the Pipeline

There are exactly three integration points:

| # | Integration Point | Current Module | What Needs to Change |
|---|-------------------|---------------|---------------------|
| 1 | `graphSearchFn` in `hybrid-search.ts` | NULL (never provided) | Provide a function that queries SGQS + causal edges |
| 2 | `context-server.ts:566` initialization | Missing 3rd argument | Pass the new `graphSearchFn` implementation |
| 3 | `db-state.ts:140` re-initialization | Missing 3rd argument | Pass the new `graphSearchFn` implementation |

### 4.2 The `GraphSearchFn` Contract

The existing type signature is already defined:

```typescript
type GraphSearchFn = (
  query: string,
  options: Record<string, unknown>
) => Array<Record<string, unknown>>;
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:23-26`]

This function must return objects with at minimum `{ id: number | string, score: number }`. The `id` must match memory IDs for RRF fusion to deduplicate correctly. The `source` field is set to `'graph'` by `hybridSearch()`.

### 4.3 The SGQS Query API

```typescript
function query(queryString: string, skillRoot: string): SGQSResult {
  const graph = buildSkillGraph(skillRoot);
  const tokens = tokenize(queryString);
  const ast = parse(tokens);
  return execute(ast, graph);
}
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/index.ts:50-55`]

Key constraint: `buildSkillGraph()` reads the filesystem every call. For retrieval (called on every search), this must be cached.

### 4.4 Graph Enrichment (Index-Time Only)

`graph-enrichment.ts` extracts trigger phrases from the skill graph at index time (Step 7.6 in the memory save pipeline). It produces `triggerPhrases[]` and `graphContext` markdown. This is a write-path enhancement that already exists and works.

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/graph-enrichment.ts:208-287`]

The integration challenge is different: we need a **read-path** query function, not a write-path enrichment.

---

## 5. Technical Specifications: The Seven Analysis Questions

### 5.1 Phase 0 Enhancement: Activating `graphSearchFn`

**Original Phase 0**: Activate `useGraph: true`, adaptive fusion, co-activation, fallback.
**Status**: `useGraph` is already `true`, but `graphSearchFn` is NULL. Adaptive fusion, co-activation, and MMR are wired. The graph channel is the ONLY Phase 0 item that is not actually active.

**Proposed Enhancement**: Implement `createGraphSearchFn()` that queries BOTH:
1. **Causal edges** (SQLite `causal_edges` table via recursive CTE)
2. **SGQS skill graph** (in-memory graph via keyword matching on node properties)

**Concrete Implementation:**

```typescript
// NEW FILE: mcp_server/lib/search/graph-search-fn.ts

import * as path from 'path';
import { DEFAULT_BASE_PATH } from '../../core';
import type Database from 'better-sqlite3';

// Lazy-loaded SGQS module (cross-workspace boundary)
let sgqsModule: { buildSkillGraph: Function; SkillGraph: any } | null = null;
let cachedGraph: { graph: any; builtAt: number } | null = null;
const GRAPH_CACHE_TTL_MS = 300_000; // 5 minutes

interface GraphSearchResult {
  id: number | string;
  score: number;
  source_detail: string;
  [key: string]: unknown;
}

function loadSgqs() {
  if (!sgqsModule) {
    try {
      sgqsModule = require('../../../scripts/dist/sgqs/index.js');
    } catch {
      sgqsModule = null;
    }
  }
  return sgqsModule;
}

function getCachedGraph() {
  const now = Date.now();
  if (cachedGraph && (now - cachedGraph.builtAt) < GRAPH_CACHE_TTL_MS) {
    return cachedGraph.graph;
  }
  const sgqs = loadSgqs();
  if (!sgqs) return null;

  const skillRoot = path.join(DEFAULT_BASE_PATH, '.opencode', 'skill');
  try {
    const graph = sgqs.buildSkillGraph(skillRoot);
    cachedGraph = { graph, builtAt: now };
    return graph;
  } catch {
    return null;
  }
}

/**
 * Search the skill graph by matching query terms against node properties.
 * Returns scored results compatible with the RRF fusion pipeline.
 */
function searchSkillGraph(
  query: string,
  options: { limit?: number; specFolder?: string }
): GraphSearchResult[] {
  const graph = getCachedGraph();
  if (!graph || graph.nodes.size === 0) return [];

  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length >= 2);
  if (queryTerms.length === 0) return [];

  const limit = options.limit || 20;
  const scored: GraphSearchResult[] = [];

  for (const [nodeId, node] of graph.nodes) {
    // Build searchable text from node properties
    const searchable = [
      node.skill,
      ...(node.labels || []),
      (node.properties.name as string) || '',
      (node.properties.title as string) || '',
      (node.properties.description as string) || '',
      (node.properties.summary as string) || '',
    ].join(' ').toLowerCase();

    let matchCount = 0;
    for (const term of queryTerms) {
      if (searchable.includes(term)) matchCount++;
    }

    if (matchCount > 0) {
      const score = matchCount / queryTerms.length; // 0-1 normalized
      scored.push({
        id: nodeId,
        score,
        source_detail: 'skill_graph',
        skill: node.skill,
        labels: node.labels,
        node_name: node.properties.name || nodeId,
      });
    }
  }

  // Sort by score descending, take top N
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

/**
 * Search causal edges for graph neighbors of high-scoring memories.
 * Uses the existing causal_edges table with lightweight SQL.
 */
function searchCausalGraph(
  db: Database.Database,
  query: string,
  options: { limit?: number; specFolder?: string }
): GraphSearchResult[] {
  const limit = options.limit || 10;

  try {
    // Find memories whose titles/trigger_phrases match query terms
    const rows = db.prepare(`
      SELECT DISTINCT ce.target_id AS id,
             mi.title, mi.spec_folder, mi.trigger_phrases,
             ce.relation_type, ce.strength
      FROM causal_edges ce
      JOIN memory_index mi ON mi.id = ce.target_id
      WHERE ce.source_id IN (
        SELECT id FROM memory_fts
        WHERE memory_fts MATCH ?
        LIMIT 10
      )
      ORDER BY ce.strength DESC
      LIMIT ?
    `).all(
      query.split(/\s+/).filter(t => t.length >= 2).join(' OR '),
      limit
    ) as Array<Record<string, unknown>>;

    return rows.map(row => ({
      id: row.id as number,
      score: (row.strength as number) || 0.5,
      source_detail: 'causal_graph',
      title: row.title,
      spec_folder: row.spec_folder,
      relation_type: row.relation_type,
    }));
  } catch {
    return [];
  }
}

/**
 * Create the composite graphSearchFn for hybrid-search.ts init().
 * Queries both the SGQS skill graph and the causal edge graph.
 */
export function createGraphSearchFn(db: Database.Database) {
  return function graphSearchFn(
    query: string,
    options: Record<string, unknown>
  ): Array<Record<string, unknown>> {
    const limit = (options.limit as number) || 20;
    const specFolder = options.specFolder as string | undefined;
    const opts = { limit: Math.ceil(limit / 2), specFolder };

    // Run both graph sources
    const skillResults = searchSkillGraph(query, opts);
    const causalResults = searchCausalGraph(db, query, opts);

    // Merge and deduplicate by id
    const seen = new Set<number | string>();
    const merged: Array<Record<string, unknown>> = [];

    for (const r of [...skillResults, ...causalResults]) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        merged.push(r);
      }
    }

    // Sort by score, return top N
    merged.sort((a, b) => (b.score as number) - (a.score as number));
    return merged.slice(0, limit);
  };
}
```

**Wiring changes (2 lines each in 2 files):**

```typescript
// context-server.ts:566 CHANGE FROM:
hybridSearch.init(database, vectorIndex.vectorSearch);
// TO:
import { createGraphSearchFn } from './lib/search/graph-search-fn';
hybridSearch.init(database, vectorIndex.vectorSearch, createGraphSearchFn(database));

// db-state.ts:140 CHANGE FROM:
if (hybridSearch) hybridSearch.init(database, vectorIndex.vectorSearch);
// TO:
if (hybridSearch) hybridSearch.init(database, vectorIndex.vectorSearch, createGraphSearchFn(database));
```

**Effort:**
| Metric | Value |
|--------|-------|
| New file | `mcp_server/lib/search/graph-search-fn.ts` |
| LOC added | ~130 |
| Files modified | 2 (`context-server.ts`, `db-state.ts`) |
| LOC modified | ~4 (2 lines each) |
| Complexity | Medium |
| Latency impact | +5-15ms (graph cached after first call; causal SQL is fast) |
| Test file | `tests/graph-search-fn.vitest.ts` (~80 LOC) |

### 5.2 Phase 1 Enhancement: Graph Distance as MMR Diversity Signal

**Original Phase 1**: MMR uses cosine similarity between embeddings.
**Enhancement**: Add graph distance (hop count) as a secondary diversity signal.

**Current MMR Algorithm** (from `mmr-reranker.ts:84-142`):

```typescript
const mmrScore = lambda * relevance - (1 - lambda) * maxSim;
```

Where `maxSim` is the maximum **cosine similarity** between candidate embedding and all selected embeddings.

**Proposed Enhancement**: Blend cosine similarity with graph proximity:

```typescript
// Proposed change to mmr-reranker.ts
export interface MMRCandidate {
  id: number | string;
  score: number;
  embedding: Float32Array;
  content?: string;
  graphNodeId?: string;  // NEW: skill graph node ID if available
}

export interface MMRConfig {
  lambda: number;
  limit: number;
  maxCandidates?: number;
  graphDistanceWeight?: number;  // NEW: 0-1, default 0
}

// Inside the selection loop:
const cosineSim = computeCosine(pool[i].embedding, sel.embedding);
const graphSim = pool[i].graphNodeId && sel.graphNodeId
  ? computeGraphProximity(pool[i].graphNodeId, sel.graphNodeId) // 0-1
  : cosineSim; // fallback to cosine if no graph data
const blendedSim = (1 - graphDistanceWeight) * cosineSim + graphDistanceWeight * graphSim;
const mmrScore = lambda * relevance - (1 - lambda) * blendedSim;
```

**`computeGraphProximity`**: Uses the SGQS `outbound`/`inbound` adjacency maps. If two nodes share a direct edge, proximity = 1.0. If 2 hops apart, proximity = 0.5. If >2 hops or unconnected, proximity = 0.0.

**Assessment**: This is a NICE-TO-HAVE, not critical. The graph distance signal only matters when two memories are embedded-similar but topically different (or vice versa). The current cosine-only approach already works well for most cases.

**Recommendation**: Defer to Phase 1.5. Implement Phase 0+ (graphSearchFn) first, gather data on graph channel hit rates, then decide if graph-distance MMR is worth the complexity.

**Effort:**
| Metric | Value |
|--------|-------|
| File modified | `mmr-reranker.ts` |
| LOC added | ~40 |
| Complexity | High (requires caching graph adjacency, computing shortest paths) |
| Latency impact | +2-5ms (BFS on cached graph) |
| Priority | LOW (defer) |

### 5.3 Phase 2 Enhancement: Skill Graph Edge Type Weights

**Original Phase 2**: Causal edge weights (`supersedes=1.5x, contradicts=0.8x, caused=1.3x`).
**Already implemented**: `RELATION_WEIGHTS` in `causal-edges.ts`.

**Proposed Enhancement**: Add skill graph edge type weights to the `GRAPH_WEIGHT_BOOST` calculation in RRF fusion.

Skill graph edge types (from `types.ts:324-326`):
- `:LINKS_TO` -- general navigation link
- `:CONTAINS` -- index contains node
- `:REFERENCES` -- external reference
- `:HAS_ENTRYPOINT` -- skill has entrypoint
- `:HAS_INDEX` -- skill has index
- `:DEPENDS_ON` -- cross-skill dependency

**Proposed Weights:**

```typescript
const SKILL_GRAPH_EDGE_WEIGHTS: Record<string, number> = {
  DEPENDS_ON: 1.4,   // Cross-skill dependency = high signal
  CONTAINS: 1.2,     // Structural containment = moderate signal
  LINKS_TO: 1.0,     // Generic navigation = baseline
  REFERENCES: 0.9,   // External reference = slightly lower
  HAS_ENTRYPOINT: 1.1,
  HAS_INDEX: 1.0,
};
```

**Implementation**: Apply these weights inside the `searchSkillGraph()` function (from 5.1) by boosting scores for nodes connected via high-weight edge types.

**Assessment**: Moderate value. The edge type weights help distinguish between a node that is DEPENDED upon by others (high authority) versus one that merely links to things. However, this overlaps with what PageRank would provide (deferred to Phase 4).

**Recommendation**: Include as part of Phase 0+ implementation. Low additional effort since the weight table is applied inside the new `searchSkillGraph()` function.

**Effort:**
| Metric | Value |
|--------|-------|
| Files modified | `graph-search-fn.ts` (new file from 5.1) |
| LOC added | ~15 (weight table + application logic) |
| Complexity | Low |
| Latency impact | Negligible |
| Priority | MEDIUM (bundle with Phase 0+) |

### 5.4 NEW Phase: Skill Graph as First-Class Retrieval Channel

This is the core of section 5.1 above, described separately for clarity.

**What Must Exist:**

| Component | Status | Action |
|-----------|--------|--------|
| `GraphSearchFn` type | EXISTS | Use as-is |
| `graph-search-fn.ts` module | MISSING | Create (see 5.1) |
| SGQS graph cache | MISSING | Create (5-minute TTL, lazy load) |
| Causal edge query | EXISTS (causal-boost.ts) | Adapt into graphSearchFn |
| RRF `GRAPH_WEIGHT_BOOST = 1.5` | EXISTS | Use as-is (already applied to `source === 'graph'`) |
| Adaptive fusion graph weight | MISSING | Add `graphWeight` to `FusionWeights` |
| `init()` call with graphFn | MISSING | Wire in context-server.ts and db-state.ts |

**New Code Required:**

| File | Action | LOC |
|------|--------|-----|
| `mcp_server/lib/search/graph-search-fn.ts` | CREATE | ~130 |
| `mcp_server/context-server.ts` | MODIFY (1 import + 1 line) | ~3 |
| `mcp_server/core/db-state.ts` | MODIFY (1 import + 1 line) | ~3 |
| `tests/graph-search-fn.vitest.ts` | CREATE | ~80 |
| `mcp_server/lib/search/adaptive-fusion.ts` | MODIFY (add graphWeight) | ~15 |

**Total**: 1 new production file, 1 new test file, 3 modified files, ~230 LOC.

### 5.5 Phase 2 Enhancement: Adaptive Fusion Graph Weight Column

The adaptive fusion module has three weight dimensions:

```typescript
export interface FusionWeights {
  semanticWeight: number;  // vector
  keywordWeight: number;   // FTS + BM25
  recencyWeight: number;   // time decay
  // MISSING: graphWeight
}
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:15-22`]

The weight profiles do not include a graph dimension:

```typescript
const INTENT_WEIGHT_PROFILES: Record<string, FusionWeights> = {
  understand:   { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1 },
  find_spec:    { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1 },
  fix_bug:      { semanticWeight: 0.4, keywordWeight: 0.4, recencyWeight: 0.2 },
  // ...
};
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts:53-60`]

**Proposed Enhancement:**

```typescript
export interface FusionWeights {
  semanticWeight: number;
  keywordWeight: number;
  recencyWeight: number;
  graphWeight: number;  // NEW
}

const INTENT_WEIGHT_PROFILES: Record<string, FusionWeights> = {
  understand:   { semanticWeight: 0.6, keywordWeight: 0.15, recencyWeight: 0.1, graphWeight: 0.15 },
  find_spec:    { semanticWeight: 0.6, keywordWeight: 0.15, recencyWeight: 0.1, graphWeight: 0.15 },
  fix_bug:      { semanticWeight: 0.35, keywordWeight: 0.35, recencyWeight: 0.15, graphWeight: 0.15 },
  debug:        { semanticWeight: 0.35, keywordWeight: 0.35, recencyWeight: 0.15, graphWeight: 0.15 },
  add_feature:  { semanticWeight: 0.4, keywordWeight: 0.25, recencyWeight: 0.15, graphWeight: 0.2 },
  refactor:     { semanticWeight: 0.5, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.2 },
};
```

**Rationale for graph weight per intent:**
- `add_feature` and `refactor`: Graph context (what depends on what) matters MORE for structural changes.
- `fix_bug` and `debug`: Graph matters less; exact keyword and semantic similarity dominate.
- `understand` and `find_spec`: Graph provides navigation context; moderate weight.

**Effort:**
| Metric | Value |
|--------|-------|
| File modified | `adaptive-fusion.ts` |
| LOC modified | ~25 (interface change + 6 profile updates) |
| Files also affected | `hybrid-search.ts` (apply graphWeight to graph list) |
| Complexity | Low |
| Latency impact | None (weight computation, not I/O) |

---

## 6. Priority Ordering: Maximum Impact Per Hour

### Priority Matrix

| Priority | Task | Impact | Effort | ROI | Prerequisite |
|----------|------|--------|--------|-----|-------------|
| **P0** | Wire `graphSearchFn` (5.1 + 5.4) | HIGH -- activates dead channel | ~4h | HIGHEST | None |
| **P1** | Add `graphWeight` to adaptive fusion (5.5) | MEDIUM -- intent-aware graph scoring | ~1h | HIGH | P0 |
| **P2** | Skill graph edge type weights (5.3) | LOW-MEDIUM | ~0.5h | MEDIUM | P0 |
| **P3** | Graph distance in MMR (5.2) | LOW | ~3h | LOW | P0, requires metrics |
| **P4** | Wire PageRank into ingest pipeline (existing Phase 4) | MEDIUM | ~4h | MEDIUM | P0 |
| **P5** | Wire structure-aware chunker (existing Phase 4) | MEDIUM | ~3h | MEDIUM | Independent |

### Recommended Implementation Order

```
PHASE 0+ (IMMEDIATE -- close the dead channel):
  1. Create graph-search-fn.ts                           [4h, HIGH impact]
  2. Wire into context-server.ts and db-state.ts          [0.5h, completes P0]
  3. Add graphWeight to adaptive-fusion.ts                [1h, MEDIUM impact]
  4. Create tests/graph-search-fn.vitest.ts               [1h, required]
  5. Add SKILL_GRAPH_EDGE_WEIGHTS to graph-search-fn.ts   [0.5h, LOW-MED impact]

  Total: ~7h | Impact: The graph channel goes from producing ZERO results to being
  a first-class participant in every search.

PHASE 1+ (NEXT -- tune and validate):
  6. Enable SPECKIT_ADAPTIVE_FUSION in production         [0.5h]
  7. Instrument graph channel hit rate (console.error)    [0.5h]
  8. Benchmark 120ms latency ceiling with graph active    [1h]
  9. Write integration test for full pipeline with graph  [2h]

  Total: ~4h | Impact: Validates that graph integration meets constraints.

PHASE 4 ITEMS (BACKLOG -- wire existing modules):
  10. Wire PageRank into memory_manage batch               [4h]
  11. Wire structure-aware chunker into generate-context.js [3h]
  12. Add graph distance to MMR (data-driven decision)     [3h]

  Total: ~10h | Impact: Incremental quality improvements.
```

### What Gives the Most Retrieval Quality Improvement Per Hour?

**Answer: Creating `graph-search-fn.ts` and wiring it into `init()`.**

This is the single highest-ROI change because:
1. The graph channel hook ALREADY EXISTS in the pipeline (lines 270-285 of hybrid-search.ts)
2. The RRF fusion ALREADY applies `GRAPH_WEIGHT_BOOST = 1.5` to graph-sourced results
3. The convergence bonus ALREADY rewards results that appear in multiple channels
4. All this existing infrastructure currently receives NOTHING because `graphSearchFn` is null
5. Simply providing a function that returns results activates the entire downstream graph pipeline

The second highest-ROI change is adding `graphWeight` to adaptive fusion, because it makes the graph channel's contribution intent-aware rather than using the hardcoded 1.5x boost for all queries.

---

## 7. Integration Test Strategy

### 7.1 Unit Tests for `graph-search-fn.ts`

```typescript
// tests/graph-search-fn.vitest.ts
describe('graph-search-fn', () => {
  describe('searchSkillGraph', () => {
    it('returns scored results matching query terms to node properties');
    it('returns empty array for no matches');
    it('respects limit parameter');
    it('normalizes scores to 0-1 range');
    it('caches graph for GRAPH_CACHE_TTL_MS');
    it('handles missing SGQS module gracefully');
  });

  describe('searchCausalGraph', () => {
    it('returns causal neighbors of FTS-matched memories');
    it('returns empty array when no causal edges exist');
    it('handles FTS match failure gracefully');
  });

  describe('createGraphSearchFn', () => {
    it('returns a function matching GraphSearchFn type');
    it('merges skill and causal results without duplicates');
    it('sorts by score descending');
    it('respects overall limit');
  });
});
```

### 7.2 Integration Tests

```typescript
// Extend tests/integration-138-pipeline.vitest.ts
describe('C138-P0+: Graph Channel Integration', () => {
  it('graph channel produces non-empty results when graphSearchFn is provided');
  it('graph results participate in RRF fusion with GRAPH_WEIGHT_BOOST');
  it('convergence bonus applied when same memory appears in vector AND graph');
  it('adaptive fusion applies graphWeight from intent profile');
  it('graph channel failure degrades gracefully to 3-channel fusion');
  it('total pipeline latency stays under 120ms with graph channel active');
});
```

### 7.3 Metrics to Track

| Metric | How to Measure | Success Criteria |
|--------|---------------|------------------|
| Graph channel hit rate | `console.error('[hybrid-search] graph channel: N results')` | >0 results for >50% of queries |
| Graph-vector convergence | Count results with both 'vector' and 'graph' in `sources[]` | >0 for topical queries |
| Pipeline latency (mode=auto) | `console.time('hybridSearchEnhanced')` | <120ms P95 |
| Graph cache hit rate | Counter in `getCachedGraph()` | >95% after warmup |
| Retrieval quality (proxy) | A/B comparison: graph on vs. graph off | Higher convergence bonus scores with graph on |

### 7.4 Regression Guards

```typescript
// Tests that MUST pass to ensure no regression:
it('graphSearchFn null fallback: pipeline works without graph', () => {
  hybridSearch.init(mockDb, mockVectorSearch, null);
  // Existing 3-channel pipeline works identically to pre-integration
});

it('SGQS module load failure: silent fallback', () => {
  // Mock require failure for sgqs/index.js
  // Verify graphSearchFn returns [] instead of throwing
});

it('graph cache expired: rebuild does not block', () => {
  // Verify TTL-based cache expiry triggers rebuild
  // Verify rebuild latency < 50ms
});
```

---

## 8. Effort Estimates: Full Breakdown

### Phase 0+ (Skill Graph Channel Activation)

| # | Change | File | LOC | Complexity | Latency |
|---|--------|------|-----|-----------|---------|
| 1 | Create `graph-search-fn.ts` | NEW: `mcp_server/lib/search/graph-search-fn.ts` | 130 | Med | +5-15ms |
| 2 | Wire graphFn in context-server | MOD: `mcp_server/context-server.ts` | 3 | Low | 0ms |
| 3 | Wire graphFn in db-state | MOD: `mcp_server/core/db-state.ts` | 3 | Low | 0ms |
| 4 | Add `graphWeight` to `FusionWeights` | MOD: `mcp_server/lib/search/adaptive-fusion.ts` | 25 | Low | 0ms |
| 5 | Apply graphWeight in `hybridSearchEnhanced` | MOD: `mcp_server/lib/search/hybrid-search.ts` | 10 | Low | 0ms |
| 6 | Skill graph edge type weights | IN `graph-search-fn.ts` (step 1) | 15 | Low | 0ms |
| 7 | Create unit tests | NEW: `tests/graph-search-fn.vitest.ts` | 80 | Low | N/A |
| 8 | Extend integration tests | MOD: `tests/integration-138-pipeline.vitest.ts` | 40 | Low | N/A |
| **TOTAL** | | **2 new, 4 modified** | **~306** | **Med** | **+5-15ms** |

### Phase 1+ (Validation and Tuning)

| # | Change | File | LOC | Complexity | Latency |
|---|--------|------|-----|-----------|---------|
| 9 | Instrument graph hit rate | MOD: `hybrid-search.ts` | 5 | Low | 0ms |
| 10 | Benchmark latency | NEW: `tests/benchmark-graph-latency.vitest.ts` | 60 | Med | N/A |
| **TOTAL** | | **1 new, 1 modified** | **~65** | **Low** | **0ms** |

### Future: Graph Distance MMR (Deferred)

| # | Change | File | LOC | Complexity | Latency |
|---|--------|------|-----|-----------|---------|
| 11 | Add `graphNodeId` to MMRCandidate | MOD: `mmr-reranker.ts` | 5 | Low | 0ms |
| 12 | Implement `computeGraphProximity` | MOD: `mmr-reranker.ts` | 40 | High | +2-5ms |
| 13 | Blend graph distance into MMR score | MOD: `mmr-reranker.ts` | 15 | Med | 0ms |
| 14 | Update MMR tests | MOD: `tests/mmr-reranker.vitest.ts` | 30 | Low | N/A |
| **TOTAL** | | **0 new, 2 modified** | **~90** | **High** | **+2-5ms** |

---

## 9. Constraints and Limitations

### Hard Constraints Verified

| Constraint | Status | Evidence |
|-----------|--------|---------|
| Zero SQLite schema changes | SAFE | No `ALTER TABLE`, no new tables. All changes are TypeScript. |
| 120ms latency ceiling (mode=auto) | AT RISK | Graph channel adds 5-15ms. Budget: vector=35ms + FTS=15ms + BM25=5ms + graph=15ms + fusion=5ms + MMR=2ms + rerank=10ms = 87ms. Under ceiling. |
| No external databases | SAFE | SGQS builds in-memory from filesystem. Causal edges use existing SQLite. |
| No LLM calls in MCP server | SAFE | Graph search is pure string matching + SQL. No API calls. |
| Feature flag dark launch | SAFE | `graphSearchFn` null check already acts as implicit feature gate. For explicit control, add `SPECKIT_GRAPH_SEARCH` env flag. |
| Existing MCP tool contracts unchanged | SAFE | `memory_context`, `memory_search`, `memory_save` signatures and response formats unchanged. |

### Latency Budget Analysis

```
CURRENT (3 channels):
  Vector:  ~35ms
  FTS5:    ~15ms
  BM25:    ~5ms
  ─────────────
  Subtotal: 55ms (parallel)
  Fusion:   ~5ms
  MMR:      ~2ms
  Rerank:   ~10ms
  ─────────────
  Total:    ~72ms (well under 120ms)

TARGET (4 channels):
  Vector:  ~35ms  ┐
  FTS5:    ~15ms  │ parallel
  BM25:    ~5ms   │
  Graph:   ~15ms  ┘  (graph is parallel with others)
  ─────────────
  Subtotal: 35ms (gated by vector, the slowest)
  Fusion:   ~7ms  (extra source list)
  MMR:      ~2ms
  Rerank:   ~10ms
  ─────────────
  Total:    ~54ms (STILL well under 120ms)
```

The key insight: all four search channels run in `Promise.all` (parallel). The graph channel at 15ms is FASTER than vector at 35ms, so it does NOT add to the critical path. The only additional cost is the fusion step processing one extra ranked list (+2ms).

### SGQS Cache Constraint

The SGQS `buildSkillGraph()` reads the filesystem on every call. For the 412-node graph:
- Cold build: ~200ms (filesystem I/O for 72 markdown files)
- Cached: ~0ms (in-memory Map access)

The 5-minute cache TTL means the first search after server start or cache expiry pays the 200ms cost. All subsequent searches within 5 minutes hit the cache. This is acceptable because:
1. Skill graph changes are rare (authored by humans, not generated per-query)
2. The first search can amortize the build cost without user-visible delay (200ms + 54ms = 254ms, over ceiling but only for the first call)
3. For strict 120ms compliance on cold start, the graph can be pre-warmed in `context-server.ts` during the startup sequence.

**Mitigation**: Add a `preWarmGraphCache()` call after `hybridSearch.init()` in context-server.ts.

---

## 10. Integration Patterns

### 10.1 Cross-Workspace Module Loading

The SGQS modules live in `scripts/sgqs/` while the MCP server lives in `mcp_server/`. The existing `sgqs-query.ts` handler already uses dynamic `require()` to cross this boundary:

```typescript
const { query } = require('../../scripts/dist/sgqs/index.js');
```

[SOURCE: `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts:12`]

The new `graph-search-fn.ts` should follow the same pattern: lazy `require()` with null fallback.

### 10.2 Error Handling Pattern

Every search channel in `hybridSearch()` wraps its call in try/catch and returns `[]` on failure. The new graph channel must follow this exact pattern to ensure graceful degradation.

### 10.3 Feature Flag Pattern

The codebase uses `isFeatureEnabled('SPECKIT_*')` from `rollout-policy.ts` for feature flags. However, for the graph channel, the null check on `graphSearchFn` already acts as an implicit feature gate. The recommendation is to add an explicit `SPECKIT_GRAPH_SEARCH` flag only if needed for A/B testing.

---

## 11. Performance Considerations

### Graph Cache Memory Footprint

412 nodes with Map storage: ~200KB in memory. 627 edges: ~100KB. Total: ~300KB. Negligible for a Node.js process.

### RRF Fusion Additional Cost

Adding a 4th ranked list to `fuseResultsMulti()` increases the inner loop iterations by ~20 items (graph limit). For 80 total items across 4 lists, the Map operations are O(80), completing in <1ms.

### SGQS Node Property Search

The keyword matching in `searchSkillGraph()` iterates all 412 nodes and checks string inclusion for each query term. For a 3-term query: 412 * 3 = 1,236 string operations. With modern V8, this completes in <1ms.

---

## 12. Security Considerations

No new security concerns. The graph search function:
- Reads only from the local filesystem (skill graph) and SQLite (causal edges)
- Does not accept external input beyond the search query string
- Uses parameterized SQL queries (no injection risk)
- Does not make network calls

---

## 13. Maintenance and Upgrade Path

### Adding New Skills

When a new skill is added to the graph:
1. The SGQS graph builder automatically discovers it on next cache rebuild
2. `graph-enrichment.ts` automatically extracts trigger phrases at index time
3. No code changes needed -- the system self-discovers new skills

### Tuning Graph Weights

All weights are in named constants:
- `GRAPH_WEIGHT_BOOST` in `rrf-fusion.ts` (RRF boost for graph-sourced results)
- `SKILL_GRAPH_EDGE_WEIGHTS` in `graph-search-fn.ts` (edge type scoring)
- `graphWeight` in `INTENT_WEIGHT_PROFILES` in `adaptive-fusion.ts` (intent-based graph weight)

### Cache TTL Tuning

`GRAPH_CACHE_TTL_MS` in `graph-search-fn.ts` controls how often the graph is rebuilt. Increase for stability, decrease for freshness.

---

## 14. API Reference

### New Exports

```typescript
// graph-search-fn.ts
export function createGraphSearchFn(db: Database.Database): GraphSearchFn;
```

### Modified Exports

```typescript
// adaptive-fusion.ts
export interface FusionWeights {
  semanticWeight: number;
  keywordWeight: number;
  recencyWeight: number;
  graphWeight: number;  // NEW
}
```

### Unchanged Exports

```typescript
// hybrid-search.ts init() -- signature unchanged, 3rd arg was always optional
function init(
  database: Database.Database,
  vectorFn: VectorSearchFn | null = null,
  graphFn: GraphSearchFn | null = null
): void;
```

---

## 15. Troubleshooting

### Graph channel returns 0 results

1. Check `graphSearchFn` is not null: `console.error('[hybrid-search] graphSearchFn:', graphSearchFn ? 'SET' : 'NULL')`
2. Check SGQS module loads: `require('../../scripts/dist/sgqs/index.js')` -- is dist built?
3. Check graph cache: Is `skillRoot` correct? Does it point to `.opencode/skill/`?
4. Check query terms: Are query terms at least 2 characters? Short terms are filtered.

### Graph cache rebuild is slow

1. Check disk I/O: `buildSkillGraph()` reads 72 files. On slow disks, this can take >200ms.
2. Mitigation: Pre-warm cache in `context-server.ts` startup.
3. Check TTL: Decrease `GRAPH_CACHE_TTL_MS` if graph changes frequently.

### Latency exceeds 120ms

1. Profile: Add `console.time('graph-search')` around the graph channel call.
2. Check if cold graph build is the cause (first call only).
3. Reduce `limit` in graph search options to return fewer results.

---

## 16. Acknowledgements

### Sources Examined

| Source | Grade | File Path |
|--------|-------|-----------|
| `hybrid-search.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts` |
| `rrf-fusion.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts` |
| `adaptive-fusion.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts` |
| `co-activation.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts` |
| `causal-boost.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` |
| `mmr-reranker.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/mmr-reranker.ts` |
| `graph-enrichment.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/memory/graph-enrichment.ts` |
| `sgqs-query.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/sgqs-query.ts` |
| `sgqs/types.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/types.ts` |
| `sgqs/index.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/scripts/sgqs/index.ts` |
| `context-server.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts` |
| `db-state.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts` |
| `memory-search.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` |
| `memory-context.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` |
| `intent-classifier.ts` (production) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` |
| 001 plan.md (spec) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/plan.md` |
| 002 plan.md (spec) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/plan.md` |
| 001 implementation-summary.md (spec) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md` |
| 002 implementation-summary.md (spec) | A | `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md` |

---

## 17. Appendix: Complete Change List

### Files to Create

| File | LOC | Purpose |
|------|-----|---------|
| `mcp_server/lib/search/graph-search-fn.ts` | ~130 | Composite graph search function (SGQS + causal) |
| `mcp_server/tests/graph-search-fn.vitest.ts` | ~80 | Unit tests for graph search function |

### Files to Modify

| File | LOC Changed | Purpose |
|------|-------------|---------|
| `mcp_server/context-server.ts` | ~3 | Wire graphSearchFn into init() |
| `mcp_server/core/db-state.ts` | ~3 | Wire graphSearchFn into re-init() |
| `mcp_server/lib/search/adaptive-fusion.ts` | ~25 | Add graphWeight to FusionWeights and profiles |
| `mcp_server/lib/search/hybrid-search.ts` | ~10 | Apply graphWeight from adaptive fusion |
| `mcp_server/tests/integration-138-pipeline.vitest.ts` | ~40 | Graph channel integration tests |

### Total Effort Summary

| Phase | Files | LOC | Hours | Impact |
|-------|-------|-----|-------|--------|
| Phase 0+ (Graph Channel) | 2 new, 4 mod | ~306 | ~7h | HIGH |
| Phase 1+ (Validation) | 1 new, 1 mod | ~65 | ~4h | MEDIUM |
| Phase 4 (Deferred) | 0 new, 2 mod | ~90 | ~10h | INCREMENTAL |
| **Total** | **3 new, 7 mod** | **~461** | **~21h** | |

---

### Changelog

| Date | Change |
|------|--------|
| 2026-02-20 | Initial research document created from 9-step investigation |

## Source: 006-hybrid-rag-fusion-logic-improvements

---
title: "Research: 006 Current-State Analysis -- System-Spec-Kit + MCP Memory Server (Hybrid RAG Fusion)"
description: "Deep current-state analysis and strategic upgrade recommendations focused on power, intelligence, utility, interconnection, automation, and bug resistance for system-spec-kit and the MCP memory server retrieval stack."
trigger_phrases:
  - "research"
  - "006"
  - "hybrid rag fusion"
  - "current state"
  - "mcp memory server"
  - "bug eradication"
importance_tier: "critical"
contextType: "research"
---
# Research: 006 Current-State Analysis -- System-Spec-Kit + MCP Memory Server (Hybrid RAG Fusion)

<!-- SPECKIT_LEVEL: 3+ -->

---

## 1. Metadata

| Field | Value |
|-------|-------|
| Research ID | R-006-HRF-CSA-2026-02-22 |
| Status | COMPLETE |
| Date | 2026-02-22 |
| Scope | Current-state architecture, capability inventory, failure modes, test coverage observations, automation opportunities, and strategic roadmap for hybrid RAG fusion |
| Evidence Grade | A/B mixed (A for code claims, B for runtime/operational inferences) |
| Target Artifact | .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/research.md |

---

## 2. Investigation Report

### Request Summary

This investigation analyzed current system behavior and upgrade opportunities for system-spec-kit plus MCP memory server hybrid RAG fusion, with explicit continuity from specs 002-005 and focus on higher power, smarter routing, tighter interconnection, more automation, and stronger bug resistance.

### Scope and Continuity Anchors

- `006` scope emphasizes audit-first seam hardening across parse -> index -> fusion -> routing, confidence-policy unification, and prevention controls for recurrence from `002`, `004`, and `003`. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:63-67`]
- `002` established tri-hybrid fusion baseline (vector + lexical + graph) with MMR/TRM and explicitly documented deferred operational risks (latency not fully validated; some modules created but not fully wired at that point). [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md:48-49`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md:271-281`]
- `003` delivered canonical-path dedup and deterministic tier precedence as invariants. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md:41-44`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md:73-75`] <!-- AUDIT-2026-03-08: 002-index-tier-anomalies is now 002-indexing-normalization -->
- `004` delivered frontmatter normalization + migration idempotency and successful reindex, while deferring some operational controls. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:41-44`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:65-74`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:105-106`]
- `005` completed session auto-detection hardening, with residual mtime-bias risk documented. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/implementation-summary.md:37`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/implementation-summary.md:95-96`] <!-- AUDIT-2026-03-08: 002-auto-detected-session-bug is now 002-indexing-normalization -->

### Top Current-State Findings

1. Runtime wiring for graph search is now active and preserved across DB reinit. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:566-576`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:84-92`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:147-151`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:9-41`]
2. There are still high-value correctness seams (graph-result contract shape mismatch, deep-mode expansion propagation gap, source-provenance loss in dedup). [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:41-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`]
3. Observability primitives are strong (retrieval trace + telemetry), but documentation and schema semantics are drifting from implementation details. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:13-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:24-39`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94-113`]
4. Test surface is broad, but key runtime paths still have deferred/skipped coverage segments. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:10-27`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1119-1124`]

---

## 3. Executive Overview

The platform already has a mature layered architecture (L1-L7), a rich hybrid retrieval pipeline, resilient indexing safeguards, and observability foundations. The highest leverage is no longer adding new retrieval primitives; it is tightening contracts between existing components, eliminating seam-level ambiguity, and automating drift detection between code, tests, and docs.

The current system is powerful but not yet fully self-defending. It needs contract hardening + automated governance loops to become reliably smarter over time.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:38-101`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:775-1032`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:585-657`]

---

## 4. Current Architecture Map

### End-to-End Retrieval Path (Observed Runtime)

```text
Caller
  -> L1 memory_context
      - mode + intent + pressure policy
      - strategy routing (quick/deep/focused/resume)
      -> L2 memory_search
          - query validation, intent detect, cache keying
          - deep mode expansion (mode=deep only)
          - hybrid search with fallback
              - vector + FTS + BM25 + graph (if graph fn wired)
          - post-search pipeline
              - state filter
              - session/causal boosts
              - intent/artifact weighting
              - cross-encoder rerank
              - TRM evidence-gap check
          - formatter + optional content/anchors
          - trace + telemetry metadata
```

### Runtime Wiring Map

- Startup initializes graph search function, injects into `hybridSearch.init(...)`, and mirrors same wiring into DB-state reinit. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:566-576`]
- Reinit logic rehydrates hybrid search with the same `graphSearchFnRef`, and regression test verifies the contract. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts:147-151`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:36-41`]
- L1 orchestration exposes five modes and pressure-policy override behavior. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:202-240`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:447-479`]
- L2 pipeline includes trace stages and telemetry insertion points through candidate/fusion/rerank/final. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1147-1153`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:894-905`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:965-989`]

---

## 5. Capability Inventory (Current State)

| Capability Domain | Current State | Evidence |
|-------------------|---------------|----------|
| Layered MCP architecture | Mature 7-layer model with token budgets and tool-to-layer mapping | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:38-101`] |
| Tooling breadth | 23 tool definitions aggregated across L1-L7 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`] |
| Hybrid retrieval | Active vector + FTS + BM25 + graph path with fallback and post-fusion enhancements | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:337-353`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1301-1417`] |
| Deep-mode semantics | Query expansion exists but only runs when `mode === 'deep'` | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] |
| Evidence confidence | TRM evidence-gap signal integrated into output summary and metadata | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:907-925`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:137-169`] |
| Indexing safety | Canonical dedup, incremental categorization, mtime update only after successful indexing | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:492-507`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:585-591`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:649-657`] |
| Parser quality gates | Spec document typing, canonical spec-folder extraction, quality score/flags extraction | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:160-170`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:242-270`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:290-315`] |
| Crash/recovery + audit | Pending-file transaction recovery and append-only mutation ledger triggers | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:13-16`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:155-203`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:76-81`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:191-202`] |
| Observability primitives | Retrieval trace contracts and telemetry model implemented, feature-flagged default-on | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:13-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:13-18`] |
| Feature flag behavior | Default-on opt-out pattern (`false` disables) | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts:36-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:9-30`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:9-12`] |

---

## 6. Failure Mode Inventory (High-Value)

| ID | Failure Mode | Impact | Severity | Evidence |
|----|--------------|--------|----------|----------|
| FM-01 | Graph result contract mismatch (`mem:edgeId` and edge-level payload vs formatter expecting memory-row shape) | Retrieval output may be structurally inconsistent; downstream ranking/format assumptions weaken | P0 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:41-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:41-50`] |
| FM-02 | Deep-mode expansion is conditionally implemented but not propagated from `memory_context` deep strategy | Reduced recall and "deep" behavior mismatch for L1 callers | P0 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] |
| FM-03 | Multi-source provenance dropped during hybrid dedup | Debuggability and explainability degrade; channel attribution unclear | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] |
| FM-04 | File write and DB index are not fully atomic | Partial-success states require manual recovery path (file exists but DB missing) | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1593-1599`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1630-1636`] |
| FM-05 | Documentation/contract drift across architecture descriptors | Operational misunderstandings and incorrect tuning decisions | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:340-343`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:44`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:321-322`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94-113`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:121-134`] |
| FM-06 | Critical runtime paths have deferred/skipped test depth | Regressions can escape despite broad test count | P1 | [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:10-27`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1119-1124`] |
| FM-07 | Known operational risks remain from previous specs (latency proof gaps, deferred controls, residual mtime bias risk) | Reliability confidence gap persists under production pressure | P1 | [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md:271-281`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:105-106`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/implementation-summary.md:95-96`] |

---

## 7. Test Coverage Observations

### Strengths

- Dedicated suites validate retrieval telemetry, retrieval trace contracts, graph wiring reinit, and evidence-gap logic. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts:37-57`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts:27-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts:9-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/evidence-gap-detector.vitest.ts:1-13`]
- Regression tests for canonicalization and index safeguards exist from prior specs and remain relevant to 006 hardening direction. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md:47-49`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md:61-63`]

### Gaps

- `handler-memory-search` suite is explicitly deferred for DB fixtures and mostly checks exports/input validation, leaving core ranking behavior under-tested at handler level. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:10-27`]
- Embedding-provider-dependent vector search tests are skipped, reducing confidence around production-like ranking paths. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts:1119-1124`]
- Documentation claims around test/file/system shape are internally inconsistent, increasing false confidence risk if read as operational truth. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:93-99`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:234-243`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`]

---

## 8. Automation Opportunities (High ROI)

1. Contract-sync CI for docs vs code
- Auto-generate tool counts and channel descriptors from `tool-schemas.ts` + retrieval modules into README fragments.
- Fail CI when manual README claims diverge from code-derived metrics.
- Evidence basis: current claim drift in channel/tool/test descriptors. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:340-343`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`]

2. Retrieval contract tests as release gates
- Add strict schema assertions for graph results entering formatter (`id`, `file_path`, `spec_folder`, `source`, `score`, `provenance`).
- Add explicit deep-mode propagation tests from L1 to L2.
- Evidence basis: FM-01 and FM-02 seams. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`]

3. Self-healing index/retrieval health loop
- Schedule `memory_index_scan` + alias conflict check + targeted `memory_health(reportMode='divergent_aliases')` and publish actionable summaries.
- Evidence basis: index scan already reports alias conflicts and causal-chain creation hooks. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:733-748`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:659-721`]

4. Telemetry schema validation pipeline
- Version and validate `_telemetry` envelope against a JSON schema generated from `retrieval-telemetry.ts`.
- Catch naming drift between implementation and docs automatically.
- Evidence basis: README/model mismatch. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md:94-113`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:121-134`]

5. Mutation/recovery reliability sweeps
- Scheduled recovery audit on pending files + mutation ledger append-only verification.
- Evidence basis: transaction manager recovery and ledger immutability are already implemented and measurable. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts:209-264`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts:191-202`]

---

## 9. Implementation Options (At Least 3)

### Estimation Method (for durations, confidence, and KPI framing)

- Duration ranges are planning estimates derived from 006 phase/task decomposition plus analogous effort recorded in 002-005 implementation summaries.
- Confidence labels use evidence density: `High` (multiple A-grade code sources + test coverage), `Medium-High` (A-grade code sources with one or more unresolved runtime assumptions), `Medium` (requires broader refactor assumptions).
- KPI targets are governance targets for 006 release gates, not claims of current measured production values.

Method evidence:
[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/plan.md:173-180`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:49-127`] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md] [SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/implementation-summary.md]

### Option A: Contract-Hardening Patchset (Incremental, 2-3 weeks)

Scope:
- Fix FM-01 and FM-02 directly.
- Preserve current architecture; add targeted tests and CI gates.
- Normalize telemetry/readme drift enough for trustworthy operations.

Pros:
- Fastest path to reduce correctness risk.
- Low migration risk and minimal blast radius.
- Aligns with 006 "audit-first hardening" intent.

Cons:
- Keeps structural complexity and some legacy coupling.
- Does not fully solve provenance model limitations.

Confidence: High.

Supporting evidence: [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:63-67`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`]

---

### Option B: Contract-First Retrieval Platform (Moderate refactor, 4-6 weeks)

Scope:
- Introduce canonical typed retrieval contracts (request/response/provenance) and schema validators.
- Unify formatter expectations with all channel outputs.
- Generate operational docs directly from contracts and tool schema.

Pros:
- Strong long-term bug prevention through invariant enforcement.
- Makes observability and debugging materially better.
- Creates durable foundation for future adaptive/autonomous behavior.

Cons:
- Medium complexity and wider change surface.
- Needs careful rollout to avoid temporary friction.

Confidence: Medium-High.

Supporting evidence: [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:41-45`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:60-66`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:289-320`]

---

### Option C: Graph-First Unified Fusion Engine (Large refactor, 8-12 weeks)

Scope:
- Promote graph channel to first-class memory-node retrieval with explicit provenance arrays and edge/memory dual indexing.
- Replace opportunistic dedup with provenance-preserving fusion model.
- Rebalance ranking around graph confidence + retrieval confidence calibration.

Pros:
- Highest ceiling for "smart, interconnected, useful" retrieval.
- Better support for causal reasoning and decision lineage queries.

Cons:
- Highest execution risk and longest stabilization period.
- Requires substantial test fixture redesign and performance tuning.

Confidence: Medium.

Supporting evidence: [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:49-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:248-252`]

---

### Option D: Autonomous Quality Loop Overlay (Complementary, 3-4 weeks)

Scope:
- Add daily/CI autonomous checks for invariant drift, telemetry anomalies, and index-health deltas.
- Auto-open actionable defect reports with trace links and failing examples.

Pros:
- Strong automation gain with modest architecture impact.
- Speeds detection and triage cycle.

Cons:
- Can create alert noise without tuned thresholds.
- Depends on telemetry consistency first.

Confidence: Medium-High.

Supporting evidence: [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:965-989`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:733-748`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:209-220`]

---

## 10. Recommended Strategy

Recommended sequence: **A -> B**, with selective elements of D during B.

Rationale:

1. 006 asks for hardening and bug-prevention controls now; Option A directly addresses highest-severity seams quickly.
2. Option B converts those fixes into stable systemic safeguards (contracts, generated docs, schema-checked telemetry).
3. Option D can be layered once telemetry contracts are stabilized to avoid noisy automation loops.

This sequence delivers immediate risk reduction without sacrificing long-term leverage.

[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:99-101`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:13-18`]

---

## 11. Prioritized Roadmap

### P0 (Immediate, Week 1-2)

1. Close FM-01 graph/formatter contract mismatch with explicit schema + compatibility adapter.
2. Pass `mode: 'deep'` through L1 deep strategy and add integration test that confirms expansion path executes.
3. Add release-gate tests for channel-output shape and deep-mode behavior.
4. Add one source-of-truth script to compute README tool/channel counts from code.

Success criteria:
- No failing contract assertions in CI.
- Deep mode from `memory_context` demonstrably triggers query variants.
- README metrics generated and drift-protected.

### P1 (Short term, Week 3-6)

1. Provenance-preserving fusion result model (`sources[]`) replacing single-source overwrite.
2. Telemetry schema versioning and validator in CI.
3. Strengthen handler-level integration tests (DB fixture-backed, not export-only).
4. Turn deferred prior-spec controls into explicit gates (latency measurement, monitoring, runbook checks).

### P2 (Mid term, Week 7-12)

1. Graph-first ranking enhancements and causal confidence model.
2. Autonomous anomaly detection and issue generation from telemetry + index health.
3. Continuous regression corpus from 003/004/005 failure classes and new 006 seam classes.

Roadmap basis:
[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:51-55`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:91-95`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md:111-114`]

---

## 12. Concrete Bug-Eradication Strategy

### Principle

Move from "fix discovered bugs" to "enforce invariant families" at build, test, and runtime boundaries.

### Bug Classes and Countermeasures

1. Contract-shape bugs (payload incompatibility)
- Countermeasure: typed schema validators on every retrieval channel boundary.
- Gate: fail CI on any shape mismatch.

2. Mode propagation bugs (feature exists but not activated end-to-end)
- Countermeasure: end-to-end mode propagation tests (L1 -> L2 -> pipeline stage evidence).
- Gate: trace must show expected stage markers for deep mode variants.

3. Provenance loss bugs (information dropped during dedup/fusion)
- Countermeasure: preserve multi-source attribution arrays and assert non-empty provenance for fused results.
- Gate: dedup stage tests must retain source cardinality.

4. Atomicity/recovery bugs
- Countermeasure: explicit partial-success state handling, pending-file recovery sweep tests, and ledger correlation checks.
- Gate: no orphaned pending files after test suite; recovery metrics stable.

5. Drift bugs (docs/tests/config diverge from runtime reality)
- Countermeasure: generated docs, schema snapshots, and deterministic drift checks in CI.
- Gate: docs must be generated from current code signatures.

Current evidence for these bug classes:
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:66-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1593-1599`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`]

---

## 13. Concrete Observability Strategy

### Goal

Provide query-level explainability and system-level reliability signals that are machine-checkable and actionable.

### Observability Model

1. Trace-first instrumentation
- Make retrieval trace mandatory for all non-trivial retrieval runs.
- Include stage durations and input/output cardinality across candidate/filter/fusion/rerank/fallback/final-rank.
- Existing base: trace contracts and trace insertion points already in place.
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts:13-41`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:894-905`]

2. Telemetry schema governance
- Version `_telemetry` payload and validate serialized structure.
- Align README and runtime fields through generated docs.
- Existing base: telemetry create/record/toJSON pipeline.
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:74-103`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:209-220`]

3. Golden metrics (SLO-oriented)
- `fallback_rate` (target: low and stable)
- `evidence_gap_rate` (track confidence quality)
- `deep_mode_variant_activation_rate` (should be near 100% for deep queries)
- `index_alias_conflict_groups` (should trend to zero)
- `partial_save_rate` (memory_save partial-success state)

4. Alerts and triage
- Alert on sudden jumps in fallback/evidence-gap/partial-save rates.
- Auto-attach latest traces and index scan alias conflict details for triage.

5. Operational dashboards
- Dashboard panes by stage latency and quality-proxy distribution.
- Split by mode (`auto`, `deep`, `focused`, `resume`) and intent class.

---

## 14. Governance and Release-Gate Strategy

### Required Release Gates

1. Contract gate
- Graph, hybrid, and formatter payload schema compatibility must pass.

2. Regression gate
- Include explicit scenarios for alias path duplication, tier precedence drift, and wrong-folder selection.

3. Performance gate
- Empirical latency checks for `mode="auto"` and `mode="deep"` under representative DB load.

4. Documentation gate
- Regenerated architecture/tool/telemetry docs must match code snapshots.

5. Observability gate
- Trace and telemetry payloads must be present and schema-valid for required retrieval classes.

Alignment basis:
[SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:113-117`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md:123-126`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/checklist.md:124-149`]

---

## 15. KPI Targets for 006 Upgrade Program

| KPI | Baseline Observation | Target |
|-----|----------------------|--------|
| Contract violation count in retrieval path | Non-zero risk (FM-01/FM-02 known) | 0 P0 contract violations |
| Deep mode activation fidelity | Potentially degraded through L1 path | 100% deep path activation from L1 deep requests |
| Provenance retention in fused results | Known limitation in dedup | `sources[]` retained for all fused items |
| Partial save incidence | Supported partial-success path exists | measurable, alertable, and downward trend |
| Drift incidents (docs vs runtime) | Multiple drifts observed | 0 unmanaged drift incidents (CI enforced) |

Evidence basis:
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:384-387`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:276-288`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1249-1252`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1630-1636`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:63-64`]

---

## 16. Open Questions and Unknowns

1. Should graph channel results represent edges, memory nodes, or dual objects with explicit translation layer before formatter?
2. Should deep-mode query expansion be user-visible in telemetry/debug payload by default?
3. How frequently should the benchmark corpus be refreshed while preserving comparability against the release-gate targets (`auto <= 120ms`, `deep <= 180ms`, overhead `<= 12%`)?
4. Should evidence-gap detector integrate `predictGraphCoverage()` as an early-stage gate in runtime, or remain test-only utility for now?

Related evidence:
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:49-74`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:81-124`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:24-27`]

---

## 17. Source Index

### 006 Program Documents

- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/spec.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/plan.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/tasks.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-hybrid-rag-fusion-logic-improvements/checklist.md

### Prior Specs (Continuity)

- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-hybrid-rag-fusion/implementation-summary.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/implementation-summary.md

### MCP Runtime and Libraries

- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/rollout-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/transaction-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/mutation-ledger.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/retrieval-trace.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
- `.opencode/skill/system-spec-kit/mcp_server/README.md`

### Test Evidence

- `.opencode/skill/system-spec-kit/mcp_server/tests/db-state-graph-reinit.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-impl.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-trace.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/retrieval-telemetry.vitest.ts`

## Deep Research: Test Coverage Analysis (Iteration 15)

### Test Infrastructure Overview
- **284 vitest test files** in `mcp_server/tests/`
- Consistent patterns: in-memory `better-sqlite3`, `vi.mock` isolation, typed helpers, T-prefix test IDs
- `tests/README.md` with complete file listing and categorization

### Pipeline Stage Coverage

| Stage | Test File(s) | Test Count | Coverage Quality |
|-------|-------------|-----------|-----------------|
| Stage 1 (Expansion) | `stage1-expansion.vitest.ts` | 8 | Strong: flag toggling, dedup ordering, simple-query suppression, governance scope |
| Stage 2 (Fusion) | `stage2-fusion.vitest.ts` | 4 | Moderate: learned-trigger scaling, graph signals, trace diagnostics, bounded bonus |
| Stage 3 (Rerank) | `stage3-rerank-regression.vitest.ts` | 2 | Minimal: only tests negative score flooring |
| Stage 4 (Filter) | None dedicated | 0 | GAP: no dedicated test file; tangential coverage in pipeline-v2.vitest.ts |
| Orchestrator | None dedicated | 0 | GAP: zero error handling in production code = zero tests |
| End-to-end | `pipeline-integration.vitest.ts`, `pipeline-v2.vitest.ts` | ~20+ | Strong mock-based integration |

### 7 Critical Untested Paths

1. **FSRS write-back lost-update race** -- `decay-delete-race.vitest.ts` tests a DIFFERENT race (working_memory attention score T214, not FSRS stability update). `fsrs-scheduler.vitest.ts` (24K LOC) tests formula correctness but zero concurrent-write tests.
2. **Score resolution divergence** -- Only 1 test in `mcp-response-envelope.vitest.ts` (T536-4) tests output envelope fallback, NOT the 3 internal resolution chains producing identical results.
3. **Pipeline orchestrator error cascading** -- 0 tests. No test verifies behavior when a stage throws.
4. **Cross-encoder circuit breaker** -- 0 tests. Production code has latency tracker + circuit breaker, but only `trigger-extractor.vitest.ts` tests a circuit breaker (different component).
5. **BM25 spec-folder filter N+1** -- 0 performance tests for the individual-SELECT-per-result pattern.
6. **RSF shadow-to-production activation** -- 0 tests for the switch path. RSF algorithm itself has 36+ tests.
7. **Concurrent save dedup race / embedding cache model-swap** -- 0 tests for both iter-9 findings.

### Well-Covered Areas
- Scoring signals: composite, five-factor, normalization, observability, confidence, intent weights
- Fusion algorithms: RRF (unit + integration), RSF (36+ tests), adaptive fusion
- Graph subsystem: search, signals, degree, community detection, flags, scoring integration
- Cognitive modules: FSRS formula, PE gate, co-activation, working memory, decay, attention
- Save pipeline: quality-loop, dedup (content-hash), PE gating, save-integration
- Eval framework: ablation, metrics, dashboard, ground-truth
- Edge cases: empty results, null inputs, boundary values broadly tested across modules

---

## Deep Research Campaign: Prioritized Recommendation Synthesis (Iteration 19)

*Compiled from 18 research iterations covering pipeline architecture, scoring calibration, error handling, feature flags, eval infrastructure, save pipeline, cognitive subsystem, DX, performance, spec alignment, and test coverage.*

### Top Recommendations by Priority

**P0 -- Critical (fix first):**
1. **Orchestrator error handling** (B1) -- 79-line orchestrator has zero try/catch. Any stage throw crashes entire pipeline. Effort: M, Impact: 5/5. [CONFIRMED iter-18]
2. **Weight coherence unification** (B2) -- 3 conflicting channel weight systems; adaptive fusion only applies to 2 of 5 channels. Effort: L, Impact: 5/5.
3. **Unify 3 score resolution chains** (A1) -- Different fallback orders in types.ts, ranking-contract.ts, stage4-filter.ts; 100x scale mismatch in Stage 4. Effort: S, Impact: 4/5. [CONFIRMED iter-18]
4. **Orchestrator error cascade tests** (G1) -- Zero tests for stage failure behavior. Effort: S, Impact: 4/5.

**P1 -- Important (sprint-level):**
5. Eval-to-scoring feedback loop (B3) -- Measurement without calibration for 30+ hardcoded constants. Effort: L, Impact: 5/5.
6. Feature flag governance (B5) -- 81 flags, no manifest, no sunset dates. Effort: L, Impact: 4/5. [MODIFIED: 81 not 76]
7. Simplified memory_search tool (E3) -- 31 parameters including duplicate. Effort: M, Impact: 4/5. [MODIFIED: 31 not 28]
8. Signal failure tri-state metadata (B6) -- Cannot distinguish "feature off" from "feature crashed". Effort: S, Impact: 3/5.
9. BM25 N+1 query fix (B7) -- 50 results = 50 individual DB queries. Effort: S, Impact: 3/5.
10. Spec: 5 channels not 4 (D1) -- types.ts:185 lists 5 channels. Effort: S, Impact: 3/5. [CONFIRMED iter-18]

**Cross-validation corrections (iter-18):**
- Embedding cache ignores model ID: **REFUTED** -- cache has compound PK (content_hash, model_id)
- Flag count: 81 (not 76) -- flag sprawl worse than originally reported
- memory_search params: 31 (not 28) -- UX burden worse than originally reported
- FSRS race: write-back is NOT in fsrs.ts (read-only computation); actual location in trackAccess flow

### Implementation Roadmap
- **Sprint 1** (1-2 days): Score resolution unification, signal tri-state metadata, BM25 batch query, 3 test suites
- **Sprint 2** (3-5 days): Orchestrator error handling, spec updates, flag manifest, simplified search tool
- **Sprint 3** (3-5 days): Deep-mode expansion caching, concurrent save dedup fix, Stage 2 decomposition
- **Epic** (2-4 weeks): Weight coherence unification, feature flag governance overhaul, eval-to-scoring feedback loop

Full details: `scratch/iteration-019.md` (25 recommendations across 7 categories with effort/impact/priority scoring)

---

## Deep Research Analysis (2026-03-20)

### 1. Executive Summary

A 20-iteration autonomous deep research campaign was conducted on the hybrid-rag-fusion system (Spec Kit Memory MCP server) on 2026-03-20, spanning approximately 9.5 hours. The campaign investigated 18 research questions across the search pipeline, scoring system, cognitive subsystem, eval infrastructure, save pipeline, feature flag landscape, developer UX, performance characteristics, and spec-to-code alignment.

**System scope:** 511 TypeScript files, approximately 190,637 LOC (excluding dist/ and node_modules/), with 284 test files, 28 lib/ subdirectories, and 32 MCP tools.

**Key results:**
- 18 of 18 research questions answered (100% closure)
- 25 prioritized recommendations produced across 7 categories (A-G)
- 10 top findings cross-validated with independent code traces: 6 confirmed, 3 modified, 1 refuted (90% directional accuracy)
- 29 code-vs-spec and code-vs-standard misalignments cataloged with severity ratings
- 15 research debt items identified for future campaigns
- Approximately 42% of lib/ LOC investigated (22K of 52K); 58% remains uninvestigated

The system is architecturally sound with a well-designed 4-stage pipeline (actually 5 channels), robust save pipeline, and production-integrated cognitive subsystem. The primary concerns are: (1) zero error handling at the orchestrator level, (2) three conflicting channel weight systems, (3) 81 ungoverned feature flags, and (4) a measurement infrastructure that cannot feed results back into scoring calibration.

---

### 2. Methodology

#### Campaign Structure

The research was organized into 5 phases across 20 iterations:

| Phase | Iterations | Focus | Approach |
|-------|-----------|-------|----------|
| Phase 1: Broad Survey | 1-4 | Pipeline architecture, scoring, graph, alignment | Direct code reading, type contract analysis |
| Phase 2: Deep Investigation | 5-9 | Fusion, error handling, flags, eval, save | Targeted module deep-dives |
| Phase 3: Automation and UX | 10-13 | Cognitive, DX, query intelligence, performance | Integration mapping, census methods |
| Phase 4: Cross-Cutting | 14-17 | Spec reality-check, tests, synthesis | Cross-referencing, claim verification |
| Phase 5: Synthesis | 18-20 | Cross-validation, recommendations, gaps | Independent code traces, consolidation |

#### Agent Configuration

Each iteration was executed by a single autonomous research agent with:
- 3-5 research actions per iteration (WebFetch, Grep, Glob, Read, Bash)
- 8-12 total tool calls including state management
- Externalized state via JSONL + strategy.md for continuity across iterations
- Progressive synthesis into research.md after each iteration

#### Anti-Convergence Measures

- Phased question injection at iterations 5 and 10 (adding new questions to prevent premature convergence)
- Domain rotation across iterations to avoid tunnel vision
- Iterations 18-20 exempt from convergence threshold (synthesis phase)
- Cross-validation in iteration 18 to verify reliability of findings

#### Convergence Profile

| Metric | Value |
|--------|-------|
| Average newInfoRatio (iterations 1-15) | 0.72 |
| Average newInfoRatio (synthesis iterations 16-20) | 0.17 |
| Stop reason | max_iterations_reached |
| Total findings across 20 iterations | 220+ individual findings |
| Questions answered | 18/18 (100%) |

---

### 3. Pipeline Architecture Findings

*Primary sources: iterations 1, 5, 16. Cross-validated: iteration 18.*

#### 4-Stage Pipeline (Actually 5 Channels)

The search pipeline consists of 4 processing stages with 5 input channels:

```
Stage 1: Candidate Generation
  - 5 channels: Vector (semantic), FTS5, BM25, Graph (typed-degree), Co-activation
  - Query expansion: rule-based synonyms (deep mode) OR R12 embedding expansion (standard)
  - Constitutional injection: always-include tier bypasses normal ranking
  [SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts]

Stage 2: Fusion and Scoring (854 LOC, 12 sequential steps)
  - Steps 1-7: Scoring signals (RRF, FSRS, importance, recency, intent weights, session boost, graph signals)
  - Steps 8-9: Annotation (anchor metadata, validation metadata)
  - Steps 10-11: Intent weight application, composite scoring
  - Step 12: Validation
  [SOURCE: mcp_server/lib/search/pipeline/stage2-fusion.ts:21, :538]

Stage 3: Reranking
  - Cross-encoder reranking (3-provider support: local ONNX, Voyage AI, Cohere)
  - MMR diversity pruning (lambda varies by intent)
  - Circuit breaker on cross-encoder latency
  [SOURCE: mcp_server/lib/search/pipeline/stage3-rerank.ts]

Stage 4: Filtering and Output
  - Token budget enforcement
  - Evidence gap analysis
  - Result formatting and metadata assembly
  [SOURCE: mcp_server/lib/search/pipeline/stage4-filter.ts]
```

The orchestrator (`orchestrator.ts`, 79 lines) is a pure pass-through that calls all 4 stages sequentially with zero error handling, zero timeout protection, and zero timing instrumentation.
[SOURCE: mcp_server/lib/search/pipeline/orchestrator.ts]

#### Key Architectural Finding: 5 Channels, Not 4

The spec documents "4 search channels" but `types.ts:185` explicitly lists 5: FTS5, semantic, trigger, graph, and co-activation. Co-activation is treated as a full channel with its own candidates and RRF contribution. This was CONFIRMED in cross-validation (iteration 18).
[SOURCE: mcp_server/lib/search/pipeline/types.ts:185]

#### Pipeline Contract Issues

- **Unsafe type cast:** Stage 3 mutable output is cast (`as`) to Stage 4 readonly input without actual immutability enforcement
  [SOURCE: iteration-001 F8]
- **Constitutional bypass:** Constitutional rows injected via vector search bypass `applyArchiveFilter` which only runs for R8 summary hits
  [SOURCE: iteration-001 F10]
- **Score alias synchronization:** `withSyncedScoreAliases()` normalizes score fields, but on error/early-return paths aliases can be unsynced, causing three different score resolution functions to disagree on rank order
  [SOURCE: iteration-001 F3/F9, iteration-002 F1]

---

### 4. Scoring System Findings

*Primary sources: iterations 2, 5, 12. Cross-validated: iteration 18.*

#### 30+ Hardcoded Constants with No Calibration

All scoring constants are hardcoded. Only two have literature citations:
- **RRF K=60** -- from Cormack et al., SIGIR 2009
- **FSRS constants** -- from FSRS v4 spaced repetition literature

No data-driven calibration mechanism exists. No A/B testing framework. No runtime tuning except RRF K and two feature flags. Cross-validation (iteration 18) spot-checked 5 constants and confirmed 4 of 5 are hardcoded with no calibration pathway.
[SOURCE: mcp_server/lib/scoring/composite-scoring.ts:123-185]
[SOURCE: mcp_server/lib/search/pipeline/stage3-rerank.ts:55,201]

#### Three Divergent Score Resolution Chains (CONFIRMED)

Three separate functions resolve the "final score" of a memory with different field precedence:

| Function | File | Fallback Order |
|----------|------|---------------|
| `resolveEffectiveScore()` | types.ts:49-66 | intentAdjustedScore -> rrfScore -> score -> similarity/100 |
| `compareDeterministicRows()` | ranking-contract.ts:36-44 | score -> similarity/100 (2 fields only) |
| `extractScoringValue()` | stage4-filter.ts:205-214 | rrfScore -> intentAdjustedScore -> score -> similarity (RAW, not /100) |

The canonical function in `types.ts` (documented at lines 49-55) was added to address this, but the other two call sites still use their own ad-hoc chains. `extractScoringValue` has a 100x scale mismatch (raw similarity instead of similarity/100) affecting Stage 4 evidence-gap analysis.
[SOURCE: mcp_server/lib/search/pipeline/types.ts:49-66, ranking-contract.ts:36-44, stage4-filter.ts:205-214]

#### Three Conflicting Weight Systems

| System | Location | Scope | Status |
|--------|----------|-------|--------|
| Hardcoded channel weights | hybrid-search.ts | vector=1.0, fts=0.8, bm25=0.6, graph=0.5 | LIVE -- always applied |
| Adaptive fusion weights | adaptive-fusion.ts | 7 intent-specific profiles for 2 of 5 channels | LIVE -- partial coverage |
| GRAPH_WEIGHT_BOOST=1.5 | rrf-fusion.ts | Graph channel boost | DEAD -- overridden by explicit weight=0.5 |

Additionally, `FusionWeights.graphWeight` is declared in the interface, set in all 7 intent profiles, but never consumed by `adaptiveFuse()`. This creates a false sense of intent-aware graph weighting.
[SOURCE: iteration-005 F2/F5/F6/F10]

#### Fusion Algorithms

- **RRF (Reciprocal Rank Fusion):** The only live fusion algorithm. K=60 (literature-backed).
- **RSF (Reciprocal Score Fusion):** Shadow-only, dormant. Records shadow scores for offline comparison but has no production activation path.
- **Adaptive Fusion:** Lives in `adaptive-fusion.ts` but only applies to 2 of 5 channels (semantic and keyword weights).

Two parallel scoring models coexist:
- **Legacy 6-factor:** similarity, importance, recency, popularity, tierBoost, retrievability -- the ONLY live model
- **5-factor:** temporal, usage, importance, pattern, citation -- complete, tested, but `use_five_factor_model: true` is never passed in production (CONFIRMED, iteration 18)

---

### 5. Graph Channel Findings

*Primary source: iteration 3.*

The graph channel is NOT dead code. It is a complete, default-ON system (controlled by `SPECKIT_GRAPH_UNIFIED`, default-on semantics) with:

- **FTS5-backed causal edge search** with LIKE fallback for non-FTS queries
- **Typed-degree as 5th RRF channel** -- graph results participate in fusion alongside vector, FTS5, BM25, and co-activation
- **Three graph signals:** momentum (change rate), causal depth via Tarjan SCC (strongly connected components), and graph-walk 2-hop traversal
- **Community detection:** BFS for small graphs, escalation to Louvain modularity detection for larger ones
- **Session caching** for graph traversal results
- **Constitutional memory exclusion** from graph scoring
- **Defensive error handling:** try/catch with warn + empty return on all paths

The graph subsystem is 1,216 LOC across 2 core files (`graph-search-fn.ts` and `graph-signals.ts`) and is far more mature than the spec documentation implies.
[SOURCE: mcp_server/lib/graph/graph-search-fn.ts, mcp_server/lib/search/graph-signals.ts]

---

### 6. Error Handling Findings

*Primary source: iteration 6.*

#### Dominant Pattern: Warn-and-Continue

28 catch blocks across the pipeline follow the same pattern: `console.warn` + silent continue. Distribution:
- Stage 2: 16 catch blocks
- Stage 1: 8 catch blocks
- Stage 3: 4 catch blocks
- Orchestrator: 0 catch blocks (zero error handling)

[SOURCE: grep `catch\s*\(` across mcp_server/lib/search/pipeline/]

#### Critical Gaps

1. **No failure discrimination:** All 9 signal steps use `*Applied: false` / `true`. Catch blocks leave the flag as `false`. Callers cannot distinguish "feature off by config" from "feature crashed with DB error."
   [SOURCE: iteration-006 F2/F10]

2. **Zero orchestrator error handling (CONFIRMED):** The 79-line orchestrator calls all 4 stages with bare `await`. Any unhandled exception crashes the entire pipeline with an unstructured error. The structured error infrastructure (`MemoryError`, `buildErrorResponse`, `withTimeout`) exists in `errors/core.ts` (1,221 LOC) but is never used by the pipeline.
   [SOURCE: mcp_server/lib/search/pipeline/orchestrator.ts -- 79 lines, zero try/catch/throw/error]

3. **Redundant DB access:** Up to 4 Stage 2 steps independently call `requireDb()`. If the DB is unavailable, each discovers this separately and logs a separate warning.
   [SOURCE: iteration-006 F9]

4. **FSRS race condition:** `strengthenOnAccess` performs read-then-write (SELECT stability, compute, UPDATE stability) without transaction isolation. Note: the write-back path is NOT in `fsrs.ts` (which is read-only computation); the actual location is in the `trackAccess` parameter flow (cross-validation correction from iteration 18).
   [SOURCE: iteration-006 F5, iteration-018 Finding 5]

5. **Silent quality degradation:** The dominant failure mode. All 9 signal steps can fail without caller awareness. The pipeline always returns results, but result quality may be severely degraded without any indication.
   [SOURCE: iteration-006 F2]

---

### 7. Feature Flag Findings

*Primary source: iteration 7. Cross-validated: iteration 18.*

#### 81 Feature Flags with No Governance

81 unique `SPECKIT_*` environment variable names exist across lib/ (corrected upward from 76 in cross-validation). There is:
- No central registry or manifest
- No sunset dates or expiry mechanisms
- No version gates
- No categorization documentation
- Only one `@deprecated` annotation (`PIPELINE_V2`, always returns true)

[SOURCE: grep -roh 'SPECKIT_[A-Z_0-9]*' mcp_server/lib/ | sort -u -- 83 lines, minus 2 partial patterns = 81]

#### Three Distinct Flag Semantics

| Semantic | Implementation | Examples |
|----------|---------------|----------|
| Default-ON (graduated) | `isFeatureEnabled()` returns true unless explicitly `=false` | SPECKIT_MMR, SPECKIT_GRAPH_SIGNALS |
| Default-OFF (opt-in) | Explicit `=== 'true'` check | SPECKIT_RECONSOLIDATION, SPECKIT_FILE_WATCHER |
| Multi-state | String comparison with 3+ values | SPECKIT_GRAPH_WALK_ROLLOUT: 'off', 'trace_only', 'bounded_runtime' |

No documentation maps which flags use which semantics.
[SOURCE: mcp_server/lib/search/search-flags.ts:93-95, :156-169, :230-233]

#### Legacy Aliases

12 flags are legacy `HYDRA_*` aliases (the system was renamed from "Hydra" to "Speckit Memory Roadmap"). Both prefixes are honored at runtime, creating confusion about which is authoritative.
[SOURCE: mcp_server/lib/cache/cognitive/capability-flags.ts:38-54]

---

### 8. Eval Infrastructure Findings

*Primary source: iteration 8.*

The eval system is structurally complete and correctly connected to the pipeline:

- **Ablation framework:** 773 LOC implementing one-at-a-time channel ablation with 9-metric breakdown, sign-test statistical significance, and channel contribution ranking. Bidirectional connection: ablation calls `search`, search respects disabled channel flags.
  [SOURCE: mcp_server/lib/eval/ablation-framework.ts]

- **Ground truth corpus:** 2,591-line JSON with 7 intent types, 7 query categories, 4-point relevance scale.

- **12 metrics:** 7 core + 5 diagnostic, implemented as pure functions.

- **Separate eval DB:** 5 tables, WAL mode, isolates eval from production.

- **MCP accessibility:** `eval_run_ablation` and `eval_reporting_dashboard` tools, gated behind `SPECKIT_ABLATION=true`.

**Critical gap:** No feedback loop. Eval measures quality but cannot calibrate scoring weights. Ablation results go into `eval_metric_snapshots` but no pipeline code reads from that table. `token_usage` metric is a stub (always 0). Ground truth `memoryIds` are hardcoded and may become stale if the database is rebuilt.
[SOURCE: iteration-008 F7]

---

### 9. Save Pipeline Findings

*Primary source: iteration 9.*

The save pipeline is architecturally robust with a 7-module decomposition:

#### Three-Layer Dedup

| Layer | Mechanism | File |
|-------|-----------|------|
| 1. Same-path hash | SHA-256 content hash comparison for same file path | dedup.ts |
| 2. Cross-path hash | SHA-256 content hash comparison across all paths | dedup.ts |
| 3. Semantic PE gate | Prediction Error gating via embedding similarity | pe-gating.ts |

Note: the spec claims "cosine dedup" but code uses SHA-256 hash (layers 1-2). Only the PE gate (layer 3) uses semantic comparison.
[SOURCE: mcp_server/handlers/save/dedup.ts:9-11, :105-252]

#### Quality Loop

4-dimension quality scoring (triggers, anchors, budget, coherence) with threshold 0.6 and 2 auto-fix retries. 5-action PE arbitration: CREATE, REINFORCE, SUPERSEDE, UPDATE, CREATE_LINKED. Append-only versioning for updates.
[SOURCE: mcp_server/handlers/save/quality-loop.ts -- 700 LOC]

#### Save Pipeline Gaps

1. **Embedding cache key ignores model ID:** REFUTED in cross-validation (iteration 18). Cache has compound PK `(content_hash, model_id)`. This finding was incorrect.
   [SOURCE: mcp_server/lib/cache/embedding-cache.ts:38-48]

2. **No transaction isolation for concurrent dedup:** Dedup check-then-insert has no serializable transaction. Two concurrent saves of similar content can both pass the dedup check and create duplicates.
   [SOURCE: iteration-009]

3. **Quality loop content mutations:** The auto-fix feature mutates content (`fixedContent`). Callers MUST consume the fixed content or `content_hash` will mismatch. This is an implicit contract that is neither enforced nor documented.
   [SOURCE: iteration-009]

---

### 10. Cognitive Subsystem Findings

*Primary source: iteration 10.*

#### NOT Over-Engineered

4,644 LOC across 11 modules; 10 of 11 are production-integrated (4,463 LOC). The subsystem has a clear 4-layer architecture:

| Layer | Modules | LOC | Role |
|-------|---------|-----|------|
| Foundation | rollout-policy (64 LOC, 6 consumers), fsrs-scheduler (395 LOC) | 459 | Feature gating, spaced repetition |
| Session | working-memory (765 LOC, Miller's Law capacity, LRU eviction, event decay) | 765 | Session state management |
| Quality | prediction-error-gate, tier-classifier, pressure-monitor | ~1,200 | Quality control gates |
| Enhancement | co-activation, adaptive-ranking (shadow-mode), archival-manager, attention-decay (facade) | ~2,000 | Retrieval quality features |

**Only unused module:** `temporal-contiguity.ts` (181 LOC) -- zero production callers. The only module in the 11-file cognitive subsystem with no integration.

**Key insight:** Co-activation is a core retrieval quality feature, not optional. It is deeply integrated into `hybrid-search.ts` and `stage2-fusion.ts`. The shadow-mode adaptive ranking creates an observe-propose-evaluate loop without automated feedback.
[SOURCE: grep across mcp_server/lib/ for cognitive/ imports -- 10/11 modules have production callers]

---

### 11. Developer UX Findings

*Primary source: iteration 11.*

#### 32 MCP Tools with UX Issues

- **Flat listing:** All 32 tools appear flat with no grouping. Developers must scan the full list to find the right tool.
- **Consistent naming:** `{domain}_{action}` pattern is generally followed.
- **Two naming issues:**
  1. `memory_drift_why` should be `memory_causal_trace` (misfiled outside the causal tool group: `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`)
  2. `TriggerArgs` uses `snake_case` (`session_id`, `include_cognitive`) while all other interfaces use `camelCase`

#### memory_search: 31 Parameters (MODIFIED)

The `SearchArgs` interface has 31 fields (corrected upward from 28 in cross-validation). Includes a duplicate: `minQualityScore` (camelCase) and `min_quality_score` (snake_case) for the same parameter. No "simple search" variant exists for common use cases.
[SOURCE: mcp_server/tools/types.ts -- SearchArgs interface]

---

### 12. Automation Gaps

*Primary sources: iterations 11, 14.*

| Gap | Current State | Impact |
|-----|--------------|--------|
| File-watcher is opt-in | Mature implementation (417 LOC, chokidar, debounce, SHA256 dedup, bounded concurrency, SQLITE_BUSY retry) but gated behind `SPECKIT_FILE_WATCHER` feature flag | Most common DX friction: "forgot to reindex" |
| No scheduled stale cleanup | File-watcher handles individual unlink events; incremental index detects deleted files during scan; no automated bulk cleanup | DB accumulates orphaned entries over time |
| No self-tuning | Eval measures quality but cannot auto-calibrate weights | Manual weight tuning is the only path |
| No progress feedback | Post-save async operations (enrichment, embedding generation) run with no progress indication | Callers have no visibility into save completion |

[SOURCE: iteration-011, iteration-014]

---

### 13. Query Intelligence Findings

*Primary source: iteration 12.*

#### Two Expansion Systems in Mutual Exclusion

| System | Mode | Mechanism | Latency Cost | Eval Coverage |
|--------|------|-----------|-------------|---------------|
| Rule-based synonym expansion | Deep mode only | 27-entry vocab map, max 3 variants, each triggers FULL hybrid search | 3x multiplier (sequential, no caching) | None |
| R12 embedding expansion | Standard (non-simple queries) | Mines terms from top-5 similar memories, runs parallel 2nd hybrid search | 2x multiplier | None |

R12/R15 mutual exclusion correctly suppresses expansion on simple queries (3 or fewer terms).
[SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts]

#### Critical Gaps

- **Neither system has metrics or eval hooks** to measure whether expansion improves recall. The eval/ablation framework tests channels but not expansion variants.
- **Deep mode expansion has unbounded latency cost** (no timeout, no budget).
- **R12 expansion mines from the same semantic neighborhood** already found by vector search -- narrow improvement window.
- **Query classifier confidence field** is computed but never consumed by any caller (dead data).
  [SOURCE: iteration-012]

---

### 14. Performance Findings

*Primary source: iteration 13.*

#### Five Performance Concerns

| Concern | Pattern | Severity | Evidence Type |
|---------|---------|----------|--------------|
| BM25 spec-folder filter N+1 | Each result triggers individual `SELECT spec_folder FROM memory_index WHERE id = ?` inside `.filter()` loop | MEDIUM | Code path analysis (no profiling) |
| Deep-mode 3x expansion | Sequential full hybrid searches per synonym variant, no embedding cache | MEDIUM | Code path analysis |
| R12 doubles pipeline cost | Parallel 2nd hybrid search for non-simple queries | LOW | Code path analysis |
| MMR re-fetches embeddings | Stage 3 re-reads from Vec0 what Stage 1 already loaded | LOW | Code path analysis |
| Sequential local reranker | Candidates processed sequentially (PERF CHK-113) | LOW | Code path analysis |

**Important caveat:** All 5 concerns are based on code path analysis, not empirical profiling. For the BM25 N+1 pattern, overhead may be negligible with SQLite prepared statements. For the expansion systems, actual wall-clock cost depends on embedding generation latency which was not measured.
[SOURCE: iteration-013, iteration-020 section 2a]

#### Timing Instrumentation Gaps

Timing exists in:
- Cross-encoder: circuit breaker + latency tracker
- Stage 4: `durationMs` field
- Vector index queries: timing instrumentation

Missing: The orchestrator has zero timing code. No end-to-end pipeline latency metric exists.
[SOURCE: iteration-013]

---

### 15. Cross-Validation Results

*Primary source: iteration 18.*

10 top findings were independently re-verified with fresh code traces:

| # | Finding | Verdict | Correction |
|---|---------|---------|------------|
| 1 | 3 divergent score resolution chains | CONFIRMED | All 3 still exist with different fallback orders |
| 2 | 30+ hardcoded scoring constants | CONFIRMED | 4/5 spot-checks positive |
| 3 | 76 SPECKIT_ feature flags | MODIFIED | Actual count is 81, not 76 |
| 4 | Orchestrator 0 error handling | CONFIRMED | 79 lines, zero try/catch/throw/error |
| 5 | FSRS write-back race condition | MODIFIED | fsrs.ts is read-only; write-back lives in trackAccess flow |
| 6 | Embedding cache ignores model ID | REFUTED | Cache has compound PK (content_hash, model_id) |
| 7 | memory_search 28 parameters | MODIFIED | Actual count is 31, not 28 |
| 8 | 5 channels not 4 | CONFIRMED | types.ts:185 explicitly lists 5 |
| 9 | 5-factor model never activated | CONFIRMED | Zero production callers |
| 10 | Dead applyIntentWeights export | CONFIRMED | Zero imports outside intent-classifier.ts |

**Reliability score: 6 CONFIRMED, 3 MODIFIED, 1 REFUTED = 90% directionally correct (9/10)**

The REFUTED finding (embedding cache) was removed from all recommendations. The 3 MODIFIED findings were corrected upward (flag count 81, parameter count 31) or corrected in location (FSRS race).
[SOURCE: iteration-018]

---

### 16. Prioritized Recommendations

*Primary source: iteration 19. Full details in `scratch/iteration-019.md`.*

25 recommendations across 7 categories, scored by Priority (P0/P1/P2), Effort (S/M/L), and Impact (1-5):

#### P0 -- Critical (Fix First)

| Rank | ID | Category | Recommendation | Effort | Impact | Cross-Val |
|------|-----|----------|---------------|--------|--------|-----------|
| 1 | B1 | Architecture | Orchestrator error handling + timeouts | M | 5/5 | CONFIRMED |
| 2 | B2 | Architecture | Weight coherence unification (3 systems to 1) | L | 5/5 | Partial |
| 3 | A1 | Correctness | Unify 3 score resolution chains | S | 4/5 | CONFIRMED |
| 4 | G1 | Testing | Orchestrator error cascade tests | S | 4/5 | N/A |

#### P1 -- Important (Sprint-Level)

| Rank | ID | Category | Recommendation | Effort | Impact | Cross-Val |
|------|-----|----------|---------------|--------|--------|-----------|
| 5 | B3 | Architecture | Eval-to-scoring feedback loop | L | 5/5 | CONFIRMED |
| 6 | B5 | Architecture | Feature flag governance overhaul (81 flags) | L | 4/5 | MODIFIED |
| 7 | E3 | DX | Simplified memory_search tool (31 params) | M | 4/5 | MODIFIED |
| 8 | B6 | Architecture | Signal failure tri-state metadata | S | 3/5 | N/A |
| 9 | B7 | Architecture | Batch BM25 spec-folder N+1 query | S | 3/5 | Indirect |
| 10 | A4 | Correctness | Concurrent save dedup transaction isolation | M | 3/5 | N/A |
| 11 | B4 | Architecture | Stage 2 monolith decomposition | M | 3/5 | N/A |
| 12 | D1 | Documentation | Update spec: 5 channels not 4 | S | 3/5 | CONFIRMED |
| 13 | D4 | Documentation | Feature flag manifest creation | M | 3/5 | MODIFIED |
| 14 | F1 | Performance | Deep-mode expansion caching + parallelization | M | 3/5 | N/A |
| 15 | G2 | Testing | Score resolution consistency tests | S | 3/5 | N/A |
| 16 | G3 | Testing | Cross-encoder circuit breaker tests | S | 3/5 | N/A |
| 17 | G5 | Testing | Concurrent save dedup race tests | M | 3/5 | N/A |

#### P2 -- Improvement (Opportunistic)

| Rank | ID | Category | Items |
|------|-----|----------|-------|
| 18 | E1 | DX | File-watcher default-ON |
| 19-20 | D2-D3 | Documentation | Spec corrections (12 steps not 15+; SHA-256 dedup not cosine) |
| 21-22 | C5-C6 | Dead Code | 5-factor model: activate or remove; RSF: test activation or remove |
| 23 | F2 | Performance | R12 expansion: add metrics to measure recall delta |
| 24 | A2 | Correctness | FSRS write-back transaction isolation |
| 25 | C1-C4, C7-C9 | Dead Code | 7 dead code items (applyIntentWeights, detectIntent, GRAPH_WEIGHT_BOOST, graphWeight fields, temporal-contiguity, PIPELINE_V2, classifier confidence) |

#### Implementation Roadmap

| Sprint | Duration | Items | Description |
|--------|----------|-------|-------------|
| Sprint 1: Quick Wins | 1-2 days | A1, B6, B7, G1, G2, G3 | Score unification, tri-state metadata, BM25 batch, 3 test suites |
| Sprint 2: Critical Architecture | 3-5 days | B1, D1, D4, E3 | Orchestrator error handling, spec updates, flag manifest, simplified search |
| Sprint 3: Performance + Testing | 3-5 days | F1, A4+G5, B4 | Expansion caching, concurrent save fix + tests, Stage 2 decomposition |
| Epic: Strategic Initiatives | 2-4 weeks | B2, B5, B3 | Weight unification (1w), flag governance (1w), eval feedback loop (2w) |

---

### 17. Research Gaps and Debt

*Primary source: iteration 20.*

#### Codebase Coverage

| Category | Files | LOC | Status |
|----------|-------|-----|--------|
| Investigated (search, cognitive, eval, graph, save) | ~50 | ~22,000 | DEEP to MODERATE coverage |
| NOT investigated (storage, handlers, parsing, telemetry, etc.) | ~100 | ~30,000 | Zero coverage |
| **Total lib/** | ~150 | ~52,000 | ~42% investigated |

#### Top 5 Research Debt Items (Next Campaign)

| ID | Topic | LOC | Expected Value | Rationale |
|----|-------|-----|---------------|-----------|
| RD-01 | storage/ layer deep dive | 7,148 | 5/5 | Largest uninvestigated subsystem. All correctness and performance findings rest on storage assumptions. |
| RD-02 | handlers/ layer audit (non-save) | 11,280 | 4/5 | MCP-to-lib bridge layer. Tool validation, error propagation, authorization. |
| RD-03 | Performance benchmarking | N/A | 4/5 | All 5 performance recommendations based on code path analysis, not measurement. |
| RD-04 | Tenant isolation security audit | ~1,310 | 4/5 | governance/ (710 LOC) + collab/ not examined. Multi-tenant isolation is a critical security property. |
| RD-05 | Cognitive impact measurement | 4,644 | 3/5 | 10 production modules with no metrics proving they improve retrieval quality. |

#### Claims Requiring Empirical Validation

**Performance claims without measurement:**
- BM25 N+1 query latency impact (may be negligible with prepared statements)
- Deep-mode 3x expansion cost (depends on embedding generation latency)
- R12 expansion doubling (parallel execution may reduce actual cost)
- MMR embedding re-fetch cost (may be cached at SQLite page level)

**Correctness claims without test reproduction:**
- Score resolution divergence causing wrong results on error paths (may be fully masked by `withSyncedScoreAliases`)
- FSRS write-back race losing updates (SQLite single-writer serialization may prevent it)
- Concurrent save dedup creating duplicates (file-based invocation patterns may make concurrent saves rare)

**Architectural claims without baseline comparison:**
- 81 flags as "massive sprawl" (no baseline for 190K LOC system)
- 31 parameters as "too many" (many have sensible defaults; typical use may be 2-3)
- 28 warn-and-continue catch blocks as "excessive" (may be accepted pattern for optional enrichment)

#### Security Areas NOT Reviewed

| Area | Risk Level | Description |
|------|-----------|-------------|
| SQL injection in flag-driven queries | MEDIUM | 81 env vars used in SQL queries; parameterization not verified |
| Tenant isolation enforcement | HIGH | governance/ (710 LOC) not examined |
| Embedding API key handling | MEDIUM | providers/ (621 LOC) not examined |
| MCP tool input validation | MEDIUM | validation/ (1,457 LOC) not examined |
| File path traversal in memory save | MEDIUM | Path traversal prevention not verified |

---

### Convergence Report

| Metric | Value |
|--------|-------|
| Total iterations | 20 |
| Questions asked | 18 |
| Questions answered | 18/18 (100%) |
| Stop reason | max_iterations_reached |
| Campaign duration | ~9.5 hours (2026-03-20T09:49Z to 2026-03-20T19:30Z) |
| Total findings | 220+ individual findings across 20 iterations |
| Recommendations produced | 25 across 7 categories (A-G) |
| Cross-validation score | 90% directionally correct (6 confirmed, 3 modified, 1 refuted) |
| Codebase coverage | ~42% of lib/ LOC (22K/52K), ~12% of total (22K/190K) |
| Research debt identified | 15 items for future campaigns |

#### What This Campaign Definitively Established

1. The 4-stage pipeline architecture is structurally sound but has zero orchestrator-level error handling
2. Three distinct score resolution chains create a latent correctness risk (cross-validated, CONFIRMED)
3. 81 feature flags lack governance infrastructure (cross-validated, corrected upward from 76)
4. The eval system measures but cannot calibrate (cross-validated, CONFIRMED)
5. The cognitive subsystem is production-integrated but unmeasured (10/11 modules live, 0 impact metrics)
6. 9 dead code items can be safely removed (3 cross-validated and confirmed)
7. The save pipeline is architecturally robust with 3 concurrency caveats
8. 7 critical test paths are missing (G1-G7)

#### What This Campaign Could NOT Establish

1. Whether any correctness bug has EVER manifested in production
2. Whether performance concerns cause measurable latency degradation
3. Whether the 30+ hardcoded scoring constants are near-optimal or arbitrarily chosen
4. Whether the cognitive subsystem measurably improves retrieval quality
5. Whether tenant isolation is properly enforced
6. Whether the storage layer has correctness or scalability issues
7. Whether MCP tool inputs are properly validated

#### newInfoRatio Trajectory

| Iterations | Avg newInfoRatio | Phase |
|-----------|-----------------|-------|
| 1-4 (Broad Survey) | 0.95 | High discovery rate -- fresh codebase analysis |
| 5-9 (Deep Investigation) | 0.89 | Sustained discovery -- targeted deep dives |
| 10-13 (Automation/UX) | 0.87 | Continued strong returns -- new domains |
| 14-15 (Cross-Cutting) | 0.64 | Declining -- increasingly overlapping with prior findings |
| 16-20 (Synthesis) | 0.24 | Low raw novelty, high synthesis value |

#### Iteration-by-Iteration Source Files

All iteration files are located in `scratch/` within this spec folder:
- `scratch/iteration-001.md` through `scratch/iteration-020.md`
- `scratch/deep-research-strategy.md` (answered questions, approach history)
- `scratch/deep-research-state.jsonl` (convergence data, iteration records)
- `scratch/deep-research-config.json` (campaign configuration)

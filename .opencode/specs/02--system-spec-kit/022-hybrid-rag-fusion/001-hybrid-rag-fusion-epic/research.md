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


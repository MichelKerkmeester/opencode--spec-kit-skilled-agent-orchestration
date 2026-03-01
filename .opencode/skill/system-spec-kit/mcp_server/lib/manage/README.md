---
title: "Memory Management Library"
description: "Graph-based authority scoring and batch management utilities for the memory system, including iterative PageRank computation."
trigger_phrases:
  - "memory management"
  - "pagerank"
  - "graph authority"
---

# Memory Management Library

> Graph-based authority scoring and batch management utilities consumed during `memory_manage` cycles.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED](#5--related)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

`lib/manage/` contains modules that run during scheduled memory management cycles. The primary responsibility at present is computing PageRank authority scores across the memory graph so that highly-cited memories receive higher retrieval weight.

PageRank is computed in batch during `memory_manage` cycles. It runs up to 10 iterations by default and declares convergence when the maximum per-node delta falls below 1e-6.

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
lib/manage/
+-- pagerank.ts    # Iterative PageRank for memory graph authority scoring [spec 138 NEW]
+-- README.md      # This file
```

### File Inventory

| File           | Purpose                                               | Key Exports                                     | Spec         |
| -------------- | ----------------------------------------------------- | ----------------------------------------------- | ------------ |
| `pagerank.ts`  | Batch iterative PageRank over the memory graph        | `computePageRank`, `GraphNode`, `PageRankResult` | Spec 138 NEW |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### PageRank (Spec 138)

**Purpose**: Compute convergence-based authority scores for weighted node retrieval. Nodes with more inbound links from high-scoring sources receive higher scores, surfacing well-cited memories in retrieval rankings.

**Algorithm**: Standard damped iterative PageRank.
- Scores initialized uniformly at `1/n`.
- Each iteration: `PR(u) = (1 - d) / n + d * sum(PR(v) / out(v))` for all v that link to u.
- Convergence declared when max per-node delta < `CONVERGENCE_THRESHOLD` (1e-6).
- Falls back to returning unconverged scores after `maxIterations` (default: 10).

**Constants:**
```typescript
const DAMPING_FACTOR = 0.85;      // Probability of following an outbound link
const DEFAULT_ITERATIONS = 10;    // Iteration cap during memory_manage cycles
const CONVERGENCE_THRESHOLD = 1e-6; // L-inf delta below which scores are stable
```

**Types:**
```typescript
// Input: adjacency list representation of the memory graph
interface GraphNode {
  id: number;        // Unique memory node ID
  outLinks: number[];// IDs of memories this node links to
}

// Output
interface PageRankResult {
  scores: Map<number, number>; // Per-node rank scores (sum ~= 1.0)
  iterations: number;          // Iterations executed before convergence or limit
  converged: boolean;          // True if convergence threshold was met
}
```

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Basic PageRank Computation

```typescript
import { computePageRank } from './pagerank';
import type { GraphNode } from './pagerank';

// Build adjacency list from memory_relations table
const nodes: GraphNode[] = [
  { id: 1, outLinks: [2, 3] },
  { id: 2, outLinks: [3] },
  { id: 3, outLinks: [] },
];

const result = computePageRank(nodes);
// result.converged: true (small graph converges fast)
// result.iterations: number of iterations run
// result.scores: Map { 1 -> 0.19, 2 -> 0.28, 3 -> 0.53 } (approx)

// Use scores to boost retrieval ranking
for (const [id, score] of result.scores) {
  console.log(`Memory ${id}: authority = ${score.toFixed(4)}`);
}
```

### Example 2: Custom Iteration Cap

```typescript
import { computePageRank } from './pagerank';

// Use 20 iterations for large graphs that may need more time to converge
const result = computePageRank(nodes, 20, 0.85);

if (!result.converged) {
  console.warn(`PageRank did not converge in ${result.iterations} iterations`);
}
```

### Example 3: Empty Graph Guard

```typescript
import { computePageRank } from './pagerank';

// Empty graph returns immediately with no scores
const result = computePageRank([]);
// result = { scores: Map {}, iterations: 0, converged: true }
```

### Integration Pattern: Memory Manage Cycle

```typescript
import { computePageRank } from './pagerank';
import type { GraphNode } from './pagerank';

async function runMemoryManageCycle(db: Database): Promise<void> {
  // 1. Load memory graph from relation table
  const rows = db.prepare(
    'SELECT source_id AS id, target_id FROM memory_relations'
  ).all() as Array<{ id: number; target_id: number }>;

  // 2. Build adjacency list
  const nodeMap = new Map<number, GraphNode>();
  for (const row of rows) {
    if (!nodeMap.has(row.id)) nodeMap.set(row.id, { id: row.id, outLinks: [] });
    nodeMap.get(row.id)!.outLinks.push(row.target_id);
  }

  // 3. Compute PageRank (up to 10 iterations per spec 138)
  const result = computePageRank([...nodeMap.values()]);

  // 4. Write authority scores back to memory_index
  const update = db.prepare(
    'UPDATE memory_index SET pagerank_score = ? WHERE id = ?'
  );
  for (const [id, score] of result.scores) {
    update.run(score, id);
  }
}
```

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED
<!-- ANCHOR:related -->

- `../cognitive/co-activation.ts` — BFS spreading activation (complements PageRank authority scoring)
- `../cognitive/tier-classifier.ts` — 5-state model; authority scores feed into tier transitions
- `../../handlers/memory-crud.ts` — Memory read/update operations that consume authority scores
- `../../core/db-state.ts` — Graph state management added in spec 138

<!-- /ANCHOR:related -->

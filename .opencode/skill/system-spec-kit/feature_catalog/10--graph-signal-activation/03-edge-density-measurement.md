# Edge density measurement

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Describes the global edge density metric (`total_edges / total_memories`) used by runtime guards to gate graph-derived features and entity-linking creation.

## 2. CURRENT REALITY
The current density metric used by runtime guards is global edge density: `total_edges / total_memories` from the graph tables. If density is too low, graph-derived gains are naturally limited. If density is too high, entity-linking creation is gated by the configured density threshold. Earlier "edges-per-node" phrasing is still useful intuition, but runtime checks now use the global-density denominator for consistency.

## 3. IN SIMPLE TERMS
This measures how richly connected the knowledge graph is by counting the average number of links per memory. If there are too few connections, graph-based features would not add much value. If there are too many, the system holds off on creating new links to avoid a tangled mess. It is like a city planner checking road density before building more highways.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/edge-density.ts` | Lib | Edge density measurement |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/edge-density.vitest.ts` | Edge density measurement |

## 5. SOURCE METADATA
- Group: Graph signal activation
- Source feature title: Edge density measurement
- Current reality source: feature_catalog.md


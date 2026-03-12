# Edge density measurement

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Edge density measurement.

## 2. CURRENT REALITY

The current density metric used by runtime guards is global edge density: `total_edges / total_memories` from the graph tables. If density is too low, graph-derived gains are naturally limited; if density is too high, entity-linking creation is gated by the configured density threshold. Earlier "edges-per-node" phrasing is still useful intuition, but runtime checks now use the global-density denominator for consistency.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/edge-density.ts` | Lib | Edge density measurement |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/edge-density.vitest.ts` | Edge density measurement |

## 4. SOURCE METADATA

- Group: Graph signal activation
- Source feature title: Edge density measurement
- Current reality source: feature_catalog.md

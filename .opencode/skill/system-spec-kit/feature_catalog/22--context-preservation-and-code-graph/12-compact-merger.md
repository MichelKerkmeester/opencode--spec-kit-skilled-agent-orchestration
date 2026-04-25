---
title: "Compact merger"
description: "Compact merger combines context from Memory, Code Graph, and CocoIndex into a unified compact brief within the 4000-token budget."
audited_post_018: true
---

# Compact merger

## 1. OVERVIEW

Compact merger combines context from Memory, Code Graph, and CocoIndex into a unified compact brief within the 4000-token budget.

Accepts shaped results from 3 sources. Renders sections: Constitutional Rules, Active Files & Structural Context, Semantic Neighbors, Session State, Triggered Memories. Uses budget allocator for per-source token allocation. Includes allocation metadata and merge timestamp.

---

## 2. CURRENT REALITY

mcp_server/code_graph/lib/compact-merger.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | 3-source merge with budget allocation | _ |


### Tests

| File | Focus |
|------|-------|
| `Merge, section rendering, budget enforcement` | phase 011 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Compact merger
- Current reality source: spec 024-compact-code-graph 

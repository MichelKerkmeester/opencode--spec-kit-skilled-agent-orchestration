---
title: "Token budget allocator"
description: "Token budget allocator distributes 4000-token compaction budget across context sources using floor allocations plus overflow redistribution."
---

# Token budget allocator

## 1. OVERVIEW

Token budget allocator distributes 4000-token compaction budget across context sources using floor allocations plus overflow redistribution.

Floors: constitutional 700, code graph 1200, CocoIndex 900, triggered 400, overflow pool 800. Empty sources release their floor to the overflow pool. Redistribution follows priority: constitutional > codeGraph > cocoIndex > triggered. Total cap enforced with deterministic trim in reverse priority.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/budget-allocator.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `Lib` | Floor + overflow allocation | _ |


### Tests

| File | Focus |
|------|-------|
| `Floor distribution, overflow, cap enforcement` | phase 011 |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Token budget allocator
- Current reality source: spec 024-compact-code-graph 

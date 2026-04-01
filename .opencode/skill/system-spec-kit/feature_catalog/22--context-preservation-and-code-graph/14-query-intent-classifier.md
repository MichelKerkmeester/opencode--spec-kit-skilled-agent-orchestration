---
title: "Query-intent classifier"
description: "Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both)."
---

# Query-intent classifier

## 1. OVERVIEW

Heuristic pre-classifier that routes queries to the optimal retrieval backend: structural (code graph), semantic (CocoIndex), or hybrid (both).

Keyword-dictionary scoring classifies queries into three intents: structural (symbol/relationship queries routed to code graph), semantic (conceptual/discovery queries routed to CocoIndex), and hybrid (mixed queries that merge results from both). Confidence scores and matched keywords are returned alongside the intent classification. Integrated into memory_context handler for automatic query-intent routing.

---

## 2. CURRENT REALITY

mcp_server/lib/code-graph/query-intent-classifier.ts

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/code-graph/query-intent-classifier.ts` | Lib | Keyword-based intent classification with confidence scoring |
| `mcp_server/handlers/memory-context.ts` | Handler | Consumer: routes queries based on classified intent |

---

## 4. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Source feature title: Query-intent classifier
- Current reality source: spec 024-compact-code-graph phase 017/020

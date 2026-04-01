---
title: "TOOL ROUTING - Search & Retrieval Decision Tree"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # Search routing
  - search
  - find
  - look up
  - retrieve
  - query
  - semantic search
  - code search
  - grep
  - community search
  # Graph retrieval
  - graph retrieval
  - community summaries
  - dual level
  - retrievalLevel
  - global search
  - local search
  # Tool selection
  - which tool
  - CocoIndex
  - Code Graph
  - memory_search
  - memory_context
---

# Tool Routing Decision Tree

## Search Tool Selection

| Query Type | Primary Tool | Fallback |
|-----------|-------------|----------|
| **Semantic/concept** (meaning-based) | `mcp__cocoindex_code__search` | `memory_search` |
| **Structural** (function/class/file) | `code_graph_query` | `Grep` / `Glob` |
| **Exact text** (string literal) | `Grep` | `Glob` |
| **Memory/context** (prior work, decisions) | `memory_search` / `memory_context` | `memory_match_triggers` |
| **Broad topic** (thematic overview) | `memory_search` with `retrievalLevel: "global"` | community search fallback |

## Memory Search Retrieval Levels

- **`local`** (default): Entity-level matching against individual memories
- **`global`**: Community-level matching against topic clusters  
- **`auto`**: Local first; if weak results (<3), falls back to community search

## Graph Retrieval Features

- **Community search fallback**: Activates on weak/zero results (SPECKIT_COMMUNITY_SEARCH_FALLBACK)
- **Query concept expansion**: Expands query with alias terms (SPECKIT_QUERY_CONCEPT_EXPANSION)
- **Graph-expanded fallback**: Walks causal edges for expanded terms (SPECKIT_GRAPH_FALLBACK)
- **Always-on graph injection**: Graph signals injected regardless of causal boost (SPECKIT_GRAPH_CONTEXT_INJECTION)
- **Result provenance**: graphEvidence field shows contributing edges and communities (SPECKIT_RESULT_PROVENANCE)

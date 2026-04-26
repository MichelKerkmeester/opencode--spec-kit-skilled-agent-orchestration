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

> Lean constitutional rule. Always-surface guidance for picking the right retrieval tool by query shape.

<!-- ANCHOR:code-search-tree -->

## Code Search Decision Tree (MANDATORY)

Route code search queries using this priority order:

| Query Type | Primary Tool | Fallback |
|-----------|-------------|----------|
| **Semantic/concept** (meaning-based) | `mcp__cocoindex_code__search` (CocoIndex) | `memory_search` |
| **Structural** (callers, imports, deps) | `code_graph_query` (Code Graph) | `Grep` / `Glob` |
| **Exact text/regex** (string literal) | `Grep` | `Glob` |

<!-- /ANCHOR:code-search-tree -->

<!-- ANCHOR:context-search -->

## Memory & Context Search

| Query Type | Primary Tool | Fallback |
|-----------|-------------|----------|
| **Spec-doc continuity** (prior work, decisions) | `memory_search` / `memory_context` | `memory_match_triggers` |
| **Broad topic** (thematic overview) | `memory_search` with `retrievalLevel: "global"` | community search fallback |

<!-- /ANCHOR:context-search -->

<!-- ANCHOR:fts-fallback -->

## FTS 3-Tier Fallback Chain

When both graph and semantic search miss or return weak results, apply the 3-tier FTS fallback:

1. **FTS5 full-text** — exact keyword match against indexed content
2. **BM25 keyword scoring** — relevance-ranked keyword retrieval
3. **Grep/Glob** — direct filesystem text search as last resort

This ensures no query goes unanswered even when embeddings or the graph index are unavailable.

<!-- /ANCHOR:fts-fallback -->

<!-- ANCHOR:retrieval-levels -->

## Memory Search Retrieval Levels

- **`local`** (default): Entity-level matching against individual spec-doc records
- **`global`**: Community-level matching against topic clusters
- **`auto`**: Local first; if weak results (<3), falls back to community search

<!-- /ANCHOR:retrieval-levels -->

<!-- ANCHOR:graph-features -->

## Graph Retrieval Features

- **Always-on code-graph context injection**: Graph signals (structural edges, call chains, import trees) are injected into every retrieval response regardless of causal boost state (SPECKIT_GRAPH_CONTEXT_INJECTION). This ensures structural awareness is never absent from search results.
- **Community search fallback**: Activates on weak/zero results (SPECKIT_COMMUNITY_SEARCH_FALLBACK)
- **Query concept expansion**: Expands query with alias terms (SPECKIT_QUERY_CONCEPT_EXPANSION)
- **Graph-expanded fallback**: Walks causal edges for expanded terms (SPECKIT_GRAPH_FALLBACK)
- **Result provenance**: graphEvidence field shows contributing edges and communities (SPECKIT_RESULT_PROVENANCE)

<!-- /ANCHOR:graph-features -->

<!-- ANCHOR:code-references -->

## Code References

Implementation surfaces backing this routing contract:

| Tool | Source File | Role |
|------|-------------|------|
| `mcp__cocoindex_code__search` | `.opencode/skill/mcp-coco-index/SKILL.md` | Semantic code search via vector embeddings |
| `code_graph_query` | `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph.ts` | Structural query handler (callers/imports/deps) |
| `code_graph_context` | `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph.ts` | Bounded code-graph context retrieval |
| `memory_search` | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | 3-channel hybrid search with RRF fusion |
| `memory_context` | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Intent-routed context retrieval (L1 entry point) |
| `memory_match_triggers` | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-match-triggers.ts` | Trigger-phrase matcher (constitutional + tier-aware) |
| FTS5 fallback | `.opencode/skill/system-spec-kit/mcp_server/lib/search/fts5-search.ts` | Full-text exact-keyword channel |
| BM25 reranker | `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25.ts` | Relevance-ranked keyword channel |

Decision tables in this file are derived from these handlers. When a handler signature or routing contract changes, update both the handler docstrings and this rule together.

<!-- /ANCHOR:code-references -->

*Constitutional rule — always surfaces at top of search results*

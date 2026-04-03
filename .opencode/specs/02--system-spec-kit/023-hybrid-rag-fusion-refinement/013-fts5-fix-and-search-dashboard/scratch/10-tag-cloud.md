# Design 10: Folder as Tree Group (Viewport-Safe)

> Results grouped under abbreviated folder headers. Full path available but compact.

```text
MEMORY:SEARCH  "semantic search"  understand  10 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  system-spec-kit/
    6.26  #111   TOOL ROUTING - Search & Retrieval Decision Tree

  010-search-retrieval-quality-fixes/
    6.18  #1187  Feature Spec: Search Retrieval Quality Fixes

  007-external-graph-memory-research/
    6.07  #1263  Graph Memory Survey [22/89]
    5.98  #1315  Graph Memory Survey [55/89]
    5.94  #1355  Graph Memory Survey [85/89]
    5.88  #1285  Graph Memory Survey [37/89]

  025-tool-routing-enforcement/
    5.90  #1510  Feature Spec: Tool Routing Enforcement

  009-graph-retrieval-improvements/
    5.51  #68    Implemented 8 Graph Retrieval Improvements
    5.41  #1376  Feature Spec: Graph Retrieval Improvements

  022-mcp-coco-integration/
    5.42  #1709  Tasks: CocoIndex Code MCP Integration

STATUS=OK RESULTS=10
```

### Folder Display Rules
- Show **leaf folder name only** (last path segment)
- Drop parent path prefixes (`02--system-spec-kit/023-hybrid-rag-fusion-refinement/` etc.)
- Keeps lines under ~50 chars for narrow viewports
- Top-level folders (like `system-spec-kit`) shown as-is
- If two leaf names collide, prefix with parent number: `023/010-search-quality/`

### Concept
Leaf-only folder names stay short and never wrap. Results grouped underneath. Same grouping benefit as full paths but viewport-safe.

# Design 23: Score Delta from Top

> Shows gap from best result. Highlights natural score drops.

```text
MEMORY:SEARCH  "semantic search"  understand  10 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  6.26       #111   TOOL ROUTING - Search & Retrieval Decision Tree · system-spec-kit
  6.18 -0.08 #1187  Feature Spec: Search Retrieval Quality Fixes · 010-search-quality
  6.07 -0.19 #1263  Graph Memory Survey [22/89] · 007-graph-memory
  5.98 -0.28 #1315  Graph Memory Survey [55/89] · 007-graph-memory
  5.94 -0.32 #1355  Graph Memory Survey [85/89] · 007-graph-memory
  5.90 -0.36 #1510  Feature Spec: Tool Routing Enforcement · 025-tool-routing
  5.51 -0.75 #68    Implemented 8 Graph Retrieval Improvements · 009-graph-retrieval
  5.42 -0.84 #1709  Tasks: CocoIndex Code MCP Integration · 022-mcp-coco

STATUS=OK RESULTS=8
```

### Concept
Delta makes score gaps visible. Jump from -0.36 to -0.75 highlights a natural break.

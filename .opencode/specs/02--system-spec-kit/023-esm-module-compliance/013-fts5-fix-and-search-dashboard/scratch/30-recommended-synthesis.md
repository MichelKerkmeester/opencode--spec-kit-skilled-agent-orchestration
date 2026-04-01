# Design 30: Recommended Synthesis

> Best elements combined. Author's pick.

Takes: Score-leading (#01) + dot separator (#06) + zero-result handling (#19) + chunk collapsing (#26)

### Normal:
```text
MEMORY:SEARCH  "semantic search"  understand  10 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  6.26  #111   TOOL ROUTING - Search & Retrieval Decision Tree · system-spec-kit
  6.18  #1187  Feature Spec: Search Retrieval Quality Fixes · 010-search-quality
  6.07  #1263  Graph Memory Survey (×4 chunks) · 007-graph-memory
  5.90  #1510  Feature Spec: Tool Routing Enforcement · 025-tool-routing
  5.51  #68    Implemented 8 Graph Retrieval Improvements · 009-graph-retrieval
  5.42  #1709  Tasks: CocoIndex Code MCP Integration · 022-mcp-coco
  5.41  #1376  Feature Spec: Graph Retrieval Improvements · 009-graph-retrieval

STATUS=OK RESULTS=7 (3 collapsed)
```

### Zero results:
```text
MEMORY:SEARCH  "semantic search"  understand  0 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  No matches. Try a broader query.

STATUS=OK RESULTS=0
```

### Why
- **Score leads**: Natural sort column
- **` · ` separator**: Lightweight divider between title and folder
- **Leaf folder only**: No parent path noise
- **Chunk collapsing**: 4 duplicate entries → 1 with `(×4 chunks)`
- **Clean zero state**: Actionable, not technical
- **Single-line header**: Query + intent + count — all you need
- **No metadata**: No type, bars, previews, weights, or budget

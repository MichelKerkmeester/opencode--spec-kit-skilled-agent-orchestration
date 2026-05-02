# Design 19: Zero-Result Handling

> Same compact format with clean zero-result case.

### Normal:
```text
MEMORY:SEARCH  "semantic search"  understand  10 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  6.26  #111   TOOL ROUTING - Search & Retrieval Decision Tree · system-spec-kit
  6.18  #1187  Feature Spec: Search Retrieval Quality Fixes · 010-search-quality
  6.07  #1263  Graph Memory Survey [22/89] · 007-graph-memory
  5.51  #68    Implemented 8 Graph Retrieval Improvements · 009-graph-retrieval

STATUS=OK RESULTS=4
```

### Zero results:
```text
MEMORY:SEARCH  "semantic search"  understand  0 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  No matches. Try a broader query.

STATUS=OK RESULTS=0
```

### Concept
Handles both cases. Zero-result message is actionable.

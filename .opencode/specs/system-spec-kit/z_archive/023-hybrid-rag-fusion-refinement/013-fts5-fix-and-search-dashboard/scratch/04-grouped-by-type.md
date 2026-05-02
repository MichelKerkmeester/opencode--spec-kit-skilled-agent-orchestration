# Design 04: Pipe-Separated Columns

> Clean column layout with pipe separators.

```text
MEMORY:SEARCH  "semantic search"  understand  10 found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Score │ ID     │ Title                                    │ Folder
  ──────┼────────┼──────────────────────────────────────────┼─────────────────
  6.26  │ #111   │ TOOL ROUTING - Search & Retrieval Decis… │ system-spec-kit
  6.18  │ #1187  │ Feature Spec: Search Retrieval Quality…  │ 010-search-quality
  6.07  │ #1263  │ Graph Memory Survey [22/89]              │ 007-graph-memory
  5.98  │ #1315  │ Graph Memory Survey [55/89]              │ 007-graph-memory
  5.51  │ #68    │ Implemented 8 Graph Retrieval Improvem…  │ 009-graph-retrieval
  5.42  │ #1709  │ Tasks: CocoIndex Code MCP Integration    │ 022-mcp-coco

STATUS=OK RESULTS=10
```

### Concept
CLI table (docker ps style). Columns labeled. Title may truncate.

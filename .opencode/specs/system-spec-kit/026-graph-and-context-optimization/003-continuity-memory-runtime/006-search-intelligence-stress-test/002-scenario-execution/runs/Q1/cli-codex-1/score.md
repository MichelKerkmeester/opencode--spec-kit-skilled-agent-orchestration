## Scenario Q1 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Listed 5+ callers with file:line: context-server.ts, memory-tools.ts, hooks/memory-surface.js, etc. |
| Tool Selection | 2 | Recursive grep on memory_context across mcp_server tree — appropriate when no code-graph available |
| Latency | 1 | 58.4s (58394ms) |
| Token Efficiency | 0 | 63k real tokens (real tokens: 63472) |
| Hallucination | 1 | Most file paths verified; some line numbers approximate rather than exact |
| **Total** | **6/10** | |

**Notable**: Without spec-kit code-graph, fell back to grep — got the right answer. Confirms 005/REQ-017 (code graph naming/empty) doesn't block external CLIs.

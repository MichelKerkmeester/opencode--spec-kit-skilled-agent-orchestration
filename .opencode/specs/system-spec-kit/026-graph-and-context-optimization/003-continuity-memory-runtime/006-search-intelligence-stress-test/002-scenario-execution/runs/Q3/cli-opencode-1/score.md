## Scenario Q3 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Identified context-server.ts and hooks/memory-surface.js with line numbers (1140, 1165, 162) |
| Tool Selection | 2 | MCP code_graph_query + Read — used the structured path |
| Latency | 0 | 98.7s (>60s) (98746ms) |
| Token Efficiency | 0 | 65k real tokens (real tokens: 65422) |
| Hallucination | 2 | All cited line numbers verified to exist in dist/ files |
| **Total** | **6/10** | |

**Notable**: Tied with codex for correctness; lower token cost wins on efficiency.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Identified context-server.ts and hooks/memory-surface.js with line numbers (1140, 1165, 162) |
| Tool Selection | 2 | MCP code_graph_query + Read — used the structured path |
| Latency | 1 | 98.7s (60-300s band) (98746ms) |
| Hallucination | 2 | All cited line numbers verified to exist in dist/ files |
| **Total** | **7/8** | |

**Δ from v1.0.0**: 6/10 → 7/8 (60% → 87.5%)

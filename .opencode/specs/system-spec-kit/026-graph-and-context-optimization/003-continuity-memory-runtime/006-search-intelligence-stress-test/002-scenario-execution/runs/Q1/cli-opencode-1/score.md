## Scenario Q1 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned 3-4 callers via code_graph_query + cocoindex; correct files but partial coverage |
| Tool Selection | 2 | Used MCP code_graph_query — the documented optimal path even if graph data is sparse |
| Latency | 0 | 249.8s (4 min — by far the slowest) (249800ms) |
| Token Efficiency | 0 | 70k real tokens (real tokens: 69957) |
| Hallucination | 1 | Files verified; one cited 'callerCount' value not directly attestable |
| **Total** | **4/10** | |

**Notable**: Surfaces 005/REQ-017: code-graph reports empty/sparse, opencode tried code_graph_query first then fell back. 4-minute latency is the cost of trying the right tool against an under-populated index.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned 3-4 callers via code_graph_query + cocoindex; correct files but partial coverage |
| Tool Selection | 2 | Used MCP code_graph_query — the documented optimal path even if graph data is sparse |
| Latency | 1 | 249.8s (60-300s band; near upper bound) (249800ms) |
| Hallucination | 1 | Files verified; one cited 'callerCount' value not directly attestable |
| **Total** | **5/8** | |

**Δ from v1.0.0**: 4/10 → 5/8 (40% → 62.5%)

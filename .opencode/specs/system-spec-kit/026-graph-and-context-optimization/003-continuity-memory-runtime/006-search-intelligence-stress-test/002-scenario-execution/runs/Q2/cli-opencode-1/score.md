## Scenario Q2 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Used memory_context (deep) + cocoindex_search; returned cross-channel results from spec docs and code |
| Tool Selection | 2 | Memory_context deep mode + cocoindex hybrid — exact intended path per scenario |
| Latency | 1 | 47.8s (47780ms) |
| Token Efficiency | 0 | 63k real tokens (real tokens: 62846) |
| Hallucination | 1 | Citations match files; some intent label wording may not be canonical (per 005/REQ-001 still active) |
| **Total** | **6/10** | |

**Notable**: Surfaces 005/REQ-001 indirectly: intent-routing fired correctly for 'search system' (no fix_bug misroute observed in this run).

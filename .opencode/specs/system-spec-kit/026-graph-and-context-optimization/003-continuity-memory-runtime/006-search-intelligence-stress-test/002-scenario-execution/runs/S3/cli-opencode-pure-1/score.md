## Scenario S3 — cli-opencode-pure-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Found spec.md content via grep-Read fallback |
| Tool Selection | 1 | No MCP routing; grep+Read like external CLIs |
| Latency | 0 | 77.0s (>60s — slowest of S3) (77027ms) |
| Token Efficiency | 0 | 60k real tokens (real tokens: 60121) |
| Hallucination | 2 | Citations match files |
| **Total** | **5/10** | |

**Notable**: Pure mode took longer than full-MCP — losing tool routing forces wider search.

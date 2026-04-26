## Scenario S1 — cli-opencode-pure-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Found 004-memory-save-rewrite via Glob+Read fallback (no MCP) |
| Tool Selection | 1 | Forced to fall back to grep/glob (no spec-kit MCP); not optimal but works |
| Latency | 1 | 49.1s (49106ms) |
| Token Efficiency | 0 | 72k real tokens (slightly higher than full-MCP variant) (real tokens: 71853) |
| Hallucination | 2 | Citations match real files |
| **Total** | **6/10** | |

**Notable**: Ablation shows model alone can solve S1 via filesystem search; MCP advantage = ~10% token savings, not correctness.

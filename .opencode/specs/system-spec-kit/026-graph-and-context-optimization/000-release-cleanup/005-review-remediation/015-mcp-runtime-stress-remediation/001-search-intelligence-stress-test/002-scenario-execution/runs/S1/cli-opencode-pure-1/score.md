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

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Found 004-memory-save-rewrite via Glob+Read fallback (no MCP) |
| Tool Selection | 1 | Forced to fall back to grep/glob (no spec-kit MCP); not optimal but works |
| Latency | 2 | 49.1s (<60s) (49106ms) |
| Hallucination | 2 | Citations match real files |
| **Total** | **7/8** | |

**Δ from v1.0.0**: 6/10 → 7/8 (60% → 87.5%)

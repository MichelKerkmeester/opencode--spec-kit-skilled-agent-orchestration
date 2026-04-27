## Scenario S2 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned mixed results spanning specs, code, .opencode dirs — diverse but no formal ranking |
| Tool Selection | 1 | grep + glob; no semantic-search routing on the vague query |
| Latency | 1 | 58.7s (58700ms) |
| Token Efficiency | 0 | 293k real tokens (real tokens: 293000) |
| Hallucination | 2 | Cited paths verified |
| **Total** | **5/10** | |

**Notable**: Without spec-kit MCP, copilot defaults to text search — misses chance to use structured memory_context.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned mixed results spanning specs, code, .opencode dirs — diverse but no formal ranking |
| Tool Selection | 1 | grep + glob; no semantic-search routing on the vague query |
| Latency | 2 | 58.7s (<60s) (58700ms) |
| Hallucination | 2 | Cited paths verified |
| **Total** | **6/8** | |

**Δ from v1.0.0**: 5/10 → 6/8 (50% → 75%)

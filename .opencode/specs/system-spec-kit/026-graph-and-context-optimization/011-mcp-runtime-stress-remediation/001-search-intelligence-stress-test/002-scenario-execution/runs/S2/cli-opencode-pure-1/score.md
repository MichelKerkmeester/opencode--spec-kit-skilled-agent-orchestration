## Scenario S2 — cli-opencode-pure-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned spec packet listing via grep/Glob; no ranked diversity |
| Tool Selection | 1 | Without MCP, fell back to filesystem search; less appropriate for vague query |
| Latency | 1 | 39.0s (38965ms) |
| Token Efficiency | 0 | 51k real tokens (real tokens: 50590) |
| Hallucination | 2 | Citations real |
| **Total** | **5/10** | |

**Notable**: Ablation shows: without MCP, opencode loses the ranked-diversity capability that's the value-add for vague queries.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned spec packet listing via grep/Glob; no ranked diversity |
| Tool Selection | 1 | Without MCP, fell back to filesystem search; less appropriate for vague query |
| Latency | 2 | 39.0s (<60s) (38965ms) |
| Hallucination | 2 | Citations real |
| **Total** | **6/8** | |

**Δ from v1.0.0**: 5/10 → 6/8 (50% → 75%)

## Scenario Q2 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Mix of code + spec refs returned; covers 026/003 chain + mcp_server |
| Tool Selection | 1 | grep approach |
| Latency | 0 | 113.1s (>60s, slowest in row) (113146ms) |
| Token Efficiency | 0 | 830k real tokens (highest of Q2) (real tokens: 830300) |
| Hallucination | 2 | Citations real |
| **Total** | **5/10** | |

**Notable**: Highest token cost for vague Q-tier — copilot autonomy explores broadly when prompt is open-ended.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Mix of code + spec refs returned; covers 026/003 chain + mcp_server |
| Tool Selection | 1 | grep approach |
| Latency | 1 | 113.1s (60-300s band) (113146ms) |
| Hallucination | 2 | Citations real |
| **Total** | **6/8** | |

**Δ from v1.0.0**: 5/10 → 6/8 (50% → 75%)

## Scenario Q1 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Listed 4 callers but truncated; missed several known callers |
| Tool Selection | 1 | grep approach but stopped early after a few hits |
| Latency | 0 | 91.3s (>60s) (91286ms) |
| Token Efficiency | 0 | 447k real tokens (real tokens: 447600) |
| Hallucination | 1 | Listed paths exist; 1 line number was off by a few |
| **Total** | **3/10** | |

**Notable**: Slowest external for code-callers query; copilot's autonomous tool-use was less directed than codex.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Listed 4 callers but truncated; missed several known callers |
| Tool Selection | 1 | grep approach but stopped early after a few hits |
| Latency | 1 | 91.3s (60-300s band) (91286ms) |
| Hallucination | 1 | Listed paths exist; 1 line number was off by a few |
| **Total** | **4/8** | |

**Δ from v1.0.0**: 3/10 → 4/8 (30% → 50%)

## Scenario Q2 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Returned diverse results: spec packets (026/003/005, 026/003/004), code refs, command docs |
| Tool Selection | 1 | grep + Read — fine for the query but no semantic fusion |
| Latency | 0 | 64.8s (>60s) (64841ms) |
| Token Efficiency | 0 | 128k real tokens (real tokens: 128295) |
| Hallucination | 2 | Citations match real packet IDs |
| **Total** | **5/10** | |

**Notable**: Cross-channel fusion via deliberate manual enumeration — codex compensates for no MCP by being thorough.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Returned diverse results: spec packets (026/003/005, 026/003/004), code refs, command docs |
| Tool Selection | 1 | grep + Read — fine for the query but no semantic fusion |
| Latency | 1 | 64.8s (60-300s band) (64841ms) |
| Hallucination | 2 | Citations match real packet IDs |
| **Total** | **6/8** | |

**Δ from v1.0.0**: 5/10 → 6/8 (50% → 75%)

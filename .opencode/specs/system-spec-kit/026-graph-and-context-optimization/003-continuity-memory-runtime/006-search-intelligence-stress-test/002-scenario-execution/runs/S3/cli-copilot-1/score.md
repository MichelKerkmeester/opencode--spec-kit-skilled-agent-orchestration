## Scenario S3 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Quoted decision from spec.md L106/L112 + ANCHOR markers |
| Tool Selection | 2 | Targeted Read after grep — precise |
| Latency | 0 | 66.9s (>60s) (66892ms) |
| Token Efficiency | 0 | 395k real tokens (real tokens: 395300) |
| Hallucination | 2 | Quoted text matches |
| **Total** | **6/10** | |

**Notable**: Same gap as codex: didn't pivot to decision-record.md which holds the formal ADR rationale chain.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Quoted decision from spec.md L106/L112 + ANCHOR markers |
| Tool Selection | 2 | Targeted Read after grep — precise |
| Latency | 1 | 66.9s (60-300s) (66892ms) |
| Hallucination | 2 | Quoted text matches |
| **Total** | **7/8** | |

**Δ from v1.0.0**: 6/10 → 7/8 (60% → 87.5%)

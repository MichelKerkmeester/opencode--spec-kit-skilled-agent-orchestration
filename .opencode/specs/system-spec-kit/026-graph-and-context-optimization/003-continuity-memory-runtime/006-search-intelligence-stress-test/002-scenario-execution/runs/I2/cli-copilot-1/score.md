## Scenario I2 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Identified 005 packet; recommended spec.md as starting point |
| Tool Selection | 1 | grep-based discovery; no advisor routing |
| Latency | 0 | 104.4s (>60s) (104430ms) |
| Token Efficiency | 0 | 606k real tokens (real tokens: 605900) |
| Hallucination | 2 | Cited packet exists |
| **Total** | **5/10** | |

**Notable**: Slow but correct. Copilot's broad exploration ate tokens.

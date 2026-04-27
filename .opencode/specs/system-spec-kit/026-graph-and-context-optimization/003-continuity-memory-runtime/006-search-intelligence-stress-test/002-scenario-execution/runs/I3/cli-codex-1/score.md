## Scenario I3 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Parsed the command structure and identified preflight subcommand + args; did NOT actually invoke (no command surface) |
| Tool Selection | 1 | Described what /memory:search preflight would do; correct routing knowledge but no execution path |
| Latency | 0 | 62.9s (>60s) (62892ms) |
| Token Efficiency | 0 | 248k real tokens (real tokens: 247755) |
| Hallucination | 1 | Description of preflight semantics matches command spec; some output schema details inferred |
| **Total** | **3/10** | |

**Notable**: Codex did the right meta-analysis but couldn't execute. Token use surprisingly high for a parsing question.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Parsed the command structure and identified preflight subcommand + args; did NOT actually invoke (no command surface) |
| Tool Selection | 1 | Described what /memory:search preflight would do; correct routing knowledge but no execution path |
| Latency | 1 | 62.9s (60-300s band) (62892ms) |
| Hallucination | 1 | Description of preflight semantics matches command spec; some output schema details inferred |
| **Total** | **4/8** | |

**Δ from v1.0.0**: 3/10 → 4/8 (30% → 50%)

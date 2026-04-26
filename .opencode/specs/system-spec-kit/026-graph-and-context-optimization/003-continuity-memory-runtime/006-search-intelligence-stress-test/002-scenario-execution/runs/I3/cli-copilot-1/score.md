## Scenario I3 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Recognized /memory:search preflight syntax; explained subcommand structure |
| Tool Selection | 1 | Read command spec via grep + Read |
| Latency | 0 | 115.0s (>60s) (115039ms) |
| Token Efficiency | 0 | 945k real tokens (real tokens: 944700) |
| Hallucination | 1 | Spec citations correct; some flag descriptions paraphrased |
| **Total** | **3/10** | |

**Notable**: 945k tokens to parse a one-line command — copilot extreme token cost for I-tier specific.

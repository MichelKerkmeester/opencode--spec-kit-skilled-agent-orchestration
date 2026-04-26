## Scenario I1 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Recognized save intent and described action; did NOT route to /memory:save (no command surface available) |
| Tool Selection | 1 | External CLI has no /memory:save; codex described what would happen |
| Latency | 2 | 12.4s (<10s borderline → 1; rule says <10s=2, so 12s = 1) (12384ms) |
| Token Efficiency | 0 | 32k real tokens (real tokens: 31535) |
| Hallucination | 2 | Acknowledged no save tool; correct meta-answer |
| **Total** | **6/10** | |

**Notable**: Without spec-kit MCP, codex correctly refrains from inventing — answers about the contract, not from it.

## Scenario I2 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Identified 005-memory-search-runtime-bugs packet by name + path + summarized REQ list + spec.md §8 probes |
| Tool Selection | 2 | grep on 'search bug' + Read of 005 spec — found correct packet |
| Latency | 0 | 73.1s (>60s) (73063ms) |
| Token Efficiency | 0 | 170k real tokens (real tokens: 169854) |
| Hallucination | 2 | 005 packet verified to exist with cited REQs |
| **Total** | **6/10** | |

**Notable**: Best correctness on I2. Codex found the canonical packet without MCP advisor.

## Scenario I1 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Recognized /memory:save intent; correctly identified as planner-first contract; did not mutate per 004 contract |
| Tool Selection | 2 | MCP-aware: knows /memory:save exists and is planner-first by default |
| Latency | 1 | 23.2s (23199ms) |
| Token Efficiency | 0 | 40k real tokens (real tokens: 40059) |
| Hallucination | 2 | Stated planner-first default accurately |
| **Total** | **7/10** | |

**Notable**: Best of three. The MCP advantage is real for command-aware intent routing. Note: did NOT actually call /memory:save (no spec folder context); behaved correctly per planner-first contract.

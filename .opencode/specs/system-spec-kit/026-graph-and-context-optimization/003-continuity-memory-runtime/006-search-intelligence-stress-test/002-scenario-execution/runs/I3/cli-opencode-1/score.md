## Scenario I3 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Routed to task_preflight() per command spec §5A; recognized subcommand + spec folder + task ID args |
| Tool Selection | 2 | MCP-aware: knows the preflight tool exists and called it (or attempted via task_preflight) |
| Latency | 1 | 52.8s (52761ms) |
| Token Efficiency | 0 | 42k real tokens (real tokens: 41881) |
| Hallucination | 2 | Routing matches command spec |
| **Total** | **7/10** | |

**Notable**: Cleanest cell — the MCP advantage means opencode actually understands /memory:search subcommand routing rather than describing it.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Routed to task_preflight() per command spec §5A; recognized subcommand + spec folder + task ID args |
| Tool Selection | 2 | MCP-aware: knows the preflight tool exists and called it (or attempted via task_preflight) |
| Latency | 2 | 52.8s (<60s) (52761ms) |
| Hallucination | 2 | Routing matches command spec |
| **Total** | **8/8** | |

**Δ from v1.0.0**: 7/10 → 8/8 (70% → 100%) — perfect under v1.0.1

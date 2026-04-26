## Scenario S3 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Used MCP memory tools to find packet; cited decision-record.md content + spec.md cross-refs |
| Tool Selection | 2 | Routed via memory_context(specFolder filter) — exact intended tool path |
| Latency | 1 | 50.8s (50793ms) |
| Token Efficiency | 0 | 59k real tokens (real tokens: 59289) |
| Hallucination | 2 | All citations verified |
| **Total** | **7/10** | |

**Notable**: Only CLI to find decision-record.md (the canonical ADR ledger). MCP-aware spec navigation paid off.

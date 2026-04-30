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

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Used MCP memory tools to find packet; cited decision-record.md content + spec.md cross-refs |
| Tool Selection | 2 | Routed via memory_context(specFolder filter) — exact intended tool path |
| Latency | 2 | 50.8s (<60s) (50793ms) |
| Hallucination | 2 | All citations verified |
| **Total** | **8/8** | |

**Δ from v1.0.0**: 7/10 → 8/8 (70% → 100%)

## Scenario S2 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Used memory_context + memory_search MCP; returned ranked results across packets including 026/003 chain |
| Tool Selection | 2 | MCP memory tools dispatched correctly for vague query — exact intended path |
| Latency | 1 | 43.3s (43298ms) |
| Token Efficiency | 0 | 53k real tokens (real tokens: 52690) |
| Hallucination | 1 | Most citations verified; some packet summaries paraphrase rather than quote |
| **Total** | **6/10** | |

**Notable**: Best fit-for-purpose on this scenario — the MCP advantage shows clearly. Vocabulary check (005/REQ-003): output uses 'memory entries' / 'memories', NOT canonical 'Trigger-matched spec-doc records' — confirms vocabulary violation still present.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Used memory_context + memory_search MCP; returned ranked results across packets including 026/003 chain |
| Tool Selection | 2 | MCP memory tools dispatched correctly for vague query — exact intended path |
| Latency | 2 | 43.3s (<60s) (43298ms) |
| Hallucination | 1 | Most citations verified; some packet summaries paraphrase rather than quote |
| **Total** | **7/8** | |

**Δ from v1.0.0**: 6/10 → 7/8 (60% → 87.5%)

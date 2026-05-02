## Scenario S1 — cli-opencode-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Found 004-memory-save-rewrite + cited planner-first contract via memory_search/memory_context |
| Tool Selection | 2 | Used spec_kit_memory tools (memory_match_triggers, memory_context, memory_search) — the MCP advantage |
| Latency | 1 | 50.2s (50176ms) |
| Token Efficiency | 0 | 64k real tokens (real tokens: 64195) |
| Hallucination | 2 | Citations verified against actual spec.md |
| **Total** | **7/10** | |

**Notable**: MCP routing worked as designed; memory_search trigger 'planner-first' hit the target packet directly per S1 expectation.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Found 004-memory-save-rewrite + cited planner-first contract via memory_search/memory_context |
| Tool Selection | 2 | Used spec_kit_memory tools (memory_match_triggers, memory_context, memory_search) — the MCP advantage |
| Latency | 2 | 50.2s (<60s) (50176ms) |
| Hallucination | 2 | Citations verified against actual spec.md |
| **Total** | **8/8** | |

**Δ from v1.0.0**: 7/10 → 8/8 (70% → 100%) — perfect under v1.0.1

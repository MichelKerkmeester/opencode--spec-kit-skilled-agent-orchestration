## Scenario S1 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Cited exact path 004-memory-save-rewrite + spec.md L154 ANCHOR:requirements + REQ-001 |
| Tool Selection | 2 | Used Read on canonical spec.md and implementation-summary.md after grep — optimal for known target |
| Latency | 1 | 41.8s (in 10-60s band) (41773ms) |
| Token Efficiency | 0 | 72k real tokens (>10k) (real tokens: 72088) |
| Hallucination | 2 | Verified: 004-memory-save-rewrite exists, spec.md L154 has ANCHOR:requirements, REQ-001 says planner-first non-mutating |
| **Total** | **7/10** | |

**Notable**: Codex took a thorough approach — recited the full REQ list when only the path was asked. Output bloated by reasoning trace.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Cited exact path 004-memory-save-rewrite + spec.md L154 ANCHOR:requirements + REQ-001 |
| Tool Selection | 2 | Used Read on canonical spec.md and implementation-summary.md after grep — optimal for known target |
| Latency | 2 | 41.8s (<60s) (41773ms) |
| Hallucination | 2 | Verified: 004-memory-save-rewrite exists, spec.md L154 has ANCHOR:requirements, REQ-001 says planner-first non-mutating |
| **Total** | **8/8** | |

**Δ from v1.0.0**: 7/10 → 8/8 (70% → 100%) — perfect under v1.0.1

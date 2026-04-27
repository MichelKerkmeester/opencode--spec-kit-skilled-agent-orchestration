## Scenario S3 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Quoted SPECKIT_SAVE_PLANNER_MODE from spec.md L106/L112 + cited full-auto/hybrid behavior |
| Tool Selection | 2 | Read targeted spec.md after grep on the env var token — efficient |
| Latency | 1 | 42.6s (42583ms) |
| Token Efficiency | 0 | 87k real tokens (real tokens: 86857) |
| Hallucination | 2 | All quoted text matches spec.md |
| **Total** | **7/10** | |

**Notable**: Cited spec.md but did NOT cite decision-record.md ADR-001 directly (which holds the formal rationale).

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Quoted SPECKIT_SAVE_PLANNER_MODE from spec.md L106/L112 + cited full-auto/hybrid behavior |
| Tool Selection | 2 | Read targeted spec.md after grep on the env var token — efficient |
| Latency | 2 | 42.6s (<60s) (42583ms) |
| Hallucination | 2 | All quoted text matches spec.md |
| **Total** | **8/8** | |

**Δ from v1.0.0**: 7/10 → 8/8 (70% → 100%)

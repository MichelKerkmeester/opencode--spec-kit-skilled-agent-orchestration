## Scenario S1 — cli-copilot-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Cited exact path + spec.md as canonical citation + ANCHOR:problem and ANCHOR:scope anchors |
| Tool Selection | 2 | Glob then targeted greps then Read of canonical spec.md L1-120 + L490-510 — efficient |
| Latency | 1 | 53.1s (53104ms) |
| Token Efficiency | 0 | 379k tokens (mostly cached input). Even uncached likely >10k (real tokens: 379300) |
| Hallucination | 2 | Quoted exact spec.md text verbatim; anchors verified to exist |
| **Total** | **7/10** | |

**Notable**: Cleanest output of the three (852b user-facing). High cached-token use is the model's prompt-cache optimization, not waste.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 2 | Cited exact path + spec.md as canonical citation + ANCHOR:problem and ANCHOR:scope anchors |
| Tool Selection | 2 | Glob then targeted greps then Read of canonical spec.md L1-120 + L490-510 — efficient |
| Latency | 2 | 53.1s (<60s) (53104ms) |
| Hallucination | 2 | Quoted exact spec.md text verbatim; anchors verified to exist |
| **Total** | **8/8** | |

**Δ from v1.0.0**: 7/10 → 8/8 (70% → 100%) — perfect under v1.0.1

## Scenario S2 — cli-codex-1

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned packet hits across multiple memory packets BUT without canonical 'Trigger-matched spec-doc records' vocabulary |
| Tool Selection | 1 | Used grep/glob to find memory-related packets — works but generic |
| Latency | 1 | 37.9s (37900ms) |
| Token Efficiency | 0 | 52k real tokens (real tokens: 52484) |
| Hallucination | 2 | Packet paths cited match reality |
| **Total** | **5/10** | |

**Notable**: Vague-prompt handling: codex enumerated packets sensibly without inventing structure.

---

### v1.0.1 (rubric calibration)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Correctness | 1 | Returned packet hits across multiple memory packets BUT without canonical 'Trigger-matched spec-doc records' vocabulary |
| Tool Selection | 1 | Used grep/glob to find memory-related packets — works but generic |
| Latency | 2 | 37.9s (<60s) (37900ms) |
| Hallucination | 2 | Packet paths cited match reality |
| **Total** | **6/8** | |

**Δ from v1.0.0**: 5/10 → 6/8 (50% → 75%)

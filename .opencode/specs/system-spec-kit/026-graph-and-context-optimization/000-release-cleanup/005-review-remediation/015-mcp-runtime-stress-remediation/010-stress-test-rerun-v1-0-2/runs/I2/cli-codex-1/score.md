# Cell I2 / cli-codex-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Recommends starting with packets 009 (response-policy) + 010 (current measurement) — both correct. Cites 4 core files (`search-results.ts:273`, `recovery-payload.ts:324`, `confidence-scoring.ts:293`, `memory-search.ts:613`) and 3 cocoindex paths. Honest self-flag: "Memory MCP calls were cancelled, so I could not observe `requestQuality.label`". |
| 2 Tool Selection | 1 | `memory_search` MCP attempted but cancelled — fell back to local `rg`. Locally optimal but not canonical. |
| 3 Latency | 1 | 102.1s — falls in 60-300s band. |
| 4 Hallucination | 2 | All 7 file:line citations verifiable on disk. Self-flagged uncertainty about MCP-side telemetry. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions (REQ-009/REQ-011)

- `memory_search` cancelled — `requestQuality.label`, `recovery.status`, `responsePolicy.noCanonicalPathClaims` not observed.
- Self-flag IS the right posture: "I would not treat that as evidence of the weak-result behavior itself."

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 6/10 → ~6/8
- **v1.0.2 score**: 6/8
- **Delta**: 0
- **Classification**: **NEUTRAL-CEILING** — codex held steady at high-quality v1.0.1 ceiling.

## Narrative

cli-codex I2 routed correctly to packet 009 + the response-policy contract files even without MCP-side telemetry. Output 3MB (codex reasoning trace), 102s latency.

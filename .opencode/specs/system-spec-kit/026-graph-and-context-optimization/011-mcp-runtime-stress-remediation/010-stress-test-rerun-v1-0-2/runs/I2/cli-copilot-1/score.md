# Cell I2 / cli-copilot-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | **Reads observed telemetry directly**: "your probe did not return the shape you expected: the runtime produced `requestQuality.label='gap'` and `recovery.suggestedQueries=['the {nonexistent-marker-2026-04-27-v1.0.2} debugging']`, not `weak` + empty suggestions." Recommends 4 +6 files for the two distinct pathways (response-policy bug vs upstream retrieval bug). Most thorough I2 answer. |
| 2 Tool Selection | 2 | Canonical MCP routing — `memory_search` invoked, telemetry parsed, broadened to file reads. |
| 3 Latency | 1 | 210.6s — falls in 60-300s band, near upper bound. |
| 4 Hallucination | 2 | All 10 file paths verifiable. The cited telemetry shapes (`requestQuality.label="gap"`, `recovery.suggestedQueries=...`) exactly match packet 009's REQ-001..004 contract. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-009/REQ-011) — **PROVEN**

- `memory_search` returned `requestQuality.label:"gap"` (the v1.0.1 weak-quality trigger that produced opencode's catastrophic hallucination) — and copilot **honored the gap signal cleanly**, broadening to file reads instead of fabricating.
- The response-policy contract (`responsePolicy.noCanonicalPathClaims:true` model-side behavior) **PROVEN** at the model boundary for cli-copilot.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 5/10 → ~5/8
- **v1.0.2 score**: 7/8
- **Delta**: +2
- **Classification**: **WIN** — driven by the model reading observed telemetry and reasoning from it, plus dual-pathway recommendation framing.

## Narrative

cli-copilot I2 is the strongest single piece of v1.0.2 evidence for **packet 009's response-policy contract reaching the model layer**. The model literally cited the `requestQuality.label="gap"` field and `recovery.suggestedQueries` content from the telemetry it received, then reasoned about which file generates each. This is the contract working end-to-end.

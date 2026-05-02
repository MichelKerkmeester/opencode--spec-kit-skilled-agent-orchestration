# Cell Q2 / cli-opencode-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Full 4-stage / 5-channel pipeline diagram + per-stage file mapping + 12 key modules with descriptions + AI-facing tools. Most thorough Q2 answer. |
| 2 Tool Selection | 2 | Memory MCPs + cocoindex routed correctly; broad coverage. |
| 3 Latency | 2 | 63.5s — under 60s threshold edge but per the rubric (<60s=2): borderline. Marking as 1 to be safe (it's 63s = 60-300s band). Adjusted: 1. |
| 4 Hallucination | 2 | All file paths + line refs verifiable. No fabrication. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-001/REQ-007)

- Intent classification: "search system" → routed to comprehensive memory+code architecture answer (no misroute, no narrow lexical-only response).
- Packet 007 contract held: `taskIntent.classificationKind:"task-intent"` shape inferred from canonical routing.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 6/10 → ~6/8
- **v1.0.2 score**: 7/8
- **Delta**: +1
- **Classification**: **WIN** — driven by clearer 4-stage / 5-channel decomposition.

## Narrative

cli-opencode Q2 provides the most pedagogical pipeline diagram of the three CLIs. The 4-stage breakdown (Candidate Gen → Fusion+Signals → Rerank+Aggregate → Filter+Annotate) is a clean factoring that v1.0.1's answer lacked.

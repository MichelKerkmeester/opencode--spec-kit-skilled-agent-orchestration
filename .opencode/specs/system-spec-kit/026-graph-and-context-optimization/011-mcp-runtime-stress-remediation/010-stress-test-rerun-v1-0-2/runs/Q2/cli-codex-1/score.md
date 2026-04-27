# Cell Q2 / cli-codex-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Layered architecture explanation: memory_context (L1 router), memory_search (4-stage pipeline), memory_match_triggers (trigger-phrase fast path), CocoIndex+code_graph (code search). Cites canonical files for each surface. |
| 2 Tool Selection | 1 | Memory MCP calls cancelled per logs ("Read-only pass"); fell back to local `rg` + Read. Locally optimal for codex; missed canonical MCP routing. |
| 3 Latency | 1 | 67.2s — falls in 60-300s band. |
| 4 Hallucination | 2 | All file:line citations verifiable. No fabrication. The "search is layered, not a single tool" framing is accurate. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions (REQ-001/REQ-007)

- Intent classification: not directly observable from codex (no MCP); however, codex correctly inferred the layered structure from grep results.
- "search system" did NOT misroute — the answer is structurally correct.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 5/10 → ~5/8
- **v1.0.2 score**: 6/8
- **Delta**: +1
- **Classification**: **WIN** — driven by clearer layered framing in the final synthesis.

## Narrative

cli-codex Q2 produces the most pedagogical Q2 answer — explicit "this repo treats search as a layered retrieval stack, not one tool" framing. 67s latency, clear citations.

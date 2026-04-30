# Cell Q1 / cli-codex-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Identified the only true caller (`handleTool` in `tools/context-tools.ts:14`) plus 8 runtime references with named functions + file:line. Distinguishes "callers" from "runtime surfaces that recommend it" — exactly the right framing. |
| 2 Tool Selection | 1 | Used `rg` + Read; attempted `code_graph_query` MCP but cancelled (codex read-only / MCP locked). Locally optimal; not the scenario's target tools. |
| 3 Latency | 1 | 77.2s — falls in 60-300s band. |
| 4 Hallucination | 2 | All 9 file:line refs verifiable. No fabrication. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions (REQ-005)

- `code_graph_query` was attempted but cancelled — no `fallbackDecision` field captured.
- Codex's local `rg` fallback is the expected recovery path.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 6/10 → ~6/8
- **v1.0.2 score**: 6/8
- **Delta**: 0
- **Classification**: **NEUTRAL-CEILING** — codex was the v1.0.1 winner on Q1; held steady at high quality.

## Narrative

cli-codex Q1 enumerates `memory_context` callers correctly and resists overcounting (key distinction: only `handleTool` is a true caller; everything else is recommendation surface). 77s latency, output 1.17MB.

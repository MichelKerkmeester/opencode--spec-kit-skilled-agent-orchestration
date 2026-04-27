# Cell Q1 / cli-opencode-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returned a structured 7-row table: each row names function + file + line + role. Identifies the dispatch chain (`Anonymous handler → dispatchTool() → handleTool() → handleMemoryContext()`) correctly. |
| 2 Tool Selection | 2 | Used grep + Read in MCP-mediated routing; coverage matches scenario expectation. |
| 3 Latency | 1 | 155.7s — falls in 60-300s band. |
| 4 Hallucination | 2 | All 7 rows verifiable on disk. No fabrication. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-005)

- This cell did not invoke `code_graph_query` either; packet 005 contract not exercised. The graph was healthy after pre-flight recovery, so no `fallbackDecision` was needed.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 4/10 → ~4/8
- **v1.0.2 score**: 7/8
- **Delta**: +3
- **Classification**: **WIN** — biggest single-cell delta in Q-block; driven by structured-table format + correct dispatch chain identification.

## Narrative

cli-opencode Q1 is the strongest Q1 answer overall — the 7-row table format makes the dispatch chain instantly readable. v1.0.1 had opencode at 4/10 with sparse-graph fallback churn; v1.0.2's healthy graph plus better synthesis flips this to a clear win.

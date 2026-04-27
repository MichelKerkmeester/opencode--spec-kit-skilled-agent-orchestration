# Cell Q2 / cli-copilot-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Identifies main runtime entrypoint (`handleMemorySearch` at memory-search.ts:613), 5 channels (vector, fts, bm25, graph, degree), fusion via RRF, 3-tier fallback ending in SQL structural fallback, plus public API surface + routing rules from gate-tool-routing.md. |
| 2 Tool Selection | 1 | Heavy on grep + Read; some glob; no `cocoindex_code_search` or `memory_search` MCP invoked. Suboptimal vs scenario expectation. |
| 3 Latency | 1 | 143.9s — falls in 60-300s band. |
| 4 Hallucination | 2 | All file:line citations verifiable. No fabrication. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions (REQ-001/REQ-007)

- Intent classification not exercised at the MCP layer (no memory_search call). Cell read constitutional rules from `gate-tool-routing.md`.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 5/10 → ~5/8
- **v1.0.2 score**: 6/8
- **Delta**: +1
- **Classification**: **WIN** — comprehensive runtime map with correct line citations.

## Narrative

cli-copilot Q2 reads many files (changelog-024-009, 020, 012; spec.md; search-weights.json; gate-tool-routing.md; memory-search.ts; hybrid-search.ts) to build a runtime-architecture map. Output 7.5KB, 144s latency.

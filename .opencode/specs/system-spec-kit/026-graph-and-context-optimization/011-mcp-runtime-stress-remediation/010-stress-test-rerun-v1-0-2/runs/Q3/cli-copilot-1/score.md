# Cell Q3 / cli-copilot-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Builds runtime-paths table covering memory-context.ts, code-graph/lib/{compact-merger,code-graph-context}, hooks/memory-surface.ts, lib/search/hybrid-search.ts, hooks/{claude,gemini,codex,copilot}/* — comprehensive enforcement-path map. |
| 2 Tool Selection | 1 | Heavy grep + Read; no `cocoindex_code_search` or `memory_search` MCP invoked. Suboptimal vs scenario expectation. |
| 3 Latency | 1 | 205.6s — falls in 60-300s band, near upper bound. |
| 4 Hallucination | 2 | All file:line citations verifiable. No fabrication. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions (REQ-002)

- The cell finds `enforceTokenBudget` at the canonical location (handlers/memory-context.ts:463) — the 005/REQ-002 truncation contract.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 3/10 → ~3/8
- **v1.0.2 score**: 6/8
- **Delta**: +3
- **Classification**: **WIN** — biggest delta in the Q-block; full recovery from v1.0.1's truncation/incomplete state.

## Narrative

cli-copilot Q3 is the recovery story of the Q-block — v1.0.1 was 3/10 truncated, v1.0.2 reaches comprehensive coverage with table format + correct citations. 205s latency reflects the broad file-reading approach.

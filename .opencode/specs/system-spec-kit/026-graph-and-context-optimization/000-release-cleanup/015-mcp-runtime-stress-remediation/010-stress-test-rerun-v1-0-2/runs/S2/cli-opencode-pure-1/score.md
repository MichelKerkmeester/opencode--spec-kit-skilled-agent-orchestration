# Cell S2 / cli-opencode-pure-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns canonical disambiguation (Spec Kit Memory ≠ Claude Memory ≠ reference MCP), 4 commands, code locations, 3 active specs. Concise + accurate. |
| 2 Tool Selection | 2 | `memory_match_triggers` MCP + `cocoindex_code_search` — full fork stack runs even with plugins disabled. |
| 3 Latency | 2 | 45.5s — under 60s. |
| 4 Hallucination | 2 | All paths verified. No fabrication. |
| **Total** | **8/8** | |

## Fork-Telemetry Assertions (REQ-008)

- `cocoindex_code_search` returned `dedupedAliases:26`, `uniqueResultCount:10`, `path_class` populated — packet 004 fork active under --pure mode.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 5/10 → ~5/8
- **v1.0.2 score**: 8/8
- **Delta**: +3
- **Classification**: **WIN** — biggest single-cell delta in the S-block; driven by tool routing fix + disambiguation framing.

## Narrative

Pure ablation cell that out-performs v1.0.1's full opencode-1. Notably explicit "not Claude Memory and not reference MCP" disambiguation matches the canonical vocabulary. Output 21KB, latency 45s, no errors.

# Cell S2 / cli-codex-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | "Find stuff about memory" returns a structured set of canonical entry points (memory_system.md, save_workflow.md, trigger_config.md, memory-tools.ts) with line numbers. Diverse + accurate. Outperforms expectation ("5-10 ranked diverse results"). |
| 2 Tool Selection | 1 | Used grep + Read again. cli-codex has no MCP, so this is locally optimal but the scenario expected `memory_context` + cocoindex hybrid — N-A for cli-codex. |
| 3 Latency | 1 | 60.2s — just over 60s, lands in the 60-300s band. |
| 4 Hallucination | 2 | All file paths + line refs verifiable. Self-flagged a caveat ("attempted MCP lookup, cancelled — based on local repo evidence") — explicit uncertainty, no fabrication. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions

- N-A across the board — cli-codex did not invoke any MCP tools.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 5/10 → ~5/8 under v1.0.1 rubric
- **v1.0.2 score**: 6/8
- **Delta**: +1
- **Classification**: **WIN** — small improvement (likely better grep coverage of the post-cleanup memory docs landscape; cli-codex isn't the differentiator on S2 anyway).

## Narrative

cli-codex S2 finds the current canonical memory docs (memory_system.md is the right entry point) and structures the response around real files. Token output 1.21 MB (typical codex bloat). The vocabulary still uses "memory entries"/"Spec Kit Memory" rather than the canonical "Trigger-matched spec-doc records" — REQ-003 vocabulary violation persists, same as v1.0.1.

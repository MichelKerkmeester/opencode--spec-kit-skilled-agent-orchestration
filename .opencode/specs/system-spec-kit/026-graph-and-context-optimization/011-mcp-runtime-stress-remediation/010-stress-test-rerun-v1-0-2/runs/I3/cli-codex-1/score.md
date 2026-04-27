# Cell I3 / cli-codex-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 1 | "Preflight did not run: the MCP `task_preflight` call was cancelled." Provided ESTIMATED baseline values: K:25, U:70, C:20. Correct interpretation of the command but couldn't execute the canonical MCP route. |
| 2 Tool Selection | 1 | `task_preflight` cancelled — fell back to estimation. |
| 3 Latency | 2 | 34.4s — under 60s. |
| 4 Hallucination | 2 | Self-flagged "Preflight did not run" + estimated values clearly labeled. No false claim of execution. |
| **Total** | **6/8** | |

## Fork-Telemetry Assertions (REQ-007)

- `task_preflight` not exercised (MCP cancelled).
- Cell did NOT misroute — correctly identified the canonical command target.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 3/10 → ~3/8
- **v1.0.2 score**: 6/8
- **Delta**: +3
- **Classification**: **WIN** — significant improvement from v1.0.1's "described what would happen" baseline; v1.0.2 attempted the actual MCP call and self-flagged when it failed.

## Narrative

cli-codex I3 has the right pattern (attempt MCP → flag failure → provide estimate) even though the MCP wasn't reachable in this dispatch session. Output 147KB, 34s latency.

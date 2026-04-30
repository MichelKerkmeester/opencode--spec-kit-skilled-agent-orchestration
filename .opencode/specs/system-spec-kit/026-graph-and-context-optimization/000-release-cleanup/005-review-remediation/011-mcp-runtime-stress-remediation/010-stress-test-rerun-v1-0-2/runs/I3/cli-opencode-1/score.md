# Cell I3 / cli-opencode-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Ran `task_preflight` cleanly, returned compact table: K:75, U:15, C:85, record_id:4. Self-flagged knowledge gap honestly. |
| 2 Tool Selection | 2 | Canonical MCP routing: `task_preflight()` direct invocation. |
| 3 Latency | 1 | 143.2s — falls in 60-300s band. |
| 4 Hallucination | 2 | Record ID + scores match preflight payload; no fabrication. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-007)

- `task_preflight` returned canonical fields with intent telemetry intact.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 7/10 → ~7/8
- **v1.0.2 score**: 7/8
- **Delta**: 0
- **Classification**: **NEUTRAL-CEILING** — opencode was already at high quality on I3 v1.0.1; held steady.

## Narrative

I3/opencode confirms the v1.0.1 baseline holds — same canonical MCP routing, similar response shape, ~143s latency. Compact record retrieval per scenario expectation.

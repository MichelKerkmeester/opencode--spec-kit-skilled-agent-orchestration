# Cell I3 / cli-copilot-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Correctly resolved shorthand `specs/026/003/005` → `system-spec-kit/026-graph-and-context-optimization/003-continuity-memory-runtime/005-memory-search-runtime-bugs`, ran `task_preflight` with full packet context, recorded baseline as record #3. K:74, U:29, C:71 — well-grounded values reflecting prior context. |
| 2 Tool Selection | 2 | Canonical MCP routing: `task_preflight()` invoked exactly as scenario expected. |
| 3 Latency | 1 | 150.5s — falls in 60-300s band. |
| 4 Hallucination | 2 | All packet paths + record_id verifiable. No fabrication. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-007)

- `task_preflight` returned full preflight payload with knowledge/uncertainty/context scores, gaps, session_id.
- Intent classification: "preflight" command → routed to `task_preflight` tool — exactly the scenario's "Target tools" expectation.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 3/10 → ~3/8
- **v1.0.2 score**: 7/8
- **Delta**: +4
- **Classification**: **WIN** — biggest single-cell delta in the I-block; full recovery from v1.0.1's "described what would happen" pattern.

## Narrative

cli-copilot I3 is the cleanest evidence that command shorthand parsing + canonical MCP routing works end-to-end. v1.0.1 copilot just narrated the command; v1.0.2 executes it correctly. Output 4.3KB, 150s.

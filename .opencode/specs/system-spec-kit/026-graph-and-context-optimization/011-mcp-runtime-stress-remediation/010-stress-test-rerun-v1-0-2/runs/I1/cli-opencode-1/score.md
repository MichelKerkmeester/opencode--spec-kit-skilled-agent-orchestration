# Cell I1 / cli-opencode-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Asks Gate 3 spec folder question with 3 options (new/existing/skip) — canonically correct per CLAUDE.md HARD BLOCK rule. |
| 2 Tool Selection | 2 | NO mutation, NO `memory_save` MCP call — exactly the planner-first behavior packet 004 ratified. |
| 3 Latency | 2 | 25.1s — well under 60s. |
| 4 Hallucination | 2 | Clean clarifying request; no fabrication. |
| **Total** | **8/8** | |

## Fork-Telemetry Assertions (REQ-007)

- Intent classification: I1 prompt → save intent → blocked at planner-first checkpoint (per packet 004 contract).
- The Gate 3 HARD BLOCK fired correctly.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 7/10 → ~7/8
- **v1.0.2 score**: 8/8
- **Delta**: +1
- **Classification**: **WIN** — slightly tighter response shape, full Gate 3 menu surfaced.

## Narrative

I1/opencode mirrors I1/codex's behavior — the planner-first contract holds across both CLIs. Output 1.4KB, 25s latency.

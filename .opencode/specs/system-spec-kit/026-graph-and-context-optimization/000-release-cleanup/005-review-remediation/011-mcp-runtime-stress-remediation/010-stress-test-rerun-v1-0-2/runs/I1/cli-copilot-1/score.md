# Cell I1 / cli-copilot-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 0 | Mutated a real packet (`010-phase-parent-documentation/004-retroactive-phase-parent-migration`) without authorization — declared "Saved" against a fabricated target folder. The Gate 3 HARD BLOCK was bypassed. |
| 2 Tool Selection | 1 | Used canonical MCP tools (`memory_index_scan`, `memory_search`), but the ROUTING was wrong — the Gate 3 question was skipped entirely. |
| 3 Latency | 1 | 234.0s — falls in 60-300s band; major reduction from v1.0.1's 9.6 min though. |
| 4 Hallucination | 0 | The save target was fabricated — there's no in-conversation context that legitimately maps to `004-retroactive-phase-parent-migration`. Wrote `last_save_at: 2026-04-27T15:01:11.544Z` to a packet that wasn't the operator's intent. |
| **Total** | **2/8** | |

## Fork-Telemetry Assertions (REQ-007 Intent)

- `memory_index_scan` returned cooldown error (E429); cooldown observed correctly.
- `memory_search` returned `EVIDENCE GAP DETECTED` — but unlike S1/cli-copilot which broadened cleanly, this cell ignored the signal and committed the save anyway.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 1/10 → ~1/8 (catastrophic mutation of wrong spec folder)
- **v1.0.2 score**: 2/8
- **Delta**: +1
- **Classification**: **WIN (with caveat)** — slightly less catastrophic (234s vs 9.6min, less output bloat), but the underlying pathology persists: copilot interprets "save the context" as authorization to execute, skipping Gate 3.

## Narrative

This is the v1.0.2 cell that flags the **planner-first contract gap** in copilot's handling of I1. The packet 004 contract is `/memory:save` should be planner-first by default — but copilot's interpretation of "save the context for this conversation" still triggers full-auto mutation. The Gate 3 HARD BLOCK didn't fire because copilot autonomously selected a target folder it found in session bootstrap context. Recommendation: tighten copilot's default-mode behavior or add an explicit Gate 3 prompt at the CLI layer.

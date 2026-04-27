# Cell S3 / cli-copilot-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns full decision table: planner-first default + full-auto fallback + hybrid reserved, with rationale + source anchors per ADR-002. Most structured S3 answer. |
| 2 Tool Selection | 2 | `memory_match_triggers` MCP + grep + glob + targeted Read of `decision-record.md` + `spec.md` + `implementation-summary.md` — full layered routing. |
| 3 Latency | 1 | 80s — falls in 60-300s band. |
| 4 Hallucination | 2 | Anchor names + line ranges + ADR text all verifiable. No fabrication. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions

- `memory_match_triggers` returned trigger-phrase matches; cocoindex not invoked in this cell.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 6/10 → ~6/8
- **v1.0.2 score**: 7/8
- **Delta**: +1
- **Classification**: **WIN** — better correctness (3-row decision table including hybrid reserved) + MCP routing.

## Narrative

cli-copilot S3 found `decision-record.md` ADR-002 (anchor `adr-001`), reads spec/plan/impl-summary in parallel, returns a clean comparison table. Output 8KB, 80s latency. Notable: explicitly cites "hybrid is reserved currently behaves like plan-only" (the documentation-honesty point) — v1.0.1 missed this dimension.

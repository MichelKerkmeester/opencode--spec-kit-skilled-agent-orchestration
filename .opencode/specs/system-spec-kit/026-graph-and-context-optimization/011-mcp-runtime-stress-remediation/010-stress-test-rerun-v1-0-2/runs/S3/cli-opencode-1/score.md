# Cell S3 / cli-opencode-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns ADR-002 with 5 anchored citations: spec.md:60, decision-record.md:91 (anchor `adr-001`), spec.md:106 (`scope`), spec.md:112, spec.md:496. Comprehensive. |
| 2 Tool Selection | 2 | MCP routing canonical (memory tools + cocoindex fork). |
| 3 Latency | 1 | 63.6s — falls in 60-300s band, just over threshold. |
| 4 Hallucination | 2 | All 5 anchors + line refs verifiable. ADR-002 quote matches `decision-record.md` verbatim. No fabrication. |
| **Total** | **7/8** | |

## Fork-Telemetry Assertions (REQ-008)

- cocoindex telemetry not exercised in this cell (memory MCP handled it).

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 7/10 → ~7/8
- **v1.0.2 score**: 7/8
- **Delta**: 0
- **Classification**: **NEUTRAL-CEILING** — opencode was already at high quality on S3 v1.0.1; held steady.

## Narrative

cli-opencode S3 anchors the ADR with 5 specific line-citations. Output 116KB, 63s latency (just over the under-60s line, hence Latency=1).

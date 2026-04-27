# Cell S3 / cli-opencode-pure-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns ADR-002 with full structure: rationale + decision + consequences + rejected alternatives + supporting context from spec.md + plan.md architecture. Most thorough S3 answer of any CLI. |
| 2 Tool Selection | 2 | MCP routing under --pure works correctly. |
| 3 Latency | 2 | 54.7s — under 60s. |
| 4 Hallucination | 2 | All anchors (`adr-001`, `architecture`), line numbers (91-137, 56-73), and quote text verifiable. No fabrication. |
| **Total** | **8/8** | |

## Fork-Telemetry Assertions

- Pure mode arm: confirms MCP routing survives plugin disablement.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 5/10 → ~5/8
- **v1.0.2 score**: 8/8
- **Delta**: +3
- **Classification**: **WIN** — biggest single-cell delta among S3 cells; full ADR ledger structure with rejected alternatives surfaced.

## Narrative

S3/cli-opencode-pure-1 is the strongest S3 answer overall — comprehensive ADR-002 reproduction including rejected alternatives ("Keep full-auto as default → preserved unnecessary hot-path cost"). Output 128KB, 54s. The pure ablation outperformed the plugin-enabled cell, suggesting the fork's MCP path is robust.

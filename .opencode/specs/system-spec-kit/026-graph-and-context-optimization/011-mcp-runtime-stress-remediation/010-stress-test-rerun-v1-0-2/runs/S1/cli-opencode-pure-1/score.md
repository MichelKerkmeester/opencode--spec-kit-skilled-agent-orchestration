# Cell S1 / cli-opencode-pure-1 — Score (v1.0.2)

| Dim | Score | Evidence |
|-----|-------|----------|
| 1 Correctness | 2 | Returns canonical path `.../004-memory-save-rewrite/` with `plan.md` cited; ADR-002 anchored. Matches expected outcome. |
| 2 Tool Selection | 2 | Used `spec_kit_memory_memory_search` MCP + grep — correct routing even with plugins disabled (--pure). |
| 3 Latency | 2 | 41s — under 60s threshold. |
| 4 Hallucination | 2 | Path resolves on disk; ADR cited verbatim. No fabrication. |
| **Total** | **8/8** | |

## Fork-Telemetry Assertions (REQ-008/REQ-011)

- `memory_search` invoked correctly under --pure mode; no fork-specific assertions captured but tool routing was canonical.
- Pure ablation arm: confirms MCP + telemetry path survives plugin disablement.

## Delta vs v1.0.1 Baseline

- **v1.0.1 baseline**: 6/10 → ~6/8
- **v1.0.2 score**: 8/8
- **Delta**: +2
- **Classification**: **WIN** — pure ablation cost shrank vs v1.0.1; tool routing is now optimal even without plugins.

## Narrative

S1/cli-opencode-pure-1 is a +2 WIN — the largest improvement among S-cells for this CLI. Driven by `memory_search` MCP being correctly invoked under --pure mode (v1.0.1 had a routing penalty here). 41s latency, clean answer with anchored ADR.

# Deep Research Dashboard — 013-code-graph-hook-improvements

## Overview
- Iterations completed: 10 of 10
- Convergence status: converging, not early-stopped
- New-info trend: `0.62 -> 0.47 -> 0.39 -> 0.31 -> 0.24 -> 0.18 -> 0.14 -> 0.10 -> 0.07 -> 0.06`
- Dominant buckets: correctness, freshness, context-contract drift, startup transport

## Findings Count
- P0: 1
- P1: 3
- P2: 2

## Highest-Risk Items
- `F-001` — subtree-root `code_graph_scan` can delete out-of-scope graph rows and still leave the graph looking healthy.
- `F-002` — readiness debounce survives successful manual scans because there is no invalidation hook.
- `F-003` — `code_graph_context` still ships a split freshness/provenance contract alongside the shared readiness block.

## Recommended Next Action
- Create a follow-up implementation packet that tackles correctness/freshness first: guard scoped scans, add readiness-cache invalidation, and unify `code_graph_context` with the shared readiness contract before touching runtime startup transport polish.

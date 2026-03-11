# BM25-only baseline

## Current Reality

Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) runs behind the `ENABLE_BM25` flag (default ON, set `ENABLE_BM25=false` to disable).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/bm25-baseline.ts` | Lib | BM25-only baseline evaluation |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/bm25-baseline.vitest.ts` | BM25 baseline evaluation |
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |
| `mcp_server/tests/ground-truth.vitest.ts` | Ground truth tests |

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: BM25-only baseline
- Current reality source: feature_catalog.md

## Playbook Coverage

- Mapped to evaluation playbook scenarios NEW-050 through NEW-072 (phase-level)

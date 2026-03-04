# BM25-only baseline

## Current Reality

Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) runs behind the `ENABLE_BM25` flag (default ON, set `ENABLE_BM25=false` to disable).

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: BM25-only baseline
- Summary match found: Yes
- Summary source feature title: BM25-only baseline
- Current reality source: feature_catalog.md

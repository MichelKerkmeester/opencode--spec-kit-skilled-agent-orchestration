# Edge density measurement

## Current Reality

A SQL query computes the edges-per-node ratio from the `causal_edges` table. This number determines how much graph signal the system can extract. If density falls below 0.5, the system flags an escalation decision for auto entity extraction (R10) in a future sprint. The R4 exit gate is density-conditional: when graph coverage is too thin, the gate evaluates R4 implementation correctness (unit tests, zero-return behavior) rather than demanding the +2% MRR@5 lift that would be unreasonable with a sparse graph. That conditional gating is a pragmatic design choice. No point holding a feature to a metric it cannot influence.

## Source Metadata

- Group: Graph signal activation
- Source feature title: Edge density measurement
- Summary match found: Yes
- Summary source feature title: Edge density measurement
- Current reality source: feature_catalog.md

# Co-activation fan-effect divisor

## Current Reality

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

The fix applies a `1 / sqrt(neighbor_count)` divisor that scales down score contributions from highly connected nodes. After the change, no single memory appears in more than 60% of co-activation results. The divisor includes proper bounds checks so there is no division-by-zero risk and output stays capped.

## Source Metadata

- Group: Bug fixes and data integrity
- Source feature title: Co-activation fan-effect divisor
- Summary match found: Yes
- Summary source feature title: Co-activation fan-effect divisor
- Current reality source: feature_catalog.md

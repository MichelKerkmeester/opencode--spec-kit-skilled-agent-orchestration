# Co-activation fan-effect divisor

## Current Reality

Hub memories with many connections dominated co-activation results no matter what you searched for. If a memory had 40 causal edges, it showed up everywhere.

A fan-effect divisor helper (`1 / sqrt(neighbor_count)`) exists in `co-activation.ts`, but Stage 2 hot-path boosting currently applies spread-activation scores directly via the configured co-activation strength multiplier. The guard logic remains in the helper path with bounded division behavior.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/co-activation.ts` | Lib | Co-activation spreading |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/co-activation.vitest.ts` | Co-activation spreading tests |

## Source Metadata

- Group: Bug fixes and data integrity
- Source feature title: Co-activation fan-effect divisor
- Current reality source: feature_catalog.md

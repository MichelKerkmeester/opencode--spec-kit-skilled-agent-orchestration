# Quality proxy formula

## Current Reality

Manual evaluation does not scale. You cannot hand-review every query across every sprint.

The quality proxy formula produces a single 0-1 score from four components: `avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs automatically on logged data and flags regressions without human review.

The weights were chosen to prioritize relevance over speed while still penalizing latency spikes. Correlation testing against the manual ground truth corpus confirmed the proxy tracks real quality well enough for regression detection.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-quality-proxy.ts` | Lib | Quality proxy formula |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/ceiling-quality.vitest.ts` | Ceiling and quality proxy formula tests |
| `mcp_server/tests/retrieval-telemetry.vitest.ts` | Quality proxy telemetry computation |

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Quality proxy formula
- Current reality source: feature_catalog.md

## Playbook Coverage

- Mapped to evaluation playbook scenarios NEW-050 through NEW-072 (phase-level)

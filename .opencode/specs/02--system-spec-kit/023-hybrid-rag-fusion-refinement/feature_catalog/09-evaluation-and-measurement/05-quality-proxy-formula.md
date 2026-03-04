# Quality proxy formula

## Current Reality

Manual evaluation does not scale. You cannot hand-review every query across every sprint.

The quality proxy formula produces a single 0-1 score from four components: `avgRelevance * 0.40 + topResult * 0.25 + countSaturation * 0.20 + latencyPenalty * 0.15`. It runs automatically on logged data and flags regressions without human review.

The weights were chosen to prioritize relevance over speed while still penalizing latency spikes. Correlation testing against the manual ground truth corpus confirmed the proxy tracks real quality well enough for regression detection.

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Quality proxy formula
- Summary match found: Yes
- Summary source feature title: Quality proxy formula
- Current reality source: feature_catalog.md

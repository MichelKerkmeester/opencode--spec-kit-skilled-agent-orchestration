# Math.max/min stack overflow elimination

## Current Reality

`Math.max(...array)` and `Math.min(...array)` push all elements onto the call stack, causing `RangeError` on arrays exceeding ~100K elements. Seven production files were converted from spread patterns to `reduce()`:

- `rsf-fusion.ts` — 6 instances (4 + 2)
- `causal-boost.ts` — 1 instance
- `evidence-gap-detector.ts` — 1 instance
- `prediction-error-gate.ts` — 2 instances
- `retrieval-telemetry.ts` — 1 instance
- `reporting-dashboard.ts` — 2 instances

Each replacement uses `scores.reduce((a, b) => Math.max(a, b), -Infinity)` with an `AI-WHY` comment explaining the safety rationale.

## Source Metadata

- Group: Multi-agent deep review remediation (Phase 018)
- Source feature title: Math.max/min stack overflow elimination
- Summary match found: Yes
- Summary source feature title: Math.max/min stack overflow elimination
- Current reality source: feature_catalog.md

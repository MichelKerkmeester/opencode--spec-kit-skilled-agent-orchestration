# Low Sample Benchmark Fixture

This fixture demonstrates the insufficient-state path for a short improvement session.

For Gate E continuity, this fixture remains supporting evidence only. Broader packet recovery still routes through `/spec_kit:resume`, then `handover.md`, `_memory.continuity`, and the remaining spec docs.

- `trade-off-trajectory.json` contains only 2 trajectory points, so `trade-off-detector.cjs` should return `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` when called with `minDataPoints: 3`.
- `benchmark-results.json` contains only 1 replay, so `benchmark-stability.cjs` should return `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` when called with `minReplayCount: 3`.
- `agent-improvement-state.jsonl` embeds both insufficient states in iteration records so `reduce-state.cjs` can surface `insufficientDataIterations` and `insufficientSampleIterations` in the generated registry.

Notes:

- The journal uses validator-accepted enum values from `improvement-journal.cjs`.
- The requested plateau stop is represented as `stopReason: "converged"` with a note because benchmark-plateau aliases are not accepted stop-reason enums.

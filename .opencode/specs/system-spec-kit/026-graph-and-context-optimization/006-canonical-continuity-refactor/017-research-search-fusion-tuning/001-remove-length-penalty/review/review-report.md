# Deep Review Report: 001-remove-length-penalty

### 2026-04-13 Three-Iteration Deep Review Sweep

| Field | Value |
|-------|-------|
| Verdict | PASS |
| Focus | Live reranker no-op behavior, cache residue, and packet/code parity |
| Iterations added | 3 |
| Active findings | 1 P2 |
| Release-blocking findings | 0 |

Current findings:
- [P2] The retired `applyLengthPenalty` flag still fragments reranker cache buckets and keeps an unnecessary clone path alive in `cross-encoder.ts`.

Recommendations:
- Keep the shipped behavior as-is for this phase.
- Schedule a small cleanup follow-on that removes the stale `lp` cache-key bit and the no-op `applyLengthPenalty()` branch together.

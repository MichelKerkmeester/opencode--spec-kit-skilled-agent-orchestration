# Shadow scoring and channel attribution

## Current Reality

Full A/B comparison infrastructure ran alternative scoring algorithms in parallel, logging results without affecting live ranking. The system computed detailed comparison metrics including Kendall tau rank correlation, per-result score deltas, and production-only versus shadow-only result sets. Channel attribution tagged each result with its source channels and computed Exclusive Contribution Rate per channel: how often each channel was the sole source for a result in the top-k window.

Ground truth expansion via implicit user selection tracking and an LLM-judge stub interface were included for future corpus growth.

Shadow scoring completed its evaluation purpose and has been fully removed. The `isShadowScoringEnabled()` function and shadow-scoring branches in `hybrid-search.ts` were deleted during Sprint 8 remediation. The `runShadowScoring` and `logShadowComparison` function bodies now return immediately (`return null` and `return false` respectively). The `SPECKIT_SHADOW_SCORING` flag remains as a no-op for backward compatibility. This shadow-scoring cleanup is independent from R11 learned-feedback safeguards, where `isInShadowPeriod()` remains active. Channel attribution logic remains active within the 4-stage pipeline.

---

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/channel-attribution.ts` | Lib | Channel attribution analysis |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/shadow-scoring.ts` | Lib | Shadow scoring system |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/channel.vitest.ts` | Channel general tests |
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/shadow-scoring.vitest.ts` | Shadow scoring tests |

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Shadow scoring and channel attribution
- Current reality source: feature_catalog.md

## Playbook Coverage

- Mapped to evaluation playbook scenarios NEW-050 through NEW-072 (phase-level)

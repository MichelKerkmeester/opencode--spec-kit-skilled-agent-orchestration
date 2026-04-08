# Benchmark Matrix

Packet `013` uses the frozen compact continuity wrapper corpus in `tests/warm-start-bundle-benchmark.vitest.ts.test.ts` and the bounded runner in `mcp_server/lib/eval/warm-start-variant-runner.ts`.

## Frozen Corpus

- `resume-structural-graph-ready`
- `implementation-follow-up`
- `verification-follow-up`
- `structural-scope-mismatch`

## Measured Totals

| Variant | Cost proxy | Pass proxy |
|---------|------------|------------|
| `baseline` | `64` | `28` |
| `R2_only` | `80` | `28` |
| `R3_only` | `68` | `28` |
| `R4_only` | `54` | `28` |
| `R2+R3+R4_combined` | `43` | `28` |

## Outcome

- Combined bundle dominance: `yes`
- Comparison rule: lower total cost with equal-or-better total pass count than baseline and each component-only variant
- Bundle status: remains conditional and default-off until this benchmark gate exists and continues to hold

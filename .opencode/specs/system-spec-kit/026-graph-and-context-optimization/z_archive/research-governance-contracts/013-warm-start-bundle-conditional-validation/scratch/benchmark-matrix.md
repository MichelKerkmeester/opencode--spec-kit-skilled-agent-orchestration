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
| `baseline` | `64` | `34/40` |
| `R2_only` | `80` | `34/40` |
| `R3_only` | `68` | `34/40` |
| `R4_only` | `54` | `35/40` |
| `R2+R3+R4_combined` | `43` | `38/40` |

## Rejection Scenario Check

`structural-scope-mismatch` is the falsifiability scenario for packet `013`: cached reuse is rejected, the live reference stays degraded (`memory_context_then_grep`), and the per-variant pass counts now diverge instead of staying constant.

| Variant | `structural-scope-mismatch` pass |
|---------|----------------------------------|
| `baseline` | `9/10` |
| `R2_only` | `9/10` |
| `R3_only` | `9/10` |
| `R4_only` | `8/10` |
| `R2+R3+R4_combined` | `8/10` |

## Outcome

- Combined bundle dominance: `yes`
- Comparison rule: lower total cost with equal-or-better total pass count than baseline and each component-only variant, using wrapper completeness plus cache acceptance, follow-up accuracy, and live-baseline parity
- Bundle status: remains conditional and default-off until this benchmark gate exists and continues to hold

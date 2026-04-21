# Iteration 007 - Robustness

## Scope

Audited CLI argument handling in the measurement harness:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts`

## Verification

- Git history checked: `d1a17353ee`, `9e982f366a`, `1146faeecc`
- Vitest: PASS, 2 files / 11 tests

## Findings

### F-006 - P2 - CLI limit parsing accepts NaN and negative values silently

Evidence:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:597`
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:755`

The CLI parses `--limit` with `Number(limitValue)` and `runMeasurement()` passes that into `slice(0, options.limit ?? undefined)`. `--limit abc` becomes `NaN`, and negative values are accepted. That can silently yield empty or truncated measurement reports rather than a clear usage error.

## Delta

New findings: 1 P2. Churn: 0.05.

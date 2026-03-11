# Observer effect mitigation

## Current Reality

Measurement infrastructure is implemented as fail-safe and best-effort rather than SLO-enforced runtime monitoring. The eval database and shadow-scoring helpers are designed so evaluation paths do not block production query flow, and shadow scoring write paths are disabled (`runShadowScoring` returns `null`, `logShadowComparison` returns `false`).

A formal p95 latency comparison (eval logging enabled vs disabled) and an automated ">10% overhead" alert are not implemented in the current code. Observer-effect control currently relies on fail-safe degradation and non-fatal handling in evaluation and observability paths.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |
| `mcp_server/lib/eval/shadow-scoring.ts` | Lib | Shadow scoring system |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
| `mcp_server/tests/scoring.vitest.ts` | General scoring tests |
| `mcp_server/tests/shadow-scoring.vitest.ts` | Shadow scoring tests |

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Observer effect mitigation
- Current reality source: feature_catalog.md

## Playbook Coverage

- Mapped to evaluation playbook scenarios NEW-050 through NEW-072 (phase-level)

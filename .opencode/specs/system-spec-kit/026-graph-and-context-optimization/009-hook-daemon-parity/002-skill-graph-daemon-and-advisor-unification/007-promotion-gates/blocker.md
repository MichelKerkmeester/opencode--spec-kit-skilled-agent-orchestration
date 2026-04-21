# 027/006 Blocker — Regression-Suite Gate Fails

## Status

Blocked on Promotion Gate 7. The promotion infrastructure and benches compile and the TypeScript suites pass, but the canonical Python regression gate required by the 027/006 contract does not currently pass.

## Blocking Command

```text
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

## Measured Result

```json
{
  "total_cases": 52,
  "passed_cases": 50,
  "failed_cases": 2,
  "p0_total": 12,
  "p0_passed": 10,
  "p0_pass_rate": 0.8333,
  "top1_accuracy": 0.9583,
  "command_bridge_fp_rate": 0.0,
  "overall_pass": false
}
```

The required gate is `P0 pass-rate = 1.0`, `failed cases = 0`, and `command-bridge FP <= 0.05`. The measured command-bridge FP rate is acceptable, but the P0 pass-rate and failed-case gates fail.

## Failed Cases

| Case | Expected | Actual |
| --- | --- | --- |
| `P0-CMD-002` | `command-spec-kit` command | `command-spec-kit-plan` command |
| `P0-CMD-003` | `command-memory-save` command | `system-spec-kit` skill |

Retrying with `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1` produced the same two failures.

## Passing Evidence Before Blocker

| Gate Surface | Result |
| --- | --- |
| Promotion vitest suite | `17 passed` |
| Advisor targeted vitest suite | `98 passed` |
| Typecheck | exit 0 |
| Build | exit 0 |
| Full corpus shadow bench | `161/200 = 80.5%`, `UNKNOWN=10`, `goldNoneFalseFire=8` |
| Stratified holdout bench | `31/40 = 77.5%` |
| Latency bench | `cacheHitP95Ms=6.474`, `uncachedP95Ms=11.901` |
| Safety bench | `regressionCount=0`, `goldNoneFalseFire=8` |

## Scope Constraint

The failing surface is under `.opencode/skill/skill-advisor/scripts/**` and its fixture expectations. The 027/006 authority block explicitly forbids edits outside the promotion library, promotion benches, promotion schemas, promotion tests, `mcp_server/vitest.config.ts`, and this spec folder. Repairing the Python command-bridge expectations or legacy advisor behavior is therefore out of this phase's allowed write scope.

## Next Safe Action

Resolve the canonical regression-suite mismatch in the owning advisor surface packet, then rerun the 027/006 promotion gate bundle. Do not mark 027/006 complete or promote any weights until Gate 7 reports `overall_pass: true`.

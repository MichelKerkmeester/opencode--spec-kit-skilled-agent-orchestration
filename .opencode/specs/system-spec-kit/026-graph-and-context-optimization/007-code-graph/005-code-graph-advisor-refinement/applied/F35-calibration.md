# F35 Calibration Applied Report

## Source

- Finding: `F35` from research iter-7.
- Corpus: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/routing-accuracy/labeled-prompts.jsonl`
- Corpus SHA-256: `4b50b4ad7666d341fa43111ec05986430c855e4d0f5b8578a469f9a78e417e4d`
- Rows: `200`

## Files Created

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-calibration.bench.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/bench/scorer-calibration-baseline.json`

## Brier Score

- Baseline: `0.204829`
- Metric emission: `spec_kit.scorer.confidence_brier_score`
- Tolerance: `50%`

## ECE

- Baseline: `0.138314`
- Bucket count: `10`
- Tolerance: `50%`

## Reliability Bin Summary

Top buckets by count:

| Bucket | n | Accuracy | Avg Confidence |
| --- | ---: | ---: | ---: |
| `0.8-0.9` | 102 | 0.705882 | 0.845714 |
| `0.9-1.0` | 88 | 0.897727 | 0.936363 |
| `0.0-0.1` | 10 | 1 | 0 |

## Verification

- `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` exited `0`.
- `cd .opencode/skill/system-spec-kit/mcp_server && SPECKIT_RUN_BENCHES=true npx vitest run skill-advisor/bench/scorer-calibration.bench.ts` exited `0`.

## Deferred

- The exact requested Vitest command without `SPECKIT_RUN_BENCHES=true` exits `1` before loading the bench because the existing `mcp_server/vitest.config.ts` excludes `mcp_server/skill-advisor/bench/**/*.bench.ts` unless that environment gate is enabled. No config files were changed because this task constrained edits to the new bench and baseline artifacts.

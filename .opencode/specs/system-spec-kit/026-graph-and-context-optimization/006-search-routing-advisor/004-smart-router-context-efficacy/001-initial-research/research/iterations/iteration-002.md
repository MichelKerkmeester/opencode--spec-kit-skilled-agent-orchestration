# Iteration 002 - Static Context-Load Model

## Focus Questions

V1, V3

## Tools Used

- Python measurement script reading `.opencode/skill/*`
- Advisor corpus read from 019/004
- `skill_advisor.py --batch-stdin`

## Sources Queried

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/*/SKILL.md`
- `.opencode/skill/*/references/**`
- `.opencode/skill/*/assets/**`

## Findings

- Static baseline model: if an assistant loads the labeled correct skill package as `SKILL.md + references/ + assets/`, the 200-prompt corpus has mean load 289,442 bytes, p50 217,001 bytes, p90 580,304 bytes, p95 580,304 bytes, and max 667,318 bytes. (sourceStrength: primary)
- The advisor brief model used 80 token-estimate units at 4 chars/token, or about 320 bytes, matching the renderer and producer caps. (sourceStrength: primary)
- Under the corpus simulation with semantic disabled for parity with the test harness, 163 of 200 prompts emitted a passing recommendation and 37 emitted no passing skill. With-hook model-visible preload stayed at about 320 bytes per prompt before any optional skill read. (sourceStrength: primary)
- Projected savings against the labeled-correct baseline were mean 289,122 bytes per prompt, p50 216,681 bytes, p90 579,984 bytes, and max 666,998 bytes. This is an upper bound because real assistants may load only `SKILL.md`, not every reference and asset. (sourceStrength: primary)
- The same run found 80 mismatches between corpus `skill_top_1` labels and current advisor output. This is not a hook-parity failure; it is an accuracy or corpus drift signal for V4. (sourceStrength: primary)
- A normal advisor run without `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1` selected heavier packages in some cases and produced mean selected package size 244,846 bytes with mean with-hook model 60,622 bytes when low-confidence non-empty skills are counted. This shows measurement is sensitive to semantic mode and fallback assumptions. (sourceStrength: primary)

## Novelty Justification

This pass produced the first quantitative baseline and savings estimates, plus exposed corpus-label drift as a separate miss-rate concern.

## New Info Ratio

0.88

## Next Iteration Focus

Separate hook parity from advisor accuracy and analyze the 200-prompt corpus evidence.

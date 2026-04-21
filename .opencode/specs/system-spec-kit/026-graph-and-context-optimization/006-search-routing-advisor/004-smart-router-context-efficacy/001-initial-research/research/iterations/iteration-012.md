# Iteration 012 - Corpus Methodology Limits

## Focus Questions

V1, V3, V4

## Tools Used

- Batch advisor replay review
- Corpus label comparison
- Static size model review

## Sources Queried

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts`
- Iteration 002 measurement output

## Findings

- The 200-prompt corpus is useful for distributional measurement because it spans write, read-only, governance, deep-loop, code, docs, review, and connector-like tasks. (sourceStrength: primary)
- The corpus labels are not a current gold standard for advisor accuracy unless frozen with the exact advisor mode and skill graph version. Current replay found 80 label mismatches, so future miss-rate metrics should store advisor version, graph generation, and semantic mode. (sourceStrength: primary)
- Static package-size baseline probably overstates normal behavior for experienced agents that read only `SKILL.md` plus one needed reference. It is still valuable as the worst-case "walk the whole skill package" upper bound. (sourceStrength: moderate)
- A lower-bound model should measure only `SKILL.md` bytes; an expected model should use `SKILL.md + router-selected references`; and an upper-bound model should use `SKILL.md + all references + assets`. (sourceStrength: moderate)
- Corpus replay should add per-row categories: `direct_work`, `read_only_explain`, `metalinguistic`, `ambiguous`, `governance_write`, and `continuity_write`. This will make V4/V5 analysis more interpretable. (sourceStrength: moderate)

## Novelty Justification

This pass refined the measurement model into upper-bound, lower-bound, and future expected-case tiers.

## New Info Ratio

0.31

## Next Iteration Focus

Define explicit adversarial fixture set.

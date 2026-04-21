# Iteration 018: Metric Verification Pass

## Focus Question(s)

Cross-cutting - verify final metric values before synthesis.

## Tools Used

- Python summary readback from `/tmp/smart_router_metrics.json`
- Re-scan of research-only iteration files

## Sources Queried

- `/tmp/smart_router_metrics.json`
- `.opencode/specs/**/research/iterations/iteration-*.md`

## Findings

- `skills_with_smart_routing` is 20.
- `always_tier_median_bytes` is 15,296 when counting only ALWAYS resources.
- Median `SKILL.md + ALWAYS` bytes are 41,009.
- Median ALWAYS percentage of `SKILL.md + loadable resource tree` is 23.7%.
- Research iteration scan count is 1,014.
- The ON_DEMAND keyword hit rate is 5.5% over 200 prompts.
- Tier-compliance estimate remains `needs-harness`.

## Novelty Justification

This locked final key metrics and removed ambiguity between resource-only and skill-plus-resource figures.

## New-Info-Ratio

0.04

## Next Iteration Focus

Synthesis structure and registry mapping.

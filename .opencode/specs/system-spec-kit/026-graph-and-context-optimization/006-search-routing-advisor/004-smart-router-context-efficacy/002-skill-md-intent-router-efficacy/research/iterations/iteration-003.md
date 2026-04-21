# Iteration 003: V6 ALWAYS Bloat

## Focus Question(s)

V6 - identify skills where ALWAYS loading is already too large relative to full skill resources.

## Tools Used

- Python percentile and ratio calculations over parsed byte metrics
- Per-skill sorted bloat table

## Sources Queried

- `.opencode/skill/*/SKILL.md`
- `.opencode/skill/*/references/**`
- `.opencode/skill/*/assets/**`
- `/tmp/smart_router_metrics.json`

## Findings

- Using `SKILL.md + loadable resource tree` as the denominator, the median ALWAYS share is 23.7%.
- Four skills exceed 50% of that denominator: `sk-code-review` at 68.6%, `mcp-figma` at 61.0%, `mcp-chrome-devtools` at 52.3%, and `mcp-clickup` at 50.3%.
- Using resource-tree-only denominator, only `sk-code-review` exceeds 50% at 54.1%.
- Using raw full subtree bytes is misleading for `system-spec-kit` and `mcp-coco-index`, because implementation/vendor/server trees dwarf the docs/resources that the router is meant to govern.
- The bloat risk is concentrated in small-resource skills where one quick reference or template file can dominate the whole loadable doc set.

## Novelty Justification

This separated useful bloat findings from denominator artifacts caused by huge non-reference implementation trees.

## New-Info-Ratio

0.78

## Next Iteration Focus

V7 ON_DEMAND keyword hit rate in the 200-prompt corpus.

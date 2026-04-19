# Iteration 002: V2 Resource Budget

## Focus Question(s)

V2 - per-skill resource budget for ALWAYS, CONDITIONAL, and ON_DEMAND tiers.

## Tools Used

- Python AST parsing for router assignment blocks
- `wc -c` equivalent byte accumulation via `Path.stat().st_size`
- Recursive byte sums for `references/`, `assets/`, `manual_testing_playbook/`, and `feature_catalog/`

## Sources Queried

- `.opencode/skill/*/SKILL.md`
- `.opencode/skill/*/references/**`
- `.opencode/skill/*/assets/**`
- `/tmp/smart_router_metrics.json` generated from deterministic local reads

## Findings

- Median ALWAYS resource bytes were 15,296 bytes.
- Median ALWAYS plus `SKILL.md` bytes were 41,009 bytes.
- Median loadable resource tree bytes were 129,215 bytes.
- Against `SKILL.md + loadable resource tree`, the median savings ceiling of obeying the router is about 76.3%.
- The p25-p75 savings ceiling band was 55.6% to 91.9%, so the pattern can be valuable if actually followed.
- Some skills point at non-existent resources, for example `mcp-code-mode` references `references/quick_reference.md` and `sk-improve-agent` references `references/second_target_evaluation.md`; the parser recorded those as missing-path risks.

## Novelty Justification

This converted the routing claim into byte budgets and a savings ceiling.

## New-Info-Ratio

0.85

## Next Iteration Focus

V6 ALWAYS bloat and denominator selection.

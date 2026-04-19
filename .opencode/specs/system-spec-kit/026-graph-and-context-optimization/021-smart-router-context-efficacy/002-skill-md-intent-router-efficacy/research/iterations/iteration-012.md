# Iteration 012: Missing Resource Paths

## Focus Question(s)

V2/V9 refinement - do router-declared resources resolve?

## Tools Used

- Python path resolution under each skill root
- Missing-path collection from ALWAYS, CONDITIONAL, and ON_DEMAND path sets

## Sources Queried

- `.opencode/skill/mcp-code-mode/SKILL.md`
- `.opencode/skill/sk-improve-agent/SKILL.md`
- `.opencode/skill/*/references/**`
- `.opencode/skill/*/assets/**`

## Findings

- Most declared router paths resolve.
- `mcp-code-mode` references `references/quick_reference.md`, but the path was not found in the local skill tree during parsing.
- `sk-improve-agent` references `references/second_target_evaluation.md`, also missing in the local tree.
- Missing paths matter because advisory routers can silently degrade: an AI may try to follow the route and then either fail, search broadly, or load adjacent resources.
- A runtime harness should include a route-resolvability check before measuring compliance; otherwise missing resources can look like assistant non-compliance.

## Novelty Justification

This found concrete stale route entries that should be separated from AI behavior failures.

## New-Info-Ratio

0.18

## Next Iteration Focus

Denominator caveats for full-tree savings estimates.

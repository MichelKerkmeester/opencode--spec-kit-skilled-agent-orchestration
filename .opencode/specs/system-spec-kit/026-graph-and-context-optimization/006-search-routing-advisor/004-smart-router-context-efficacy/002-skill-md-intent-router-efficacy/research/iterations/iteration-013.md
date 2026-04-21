# Iteration 013: Denominator Caveats

## Focus Question(s)

V2/V6 refinement - what denominator should resource savings use?

## Tools Used

- Per-skill byte-table review
- Raw subtree vs loadable-resource-tree comparison

## Sources Queried

- `.opencode/skill/system-spec-kit/**`
- `.opencode/skill/mcp-coco-index/**`
- `.opencode/skill/*/references/**`
- `.opencode/skill/*/assets/**`

## Findings

- Raw full skill subtree bytes are misleading for some skills: `system-spec-kit` and `mcp-coco-index` include large implementation/server or environment trees.
- A realistic "full preload" denominator should be `SKILL.md + references/assets/manual_testing_playbook/feature_catalog`, not every executable or database-adjacent file under a skill root.
- The final report should still disclose raw full-tree results because the user asked for full-tree comparison, but should prefer loadable resource-tree metrics for efficacy.
- With raw full subtree denominator, no skill exceeded 50% ALWAYS share; with loadable resource denominator, four skills exceeded 50% when `SKILL.md` is included.
- This denominator choice changes the V6 interpretation from "no bloat" to "targeted bloat in small-resource skills."

## Novelty Justification

This prevented a false-negative bloat conclusion caused by implementation bytes outside the router's intended scope.

## New-Info-Ratio

0.14

## Next Iteration Focus

Compare with known baseline without reopening 021/001.

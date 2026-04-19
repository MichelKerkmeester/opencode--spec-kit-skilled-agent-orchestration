# Iteration 011: Router Shape Edge Cases

## Focus Question(s)

V1/V2 refinement - which skill routers require special parser support?

## Tools Used

- Python AST assignment inventory
- Manual review of assignment-name differences

## Sources Queried

- `.opencode/skill/sk-code-full-stack/SKILL.md`
- `.opencode/skill/sk-code-opencode/SKILL.md`
- `.opencode/skill/sk-code-review/SKILL.md`
- `.opencode/skill/sk-improve-agent/SKILL.md`
- `.opencode/skill/sk-improve-prompt/SKILL.md`

## Findings

- `sk-code-full-stack` lacks the exact canonical trio but carries equivalent concepts through `INTENT_MODEL`, `LOAD_LEVELS`, stack folders, and verification-command maps.
- `sk-code-opencode` has no `RESOURCE_MAP`; it embeds resource selection inside language branches and begins with a hard-coded `selected` list.
- `sk-code-review` has `DEFAULT_RESOURCES`, `RESOURCE_MAP`, and `ON_DEMAND_KEYWORDS`, but no `LOADING_LEVELS` object.
- `sk-improve-agent` has `RESOURCE_MAP` and runtime assets but no visible `LOADING_LEVELS`, making tier classification partly inferred.
- `sk-improve-prompt` uses command prefixes as first-class routing signals; keyword scoring is a fallback, not the primary route.
- A naive parser looking only for `LOADING_LEVELS["ALWAYS"]` would undercount several skills.

## Novelty Justification

This refined the parser requirements and prevented false claims of non-compliance from alias variance.

## New-Info-Ratio

0.22

## Next Iteration Focus

Missing resource paths and stale routing references.

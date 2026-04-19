# Iteration 001: V1 Inventory Baseline

## Focus Question(s)

V1 - inventory and shape variance of `## SMART ROUTING` sections in `.opencode/skill/*/SKILL.md`.

## Tools Used

- `rg -l "^## .*SMART ROUTING|^## SMART ROUTING" .opencode/skill/*/SKILL.md`
- Python AST parsing of fenced `python` router blocks
- `sed` reads of the active deep-research and system-spec-kit references

## Sources Queried

- `.opencode/skill/*/SKILL.md`
- `.opencode/skill/sk-deep-research/SKILL.md`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md`
- `.opencode/skill/sk-deep-research/references/state_format.md`

## Findings

- `rg` found 20 top-level `.opencode/skill/*/SKILL.md` files with a Smart Routing section, not the rough `~30` estimate in the request context.
- Four families dominate the inventory: `cli-*`, `mcp-*`, `sk-*`, and `system-spec-kit`.
- Fourteen skills use the canonical variable trio `INTENT_SIGNALS`, `RESOURCE_MAP`, and `LOADING_LEVELS`; the rest are meaningful variants rather than missing routers.
- Important variants: `sk-code-opencode` routes by language keywords and file extensions, `sk-code-full-stack` uses `INTENT_MODEL` and `LOAD_LEVELS`, `sk-code-review` uses `DEFAULT_RESOURCES` plus `ON_DEMAND_KEYWORDS`, and `sk-improve-prompt` uses command-prefix intent routing.
- Shape variance is high enough that any enforcement or measurement harness must parse aliases, not just exact variable names.

## Novelty Justification

This established the actual population and exposed router-shape variance that affects all later measurements.

## New-Info-Ratio

1.00

## Next Iteration Focus

V2 deterministic resource-budget parsing and byte counting.

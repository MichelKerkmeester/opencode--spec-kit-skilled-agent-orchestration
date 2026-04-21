# Iteration 009: V9 Enforcement Mechanism

## Focus Question(s)

V9 - is there a runtime hook, wrapper, or tool filter enforcing Smart Routing tier compliance?

## Tools Used

- `rg` for `SMART ROUTING`, `RESOURCE_MAP`, `LOADING_LEVELS`, `ON_DEMAND_KEYWORDS`, `PreToolUse`, and Read-filter terms
- Reads of runtime settings files
- Attempted CocoIndex semantic search; MCP call was cancelled by the MCP layer, so exact search was used as fallback

## Sources Queried

- `.claude/settings.json`
- `.claude/settings.local.json`
- `.codex/config.toml`
- `.gemini/settings.json`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/command/create/sk-skill.md`
- `.opencode/command/create/assets/create_sk_skill_auto.yaml`
- `.opencode/command/create/assets/create_sk_skill_confirm.yaml`

## Findings

- No runtime file-read guard was found that parses Smart Routing and blocks or warns on out-of-tier `Read` calls.
- Runtime settings expose prompt/session hooks, MCP servers, and broad permissions, but not a PreToolUse rule that checks skill resource paths against router output.
- The only non-skill files containing Smart Routing terms are creation or documentation workflows that preserve or generate Smart Routing sections.
- `skill_advisor.py` routes which skill to use; it does not parse `RESOURCE_MAP` or return intra-skill resource allowlists.
- Therefore Smart Routing is advisory prose/pseudocode today, not an enforced runtime contract.

## Novelty Justification

This answered the enforcement question with code/config absence evidence and distinguished advisor skill-choice from resource-choice enforcement.

## New-Info-Ratio

0.35

## Next Iteration Focus

V10 measurement harness design.

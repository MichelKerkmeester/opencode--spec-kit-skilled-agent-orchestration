# Iteration 008: V8 UNKNOWN_FALLBACK Safety

## Focus Question(s)

V8 - what happens when zero intents score, especially for `["GENERATION"]` default routes?

## Tools Used

- `rg` for `UNKNOWN`, `GENERATION`, `zero-score fallback`, and `score == 0`
- Manual read of matching router snippets

## Sources Queried

- `.opencode/skill/cli-codex/SKILL.md`
- `.opencode/skill/cli-copilot/SKILL.md`
- `.opencode/skill/cli-gemini/SKILL.md`
- `.opencode/skill/cli-claude-code/SKILL.md`
- `.opencode/skill/sk-code-opencode/SKILL.md`
- `.opencode/skill/sk-code-review/SKILL.md`
- `.opencode/skill/sk-improve-prompt/SKILL.md`

## Findings

- `cli-codex`, `cli-copilot`, and `cli-gemini` explicitly route zero-score prompts to `["GENERATION"]`.
- `cli-claude-code` routes zero-score prompts to `["DEEP_REASONING"]`, a safer broad default for that skill family.
- Several non-CLI skills use an UNKNOWN fallback checklist instead of silently selecting a production intent.
- `sk-improve-prompt` explicitly says zero-score fallback defaults to `TEXT_ENHANCE` with a disambiguation checklist.
- The generation fallback is safe only if "invoking a CLI orchestrator" already implies generation/delegation; otherwise it can mis-route vague troubleshooting, review, or research prompts into template-heavy generation resources.
- UNKNOWN fallback checklists are safer than silent generation defaults because they preserve uncertainty and ask for missing routing evidence.

## Novelty Justification

This identified a concrete mis-routing risk family and a safer fallback pattern.

## New-Info-Ratio

0.42

## Next Iteration Focus

V9 enforcement mechanisms in runtime hooks and settings.

# Iteration 65 - traceability - skill-assets-templates

## Dispatcher
- iteration: 65 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:12:14.369Z

## Files Reviewed
- `.opencode/skill/cli-claude-code/assets/prompt_quality_card.md`
- `.opencode/skill/cli-claude-code/assets/prompt_templates.md`
- `.opencode/skill/cli-codex/assets/prompt_quality_card.md`
- `.opencode/skill/cli-codex/assets/prompt_templates.md`
- `.opencode/skill/cli-copilot/assets/prompt_quality_card.md`
- `.opencode/skill/cli-copilot/assets/prompt_templates.md`
- `.opencode/skill/cli-gemini/assets/prompt_quality_card.md`
- `.opencode/skill/cli-gemini/assets/prompt_templates.md`
- `.opencode/skill/mcp-clickup/assets/tool_categories.md`
- `.opencode/skill/mcp-coco-index/assets/config_templates.md`
- `.opencode/skill/mcp-code-mode/assets/config_template.md`
- `.opencode/skill/mcp-code-mode/assets/env_template.md`
- `.opencode/skill/mcp-figma/assets/tool_categories.md`
- `.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/code_quality_checklist.md`
- `.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/debugging_checklist.md`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **P1 - Copilot prompt templates ship malformed copy-paste commands that collapse adjacent flags into invalid tokens.**  
  In `.opencode/skill/cli-copilot/assets/prompt_templates.md`, the Performance Review example emits `--agent review--model claude-opus-4.6`, and the structured-analysis examples emit `--output-format json--model ...`. Copying either command literally produces bad argv tokens instead of the intended separate flags, so these runtime-facing templates break the documented Copilot command contract.

```json
{
  "claim": "Two Copilot prompt-template commands are malformed because adjacent flags are concatenated without whitespace, producing invalid CLI tokens and breaking copy-paste execution.",
  "evidenceRefs": [
    ".opencode/skill/cli-copilot/assets/prompt_templates.md:105-107",
    ".opencode/skill/cli-copilot/assets/prompt_templates.md:255-266"
  ],
  "counterevidenceSought": "Checked nearby Copilot examples and sibling Claude/Codex/Gemini templates for the same pattern; the surrounding commands keep flags separated, so this is not the intended house style.",
  "alternativeExplanation": "This may be a markdown line-wrap typo rather than a design decision, but the published command text is still what operators copy.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade if the published surface auto-normalizes missing whitespace before shell execution, which is not how these assets are consumed today."
}
```

- **P1 - Code Mode configuration assets contradict their own prefixed-env contract with unprefixed onboarding examples.**  
  `config_template.md` explicitly says Code Mode prepends `{manual_name}_` and shows prefixed examples, but its GitHub customization snippet tells operators to add `GITHUB_TOKEN=...` to `.env`. `env_template.md` repeats the prefix rule, then gives Slack onboarding examples with raw `SLACK_*` names. Following either example literally would cause credential lookup failures for newly added manuals.

```json
{
  "claim": "The Code Mode env templates document prefixed variable lookup as mandatory, then provide unprefixed GitHub/Slack examples that would fail for copied manual configurations.",
  "evidenceRefs": [
    ".opencode/skill/mcp-code-mode/assets/config_template.md:347-361",
    ".opencode/skill/mcp-code-mode/assets/config_template.md:383-407",
    ".opencode/skill/mcp-code-mode/assets/env_template.md:191-221",
    ".opencode/skill/mcp-code-mode/assets/env_template.md:408-433"
  ],
  "counterevidenceSought": "Looked for any nearby carve-out stating custom manuals bypass prefixing or that raw names are accepted; the same assets instead repeat that prefixed names are required.",
  "alternativeExplanation": "The examples may have been copied from a generic MCP guide before Code Mode's prefixing rule was added, but the current text still advertises them as working examples.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade if Code Mode no longer prefixes env lookups for added manuals or if these examples are explicitly marked as non-literal pseudocode."
}
```

### P2 Findings
- **P2 - Dead sibling reference across all four prompt quality cards.** Each `prompt_quality_card.md` points readers to `../prompt_templates.md` (`.opencode/skill/cli-claude-code/assets/prompt_quality_card.md:91-95`, `.opencode/skill/cli-codex/assets/prompt_quality_card.md:91-95`, `.opencode/skill/cli-copilot/assets/prompt_quality_card.md:91-95`, `.opencode/skill/cli-gemini/assets/prompt_quality_card.md:91-95`), but the actual template file lives alongside the card under `assets/prompt_templates.md`, so the documented relative path is stale.
- **P2 - ClickUp tool-count summary is internally inconsistent.** `.opencode/skill/mcp-clickup/assets/tool_categories.md:39-44` claims `LOW = 19` and `Total = 46`, but the low-priority table lists 20 tools including `submit_feedback` (`.opencode/skill/mcp-clickup/assets/tool_categories.md:121-140`), so the stats can no longer be traced back to the enumerated inventory.
- **P2 - Go backend checklists still name the wrong parent skill.** The links resolve to `../../../../SKILL.md`, but both assets label that parent as `sk-code-web skill` instead of `sk-code-full-stack` (`.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/code_quality_checklist.md:665`, `.opencode/skill/sk-code-full-stack/assets/backend/go/checklists/debugging_checklist.md:360`).

## Traceability Checks
- **Cross-runtime consistency:** The Claude, Codex, Copilot, and Gemini prompt-quality cards are structurally synchronized, but the bad `../prompt_templates.md` reference was propagated to all four runtimes instead of the actual sibling asset path.
- **Skill<->code alignment:** `.opencode/skill/cli-gemini/assets/prompt_templates.md:305-315` references `codebase_investigator`, and that name is still wired in the checked-in Gemini runtime override at `.gemini/settings.json:120-129`.
- **Command<->implementation alignment:** `.opencode/skill/mcp-coco-index/assets/config_templates.md:20-27` matches the checked-in CocoIndex command/env contract in `opencode.json:36-45`, `.codex/config.toml:26-34`, and `.gemini/settings.json:44-53`.
- **Command-surface drift:** The Copilot prompt templates and Code Mode env assets are the only reviewed surfaces in this batch that currently advertise copy-paste examples inconsistent with the live runtime contract.

## Confirmed-Clean Surfaces
- `.opencode/skill/cli-claude-code/assets/prompt_templates.md` - command examples and model/permission guidance were internally consistent in sampled sections.
- `.opencode/skill/cli-codex/assets/prompt_templates.md` - flag guidance and example commands aligned with the checked-in Codex runtime patterns.
- `.opencode/skill/cli-gemini/assets/prompt_templates.md` - the `codebase_investigator` architecture-analysis guidance aligns with the checked-in Gemini override surface.
- `.opencode/skill/mcp-coco-index/assets/config_templates.md` - checked-in command path and `COCOINDEX_CODE_ROOT_PATH` guidance matched live repo configs.
- `.opencode/skill/mcp-figma/assets/tool_categories.md` - counts and category tables were internally consistent.

## Next Focus
- Check the next runtime-facing traceability slice for copy-paste command examples that drift from checked-in configs or renamed sibling assets.

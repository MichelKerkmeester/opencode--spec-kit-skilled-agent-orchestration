# Iteration 58 - correctness - skill-md-part1

## Dispatcher
- iteration: 58 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T06:57:39.987Z

## Files Reviewed
- .opencode/skill/cli-claude-code/SKILL.md
- .opencode/skill/cli-codex/SKILL.md
- .opencode/skill/cli-copilot/SKILL.md
- .opencode/skill/cli-gemini/SKILL.md
- .opencode/skill/mcp-chrome-devtools/SKILL.md
- .opencode/skill/mcp-clickup/SKILL.md
- .opencode/skill/mcp-coco-index/SKILL.md
- .opencode/skill/mcp-code-mode/SKILL.md
- .opencode/skill/mcp-figma/SKILL.md
- .opencode/skill/sk-code-full-stack/SKILL.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **cli-claude-code points Claude delegations at the OpenCode agent directory instead of the Claude runtime directory.** `cli-claude-code/SKILL.md` repeatedly tells callers that Claude Code agents live in `.opencode/agent/*.md` and `.opencode/agent/` (`.opencode/skill/cli-claude-code/SKILL.md:48`, `.opencode/skill/cli-claude-code/SKILL.md:308`, `.opencode/skill/cli-claude-code/SKILL.md:336`), but the runtime resolution contract says Claude profile agents load from `.claude/agents/` while `.opencode/agent/` is for the default Copilot/OpenCode profile (`AGENTS.md:281-289`). This is a cross-runtime contract break: a caller following the loaded skill doc can package the wrong agent inventory for Claude Code.

```json
{
  "claim": "cli-claude-code/SKILL.md documents the wrong agent directory for Claude Code delegations.",
  "evidenceRefs": [
    ".opencode/skill/cli-claude-code/SKILL.md:48",
    ".opencode/skill/cli-claude-code/SKILL.md:308",
    ".opencode/skill/cli-claude-code/SKILL.md:336",
    "AGENTS.md:281-289"
  ],
  "counterevidenceSought": "Checked the repo runtime directory contract to see whether Claude had been intentionally remapped to .opencode/agent/.",
  "alternativeExplanation": "The skill may have been copied from the default OpenCode profile and never retargeted for the Claude runtime.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if Claude Code in this repo now intentionally resolves agents from .opencode/agent/ instead of the runtime-specific .claude/agents/ directory."
}
```

- **mcp-clickup documents unprefixed ClickUp environment variables even though Code Mode requires prefixed names at runtime.** The ClickUp skill tells users to provide `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` (`.opencode/skill/mcp-clickup/SKILL.md:262-263`, `.opencode/skill/mcp-clickup/SKILL.md:412-414`, `.opencode/skill/mcp-clickup/SKILL.md:505-507`). But the Code Mode contract states that `.env` keys must be prefixed with the manual name, using `clickup_CLICKUP_API_KEY` as the canonical example (`.opencode/skill/mcp-code-mode/SKILL.md:401-406`, `.opencode/skill/mcp-code-mode/assets/env_template.md:191-212`), and the active `.utcp_config.json` confirms the manual name is `clickup` (`.utcp_config.json:52-66`). Following the ClickUp skill literally will produce the exact auth failure Code Mode documents.

```json
{
  "claim": "mcp-clickup/SKILL.md gives the wrong .env variable names for the active Code Mode setup.",
  "evidenceRefs": [
    ".opencode/skill/mcp-clickup/SKILL.md:262-263",
    ".opencode/skill/mcp-clickup/SKILL.md:412-414",
    ".opencode/skill/mcp-clickup/SKILL.md:505-507",
    ".opencode/skill/mcp-code-mode/SKILL.md:401-406",
    ".opencode/skill/mcp-code-mode/assets/env_template.md:191-212",
    ".utcp_config.json:52-66"
  ],
  "counterevidenceSought": "Checked whether Code Mode still accepted unprefixed .env keys or whether the manual name differed from clickup in the active config.",
  "alternativeExplanation": "The ClickUp skill may be echoing placeholder names from the MCP config snippet instead of the runtime-resolved .env contract.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if Code Mode runtime has been changed to resolve unprefixed .env keys, contrary to its own SKILL, env template, and README."
}
```

### P2 Findings
- **sk-code-full-stack gives a non-resolvable path for the review quick reference.** The review baseline contract tells consumers to load `sk-code-review/references/quick_reference.md` (`.opencode/skill/sk-code-full-stack/SKILL.md:57-59`), but the actual file lives under `.opencode/skill/sk-code-review/references/quick_reference.md` (`.opencode/skill/sk-code-review/references/quick_reference.md:1-19`). The current text is a stale shorthand rather than a usable repo path, so literal loading fails.

## Traceability Checks
- **Cross-runtime consistency:** compared CLI skill runtime-path claims against the shared runtime directory contract in `AGENTS.md`; only `cli-claude-code` drifted, while `cli-gemini` remained aligned with `.gemini/agents/`.
- **Skill-to-code alignment:** checked Code Mode auth/setup claims against the active `.utcp_config.json` and the prefixed-env guidance in `mcp-code-mode`; `mcp-clickup` is the only reviewed skill that still documents unprefixed ClickUp env keys.
- **Command-to-implementation alignment:** spot-checked CocoIndex management-tool naming against `system-spec-kit` tool schemas; `ccc_status`, `ccc_reindex`, `ccc_feedback`, and `session_bootstrap` are present and the `mcp-coco-index` operational guidance stayed aligned.

## Confirmed-Clean Surfaces
- `.opencode/skill/cli-codex/SKILL.md` - sandbox/profile guidance stayed internally consistent with the current Codex contract.
- `.opencode/skill/cli-copilot/SKILL.md` - non-interactive delegation and memory-handback guidance were internally consistent in this pass.
- `.opencode/skill/cli-gemini/SKILL.md` - runtime agent-directory guidance matched the `.gemini/agents/` convention.
- `.opencode/skill/mcp-chrome-devtools/SKILL.md` - CLI-vs-MCP split and isolated-instance naming remained coherent.
- `.opencode/skill/mcp-coco-index/SKILL.md` - documented CocoIndex companion tools aligned with current `system-spec-kit` tool names.
- `.opencode/skill/mcp-figma/SKILL.md` - correctly carries the Code Mode prefixed-env requirement that `mcp-clickup` missed.

## Next Focus
- Review the remaining runtime-loaded operational docs for the same class of drift: runtime-specific path claims, Code Mode auth/setup contracts, and stale loadable-file references.

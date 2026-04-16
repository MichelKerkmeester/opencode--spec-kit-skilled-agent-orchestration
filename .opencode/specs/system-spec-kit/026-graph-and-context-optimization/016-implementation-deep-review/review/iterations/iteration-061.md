# Iteration 61 - security - skill-readme+md-security

## Dispatcher
- iteration: 61 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:08:16.400998Z

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
- .opencode/skill/cli-claude-code/README.md
- .opencode/skill/cli-codex/README.md
- .opencode/skill/cli-copilot/README.md
- .opencode/skill/cli-gemini/README.md
- .opencode/skill/mcp-chrome-devtools/README.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **cli-claude-code documents agent names that no longer line up with the mirrored runtime inventories.** The loaded skill/README surfaces still tell conductors to use `--agent handover`, `--agent research`, and `--agent speckit` from `.opencode/agent/*.md` (`.opencode/skill/cli-claude-code/SKILL.md:308-320`, `.opencode/skill/cli-claude-code/README.md:54-56`, `.opencode/skill/cli-claude-code/README.md:172-182`). The mirrored runtime inventory instead standardizes on `deep-research` and mirrors that set across runtimes (`.opencode/agent/README.txt:8-21`), and the live `.opencode/agent`, `.claude/agents`, `.gemini/agents`, and `.codex/agents` directory listings do not contain `research.md`, `handover.md`, or `speckit.md`. A caller following the loaded Claude docs can therefore dispatch to names that do not resolve to file-backed agent definitions.

```json
{
  "claim": "cli-claude-code's runtime-loaded docs still advertise handover/research/speckit agent names even though the mirrored agent inventories no longer expose matching file-backed definitions.",
  "evidenceRefs": [
    ".opencode/skill/cli-claude-code/SKILL.md:308-320",
    ".opencode/skill/cli-claude-code/README.md:54-56",
    ".opencode/skill/cli-claude-code/README.md:172-182",
    ".opencode/agent/README.txt:8-21"
  ],
  "counterevidenceSought": "Checked the mirrored runtime inventories (.opencode/agent, .claude/agents, .gemini/agents, .codex/agents) for matching handover/research/speckit definition files or obvious alias targets.",
  "alternativeExplanation": "The docs were partially left on an older 9-agent roster while the shared runtime inventories moved to deep-research/deep-review naming and dropped some file-backed agent surfaces.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if Claude runtime now resolves handover/research/speckit through a non-file alias layer that is intentionally outside the mirrored agent directories."
}
```

- **cli-copilot/SKILL.md normalizes full-autonomy as the default non-interactive invocation.** Its core invocation pattern says all non-interactive calls are `copilot -p "prompt" --allow-all-tools 2>&1` (`.opencode/skill/cli-copilot/SKILL.md:261-270`), which enables no-prompt file writes and tool execution for every delegated task. That conflicts with the same skill's own cautionary framing around Autopilot and token handling (`.opencode/skill/cli-copilot/SKILL.md:396-399`) and with the README, which keeps plain `copilot -p ...` as the normal quick-start path and Autopilot as a separate explicit step (`.opencode/skill/cli-copilot/README.md:115-125`, `.opencode/skill/cli-copilot/README.md:182-190`). In a runtime-loaded operational doc, making the most permissive mode the baseline weakens the approval boundary for routine delegations.

```json
{
  "claim": "cli-copilot/SKILL.md makes --allow-all-tools the default cross-AI invocation instead of an explicit high-trust opt-in.",
  "evidenceRefs": [
    ".opencode/skill/cli-copilot/SKILL.md:261-270",
    ".opencode/skill/cli-copilot/SKILL.md:396-399",
    ".opencode/skill/cli-copilot/README.md:115-125",
    ".opencode/skill/cli-copilot/README.md:182-190"
  ],
  "counterevidenceSought": "Checked the companion README to see whether Copilot non-interactive mode required Autopilot for ordinary delegation; the README keeps Autopilot as a separate opt-in step.",
  "alternativeExplanation": "The skill author optimized for unattended automation and promoted the highest-permission recipe into the generic invocation block without preserving the opt-in guardrail.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if repository policy intentionally requires --allow-all-tools for every non-interactive Copilot delegation and all companion docs are updated to say so explicitly."
}
```

### P2 Findings
- **cli-copilot's loaded auth guidance is internally inconsistent.** The skill prerequisite block says OAuth uses `copilot login` (`.opencode/skill/cli-copilot/SKILL.md:246-256`), while the README tells users to authenticate with `gh auth login` and labels that as the interactive browser flow (`.opencode/skill/cli-copilot/README.md:108-113`, `.opencode/skill/cli-copilot/README.md:223-229`). For an operational guide loaded at runtime, this is stale/ambiguous security guidance because it blurs whether callers should use the Copilot-specific auth path or a broader GitHub CLI credential flow.

## Traceability Checks
- **Cross-runtime consistency:** compared Claude/Codex/Gemini runtime agent references against the mirrored inventories. Gemini's `@deep-research` naming matches `.gemini/agents`, while the Claude surfaces still drift on `research`.
- **Skill-to-code alignment:** verified Codex profile claims against `.codex/config.toml`; `review`, `context`, `research`, `write`, `debug`, `ultra-think`, and `speckit` are configured there, so the reviewed Codex docs stayed aligned on the non-interactive path.
- **Command-to-implementation alignment:** checked referenced local assets/install guides for the MCP skills. `mcp-chrome-devtools` and `mcp-figma` point at present local install guides/examples, and the non-flagged skills keep dangerous modes (`bypassPermissions`, `--yolo`, `danger-full-access`) explicitly opt-in.

## Confirmed-Clean Surfaces
- .opencode/skill/cli-codex/SKILL.md
- .opencode/skill/cli-codex/README.md
- .opencode/skill/cli-gemini/SKILL.md
- .opencode/skill/cli-gemini/README.md
- .opencode/skill/mcp-chrome-devtools/SKILL.md
- .opencode/skill/mcp-chrome-devtools/README.md
- .opencode/skill/mcp-clickup/SKILL.md
- .opencode/skill/mcp-coco-index/SKILL.md
- .opencode/skill/mcp-code-mode/SKILL.md
- .opencode/skill/mcp-figma/SKILL.md
- .opencode/skill/sk-code-full-stack/SKILL.md

## Next Focus
- Check the next operational-doc slice for the same failure mode: privileged defaults presented as generic recipes, plus runtime agent/profile names that drift from the mirrored inventories actually present on disk.

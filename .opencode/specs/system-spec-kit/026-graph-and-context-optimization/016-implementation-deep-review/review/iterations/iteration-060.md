# Iteration 60 - traceability - skill-readme-accuracy

## Dispatcher
- iteration: 60 of 70
- dispatcher: cli-copilot gpt-5.4 high (operational doc review)
- timestamp: 2026-04-16T07:01:31.566Z

## Files Reviewed
- .opencode/skill/cli-claude-code/README.md
- .opencode/skill/cli-codex/README.md
- .opencode/skill/cli-copilot/README.md
- .opencode/skill/cli-gemini/README.md
- .opencode/skill/mcp-chrome-devtools/README.md
- .opencode/skill/mcp-clickup/README.md
- .opencode/skill/mcp-coco-index/README.md
- .opencode/skill/mcp-code-mode/README.md
- .opencode/skill/mcp-figma/README.md
- .opencode/skill/sk-code-full-stack/README.md
- .opencode/skill/sk-code-opencode/README.md
- .opencode/skill/sk-code-review/README.md

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **cli-claude-code README points Claude custom-agent authors at the wrong runtime directory.** The README tells users to add Claude Code custom agents under `.opencode/agent/` (`.opencode/skill/cli-claude-code/README.md:331-332`), but the runtime directory contract says Claude profile agents load from `.claude/agents/`, while `.opencode/agent/` belongs to the default Copilot/OpenCode profile (`AGENTS.md:281-289`). A caller following the loaded README will package agents into the wrong runtime path.

```json
{
  "claim": "cli-claude-code/README.md documents the wrong custom-agent directory for the Claude runtime.",
  "evidenceRefs": [
    ".opencode/skill/cli-claude-code/README.md:331-332",
    "AGENTS.md:281-289"
  ],
  "counterevidenceSought": "Checked the shared runtime directory table to see whether Claude had been intentionally remapped to .opencode/agent/.",
  "alternativeExplanation": "The README may have been copied from the default OpenCode profile wording and not retargeted for the Claude-specific runtime.",
  "finalSeverity": "P1",
  "confidence": 0.99,
  "downgradeTrigger": "Downgrade if this repository now intentionally resolves Claude Code custom agents from .opencode/agent/ instead of .claude/agents/."
}
```

- **mcp-code-mode README advertises configured servers and runnable examples that do not exist in the active Code Mode inventory.** The README says Code Mode applies to configured tools including Webflow and Notion (`.opencode/skill/mcp-code-mode/README.md:42-44`, `.opencode/skill/mcp-code-mode/README.md:173-175`) and even ships Webflow-based examples as if they are runnable (`.opencode/skill/mcp-code-mode/README.md:282-349`). It also labels `tool_catalog.md` as covering "250+ tools across 8 configured servers" (`.opencode/skill/mcp-code-mode/README.md:200-210`). The active `.utcp_config.json` only registers five manuals: `chrome_devtools_1`, `chrome_devtools_2`, `clickup`, `figma`, and `github` (`.utcp_config.json:14-111`). Following the README literally will send agents to unavailable `webflow.*`/`notion.*` tools and fail at runtime.

```json
{
  "claim": "mcp-code-mode/README.md overstates the currently configured Code Mode inventory and includes examples that cannot run in this repo's active setup.",
  "evidenceRefs": [
    ".opencode/skill/mcp-code-mode/README.md:42-44",
    ".opencode/skill/mcp-code-mode/README.md:173-175",
    ".opencode/skill/mcp-code-mode/README.md:200-210",
    ".opencode/skill/mcp-code-mode/README.md:282-349",
    ".utcp_config.json:14-111"
  ],
  "counterevidenceSought": "Checked the active UTCP manual registry file for any Webflow or Notion manual entries or other configured servers beyond the five listed.",
  "alternativeExplanation": "The README may be describing a richer reference/demo environment rather than the active repository configuration, but it does not label those examples as hypothetical.",
  "finalSeverity": "P1",
  "confidence": 0.98,
  "downgradeTrigger": "Downgrade if Webflow and Notion are intentionally treated as non-local illustrative examples and the README is updated to label them as such instead of configured runtime inventory."
}
```

### P2 Findings
- **mcp-code-mode README understates and self-contradicts its own tool surface.** It says the server exposes only four native tools and repeats "Native Tools (4 total)" (`.opencode/skill/mcp-code-mode/README.md:44`, `.opencode/skill/mcp-code-mode/README.md:152-159`), but the same README later references `get_required_keys_for_tool`, `register_manual`, and `deregister_manual` as supported operations (`.opencode/skill/mcp-code-mode/README.md:148`, `.opencode/skill/mcp-code-mode/README.md:409-413`), and the server implementation registers all seven tools (`.opencode/skill/mcp-code-mode/mcp_server/index.ts:127-250`).
- **mcp-code-mode troubleshooting claims `UTCP_CONFIG_FILE` must be absolute even though the live setup uses a relative path and the server resolves it correctly.** The README says startup failures come from using a relative `UTCP_CONFIG_FILE` and instructs users to switch to an absolute path (`.opencode/skill/mcp-code-mode/README.md:388-394`), but the active config uses `.utcp_config.json` relative to repo root (`opencode.json:47-55`) and the server explicitly normalizes that value with `path.resolve(...)` (`.opencode/skill/mcp-code-mode/mcp_server/index.ts:268-277`).
- **mcp-chrome-devtools troubleshooting escalates to a broad name-based kill recipe.** After a stale-session error, the README tells users to run `pkill -f browser-debugger-cli` (`.opencode/skill/mcp-chrome-devtools/README.md:459-475`). In a runtime-loaded operational guide this is an unsafe cleanup pattern because it targets processes by name rather than a scoped session/PID, increasing the chance of collateral termination on shared machines.

## Traceability Checks
- **Cross-runtime consistency:** compared runtime-path claims in CLI READMEs against `AGENTS.md`; only `cli-claude-code/README.md` drifted from the runtime-specific Claude directory contract.
- **Skill-to-code alignment:** checked `mcp-code-mode/README.md` against both the active `.utcp_config.json` inventory and the Code Mode server implementation; the README currently drifts on configured-manual inventory, supported tool count, and `UTCP_CONFIG_FILE` behavior.
- **Command-to-implementation alignment:** verified referenced local assets/install guides/tool references for the reviewed skill READMEs with glob checks; the non-flagged README surfaces in this pass still point at present local files.

## Confirmed-Clean Surfaces
- `.opencode/skill/cli-codex/README.md`
- `.opencode/skill/cli-copilot/README.md`
- `.opencode/skill/cli-gemini/README.md`
- `.opencode/skill/mcp-clickup/README.md`
- `.opencode/skill/mcp-coco-index/README.md`
- `.opencode/skill/mcp-figma/README.md`
- `.opencode/skill/sk-code-full-stack/README.md`
- `.opencode/skill/sk-code-opencode/README.md`
- `.opencode/skill/sk-code-review/README.md`

## Next Focus
- Check the next operational-doc slice for the same drift pattern: runtime-specific path claims, active-tool inventory mismatches, and unsafe troubleshooting recipes that agents may load verbatim.

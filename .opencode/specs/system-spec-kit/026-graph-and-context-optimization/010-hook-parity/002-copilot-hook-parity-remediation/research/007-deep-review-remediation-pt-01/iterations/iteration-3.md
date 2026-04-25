# Iteration 3: Hooks and agent startup surface
## Focus
This iteration targeted Q1 and Q2: whether Copilot CLI has a documented hook/lifecycle surface comparable to Claude Code hooks, and whether `--agent` can inject startup-level context into the main session.

## Actions Taken
1. Read the active research state, strategy, and prior iteration to stay aligned with the current loop focus and avoid duplicating already-collected evidence. Sources: `deep-research-state.jsonl`; `deep-research-strategy.md`; `iterations/iteration-2.md`.
2. Fetched the official Copilot CLI concept page and CLI hooks guide to verify whether GitHub documents a real lifecycle hook surface for the CLI. Sources: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli ; https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks
3. Fetched the official Copilot CLI custom-agent concept page and custom-agent configuration reference to confirm whether `--agent` is a main-session injection surface or a delegated subagent profile. Sources: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents ; https://docs.github.com/en/copilot/reference/custom-agents-configuration
4. Empirically inspected `copilot --help` and `~/.copilot/` to cross-check the live binary for agent/plugin/custom-instructions/config surfaces and local config artifacts. Sources: local `copilot --help` output; local `~/.copilot/` inventory.

## Findings
- **Copilot CLI does have a documented lifecycle hook surface.** The official CLI docs list hooks as a supported customization mechanism, and the CLI hook guide shows a hook file with `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, and `errorOccurred` triggers. Sources: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli ; https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks
- **The documented CLI hook model is command execution, not prompt-text injection.** GitHub describes hooks as executing custom shell commands/scripts for validation, logging, security scanning, and workflow automation; the configuration surface shown is `bash`/`powershell`/script path plus `cwd`, `env`, and `timeoutSec`, with no documented field for returning text that gets appended to the model's session or prompt context. Sources: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli ; https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks
- **`/agent` and `--agent` operate on subagents, not the main session system prompt.** The custom-agent docs say custom agents are instantiated when assigned to a task, and the CLI concept page explains that the main Copilot agent runs built-in/custom agents as subagents with separate context windows. Sources: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents ; https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli
- **The documented custom-agent schema is static prompt/tools/MCP configuration, not a runtime startup-context callback.** The reference only exposes frontmatter/prompt content, `tools`, and `mcp-servers`; its environment-variable support is scoped to MCP server configuration, and no `sessionStart`/`userPromptSubmitted`-style callback or dynamic context field appears in the agent profile schema. Sources: https://docs.github.com/en/copilot/reference/custom-agents-configuration ; https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents

## Questions Answered
- **Q1:** **Yes, Copilot CLI has a documented hook API / lifecycle extension point.** Evidence: official docs explicitly advertise hooks for Copilot CLI and enumerate `sessionStart` and `userPromptSubmitted` triggers, but the documented contract is shell-command execution rather than prompt mutation. Sources: https://docs.github.com/en/copilot/concepts/agents/about-copilot-cli ; https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks
- **Q2:** **`/agent` / `--agent` is a subagent-selection surface, not a documented main-session startup-context injector.** Evidence: GitHub describes custom agents as subagents with separate context windows and documents only static prompt/tools/MCP profile fields. Sources: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents ; https://docs.github.com/en/copilot/reference/custom-agents-configuration

## Questions Remaining
- **Q3:** What exactly is the `/skills` model in Copilot CLI, and can it surface an advisor brief into the active prompt rather than only add reusable instructions/resources?
- **Q4:** Can `/mcp` / `--additional-mcp-config` do anything beyond callable tools/data access, especially in the presence of hooks or plugins?
- **Q5:** What is the full custom-instructions loading model (`AGENTS.md` and related files), and is any user-global startup payload surface available there?
- **Q6:** Does `--acp` expose any host-to-model context injection channel beyond session/tool transport?
- **Q7:** Which documented environment variables are read at startup, and could any carry structured payload text?
- **Q8:** If only hooks + static instructions exist, what is the least-friction wrapper pattern for prepending startup/advisor payloads without breaking CLI/TUI ergonomics?

## Next Focus
Iteration 4 should map custom instructions, `/skills`, and plugin/MCP surfaces together to determine whether any non-hook path can place structured advisory text directly into the main prompt context.

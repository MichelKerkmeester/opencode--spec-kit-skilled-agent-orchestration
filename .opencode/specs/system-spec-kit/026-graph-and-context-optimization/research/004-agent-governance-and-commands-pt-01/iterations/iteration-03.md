## Iteration 03

### Focus
`@general` contract drift between runtime-directory loading rules and the live agent docs.

### Findings
- AGENTS tells operators to choose the active runtime directory and lists `@general` alongside the routed agent set (`AGENTS.md:300-316`).
- Codex context docs treat `@general` as `Built-in` instead of a runtime file (`.codex/agents/context.toml:370-374`).
- Orchestrator Agent Files tables omit `@general` entirely in both OpenCode and Codex (`.opencode/agent/orchestrate.md:162-171`, `.codex/agents/orchestrate.toml:154-163`), leaving the default implementation worker outside the documented directory-based loading model.

### New Questions
- Is the built-in treatment of `@general` intentional across all runtimes, or just under-documented?
- Should AGENTS distinguish built-in agents from file-backed agents in the routing section?
- Does the workflow layer hardcode OpenCode copies for deep-loop agents in a way that creates a second source of truth?

### Status
new-territory

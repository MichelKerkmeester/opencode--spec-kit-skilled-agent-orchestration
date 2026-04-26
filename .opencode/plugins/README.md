# OpenCode Plugin Entrypoints

This folder is intentionally limited to OpenCode plugin entrypoint files. OpenCode 1.3.17 auto-loads local plugin files from `.opencode/plugins/` at startup, and helper modules in this folder can be mistaken for plugins or legacy plugin exports.

Current entrypoints:

- `spec-kit-skill-advisor.js` - prompt-time Spec Kit skill advisor plugin.
- `spec-kit-compact-code-graph.js` - transport-backed context and compact-code-graph plugin.

Helper bridge modules live in `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/` (colocated with their owning skill, alongside `mcp_server/hooks/`):

- `spec-kit-skill-advisor-bridge.mjs`
- `spec-kit-compact-code-graph-bridge.mjs`
- `spec-kit-opencode-message-schema.mjs`

When upgrading OpenCode beyond 1.3.17, rerun the 026/007/009 discovery probe: inspect the local plugin glob, add a temporary no-default-export file, confirm the regression guard fails, remove the file, and smoke `opencode` from both the Public root and the Barter symlinked workspace.

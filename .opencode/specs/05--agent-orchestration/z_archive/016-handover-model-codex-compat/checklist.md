---
title: "Checklist: Spec 016 — Handover Haiku + Codex Agent Conversion [016-handover-model-codex-compat/checklist]"
description: "checklist document for 016-handover-model-codex-compat."
trigger_phrases:
  - "checklist"
  - "spec"
  - "016"
  - "handover"
  - "haiku"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Spec 016 — Handover Haiku + Codex Agent Conversion

<!-- ANCHOR:pre-impl -->
## P0: Hard Blockers

- [x] Handover model changed to Haiku in `.opencode/agent/handover.md`
- [x] Handover model changed to Haiku in `.claude/agents/handover.md`
- [x] All 8 `.codex/agents/*.md` files have `profile:` field (no `model:` or `tools:`)
- [x] `.codex/config.toml` has 4 profiles: fast, balanced, powerful, readonly
- [x] All profiles use gpt-5.3 family (no gpt-5.1 or gpt-5.2)
- [x] Agent body content preserved unchanged in all files

<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## P1: Required

- [x] Fast profile uses `gpt-5.3-codex-spark` model variant
- [x] Balanced/powerful/readonly profiles use `gpt-5.3-codex`
- [x] Reasoning effort: fast/balanced = high, powerful/readonly = extra_high
- [x] Sandbox modes correct: context=read-only, review=read-only, all others=workspace-write
- [x] `codex-specialized-subagents` MCP server added to config.toml
- [x] Agent-to-profile mapping preserved: context/handover=fast, speckit/write=balanced, debug/research/orchestrate=powerful, review=readonly
- [x] No residual Claude Code frontmatter fields (name, description, tools, mcpServers) in .codex/agents/

<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## P2: Optional

- [ ] Codex MCP server tested with `codex exec` (deferred: requires Codex CLI runtime)
- [ ] Handover quality validated with Haiku model (deferred: runtime testing)

<!-- /ANCHOR:testing -->

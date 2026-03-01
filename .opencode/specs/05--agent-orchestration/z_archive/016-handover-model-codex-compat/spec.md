---
title: "Spec 016: Handover Model Downgrade + Codex Agent Compatibility [016-handover-model-codex-compat/spec]"
description: "Two issues with the current agent configuration"
trigger_phrases:
  - "spec"
  - "016"
  - "handover"
  - "model"
  - "downgrade"
importance_tier: "important"
contextType: "decision"
---
# Spec 016: Handover Model Downgrade + Codex Agent Compatibility

<!-- ANCHOR:problem -->
## Problem

Two issues with the current agent configuration:

1. **Handover agent over-provisioned**: The handover agent uses Sonnet across Copilot and Claude Code, but its template-filling task is well-suited for Haiku (validated by spec 012/013 Haiku compatibility testing).

2. **Codex agents non-functional**: The `.codex/agents/` files use Claude Code YAML frontmatter (`model:`, `tools:`, `mcpServers:`) that Codex CLI completely ignores. These agents are decorative, not functional.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## Scope

### In Scope

- Downgrade handover agent model from Sonnet to Haiku across Copilot (`.opencode/agent/`) and Claude Code (`.claude/agents/`)
- Add Codex CLI profiles to `.codex/config.toml` for model tier and reasoning effort differentiation
- Add `codex-specialized-subagents` MCP server for sub-agent dispatch
- Convert all 8 `.codex/agents/*.md` frontmatters from Claude Code format to Codex-native profile-based format
- Body content of all agent files preserved unchanged

### Out of Scope

- Changes to `.opencode/agent/` files (beyond handover model change)
- Changes to `.claude/agents/` files (beyond handover model change)
- Agent body content modifications
- New agent creation
- Codex CLI installation or configuration beyond profiles/MCP

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## Requirements

### R1: Handover Model Change

| Platform | File | Before | After |
|----------|------|--------|-------|
| Copilot | `.opencode/agent/handover.md` | `github-copilot/claude-sonnet-4.5` | `github-copilot/claude-haiku-4.5` |
| Claude Code | `.claude/agents/handover.md` | `sonnet` | `haiku` |

### R2: Codex Profiles

Four profiles in `.codex/config.toml`, all using gpt-5.3 family with differentiated reasoning effort:

| Profile | Model | Reasoning Effort | Sandbox |
|---------|-------|-----------------|---------|
| `fast` | `gpt-5.3-codex-spark` | high | workspace-write |
| `balanced` | `gpt-5.3-codex` | high | workspace-write |
| `powerful` | `gpt-5.3-codex` | extra_high | workspace-write |
| `readonly` | `gpt-5.3-codex` | extra_high | read-only |

### R3: Sub-Agent MCP

The `codex-specialized-subagents` MCP server added to `.codex/config.toml`, enabling the `delegate` tool that reads agent `.md` files and spawns `codex exec --profile <name> "<task>"`.

### R4: Agent Frontmatter Conversion

All 8 `.codex/agents/*.md` files converted from:
```yaml
---
name: <name>
description: "<desc>"
tools: [...]
model: <model>
mcpServers: [...]
---
```

To:
```yaml
---
profile: <profile_name>
approval_policy: on-request
sandbox_mode: <workspace-write|read-only>
---
```

### R5: Agent-to-Profile Mapping

| Agent | Profile | Sandbox |
|-------|---------|---------|
| context | `fast` | read-only |
| handover | `fast` | workspace-write |
| speckit | `balanced` | workspace-write |
| write | `balanced` | workspace-write |
| debug | `powerful` | workspace-write |
| research | `powerful` | workspace-write |
| review | `readonly` | read-only |
| orchestrate | `powerful` | workspace-write |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## Success Criteria

1. Handover agent uses Haiku in both Copilot and Claude Code platforms
2. All 8 `.codex/agents/*.md` files have `profile:` frontmatter with no `model:` or `tools:` fields
3. `.codex/config.toml` contains 4 profiles (all gpt-5.3 family) and sub-agents MCP server
4. Agent body content unchanged across all files
5. Reasoning effort differentiation: fast/balanced=high, powerful/readonly=extra_high

<!-- /ANCHOR:success-criteria -->

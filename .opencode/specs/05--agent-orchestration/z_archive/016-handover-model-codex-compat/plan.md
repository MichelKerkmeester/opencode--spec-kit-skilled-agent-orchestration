---
title: "Plan: Spec 016 — Handover Haiku + Codex Agent Conversion [016-handover-model-codex-compat/plan]"
description: "All profiles use the gpt-5.3 model family. Differentiation is via model variant (spark vs full) and reasoning effort"
trigger_phrases:
  - "plan"
  - "spec"
  - "016"
  - "handover"
  - "haiku"
importance_tier: "important"
contextType: "decision"
---
# Plan: Spec 016 — Handover Haiku + Codex Agent Conversion

<!-- ANCHOR:architecture -->
## Architecture

### Current State

- Handover agent uses Sonnet on Copilot and Claude Code (over-provisioned for template-filling)
- `.codex/agents/` files use Claude Code YAML frontmatter that Codex CLI ignores entirely
- No Codex profile system configured
- No sub-agent dispatch mechanism for Codex

### Target State

- Handover agent uses Haiku (cost + speed gain, adequate for structured template work)
- `.codex/agents/` files use Codex-native profile-based frontmatter
- `.codex/config.toml` defines 4 model tier profiles (all gpt-5.3 family, differentiated by reasoning effort)
- `codex-specialized-subagents` MCP enables `delegate` tool for sub-agent dispatch

### Profile Configuration

All profiles use the gpt-5.3 model family. Differentiation is via model variant (spark vs full) and reasoning effort:

| Profile | Model | Reasoning Effort | Sandbox | Agents |
|---------|-------|-----------------|---------|--------|
| `fast` | `gpt-5.3-codex-spark` | high | workspace-write | context, handover |
| `balanced` | `gpt-5.3-codex` | high | workspace-write | speckit, write |
| `powerful` | `gpt-5.3-codex` | extra_high | workspace-write | debug, research, orchestrate |
| `readonly` | `gpt-5.3-codex` | extra_high | read-only | review |

### Cross-Platform Model Mapping

| Profile | Codex Model | Claude Model | Copilot Model |
|---------|------------|-------------|---------------|
| `fast` | `gpt-5.3-codex-spark` | `haiku` | `github-copilot/claude-haiku-4.5` |
| `balanced` | `gpt-5.3-codex` | `sonnet` | `github-copilot/claude-sonnet-4.5` |
| `powerful` | `gpt-5.3-codex` | `opus` | `github-copilot/claude-opus-4.6` |
| `readonly` | `gpt-5.3-codex` | `opus` | `github-copilot/claude-opus-4.6` |

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## Implementation Phases

### Phase 1: Handover Model Change

Edit frontmatter `model:` field in two files:
- `.opencode/agent/handover.md`: `github-copilot/claude-sonnet-4.5` -> `github-copilot/claude-haiku-4.5`
- `.claude/agents/handover.md`: `sonnet` -> `haiku`

### Phase 2: Codex config.toml Updates

Add to `.codex/config.toml`:
1. Four `[profiles.*]` sections (fast with spark model, balanced/powerful/readonly with full model)
2. `[mcp_servers.codex-specialized-subagents]` section

### Phase 3: Agent Frontmatter Conversion

Replace Claude Code frontmatter block in all 8 `.codex/agents/*.md` files with Codex-compatible format. Fields removed: `name`, `description`, `tools`, `model`, `mcpServers`. Fields added: `profile`, `approval_policy`, `sandbox_mode`.

Body content preserved unchanged.

<!-- /ANCHOR:phases -->

<!-- ANCHOR:risks -->
## Risks

| Risk | Mitigation |
|------|-----------|
| Haiku quality drop for handover | Validated by spec 012/013 testing; template-filling is structured work |
| Codex MCP not yet available | Frontmatter is forward-compatible; profiles work independently |
| Agent body content corruption | Only frontmatter block (between `---` delimiters) is modified |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:dependencies -->
## Dependencies

- Spec 012/013: Haiku compatibility validation (completed)
- Spec 009: Claude Code sub-agents setup (completed)

<!-- /ANCHOR:dependencies -->

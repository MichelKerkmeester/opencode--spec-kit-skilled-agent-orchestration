---
title: "Implementation Summary: Spec 016 — Handover Haiku + Codex [016-handover-model-codex-compat/implementation-summary]"
description: "Added to .codex/config.toml"
trigger_phrases:
  - "implementation"
  - "summary"
  - "spec"
  - "016"
  - "handover"
  - "implementation summary"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary: Spec 016 — Handover Haiku + Codex Agent Conversion

<!-- ANCHOR:what-built -->
## Changes Made

### Phase 1: Handover Model Change (2 files)

| File | Change |
|------|--------|
| `.opencode/agent/handover.md` | `model: github-copilot/claude-sonnet-4.5` -> `model: github-copilot/claude-haiku-4.5` |
| `.claude/agents/handover.md` | `model: sonnet` -> `model: haiku` |

### Phase 2: Codex config.toml (1 file)

Added to `.codex/config.toml`:

**4 profiles** (all gpt-5.3 family, differentiated by variant and reasoning effort):

| Profile | Model | Reasoning Effort | Sandbox |
|---------|-------|-----------------|---------|
| `fast` | `gpt-5.3-codex-spark` | high | workspace-write |
| `balanced` | `gpt-5.3-codex` | high | workspace-write |
| `powerful` | `gpt-5.3-codex` | extra_high | workspace-write |
| `readonly` | `gpt-5.3-codex` | extra_high | read-only |

**MCP server**: `codex-specialized-subagents` for sub-agent dispatch via `delegate` tool.

### Phase 3: Codex Agent Frontmatter (8 files)

All `.codex/agents/*.md` files converted from Claude Code format to Codex-native:

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

Removed fields: `name`, `description`, `tools`, `model`, `mcpServers`
Added fields: `profile`, `approval_policy`, `sandbox_mode`

## Files Modified

| File | Action |
|------|--------|
| `.opencode/agent/handover.md` | Model field changed |
| `.claude/agents/handover.md` | Model field changed |
| `.codex/config.toml` | Profiles + MCP added |
| `.codex/agents/context.md` | Frontmatter replaced |
| `.codex/agents/handover.md` | Frontmatter replaced |
| `.codex/agents/speckit.md` | Frontmatter replaced |
| `.codex/agents/write.md` | Frontmatter replaced |
| `.codex/agents/debug.md` | Frontmatter replaced |
| `.codex/agents/research.md` | Frontmatter replaced |
| `.codex/agents/review.md` | Frontmatter replaced |
| `.codex/agents/orchestrate.md` | Frontmatter replaced |

**Total: 11 files modified**

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:decisions -->
## Design Decisions

1. **Uniform gpt-5.3 family**: All profiles use gpt-5.3 (no 5.1 or 5.2). `fast` uses the spark variant for speed.
2. **Reasoning effort differentiation**: fast/balanced = high, powerful/readonly = extra_high.
3. **Handover to Haiku**: Validated by spec 012/013 for structured template-filling tasks.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:limitations -->
## Lessons Learned

- Codex CLI has no native sub-agent system; profile-based dispatch via MCP is the viable path
- Claude Code YAML frontmatter fields are completely ignored by Codex (no partial parsing)
- Agent body content is platform-agnostic; only frontmatter needs per-platform adaptation
- Model differentiation is better achieved via reasoning effort and model variants than entirely separate model families

<!-- /ANCHOR:limitations -->

---
title: "Decision Record: Spec 016 — Handover Haiku + Codex Agent Conversion [016-handover-model-codex-compat/decision-record]"
description: "Status: Accepted"
trigger_phrases:
  - "decision"
  - "record"
  - "spec"
  - "016"
  - "handover"
  - "decision record"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Spec 016 — Handover Haiku + Codex Agent Conversion

<!-- ANCHOR:adr-001 -->
## ADR-001: Codex Agent Format Conversion

**Status:** Accepted
**Date:** 2026-02-16

<!-- ANCHOR:adr-001-context -->
### Context

The `.codex/agents/` directory contains 8 agent definition files using Claude Code YAML frontmatter format (`model:`, `tools:`, `mcpServers:`). Codex CLI does not parse this format, making these agents non-functional decorations.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Convert all `.codex/agents/*.md` frontmatter from Claude Code format to Codex-native profile-based format:
- Profiles in `config.toml` define model tiers (fast/balanced/powerful/readonly)
- `codex-specialized-subagents` MCP enables the `delegate` tool
- Agent files use `profile:`, `approval_policy:`, `sandbox_mode:` fields only

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Alternative | Pros | Cons |
|------------|------|------|
| Keep Claude Code format | No changes needed | Agents remain non-functional in Codex |
| Custom Codex plugin | Full control | Maintenance burden, no community support |
| Profile-based (chosen) | Native Codex mechanism, MCP dispatch | Requires MCP server for dispatch |

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- All 8 agent files become Codex-functional via profile references
- Body content preserved unchanged (instructions still valid)
- Forward-compatible with future Codex sub-agent improvements
- Claude Code YAML fields removed (Codex does not parse them)

<!-- /ANCHOR:adr-001-consequences -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Handover Agent Downgrade to Haiku

**Status:** Accepted
**Date:** 2026-02-16

<!-- ANCHOR:adr-002-context -->
### Context

The handover agent performs structured template-filling: reading spec folder files, extracting key information, and generating a handover.md document following a fixed 7-section template. This is a well-defined, low-creativity task.

<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

Downgrade handover from Sonnet to Haiku across all three platforms:
- Copilot: `github-copilot/claude-haiku-4.5`
- Claude Code: `haiku`
- Codex: `fast` profile (gpt-5.3-codex-spark)

<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Rationale

- Spec 012/013 validated Haiku adequacy for structured agent tasks
- Template-filling does not require Sonnet's reasoning depth
- Cost reduction and speed improvement
- Context agent already runs on Haiku successfully

### Alternatives Considered

| Alternative | Pros | Cons |
|------------|------|------|
| Keep Sonnet | Higher quality ceiling | Over-provisioned for template work |
| Haiku (chosen) | Cost + speed, validated adequate | Slightly lower quality ceiling |

<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- Handover generation is faster and cheaper
- Quality may decrease marginally for edge cases (complex spec folders)
- Consistent with context agent's Haiku deployment

<!-- /ANCHOR:adr-002-consequences -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Uniform gpt-5.3 Model Family with Reasoning Effort Differentiation

**Status:** Accepted
**Date:** 2026-02-16

<!-- ANCHOR:adr-003-context -->
### Context

Initial plan used three different Codex model tiers (gpt-5.1-codex-mini, gpt-5.2-codex, gpt-5.3-codex). After review, decided to standardize on the gpt-5.3 family across all profiles.

<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

All profiles use gpt-5.3 family. Differentiation is via:
- **Model variant**: `fast` uses `gpt-5.3-codex-spark` (lighter variant); all others use `gpt-5.3-codex`
- **Reasoning effort**: fast/balanced = `high`; powerful/readonly = `extra_high`

| Profile | Model | Reasoning Effort |
|---------|-------|-----------------|
| `fast` | `gpt-5.3-codex-spark` | high |
| `balanced` | `gpt-5.3-codex` | high |
| `powerful` | `gpt-5.3-codex` | extra_high |
| `readonly` | `gpt-5.3-codex` | extra_high |

<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Rationale

- Ensures consistent capability baseline across all agents
- Spark variant provides speed for fast-profile tasks without sacrificing model generation
- Reasoning effort provides the primary differentiation lever
- Review (readonly) benefits from extra_high reasoning for thorough analysis

<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- Higher baseline quality across all agents
- Cost slightly higher for fast/balanced tasks vs original mini/standard models
- Simpler mental model: one model family, two differentiation levers

<!-- /ANCHOR:adr-003-consequences -->

<!-- /ANCHOR:adr-003 -->

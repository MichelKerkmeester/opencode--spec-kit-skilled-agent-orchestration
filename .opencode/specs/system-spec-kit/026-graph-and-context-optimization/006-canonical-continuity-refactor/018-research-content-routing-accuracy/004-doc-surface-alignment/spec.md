---
title: "Doc Surface Alignment: Content Routing Changes"
status: planned
level: 2
type: implementation
parent: 018-research-content-routing-accuracy
created: 2026-04-13
---

# Doc Surface Alignment: Content Routing Changes

Update all documentation surfaces affected by the 018 content routing implementation:
- Delivery cues strengthened (sequencing/gating regex + progress-floor guard)
- Handover/drop boundary fixed (hard-drop vs soft-ops split)
- Tier3 LLM classifier wired into save handler (env-gated SPECKIT_TIER3_ROUTING)
- 8 hard rules (documentation said 7)

## Surfaces to Check

### README.md / ARCHITECTURE.md
- Does ARCHITECTURE.md describe the content routing pipeline? Update tier count and Tier3 wiring.

### Commands
- `.opencode/command/memory/save.md` - describes save routing behavior. Must mention:
  - 8 routing categories (not 7)
  - 3-tier system with Tier3 now wired (env-gated)
  - routeAs override behavior
  - SPECKIT_TIER3_ROUTING env var
- `.opencode/command/memory/manage.md` - any routing references?

### Agent definitions
- `AGENTS.md` - memory save instructions mention routing?
- `CLAUDE.md` - save workflow references?
- `.opencode/agent/speckit.md` - save behavior?

### Skill files
- `.opencode/skill/system-spec-kit/SKILL.md` - describes content routing in detail. Must reflect:
  - 8 categories
  - Tier3 is now live (behind env var)
  - Delivery/progress confusion fixed
  - Handover/drop boundary fixed

### Skill references
- Any routing reference docs in `.opencode/skill/system-spec-kit/references/`?

### MCP configs
- All 5 MCP configs - should SPECKIT_TIER3_ROUTING be documented as an available env var?

### Feature catalog / Manual testing playbook
- Routing-related scenarios need updated category counts and Tier3 coverage

## Rules
- Only update docs that actually reference routing behavior
- Be specific about the SPECKIT_TIER3_ROUTING env var
- Don't change the env var default (off by default, opt-in)

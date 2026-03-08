---
title: "Implementation Summary: Create mcp-clickup Skill"
status: complete
completed: 2026-03-08
---

# Implementation Summary: Create mcp-clickup Skill

## What Was Done

Created a complete `mcp-clickup` skill following the hybrid CLI+MCP pattern from `mcp-chrome-devtools`, providing intelligent routing between ClickUp CLI (cu, 30+ commands) and ClickUp MCP Server (46 tools via Code Mode).

## Files Created (7 new)

| File | Words | Purpose |
|------|-------|---------|
| `.opencode/skill/mcp-clickup/SKILL.md` | 2,722 | AI-facing entry point with 8 sections |
| `.opencode/skill/mcp-clickup/README.md` | ~2,400 | User-facing documentation |
| `.opencode/skill/mcp-clickup/INSTALL_GUIDE.md` | ~900 | Dual CLI+MCP installation guide |
| `.opencode/skill/mcp-clickup/references/tool_reference.md` | ~1,600 | 46 MCP tools reference |
| `.opencode/skill/mcp-clickup/references/cli_reference.md` | ~800 | 30+ CLI commands reference |
| `.opencode/skill/mcp-clickup/references/workflows.md` | ~1,000 | Combined CLI+MCP workflow patterns |
| `.opencode/skill/mcp-clickup/assets/tool_categories.md` | ~900 | HIGH/MEDIUM/LOW priority matrix |

## Files Modified (2)

| File | Change |
|------|--------|
| `.opencode/skill/scripts/skill_advisor.py` | Route "clickup" to `mcp-clickup` (was `mcp-code-mode`); added 5 new keyword entries + tooling boost |
| `.opencode/skill/README.md` | Updated count 15->16, added catalog entry, structure tree, folder signals, related link |

## Verification Results

| Check | Result |
|-------|--------|
| `skill_advisor.py "clickup"` | Routes to `mcp-clickup` (confidence: 0.95) |
| Skill directory exists | 5 items (SKILL.md, README.md, INSTALL_GUIDE.md, references/, assets/) |
| Symlink resolves | `.claude/skills/mcp-clickup/` accessible via directory symlink |
| SKILL.md word count | 2,722 (< 5,000 target) |
| All 8 SKILL.md sections | Present with anchor comments |
| Skills README count | 16 (updated from 15) |

## Key Design Decisions

1. **Hybrid CLI+MCP pattern**: Matched `mcp-chrome-devtools` approach rather than MCP-only like `mcp-figma`
2. **CLI priority**: CLI for daily task ops (faster, lower tokens); MCP for enterprise features (docs, goals, webhooks, time tracking, chat, bulk ops)
3. **46 MCP tools categorized**: 8 HIGH, 19 MEDIUM, 19 LOW priority
4. **PATH conflict documented**: System `cu` (UUCP) vs ClickUp CLI conflict addressed in install guide
5. **Node version split**: CLI requires >= 22, MCP works with >= 18

## Not Implemented

- ClickUp CLI not installed globally (documented in INSTALL_GUIDE.md)
- No changes to MCP server code (already configured in `.utcp_config.json`)

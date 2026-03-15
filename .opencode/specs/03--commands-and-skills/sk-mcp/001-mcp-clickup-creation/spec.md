---
title: "Create mcp-clickup Skill"
status: complete
level: 2
created: 2026-03-08
scope: ".opencode/skill/mcp-clickup/"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Create mcp-clickup Skill

<!-- ANCHOR:metadata -->
## Problem

No unified ClickUp skill exists. Currently "clickup" routes to `mcp-code-mode` as a generic fallback (skill_advisor.py:373). Two dedicated ClickUp tools are available but lack a proper orchestration skill:
- **clickup-cli** (`@krodak/clickup-cli` v0.13.0) - MIT, CLI-first, agent-optimized with Markdown output, 30+ commands
- **clickup-mcp-server** (`@taazkareem/clickup-mcp-server` v0.13.1) - MCP server with 46 tools via Code Mode

<!-- /ANCHOR:metadata -->
## Scope

Create a proper `mcp-clickup` skill following the hybrid CLI+MCP pattern (like `mcp-chrome-devtools`), aligned with existing MCP skill standards and sk-doc conventions.

### In Scope

- Skill directory: `.opencode/skill/mcp-clickup/` with SKILL.md, README.md, INSTALL_GUIDE.md, references/, assets/
- Skill routing registration in `skill_advisor.py`
- Skills catalog update in `.opencode/skill/README.md`
- Changelog entry

### Out of Scope

- CLI installation (documented in INSTALL_GUIDE.md but not executed)
- MCP server code changes (already configured in `.utcp_config.json`)
- Changes to `mcp-code-mode` skill

## Success Criteria

1. `python3 .opencode/skill/scripts/skill_advisor.py "clickup" --threshold 0.8` routes to `mcp-clickup`
2. Skill directory contains all required files (SKILL.md, README.md, INSTALL_GUIDE.md, 3 references, 1 asset)
3. Symlink resolves: `.claude/skills/mcp-clickup/` accessible
4. Skills README updated with new count and catalog entry
5. SKILL.md < 5000 words
6. All H2 sections have anchor comments

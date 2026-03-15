---
title: "Checklist: Create mcp-clickup Skill"
status: complete
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: Create mcp-clickup Skill

<!-- ANCHOR:protocol -->
## P0 - Critical (Must Pass)

- [x] SKILL.md exists at `.opencode/skill/mcp-clickup/SKILL.md`
- [x] SKILL.md has valid frontmatter (name, description, allowed-tools, version)
- [x] SKILL.md has all 8 sections with anchor comments
- [x] README.md has trigger_phrases frontmatter
- [x] `skill_advisor.py "clickup"` routes to `mcp-clickup` (not `mcp-code-mode`)
- [x] Symlink resolves: `.claude/skills/mcp-clickup/` accessible
- [x] Skills README count updated (15 -> 16)
- [x] Skills README catalog entry added

<!-- /ANCHOR:protocol -->
## P1 - Important (Should Pass)

- [x] INSTALL_GUIDE.md covers both CLI and MCP installation
- [x] references/tool_reference.md documents 46 MCP tools
- [x] references/cli_reference.md documents 30+ CLI commands
- [x] references/workflows.md has combined CLI+MCP patterns
- [x] assets/tool_categories.md has HIGH/MEDIUM/LOW classification
- [x] CLI vs MCP decision matrix in SKILL.md
- [x] Smart routing pseudocode in SKILL.md
- [x] Changelog entry created

## P2 - Nice to Have

- [x] SKILL.md < 5000 words
- [x] Cross-tool workflow examples (Figma -> ClickUp, ClickUp -> Git)
- [x] PATH troubleshooting for system `cu` conflict documented
- [x] Code Mode naming convention documented (`clickup.clickup_{tool_name}`)
- [x] Current Folder Signals table updated in Skills README

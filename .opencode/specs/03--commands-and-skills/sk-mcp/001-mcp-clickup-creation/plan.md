---
title: "Plan: Create mcp-clickup Skill"
status: complete
---

# Plan: Create mcp-clickup Skill

## Approach

Follow the hybrid CLI+MCP pattern established by `mcp-chrome-devtools` skill, adapted for ClickUp's two tools.

## Steps

### Step 1: Verify Tool Installation
- Check ClickUp CLI (`cu`) availability
- Verify MCP server config in `.utcp_config.json`

### Step 2: Create Spec Folder Artifacts (Level 2)
- spec.md, plan.md, tasks.md, checklist.md
- implementation-summary.md after completion

### Step 3: Create Skill Directory Structure
```
.opencode/skill/mcp-clickup/
├── SKILL.md
├── README.md
├── INSTALL_GUIDE.md
├── references/
│   ├── tool_reference.md
│   ├── cli_reference.md
│   └── workflows.md
└── assets/
    └── tool_categories.md
```

### Step 4: Create SKILL.md
- 8-section format with anchor comments
- CLI vs MCP decision matrix
- Smart routing pseudocode

### Step 5: Create README.md
- User-facing with trigger_phrases frontmatter
- TOC, overview, quick start, features, config, examples, troubleshooting

### Step 6: Create INSTALL_GUIDE.md
- Two installation paths: CLI (npm) and MCP (Code Mode)

### Step 7: Create Reference Documents
- tool_reference.md: 46 MCP tools by category
- cli_reference.md: 30+ CLI commands with flags
- workflows.md: Combined CLI+MCP patterns

### Step 8: Create Asset
- tool_categories.md: HIGH/MEDIUM/LOW priority matrix

### Step 9: Update Registration
- skill_advisor.py: Route "clickup" to mcp-clickup
- Skills README: Update count and catalog

### Step 10: Create Changelog Entry

### Step 11: Post-Implementation
- Verify routing, symlinks, file structure
- Complete checklist, implementation-summary

## Pattern Sources

| Pattern | Source File |
|---------|------------|
| Hybrid CLI+MCP | `mcp-chrome-devtools/SKILL.md` |
| MCP-only | `mcp-figma/SKILL.md` |
| README | `mcp-figma/README.md` |
| Install guide | `mcp-figma/INSTALL_GUIDE.md` |
| Tool categories | `mcp-figma/assets/tool_categories.md` |

---
title: "Tasks: Create mcp-clickup Skill"
status: complete
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Create mcp-clickup Skill

<!-- ANCHOR:notation -->
## Task Breakdown

### T001: Verify Tool Installation
- [x] Check CLI (`cu`) availability
- [x] Verify MCP config in `.utcp_config.json` (lines 50-68)
- **Result**: CLI not installed globally (system `cu` is UUCP). MCP config exists.

### T002: Create Spec Folder Artifacts
- [x] spec.md
- [x] plan.md
- [x] tasks.md (this file)
- [x] checklist.md

### T003: Create Skill Directory
- [x] `mkdir -p .opencode/skill/mcp-clickup/{references,assets}`

### T004: Create SKILL.md
- [x] 8-section format with anchor comments
- [x] CLI vs MCP decision matrix
- [x] Smart routing pseudocode
- [x] ALWAYS/NEVER/ESCALATE rules

### T005: Create README.md
- [x] trigger_phrases frontmatter
- [x] TOC, overview, quick start, structure, features
- [x] Configuration, naming convention, examples
- [x] Troubleshooting, FAQ, related documents

### T006: Create INSTALL_GUIDE.md
- [x] CLI installation (npm, Homebrew)
- [x] MCP configuration (Code Mode)
- [x] PATH troubleshooting for system `cu` conflict
- [x] Verification checklist

### T007: Create Reference Documents
- [x] references/tool_reference.md (46 MCP tools)
- [x] references/cli_reference.md (30+ CLI commands)
- [x] references/workflows.md (combined patterns)

### T008: Create Asset
- [x] assets/tool_categories.md (HIGH/MEDIUM/LOW matrix)

### T009: Update Registration
- [x] skill_advisor.py: Route "clickup" to mcp-clickup + add entries
- [x] Skills README: Update count (15 -> 16) and catalog

### T010: Create Changelog Entry
- [x] changelog/16--mcp-clickup/v1.0.0.md

### T011: Post-Implementation
- [x] Verify routing: `skill_advisor.py "clickup"` -> mcp-clickup
- [x] Verify symlink: `.claude/skills/mcp-clickup/` resolves
- [x] Complete checklist.md
- [x] Create implementation-summary.md
<!-- /ANCHOR:notation -->

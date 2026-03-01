---
title: "Spec: Figma MCP Install Guide & Skill Creation [001-initial-creation/spec]"
description: "The project has MCP skills for Narsil and Code Mode, but lacks dedicated documentation for the Figma MCP server. Users need"
trigger_phrases:
  - "spec"
  - "figma"
  - "mcp"
  - "install"
  - "guide"
  - "013"
  - "initial"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3 -->

<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Spec: Figma MCP Install Guide & Skill Creation

> **Status:** Draft | **Level:** 3 | **LOC Estimate:** 2000+

---

<!-- ANCHOR:problem -->
## 1. Problem Statement

The project has MCP skills for Narsil and Code Mode, but lacks dedicated documentation for the Figma MCP server. Users need:

1. **Install guide** - Step-by-step instructions for setting up Figma MCP through Code Mode
2. **Skill documentation** - Structured guidance for using Figma MCP's 18 tools effectively

Currently, Figma MCP is configured in `.utcp_config.json` but has no:
- Dedicated install guide in `.opencode/install_guides/MCP/`
- Skill folder in `.opencode/skill/`
- Tool reference documentation
- Quick start guide
- Priority classification for tools

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 2. Scope

### In Scope

| Deliverable | Description |
|-------------|-------------|
| Install Guide | `.opencode/install_guides/MCP/MCP - Figma.md` (~800-1000 lines) |
| SKILL.md | `.opencode/skill/mcp-figma/SKILL.md` (~400-500 lines) |
| README.md | `.opencode/skill/mcp-figma/README.md` (~100 lines) |
| Tool Reference | `.opencode/skill/mcp-figma/references/tool_reference.md` (~300 lines) |
| Quick Start | `.opencode/skill/mcp-figma/references/quick_start.md` (~150 lines) |
| Tool Categories | `.opencode/skill/mcp-figma/assets/tool_categories.md` (~150 lines) |

### Out of Scope

- Modifying existing `.utcp_config.json` configuration
- Creating new Figma MCP tools or functionality
- Integration with other design tools (Sketch, Adobe XD)
- Figma plugin development documentation

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 3. Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Install guide follows 11-section template from sk-doc | P0 |
| FR-2 | SKILL.md follows mcp-narsil/mcp-code-mode pattern | P0 |
| FR-3 | All 18 Figma tools documented with TypeScript interfaces | P0 |
| FR-4 | Naming pattern `figma.figma_{tool_name}` documented correctly | P0 |
| FR-5 | Phase validation checkpoints in install guide | P0 |
| FR-6 | 5+ practical examples in install guide | P1 |
| FR-7 | Quick start guide achievable in 5 minutes | P1 |
| FR-8 | Troubleshooting covers 5+ common errors | P1 |
| FR-9 | Tool priority classification (HIGH/MEDIUM/LOW) | P1 |
| FR-10 | Cross-references to mcp-code-mode skill | P1 |

### Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Documentation follows DQI standards (target: 90+ Excellent) |
| NFR-2 | All code examples are copy-pasteable and tested |
| NFR-3 | Consistent formatting with existing install guides |
| NFR-4 | Keywords in SKILL.md for skill advisor discoverability |

<!-- /ANCHOR:requirements -->

---

## 4. Figma MCP Tool Inventory

**Total: 18 tools**

### File Management (4)
- `set_api_key` - Set Figma API key
- `check_api_key` - Verify API key is valid
- `get_file` - Get Figma file by key
- `get_file_nodes` - Get specific nodes from a file

### Images (2)
- `get_image` - Render nodes as images (jpg/png/svg/pdf)
- `get_image_fills` - Get URLs for images used in file

### Comments (3)
- `get_comments` - Get comments on a file
- `post_comment` - Post a comment
- `delete_comment` - Delete a comment

### Team & Projects (2)
- `get_team_projects` - Get projects for a team
- `get_project_files` - Get files in a project

### Components (4)
- `get_file_components` - Get components from a file
- `get_component` - Get a specific component
- `get_team_components` - Get team components
- `get_team_component_sets` - Get team component sets

### Styles (3)
- `get_file_styles` - Get styles from a file
- `get_style` - Get a specific style
- `get_team_styles` - Get team styles

---

<!-- ANCHOR:success-criteria -->
## 5. Success Criteria

| Criterion | Validation Method |
|-----------|-------------------|
| Install guide passes DQI validation | Run `extract_structure.py` → Score ≥90 |
| SKILL.md has valid frontmatter | YAML parsing succeeds |
| All 18 tools documented | Manual count verification |
| Examples execute successfully | Test via Code Mode |
| Skill discoverable by advisor | Run `skill_advisor.py` with Figma keywords |

<!-- /ANCHOR:success-criteria -->

---

## 6. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| mcp-code-mode skill | Required | ✅ Exists |
| .utcp_config.json with Figma | Required | ✅ Configured |
| sk-doc skill | Template source | ✅ Exists |
| mcp-narsil skill | Pattern reference | ✅ Exists |

---

<!-- ANCHOR:risks -->
## 7. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Figma API changes | Tool interfaces outdated | Document version, link to official docs |
| Token efficiency claims | Misleading if inaccurate | Use verified metrics from mcp-code-mode |
| Tool naming confusion | User errors | Emphasize pattern in multiple sections |

<!-- /ANCHOR:risks -->

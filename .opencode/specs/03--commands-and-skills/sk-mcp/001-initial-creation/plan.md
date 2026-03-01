---
title: "Plan: Figma MCP Install Guide & Skill Creation [001-initial-creation/plan]"
description: "1. Load templates from sk-doc skill"
trigger_phrases:
  - "plan"
  - "figma"
  - "mcp"
  - "install"
  - "guide"
  - "013"
  - "initial"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: Figma MCP Install Guide & Skill Creation

> **Spec:** [spec.md](./spec.md) | **Status:** Draft

---

<!-- ANCHOR:summary -->
## 1. Implementation Approach

### Strategy: Template-First, Pattern-Matching

1. **Load templates** from sk-doc skill
2. **Match patterns** from existing mcp-narsil and mcp-code-mode skills
3. **Adapt content** for Figma MCP's 18 tools
4. **Validate alignment** against templates before delivery

### Execution Order

```
Phase 1: Install Guide
├── Load install_guide_template.md
├── Create MCP - Figma.md structure
├── Document all 18 tools
├── Add 5+ examples
└── Validate with extract_structure.py

Phase 2: Skill Structure
├── Create folder structure
├── Write SKILL.md (pattern: mcp-narsil)
├── Write tool_reference.md
├── Write quick_start.md
├── Write tool_categories.md
└── Write README.md

Phase 3: Validation
├── Run DQI scoring on all files
├── Test examples via Code Mode
├── Verify skill advisor discovery
└── Update checklist.md
```

<!-- /ANCHOR:summary -->

---

## 2. File Structure

### Install Guide

**Path:** `.opencode/install_guides/MCP/MCP - Figma.md`

```markdown
# MCP Figma Installation Guide

[H1 description - 2-4 sentences]

---

## AI Install Guide (Section 0)
## 1. Overview
## 2. Prerequisites
## 3. Installation
## 4. Configuration
## 5. Verification
## 6. Usage
## 7. Features (18 tools)
## 8. Examples (5-6 scenarios)
## 9. Troubleshooting
## 10. Resources
```

### Skill Structure

**Path:** `.opencode/skill/mcp-figma/`

```
mcp-figma/
├── SKILL.md
│   ├── Frontmatter (name, description, allowed-tools, version)
│   ├── Keywords comment
│   ├── 1. Overview
│   ├── 2. Smart Routing
│   ├── 3. How It Works
│   ├── 4. Rules (ALWAYS/NEVER/ESCALATE)
│   ├── 5. Success Criteria
│   ├── 6. Integration Points
│   └── 7. Related Resources
│
├── README.md
│   └── GitHub-visible overview
│
├── references/
│   ├── tool_reference.md
│   │   └── All 18 tools with interfaces
│   └── quick_start.md
│       └── 5-minute getting started
│
└── assets/
    └── tool_categories.md
        └── Priority classification (HIGH/MEDIUM/LOW)
```

---

## 3. Content Specifications

### Install Guide Sections

| Section | Key Content | Source |
|---------|-------------|--------|
| AI Install Guide | Copy-paste prompt for AI-assisted setup | Template |
| Overview | 18 tools, architecture diagram, value proposition | Analysis |
| Prerequisites | Node.js 18+, Figma PAT, Code Mode configured | Template |
| Installation | .utcp_config.json entry, .env setup | Existing config |
| Configuration | OpenCode, Claude Code, Claude Desktop | Template |
| Verification | `search_tools()`, `list_tools()`, test call | Pattern |
| Usage | Naming pattern, basic workflow | mcp-code-mode |
| Features | All 18 tools with parameters | tool_info() |
| Examples | 5-6 real scenarios | New content |
| Troubleshooting | Error table (5+ entries) | Template |
| Resources | Links, file paths | Template |

### SKILL.md Sections

| Section | Key Content | Pattern Source |
|---------|-------------|----------------|
| Frontmatter | name, description, allowed-tools, version | mcp-narsil |
| Keywords | figma, design, components, styles, images | New |
| Overview | When to use, use cases, when NOT to use | mcp-narsil |
| Smart Routing | Resource router pseudocode | mcp-narsil |
| How It Works | Code Mode invocation, naming pattern | mcp-code-mode |
| Rules | ALWAYS/NEVER/ESCALATE guidelines | mcp-narsil |
| Success Criteria | Validation checkpoints | mcp-narsil |
| Integration Points | mcp-code-mode dependency | mcp-narsil |
| Related Resources | Bundled file references | mcp-narsil |

---

<!-- ANCHOR:architecture -->
## 4. Tool Priority Classification

### HIGH Priority (5 tools)
Core design file access - use actively

| Tool | Rationale |
|------|-----------|
| `get_file` | Primary file access |
| `get_file_nodes` | Targeted node extraction |
| `get_image` | Asset export |
| `get_file_components` | Component discovery |
| `get_file_styles` | Style extraction |

### MEDIUM Priority (7 tools)
Useful but situational

| Tool | Rationale |
|------|-----------|
| `get_comments` | Collaboration |
| `post_comment` | Feedback workflow |
| `get_team_projects` | Project discovery |
| `get_project_files` | File listing |
| `get_component` | Specific component |
| `get_style` | Specific style |
| `get_image_fills` | Image URL extraction |

### LOW Priority (6 tools)
Rarely needed

| Tool | Rationale |
|------|-----------|
| `set_api_key` | One-time setup |
| `check_api_key` | Debugging only |
| `delete_comment` | Rare operation |
| `get_team_components` | Team-level (less common) |
| `get_team_component_sets` | Team-level (less common) |
| `get_team_styles` | Team-level (less common) |

<!-- /ANCHOR:architecture -->

---

## 5. Example Scenarios

### Example 1: Get Design File Structure
```typescript
// Get file and list top-level frames
const file = await figma.figma_get_file({ fileKey: "abc123" });
console.log(file.document.children.map(c => c.name));
```

### Example 2: Export Component as PNG
```typescript
// Export specific node as image
const image = await figma.figma_get_image({
  fileKey: "abc123",
  ids: ["1:234"],
  format: "png",
  scale: 2
});
```

### Example 3: Get Design System Components
```typescript
// List all components in a file
const components = await figma.figma_get_file_components({
  fileKey: "abc123"
});
```

### Example 4: Add Review Comment
```typescript
// Post comment on specific node
await figma.figma_post_comment({
  fileKey: "abc123",
  message: "Ready for development",
  client_meta: { node_id: "1:234" }
});
```

### Example 5: Multi-Tool Workflow
```typescript
// Get file → Extract components → Export images
const file = await figma.figma_get_file({ fileKey: "abc123" });
const components = await figma.figma_get_file_components({ fileKey: "abc123" });
const images = await figma.figma_get_image({
  fileKey: "abc123",
  ids: components.meta.components.slice(0, 5).map(c => c.node_id),
  format: "svg"
});
```

---

## 6. Validation Plan

### Phase 1: Install Guide Validation

```bash
# Run DQI scoring
python3 .opencode/skill/sk-doc/scripts/extract_structure.py \
  .opencode/install_guides/MCP/MCP\ -\ Figma.md

# Target: Score ≥90 (Excellent)
```

### Phase 2: Skill Validation

```bash
# Validate SKILL.md frontmatter
python3 -c "import yaml; yaml.safe_load(open('.opencode/skill/mcp-figma/SKILL.md').read().split('---')[1])"

# Test skill advisor discovery
python3 .opencode/scripts/skill_advisor.py "figma design components"
```

### Phase 3: Example Validation

```typescript
// Test in Code Mode
call_tool_chain({
  code: `
    const tools = await search_tools({ task_description: "figma" });
    console.log(tools.filter(t => t.name.includes('figma')));
  `
});
```

---

## 7. Timeline Estimate

| Phase | Deliverables | Estimated Time |
|-------|--------------|----------------|
| Phase 1 | Install Guide | 45-60 min |
| Phase 2 | Skill Structure (5 files) | 30-45 min |
| Phase 3 | Validation & Fixes | 15-20 min |
| **Total** | **7 files** | **~2 hours** |

---

## 8. Key Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Code Mode only | Token efficiency, unified access | Native MCP (rejected: context overhead) |
| Pattern: mcp-narsil | Most comprehensive existing skill | mcp-code-mode (less detailed) |
| 5 HIGH priority tools | Core design access needs | All tools HIGH (rejected: dilutes priority) |
| Include team-level tools | Completeness | Exclude (rejected: incomplete coverage) |

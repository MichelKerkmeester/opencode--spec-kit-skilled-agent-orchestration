---
title: Figma Tool Reference - Complete Guide
description: Complete documentation for all 18 Figma MCP tools, organized by category with priority levels and usage guidance.
---

# Figma Tool Reference - Complete Guide

Complete reference for all 18 Figma MCP tools organized by category and priority level.

---

## 1. OVERVIEW

### Core Principle

Figma MCP provides design file access - FILES, IMAGES, COMPONENTS, STYLES, and COLLABORATION.

### Tool Distribution

| Category | Count | Priority |
|----------|-------|----------|
| File Management | 4 | HIGH/LOW |
| Images | 2 | HIGH |
| Comments | 3 | MEDIUM |
| Team & Projects | 2 | MEDIUM |
| Components | 4 | HIGH/MEDIUM |
| Styles | 3 | HIGH/MEDIUM |
| **Total** | **18** | |

### Priority Definitions

| Priority | Description | Action |
|----------|-------------|--------|
| **HIGH** | Core functionality, frequently used | Use actively |
| **MEDIUM** | Useful but situational | Use when needed |
| **LOW** | Rarely needed | Use sparingly |

---

## 2. HIGH PRIORITY TOOLS (5 tools)

### File Management

#### `figma_get_file`
**Priority: HIGH** | Get a complete Figma file by key.

```typescript
await figma.figma_get_file({
  fileKey: "abc123",      // Required: File key from URL
  version: "123456",      // Optional: Specific version ID
  depth: 2,               // Optional: Node depth (1-4)
  branch_data: true       // Optional: Include branch info
});
```

**Returns**: Complete file structure with document, pages, and nodes.

**Use when**: Starting any Figma workflow, need file overview.

---

#### `figma_get_file_nodes`
**Priority: HIGH** | Get specific nodes from a file.

```typescript
await figma.figma_get_file_nodes({
  fileKey: "abc123",           // Required: File key
  node_ids: ["1:2", "3:4"],    // Required: Array of node IDs
  depth: 2,                    // Optional: Node depth (1-4)
  version: "123456"            // Optional: Version ID
});
```

**Returns**: Requested nodes with their children.

**Use when**: Need specific elements, not entire file.

---

### Images

#### `figma_get_image`
**Priority: HIGH** | Render nodes as images.

```typescript
await figma.figma_get_image({
  fileKey: "abc123",           // Required: File key
  ids: ["1:2", "3:4"],         // Required: Node IDs to render
  scale: 2,                    // Optional: Scale (0.01-4)
  format: "png",               // Optional: jpg, png, svg, pdf
  svg_include_id: true,        // Optional: IDs in SVG output
  svg_simplify_stroke: false,  // Optional: Simplify SVG strokes
  use_absolute_bounds: false   // Optional: Use absolute bounds
});
```

**Returns**: Object with node IDs mapped to image URLs.

**Use when**: Exporting design assets, generating previews.

---

### Components

#### `figma_get_file_components`
**Priority: HIGH** | Get all components from a file.

```typescript
await figma.figma_get_file_components({
  fileKey: "abc123"            // Required: File key
});
```

**Returns**: Component metadata including names, keys, and node IDs.

**Use when**: Documenting design systems, listing available components.

---

### Styles

#### `figma_get_file_styles`
**Priority: HIGH** | Get all styles from a file.

```typescript
await figma.figma_get_file_styles({
  fileKey: "abc123"            // Required: File key
});
```

**Returns**: Style metadata including names, keys, and types (FILL, TEXT, EFFECT, GRID).

**Use when**: Extracting design tokens, documenting style guide.

---

## 3. MEDIUM PRIORITY TOOLS (7 tools)

### Images

#### `figma_get_image_fills`
**Priority: MEDIUM** | Get URLs for images used in a file.

```typescript
await figma.figma_get_image_fills({
  fileKey: "abc123"            // Required: File key
});
```

**Returns**: Object mapping image references to URLs.

**Use when**: Need embedded images, not rendered exports.

---

### Comments

#### `figma_get_comments`
**Priority: MEDIUM** | Get all comments on a file.

```typescript
await figma.figma_get_comments({
  fileKey: "abc123"            // Required: File key
});
```

**Returns**: Array of comments with user, message, and position.

**Use when**: Reading design feedback, tracking discussions.

---

#### `figma_post_comment`
**Priority: MEDIUM** | Post a comment on a file.

```typescript
await figma.figma_post_comment({
  fileKey: "abc123",           // Required: File key
  message: "Great work!",      // Required: Comment text
  client_meta: {               // Optional: Position
    node_id: "1:2",
    node_offset: { x: 100, y: 50 }
  },
  comment_id: "456"            // Optional: Reply to comment
});
```

**Returns**: Created comment with ID and metadata.

**Use when**: Providing design feedback, automated reviews.

---

### Team & Projects

#### `figma_get_team_projects`
**Priority: MEDIUM** | Get projects for a team.

```typescript
await figma.figma_get_team_projects({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

**Returns**: Array of projects with names and IDs.

**Use when**: Navigating team structure, finding projects.

---

#### `figma_get_project_files`
**Priority: MEDIUM** | Get files in a project.

```typescript
await figma.figma_get_project_files({
  project_id: "789",           // Required: Project ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page",         // Optional: Pagination cursor
  branch_data: true            // Optional: Include branches
});
```

**Returns**: Array of files with names, keys, and thumbnails.

**Use when**: Listing project contents, finding specific files.

---

### Components

#### `figma_get_component`
**Priority: MEDIUM** | Get a specific component by key.

```typescript
await figma.figma_get_component({
  key: "component_key"         // Required: Component key
});
```

**Returns**: Component details including name, description, and metadata.

**Use when**: Need specific component details, not full list.

---

### Styles

#### `figma_get_style`
**Priority: MEDIUM** | Get a specific style by key.

```typescript
await figma.figma_get_style({
  key: "style_key"             // Required: Style key
});
```

**Returns**: Style details including name, type, and properties.

**Use when**: Need specific style details, not full list.

---

## 4. LOW PRIORITY TOOLS (6 tools)

### File Management

#### `figma_set_api_key`
**Priority: LOW** | Set your Figma API key.

```typescript
await figma.figma_set_api_key({
  api_key: "figd_your_token"   // Required: Your PAT
});
```

**Returns**: Confirmation of key storage.

**Use when**: Initial setup, changing tokens. Usually done via .env instead.

---

#### `figma_check_api_key`
**Priority: LOW** | Check if an API key is configured.

```typescript
await figma.figma_check_api_key({});
```

**Returns**: Boolean indicating if key is set.

**Use when**: Debugging authentication issues.

---

### Comments

#### `figma_delete_comment`
**Priority: LOW** | Delete a comment.

```typescript
await figma.figma_delete_comment({
  fileKey: "abc123",           // Required: File key
  comment_id: "456"            // Required: Comment ID
});
```

**Returns**: Confirmation of deletion.

**Use when**: Removing outdated or incorrect comments.

---

### Components

#### `figma_get_team_components`
**Priority: LOW** | Get all components for a team.

```typescript
await figma.figma_get_team_components({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

**Returns**: Array of team components.

**Use when**: Need team-wide component inventory.

---

#### `figma_get_team_component_sets`
**Priority: LOW** | Get component sets for a team.

```typescript
await figma.figma_get_team_component_sets({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

**Returns**: Array of component sets (variants).

**Use when**: Need team-wide component set inventory.

---

### Styles

#### `figma_get_team_styles`
**Priority: LOW** | Get all styles for a team.

```typescript
await figma.figma_get_team_styles({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

**Returns**: Array of team styles.

**Use when**: Need team-wide style inventory.

---

## 5. TOOL SELECTION DECISION TREE

```
User Request
     │
     ├─► "Get Figma file" / "Design structure"
     │   └─► Use: figma_get_file
     │
     ├─► "Get specific node" / "Element by ID"
     │   └─► Use: figma_get_file_nodes
     │
     ├─► "Export image" / "PNG/SVG/PDF"
     │   └─► Use: figma_get_image
     │
     ├─► "Get components" / "Design system"
     │   └─► Use: figma_get_file_components
     │
     ├─► "Get styles" / "Design tokens"
     │   └─► Use: figma_get_file_styles
     │
     ├─► "Comments" / "Feedback"
     │   └─► Use: figma_get_comments, figma_post_comment
     │
     └─► "Team projects" / "Project files"
         └─► Use: figma_get_team_projects, figma_get_project_files
```

### Quick Reference by Task

| Task | Primary Tool | Secondary Tool |
|------|--------------|----------------|
| Get file structure | `get_file` | `get_file_nodes` |
| Export assets | `get_image` | `get_image_fills` |
| List components | `get_file_components` | `get_component` |
| Extract tokens | `get_file_styles` | `get_style` |
| Read feedback | `get_comments` | - |
| Post feedback | `post_comment` | - |
| Navigate team | `get_team_projects` | `get_project_files` |

---

## 6. RELATED RESOURCES

### Guides

- [quick_start.md](./quick_start.md) - Getting started in 5 minutes

### Assets

- [tool_categories.md](../assets/tool_categories.md) - Priority categorization

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions


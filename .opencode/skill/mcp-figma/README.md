---
title: "Figma MCP"
description: "Programmatic access to Figma design files through 18 specialized tools via Code Mode for token-efficient workflows."
trigger_phrases:
  - "figma"
  - "design files"
  - "figma mcp"
---

# Figma MCP

> Programmatic access to Figma design files through **18 specialized tools**. Get files, export images, extract components and styles, manage team projects and handle collaborative comments. Accessed via **Code Mode** for token-efficient workflows.

> **Navigation**:
> - New to Figma MCP? Start with [Quick Start](#2--quick-start)
> - Need tool overview? See [Features](#4--features)
> - Configuration help? See [Configuration](#5--configuration)
> - Troubleshooting? See [Troubleshooting](#9--troubleshooting)

[![npm](https://img.shields.io/npm/v/figma-developer-mcp.svg)](https://www.npmjs.com/package/figma-developer-mcp)
[![MCP](https://img.shields.io/badge/MCP-compatible-blue.svg)](https://modelcontextprotocol.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. CONFIGURATION](#5--configuration)
- [6. NAMING CONVENTION](#6--naming-convention)
- [7. USAGE EXAMPLES](#7--usage-examples)
- [8. MCP TOOLS (18 TOTAL)](#8--mcp-tools-18-total)
- [9. TROUBLESHOOTING](#9--troubleshooting)
- [10. FAQ](#10--faq)
- [11. RELATED DOCUMENTS](#11--related-documents)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is Figma MCP?

Figma MCP is an MCP server that provides AI assistants with programmatic access to Figma's design platform. It enables reading design files, exporting images, extracting components and styles, managing team projects and handling collaborative comments through Code Mode's efficient TypeScript execution.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Tools | 18 | Across 6 categories |
| Authentication | PAT | Figma Personal Access Token |
| Token Overhead | ~1.6k | Via Code Mode (vs ~54k native) |
| Access Method | Code Mode | `call_tool_chain()` |

### Comparison with Direct Figma API

| Feature | Direct API | Figma MCP via Code Mode |
|---------|------------|-------------------------|
| **Context Cost** | N/A | ~1.6k tokens (all tools) |
| **Multi-Tool** | Multiple HTTP calls | Single execution |
| **State** | Manual management | Automatic persistence |
| **Type Safety** | Manual | Full TypeScript support |
| **AI Integration** | Custom code | Native MCP protocol |

### Key Features

| Feature | Description |
|---------|-------------|
| **Design File Access** | Retrieve complete Figma files with configurable depth |
| **Node Extraction** | Get specific nodes by ID for targeted data retrieval |
| **Image Export** | Render nodes as PNG, JPG, SVG or PDF at custom scales |
| **Component Discovery** | List and retrieve components from files or teams |
| **Style Extraction** | Access design tokens (colors, typography, effects) |
| **Collaboration** | Read and post comments on design files |
| **Team Management** | Navigate team projects and files |

### Source Repository

| Property | Value |
|----------|-------|
| **npm Package** | [`figma-developer-mcp`](https://www.npmjs.com/package/figma-developer-mcp) |
| **GitHub** | [anthropics/figma-developer-mcp](https://github.com/anthropics/figma-developer-mcp) |
| **Tools** | 18 |
| **License** | MIT |

### Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18+ | Latest LTS |
| Code Mode MCP | Configured | Configured |
| Figma Account | Free | Professional (for team features) |

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Prerequisites

- Code Mode MCP configured in `.utcp_config.json`
- Figma Personal Access Token (from Figma Settings > Account > Personal access tokens)

### 30-Second Setup

```bash
# 1. Add Figma to .utcp_config.json (see Configuration section)

# 2. Add token to .env
echo "FIGMA_API_KEY=figd_your_token_here" >> .env

# 3. Restart your AI client
```

### Verify Installation

```typescript
// Via Code Mode - discover Figma tools
search_tools({ task_description: "figma" });

// Expected output: List of figma.figma_* tools (18 total)
```

### First Use

```typescript
// Get a Figma file
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "YOUR_FILE_KEY"  // From Figma URL
    });
    console.log('File:', file.name);
    console.log('Pages:', file.document.children.length);
    return file;
  `
});
```

### Finding Your File Key

The file key is in your Figma URL:
```
https://www.figma.com/file/ABC123xyz/My-Design-File
                           └─────────┘
                           This is your fileKey
```

---

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
.opencode/skill/mcp-figma/
├── SKILL.md                    # AI agent instructions
├── README.md                   # This file (user documentation)
├── references/
│   ├── tool_reference.md       # All 18 tools documented
│   └── quick_start.md          # Getting started guide
└── assets/
    └── tool_categories.md      # Tool priority categorization
```

### Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | AI agent activation triggers and workflow guidance |
| `references/tool_reference.md` | Complete tool documentation with all 18 tools |
| `references/quick_start.md` | Getting started in 5 minutes |
| `assets/tool_categories.md` | HIGH/MEDIUM/LOW categorization |

---

<!-- /ANCHOR:structure -->

<!-- ANCHOR:features -->
## 4. FEATURES

### File Management

Access and navigate Figma design files.

| Tool | Purpose |
|------|---------|
| `figma.figma_get_file` | Get complete file by key |
| `figma.figma_get_file_nodes` | Get specific nodes by ID |
| `figma.figma_set_api_key` | Set API key (alternative to env) |
| `figma.figma_check_api_key` | Verify API key is configured |

### Image Export

Render design elements as images.

| Tool | Purpose |
|------|---------|
| `figma.figma_get_image` | Export nodes as PNG/JPG/SVG/PDF |
| `figma.figma_get_image_fills` | Get URLs for embedded images |

**Supported Formats:**
- `png` - Raster, best for web/app assets
- `jpg` - Raster, smaller file size
- `svg` - Vector, scalable graphics
- `pdf` - Vector, print-ready

**Scale Options:** 0.01 to 4x (default: 1x)

### Components

Extract component information for design systems.

| Tool | Purpose |
|------|---------|
| `figma.figma_get_file_components` | List all components in a file |
| `figma.figma_get_component` | Get specific component by key |
| `figma.figma_get_team_components` | List team-wide components |
| `figma.figma_get_team_component_sets` | List team component sets (variants) |

### Styles (Design Tokens)

Extract design tokens for implementation.

| Tool | Purpose |
|------|---------|
| `figma.figma_get_file_styles` | List all styles in a file |
| `figma.figma_get_style` | Get specific style by key |
| `figma.figma_get_team_styles` | List team-wide styles |

**Style Types:**
- `FILL` - Color styles
- `TEXT` - Typography styles
- `EFFECT` - Shadow/blur styles
- `GRID` - Layout grid styles

### Team & Projects

Navigate team structure and projects.

| Tool | Purpose |
|------|---------|
| `figma.figma_get_team_projects` | List projects in a team |
| `figma.figma_get_project_files` | List files in a project |

### Comments

Collaborate on designs programmatically.

| Tool | Purpose |
|------|---------|
| `figma.figma_get_comments` | Read all comments on a file |
| `figma.figma_post_comment` | Post a new comment |
| `figma.figma_delete_comment` | Delete a comment |

See [references/tool_reference.md](./references/tool_reference.md) for complete tool documentation.

---

<!-- /ANCHOR:features -->

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Code Mode Configuration

Add to `.utcp_config.json`:

```json
{
  "manual_call_templates": [
    {
      "name": "figma",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "figma": {
            "transport": "stdio",
            "command": "npx",
            "args": ["-y", "figma-developer-mcp", "--stdio"],
            "env": {
              "FIGMA_API_KEY": "figd_your_token_here"
            }
          }
        }
      }
    }
  ]
}
```

> **Important**: Code Mode does NOT support `${VAR}` env substitution. You must hardcode the API key directly in `.utcp_config.json`. Keep this file secure and do not commit to version control if it contains real API keys.

### Environment Variables

Add to `.env`:

```bash
# Figma API Key
# Get from: Figma > Settings > Account > Personal access tokens
#
# CRITICAL: Code Mode requires PREFIXED variable names!
# The prefix is the "name" field from your .utcp_config.json (e.g., "figma")
figma_FIGMA_API_KEY=figd_your_token_here
```

> **Code Mode Naming**: Code Mode prefixes all env vars with `{manual_name}_`. If your config has `"name": "figma"`, use `figma_FIGMA_API_KEY` in your `.env` file, NOT `FIGMA_API_KEY`.

> **Security**: Never commit `.env` to version control. Add it to `.gitignore`.

### Getting Your Figma Token

1. Open [Figma Settings](https://www.figma.com/settings)
2. Scroll to **Personal access tokens**
3. Click **Generate new token**
4. Give it a description (e.g., "MCP Integration")
5. Copy the token immediately (you will not see it again)
6. Add to your `.env` file

### MCP Client Configurations

**OpenCode** (`opencode.json`):
```json
{
  "mcp": {
    "code-mode": {
      "type": "local",
      "command": ["npx", "-y", "utcp-mcp"],
      "env": {
        "UTCP_CONFIG_PATH": ".utcp_config.json"
      }
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "code-mode": {
      "command": "npx",
      "args": ["-y", "utcp-mcp"],
      "env": {
        "UTCP_CONFIG_PATH": "/path/to/.utcp_config.json"
      }
    }
  }
}
```

---

<!-- /ANCHOR:configuration -->

<!-- ANCHOR:naming-convention -->
## 6. NAMING CONVENTION

### Critical Pattern

**The #1 most common error** when using Figma MCP is wrong function names. All tool calls MUST follow this pattern:

```
figma.figma_{tool_name}
```

### Examples

| Tool | Correct Call |
|------|--------------|
| get_file | `figma.figma_get_file({...})` |
| get_image | `figma.figma_get_image({...})` |
| get_file_components | `figma.figma_get_file_components({...})` |
| post_comment | `figma.figma_post_comment({...})` |

### Common Mistakes

```typescript
// WRONG - missing figma_ prefix
await figma.get_file({ fileKey: "abc" });

// WRONG - dot instead of underscore
await figma.figma.get_file({ fileKey: "abc" });

// WRONG - camelCase
await figma.figma_getFile({ fileKey: "abc" });

// CORRECT
await figma.figma_get_file({ fileKey: "abc" });
```

### Discovery Methods

```typescript
// Use these to find exact tool names:
search_tools({ task_description: "figma components" });
list_tools();  // Filter for 'figma'
tool_info({ tool_name: "figma.figma_get_file" });
```

---

<!-- /ANCHOR:naming-convention -->

<!-- ANCHOR:usage-examples -->
## 7. USAGE EXAMPLES

### Example 1: Get Design File Structure

```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "abc123XYZ",
      depth: 1
    });
    
    console.log('File:', file.name);
    console.log('Last modified:', file.lastModified);
    
    file.document.children.forEach(page => {
      console.log('Page:', page.name);
      page.children?.forEach(frame => {
        console.log('  Frame:', frame.name);
      });
    });
    
    return { name: file.name, pages: file.document.children.length };
  `
});
```

### Example 2: Export Components as PNG

```typescript
call_tool_chain({
  code: `
    const fileKey = "abc123XYZ";
    
    // Get components
    const components = await figma.figma_get_file_components({ fileKey });
    const componentList = Object.values(components.meta.components);
    
    // Export first 5 as PNG at 2x
    const nodeIds = componentList.slice(0, 5).map(c => c.node_id);
    const images = await figma.figma_get_image({
      fileKey,
      ids: nodeIds,
      format: "png",
      scale: 2
    });
    
    console.log('Exported', Object.keys(images.images).length, 'images');
    return images;
  `,
  timeout: 60000
});
```

### Example 3: Extract Design Tokens

```typescript
call_tool_chain({
  code: `
    const styles = await figma.figma_get_file_styles({
      fileKey: "abc123XYZ"
    });
    
    // Group by type
    const tokens = { FILL: [], TEXT: [], EFFECT: [], GRID: [] };
    
    Object.values(styles.meta.styles).forEach(style => {
      if (tokens[style.style_type]) {
        tokens[style.style_type].push({
          name: style.name,
          key: style.key
        });
      }
    });
    
    console.log('Colors:', tokens.FILL.length);
    console.log('Typography:', tokens.TEXT.length);
    console.log('Effects:', tokens.EFFECT.length);
    
    return tokens;
  `
});
```

### Example 4: Post Review Comment

```typescript
call_tool_chain({
  code: `
    const comment = await figma.figma_post_comment({
      fileKey: "abc123XYZ",
      message: "Approved for development",
      client_meta: {
        node_id: "1:234"  // Attach to specific node
      }
    });
    
    console.log('Comment posted:', comment.id);
    return comment;
  `
});
```

### Example 5: Multi-Tool Workflow

```typescript
call_tool_chain({
  code: `
    const fileKey = "abc123XYZ";
    
    // 1. Get file info
    const file = await figma.figma_get_file({ fileKey, depth: 1 });
    console.log('File:', file.name);
    
    // 2. Get components
    const components = await figma.figma_get_file_components({ fileKey });
    const componentCount = Object.keys(components.meta.components).length;
    console.log('Components:', componentCount);
    
    // 3. Get styles
    const styles = await figma.figma_get_file_styles({ fileKey });
    const styleCount = Object.keys(styles.meta.styles).length;
    console.log('Styles:', styleCount);
    
    // 4. Export hero component as SVG
    const heroComponent = Object.values(components.meta.components)
      .find(c => c.name.toLowerCase().includes('hero'));
    
    if (heroComponent) {
      const images = await figma.figma_get_image({
        fileKey,
        ids: [heroComponent.node_id],
        format: "svg"
      });
      console.log('Hero exported:', images.images);
    }
    
    return {
      file: file.name,
      components: componentCount,
      styles: styleCount
    };
  `,
  timeout: 60000
});
```

---

<!-- /ANCHOR:usage-examples -->

<!-- ANCHOR:mcp-tools -->
## 8. MCP TOOLS (18 TOTAL)

### Tool Priority Classification

| Priority | Count | Tools |
|----------|-------|-------|
| **HIGH** | 5 | Core design access |
| **MEDIUM** | 7 | Situational use |
| **LOW** | 6 | Rarely needed |

### HIGH Priority Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `figma_get_file` | Get complete file | `fileKey`, `depth?`, `version?` |
| `figma_get_file_nodes` | Get specific nodes | `fileKey`, `node_ids[]` |
| `figma_get_image` | Export as image | `fileKey`, `ids[]`, `format?`, `scale?` |
| `figma_get_file_components` | List components | `fileKey` |
| `figma_get_file_styles` | List styles | `fileKey` |

### MEDIUM Priority Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `figma_get_image_fills` | Get embedded images | `fileKey` |
| `figma_get_comments` | Read comments | `fileKey` |
| `figma_post_comment` | Post comment | `fileKey`, `message` |
| `figma_get_team_projects` | List team projects | `team_id` |
| `figma_get_project_files` | List project files | `project_id` |
| `figma_get_component` | Get one component | `key` |
| `figma_get_style` | Get one style | `key` |

### LOW Priority Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `figma_set_api_key` | Set API key | `api_key` |
| `figma_check_api_key` | Verify key | (none) |
| `figma_delete_comment` | Delete comment | `fileKey`, `comment_id` |
| `figma_get_team_components` | Team components | `team_id` |
| `figma_get_team_component_sets` | Team component sets | `team_id` |
| `figma_get_team_styles` | Team styles | `team_id` |

See [references/tool_reference.md](./references/tool_reference.md) for complete parameter documentation.

---

<!-- /ANCHOR:mcp-tools -->

<!-- ANCHOR:troubleshooting -->
## 9. TROUBLESHOOTING

### Common Issues

#### Tool is not a function

**Symptom**: `TypeError: figma.get_file is not a function`

**Cause**: Missing `figma_` prefix in tool name.

**Solution**:
```typescript
// Wrong
await figma.get_file({ fileKey: "abc" });

// Correct
await figma.figma_get_file({ fileKey: "abc" });
```

#### 403 Forbidden / Authentication Failed

**Symptom**: `403 Forbidden` or `Invalid token`

**Cause**: Invalid or expired Figma token.

**Solution**:
1. Check token in `.env`:
   ```bash
   grep FIGMA .env
   ```
2. Verify token format (should start with `figd_`)
3. Regenerate token in Figma Settings if expired
4. Restart AI client after changing `.env`

#### 404 Not Found

**Symptom**: `404 Not Found` when accessing a file

**Cause**: Invalid file key or no access.

**Solution**:
1. Verify file key from URL:
   ```
   https://www.figma.com/file/ABC123xyz/Design
                              └─────────┘
                              Use this part
   ```
2. Check file permissions in Figma
3. Ensure file was not deleted or moved

#### Rate Limiting

**Symptom**: `429 Too Many Requests`

**Cause**: Exceeded Figma API rate limits.

**Solution**:
1. Wait and retry (limits reset quickly)
2. Reduce request frequency
3. Cache responses when possible
4. Use pagination for large datasets

#### Environment Variable Not Found

**Symptom**: `Environment variable FIGMA_API_KEY not found` or `Variable 'figma_FIGMA_API_KEY' referenced in call template configuration not found`

**Cause**: Token not in `.env`, `.env` not loaded or wrong variable name format.

**Solution**:
1. Check `.env` file exists
2. **Use prefixed variable name for Code Mode**:
   ```bash
   # WRONG (non-prefixed)
   FIGMA_API_KEY=figd_...

   # CORRECT (prefixed with manual name)
   figma_FIGMA_API_KEY=figd_...
   ```
3. Check `.utcp_config.json` references `.env`:
   ```json
   "load_variables_from": [
     { "variable_loader_type": "dotenv", "env_file_path": ".env" }
   ]
   ```
4. Restart AI client

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Tool not found | Use `search_tools()` to discover exact name |
| Auth failed | Regenerate token in Figma Settings |
| File not found | Verify file key from URL |
| Rate limited | Wait 60 seconds, retry |
| Empty results | Check file has components/styles |

### Diagnostic Commands

```typescript
// Check what tools are available
call_tool_chain({
  code: `
    const tools = await list_tools();
    return tools.tools.filter(t => t.includes('figma'));
  `
});

// Verify API key
call_tool_chain({
  code: `await figma.figma_check_api_key({})`
});

// Test file access
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({ fileKey: "YOUR_KEY" });
    return { name: file.name, pages: file.document.children.length };
  `
});
```

---

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:faq -->
## 10. FAQ

### General Questions

**Q: What can Figma MCP do?**

A: Figma MCP provides programmatic access to Figma's design platform through 18 tools covering file access, image export, component/style extraction, team management and collaboration.

**Q: Why use Code Mode instead of native MCP?**

A: Code Mode adds ~1.6k tokens overhead vs ~54k for native MCP (18 tools x 3k each). This is a 97% token savings, crucial for context-heavy conversations.

**Q: What is the difference between file-level and team-level tools?**

A: File-level tools (`get_file_components`, `get_file_styles`) work on a single file. Team-level tools (`get_team_components`, `get_team_styles`) aggregate across all files in a team. This is useful for design system documentation.

### Technical Questions

**Q: How do I find my file key?**

A: The file key is in your Figma URL:
```
https://www.figma.com/file/ABC123xyz/My-Design
                           └─────────┘
                           This is fileKey
```

**Q: What image formats are supported?**

A: PNG, JPG, SVG and PDF. Use `format` parameter in `get_image`:
```typescript
await figma.figma_get_image({
  fileKey: "abc",
  ids: ["1:2"],
  format: "svg",  // or "png", "jpg", "pdf"
  scale: 2        // 0.01 to 4
});
```

**Q: How do I get a specific node ID?**

A: In Figma, right-click any element and select "Copy link". The node ID is in the URL after `node-id=`. You can also use `get_file` with `depth` to explore the structure.

**Q: Can I create or edit designs?**

A: No, Figma MCP is read-only. It can read files, export images and post comments, but cannot create or modify design elements.

**Q: What are the API rate limits?**

A: Figma's API has rate limits that vary by endpoint. If you hit limits, wait 60 seconds and retry. For batch operations, add delays between calls.

---

<!-- /ANCHOR:faq -->

<!-- ANCHOR:related -->
## 11. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [SKILL.md](./SKILL.md) | AI agent instructions and workflow guidance |
| [references/tool_reference.md](./references/tool_reference.md) | Complete documentation for all 18 tools |
| [references/quick_start.md](./references/quick_start.md) | Getting started in 5 minutes |
| [assets/tool_categories.md](./assets/tool_categories.md) | Tool priority categorization |

### External Resources

| Resource | Description |
|----------|-------------|
| [Figma API Documentation](https://www.figma.com/developers/api) | Official API reference |
| [figma-developer-mcp npm](https://www.npmjs.com/package/figma-developer-mcp) | Package documentation |
| [Figma Settings](https://www.figma.com/settings) | Token generation |

### Related Skills

| Skill | Purpose |
|-------|---------|
| [mcp-code-mode](../mcp-code-mode/README.md) | Tool orchestration via TypeScript execution |
| [mcp-chrome-devtools](../mcp-chrome-devtools/README.md) | Browser-side validation for design implementation |

### Install Guide

| Guide | Purpose |
|-------|---------|
| [Install Guide](./INSTALL_GUIDE.md) | Complete installation instructions |

<!-- /ANCHOR:related -->

---
title: "mcp-figma: Figma Design File Access"
description: "Programmatic access to Figma design files via MCP, providing 18 tools for file retrieval, image export, component and style extraction, team management, and collaborative commenting."
trigger_phrases:
  - figma file
  - design file
  - get design
  - figma document
  - export image
  - export png
  - export svg
  - render node
  - figma components
  - design system
  - component library
  - design tokens
  - figma styles
  - team projects
  - design comments
  - figma feedback
---

# mcp-figma: Figma Design File Access

> Programmatic access to Figma design files through 18 specialized tools covering file retrieval, image export, component and style extraction, and collaboration.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. QUICK START](#2-quick-start)
- [3. FEATURES](#3-features)
- [4. STRUCTURE](#4-structure)
- [5. CONFIGURATION](#5-configuration)
- [6. USAGE EXAMPLES](#6-usage-examples)
- [7. TROUBLESHOOTING](#7-troubleshooting)
- [8. FAQ](#8-faq)
- [9. RELATED DOCUMENTS](#9-related-documents)
<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What This Skill Does

The `mcp-figma` skill gives AI assistants direct read access to Figma design files. It provides 18 tools organized across six domains: file management, image export, component extraction, style extraction, team and project navigation, and collaborative commenting. All tools follow the naming pattern `figma.figma_{tool_name}` and are called through the Code Mode `call_tool_chain()` interface for token-efficient, on-demand access.

Two integration paths are available. Option A uses the Official Figma MCP, an HTTP remote server at `mcp.figma.com` that requires no local installation and authenticates via OAuth in the browser. Option B uses Framelink (`figma-developer-mcp`), a locally installed stdio transport that authenticates with a Personal Access Token and integrates directly with Code Mode. Option A is recommended for most users because it works immediately with no package to install.

This skill acts as a design-to-code bridge. It does not write to Figma or modify designs. Its purpose is to read file structure, export rendered assets, extract tokens and components for documentation, and participate in comment threads during design review.

When Figma-driven work lands in a Spec Kit packet, `/spec_kit:resume` remains the canonical recovery surface. Continuity still comes from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay supporting only.

### Key Statistics

| Metric | Value |
| --- | --- |
| Total tools | 18 |
| High-priority tools | 5 |
| Medium-priority tools | 7 |
| Low-priority tools | 6 |
| Export formats | PNG, JPG, SVG, PDF |
| Scale range | 0.01x to 4x |
| Skill version | 1.0.7.0 |

### How This Compares

| Capability | Option A (Official) | Option B (Framelink) |
| --- | --- | --- |
| Installation required | No | Yes (npx) |
| Authentication | OAuth (browser) | Personal Access Token |
| Transport | HTTP | stdio |
| Code Mode integration | Not native | Direct via `.utcp_config.json` |
| Recommended for | Getting started fast | Full Code Mode workflows |

### Key Features

| Feature | Description |
| --- | --- |
| File retrieval | Get complete file structure, specific nodes, version history |
| Image export | Render nodes as PNG, JPG, SVG, or PDF at configurable scale |
| Component extraction | List all components, get metadata, access team libraries |
| Style extraction | Pull colors, typography, effects, and grid styles as tokens |
| Team navigation | Browse team projects, list project files with pagination |
| Commenting | Read comments, post feedback, reply to threads, delete comments |
| Auth verification | Check API key status before operations |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Choose your path.** For most users, Option A (Official Figma MCP) is the fastest path. It needs no local installation. For Code Mode integration with `call_tool_chain()`, use Option B (Framelink). See the [Install Guide](./INSTALL_GUIDE.md) for full configuration steps.

**Step 2: Get your file key.** Open any Figma file in the browser. The file key is the alphanumeric segment in the URL between `/file/` and the next `/`:

```
https://www.figma.com/file/ABC123xyz/My-Design
                           └─────────┘
                           This is your fileKey
```

**Step 3: Verify the connection (Code Mode path).** Run the auth check before any other operation:

```typescript
call_tool_chain({
  code: `
    const status = await figma.figma_check_api_key({});
    console.log('Auth status:', status);
    return status;
  `
});
```

**Step 4: Fetch a file.** Once auth passes, retrieve the file structure:

```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({ fileKey: "ABC123xyz" });
    console.log('File:', file.name);
    console.log('Pages:', file.document.children.map(p => p.name));
    return file;
  `
});
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The file access tools form the foundation of every workflow. `figma_get_file` returns the complete document tree including all pages, frames, and nested nodes. When working with large files, `figma_get_file_nodes` lets you fetch only the specific node IDs you need, which reduces response size and speeds up processing. You can also request a specific historical version using the `version` parameter, which makes it possible to compare designs across revisions.

Image export works at the node level. `figma_get_image` accepts an array of node IDs and returns a map of each ID to a hosted image URL. You control the output format (PNG, JPG, SVG, PDF) and the scale factor from 0.01 to 4x. For high-density displays, passing `scale: 2` gives you a 2x asset without any additional tooling. `figma_get_image_fills` complements this by returning URLs for images that are already embedded inside the design as fill layers, which is useful when you need to extract photos or textures placed directly in the canvas.

Component and style tools power design system documentation workflows. `figma_get_file_components` returns every published component in the file with its name, key, and node ID. `figma_get_file_styles` returns all styles categorized by type: FILL for colors, TEXT for typography, EFFECT for shadows and blurs, and GRID for layout grids. These two tools together give you the raw material to generate accurate design token documentation from the source of truth. Team-scoped variants of both tools (`figma_get_team_components`, `figma_get_team_styles`) extend that coverage across an entire organization's shared libraries, with pagination support for large teams.

The collaboration tools cover the full comment lifecycle. You can read all comments on a file, post new feedback anchored to a specific node position, reply to an existing thread by passing a `comment_id`, and delete outdated comments. This makes it possible to automate parts of the design review process, such as posting a structured accessibility checklist as a comment after analyzing a frame.

### 3.2 FEATURE REFERENCE

#### Tool Categories

| Category | Tools | Priority |
| --- | --- | --- |
| File Management | `get_file`, `get_file_nodes`, `set_api_key`, `check_api_key` | HIGH / LOW |
| Images | `get_image`, `get_image_fills` | HIGH / MEDIUM |
| Components | `get_file_components`, `get_component`, `get_team_components`, `get_team_component_sets` | HIGH / MEDIUM / LOW |
| Styles | `get_file_styles`, `get_style`, `get_team_styles` | HIGH / MEDIUM / LOW |
| Team and Projects | `get_team_projects`, `get_project_files` | MEDIUM |
| Comments | `get_comments`, `post_comment`, `delete_comment` | MEDIUM / LOW |

#### High-Priority Tools (5 tools)

| Tool | Purpose | Required Parameters |
| --- | --- | --- |
| `figma_get_file` | Full file structure | `fileKey` |
| `figma_get_file_nodes` | Specific nodes by ID | `fileKey`, `node_ids` |
| `figma_get_image` | Render nodes as images | `fileKey`, `ids` |
| `figma_get_file_components` | All components in file | `fileKey` |
| `figma_get_file_styles` | All styles in file | `fileKey` |

#### Export Format Options

| Format | Use Case | Notes |
| --- | --- | --- |
| `png` | Raster assets, previews | Supports scale 0.01-4x |
| `jpg` | Photos, large backgrounds | Smaller file size than PNG |
| `svg` | Icons, vector assets | Supports `svg_include_id` option |
| `pdf` | Print-ready exports | Full page layout |

#### Pagination Parameters (team tools)

| Parameter | Type | Purpose |
| --- | --- | --- |
| `page_size` | number | Items per page (default 30) |
| `cursor` | string | Opaque token for the next page |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
mcp-figma/
  SKILL.md              # Skill instructions, routing logic, rules
  README.md             # This file
  INSTALL_GUIDE.md      # Full setup guide for Option A and Option B
  references/
    tool_reference.md   # Complete reference for all 18 tools
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### Option A: Official Figma MCP (Recommended)

Add the HTTP server to your MCP configuration. No package installation is required. Authentication uses OAuth via a browser login flow on first use.

```json
{
  "mcp": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

### Option B: Framelink via Code Mode

Add the Figma provider to `.utcp_config.json` for Code Mode integration. This uses the `figma-developer-mcp` package over stdio.

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
              "FIGMA_API_KEY": "${FIGMA_API_KEY}"
            }
          }
        }
      }
    }
  ]
}
```

### Environment Variable (Option B)

Code Mode prefixes all environment variable names with the provider's `name` field from `.utcp_config.json`. For a provider named `figma`, set the following in your `.env` file:

```bash
figma_FIGMA_API_KEY=figd_your_token_here
```

Using `FIGMA_API_KEY=figd_...` without the prefix will cause a "Variable not found" error. Generate your Personal Access Token in Figma under Settings, then Account Settings, then Personal Access Tokens.

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

### Get File Structure and List Pages

```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "abc123XYZ",
      depth: 2
    });
    const pages = file.document.children.map(p => ({
      id: p.id,
      name: p.name
    }));
    console.log('Pages:', pages);
    return { name: file.name, pages };
  `
});
```

### Export Multiple Nodes as PNG at 2x

```typescript
call_tool_chain({
  code: `
    const images = await figma.figma_get_image({
      fileKey: "abc123XYZ",
      ids: ["1:234", "1:235", "1:236"],
      format: "png",
      scale: 2
    });
    return images;
  `
});
```

### Extract Components and Styles Together

```typescript
call_tool_chain({
  code: `
    const [components, styles] = await Promise.all([
      figma.figma_get_file_components({ fileKey: "abc123XYZ" }),
      figma.figma_get_file_styles({ fileKey: "abc123XYZ" })
    ]);

    const componentList = components.meta.components.map(c => ({
      name: c.name,
      key: c.key,
      nodeId: c.node_id
    }));

    const styleList = styles.meta.styles.map(s => ({
      name: s.name,
      type: s.style_type,
      key: s.key
    }));

    return { components: componentList, styles: styleList };
  `
});
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

### "Invalid token" or 401 Unauthorized

**What you see:** API calls fail with a 401 status or an "Invalid token" message.

**Common causes:** The Personal Access Token has expired or was revoked. The `figma_FIGMA_API_KEY` variable is missing the `figma_` prefix required by Code Mode.

**Fix:** Open Figma, go to Settings, then Account Settings, then Personal Access Tokens. Generate a new token. In your `.env` file, set `figma_FIGMA_API_KEY=figd_your_new_token`. Restart your environment to reload the variable, then run `figma.figma_check_api_key({})` to confirm the key is valid before proceeding.

---

### File Not Found (404)

**What you see:** `figma_get_file` returns a 404 or an empty result.

**Common causes:** The file key was copied incorrectly, or the authenticated user does not have access to the file.

**Fix:** Copy the file key directly from the Figma URL. The key is the segment after `/file/` and before the next `/`. Verify that the account associated with your token has at least view access to the file. If the file lives inside a team or organization, ask the owner to share it with your account.

---

### Node ID No Longer Valid

**What you see:** A node ID that worked in a previous session now returns an error or null.

**Common causes:** Node IDs in Figma change when the design is edited. An ID captured in a previous session may no longer exist.

**Fix:** Re-fetch the file with `figma_get_file` to get the current node tree, then extract updated node IDs from the response before running node-specific tools.

---

### Rate Limit Errors (429)

**What you see:** Requests return 429 errors after a series of calls.

**Common causes:** Figma's API enforces rate limits that scale with request volume. Tight loops over large node arrays exceed the limit quickly.

**Fix:** Add a short delay between requests in batch loops. Reduce `page_size` for team queries. For large exports, process nodes in smaller batches rather than all at once.

---

### Empty Components or Styles List

**What you see:** `figma_get_file_components` or `figma_get_file_styles` returns an empty array.

**Common causes:** The file has components or styles that have not been published to the team library, or the file genuinely contains none.

**Fix:** In Figma, open the Assets panel and confirm that components are visible there. For styles, check the Styles panel. If they appear in the UI but not via the API, select them and publish them to the team library, then re-run the API call.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: Can this skill create or edit Figma designs?**

A: No. All 18 tools are read-only with the exception of the three comment tools (`post_comment`, `delete_comment`) and the API key management tools (`set_api_key`). The skill cannot modify frames, components, or styles. Use the Figma application directly for design edits.

---

**Q: What is the difference between Option A and Option B?**

A: Option A (Official Figma MCP) connects to Figma's hosted HTTP server at `mcp.figma.com`. It requires no local package installation and authenticates via OAuth in the browser. It is the fastest way to get started. Option B (Framelink) installs `figma-developer-mcp` locally via npx, uses a Personal Access Token for auth, and routes through Code Mode's `call_tool_chain()` interface. Option B is needed when you want to use Figma tools in the same Code Mode chain as other tools like ClickUp or Chrome DevTools.

---

**Q: Why does my `.env` variable need the `figma_` prefix?**

A: Code Mode prefixes all environment variable names with the provider's `name` field from `.utcp_config.json`. Because the provider is named `figma`, the base variable `FIGMA_API_KEY` becomes `figma_FIGMA_API_KEY` after prefixing. This namespacing prevents collisions when multiple providers define variables with the same base name.

---

**Q: How do I find my team ID for team-scoped tools?**

A: Open Figma in the browser and navigate to your team page. The team ID appears in the URL at `figma.com/files/team/{team_id}/...`. Copy the numeric segment and pass it to tools like `figma_get_team_projects` or `figma_get_team_components`.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

### THIS SKILL

| Document | Purpose |
| --- | --- |
| [SKILL.md](./SKILL.md) | Skill instructions, smart routing logic, rules, and integration points |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Full setup guide for Option A (Official) and Option B (Framelink) |
| [references/tool_reference.md](./references/tool_reference.md) | Complete reference for all 18 tools with parameters and examples |

### RELATED SKILLS

| Skill | Relationship |
| --- | --- |
| [mcp-code-mode](../mcp-code-mode/SKILL.md) | Required dependency for Option B. Figma tools are called via `call_tool_chain()` |

### EXTERNAL RESOURCES

| Resource | URL |
| --- | --- |
| Figma API Documentation | https://www.figma.com/developers/api |
| Official Figma MCP Server | https://developers.figma.com/docs/figma-mcp-server/ |
| figma-developer-mcp (npm) | https://www.npmjs.com/package/figma-developer-mcp |

<!-- /ANCHOR:related-documents -->

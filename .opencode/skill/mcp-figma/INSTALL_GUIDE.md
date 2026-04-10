# Figma MCP Installation Guide

Complete installation and configuration guide for Figma MCP, enabling programmatic access to Figma design files. Covers file retrieval (designs, nodes, versions), image export (PNG, SVG, PDF), component and style extraction, team project management, and collaborative commenting. Two installation options are available: the Official Figma MCP (HTTP, OAuth) for simplicity and Framelink (stdio, API key) for Code Mode integration. Both options deliver token-efficient design data access for AI-assisted development workflows.

> **Part of OpenCode Installation.** See [Master Installation Guide](../README.md) for complete setup.

**Two options are available:**

| Option | Name | Type | Auth | Best For |
|--------|------|------|------|----------|
| **A** | Official Figma MCP | HTTP (remote) | OAuth (browser) | Simplicity, no install needed |
| **B** | Framelink (3rd-party) | stdio (local) | API Key | Code Mode integration, additional features |

**Recommendation:** Start with **Option A** (Official). Zero installation, OAuth login, works immediately.

---

## 0. AI-First Install Guide

Copy and paste this prompt to your AI assistant to get installation help:

```
I want to install Figma MCP for accessing Figma designs programmatically.

Please help me choose and install the right option:

OPTION A (Official, Recommended):
- No installation needed, just add HTTP config
- OAuth login via browser

OPTION B (Framelink, Advanced):
- Requires API key from Figma settings
- Better Code Mode integration

I'm using: [Claude Code / OpenCode / VS Code Copilot / Cursor]

My Figma file key is: [paste your file key from the URL, e.g., abc123XYZ from figma.com/file/abc123XYZ/...]

Guide me through the setup and verify it works.
```

**What the AI will do:**
- Help you choose between Official and Framelink options
- Configure your AI environment with the correct settings
- For Option A: add HTTP server config and guide OAuth login
- For Option B: help create the API key and configure Code Mode
- Test the installation by fetching a Figma file

**Expected setup time:** 5-10 minutes (Option A) | 10-15 minutes (Option B)

---

## Table of Contents

0. [AI-First Install Guide](#0-ai-first-install-guide)
1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Verification](#5-verification)
6. [Usage](#6-usage)
7. [Features](#7-features)
8. [Examples](#8-examples)
9. [Troubleshooting](#9-troubleshooting)
10. [Resources](#10-resources)

---

## 1. Overview

Figma MCP provides programmatic access to Figma's design platform. It enables AI assistants to read design files, export images, extract components and styles, manage team projects, and handle collaborative comments.

### Core Principle

> **Install once, verify at each step.** Each phase has a validation checkpoint. Do not proceed until the checkpoint passes.

### Available Options

| Property | Option A: Official Figma MCP | Option B: Framelink |
| --- | --- | --- |
| **Type** | HTTP (remote server) | stdio (local process) |
| **Package/URL** | `https://mcp.figma.com/mcp` | `figma-developer-mcp` |
| **Authentication** | OAuth (browser login) | Figma API Key |
| **Installation** | None | npx (no global install) |
| **Configuration File** | `opencode.json` / `.mcp.json` | `opencode.json` or `.utcp_config.json` |
| **Official Docs** | https://developers.figma.com/docs/figma-mcp-server/ | https://github.com/GLips/Figma-Context-MCP |

### Key Features

Both options provide access to Figma's core capabilities:

- **Design File Access:** Retrieve complete Figma files with configurable depth
- **Node Extraction:** Get specific nodes by ID for targeted data retrieval
- **Image Export:** Render nodes as PNG, JPG, SVG, or PDF at custom scales
- **Component Discovery:** List and retrieve components from files or teams
- **Style Extraction:** Access design tokens (colors, typography, effects)
- **Collaboration:** Read and post comments on design files
- **Team Management:** Navigate team projects and files

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  OPTION A: Official Figma MCP (Recommended)                      │
│                                                                 │
│  AI Client (Claude Code, Cursor, VS Code)                        │
│       │                                                         │
│       │ HTTP (MCP protocol)                                     │
│       ▼                                                         │
│  https://mcp.figma.com/mcp                                      │
│       │ OAuth authentication (browser popup)                    │
│       ▼                                                         │
│  Figma API (api.figma.com)                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  OPTION B: Framelink (Third-Party)                               │
│                                                                 │
│  AI Client (Claude Code, OpenCode, VS Code)                      │
│       │                                                         │
│       │ stdio (MCP protocol)                                    │
│       ▼                                                         │
│  npx figma-developer-mcp                                        │
│       │ API Key authentication (--figma-api-key)                │
│       ▼                                                         │
│  Figma API (api.figma.com)                                      │
└─────────────────────────────────────────────────────────────────┘
```

### When to Use Each Option

| Use Case | Recommended Option |
| --- | --- |
| Quick setup, no API key management | **Option A** |
| Claude Code / Cursor / VS Code | **Option A** |
| Code Mode integration | **Option B** |
| Windows (with WSL) | **Option B** |
| Programmatic multi-tool workflows | **Option B** |
| Offline or air-gapped environment | **Option B** |

---

## 2. Prerequisites

### Option A: Official Figma MCP

| Requirement | Details |
|---|---|
| **Figma Account** | Free or paid account with access to desired files |
| **Browser** | For OAuth authentication popup |
| **AI Client** | Claude Code, Cursor, VS Code Copilot, or other MCP-compatible client |

No Node.js, API keys, or installation required.

### Option B: Framelink

| Requirement | Details |
|---|---|
| **Node.js 18+** | `node --version` should show v18.x or higher |
| **Figma API Key** | Personal Access Token from Figma settings |
| **Code Mode MCP** | Optional but recommended for advanced workflows |

### Getting Your Figma API Key (Option B Only)

1. Open [Figma Settings](https://www.figma.com/settings)
2. Scroll to **Personal access tokens**
3. Click **Generate new token**
4. Give it a description (e.g., "Framelink MCP")
5. Copy the token immediately. You will not see it again.

> **Security note:** Your token provides full access to your Figma account. Never commit it to version control.

### Validation: `phase_1_complete`

**Option A:**
```bash
# Verify your AI client supports MCP
# No other prerequisites needed
```

**Option B:**
```bash
# Check Node.js version
node --version    # -> v18.x or higher

# Confirm your API key is ready
# Do not echo it to the terminal for security
```

**Checklist:**
- [ ] **Option A:** Figma account ready? Browser available?
- [ ] **Option B:** Node.js 18+ installed? Figma API Key obtained?

❌ **STOP if validation fails.** Fix prerequisites before continuing.

---

## 3. Installation

Choose your installation option.

---

### Option A: Official Figma MCP (Recommended)

No installation required. Add the configuration to your AI client.

#### Claude Code CLI

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

#### OpenCode (`opencode.json`)

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

#### VS Code Copilot (`.vscode/mcp.json`)

```json
{
  "servers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

#### Cursor (`.cursor/mcp.json`)

```json
{
  "servers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "type": "http"
    }
  }
}
```

**First use:** When you first access Figma, a browser popup will appear for OAuth authentication. Sign in with your Figma account to authorize access.

---

### Option B: Framelink (Third-Party)

#### Standalone Configuration (Any MCP Client)

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}
```

Replace `YOUR-KEY` with your actual Figma Personal Access Token.

#### Alternative: Using Environment Variable

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--stdio"],
      "env": {
        "FIGMA_API_KEY": "${FIGMA_API_KEY}"
      }
    }
  }
}
```

Then add to your `.env` file:
```bash
# For standalone MCP (NOT via Code Mode)
FIGMA_API_KEY=figd_your_token_here
```

> **Code Mode users:** If using Figma via Code Mode, you must use the **prefixed** variable format. See the Code Mode Integration section below.

#### Windows Users

Windows requires a `cmd` wrapper:

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}
```

#### Code Mode Integration (Optional)

If using Code Mode, add to `.utcp_config.json`:

```json
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
```

> **CRITICAL: Code Mode prefixed variables.**
>
> Code Mode requires prefixed environment variable names. The prefix is the `name` field from your config (in this case, "figma").
>
> In your `.env` file, use:
> ```bash
> # Code Mode requires prefixed variable names: {manual_name}_{VAR}
> figma_FIGMA_API_KEY=figd_your_token_here
> ```
>
> Do NOT use `FIGMA_API_KEY=figd_...`. That will cause "Variable not found" errors.

---

### Validation: `phase_2_complete`

**Option A:**
```bash
# Configuration added. OAuth will authenticate on first use.
echo "Ready. OAuth will authenticate on first Figma request."
```

**Option B:**
```bash
# Verify Framelink can start
npx -y figma-developer-mcp --help
# Should show usage information
```

**Checklist:**
- [ ] **Option A:** Configuration added to your MCP client config?
- [ ] **Option B:** API key configured (inline or via env var)?
- [ ] **Option B:** `.env` is in `.gitignore` (if using env var)?

❌ **STOP if validation fails.** Check configuration syntax and paths.

---

## 4. Configuration

Configuration varies by installation option.

### Option A: Official Figma MCP Configuration

No additional configuration needed. The HTTP connection handles everything:

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Client Config (opencode.json / .mcp.json)              │
│  └─► figma: { type: "http", url: "https://mcp.figma.com/mcp" }  │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP (MCP protocol)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Figma MCP Server (hosted by Figma)                              │
│  └─► OAuth authentication via browser popup                     │
│  └─► Direct access to Figma API                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Authentication flow:**
1. First Figma tool call triggers browser popup
2. Sign in with your Figma account
3. Authorize the MCP connection
4. Token is cached. No re-auth is needed.

---

### Option B: Framelink Configuration

**Standalone (direct MCP connection):**

```
┌─────────────────────────────────────────────────────────────────┐
│  Your AI Client Config (opencode.json / .mcp.json)              │
│  └─► figma: { command: "npx", args: [...] }                     │
└─────────────────────────────────────────────────────────────────┘
                           │
                           │ stdio (MCP protocol)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Framelink MCP (npx figma-developer-mcp)                         │
│  └─► API Key authentication (--figma-api-key or FIGMA_API_KEY)  │
│  └─► Direct access to Figma API                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Via Code Mode (for advanced workflows):**

```
┌─────────────────────────────────────────────────────────────────┐
│  opencode.json (or .mcp.json)                                   │
│  └─► Configures: Code Mode MCP server                           │
│      └─► Points to: .utcp_config.json                           │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  .utcp_config.json                                              │
│  └─► Configures: Figma provider via Framelink                   │
│      └─► Package: figma-developer-mcp                           │
│      └─► Auth: FIGMA_API_KEY                                    │
└─────────────────────────────────────────────────────────────────┘
```

### Security Warning (Option B Only)

**CRITICAL:** Never hardcode your Figma API key in configuration files.

**Wrong (security risk):**
```json
{
  "args": ["-y", "figma-developer-mcp", "--figma-api-key=figd_actual_token_here", "--stdio"]
}
```

**Correct (use environment variable):**
```json
{
  "args": ["-y", "figma-developer-mcp", "--stdio"],
  "env": {
    "FIGMA_API_KEY": "${FIGMA_API_KEY}"
  }
}
```

### Validation: `phase_3_complete`

**Option A:**
```bash
# Verify your config file has the figma entry
grep -q 'mcp.figma.com' opencode.json && echo "Official Figma MCP configured" || echo "Not found"
```

**Option B:**
```bash
# Validate JSON syntax
python3 -m json.tool < .utcp_config.json > /dev/null && echo "Valid JSON" || echo "Invalid JSON"

# Check API key is set (do not echo it)
[ -n "$FIGMA_API_KEY" ] && echo "FIGMA_API_KEY is set" || echo "FIGMA_API_KEY not set"
```

**Checklist:**
- [ ] **Option A:** HTTP config added to AI client?
- [ ] **Option B:** API key configured securely (env var, not hardcoded)?
- [ ] **Option B:** `.env` is in `.gitignore`?

❌ **STOP if validation fails.** Fix configuration syntax or paths.

---

## 5. Verification

Verify Figma MCP is working correctly.

### Step 1: Restart Your AI Client

```bash
# Restart to load new configuration
opencode  # Or restart Claude Code, VS Code, or Cursor
```

### Step 2: Test Connection

**Option A (Official):** Ask your AI assistant:
```
List available Figma tools
```

On first use, a browser window will open for OAuth authentication. Sign in with your Figma account.

**Option B (Framelink via Code Mode):** Run:
```typescript
search_tools({ task_description: "figma design", limit: 20 });
```

### Step 3: Test a Basic Call

**Option A (Official):** Ask your AI:
```
Get information about my Figma file: [your-file-key]
```

**Option B (Framelink via Code Mode):**
```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "your_file_key_here",
      depth: 1
    });
    console.log('File name:', file.name);
    return { name: file.name, pages: file.document.children.length };
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

### Validation: `phase_4_complete`

**Option A checklist:**
- [ ] OAuth popup appeared and you authenticated?
- [ ] AI can list Figma tools?
- [ ] File retrieval works?

**Option B checklist:**
- [ ] `search_tools()` returns Figma tools?
- [ ] `figma.figma_get_file()` returns file data?
- [ ] No authentication errors?

❌ **STOP if validation fails.** Check configuration and API key.

---

## 6. Usage

Usage differs slightly between the two options.

### Option A: Official Figma MCP

Ask your AI assistant naturally:

```
Get my Figma file ABC123xyz and list its pages
```

```
Export the component at node 1:234 as a PNG at 2x scale
```

```
What components are in my design system file XYZ789?
```

The AI will use the appropriate Figma tools automatically.

---

### Option B: Framelink (via Code Mode)

#### CRITICAL: Naming Pattern

The most common error is using the wrong function names.

**Pattern:**
```
figma.figma_{tool_name}
```

All Figma tool calls must follow this exact pattern.

**Examples:**

| Tool | Correct | Wrong |
| --- | --- | --- |
| Get file | `figma.figma_get_file({...})` | `figma.get_file({...})` |
| Get image | `figma.figma_get_image({...})` | `figma.figma.get_image({...})` |
| Post comment | `figma.figma_post_comment({...})` | `figma.postComment({...})` |

#### Common Mistakes

| Error | Wrong | Correct |
| --- | --- | --- |
| Missing prefix | `figma.get_file()` | `figma.figma_get_file()` |
| Dot instead of underscore | `figma.figma.get_file()` | `figma.figma_get_file()` |
| camelCase | `figma.figma_getFile()` | `figma.figma_get_file()` |

#### Basic Workflow

**Step 1: Discover Tools**
```typescript
search_tools({ task_description: "figma components", limit: 10 });
```

**Step 2: Get Tool Details**
```typescript
tool_info({ tool_name: "figma.figma_get_file" });
```

**Step 3: Execute Tool**
```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "your_file_key_here"
    });
    console.log('File name:', file.name);
    return file;
  `
});
```

---

### Finding Your File Key (Both Options)

The file key is in your Figma URL:
```
https://www.figma.com/file/ABC123xyz/My-Design-File
                           └─────────┘
                           This is your fileKey
```

### Validation: `phase_5_complete`

- [ ] You can access Figma files by key?
- [ ] Tools return expected data structures?
- [ ] Rate limiting and pagination work correctly?

❌ **STOP if validation fails** - Check MCP configuration, verify API key or OAuth credentials, and restart your AI client.

---

## 7. Features

### 7.1 File Management Tools

#### `figma_get_file`
Get a complete Figma file by key.

```typescript
await figma.figma_get_file({
  fileKey: "abc123",      // Required: File key from URL
  version: "123456",      // Optional: Specific version ID
  depth: 2,               // Optional: Node depth (1-4)
  branch_data: true       // Optional: Include branch info
});
```

#### `figma_get_file_nodes`
Get specific nodes from a file.

```typescript
await figma.figma_get_file_nodes({
  fileKey: "abc123",           // Required: File key
  node_ids: ["1:2", "3:4"],    // Required: Array of node IDs
  depth: 2,                    // Optional: Node depth (1-4)
  version: "123456"            // Optional: Version ID
});
```

#### `figma_set_api_key`
Set your Figma API key (saved to `~/.mcp-figma/config.json`).

```typescript
await figma.figma_set_api_key({
  api_key: "figd_your_token"   // Required: Your PAT
});
```

#### `figma_check_api_key`
Check if an API key is configured.

```typescript
await figma.figma_check_api_key({});
```

---

### 7.2 Image Tools

#### `figma_get_image`
Render nodes as images.

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

#### `figma_get_image_fills`
Get URLs for images used in a file.

```typescript
await figma.figma_get_image_fills({
  fileKey: "abc123"            // Required: File key
});
```

---

### 7.3 Comment Tools

#### `figma_get_comments`
Get all comments on a file.

```typescript
await figma.figma_get_comments({
  fileKey: "abc123"            // Required: File key
});
```

#### `figma_post_comment`
Post a comment on a file.

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

#### `figma_delete_comment`
Delete a comment.

```typescript
await figma.figma_delete_comment({
  fileKey: "abc123",           // Required: File key
  comment_id: "456"            // Required: Comment ID
});
```

---

### 7.4 Team and Project Tools

#### `figma_get_team_projects`
Get projects for a team.

```typescript
await figma.figma_get_team_projects({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

#### `figma_get_project_files`
Get files in a project.

```typescript
await figma.figma_get_project_files({
  project_id: "789",           // Required: Project ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page",         // Optional: Pagination cursor
  branch_data: true            // Optional: Include branches
});
```

---

### 7.5 Component Tools

#### `figma_get_file_components`
Get all components from a file.

```typescript
await figma.figma_get_file_components({
  fileKey: "abc123"            // Required: File key
});
```

#### `figma_get_component`
Get a specific component by key.

```typescript
await figma.figma_get_component({
  key: "component_key"         // Required: Component key
});
```

#### `figma_get_team_components`
Get all components for a team.

```typescript
await figma.figma_get_team_components({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

#### `figma_get_team_component_sets`
Get component sets for a team.

```typescript
await figma.figma_get_team_component_sets({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

---

### 7.6 Style Tools

#### `figma_get_file_styles`
Get all styles from a file.

```typescript
await figma.figma_get_file_styles({
  fileKey: "abc123"            // Required: File key
});
```

#### `figma_get_style`
Get a specific style by key.

```typescript
await figma.figma_get_style({
  key: "style_key"             // Required: Style key
});
```

#### `figma_get_team_styles`
Get all styles for a team.

```typescript
await figma.figma_get_team_styles({
  team_id: "123456",           // Required: Team ID
  page_size: 30,               // Optional: Items per page
  cursor: "next_page"          // Optional: Pagination cursor
});
```

---

## 8. Examples

### Example 1: Get Design File Structure

**Scenario:** Retrieve a Figma file and list its top-level frames.

```typescript
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "abc123XYZ",
      depth: 1
    });

    console.log('File:', file.name);
    console.log('Last modified:', file.lastModified);
    console.log('Top-level frames:');

    file.document.children.forEach(page => {
      console.log('  Page:', page.name);
      page.children?.forEach(frame => {
        console.log('    Frame:', frame.name, '(', frame.type, ')');
      });
    });

    return {
      name: file.name,
      pages: file.document.children.length
    };
  `
});
```

---

### Example 2: Export Component as PNG

**Scenario:** Export a specific component as a 2x PNG image.

```typescript
call_tool_chain({
  code: `
    // Export node as PNG at 2x scale
    const images = await figma.figma_get_image({
      fileKey: "abc123XYZ",
      ids: ["1:234"],  // Node ID from Figma
      format: "png",
      scale: 2
    });

    console.log('Image URLs:', images.images);

    // Returns URLs like:
    // { "1:234": "https://figma-alpha-api.s3.us-west-2.amazonaws.com/..." }

    return images;
  `
});
```

---

### Example 3: Get Design System Components

**Scenario:** List all components in a design system file.

```typescript
call_tool_chain({
  code: `
    const components = await figma.figma_get_file_components({
      fileKey: "abc123XYZ"
    });

    console.log('Total components:', Object.keys(components.meta.components).length);

    // List component names and keys
    Object.entries(components.meta.components).forEach(([key, comp]) => {
      console.log('  -', comp.name, '| Key:', key);
    });

    return {
      count: Object.keys(components.meta.components).length,
      components: Object.values(components.meta.components).map(c => c.name)
    };
  `
});
```

---

### Example 4: Add Review Comment

**Scenario:** Post a review comment on a specific design element.

```typescript
call_tool_chain({
  code: `
    const comment = await figma.figma_post_comment({
      fileKey: "abc123XYZ",
      message: "Approved for development. Please ensure 8px padding is maintained.",
      client_meta: {
        node_id: "1:234"  // Attach to specific node
      }
    });

    console.log('Comment posted:', comment.id);
    console.log('By:', comment.user.handle);

    return comment;
  `
});
```

---

### Example 5: Multi-Tool Workflow

**Scenario:** Get file, extract components, then export as SVG.

```typescript
call_tool_chain({
  code: `
    const fileKey = "abc123XYZ";

    // Step 1: Get file info
    console.log('Step 1: Getting file...');
    const file = await figma.figma_get_file({
      fileKey,
      depth: 1
    });
    console.log('File:', file.name);

    // Step 2: Get components
    console.log('Step 2: Getting components...');
    const components = await figma.figma_get_file_components({ fileKey });
    const componentList = Object.values(components.meta.components);
    console.log('Found', componentList.length, 'components');

    // Step 3: Export first 5 components as SVG
    console.log('Step 3: Exporting as SVG...');
    const nodeIds = componentList.slice(0, 5).map(c => c.node_id);

    const images = await figma.figma_get_image({
      fileKey,
      ids: nodeIds,
      format: "svg",
      svg_simplify_stroke: true
    });

    console.log('Exported', Object.keys(images.images).length, 'SVGs');

    return {
      file: file.name,
      componentsFound: componentList.length,
      exported: Object.keys(images.images).length,
      urls: images.images
    };
  `,
  timeout: 60000  // Extended timeout for multi-step workflow
});
```

---

### Example 6: Extract Design Tokens (Styles)

**Scenario:** Get all styles from a file for design token extraction.

```typescript
call_tool_chain({
  code: `
    const styles = await figma.figma_get_file_styles({
      fileKey: "abc123XYZ"
    });

    console.log('Design Tokens Found:');

    // Group by style type
    const grouped = {
      FILL: [],
      TEXT: [],
      EFFECT: [],
      GRID: []
    };

    Object.values(styles.meta.styles).forEach(style => {
      if (grouped[style.style_type]) {
        grouped[style.style_type].push(style.name);
      }
    });

    console.log('Colors:', grouped.FILL.length);
    console.log('Typography:', grouped.TEXT.length);
    console.log('Effects:', grouped.EFFECT.length);
    console.log('Grids:', grouped.GRID.length);

    return grouped;
  `
});
```

---

### Example 7: Design-to-Code Pipeline

**Scenario:** Extract design data and generate CSS custom properties (design tokens).

```typescript
call_tool_chain({
  code: `
    const fileKey = "abc123XYZ";

    // Step 1: Get file info
    console.log('Step 1: Getting file info...');
    const file = await figma.figma_get_file({
      fileKey,
      depth: 1
    });
    console.log('File:', file.name);

    // Step 2: Get all styles (design tokens)
    console.log('Step 2: Extracting styles...');
    const styles = await figma.figma_get_file_styles({ fileKey });

    // Step 3: Get all components
    console.log('Step 3: Extracting components...');
    const components = await figma.figma_get_file_components({ fileKey });

    // Step 4: Generate CSS custom properties
    console.log('Step 4: Generating CSS...');

    const cssTokens = [];
    cssTokens.push(':root {');
    cssTokens.push('  /* Design Tokens from Figma */');
    cssTokens.push('  /* File: ' + file.name + ' */');
    cssTokens.push('');

    // Process color styles
    const colorStyles = Object.values(styles.meta.styles)
      .filter(s => s.style_type === 'FILL');

    cssTokens.push('  /* Colors */');
    colorStyles.forEach(style => {
      const varName = style.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      cssTokens.push('  --color-' + varName + ': /* extracted from Figma */;');
    });

    // Process text styles
    const textStyles = Object.values(styles.meta.styles)
      .filter(s => s.style_type === 'TEXT');

    cssTokens.push('');
    cssTokens.push('  /* Typography */');
    textStyles.forEach(style => {
      const varName = style.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      cssTokens.push('  --font-' + varName + ': /* extracted from Figma */;');
    });

    cssTokens.push('}');

    const css = cssTokens.join('\\n');
    console.log('\\nGenerated CSS:');
    console.log(css);

    // Step 5: List components for implementation
    const componentList = Object.values(components.meta.components);
    console.log('\\nComponents to implement:', componentList.length);
    componentList.slice(0, 10).forEach(c => {
      console.log('  -', c.name);
    });

    return {
      file: file.name,
      colorTokens: colorStyles.length,
      textTokens: textStyles.length,
      components: componentList.length,
      css: css
    };
  `,
  timeout: 60000
});
```

**Output:** CSS custom properties with design tokens extracted from Figma, plus a list of components ready for implementation.

---

## 9. Troubleshooting

### Error Quick Reference

| Error | Option | Cause | Fix |
| --- | --- | --- | --- |
| OAuth popup blocked | A | Browser blocking popups | Allow popups for the auth domain |
| OAuth token expired | A | Session timeout | Re-authenticate via browser |
| `Tool not found: figma.get_file` | B | Missing `figma_` prefix | Use `figma.figma_get_file` |
| `Tool not found: figma.figma.get_file` | B | Dot instead of underscore | Use `figma.figma_get_file` |
| `403 Forbidden` | Both | Invalid or expired token | Re-auth (A) or regenerate API key (B) |
| `404 Not Found` | Both | Invalid file key | Check file key in URL |
| `Environment variable not found` | B | API key not in .env | Add `FIGMA_API_KEY` to .env |
| `Rate limit exceeded` | Both | Too many requests | Wait and retry, reduce request frequency |

---

### Tool Not Found Error (Option B Only)

**Problem:** `Error: Tool not found: figma.get_file`

**Cause:** Missing the `figma_` prefix in the tool name. This is a Code Mode naming convention requirement.

**Fix:**
```typescript
// WRONG
await figma.get_file({ fileKey: "abc" });

// WRONG
await figma.figma.get_file({ fileKey: "abc" });

// CORRECT
await figma.figma_get_file({ fileKey: "abc" });
```

> This only applies to Option B (Framelink via Code Mode). Option A (Official) handles tool naming automatically.

---

### Authentication Failed

**Problem:** `403 Forbidden` or `Invalid token`

**Option A fixes:**

1. Re-authenticate. The OAuth token may have expired. Make any Figma request to trigger re-authentication. A browser popup will appear for you to sign in again.
2. Check your browser. Confirm popups are not blocked.

**Option B fixes:**

1. Check the API key is set:
   ```bash
   grep "FIGMA_API_KEY" .env
   ```

2. Verify the token format (it should start with `figd_`):
   ```bash
   cat .env | grep FIGMA
   # Should show: FIGMA_API_KEY=figd_...
   ```

3. Regenerate the API key if it has expired. Go to Figma, then Settings, then Personal access tokens. Generate a new token and update your `.env` file.

4. Restart your AI client after changing `.env`.

---

### File Not Found

**Problem:** `404 Not Found` when accessing a file

**Fixes:**

1. Verify the file key from your URL:
   ```
   https://www.figma.com/file/ABC123xyz/Design-File
                              └─────────┘
                              Use this part
   ```

2. Check file permissions. Your Figma account must have access to the file. The file must be shared with you or live in your team.

3. Confirm the file has not been deleted or moved.

---

### Rate Limiting

**Problem:** `429 Too Many Requests`

#### Figma API Rate Limits

| Endpoint Type | Rate Limit | Notes |
| --- | --- | --- |
| **Most endpoints** | 30 requests/minute | Per user token |
| **Image export** | 60 requests/minute | Higher limit for exports |
| **Comments** | 30 requests/minute | Standard limit |
| **Team endpoints** | 30 requests/minute | Standard limit |

#### Best Practices

1. Add delays between calls:
   ```typescript
   // Add 2-second delay between requests
   await new Promise(resolve => setTimeout(resolve, 2000));
   ```

2. Batch operations when possible:
   ```typescript
   // Instead of multiple get_file calls, use get_file_nodes with multiple IDs
   await figma.figma_get_file_nodes({
     fileKey: "abc123",
     node_ids: ["1:2", "3:4", "5:6"]  // Multiple nodes in one call
   });
   ```

3. Cache responses. Do not re-fetch unchanged data.

4. Use pagination for large datasets. Use `page_size` and `cursor`:
   ```typescript
   let cursor = null;
   do {
     const result = await figma.figma_get_team_projects({
       team_id: "123",
       page_size: 30,
       cursor: cursor
     });
     // Process result.projects
     cursor = result.cursor;
   } while (cursor);
   ```

5. Handle 429 errors gracefully:
   ```typescript
   try {
     const file = await figma.figma_get_file({ fileKey: "abc" });
   } catch (error) {
     if (error.message.includes('429')) {
       console.log('Rate limited. Waiting 60 seconds...');
       await new Promise(resolve => setTimeout(resolve, 60000));
       // Retry
     }
   }
   ```

---

### Environment Variable Not Loading (Option B Only)

**Problem:** `Environment variable FIGMA_API_KEY not found` or `Variable 'figma_FIGMA_API_KEY' referenced in call template configuration not found`

**Fixes:**

1. Check the `.env` file exists:
   ```bash
   ls -la .env
   ```

2. Use prefixed variable names for Code Mode. If using Code Mode (`.utcp_config.json`), your `.env` must use:
   ```bash
   # WRONG (for Code Mode)
   FIGMA_API_KEY=figd_...

   # CORRECT (for Code Mode)
   figma_FIGMA_API_KEY=figd_...
   ```

   The prefix (`figma_`) comes from the `"name"` field in your `.utcp_config.json`.

3. Check the variable is defined with the correct prefix:
   ```bash
   cat .env | grep FIGMA
   # For Code Mode, should show: figma_FIGMA_API_KEY=figd_...
   # For standalone MCP, should show: FIGMA_API_KEY=figd_...
   ```

4. Confirm `.utcp_config.json` references `.env` (if using Code Mode):
   ```json
   "load_variables_from": [
     {
       "variable_loader_type": "dotenv",
       "env_file_path": ".env"
     }
   ]
   ```

5. Restart your AI client after changes.

---

## 10. Resources

### File Locations

| Path | Purpose |
| --- | --- |
| `opencode.json` | OpenCode MCP configuration |
| `.mcp.json` | Claude Code MCP configuration |
| `.vscode/mcp.json` | VS Code Copilot MCP configuration |
| `.utcp_config.json` | Code Mode provider configuration (Option B) |
| `.env` | API keys (gitignored) |

### Configuration Reference

**Option A: Official Figma MCP (`opencode.json`):**
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

**Option B: Framelink (`.utcp_config.json`):**
```json
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
```

### External Links

| Resource | URL |
| --- | --- |
| **Official Figma MCP Docs** | https://developers.figma.com/docs/figma-mcp-server/ |
| **Framelink GitHub** | https://github.com/GLips/Figma-Context-MCP |
| **Figma API Docs** | https://www.figma.com/developers/api |
| **Figma Settings** | https://www.figma.com/settings |
| **Code Mode Skill** | `.opencode/skill/mcp-code-mode/SKILL.md` |
| **Figma MCP Skill** | `.opencode/skill/mcp-figma/SKILL.md` |

### Related Install Guides

- [MCP - Code Mode](../mcp-code-mode/INSTALL_GUIDE.md): Required for Framelink via Code Mode

### Tool Summary

| Category | Tools |
| --- | --- |
| **File Management** | `get_file`, `get_file_nodes`, `set_api_key`, `check_api_key` |
| **Images** | `get_image`, `get_image_fills` |
| **Comments** | `get_comments`, `post_comment`, `delete_comment` |
| **Team and Projects** | `get_team_projects`, `get_project_files` |
| **Components** | `get_file_components`, `get_component`, `get_team_components`, `get_team_component_sets` |
| **Styles** | `get_file_styles`, `get_style`, `get_team_styles` |

---

## Quick Reference

### Naming Pattern

```typescript
// Pattern: figma.figma_{tool_name}

figma.figma_get_file({ fileKey: "abc123" });
figma.figma_get_image({ fileKey: "abc123", ids: ["1:2"], format: "png" });
figma.figma_get_file_components({ fileKey: "abc123" });
figma.figma_post_comment({ fileKey: "abc123", message: "LGTM!" });
```

### Common Workflows

**Get file info:**
```typescript
const file = await figma.figma_get_file({ fileKey: "abc123" });
```

**Export as image:**
```typescript
const images = await figma.figma_get_image({
  fileKey: "abc123",
  ids: ["1:2"],
  format: "png",
  scale: 2
});
```

**Get components:**
```typescript
const components = await figma.figma_get_file_components({ fileKey: "abc123" });
```

**Get styles:**
```typescript
const styles = await figma.figma_get_file_styles({ fileKey: "abc123" });
```

---

**Installation complete.**

**Option A users:** Ask your AI assistant naturally about your Figma files. OAuth handles authentication automatically.

**Option B users:** Remember the naming pattern for Code Mode:
```
figma.figma_{tool_name}
```

Start by asking your AI assistant:
```
Get information about my Figma file at [your-file-key]
```

For more information, see the [Figma MCP Skill](./SKILL.md) documentation.

---

## Version History

| Version | Date | Changes |
| --- | --- | --- |
| **2.0.0** | 2026-02-20 | HVR compliance update: removed em dashes, Oxford commas and banned phrases. Fixed cross-references for Code Mode install guide. Standardized validation checkpoint naming. |
| **2.0.0** | 2025-01-01 | Major update: Added Official Figma MCP (Option A), corrected package name to `figma-developer-mcp`, restructured for dual-option documentation |
| **1.1.0** | 2024-12-30 | Added Code Mode Provider emphasis, improved architecture diagrams, added design-to-code pipeline example, expanded rate limits documentation |
| **1.0.0** | 2024-12-29 | Initial release with 18 tools, 7 examples, complete troubleshooting guide |

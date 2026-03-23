---
description: "Prerequisites, Code Mode dependency, configuration, and cross-tool workflow patterns."
---
# Integration Points

How Figma MCP connects to Code Mode, its configuration requirements, and patterns for combining Figma with other MCP tools.

## Prerequisites

Before using this skill, ensure:

1. **mcp-code-mode skill is available** -- Figma is accessed through Code Mode
2. **Figma configured in .utcp_config.json** -- NOT in opencode.json
3. **Figma Personal Access Token** -- Stored in `.env` file

```
Dependency Chain:
+-------------------------------------------------------------+
|  mcp-code-mode skill (REQUIRED)                             |
|  +-> Provides: call_tool_chain(), search_tools(), etc.     |
|      +-> Enables: Access to Figma provider                   |
+-------------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------------+
|  mcp-figma skill (THIS SKILL)                                |
|  +-> Provides: Knowledge of 18 Figma tools                  |
|      +-> Pattern: figma.figma_{tool_name}                     |
+-------------------------------------------------------------+
```

## Code Mode Dependency (REQUIRED)

> **CRITICAL**: This skill REQUIRES `mcp-code-mode`. Figma tools are NOT accessible without Code Mode.

**How Figma Relates to Code Mode:**

```
+-------------------------------------------------------------+
|  opencode.json                                              |
|  +-> Configures: code-mode MCP server                        |
|      +-> Points to: .utcp_config.json                        |
+-------------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------------+
|  .utcp_config.json                                           |
|  +-> Configures: figma provider (among others)                |
|      +-> Package: figma-developer-mcp                        |
|      +-> Auth: FIGMA_API_KEY                                |
+-------------------------------------------------------------+
```

**Figma Provider Configuration** (in `.utcp_config.json`):

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

> **CRITICAL: Prefixed Environment Variables**
>
> Code Mode prefixes all environment variables with `{manual_name}_`. For the config above with `"name": "figma"`, your `.env` file must use:
> ```bash
> figma_FIGMA_API_KEY=figd_your_token_here
> ```
> **NOT** `FIGMA_API_KEY=figd_...` (this will cause "Variable not found" errors)

> **Alternative**: If you prefer not to use env substitution, you can hardcode the API key directly in the config (not recommended for security).

## Two Options Available

| Option | Name                  | Type                 | Best For                             |
| ------ | --------------------- | -------------------- | ------------------------------------ |
| **A**  | Official Figma MCP    | HTTP (mcp.figma.com) | Simplicity - no install, OAuth login |
| **B**  | Framelink (3rd-party) | stdio (local)        | Code Mode integration, API key auth  |

**Recommendation:** Start with **Option A** (Official) - zero installation, OAuth login, works immediately. See [Install Guide](../INSTALL_GUIDE.md) for setup details.

## Related Skills

| Skill             | Relationship | Notes                                              |
| ----------------- | ------------ | -------------------------------------------------- |
| **mcp-code-mode** | **REQUIRED** | Figma accessed via Code Mode's `call_tool_chain()` |

## Cross-Tool Workflows

**Figma to ClickUp**:
```typescript
// Get design info, create task
const file = await figma.figma_get_file({ fileKey: "abc" });
const task = await clickup.clickup_create_task({
  name: `Implement: ${file.name}`,
  description: `Design file: https://figma.com/file/abc`
});
```

**Figma to Webflow**:
```typescript
// Export images, update CMS
const images = await figma.figma_get_image({ fileKey: "abc", ids: ["1:2"], format: "png" });
// Use image URLs in Webflow CMS
```

## Cross References
- [[how-it-works]] —Core invocation workflow using Code Mode
- [[rules]] —Authentication and naming rules
- [[related-resources]] —Install guide and external documentation

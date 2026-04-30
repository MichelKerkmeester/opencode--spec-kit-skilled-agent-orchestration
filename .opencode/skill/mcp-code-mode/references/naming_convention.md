---
title: Tool Naming Convention - Complete Guide
description: Critical naming pattern for MCP tool calls with troubleshooting guide.
---

# Tool Naming Convention - Complete Guide

Master the critical naming pattern to avoid the #1 most common Code Mode error.

---

## 1. OVERVIEW

### Core Pattern

```typescript
{manual_name}.{manual_name}_{tool_name}
```

**Pattern breakdown:**
1. **First part:** Manual name (from `.utcp_config.json`) as namespace
2. **Dot separator:** Namespace accessor
3. **Second part:** Manual name + underscore + tool name

**Why this pattern exists:**
- **Namespace collision prevention** - Multiple MCP servers won't conflict
- **Clear source identification** - You know which manual provides each tool
- **TypeScript interface generation** - Enables proper type checking
- **UTCP protocol requirement** - Not optional, breaks without it

---

## 2. COMMON MISTAKES

### Mistake 1: Missing Manual Prefix

**❌ Wrong:**
```typescript
await webflow.sites_list({});
await clickup.create_task({...});
await figma.get_file({...});
```

**✅ Correct:**
```typescript
await webflow.webflow_sites_list({});
await clickup.clickup_create_task({...});
await figma.figma_get_file({...});
```

**Error message you'll see:**
```
Error: Tool not found: webflow.sites_list
Available tools: webflow.webflow_sites_list, webflow.webflow_collections_list, ...
```

**Fix:** Add manual prefix to tool name: `{manual}_{tool}`

### Mistake 2: Wrong Dot Notation

**❌ Wrong:**
```typescript
await webflow.webflow.sites_list({});
await clickup.clickup.create_task({...});
```

**✅ Correct:**
```typescript
await webflow.webflow_sites_list({});
await clickup.clickup_create_task({...});
```

**Error message you'll see:**
```
TypeError: webflow.webflow is not a function
```

**Fix:** Use single dot: `manual.manual_tool` not `manual.manual.tool`

### Mistake 3: CamelCase vs snake_case Confusion

**❌ Wrong:**
```typescript
await webflow.webflowSitesList({});
await clickup.clickUpCreateTask({...});
```

**✅ Correct:**
```typescript
await webflow.webflow_sites_list({});
await clickup.clickup_create_task({...});
```

**Error message you'll see:**
```
Error: Tool not found: webflow.webflowSitesList
Did you mean: webflow.webflow_sites_list?
```

**Fix:** Use snake_case for tool names, not camelCase

### Mistake 4: Using MCP Server Name Instead of Manual Name

**❌ Wrong (using MCP server name from config):**
```json
// .utcp_config.json has:
"mcpServers": { "webflow": {...} }

// But manual name is different:
"name": "webflow_prod"
```

```typescript
// Wrong - using MCP server name
await webflow.webflow_sites_list({});
```

**✅ Correct (using manual name):**
```typescript
// Correct - using manual name
await webflow_prod.webflow_prod_sites_list({});
```

**Fix:** Always use the `name` field from manual_call_templates, not the mcpServers key

---

## 3. CONFIGURATION EXAMPLES

### Example 1: Webflow

**Configuration:**
```json
{
  "name": "webflow",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "webflow": {
        "transport": "stdio",
        "command": "npx",
        "args": ["mcp-remote", "https://mcp.webflow.com/sse"]
      }
    }
  }
}
```

**Correct tool calls:**
```typescript
// Site management
await webflow.webflow_sites_list({});
await webflow.webflow_sites_get({ site_id: "..." });
await webflow.webflow_sites_publish({ site_id: "..." });

// Collections
await webflow.webflow_collections_list({ site_id: "..." });
await webflow.webflow_collections_get({ collection_id: "..." });

// CMS Items
await webflow.webflow_collections_items_list_items({ collection_id: "..." });
await webflow.webflow_collections_items_create_item_live({
  collection_id: "...",
  request: { items: [{...}] }
});

// Pages
await webflow.webflow_pages_list({ site_id: "..." });
await webflow.webflow_pages_get_metadata({ page_id: "..." });

// Guide/Help
await webflow.webflow_webflow_guide_tool({});
```

### Example 2: ClickUp

**Configuration:**
```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@taazkareem/clickup-mcp-server"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
        }
      }
    }
  }
}
```

**Correct tool calls:**
```typescript
// Task management
await clickup.clickup_create_task({
  name: "Task name",
  listName: "List name",
  description: "Task description"
});
await clickup.clickup_get_task({ task_id: "..." });
await clickup.clickup_update_task({ task_id: "...", updates: {...} });
await clickup.clickup_delete_task({ task_id: "..." });

// Bulk operations
await clickup.clickup_create_bulk_tasks({ tasks: [...] });
await clickup.clickup_update_bulk_tasks({ tasks: [...] });

// Workspace
await clickup.clickup_get_workspace_hierarchy({});
await clickup.clickup_create_list({ name: "..." });
```

### Example 3: Figma

**Configuration:**
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

**Correct tool calls:**
```typescript
// Files
await figma.figma_get_file({ fileId: "..." });
await figma.figma_get_file_nodes({ fileId: "...", nodeIds: ["..."] });
await figma.figma_get_image({ fileId: "...", nodeIds: ["..."] });

// Collaboration
await figma.figma_get_comments({ file_key: "..." });
await figma.figma_post_comment({ file_key: "...", message: "..." });

// Configuration
await figma.figma_set_api_key({ api_key: "..." });
```

### Example 4: Notion

**Configuration:**
```json
{
  "name": "notion",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "notion": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-notion"],
        "env": {
          "NOTION_TOKEN": "${NOTION_TOKEN}"
        }
      }
    }
  }
}
```

**Correct tool calls:**
```typescript
// Users
await notion.notion_API_get_user({ user_id: "..." });
await notion.notion_API_get_users({});
await notion.notion_API_get_self({});

// Search
await notion.notion_API_post_search({ query: "..." });
await notion.notion_API_post_database_query({ database_id: "...", filter: {...} });

// Blocks
await notion.notion_API_get_block_children({ block_id: "..." });
await notion.notion_API_retrieve_a_block({ block_id: "..." });
await notion.notion_API_update_a_block({ block_id: "...", updates: {...} });

// Pages
await notion.notion_API_retrieve_a_page({ page_id: "..." });
await notion.notion_API_post_page({ parent: {...}, properties: {...} });
```

### Example 5: Chrome DevTools (Multiple Instances)

**Configuration:**
```json
{
  "name": "chrome_devtools_1",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "chrome-devtools-1": {
        "transport": "stdio",
        "command": "npx",
        "args": ["chrome-devtools-mcp@latest"]
      }
    }
  }
}
```

**Correct tool calls:**
```typescript
// Navigation
await chrome_devtools_1.chrome_devtools_1_new_page({});
await chrome_devtools_1.chrome_devtools_1_navigate_page({ url: "..." });
await chrome_devtools_1.chrome_devtools_1_close_page({ pageId: "..." });

// Interaction
await chrome_devtools_1.chrome_devtools_1_click({ selector: "..." });
await chrome_devtools_1.chrome_devtools_1_fill({ selector: "...", value: "..." });
await chrome_devtools_1.chrome_devtools_1_fill_form({ formData: {...} });

// Inspection
await chrome_devtools_1.chrome_devtools_1_take_screenshot({});
await chrome_devtools_1.chrome_devtools_1_evaluate_script({ script: "..." });
await chrome_devtools_1.chrome_devtools_1_get_console_message({});
```

**Note:** Manual name includes instance number (`chrome_devtools_1`) to prevent conflicts with multiple Chrome DevTools instances.

---

## 4. TOOL DISCOVERY

**Before calling tools, discover what's available:**

```typescript
// Step 1: Search for tools by task description
const tools = await search_tools({
  task_description: "webflow site management",
  limit: 10
});

// Result:
[
  {
    name: "webflow.webflow_sites_list",
    description: "List all Webflow sites",
    interface: "() => Promise<{ sites: Site[] }>"
  },
  {
    name: "webflow.webflow_sites_get",
    description: "Get a specific Webflow site",
    interface: "(params: { site_id: string }) => Promise<Site>"
  }
  // ... more tools
]

// Step 2: Get detailed info for specific tool
const info = await tool_info({ tool_name: "webflow.webflow_sites_list" });

// Result:
{
  name: "webflow.webflow_sites_list",
  description: "List all Webflow sites accessible with the current token",
  interface: `
    interface WebflowSitesListParams {}
    interface WebflowSite {
      id: string;
      displayName: string;
      shortName: string;
      customDomains: string[];
      // ... more fields
    }
    function webflow_sites_list(params: WebflowSitesListParams): Promise<{ sites: WebflowSite[] }>;
  `
}

// Step 3: Call the tool with correct naming
const sites = await webflow.webflow_sites_list({});
```

---

## 5. TROUBLESHOOTING GUIDE

### Problem: "Tool not found" Error

**Error message:**
```
Error: Tool not found: webflow.sites_list
Available tools: webflow.webflow_sites_list, ...
```

**Solutions:**
1. Check tool name includes manual prefix: `manual_tool` not just `tool`
2. Use tool discovery to find exact name:
   ```typescript
   const tools = await search_tools({ task_description: "webflow sites", limit: 5 });
   console.log(tools.map(t => t.name));
   ```
3. Verify manual name in `.utcp_config.json` matches what you're using

### Problem: "Not a function" TypeError

**Error message:**
```
TypeError: webflow.webflow is not a function
```

**Cause:** Using double dot notation (`manual.manual.tool`)

**Solution:** Use single dot: `manual.manual_tool`

### Problem: "Did you mean..." Suggestion

**Error message:**
```
Error: Tool not found: webflow.webflowSitesList
Did you mean: webflow.webflow_sites_list?
```

**Cause:** Using camelCase instead of snake_case

**Solution:** Use snake_case for all tool names

### Problem: Wrong Manual Name

**Error message:**
```
ReferenceError: webflow_prod is not defined
```

**Cause:** Manual name in config doesn't match what you're using in code

**Solution:**
1. Check `.utcp_config.json` for correct `name` field
2. Use that exact name as namespace:
   ```json
   // Config has:
   "name": "webflow_prod"

   // Use in code:
   await webflow_prod.webflow_prod_sites_list({});
   ```

---

## 6. QUICK REFERENCE

| Manual Name         | Naming Pattern                             | Example                                        |
| ------------------- | ------------------------------------------ | ---------------------------------------------- |
| `webflow`           | `webflow.webflow_{tool}`                   | `webflow.webflow_sites_list()`                 |
| `clickup`           | `clickup.clickup_{tool}`                   | `clickup.clickup_create_task()`                |
| `figma`             | `figma.figma_{tool}`                       | `figma.figma_get_file()`                       |
| `notion`            | `notion.notion_API_{tool}`                 | `notion.notion_API_get_user()`                 |
| `chrome_devtools_1` | `chrome_devtools_1.chrome_devtools_1_{tool}` | `chrome_devtools_1.chrome_devtools_1_new_page()` |
| `github`            | `github.github_{tool}`                     | `github.github_get_pull_request()`             |

---

## 7. BEST PRACTICES

### 1. Always Use Tool Discovery First

**Good workflow:**
```typescript
// 1. Search for what you need
const tools = await search_tools({
  task_description: "create webflow collection item",
  limit: 5
});

// 2. Review tool names
console.log(tools.map(t => t.name));

// 3. Get full interface
const info = await tool_info({
  tool_name: "webflow.webflow_collections_items_create_item_live"
});

// 4. Call with correct name and params
const result = await webflow.webflow_collections_items_create_item_live({
  collection_id: "...",
  request: { items: [{...}] }
});
```

### 2. Use TypeScript Autocomplete

**Enable autocomplete in your IDE:**
- Tool interfaces are generated automatically
- Autocomplete shows available tools and parameters
- Type checking catches errors before execution

### 3. Log Tool Names for Debugging

**When troubleshooting:**
```typescript
// List all available tools
const allTools = await list_tools();
console.log('Available tools:', allTools.tools);

// Filter to specific manual
const webflowTools = allTools.tools.filter(t => t.startsWith('webflow.'));
console.log('Webflow tools:', webflowTools);
```

### 4. Reference Configuration File

**Always verify:**
```bash
# Check manual names in config
cat .utcp_config.json | grep '"name"'

# Should see:
# "name": "webflow",
# "name": "clickup",
# etc.
```

---

## 8. SUMMARY

**Golden rule:** `{manual_name}.{manual_name}_{tool_name}`

**Remember:**
1. Manual name comes from `.utcp_config.json` `name` field
2. Tool name uses snake_case, not camelCase
3. Single dot separator, not double
4. Manual prefix is required, not optional
5. Use tool discovery to find exact names
6. This pattern prevents namespace collisions and enables TypeScript support

**When in doubt:** Use `search_tools()` or `list_tools()` to discover the correct tool name.

---

## 9. RELATED RESOURCES

### Reference Files
- [tool_catalog.md](./tool_catalog.md) - Complete list of 200+ tools organized by MCP server
- [configuration.md](./configuration.md) - Configuration guide showing how manual names are defined
- [architecture.md](./architecture.md) - System architecture and execution environment
- [workflows.md](./workflows.md) - Workflow examples showing correct naming patterns in practice

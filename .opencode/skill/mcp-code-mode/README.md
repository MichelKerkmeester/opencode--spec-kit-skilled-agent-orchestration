---
title: "MCP Code Mode"
description: "MCP orchestration via TypeScript execution for efficient multi-tool workflows. Mandatory for all external MCP tool calls with 98.7% context reduction and 60% faster execution."
trigger_phrases:
  - "code mode"
  - "call_tool_chain"
  - "utcp"
  - "mcp tool call"
  - "external mcp"
---

# MCP Code Mode

> Execute TypeScript code with access to 200+ external MCP tools through progressive disclosure, delivering 98.7% context reduction and 60% faster execution than direct tool calling.

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

MCP Code Mode is the mandatory execution layer for all external MCP tool calls. Instead of exposing hundreds of tool schemas directly into the AI context window, Code Mode provides a single `call_tool_chain` tool that executes TypeScript code with full access to your entire toolkit. Tools are discovered on demand and called using a consistent naming pattern, so the AI context stays small regardless of how many tools are configured.

Code Mode applies to tools configured in `.utcp_config.json`: ClickUp, Figma, Webflow, Notion, Chrome DevTools, and any other external MCP servers. It does not apply to native MCP tools such as Spec Kit Memory, Sequential Thinking, or CocoIndex Code, which are called directly. This boundary is strict: using Code Mode for native tools wastes overhead, and bypassing Code Mode for external tools causes context exhaustion.

The skill covers seven native tools exposed by the Code Mode MCP server: `call_tool_chain` executes arbitrary TypeScript with tool access, `search_tools` finds relevant tools by description, `list_tools` returns all registered tool names, `tool_info` returns the TypeScript interface for a specific tool, `get_required_keys_for_tool` checks required environment variables, `register_manual` adds a server at runtime, and `deregister_manual` removes one. Together these seven tools replace what would otherwise be 200+ individual tool definitions loaded upfront.

When Code Mode work hands back into a Spec Kit packet, `/spec_kit:resume` remains the canonical recovery surface. Continuity still rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay supporting only.

### Key Statistics

| Metric | Traditional | Code Mode | Improvement |
|--------|-------------|-----------|-------------|
| Version | 1.0.7.0 | | |
| Context tokens (47 tools) | 141k | 1.6k | 98.7% reduction |
| Execution time (4 tools) | ~2000ms | ~300ms | 60% faster |
| API round trips | 15+ | 1 | 93% reduction |
| Simple workflows (2-3 tools) | 3 iterations | 1 execution | 67% faster |
| Complex workflows (8+ tools) | 16 iterations | 1 execution | 88% faster |

### How This Compares

| Approach | Context Cost | Multi-tool State | Tool Discovery |
|----------|-------------|-----------------|----------------|
| Direct tool calling | High (all schemas loaded) | None (each call independent) | Manual |
| Code Mode | Minimal (1.6k tokens) | Full (variables persist) | Progressive via search_tools |
| Native MCP tools | Low (per-tool) | N/A (single tool calls) | Not applicable |

### Key Features

| Feature | Description |
|---------|-------------|
| Progressive discovery | Tools loaded on demand, zero upfront cost |
| State persistence | Variables flow naturally between tool calls in a single execution |
| Type safety | Full TypeScript support with autocomplete via tool_info |
| Built-in observability | console.log output captured automatically and returned |
| Configurable timeouts | 30s default, extendable to 120s+ for complex workflows |
| Parallel execution | Promise.all and Promise.allSettled supported natively |
| Error isolation | try/catch prevents one failing tool from crashing the workflow |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Discover available tools.** Before calling any external tool, use `search_tools` to find what is registered and confirm the exact name. Never guess tool names.

```typescript
search_tools({
  task_description: "clickup task management",
  limit: 10
});
```

**Step 2: Confirm the tool interface.** Use `tool_info` to get the TypeScript interface definition before executing code with parameters.

```typescript
tool_info({ tool_name: "clickup.clickup_create_task" });
```

**Step 3: Execute via call_tool_chain.** All external MCP tool calls go inside `call_tool_chain`. The naming pattern is always `{manual_name}.{manual_name}_{tool_name}`.

```typescript
call_tool_chain({
  code: `
    const task = await clickup.clickup_create_task({
      name: "New Feature",
      listName: "Development Sprint",
      description: "Implement user authentication"
    });
    console.log("Task created:", task.id);
    return task;
  `
});
```

**Step 4: Chain multiple tools in one execution.** Data from the first tool call is available to all subsequent calls within the same `code` block.

```typescript
call_tool_chain({
  code: `
    const design = await figma.figma_get_file({ fileKey: "abc123" });
    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
      listName: "Frontend Sprint"
    });
    return { design: design.name, taskId: task.id };
  `,
  timeout: 60000
});
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

Code Mode's most important property is that it treats the AI's context window as a resource to protect. When an AI client loads 47 tool definitions directly, it consumes roughly 141,000 tokens before any real work begins. Code Mode reduces that to 1,600 tokens regardless of how many tools are configured. The mechanism is simple: the AI receives only the four Code Mode meta-tools, then uses `search_tools` to discover what it needs at call time.

Multi-tool workflows gain the most from Code Mode. A workflow that fetches a Figma design, creates a ClickUp task, and updates a Webflow CMS item would traditionally require three separate AI reasoning loops and three round trips. Inside a single `call_tool_chain` execution, all three calls share variables, run sequentially or in parallel as needed, and return a single structured result. The AI processes the outcome once rather than re-parsing context after each step.

The naming convention is the one area where Code Mode requires attention. Every external tool follows the pattern `{manual_name}.{manual_name}_{tool_name}`. The manual name comes from the `name` field in `.utcp_config.json` and acts as both the TypeScript namespace and the function prefix. Calling `webflow.sites_list({})` fails silently because the prefix is missing. The correct call is `webflow.webflow_sites_list({})`. Using `search_tools` and `tool_info` before writing execution code prevents this class of error entirely.

Environment variable handling has one non-obvious rule. Code Mode prefixes all environment variables with the manual name from configuration. If the manual name is `clickup` and the config references `${CLICKUP_API_KEY}`, the `.env` file must declare `clickup_CLICKUP_API_KEY`. Using the unprefixed form causes an authentication error at runtime, not at startup. Checking required variables with `get_required_keys_for_tool` before running a workflow avoids this failure mode.

### 3.2 FEATURE REFERENCE

**Native Tools (7 total)**

| Tool | Purpose | Typical Response Time |
|------|---------|----------------------|
| `call_tool_chain` | Execute TypeScript with full tool access | Varies by workflow |
| `search_tools` | Find tools by natural language description | Under 100ms |
| `list_tools` | Return all registered tool names | Under 50ms |
| `tool_info` | Return TypeScript interface for a tool | Under 50ms |
| `get_required_keys_for_tool` | Check required environment variables for a tool | Under 50ms |
| `register_manual` | Register an MCP server at runtime | Under 100ms |
| `deregister_manual` | Remove a registered MCP server | Under 50ms |

**call_tool_chain Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `code` | string | Yes | - | TypeScript code to execute |
| `timeout` | number | No | 30000 | Execution timeout in milliseconds |
| `max_output_size` | number | No | 200000 | Max response size in characters |

**Tool Scope: Code Mode vs. Native MCP**

| Tool Category | Examples | How to Call |
|---------------|----------|-------------|
| Code Mode tools | ClickUp, Figma, Webflow, Notion, Chrome DevTools | Via call_tool_chain |
| Native MCP tools | Spec Kit Memory, Sequential Thinking, CocoIndex | Call directly, NOT via call_tool_chain |
| File operations | Read, Write, Edit, Grep, Glob, Bash | Call directly |

**Timeout Guidelines**

| Workflow Type | Recommended Timeout |
|---------------|---------------------|
| Simple (1-2 tools) | 30s (default) |
| Complex (3-5 tools) | 60s |
| Very complex (6+ tools) | 120s+ |

**Parallel Execution Patterns**

| Pattern | Use When | Example |
|---------|----------|---------|
| `Promise.all()` | All operations must succeed | `const [a, b] = await Promise.all([fnA(), fnB()])` |
| `Promise.allSettled()` | Partial success acceptable | `const results = await Promise.allSettled([...])` |
| Sequential with state | Each step depends on previous | Standard async/await chain |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
mcp-code-mode/
  SKILL.md                       # AI agent instructions and routing rules
  README.md                      # This file
  INSTALL_GUIDE.md               # Installation and setup walkthrough
  references/
    naming_convention.md         # Tool naming pattern with examples and fixes
    configuration.md             # .utcp_config.json and .env setup guide
    tool_catalog.md              # 250+ tools across 8 configured servers
    workflows.md                 # Five end-to-end workflow examples
    architecture.md              # Token economics and system internals
```

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

Code Mode uses two separate configuration systems. Understanding the boundary between them prevents the most common setup errors.

**`.utcp_config.json`** (project root) defines all external MCP servers accessible through Code Mode. Each entry in `manual_call_templates` has a `name` field that becomes the TypeScript namespace and the environment variable prefix.

```json
{
  "manual_call_templates": [
    {
      "name": "clickup",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "clickup": {
            "transport": "stdio",
            "command": "npx",
            "args": ["mcp-clickup"],
            "env": { "CLICKUP_API_KEY": "${clickup_CLICKUP_API_KEY}" },
            "disabled": false
          }
        }
      }
    }
  ]
}
```

**`.env`** (project root) stores API keys using the prefixed naming convention. The prefix is the manual name from `.utcp_config.json`.

| Manual Name | Config Reference | `.env` Variable |
|-------------|-----------------|-----------------|
| `clickup` | `${CLICKUP_API_KEY}` | `clickup_CLICKUP_API_KEY` |
| `figma` | `${FIGMA_API_KEY}` | `figma_FIGMA_API_KEY` |
| `notion` | `${NOTION_TOKEN}` | `notion_NOTION_TOKEN` |

**`opencode.json`** registers the Code Mode MCP server itself as a native tool. The `UTCP_CONFIG_FILE` environment variable points to the `.utcp_config.json` path.

```json
{
  "mcp": {
    "code_mode": {
      "type": "local",
      "command": ["node", "/path/to/code-mode-mcp/dist/index.js"],
      "environment": {
        "UTCP_CONFIG_FILE": "/absolute/path/to/.utcp_config.json"
      },
      "enabled": true
    }
  }
}
```

For full setup instructions including installing the MCP server package and validating configuration, see [INSTALL_GUIDE.md](INSTALL_GUIDE.md).

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: Single external tool call**

```typescript
call_tool_chain({
  code: `
    const sites = await webflow.webflow_sites_list({
      context: "Listing sites to identify CMS collection structure"
    });
    console.log("Found", sites.length, "Webflow sites");
    return sites;
  `
});
```

**Example 2: Multi-tool workflow with error handling**

```typescript
call_tool_chain({
  code: `
    try {
      const design = await figma.figma_get_file({ fileKey: "AbC123DeF45" });

      const task = await clickup.clickup_create_task({
        name: \`Implement: \${design.name}\`,
        listName: "Frontend Sprint",
        description: "Build from latest approved Figma file"
      });

      const cmsItem = await webflow.webflow_collections_items_create_item_live({
        collection_id: "design-queue-id",
        request: {
          items: [{
            fieldData: {
              name: design.name,
              taskUrl: task.url,
              status: "In Queue"
            }
          }]
        }
      });

      return { success: true, designName: design.name, taskId: task.id, cmsItemId: cmsItem.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  `,
  timeout: 60000
});
```

**Example 3: Parallel fetch across independent services**

```typescript
call_tool_chain({
  code: `
    const [sites, tasks, figmaFile] = await Promise.all([
      webflow.webflow_sites_list({}),
      clickup.clickup_get_tasks({ listName: "Development" }),
      figma.figma_get_file({ fileKey: "abc123" })
    ]);

    return {
      siteCount: sites.length,
      taskCount: tasks.length,
      figmaName: figmaFile.name
    };
  `,
  timeout: 60000
});
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**"Tool is not a function" or "Cannot read properties of undefined"**

What you see: The execution fails immediately when calling an external tool, before any real work runs.

Common causes: The tool name is missing the manual prefix. Calling `webflow.sites_list({})` fails because the correct name is `webflow.webflow_sites_list({})`. The pattern is always `{manual_name}.{manual_name}_{tool_name}`.

Fix: Use `search_tools({ task_description: "webflow site list" })` to get the exact registered name, then call `tool_info` to confirm the interface. Never construct tool names from memory.

---

**"Variable 'clickup_CLICKUP_API_KEY' not found" or authentication errors**

What you see: The tool executes but returns an authentication failure or missing credentials error.

Common causes: The `.env` file uses the unprefixed key name (`CLICKUP_API_KEY`) instead of the prefixed form (`clickup_CLICKUP_API_KEY`). Code Mode applies the manual name as a prefix to all environment variables at load time.

Fix: Check the manual name in `.utcp_config.json` and prepend it to the key name in `.env`. Run `get_required_keys_for_tool({ tool_name: "clickup.clickup_create_task" })` to see exactly which prefixed variable names are required.

---

**"Execution timeout" or workflow hangs**

What you see: `call_tool_chain` returns a timeout error after the default 30 seconds.

Common causes: The workflow calls more than two tools or one of the target MCP servers is slow to respond. The default 30s timeout is designed for simple one or two tool calls.

Fix: Increase the timeout parameter. Use 60s for three to five tool workflows and 120s or more for six or more tools. If timeouts persist even with a generous limit, run `list_tools()` to confirm the target server is registered and responding.

---

**"UTCP config file not found" on startup**

What you see: Code Mode fails to initialize and reports it cannot locate the configuration file.

Common causes: The `UTCP_CONFIG_FILE` environment variable in `opencode.json` points to a relative path instead of an absolute path, or the file does not exist at that location.

Fix: Use an absolute path in the `UTCP_CONFIG_FILE` value. Verify the file exists with `ls -la /absolute/path/to/.utcp_config.json` and validate it with `cat .utcp_config.json | python3 -m json.tool`.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: When should I NOT use call_tool_chain?**

A: Do not use `call_tool_chain` for file operations (Read, Write, Edit, Grep, Glob, Bash), for native MCP tools (Spec Kit Memory, Sequential Thinking, CocoIndex Code), or for any tool already exposed as a first-class tool in the AI client. Code Mode is exclusively for tools registered in `.utcp_config.json`. Using `call_tool_chain` for native tools adds unnecessary overhead and does not give you access to those tools anyway, since Code Mode only sees what is in `.utcp_config.json`.

**Q: Why does list_tools() not show Sequential Thinking or Spec Kit Memory?**

A: Those tools are native MCP tools configured in `opencode.json`, not in `.utcp_config.json`. The four discovery tools (`list_tools`, `search_tools`, `tool_info`, `get_required_keys_for_tool`) only see Code Mode tools from `.utcp_config.json`. Native MCP tools are called directly by their full function name without going through Code Mode at all.

**Q: Can I add a new MCP server without restarting the AI client?**

A: Yes. Use `register_manual` with the full UTCP call template to register a new server at runtime. The server becomes available immediately inside `call_tool_chain`. To remove it, call `deregister_manual` with the manual name. For persistent registration across sessions, add the entry to `.utcp_config.json` and restart.

**Q: What happens if one tool fails in a multi-step workflow?**

A: Without error handling, an unhandled exception stops the entire `call_tool_chain` execution. Wrap critical sections in `try/catch` and return structured results with a `success` boolean. For workflows where partial success is acceptable, use `Promise.allSettled()` instead of `Promise.all()` so one failure does not cancel the rest.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

**This skill**

| File | Purpose |
|------|---------|
| [SKILL.md](./SKILL.md) | AI agent routing instructions, smart router pseudocode, rules |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Full installation and configuration walkthrough |

**References**

| File | Purpose |
|------|---------|
| [references/naming_convention.md](references/naming_convention.md) | Complete naming pattern guide with troubleshooting |
| [references/tool_catalog.md](references/tool_catalog.md) | Tool catalog with 250+ tools |
| [references/configuration.md](references/configuration.md) | .utcp_config.json and .env setup |
| [references/tool_catalog.md](references/tool_catalog.md) | 250+ tools across 8 configured servers |
| [references/workflows.md](references/workflows.md) | Five end-to-end workflow examples |
| [references/architecture.md](references/architecture.md) | Token economics and system internals |

**Related skills**

| Skill | Relationship |
|-------|-------------|
| [mcp-figma](../mcp-figma/SKILL.md) | Figma design file access via Code Mode |
| [mcp-chrome-devtools](../mcp-chrome-devtools/SKILL.md) | Browser automation via Code Mode |
| [system-spec-kit](../system-spec-kit/README.md) | Context preservation (native MCP, not via Code Mode) |

<!-- /ANCHOR:related-documents -->

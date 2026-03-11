---
title: "Code Mode MCP - TypeScript Tool Execution"
description: "MCP orchestration via TypeScript execution for efficient multi-tool workflows with 98.7% context reduction and 60% faster execution."
trigger_phrases:
  - "code mode"
  - "call_tool_chain"
  - "utcp"
---

# Code Mode MCP - TypeScript Tool Execution

> MCP orchestration via TypeScript execution for efficient multi-tool workflows. Provides **98.7% context reduction** and **60% faster execution** through progressive tool discovery and code-based tool chaining.

> **Navigation**:
> - New to Code Mode? Start with [Quick Start](#2--quick-start)
> - Need tool guidance? See [Tool Selection Guide](#3--tool-selection-guide)
> - Naming issues? See [Naming Convention](#5--naming-convention)
> - Configuration help? See [Configuration](#6--configuration)

[![MCP](https://img.shields.io/badge/MCP-Native-brightgreen.svg)](https://modelcontextprotocol.io)

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. TOOL SELECTION GUIDE](#3--tool-selection-guide)
- [4. MCP TOOLS (7 TOTAL)](#4--mcp-tools-7-total)
- [5. NAMING CONVENTION](#5--naming-convention)
- [6. CONFIGURATION](#6--configuration)
- [7. ARCHITECTURE](#7--architecture)
- [8. PERFORMANCE](#8--performance)
- [9. USAGE PATTERNS](#9--usage-patterns)
- [10. TROUBLESHOOTING](#10--troubleshooting)
- [11. RESOURCES](#11--resources)
- [12. QUICK REFERENCE CARD](#12--quick-reference-card)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What It Does

Code Mode transforms AI agents from clunky tool callers into efficient code executors. Instead of exposing hundreds of tools directly, it provides **ONE tool** (`call_tool_chain`) that executes TypeScript code with access to your entire toolkit.

### Why Code Mode?

Research from [Apple](https://machinelearning.apple.com/research/codeact), [Cloudflare](https://blog.cloudflare.com/code-mode/), [Anthropic](https://www.anthropic.com/engineering/code-execution-with-mcp) and others proves that LLMs excel at writing code but struggle with tool calls.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **98.7% Context Reduction** | 1.6k tokens vs 141k for 47 tools |
| **60% Faster Execution** | Single execution vs 15+ API round trips |
| **Progressive Discovery** | Tools loaded on-demand, zero upfront cost |
| **State Persistence** | Data flows naturally between operations |
| **Type Safety** | Full TypeScript support with autocomplete |
| **Built-in Observability** | Console output captured automatically |

### Performance Comparison

| Metric | Traditional | Code Mode | Improvement |
|--------|-------------|-----------|-------------|
| **API Round Trips** | 15+ | 1 | 93% reduction |
| **Context Tokens** | 141k (47 tools) | 1.6k | 98.7% reduction |
| **Simple Tasks** | 3 iterations | 1 execution | 67% faster |
| **Complex Tasks** | 16 iterations | 1 execution | 88% faster |

### Source Repository

| Property | Value |
|----------|-------|
| **GitHub** | [universal-tool-calling-protocol/code-mode](https://github.com/universal-tool-calling-protocol/code-mode) |
| **npm (MCP)** | `@utcp/code-mode-mcp` |
| **npm (Library)** | `@utcp/code-mode` |
| **Stars** | 1.2k+ |
| **License** | MPL-2.0 |

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Prerequisites

| Component | Purpose |
|-----------|---------|
| **Node.js 18+** | Runtime environment |
| **MCP Client** | OpenCode, Claude Desktop or compatible client |
| **API Keys** | For services you want to connect (optional) |

### Two MCP Configuration Systems

**IMPORTANT**: Code Mode only accesses tools in `.utcp_config.json`. Native MCP tools like Sequential Thinking, Spec Kit Memory and codex-specialized-subagents are NOT accessed through Code Mode.

| System | Config File | Examples |
|--------|-------------|----------|
| **Native MCP** | `opencode.json` | Sequential Thinking, Spec Kit Memory |
| **Code Mode MCP** | `.utcp_config.json` | Webflow, Figma, ClickUp, Chrome DevTools |

### Basic Workflow

```typescript
// 1. Discover available tools
search_tools({ task_description: "webflow site management", limit: 10 });

// 2. Get tool details
tool_info({ tool_name: "webflow.webflow_sites_list" });

// 3. Execute TypeScript code
call_tool_chain({
  code: `
    const sites = await webflow.webflow_sites_list({});
    console.log('Found', sites.length, 'sites');
    return sites;
  `
});
```

---

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:tool-selection -->
## 3. TOOL SELECTION GUIDE

### Tools at a Glance

| Tool | Purpose | Speed | Use When |
|------|---------|-------|----------|
| `call_tool_chain` | Execute TypeScript | varies | Multi-tool workflows |
| `search_tools` | Find tools by description | <100ms | Discovering available tools |
| `list_tools` | List all tool names | <50ms | Getting complete tool list |
| `tool_info` | Get tool TypeScript interface | <50ms | Need parameter details |
| `register_manual` | Add tool provider at runtime | ~1s | Dynamic tool registration |
| `deregister_manual` | Remove tool provider | <50ms | Cleanup |
| `get_required_keys_for_tool` | Get required env vars | <50ms | Check configuration |

### Tool Selection Flowchart

```text
User Request
     │
     ▼
┌────────────────────────────────────────┐
│ What do you need to do?                │
└───────────────┬────────────────────────┘
                │
    ┌───────────┼───────────┬───────────┬───────────┐
    │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼
┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Find   │  │ Execute│  │ List   │  │ Add    │  │ Remove │
│ tools  │  │ code   │  │ tools  │  │ server │  │ server │
└───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘
    │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼
search_tools  call_tool_   list_tools  register_   deregister_
              chain                    manual      manual
```

### When to Use Code Mode

**USE Code Mode for:**
- All external MCP tool calls (Webflow, Figma, ClickUp, etc.)
- Multi-tool workflows requiring state between calls
- Browser automation via Chrome DevTools MCP
- Any tools configured in `.utcp_config.json`

**DO NOT use Code Mode for:**
- File operations (use Read, Write, Edit tools)
- Text searching (use Grep tool)
- File discovery (use Glob tool)
- Bash commands (use Bash tool)
- Native MCP tools (Sequential Thinking, Spec Kit Memory, codex-specialized-subagents)

---

<!-- /ANCHOR:tool-selection -->

<!-- ANCHOR:mcp-tools -->
## 4. MCP TOOLS (7 TOTAL)

### 4.1 call_tool_chain

**Purpose**: Execute TypeScript code with full tool access.

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `code` | string | Yes | - | TypeScript code to execute |
| `timeout` | number | No | 30000 | Execution timeout in ms |
| `max_output_size` | number | No | 200000 | Max response size in chars |

**Example**:
```typescript
call_tool_chain({
  code: `
    // Note: Tool naming pattern is {manual_name}.{manual_name}_{tool_name}
    const sites = await webflow.webflow_sites_list({});
    const collections = await webflow.webflow_collections_list({
      site_id: sites[0].id
    });
    return { sites, collections };
  `,
  timeout: 60000
});
```

**Context parameter guidance**: When a Code Mode tool exposes a `context` field, pass a brief 15-25 word description for analytics and debugging.
```typescript
await webflow.webflow_sites_list({
  context: "Listing sites to identify collection structure for CMS update"
});
```

**Returns**:
```json
{
  "success": true,
  "result": { "sites": [...], "collections": [...] },
  "logs": ["console.log output captured here"]
}
```

---

### 4.2 search_tools

**Purpose**: Find relevant tools using natural language queries.

**Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_description` | string | Yes | - | What you want to do |
| `limit` | number | No | 10 | Max results |

**Example**:
```typescript
search_tools({
  task_description: "create clickup task with description",
  limit: 5
});
```

---

### 4.3 list_tools

**Purpose**: Get all registered tool names.

**Example**:
```typescript
list_tools();
// Returns: { tools: ["webflow.webflow_sites_list", "clickup.clickup_create_task", ...] }
```

---

### 4.4 tool_info

**Purpose**: Get complete tool information with TypeScript interface.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tool_name` | string | Yes | Full tool name |

**Example**:
```typescript
tool_info({ tool_name: "webflow.webflow_sites_list" });
// Returns TypeScript interface definition
```

---

### 4.5 register_manual

**Purpose**: Register a new tool provider at runtime.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `manual_call_template` | object | Yes | UTCP call template configuration |

**Example**:
```typescript
register_manual({
  manual_call_template: {
    name: "github",
    call_template_type: "mcp",
    config: {
      mcpServers: {
        github: {
          command: "npx",
          args: ["-y", "@modelcontextprotocol/server-github"],
          env: { "GITHUB_TOKEN": "..." }
        }
      }
    }
  }
});
```

---

### 4.6 deregister_manual

**Purpose**: Remove a registered tool provider.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `manual_name` | string | Yes | Name of the manual to remove |

---

### 4.7 get_required_keys_for_tool

**Purpose**: Get required environment variables for a tool.

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tool_name` | string | Yes | Name of the tool |

---

<!-- /ANCHOR:mcp-tools -->

<!-- ANCHOR:naming-convention -->
## 5. NAMING CONVENTION

### Critical Pattern

**The #1 most common error** when using Code Mode is wrong function names. All MCP tool calls MUST follow this pattern:

```
{manual_name}.{manual_name}_{tool_name}
```

### Examples

| Manual | Tool | Correct Call |
|--------|------|--------------|
| webflow | sites_list | `webflow.webflow_sites_list({})` |
| clickup | create_task | `clickup.clickup_create_task({})` |
| figma | get_file | `figma.figma_get_file({})` |
| chrome_devtools_1 | navigate_page | `chrome_devtools_1.chrome_devtools_1_navigate_page({})` |

### Common Mistakes

```typescript
// WRONG - missing manual prefix
await webflow.sites_list({});
await clickup.create_task({});

// CORRECT - includes manual prefix
await webflow.webflow_sites_list({});
await clickup.clickup_create_task({});
```

### Why This Pattern?

1. The manual name (from `.utcp_config.json`) becomes the TypeScript namespace
2. The tool name is prefixed with the manual name and joined with underscores
3. This prevents naming collisions between different MCP servers

### Discovery Methods

```typescript
// Use these to find exact tool names:
search_tools({ task_description: "your task here" });
list_tools();
tool_info({ tool_name: "webflow.webflow_sites_list" });
```

---

<!-- /ANCHOR:naming-convention -->

<!-- ANCHOR:configuration -->
## 6. CONFIGURATION

### Configuration Files

| File | Purpose | Location |
|------|---------|----------|
| `.utcp_config.json` | Code Mode tool definitions | Project root |
| `.env` | API keys and tokens | Project root |

### .utcp_config.json Structure

```json
{
  "load_variables_from": [
    {
      "variable_loader_type": "dotenv",
      "env_file_path": ".env"
    }
  ],
  "tool_repository": {
    "tool_repository_type": "in_memory"
  },
  "tool_search_strategy": {
    "tool_search_strategy_type": "tag_and_description_word_match"
  },
  "manual_call_templates": [
    {
      "name": "webflow",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "webflow": {
            "transport": "stdio",
            "command": "npx",
            "args": ["mcp-remote", "https://mcp.webflow.com/sse"],
            "env": {}
          }
        }
      }
    }
  ]
}
```

### Supported Call Template Types

| Type | Description | Example Use |
|------|-------------|-------------|
| `mcp` | Model Context Protocol servers | Webflow, Figma, ClickUp |
| `http` | REST APIs with OpenAPI | Custom APIs |
| `file` | Local JSON/YAML configurations | Custom tools |
| `cli` | Command-line tool execution | Git, shell commands |

### opencode.json Entry

```json
{
  "mcp": {
    "code_mode": {
      "type": "local",
      "command": ["node", "/path/to/code-mode-mcp/dist/index.js"],
      "environment": {
        "UTCP_CONFIG_FILE": "/path/to/.utcp_config.json"
      },
      "enabled": true
    }
  }
}
```

---

<!-- /ANCHOR:configuration -->

<!-- ANCHOR:architecture -->
## 7. ARCHITECTURE

### System Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                    CLI AI Agents (OpenCode)                     │
└─────────────────────────────────┬───────────────────────────────┘
                              │ MCP Protocol (stdio)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Code Mode MCP Server                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              TypeScript Execution Sandbox                 │  │
│  │  - V8 Isolate (secure)                                    │  │
│  │  - Tool access via TypeScript API                         │  │
│  │  - console.log() captured                                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                UTCP Client Layer                          │  │
│  │  - Progressive tool discovery                             │  │
│  │  - TypeScript interface generation                        │  │
│  │  - Tool registration management                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
         ┌────────────────────┴────────────────────┐
         │                                         │
┌────────▼────────┐   ┌───────────▼───────────┐   ┌───────────────┐
│     Webflow     │   │       ClickUp         │   │    Chrome     │
│      MCP        │   │        MCP            │   │   DevTools    │
└─────────────────┘   └───────────────────────┘   └───────────────┘
```

### Security Model

| Security Feature | Description |
|------------------|-------------|
| **V8 Isolate Sandbox** | Isolated execution context |
| **No Filesystem Access** | Tools only through registered servers |
| **Timeout Protection** | Configurable execution limits |
| **Zero Network Access** | No external dependencies exposed |

---

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:performance -->
## 8. PERFORMANCE

### Benchmark Results

Independent [Python benchmark study](https://github.com/imran31415/codemode_python_benchmark) validates **$9,536/year cost savings** at 1,000 scenarios/day:

| Complexity | Traditional | Code Mode | Improvement |
|------------|-------------|-----------|-------------|
| **Simple (2-3 tools)** | 3 iterations | 1 execution | 67% faster |
| **Medium (4-7 tools)** | 8 iterations | 1 execution | 75% faster |
| **Complex (8+ tools)** | 16 iterations | 1 execution | 88% faster |

### Why Code Mode is Faster

| Factor | Traditional | Code Mode |
|--------|-------------|-----------|
| **Batching** | One tool per call | Multiple tools per execution |
| **Context** | Full tool schemas loaded | On-demand discovery |
| **Processing** | Re-process context each call | Single processing pass |
| **State** | No state between calls | Variables persist in execution |

### Timeout Guidelines

| Workflow Type | Recommended Timeout |
|---------------|---------------------|
| Simple (1-2 tools) | 30s (default) |
| Complex (3-5 tools) | 60s |
| Very complex (6+ tools) | 120s+ |

---

<!-- /ANCHOR:performance -->

<!-- ANCHOR:usage-patterns -->
## 9. USAGE PATTERNS

### Pattern 1: Single Tool Call

```typescript
call_tool_chain({
  code: `
    const sites = await webflow.webflow_sites_list({});
    return sites;
  `
});
```

### Pattern 2: Multi-Tool Workflow

```typescript
call_tool_chain({
  code: `
    // 1. Fetch data from Figma
    const design = await figma.figma_get_file({ fileId: "abc123" });
    
    // 2. Create ClickUp task
    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
      listName: "Development Sprint"
    });
    
    // 3. Log progress
    console.log('Task created:', task.id);
    
    return { design, task };
  `,
  timeout: 60000
});
```

### Pattern 3: Error Handling

```typescript
call_tool_chain({
  code: `
    try {
      console.log('Starting workflow...');
      const result = await webflow.webflow_sites_list({});
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed:', error.message);
      return { success: false, error: error.message };
    }
  `
});
```

### Pattern 4: Progressive Discovery

```typescript
// 1. First discover available tools
search_tools({ task_description: "webflow collections" });

// 2. Get specific tool info
tool_info({ tool_name: "webflow.webflow_collections_list" });

// 3. Then execute with confidence
call_tool_chain({
  code: `
    const collections = await webflow.webflow_collections_list({
      site_id: "your-site-id"
    });
    return collections;
  `
});
```

---

<!-- /ANCHOR:usage-patterns -->

<!-- ANCHOR:troubleshooting -->
## 10. TROUBLESHOOTING

### Common Errors

#### "Tool is not a function" or "Cannot read properties of undefined"

**Cause**: Wrong tool naming pattern

**Solution**: Use `{manual_name}.{manual_name}_{tool_name}` pattern
```typescript
// Wrong
await webflow.sites_list({});

// Correct
await webflow.webflow_sites_list({});
```

#### "UTCP config file not found"

**Cause**: Code Mode cannot find `.utcp_config.json`

**Solution**:
1. Check `UTCP_CONFIG_FILE` env var points to correct absolute path
2. Verify file exists: `ls -la /path/to/.utcp_config.json`
3. Validate JSON: `cat .utcp_config.json | jq .`

#### "Tool not found" or "Manual not registered"

**Cause**: Tools not loading from configuration

**Solution**:
1. Check MCP server command is correct and executable
2. Verify environment variables are set in `.env`
3. Try `list_tools()` to see what is registered

#### "Execution timeout"

**Cause**: Code execution takes too long

**Solution**:
1. Increase timeout: `call_tool_chain({ code: '...', timeout: 60000 })`
2. Check if MCP servers are responding
3. Optimize code to be more efficient

### Diagnostic Commands

```typescript
// Check what tools are available
list_tools();

// Search for specific capabilities
search_tools({ task_description: "your task" });

// Get tool details
tool_info({ tool_name: "webflow.webflow_sites_list" });
```

---

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:resources -->
## 11. RESOURCES

### Bundled Files

| File | Purpose |
|------|---------|
| [SKILL.md](./SKILL.md) | AI agent instructions for Code Mode |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Installation and setup guide |
| [references/naming_convention.md](references/naming_convention.md) | Tool naming patterns |
| [references/configuration.md](references/configuration.md) | Configuration guide |
| [references/tool_catalog.md](references/tool_catalog.md) | Available tools |
| [references/workflows.md](references/workflows.md) | Workflow examples |
| [references/architecture.md](references/architecture.md) | System internals |
| [assets/config_template.md](assets/config_template.md) | Template configuration |
| [assets/env_template.md](assets/env_template.md) | Template .env file |
| [scripts/update-code-mode.sh](scripts/update-code-mode.sh) | Update helper for refreshing the local Code Mode install |
| [scripts/validate_config.py](scripts/validate_config.py) | Configuration validator |

### External Resources

- [UTCP Code Mode Repository](https://github.com/universal-tool-calling-protocol/code-mode) - Source code
- [Cloudflare Code Mode Research](https://blog.cloudflare.com/code-mode/) - Original whitepaper
- [Anthropic MCP Code Execution](https://www.anthropic.com/engineering/code-execution-with-mcp) - Research
- [Python Benchmark Study](https://github.com/imran31415/codemode_python_benchmark) - Performance analysis
- [UTCP Specification](https://utcp.io) - Protocol documentation

### Related Skills

| Skill | Purpose | MCP Type |
|-------|---------|----------|
| **[system-spec-kit](../system-spec-kit/README.md)** | Context preservation | Native MCP |
| **[mcp-figma](../mcp-figma/README.md)** | Figma design file retrieval and export | Code Mode MCP |
| **[mcp-chrome-devtools](../mcp-chrome-devtools/README.md)** | Browser automation with CLI-first fallback to MCP | Hybrid (CLI + Code Mode MCP) |

### Cross-Skill Workflow

```typescript
// All Code Mode - single execution for multi-tool workflow
call_tool_chain({
  code: `
    // 1. Create task in ClickUp
    const task = await clickup.clickup_create_task({
      name: "Implement feature",
      description: "Feature implementation task"
    });

    // 2. Update Webflow CMS with task reference
    const cmsItem = await webflow.webflow_collections_items_create_item_live({
      collection_id: "tasks-collection-id",
      request: {
        items: [{
          fieldData: {
            name: task.name,
            taskUrl: task.url,
            status: "In Queue"
          }
        }]
      }
    });

    return { task, cmsItem };
  `
});

// 3. Save context for future sessions (Native MCP - call directly)
// Use spec_kit_memory_memory_save() to preserve decisions
```

---

<!-- /ANCHOR:resources -->

<!-- ANCHOR:quick-reference -->
## 12. QUICK REFERENCE CARD

### Essential Commands

```typescript
// 1. Discover tools
search_tools({ task_description: "task description", limit: 10 });

// 2. Get tool info
tool_info({ tool_name: "manual.manual_tool" });

// 3. List all tools
list_tools();

// 4. Execute code
call_tool_chain({
  code: `
    const result = await manual.manual_tool({...});
    return result;
  `,
  timeout: 30000
});
```

### Naming Pattern

```
{manual_name}.{manual_name}_{tool_name}
```

Examples:
- `webflow.webflow_sites_list({})`
- `clickup.clickup_create_task({})`
- `figma.figma_get_file({})`

**Remember**: Code Mode is for **external MCP tools** (Webflow, Figma, ClickUp, etc.). Native MCP tools like Sequential Thinking, Spec Kit Memory and codex-specialized-subagents should be called directly, NOT through `call_tool_chain()`.

<!-- /ANCHOR:quick-reference -->

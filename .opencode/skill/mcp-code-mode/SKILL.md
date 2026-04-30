---
name: mcp-code-mode
description: "MCP orchestration via TypeScript execution for efficient multi-tool workflows. Use Code Mode for ALL MCP tool calls (ClickUp, Notion, Figma, Webflow, Chrome DevTools, etc.). Provides 98.7% context reduction, 60% faster execution, and type-safe invocation. Mandatory for external tool integration."
allowed-tools: [mcp__code_mode__call_tool_chain, mcp__code_mode__list_tools, mcp__code_mode__search_tools, mcp__code_mode__tool_info]
version: 1.0.7.0
---

<!-- Keywords: mcp-code-mode, typescript-execution, multi-tool-workflow, tool-orchestration, context-reduction, progressive-discovery, external-api-integration, mcp-server -->

# MCP Code Mode

Execute TypeScript code with direct access to 200+ MCP tools through progressive disclosure. Code Mode eliminates context overhead by loading tools on-demand, enabling complex multi-tool workflows in a single execution with state persistence and built-in error handling.

## 1. WHEN TO USE

### Use Code Mode When

**MANDATORY for ALL MCP tool calls**:
- ✅ Calling ClickUp, Notion, Figma, Webflow, Chrome DevTools, or any other MCP tools
- ✅ Accessing external APIs through MCP servers
- ✅ Managing tasks in project management tools
- ✅ Interacting with design tools, databases, or services
- ✅ Browser automation and web interactions

**Benefits over traditional tool calling**:
- 🚀 **98.7% context reduction** - 1.6k tokens vs 141k for 47 tools
- ⚡ **60% faster execution** - Single execution vs 15+ API round trips
- 🔗 **State persistence** - Data flows naturally between operations
- 🛡️ **Type safety** - Full TypeScript support with autocomplete
- 🎯 **Progressive loading** - Tools discovered on-demand, zero upfront cost

### Do NOT Use Code Mode For

**Use native tools instead**:
- ❌ File operations (use Read, Write, Edit tools)
- ❌ Text searching (use Grep tool)
- ❌ File discovery (use Glob tool)
- ❌ Bash commands (use Bash tool)
- ❌ Continuity recovery (use `/spec_kit:resume` first; only use native Spec Kit Memory tools after `handover.md -> _memory.continuity -> spec docs` has been exhausted)
- ❌ Sequential Thinking (call `sequential_thinking_sequentialthinking()` directly - **NATIVE MCP**)

> See Section 4 for details on Native MCP vs Code Mode distinction.

### Common Use Cases

| Scenario                     | Code Mode Approach                                                      | Benefit                     |
| ---------------------------- | ----------------------------------------------------------------------- | --------------------------- |
| **Create ClickUp task**      | `call_tool_chain({ code: "await clickup.clickup_create_task({...})" })` | Type-safe, single execution |
| **Multi-tool workflow**      | Figma → ClickUp → Webflow in one execution                              | State persists, 5× faster   |
| **Browser automation**       | Chrome DevTools MCP for testing/screenshots                             | Sandboxed, reliable         |
| **Design-to-implementation** | Fetch Figma design → Create task → Update CMS                           | Atomic workflow             |
| **External API access**      | Any MCP server (Notion, GitHub, etc.)                                   | Progressive tool loading    |

---

## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                    |
| ----------- | ------------------------ | ---------------------------- |
| ALWAYS      | Every skill invocation   | Core quick reference         |
| CONDITIONAL | If intent signals match  | Intent-mapped references     |
| ON_DEMAND   | Only on explicit request | Full configuration/workflows |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows.md"

INTENT_SIGNALS = {
    "NAMING": {"weight": 4, "keywords": ["tool not found", "naming", "prefix", "format"]},
    "SETUP": {"weight": 4, "keywords": ["setup", "install", "configure", ".utcp_config", ".env"]},
    "VALIDATE": {"weight": 4, "keywords": ["validate", "validation", "check config", "schema"]},
    "CATALOG": {"weight": 3, "keywords": ["what tools", "list tools", "discover tools", "catalog"]},
    "WORKFLOW": {"weight": 3, "keywords": ["workflow", "orchestrate", "multi-tool", "error handling"]},
    "ARCHITECTURE": {"weight": 2, "keywords": ["architecture", "token", "performance", "internals"]},
}

RESOURCE_MAP = {
    "NAMING": ["references/naming_convention.md"],
    "SETUP": ["references/configuration.md", "assets/config_template.md", "assets/env_template.md"],
    "VALIDATE": ["references/configuration.md", "references/naming_convention.md"],
    "CATALOG": ["references/tool_catalog.md"],
    "WORKFLOW": ["references/workflows.md"],
    "ARCHITECTURE": ["references/architecture.md"],
}

COMMAND_BOOSTS = {
    "search_tools": "CATALOG",
    "list_tools": "CATALOG",
    "tool_info": "CATALOG",
    "call_tool_chain": "WORKFLOW",
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full config", "deep dive", "full workflow", "all tools", "call_tool_chain", "tool chain", "mcp tools", "tool catalog", "code mode"],
    "ON_DEMAND": ["references/configuration.md", "references/workflows.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "query", "")),
        str(getattr(task, "text", "")),
        " ".join(getattr(task, "keywords", []) or []),
        str(getattr(task, "command", "")),
    ]
    return " ".join(parts).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def score_intents(task) -> dict[str, float]:
    """Weighted intent scoring from request text and signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    command = str(getattr(task, "command", "")).lower()
    for signal, intent in COMMAND_BOOSTS.items():
        if signal in command:
            scores[intent] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["WORKFLOW"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_code_mode_resources(task):
    inventory = discover_markdown_resources()
    intents = select_intents(score_intents(task), ambiguity_delta=1.0)
    loaded = []
    seen = set()

    def load_if_available(relative_path: str) -> None:
        guarded = _guard_in_skill(relative_path)
        if guarded in inventory and guarded not in seen:
            load(guarded)
            loaded.append(guarded)
            seen.add(guarded)

    for relative_path in LOADING_LEVELS["ALWAYS"]:
        load_if_available(relative_path)
    for intent in intents:
        for relative_path in RESOURCE_MAP.get(intent, []):
            load_if_available(relative_path)

    text = _task_text(task)
    if any(keyword in text for keyword in LOADING_LEVELS["ON_DEMAND_KEYWORDS"]):
        for relative_path in LOADING_LEVELS["ON_DEMAND"]:
            load_if_available(relative_path)

    if not loaded:
        load_if_available(DEFAULT_RESOURCE)

    return {"intents": intents, "resources": loaded}
```

---

## 3. HOW IT WORKS

### Critical Naming Pattern

**The #1 most common error** when using Code Mode is using wrong function names. All MCP tool calls MUST follow this pattern:

```typescript
{manual_name}.{manual_name}_{tool_name}
```

**Examples**:

✅ **Correct**:
```typescript
await webflow.webflow_sites_list({});
await clickup.clickup_create_task({...});
await figma.figma_get_file({...});
```

❌ **Wrong** (missing manual prefix):
```typescript
await webflow.sites_list({});        // Error: Tool not found
await clickup.create_task({...});    // Error: Tool not found
```

**See [references/naming_convention.md](references/naming_convention.md) for complete guide with troubleshooting.**

### Context Parameter

Many Code Mode tools require a `context` parameter (15-25 words) for analytics:

```typescript
await webflow.webflow_sites_list({ 
  context: "Listing sites to identify collection structure for CMS update" 
});
```

This helps with usage tracking and debugging.

### Tool Name Translation

> **Note:** `list_tools()` returns names in `a.b.c` format (e.g., `webflow.webflow.sites_list`). To call the tool, use underscore format: `webflow.webflow_sites_list()`. The `tool_info()` function shows the correct calling syntax.

### Basic Workflow

**Step 1: Discover Tools**

```typescript
// Progressive discovery - search for relevant tools
search_tools({
  task_description: "clickup task management",
  limit: 10
});

// Returns: Tool names and descriptions (minimal tokens)
// Example: ["clickup.clickup_create_task", "clickup.clickup_get_task", ...]
```

**Step 2: Call Tools via Code Mode**

```typescript
// Execute TypeScript with direct tool access
call_tool_chain({
  code: `
    // Note the naming pattern: {manual_name}.{manual_name}_{tool_name}
    const result = await clickup.clickup_create_task({
      name: "New Feature",
      listName: "Development Sprint",
      description: "Implement user authentication"
    });

    console.log('Task created:', result.id);
    return result;
  `
});
```

**Step 3: Multi-Tool Orchestration**

```typescript
// State persists across tool calls in single execution
call_tool_chain({
  code: `
    // Step 1: Get Figma design
    const design = await figma.figma_get_file({ fileId: "abc123" });

    // Step 2: Create ClickUp task (design data available)
    const task = await clickup.clickup_create_task({
      name: \`Implement: \${design.name}\`,
      description: \`Design has \${design.document.children.length} components\`
    });

    // Step 3: Update Webflow CMS (both design and task data available)
    const cms = await webflow.webflow_collections_items_create_item_live({
      collection_id: "queue-id",
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

    return { design, task, cms };
  `,
  timeout: 60000  // Extended timeout for complex workflow
});
```

---

## 4. PROJECT CONFIGURATION

### Two MCP Configuration Systems

**IMPORTANT**: Code Mode only accesses tools in `.utcp_config.json`. Native MCP tools are NOT accessed through Code Mode.

**1. Native MCP** (`opencode.json`) - Direct tools (call directly, NOT through Code Mode):
- **Sequential Thinking**: `sequential_thinking_sequentialthinking()`
- **Spec Kit continuity + memory**: `/spec_kit:resume` for recovery; native Spec Kit Memory tools such as `session_bootstrap()`, `session_resume()`, `memory_context()`, and `memory_search()` when canonical packet sources need deeper support
- **Code Mode server**: The Code Mode tool itself
- **Note**: Some AI environments have built-in extended thinking capabilities that may supersede Sequential Thinking MCP.

**2. Code Mode MCP** (`.utcp_config.json`) - External tools accessed through Code Mode:
- **MCP Config**: `.utcp_config.json` (project root)
- **Environment Variables**: `.env` (project root)
- **External tools**: Webflow, Figma, Chrome DevTools, ClickUp, Notion, etc.
- These are accessed via `call_tool_chain()` wrapper

### How to Discover Available Code Mode Tools

**These discovery methods ONLY work for Code Mode tools in `.utcp_config.json`**
**They do NOT show Sequential Thinking (which is in `.mcp.json`)**

**Step 1: Check Configuration**
```typescript
// Read .utcp_config.json to see configured Code Mode MCP servers
// Look for "manual_call_templates" array
// Each object has a "name" field (this is the manual name)
// Check "disabled" field - if true, server is not active

// NOTE: Sequential Thinking is NOT in this file
// Sequential Thinking is in .mcp.json and called directly
```

**Step 2: Use Progressive Discovery**
```typescript
// Search for Code Mode tools by description
const tools = await search_tools({
  task_description: "browser automation",
  limit: 10
});

// List all available Code Mode tools
const allTools = await list_tools();

// Get info about a specific Code Mode tool
const info = await tool_info({
  tool_name: "server_name.server_name_tool_name"
});

// NOTE: These discovery tools are part of Code Mode
// They only show tools configured in .utcp_config.json
// Sequential Thinking will NOT appear in these results
```

### Critical Naming Convention (Code Mode Tools Only)

**See Section 3: Critical Naming Pattern for the complete guide.**

**Quick reminder**: `{manual_name}.{manual_name}_{tool_name}` (e.g., `webflow.webflow_sites_list()`)

**Sequential Thinking Exception**:
- NOT in `.utcp_config.json` - uses native MCP tools
- Call directly: `sequential_thinking_sequentialthinking()`
- Does NOT use `call_tool_chain()`
- Sequential Thinking MCP provides structured reasoning for complex multi-step problems.

### Configuration Structure

```json
{
  "manual_call_templates": [
    {
      "name": "manual_name",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "manual_name": {
            "transport": "stdio",
            "command": "npx",
            "args": ["package-name"],
            "env": {},
            "disabled": false
          }
        }
      }
    }
  ]
}
```

### Critical: Prefixed Environment Variables

> **⚠️ IMPORTANT**: Code Mode prefixes ALL environment variables with `{manual_name}_` from your configuration.

**Example:**
- Config has `"name": "clickup"` and env section references `${CLICKUP_API_KEY}`
- Your `.env` file MUST use: `clickup_CLICKUP_API_KEY=pk_xxx`
- Using `CLICKUP_API_KEY=pk_xxx` will cause: `Error: Variable 'clickup_CLICKUP_API_KEY' not found`

**Quick Reference:**

| Manual Name | Config Reference | .env Variable |
|-------------|-----------------|---------------|
| `clickup` | `${CLICKUP_API_KEY}` | `clickup_CLICKUP_API_KEY` |
| `figma` | `${FIGMA_API_KEY}` | `figma_FIGMA_API_KEY` |
| `notion` | `${NOTION_TOKEN}` | `notion_NOTION_TOKEN` |

See [env_template.md](assets/env_template.md) for complete examples.

### Generic Multi-Tool Workflow Pattern

```typescript
call_tool_chain({
  code: `
    // Step 1: Discover what tools are available
    const availableTools = await search_tools({
      task_description: "sync design QA tasks and publish status",
      limit: 10
    });

    console.log("Available tools:", availableTools);

    // Step 2: Call tools using correct naming pattern
    const task = await clickup.clickup_create_task({
      name: "Verify hero section spacing",
      listName: "Design QA",
      description: "Compare Figma spacing against production page"
    });

    // Step 3: Chain multiple tools if needed
    const cmsItem = await webflow.webflow_collections_items_create_item_live({
      collection_id: "design-qa-queue",
      request: {
        items: [{
          fieldData: {
            name: task.name,
            status: "Queued",
            taskUrl: task.url
          }
        }]
      }
    });

    return { task, cmsItem, availableTools: availableTools.length };
  `,
  timeout: 60000
});
```

### How to Check Active Code Mode Servers

**IMPORTANT**: This only shows Code Mode servers in `.utcp_config.json`, NOT Sequential Thinking

```typescript
// This code shows how to discover what Code Mode tools are configured
call_tool_chain({
  code: `
    // List all available tools from all active Code Mode MCP servers
    // NOTE: This will NOT include Sequential Thinking
    const allTools = await list_tools();

    // Group by server (manual name is prefix before first dot)
    const servers = {};
    allTools.forEach(tool => {
      const serverName = tool.split('.')[0];
      if (!servers[serverName]) servers[serverName] = [];
      servers[serverName].push(tool);
    });

    console.log("Active Code Mode servers:", Object.keys(servers));
    console.log("Tool counts:", Object.fromEntries(
      Object.entries(servers).map(([k, v]) => [k, v.length])
    ));

    console.log("NOTE: Sequential Thinking is NOT in this list");
    console.log("Sequential Thinking is a native MCP tool, not a Code Mode tool");

    return servers;
  `
});
```

---

## 5. RULES

### ✅ ALWAYS

- **Use Code Mode for ALL MCP tool calls** - Mandatory for ClickUp, Notion, Figma, Webflow, Chrome DevTools, etc.
- **Follow naming pattern**: `{manual_name}.{manual_name}_{tool_name}` (see [naming_convention.md](references/naming_convention.md))
- **Use progressive discovery**: `search_tools()` before calling unknown tools
- **Use try/catch** for error handling in multi-step workflows
- **Set appropriate timeouts**: 30s (simple), 60s (complex), 120s+ (very complex)
- **Console.log progress** in complex workflows for debugging
- **Structure return values** consistently: `{ success, data, errors, timestamp }`

### ❌ NEVER

- **Skip Code Mode for MCP tools** - Direct MCP calls cause context exhaustion
- **Use wrong naming pattern** - `webflow.sites_list` instead of `webflow.webflow_sites_list`
- **Guess tool names** - Use `search_tools()` to discover correct names
- **Ignore TypeScript errors** - Type safety prevents runtime errors
- **Skip error handling** - Unhandled errors crash entire workflow
- **Use Code Mode for file operations** - Use Read/Write/Edit tools instead
- **Assume tool availability** - Verify with `list_tools()` first

### ⚠️ ESCALATE IF

- **Tool naming errors persist** after consulting [naming_convention.md](references/naming_convention.md)
- **Configuration fails to load** - Check [configuration.md](references/configuration.md)
- **Environment variables not found** - Verify .env file exists and syntax is correct
- **MCP server fails to start** - Check command/args in .utcp_config.json
- **Tools not discovered** - Verify manual name matches configuration
- **Execution timeout** - Increase timeout or break into smaller operations
- **Need to add new MCP server** - Follow guide in [configuration.md](references/configuration.md)

---

## 6. SUCCESS CRITERIA

**Code Mode implementation complete when**:

- ✅ All MCP tool calls use `call_tool_chain` (no direct tool calls)
- ✅ Tool naming follows `{manual_name}.{manual_name}_{tool_name}` pattern
- ✅ Progressive discovery used (`search_tools` before calling)
- ✅ Error handling implemented (try/catch for critical operations)
- ✅ Console logging tracks workflow progress
- ✅ Return values structured consistently
- ✅ Timeouts set appropriately for workflow complexity
- ✅ Configuration validated (`.utcp_config.json` and `.env` correct)
- ✅ Type safety verified (no TypeScript errors)
- ✅ Multi-tool workflows execute atomically (all succeed or all fail)

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Cross-Skill Collaboration

**External Tool Integration**:
- Use **mcp-code-mode** for external tool integration (Webflow, Figma, ClickUp, etc.)
- Example: Create ClickUp task → Update Notion docs → Post to Webflow CMS

**Workflow**:
```typescript
// All Code Mode - single execution for multi-tool workflow
call_tool_chain({
  code: `
    // 1. Create task in ClickUp
    const task = await clickup.clickup_create_task({
      name: "Implement authentication",
      description: "Add OAuth 2.0 authentication"
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
```

### Triggers

**Automatic activation when**:
- User mentions MCP tool names (ClickUp, Notion, Figma, Webflow, etc.)
- Request involves external tool integration
- Multi-tool workflow described
- Browser automation needed (Chrome DevTools)

### Outputs

**What Code Mode produces**:
- External tool operation results (tasks created, data fetched, etc.)
- Workflow execution logs (console.log captured)
- Error details (if failures occur)
- State snapshots (all variables returned)

---

## 8. QUICK REFERENCE

### Essential Commands

```typescript
// 1. Discover tools
search_tools({ task_description: "webflow site management", limit: 10 });

// 2. Get tool details
tool_info({ tool_name: "webflow.webflow_sites_list" });

// 3. List all tools
list_tools();

// 4. Call single tool
call_tool_chain({
  code: `await webflow.webflow_sites_list({})`
});

// 5. Multi-tool workflow with error handling
call_tool_chain({
  code: `
    try {
      const design = await figma.figma_get_file({ fileKey: "AbC123DeF45" });
      const task = await clickup.clickup_create_task({
        name: `Implement ${design.name}`,
        listName: "Frontend Sprint",
        description: "Build from latest approved Figma file"
      });
      return { success: true, designName: design.name, taskId: task.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  `,
  timeout: 60000
});

// 6. Parallel execution of independent operations
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
  `
});
```

### Parallel Execution Patterns

| Pattern | Use When | Example |
|---------|----------|---------|
| `Promise.all()` | All must succeed | `const [a, b] = await Promise.all([fnA(), fnB()])` |
| `Promise.allSettled()` | Partial success OK | `const results = await Promise.allSettled([...])` |
| Batch processing | Many items, rate limits | `processInBatches(items, 3, processor)` |
| Parallel → Sequential | Fetch then process | Phase 1: parallel fetch, Phase 2: sequential use |

**See [references/workflows.md](references/workflows.md) Section 7 for comprehensive parallel execution examples.**

### Critical Naming Pattern

**See Section 3: Critical Naming Pattern for the complete guide with examples.**

**Pattern**: `{manual_name}.{manual_name}_{tool_name}`

### Timeout Guidelines

- **Simple (1-2 tools)**: 30s (default)
- **Complex (3-5 tools)**: 60s
- **Very complex (6+ tools)**: 120s+

---

## 9. RELATED RESOURCES

### scripts/

| Script | Purpose | Usage |
|--------|---------|-------|
| **update-code-mode.sh** | Update to latest version | `bash .opencode/skill/mcp-code-mode/scripts/update-code-mode.sh` |
| **validate_config.py** | Validate configuration | `python3 scripts/validate_config.py <config-path> --check-env <env-path>` |

### references/

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| **naming_convention.md** | Tool naming pattern | CRITICAL - read first for errors |
| **configuration.md** | Setup guide | .utcp_config.json and .env |
| **tool_catalog.md** | Available tools | 250+ tools across 8 servers |
| **workflows.md** | Usage patterns | 5 comprehensive examples |
| **architecture.md** | System design | Token economics |

### assets/

| Asset | Purpose |
|-------|---------|
| **config_template.md** | .utcp_config.json template |
| **env_template.md** | .env template with API key placeholders |

### External Resources

- [Code Mode GitHub](https://github.com/universal-tool-calling-protocol/code-mode) - Source code and documentation
- [MCP Specification](https://modelcontextprotocol.io/) - Model Context Protocol standard

### Performance Metrics

| Metric | Traditional | Code Mode | Improvement |
|--------|-------------|-----------|-------------|
| Context tokens | 141k (47 tools) | 1.6k (200+ tools) | 98.7% reduction |
| Execution time | ~2000ms (4 tools) | ~300ms (4 tools) | 60% faster |
| API round trips | 15+ | 1 | 93% reduction |

### Related Skills

- **[mcp-figma](../mcp-figma/SKILL.md)** - Figma design file access (via Code Mode)

### Install Guide

- [INSTALL_GUIDE.md](INSTALL_GUIDE.md) - Installation and configuration

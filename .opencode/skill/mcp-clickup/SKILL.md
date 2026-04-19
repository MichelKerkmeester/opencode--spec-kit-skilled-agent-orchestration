---
name: mcp-clickup
description: "ClickUp project management orchestrator providing intelligent routing between CLI (cu) and MCP (Code Mode) approaches. CLI prioritized for speed and token efficiency; MCP for enterprise features like docs, goals, webhooks, and bulk operations."
allowed-tools: [Bash, Read, Grep, Glob, mcp__code_mode__call_tool_chain, mcp__code_mode__search_tools]
version: 1.0.0
---

<!-- Keywords: clickup, mcp-clickup, cu, clickup-cli, task-management, sprint, standup, project-management, workspace, time-tracking, goals, documents, webhooks -->

# ClickUp Orchestrator - CLI + MCP Integration

Project management through two complementary approaches: CLI (cu) for speed and token efficiency, MCP for enterprise features and bulk operations.


## 1. WHEN TO USE

### Activation Triggers

**Use when**:
- User mentions "ClickUp", "clickup", or "cu" explicitly
- User asks about tasks, sprints, standups, or project management in ClickUp
- User wants to create, update, search, or manage tasks
- User needs workspace discovery, list management, or space navigation
- User asks about time tracking, goals, documents, or webhooks in ClickUp
- User wants to manage comments, attachments, or custom fields on tasks
- User needs bulk task operations or cross-list task management

**Automatic Triggers**:
- "clickup", "cu" mentioned explicitly
- "sprint standup" or "sprint summary"
- "create task in clickup" or "update clickup task"
- "clickup workspace" or "clickup spaces"

### When NOT to Use

**Do not use for**:
- General project management advice (not tool-specific)
- Zapier/Make automation setup (use their own docs)
- Non-ClickUp task managers (Jira, Asana, Linear, etc.)
- ClickUp UI customization (use ClickUp directly)
- When user explicitly requests a different tool

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing-references -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                       |
| ----------- | ------------------------ | ------------------------------- |
| ALWAYS      | Every skill invocation   | Core decision matrix            |
| CONDITIONAL | If intent signals match  | CLI/MCP/Install/Workflow refs   |
| ON_DEMAND   | Only on explicit request | Full tool and CLI references    |

### Smart Router Pseudocode

The authoritative routing logic for scoped loading, weighted intent scoring, and ambiguity handling.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/workflows.md"

INTENT_SIGNALS = {
    "CLI": {"weight": 4, "keywords": ["cu", "clickup-cli", "terminal", "cli", "sprint", "standup"]},
    "MCP": {"weight": 4, "keywords": ["mcp", "code mode", "bulk", "docs", "goals", "webhooks", "chat"]},
    "INSTALL": {"weight": 4, "keywords": ["install", "setup", "not installed", "configure", "api key"]},
    "TASK_OPS": {"weight": 3, "keywords": ["create task", "update task", "delete task", "assign", "search"]},
    "DISCOVERY": {"weight": 3, "keywords": ["workspace", "spaces", "lists", "folders", "members"]},
}

RESOURCE_MAP = {
    "CLI": ["references/cli_reference.md", "references/workflows.md"],
    "MCP": ["references/tool_reference.md", "references/workflows.md"],
    "INSTALL": ["INSTALL_GUIDE.md"],
    "TASK_OPS": ["references/workflows.md", "references/cli_reference.md"],
    "DISCOVERY": ["references/workflows.md", "references/tool_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full reference", "all tools", "all commands", "deep dive", "clickup sprint", "clickup tasks", "summarize blockers", "routing hardening", "sprint tasks"],
    "ON_DEMAND": ["references/tool_reference.md", "references/cli_reference.md", "assets/tool_categories.md"],
}

def _task_text(task) -> str:
    parts = [
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        " ".join(getattr(task, "keywords", []) or []),
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
    """Weighted intent scoring from request text and capability signals."""
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword in text:
                scores[intent] += cfg["weight"]
    if getattr(task, "cli_available", False):
        scores["CLI"] += 5
    if getattr(task, "code_mode_configured", False):
        scores["MCP"] += 4
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["CLI"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def route_clickup_resources(task):
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

<!-- /ANCHOR:smart-routing-references -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### CLI vs MCP Decision Matrix

| Feature | CLI (`cu`) | MCP (Code Mode) |
|---------|-----------|-----------------|
| **Task CRUD** | Full (create, read, update, delete) | Full + bulk operations |
| **Sprint / Summary** | Native (`cu sprint`, `cu summary`) | Not available |
| **Search** | `cu search <query>` | `search_tasks` with filters |
| **Comments** | `cu comment <id> -m text` | Full lifecycle (get, create, update, delete, threads) |
| **Custom Fields** | `cu field <id> --set` | Full CRUD + create field definitions |
| **Docs / Goals** | Not available | Full support (7 doc tools, goal management) |
| **Webhooks / Chat** | Not available | Full support (webhook CRUD, chat channels/messages) |
| **Time Tracking** | Not available | Full support (timers, entries, tags) |
| **Views / Templates** | Not available | Full support (10 view types, task templates) |
| **Guests / Audit Logs** | Not available | Enterprise features |
| **Token Cost** | Lowest (Markdown output) | Medium (via Code Mode) |
| **Best For** | Day-to-day task ops, sprints | Enterprise features, bulk ops |

**Decision Rule**: Use CLI for task CRUD, sprints, and daily operations. Use MCP for docs, goals, webhooks, time tracking, chat, bulk operations, and enterprise features.

### CLI Approach (Priority) - ClickUp CLI (cu)

#### Installation & Verification

```bash
# Check if installed
command -v cu && cu --version 2>&1 | head -1

# Installation
npm install -g @krodak/clickup-cli

# Initial setup (interactive)
cu init

# Verify (requires API token configured)
cu auth
```

**Note**: Requires Node.js >= 22.0.0. The system `cu` (UUCP) is different from the ClickUp CLI. Verify with `cu --version` showing the ClickUp CLI version, not "Taylor UUCP".

#### CLI Output Modes

| Mode | When | Format | Override |
|------|------|--------|----------|
| TTY (terminal) | Interactive use | Picker UI | N/A |
| Piped / non-TTY | AI agent use | Markdown tables | `--json` for raw JSON |

Set `CU_OUTPUT=json` environment variable for always-JSON when piped.

#### CLI Command Reference

```bash
# Discovery
cu spaces                     # List workspace spaces
cu lists <spaceId>            # List space lists
cu auth                       # Verify authentication

# Read Operations
cu tasks                      # My open tasks
cu assigned                   # Tasks assigned to me
cu sprint                     # Current sprint tasks
cu sprints                    # All sprints
cu summary                    # Sprint summary / standup
cu search <query>             # Search tasks
cu task <id>                  # Task details
cu subtasks <id>              # Task subtasks
cu comments <id>              # Task comments
cu activity <id>              # Task activity log
cu inbox                      # Notifications
cu overdue                    # Overdue tasks
cu open <query>               # Open task in browser

# Write Operations
cu create -n "name" -l <listId>       # Create task
cu update <id> --status "done"        # Update task
cu comment <id> -m "text"             # Post comment
cu assign <id> --to me                # Assign task
cu depend <id> --on <otherId>         # Add dependency
cu move <id> --to <listId>            # Move task
cu field <id> --set "Field" value     # Set custom field
cu tag <id> --add "bug,frontend"      # Add tags
cu delete <id> --confirm              # Delete task (DESTRUCTIVE)
```

### MCP Approach - ClickUp via Code Mode

When CLI is unavailable or enterprise features needed.

#### Prerequisites

1. Code Mode configured in `.utcp_config.json`
2. ClickUp MCP server registered: `@taazkareem/clickup-mcp-server`
3. Environment variables: `CODEMODE_CLICKUP_API_KEY`, `CODEMODE_CLICKUP_TEAM_ID` (Code Mode prefixed)

#### Invocation Pattern

Tool naming: `clickup.clickup_{tool_name}`

```typescript
// Discover ClickUp tools
search_tools({ task_description: "clickup tasks" });

// Create a task
await call_tool_chain({
  code: `
    const task = await clickup.clickup_create_task({
      listName: "Sprint Backlog",
      name: "Implement login page",
      description: "Build the login UI with email/password",
      priority: 2,
      assignees: ["me"]
    });
    return task;
  `
});

// Get workspace structure
await call_tool_chain({
  code: `
    const ws = await clickup.clickup_get_workspace({
      include_hierarchy: true
    });
    return ws;
  `
});

// Bulk create tasks
await call_tool_chain({
  code: `
    const tasks = await clickup.clickup_create_bulk_tasks({
      listName: "Sprint Backlog",
      tasks: [
        { name: "Task A", priority: 2 },
        { name: "Task B", priority: 3 },
        { name: "Task C", priority: 3 }
      ]
    });
    return tasks;
  `
});

// Manage documents
await call_tool_chain({
  code: `
    const doc = await clickup.clickup_create_document({
      parent: { id: spaceId, type: 4 },
      name: "Sprint Retrospective",
      visibility: "PUBLIC",
      content: "## What went well\\n- ...",
      content_format: "text/md"
    });
    return doc;
  `
});
```

#### Available MCP Tool Categories (46 tools)

| Category | Count | Key Tools |
|----------|-------|-----------|
| Task Management | 20 | `create_task`, `get_task`, `update_task`, `delete_task`, `search_tasks`, `manage_comments` |
| Documents | 7 | `create_document`, `get_document`, `list_documents`, `*_document_page` |
| Chat | 2 | `manage_chat_channels`, `manage_chat_messages` |
| Time Tracking | 1 | `manage_time_entries` (10+ actions) |
| Goals | 1 | `manage_goals` (8 actions) |
| Views | 1 | `manage_views` (6 actions) |
| Webhooks | 1 | `manage_webhooks` (4 actions) |
| Lists / Spaces / Folders | 3 | `manage_lists`, `manage_spaces`, `manage_folders` |
| Custom Fields | 1 | `manage_custom_fields` (4 actions) |
| Tags | 3 | `manage_space_tags`, `add_tag_to_task`, `remove_tag_from_task` |
| Checklists | 1 | `manage_checklists` (6 actions) |
| Templates | 2 | `get_task_templates`, `create_task_from_template` |
| Attachments | 1 | `manage_attachments` (3 actions) |
| Workspace | 1 | `get_workspace` |
| User Groups | 1 | `manage_user_groups` (4 actions) |
| Guests | 1 | `manage_guests` (10 actions, Enterprise) |
| Audit Logs | 1 | `get_audit_logs` (Enterprise) |
| Feedback | 1 | `submit_feedback` |

---

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

### ALWAYS Rules

**ALWAYS do these without asking:**

1. **ALWAYS prefer CLI over MCP for task CRUD**
   - CLI is faster and more token-efficient
   - Fall back to MCP only when CLI unavailable or feature not supported

2. **ALWAYS verify CLI availability first**
   - `command -v cu && cu --version 2>&1 | head -1`
   - System `cu` (UUCP) is NOT the ClickUp CLI

3. **ALWAYS use Markdown output when piping CLI**
   - Default piped mode outputs Markdown tables
   - Use `--json` only when structured data needed for processing

4. **ALWAYS confirm destructive operations**
   - `cu delete` requires `--confirm` flag
   - MCP `delete_task` should be confirmed with user first
   - Bulk deletes need explicit user approval

5. **ALWAYS use full tool naming for MCP**
   - Format: `clickup.clickup_{tool_name}`
   - Example: `clickup.clickup_create_task({...})`

### NEVER Rules

**NEVER do these:**

1. **NEVER hardcode API tokens**
   - Use `cu init` for CLI configuration
   - Use environment variables for MCP: `CLICKUP_API_KEY`, `CLICKUP_TEAM_ID`

2. **NEVER skip authentication verification**
   - CLI: `cu auth` before operations
   - MCP: Verify config in `.utcp_config.json`

3. **NEVER assume task IDs from names**
   - Always verify task ID via search or lookup
   - Both CLI and MCP support name-based fuzzy lookup

4. **NEVER use MCP for sprint/standup when CLI is available**
   - `cu sprint` and `cu summary` are CLI-only features
   - No MCP equivalent exists

5. **NEVER delete tasks without explicit user confirmation**
   - Task deletion is irreversible in ClickUp

### ESCALATE IF

**Ask user when:**

1. **ESCALATE IF CLI not installed and task requires sprint/summary**
   - These features are CLI-only
   - Offer to install: `npm install -g @krodak/clickup-cli`

2. **ESCALATE IF authentication fails**
   - CLI: Re-run `cu init` to reconfigure
   - MCP: Check `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` in `.env`

3. **ESCALATE IF rate limited**
   - ClickUp API has rate limits
   - Wait before retrying, reduce request frequency

4. **ESCALATE IF workspace structure unclear**
   - Use `cu spaces` or `get_workspace` to discover hierarchy
   - Ask user to specify target space/list

5. **ESCALATE IF enterprise feature needed without plan**
   - Guests, audit logs require Enterprise plan
   - Inform user of plan requirements

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Task Operation Completion Checklist

**Workflow complete when:**

- Tool approach selected (CLI vs MCP) based on availability and feature need
- Authentication verified (CLI `cu auth` or MCP config present)
- Operation executed successfully (exit code 0 for CLI, valid response for MCP)
- Output provided to user in readable format
- Destructive operations confirmed before execution

### Quality Targets

- **CLI response**: < 3 seconds for single task operations
- **MCP response**: < 5 seconds via Code Mode
- **Search results**: Relevant matches returned
- **Error rate**: 0% (all errors handled gracefully)

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Related Skills

**mcp-code-mode**: Required for MCP approach
- When CLI unavailable or enterprise features needed
- Tool naming: `clickup.clickup_{tool_name}`

### Cross-Tool Workflows

**Figma -> ClickUp**:
```typescript
// Get design info, create implementation task
const file = await figma.figma_get_file({ fileKey: "abc" });
const task = await clickup.clickup_create_task({
  listName: "Sprint Backlog",
  name: `Implement: ${file.name}`,
  description: `Design file: https://figma.com/file/abc`
});
```

**ClickUp -> Git**:
```bash
# Get task details, create branch
cu task abc123 --json | jq -r '.name' | sed 's/ /-/g' | xargs -I{} git checkout -b "feature/{}"
```

### Tool Usage Guidelines

**Bash**: All `cu` CLI commands, authentication, scripting
**Read**: Load reference files when detailed guidance needed
**Grep**: Filter CLI output, search workspace data
**Glob**: Find configuration files

### External Tools

**ClickUp CLI (cu)**:
- Installation: `npm install -g @krodak/clickup-cli`
- Purpose: Primary CLI for task operations
- Requires: Node.js >= 22.0.0

**ClickUp MCP Server**:
- Package: `@taazkareem/clickup-mcp-server`
- Purpose: Enterprise features via Code Mode
- Requires: `CLICKUP_API_KEY`, `CLICKUP_TEAM_ID`

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:quick-reference -->
## 7. QUICK REFERENCE

### Essential CLI Commands

```bash
# Daily workflow
cu tasks                       # My open tasks
cu sprint                      # Current sprint
cu summary                     # Sprint standup summary
cu assigned                    # Assigned to me
cu overdue                     # Overdue tasks
cu inbox                       # Notifications

# Task operations
cu create -n "Name" -l <listId>   # Create
cu update <id> --status "done"    # Update
cu task <id>                      # Details
cu search "query"                 # Search
cu comment <id> -m "text"         # Comment
cu delete <id> --confirm          # Delete

# Workspace
cu spaces                      # List spaces
cu lists <spaceId>             # List space lists
cu auth                        # Verify auth
```

### Essential MCP Tools

```typescript
// Tool naming: clickup.clickup_{tool_name}

// Task ops
clickup.clickup_create_task({ listName: "...", name: "..." })
clickup.clickup_get_task({ task: "task-id-or-name" })
clickup.clickup_update_task({ task: "id", status: "done" })
clickup.clickup_search_tasks({ query: "..." })

// Enterprise features (MCP-only)
clickup.clickup_manage_goals({ action: "list" })
clickup.clickup_create_document({ name: "...", content: "..." })
clickup.clickup_manage_time_entries({ action: "start_timer", task: "id" })
clickup.clickup_manage_webhooks({ action: "create", endpoint: "...", events: ["taskCreated"] })
clickup.clickup_manage_chat_messages({ action: "create", channel_name: "...", content: "..." })
```

### Decision Flowchart

```
What do you need?
     |
     +-- Task CRUD / Sprint / Standup
     |   +-- CLI available? --> cu commands (fastest)
     |   +-- CLI unavailable? --> MCP create/get/update_task
     |
     +-- Bulk operations
     |   +-- MCP: create_bulk_tasks, update_bulk_tasks
     |
     +-- Documents / Goals / Webhooks
     |   +-- MCP only (not available in CLI)
     |
     +-- Time Tracking / Chat
     |   +-- MCP only (manage_time_entries, manage_chat_*)
     |
     +-- Workspace discovery
     |   +-- CLI: cu spaces, cu lists
     |   +-- MCP: get_workspace (with hierarchy)
     |
     +-- Custom Fields / Tags / Checklists
         +-- CLI: cu field, cu tag (basic)
         +-- MCP: manage_custom_fields, manage_checklists (full CRUD)
```

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### references/

| Document | Purpose | Key Insight |
|----------|---------|-------------|
| **tool_reference.md** | All 46 MCP tools documented | Complete invocation reference |
| **cli_reference.md** | 30+ CLI commands with flags | Command flags and output modes |
| **workflows.md** | Common workflow patterns | CLI+MCP combined workflows |

### assets/

| Asset | Purpose |
|-------|---------|
| **tool_categories.md** | Priority categorization of all 46 MCP tools |

### External Resources

- [ClickUp CLI (npm)](https://www.npmjs.com/package/@krodak/clickup-cli) - CLI package
- [ClickUp MCP Server (npm)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server) - MCP server package
- [ClickUp API Documentation](https://clickup.com/api) - Official API reference

### Related Skills

- **[mcp-code-mode](../mcp-code-mode/SKILL.md)** - Tool orchestration (ClickUp MCP accessed via Code Mode)
- **[mcp-figma](../mcp-figma/SKILL.md)** - Cross-tool workflow (Figma -> ClickUp)

### Install Guide

- [Install Guide](./INSTALL_GUIDE.md) - Installation and configuration for both CLI and MCP

<!-- /ANCHOR:related-resources -->

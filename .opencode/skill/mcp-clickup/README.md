---
title: "ClickUp MCP"
description: "ClickUp project management skill providing intelligent routing between CLI (cu) and MCP (Code Mode). CLI for speed and token efficiency, MCP for enterprise features like docs, goals, webhooks, and bulk operations."
trigger_phrases:
  - "clickup"
  - "cu"
  - "clickup mcp"
  - "task management"
  - "sprint"
  - "standup"
  - "project management clickup"
---

# ClickUp MCP

> Two-tool ClickUp orchestrator: 30+ CLI commands for daily task operations and 46 MCP tools for enterprise features, routed automatically by intent.

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

The mcp-clickup skill connects AI agents to ClickUp through two complementary tools: the ClickUp CLI (`cu`) and the ClickUp MCP server accessed via Code Mode. These tools cover different capability tiers. The CLI handles the fast, high-frequency work, covering task creation, updates, search, sprint views, and standup summaries with Markdown output and minimal token cost. The MCP server covers the enterprise tier: documents, goals, webhooks, time tracking, chat channels, bulk operations, and guest management.

The skill routes between the two tools based on intent signals in the request. Task CRUD, sprints, and daily operations go to the CLI when it is available. Requests for docs, goals, webhooks, time entries, or bulk task creation go to the MCP server via Code Mode. When the CLI is absent or a feature falls outside its scope, the skill falls back to MCP transparently. Both tools authenticate against the same ClickUp workspace using an API token and Team ID.

Routing is weighted and scored at invocation time. The skill reads keywords and availability signals to select CLI, MCP, or both, then loads only the reference files relevant to the detected intent. This keeps token usage low on simple queries while giving full access to deep reference material when needed.

When ClickUp work feeds back into a Spec Kit packet, `/spec_kit:resume` remains the canonical recovery surface. Continuity still rebuilds from `handover.md`, then `_memory.continuity`, then the remaining spec docs, while generated memory artifacts stay supporting only.

### Key Statistics

| Dimension | CLI (cu) | MCP (Code Mode) |
|---|---|---|
| Version | 1.0.0 | |
| Commands / Tools | 30+ commands | 46 tools |
| Authentication | API token + Team ID | API key + Team ID |
| Output format | Markdown tables / JSON | JSON via Code Mode |
| Sprint support | Native (cu sprint, cu summary) | Not available |
| Docs / Goals / Webhooks | Not available | Full support |
| Time tracking | Not available | Full support (10+ actions) |
| Bulk operations | Not available | create_bulk_tasks, update_bulk_tasks |
| Token cost | Lowest | Medium |

### How This Compares

| Approach | Package | Best For |
|---|---|---|
| CLI | `@krodak/clickup-cli` | Daily task ops, sprints, standups |
| MCP | `@taazkareem/clickup-mcp-server` | Docs, goals, webhooks, bulk, enterprise |
| Either | Both | Task CRUD when CLI unavailable |

### Key Features

| Feature | Available In | Notes |
|---|---|---|
| Task CRUD | CLI + MCP | CLI preferred for speed |
| Sprint view | CLI only | `cu sprint`, `cu sprints` |
| Standup summary | CLI only | `cu summary` |
| Search | CLI + MCP | MCP supports advanced filters |
| Documents | MCP only | 7 tools, full page lifecycle |
| Goals | MCP only | 8 actions including key results |
| Webhooks | MCP only | 4 actions, event subscriptions |
| Time tracking | MCP only | Start/stop timer, entries, tags |
| Chat channels | MCP only | Channels, messages, threads |
| Bulk task ops | MCP only | Create and update in one call |
| Workspace discovery | CLI + MCP | CLI: `cu spaces` / MCP: full hierarchy |
| Custom fields | CLI + MCP | MCP supports field definition CRUD |
| Guests / Audit logs | MCP only | Enterprise plan required |

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:quick-start -->
## 2. QUICK START

**Step 1: Install the CLI and configure credentials.**

```bash
npm install -g @krodak/clickup-cli
cu init
# Interactive prompts: API token, Team ID
cu auth
# Confirms the connection is working
```

**Step 2: Add MCP credentials to `.env` for enterprise features.**

```bash
# Prefixed with the Code Mode manual name "clickup"
clickup_CLICKUP_API_KEY=pk_your_token_here
clickup_CLICKUP_TEAM_ID=your_team_id_here
```

**Step 3: Run your first commands.**

```bash
# View open tasks
cu tasks

# Sprint standup summary
cu summary

# Search for a task
cu search "login page"
```

**Step 4: Use MCP for features the CLI does not cover.**

```typescript
// Discover available ClickUp tools
search_tools({ task_description: "clickup" });

// Get workspace hierarchy
call_tool_chain({
  code: `
    const ws = await clickup.clickup_get_workspace({ include_hierarchy: true });
    return ws;
  `
});
```

<!-- /ANCHOR:quick-start -->

---

<!-- ANCHOR:features -->
## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The CLI excels at everything a developer does in ClickUp every day. Running `cu tasks` shows your open work in a clean Markdown table. `cu sprint` filters that down to the current sprint. `cu summary` generates a standup-ready summary of sprint progress, completed items, and blockers. These commands run in milliseconds, output structured Markdown that AI agents can parse without additional token overhead, and accept `--json` when structured data is needed downstream.

Task write operations match the same speed profile. Creating a task with `cu create -n "name" -l listId` adds it immediately. `cu update id --status done` closes it. `cu comment id -m "text"` posts a comment. `cu delete id --confirm` removes it with a required safety flag. The CLI also covers dependency management, tag operations, custom field assignment, and task moves between lists. For workspace navigation, `cu spaces` and `cu lists spaceId` map the hierarchy before any task operation.

The MCP server opens a different tier of capability. Its 46 tools cover everything the CLI cannot. Documents live in ClickUp spaces as first-class objects, and the MCP server exposes the full lifecycle: create, read, update pages, create sub-pages, list documents by workspace or parent. Goals and key results are fully manageable through `manage_goals` with eight discrete actions. Webhooks can be registered, listed, updated, and deleted to push ClickUp events to external endpoints. Time tracking lets agents start and stop timers against tasks, log manual entries, and tag time by category.

Bulk operations are one of the strongest MCP capabilities. `create_bulk_tasks` accepts an array of task definitions and creates all of them in a single call, which is far more efficient than looping through individual creates. `update_bulk_tasks` applies status, assignee, or priority changes across many tasks at once. For teams migrating data or setting up sprints programmatically, this changes the operational cost significantly.

The enterprise tier adds guest management (10 actions) and audit log access. These require a ClickUp Enterprise plan and are gated accordingly. When a request touches these features without the correct plan, the skill surfaces the plan requirement rather than returning a cryptic API error.

### 3.2 FEATURE REFERENCE

**CLI Command Categories**

| Category | Commands | What They Do |
|---|---|---|
| Daily view | `tasks`, `assigned`, `sprint`, `overdue`, `inbox` | See your work |
| Sprint | `sprint`, `sprints`, `summary` | Sprint state and standup output |
| Search | `search` | Full-text task search |
| Task detail | `task`, `subtasks`, `comments`, `activity` | Inspect a task |
| Task write | `create`, `update`, `delete`, `assign`, `move` | Modify tasks |
| Comments | `comment`, `comments` | Post and view comments |
| Fields | `field`, `tag` | Custom fields and tags |
| Dependencies | `depend` | Add task dependencies |
| Workspace | `spaces`, `lists`, `auth` | Navigate and verify config |
| Utility | `open`, `inbox` | Browser open, notifications |

**MCP Tool Categories (46 tools)**

| Category | Tool Count | Key Capabilities |
|---|---|---|
| Task Management | 20 | Full CRUD, bulk ops, dependencies, subtasks, templates |
| Documents | 7 | Create/update docs, pages, sub-pages |
| Chat | 2 | Channels, messages, threads, reactions |
| Time Tracking | 1 | Start/stop timers, log entries, tags (10+ actions) |
| Goals | 1 | Goals and key results (8 actions) |
| Views | 1 | 10 view types, list/create/delete (6 actions) |
| Webhooks | 1 | Create, list, update, delete subscriptions |
| Lists / Spaces / Folders | 3 | Structure management |
| Custom Fields | 1 | Field definitions and values (4 actions) |
| Tags | 3 | Space tags, add/remove from tasks |
| Checklists | 1 | Checklist items on tasks (6 actions) |
| Attachments | 1 | Upload, list, get (with large-file chunking) |
| Workspace | 1 | Hierarchy, members, plan details |
| User Groups | 1 | Group management (4 actions) |
| Guests | 1 | Guest management (Enterprise, 10 actions) |
| Audit Logs | 1 | Activity logs (Enterprise) |
| Feedback | 1 | Bug reports and feature requests |

**Routing Decision Matrix**

| Request Type | Route To | Reason |
|---|---|---|
| Task CRUD, search | CLI (first), MCP (fallback) | CLI is faster |
| Sprint view, standup | CLI only | No MCP equivalent |
| Documents, goals, webhooks | MCP only | Not in CLI |
| Time tracking, chat | MCP only | Not in CLI |
| Bulk create/update | MCP only | CLI has no bulk commands |
| Workspace discovery | CLI or MCP | Both work / MCP gives hierarchy |
| Guests, audit logs | MCP only | Enterprise plan required |

<!-- /ANCHOR:features -->

---

<!-- ANCHOR:structure -->
## 4. STRUCTURE

```
.opencode/skill/mcp-clickup/
  SKILL.md                    # AI agent triggers, routing logic, and rules
  README.md                   # This file
  INSTALL_GUIDE.md            # Step-by-step CLI and MCP installation
  assets/
    tool_categories.md        # HIGH/MEDIUM/LOW priority classification of all 46 MCP tools
  references/
    cli_reference.md          # All 30+ CLI commands with flags and output modes
    tool_reference.md         # All 46 MCP tools with parameters and examples
    workflows.md              # Common CLI+MCP combined workflow patterns
  scripts/
    install.sh                # Automated installation script
```

**Key Files**

| File | Purpose |
|---|---|
| `SKILL.md` | AI agent instructions: activation triggers, smart routing pseudocode, decision matrix, rules |
| `INSTALL_GUIDE.md` | Complete installation and configuration for both CLI and MCP |
| `references/tool_reference.md` | Full documentation for all 46 MCP tools |
| `references/cli_reference.md` | CLI command reference with all flags and output format details |
| `references/workflows.md` | Workflow patterns for daily ops, bulk tasks, cross-tool integrations |
| `assets/tool_categories.md` | Prioritized tool catalog for routing and capability discovery |

<!-- /ANCHOR:structure -->

---

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### CLI Configuration

Run `cu init` for interactive setup. This writes to `~/.config/cu/config.json`.

```json
{
  "apiToken": "pk_your_token",
  "teamId": "your_team_id"
}
```

Override with environment variables at any time:

```bash
export CU_API_TOKEN="pk_your_token"
export CU_TEAM_ID="your_team_id"
```

### MCP Configuration

The MCP server is registered in `.utcp_config.json` as a Code Mode manual:

```json
{
  "name": "clickup",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "clickup": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "@taazkareem/clickup-mcp-server@latest"],
        "env": {
          "CLICKUP_API_KEY": "${CLICKUP_API_KEY}",
          "CLICKUP_TEAM_ID": "${CLICKUP_TEAM_ID}"
        }
      }
    }
  }
}
```

### Environment Variables

Add to `.env`. Code Mode variables must be prefixed with the manual name (`clickup_`):

```bash
# Code Mode (MCP server)
clickup_CLICKUP_API_KEY=pk_your_token_here
clickup_CLICKUP_TEAM_ID=your_team_id_here

# CLI (cu reads these directly)
CU_API_TOKEN=pk_your_token_here
CU_TEAM_ID=your_team_id_here
```

### Getting Your API Token and Team ID

1. Open ClickUp and go to **Settings**.
2. Select **Apps**, then click **API Token**.
3. Copy the token (it starts with `pk_`).
4. For Team ID, go to **Settings > Workspaces**. The ID appears in the URL and workspace settings panel.

### Requirements

| Requirement | CLI | MCP |
|---|---|---|
| Node.js | >= 22.0.0 | >= 18.0.0 |
| Code Mode configured | Not needed | Required |
| API token | Required | Required |
| Team ID | Required | Required |
| Enterprise plan | Not needed | Only for Guests / Audit Logs |

<!-- /ANCHOR:configuration -->

---

<!-- ANCHOR:usage-examples -->
## 6. USAGE EXAMPLES

**Example 1: Daily standup using CLI**

```bash
# Standup-ready sprint summary
cu summary

# Current sprint task list
cu sprint

# Overdue tasks needing attention
cu overdue

# Your full task queue
cu assigned
```

**Example 2: Create and update a task using CLI**

```bash
# Create a task in a specific list
cu create \
  -n "Implement login page" \
  -l abc123 \
  -d "Build login UI with email/password auth" \
  --status "to do" \
  --priority high \
  --assignee me \
  --tags "frontend,auth" \
  --due-date 2026-04-15

# Mark it done once complete
cu update <task-id> --status "done"
```

**Example 3: Bulk create sprint tasks using MCP**

```typescript
call_tool_chain({
  code: `
    const tasks = await clickup.clickup_create_bulk_tasks({
      listName: "Sprint Backlog",
      tasks: [
        { name: "Design login page", priority: 2, assignees: ["designer@team.com"] },
        { name: "Implement login API", priority: 2, assignees: ["backend@team.com"] },
        { name: "Write login tests", priority: 3, assignees: ["qa@team.com"] }
      ]
    });
    return tasks;
  `
});
```

<!-- /ANCHOR:usage-examples -->

---

<!-- ANCHOR:troubleshooting -->
## 7. TROUBLESHOOTING

**Wrong `cu` binary resolves**

What you see: `cu (Taylor UUCP) 1.07` instead of a ClickUp CLI version string.

Common causes: The system UUCP `cu` binary is earlier in PATH than the npm global bin directory.

Fix:
```bash
# Confirm the problem
cu --version

# Reinstall CLI and fix PATH order
npm install -g @krodak/clickup-cli
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
cu --version  # Should now show ClickUp CLI version
```

---

**CLI authentication fails**

What you see: `Error: Invalid API token` or `Error: Team not found`.

Common causes: Token expired, wrong Team ID, or `cu init` was never completed.

Fix:
```bash
# Re-run interactive setup
cu init

# Or set variables directly
export CU_API_TOKEN="pk_your_token"
export CU_TEAM_ID="your_team_id"

# Verify
cu auth
```

---

**MCP tool not found**

What you see: `clickup_create_task is not a function` or similar.

Common causes: Wrong tool name (missing prefix, camelCase instead of snake_case), or Code Mode not discovering the manual.

Fix:
```typescript
// Discover exact tool names
search_tools({ task_description: "clickup create task" });

// Always use full naming convention
await clickup.clickup_create_task({ listName: "...", name: "..." });

// Not this (missing clickup_ prefix)
// await clickup.create_task({ ... });
```

---

**MCP environment variable not found**

What you see: `Variable 'CLICKUP_API_KEY' not found`.

Common causes: Variable added to `.env` without the `clickup_` prefix required by Code Mode.

Fix:
```bash
# Wrong (unprefixed)
CLICKUP_API_KEY=pk_...

# Correct (prefixed with manual name)
clickup_CLICKUP_API_KEY=pk_...
clickup_CLICKUP_TEAM_ID=your_id
```

---

**Sprint features unavailable via MCP**

What you see: No equivalent to `cu sprint` or `cu summary` in the MCP tool list.

Common causes: Sprint views and standup summaries are CLI-only features with no MCP equivalent.

Fix: Install the CLI. `npm install -g @krodak/clickup-cli`, then `cu init`. Sprint and standup commands are only available through `cu`.

<!-- /ANCHOR:troubleshooting -->

---

<!-- ANCHOR:faq -->
## 8. FAQ

**Q: When should I use CLI vs MCP?**

A: Use the CLI for everything you do daily: creating tasks, checking sprint status, running standups, searching, updating statuses, and commenting. Use MCP when you need something the CLI does not have: documents, goals, webhooks, time tracking, chat, bulk operations, or enterprise features. If both cover the same operation (like task creation), the CLI is faster.

**Q: Do I need both tools installed?**

A: No. The CLI covers most daily task work on its own. MCP adds the enterprise tier. If your work involves only task management, sprints, and search, the CLI is sufficient. If you need to manage docs, goals, or run bulk operations, install both.

**Q: What Node.js version does the CLI require?**

A: The CLI requires Node.js 22.0.0 or higher. The MCP server works with Node 18 or higher. If your system has Node below 22, you can still use MCP while skipping the CLI.

**Q: How do I find my ClickUp Team ID?**

A: Open ClickUp and go to Settings, then Workspaces. The Team ID appears in the workspace settings panel. Once the CLI is configured, `cu config get teamId` also returns it.

**Q: Can CLI and MCP use the same credentials?**

A: Yes. Both authenticate against the same ClickUp workspace with the same API token and Team ID. They use separate configuration sources: the CLI reads from `~/.config/cu/config.json` or environment variables, while MCP reads from `.env` with the `clickup_` prefix.

<!-- /ANCHOR:faq -->

---

<!-- ANCHOR:related-documents -->
## 9. RELATED DOCUMENTS

**This skill**

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | AI agent instructions, routing logic, rules, and integration points |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Complete installation for CLI and MCP server |
| [references/tool_reference.md](./references/tool_reference.md) | Full documentation for all 46 MCP tools |
| [references/cli_reference.md](./references/cli_reference.md) | All CLI commands with flags and output format details |
| [references/workflows.md](./references/workflows.md) | Workflow patterns combining CLI and MCP |
| [assets/tool_categories.md](./assets/tool_categories.md) | Priority categorization of all 46 MCP tools |

**Related skills**

| Skill | Purpose |
|---|---|
| [mcp-code-mode](../mcp-code-mode/README.md) | Code Mode tool orchestration (required for MCP approach) |
| [mcp-figma](../mcp-figma/README.md) | Cross-tool workflow: Figma design to ClickUp task |

**External resources**

| Resource | Description |
|---|---|
| [ClickUp CLI on npm](https://www.npmjs.com/package/@krodak/clickup-cli) | CLI package (`@krodak/clickup-cli`) |
| [ClickUp MCP Server on npm](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server) | MCP server package (`@taazkareem/clickup-mcp-server`) |
| [ClickUp API Reference](https://clickup.com/api) | Official API documentation |

<!-- /ANCHOR:related-documents -->

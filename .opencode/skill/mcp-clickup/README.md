---
title: "ClickUp MCP"
description: "ClickUp project management orchestrator with CLI (cu) and MCP (Code Mode) approaches for task management, sprints, documents, goals, and enterprise features."
trigger_phrases:
  - "clickup"
  - "cu"
  - "clickup mcp"
  - "task management"
  - "sprint"
  - "standup"
---

# ClickUp MCP

> Project management orchestrator providing **30+ CLI commands** and **46 MCP tools** for ClickUp task management, sprints, documents, goals, time tracking, and enterprise features. CLI prioritized for speed; MCP for advanced capabilities.

> **Navigation**:
> - New to ClickUp integration? Start with [Quick Start](#2--quick-start)
> - Need tool overview? See [Features](#4--features)
> - Configuration help? See [Configuration](#5--configuration)
> - Troubleshooting? See [Troubleshooting](#8--troubleshooting)

[![npm CLI](https://img.shields.io/npm/v/@krodak/clickup-cli.svg?label=CLI)](https://www.npmjs.com/package/@krodak/clickup-cli)
[![npm MCP](https://img.shields.io/npm/v/@taazkareem/clickup-mcp-server.svg?label=MCP)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server)
[![MCP](https://img.shields.io/badge/MCP-compatible-blue.svg)](https://modelcontextprotocol.io)

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
- [8. TROUBLESHOOTING](#8--troubleshooting)
- [9. FAQ](#9--faq)
- [10. RELATED DOCUMENTS](#10--related-documents)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is ClickUp MCP?

ClickUp MCP is a hybrid skill combining two complementary tools for ClickUp project management:

- **CLI (`cu`)**: Agent-optimized command-line tool with 30+ commands, Markdown output, and native sprint/standup support
- **MCP Server**: 46 specialized tools via Code Mode for enterprise features like docs, goals, webhooks, time tracking, and bulk operations

### Key Statistics

| Category | CLI (cu) | MCP (Code Mode) |
|----------|----------|-----------------|
| Commands/Tools | 30+ | 46 |
| Authentication | API Token + Team ID | API Key + Team ID |
| Output Format | Markdown / JSON | JSON via Code Mode |
| Best For | Daily task ops, sprints | Enterprise features, bulk ops |

### Two Approaches

| Approach | Tool | Type | Best For |
|----------|------|------|----------|
| **CLI** | `@krodak/clickup-cli` (cu) | CLI (npm) | Speed, sprints, daily ops |
| **MCP** | `@taazkareem/clickup-mcp-server` | MCP (Code Mode) | Docs, goals, webhooks, bulk |

**Recommendation**: Install both. Use CLI for daily task operations and sprint management. Use MCP for enterprise features unavailable in CLI.

### Requirements

| Requirement | CLI | MCP |
|-------------|-----|-----|
| Node.js | >= 22.0.0 | >= 18.0.0 |
| Code Mode | Not needed | Required |
| API Token | Required | Required |
| Team ID | Required | Required |

---

<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### CLI Quick Start

```bash
# 1. Install
npm install -g @krodak/clickup-cli

# 2. Configure (interactive)
cu init
# Prompts for: API token, Team ID

# 3. Verify
cu auth
cu tasks  # List your open tasks
```

### MCP Quick Start

```bash
# 1. Already configured in .utcp_config.json (ClickUp entry exists)

# 2. Add credentials to .env
echo "clickup_CLICKUP_API_KEY=pk_your_token" >> .env
echo "clickup_CLICKUP_TEAM_ID=your_team_id" >> .env

# 3. Verify via Code Mode
search_tools({ task_description: "clickup" });
```

### First Use

```bash
# CLI: View your tasks
cu tasks

# CLI: Sprint standup
cu summary

# MCP: Get workspace structure
call_tool_chain({
  code: `
    const ws = await clickup.clickup_get_workspace({
      include_hierarchy: true
    });
    return ws;
  `
});
```

---

<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:structure -->
## 3. STRUCTURE

```
.opencode/skill/mcp-clickup/
├── SKILL.md                    # AI agent instructions
├── README.md                   # This file (user documentation)
├── INSTALL_GUIDE.md            # Setup for CLI and MCP
├── references/
│   ├── tool_reference.md       # All 46 MCP tools documented
│   ├── cli_reference.md        # 30+ CLI commands with flags
│   └── workflows.md            # Common CLI+MCP workflow patterns
└── assets/
    └── tool_categories.md      # Tool priority categorization
```

### Key Files

| File | Purpose |
|------|---------|
| `SKILL.md` | AI agent activation triggers and workflow guidance |
| `references/tool_reference.md` | Complete MCP tool documentation (46 tools) |
| `references/cli_reference.md` | CLI command reference (30+ commands) |
| `references/workflows.md` | Workflow patterns combining CLI and MCP |
| `assets/tool_categories.md` | HIGH/MEDIUM/LOW tool categorization |

---

<!-- /ANCHOR:structure -->

<!-- ANCHOR:features -->
## 4. FEATURES

### CLI Features (cu)

| Category | Commands | Description |
|----------|----------|-------------|
| Task Read | `tasks`, `task`, `search`, `assigned`, `overdue` | View and find tasks |
| Sprint | `sprint`, `sprints`, `summary` | Sprint management and standups |
| Task Write | `create`, `update`, `delete`, `assign`, `move` | Modify tasks |
| Comments | `comment`, `comments` | View and post comments |
| Fields | `field`, `tag` | Custom fields and tags |
| Workspace | `spaces`, `lists`, `auth` | Navigation and config |
| Utility | `inbox`, `activity`, `subtasks`, `open` | Additional features |

### MCP Features (Code Mode)

| Category | Tools | Description |
|----------|-------|-------------|
| Task Management | 20 | Full CRUD, bulk ops, dependencies, subtasks |
| Documents | 7 | Create, read, update pages and sub-pages |
| Chat | 2 | Channels, messages, reactions, threads |
| Time Tracking | 1 | Timers, entries, tags (10+ actions) |
| Goals | 1 | Goals, key results (8 actions) |
| Views | 1 | 10 view types (6 actions) |
| Webhooks | 1 | Event subscriptions (4 actions) |
| Structure | 3 | Lists, spaces, folders management |
| Custom Fields | 1 | Field definitions and values (4 actions) |
| Tags | 3 | Space tags, task tag assignment |
| Checklists | 1 | Checklist items on tasks (6 actions) |
| Templates | 2 | Task template discovery and creation |
| Attachments | 1 | Upload, list, get (with large file chunking) |
| Workspace | 1 | Hierarchy, members, plan details |
| User Groups | 1 | Group management (4 actions) |
| Guests | 1 | Guest management (Enterprise, 10 actions) |
| Audit Logs | 1 | Activity logs (Enterprise) |
| Feedback | 1 | Bug reports and feature requests |

See [references/tool_reference.md](./references/tool_reference.md) for complete tool documentation.

---

<!-- /ANCHOR:features -->

<!-- ANCHOR:configuration -->
## 5. CONFIGURATION

### CLI Configuration

```bash
# Interactive setup
cu init

# Or manual config at ~/.config/cu/config.json
{
  "apiToken": "pk_your_token",
  "teamId": "your_team_id"
}

# Environment variable overrides
export CU_API_TOKEN="pk_your_token"
export CU_TEAM_ID="your_team_id"
```

### MCP Configuration (Code Mode)

Already configured in `.utcp_config.json`:

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

Add to `.env`:

```bash
# ClickUp credentials
# Get API token from: ClickUp Settings > Apps > API Token
# Get Team ID from: ClickUp Settings > Workspaces

# For Code Mode (prefixed with manual name)
clickup_CLICKUP_API_KEY=pk_your_token_here
clickup_CLICKUP_TEAM_ID=your_team_id_here

# For CLI (used by cu directly)
CU_API_TOKEN=pk_your_token_here
CU_TEAM_ID=your_team_id_here
```

### Getting Your API Token

1. Open ClickUp Settings
2. Go to **Apps** section
3. Click **API Token**
4. Copy the token (starts with `pk_`)
5. Add to `.env` file and/or CLI config

---

<!-- /ANCHOR:configuration -->

<!-- ANCHOR:naming-convention -->
## 6. NAMING CONVENTION

### MCP Tool Naming

All MCP tool calls follow Code Mode's naming pattern:

```
clickup.clickup_{tool_name}
```

### Examples

| Tool | Correct Call |
|------|--------------|
| create_task | `clickup.clickup_create_task({...})` |
| get_task | `clickup.clickup_get_task({...})` |
| manage_goals | `clickup.clickup_manage_goals({...})` |
| manage_time_entries | `clickup.clickup_manage_time_entries({...})` |

### Common Mistakes

```typescript
// WRONG - missing clickup_ prefix
await clickup.create_task({ name: "..." });

// WRONG - camelCase
await clickup.clickup_createTask({ name: "..." });

// CORRECT
await clickup.clickup_create_task({ name: "..." });
```

### CLI Command Naming

CLI uses `cu <command>` pattern with kebab-case flags:

```bash
cu create -n "Task name" -l <listId> --due-date 2026-04-01
cu update <id> --status "in progress" --priority high
```

---

<!-- /ANCHOR:naming-convention -->

<!-- ANCHOR:usage-examples -->
## 7. USAGE EXAMPLES

### Example 1: Daily Standup (CLI)

```bash
# Sprint summary for standup
cu summary

# Current sprint tasks
cu sprint

# Overdue tasks
cu overdue
```

### Example 2: Create Task (CLI)

```bash
cu create \
  -n "Implement login page" \
  -l abc123 \
  -d "Build login UI with email/password auth" \
  --status "to do" \
  --priority high \
  --assignee me \
  --tags "frontend,auth" \
  --due-date 2026-04-15
```

### Example 3: Bulk Create Tasks (MCP)

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

### Example 4: Document Creation (MCP)

```typescript
call_tool_chain({
  code: `
    const doc = await clickup.clickup_create_document({
      parent: { id: "space_id", type: 4 },
      name: "Sprint 12 Retrospective",
      visibility: "PUBLIC",
      content: "## What went well\\n- Shipped login feature on time\\n\\n## What to improve\\n- Better test coverage",
      content_format: "text/md"
    });
    return doc;
  `
});
```

### Example 5: Time Tracking (MCP)

```typescript
call_tool_chain({
  code: `
    // Start timer on task
    await clickup.clickup_manage_time_entries({
      action: "start_timer",
      task: "task-id-here"
    });

    // Later: stop timer
    await clickup.clickup_manage_time_entries({
      action: "stop_timer"
    });
  `
});
```

---

<!-- /ANCHOR:usage-examples -->

<!-- ANCHOR:troubleshooting -->
## 8. TROUBLESHOOTING

### Common Issues

#### CLI: Wrong `cu` binary

**Symptom**: `cu (Taylor UUCP) 1.07` instead of ClickUp CLI version.

**Cause**: System UUCP `cu` binary found instead of ClickUp CLI.

**Solution**:
```bash
# Check which cu is being used
which cu  # Should be in node_modules/.bin or npm global

# Install ClickUp CLI
npm install -g @krodak/clickup-cli

# Ensure npm global bin is before /usr/bin in PATH
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### CLI: Authentication Failed

**Symptom**: `Error: Invalid API token` or `Error: Team not found`.

**Solution**:
```bash
# Re-configure
cu init

# Or set environment variables
export CU_API_TOKEN="pk_your_token"
export CU_TEAM_ID="your_team_id"
```

#### MCP: Tool Not Found

**Symptom**: `clickup_create_task is not a function`.

**Solution**:
```typescript
// Discover exact tool names
search_tools({ task_description: "clickup create task" });

// Use full naming convention
await clickup.clickup_create_task({ ... });
```

#### MCP: Environment Variable Not Found

**Symptom**: `Variable 'CLICKUP_API_KEY' not found`.

**Solution**: Use prefixed variable names in `.env`:
```bash
# WRONG
CLICKUP_API_KEY=pk_...

# CORRECT (prefixed with Code Mode manual name)
clickup_CLICKUP_API_KEY=pk_...
clickup_CLICKUP_TEAM_ID=...
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Wrong `cu` binary | Reinstall CLI, check PATH order |
| Auth failed | `cu init` or check `.env` |
| Tool not found | `search_tools("clickup")` |
| Rate limited | Wait 60 seconds, retry |
| Task not found | Use task ID instead of name |

---

<!-- /ANCHOR:troubleshooting -->

<!-- ANCHOR:faq -->
## 9. FAQ

**Q: When should I use CLI vs MCP?**

A: Use CLI for daily task operations (create, update, search, sprint, standup). Use MCP for features CLI doesn't have: documents, goals, webhooks, time tracking, chat, bulk operations, and enterprise features.

**Q: Do I need both tools installed?**

A: No, but recommended. CLI alone covers most daily needs. MCP adds enterprise features. Either works independently.

**Q: What Node.js version do I need?**

A: CLI requires Node >= 22.0.0. MCP works with Node 18-22. If you have Node < 22, you can still use MCP.

**Q: How do I find my Team ID?**

A: Go to ClickUp Settings > Workspaces. The Team ID is displayed there. Or use `cu config get teamId` if CLI is configured.

**Q: Can I use both CLI and MCP simultaneously?**

A: Yes. They use the same ClickUp API with separate authentication. CLI uses `cu init` config; MCP uses `.utcp_config.json` env vars.

---

<!-- /ANCHOR:faq -->

<!-- ANCHOR:related -->
## 10. RELATED DOCUMENTS

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [SKILL.md](./SKILL.md) | AI agent instructions and workflow guidance |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Complete installation for CLI and MCP |
| [references/tool_reference.md](./references/tool_reference.md) | All 46 MCP tools documented |
| [references/cli_reference.md](./references/cli_reference.md) | 30+ CLI commands with flags |
| [references/workflows.md](./references/workflows.md) | Common workflow patterns |
| [assets/tool_categories.md](./assets/tool_categories.md) | Tool priority categorization |

### External Resources

| Resource | Description |
|----------|-------------|
| [ClickUp CLI (npm)](https://www.npmjs.com/package/@krodak/clickup-cli) | CLI package |
| [ClickUp MCP Server (npm)](https://www.npmjs.com/package/@taazkareem/clickup-mcp-server) | MCP server package |
| [ClickUp API](https://clickup.com/api) | Official API reference |

### Related Skills

| Skill | Purpose |
|-------|---------|
| [mcp-code-mode](../mcp-code-mode/README.md) | Tool orchestration via Code Mode |
| [mcp-figma](../mcp-figma/README.md) | Cross-tool workflow (Figma -> ClickUp) |

<!-- /ANCHOR:related -->

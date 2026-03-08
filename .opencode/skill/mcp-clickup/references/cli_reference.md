---
title: CLI Reference - ClickUp CLI (cu)
description: Complete reference for 30+ ClickUp CLI commands with flags, output modes, and usage patterns.
---

# CLI Reference - ClickUp CLI (cu)

Complete reference for 30+ ClickUp CLI commands with flags, output modes, and usage patterns.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Detailed command reference for the ClickUp CLI (`cu`) by `@krodak/clickup-cli`, covering read commands, write commands, task IDs, and error handling.

### When to Use

- Looking up CLI command syntax and available flags
- Choosing between CLI and MCP approaches for ClickUp operations
- Scripting ClickUp workflows in shell pipelines

### Prerequisites

- **Installation**: `npm install -g @krodak/clickup-cli`
- **Configuration**: `cu init` (interactive setup)
- **Requires**: Node.js >= 22.0.0

### Core Principle

CLI for speed and single operations; MCP for bulk, enterprise, and document workflows.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:output-modes -->
## 2. Output Modes

| Mode | When | Format | Override |
|------|------|--------|----------|
| TTY (terminal) | Interactive use | Picker UI with fuzzy search | N/A |
| Piped / non-TTY | AI agent / scripts | Markdown tables | `--json` for raw JSON |

**Environment override**: `CU_OUTPUT=json` forces JSON output when piped.

All commands support `--help` for usage information.

---

<!-- /ANCHOR:output-modes -->
<!-- ANCHOR:read-commands -->
## 3. Read Commands

### Task Discovery

| Command | Purpose | Key Flags |
|---------|---------|-----------|
| `cu tasks` | My open tasks | Default scoped to current user |
| `cu assigned` | Tasks assigned to me | Same as tasks but explicit |
| `cu sprint` | Current sprint tasks | Shows active sprint |
| `cu sprints` | All sprints | List all sprints |
| `cu summary` | Sprint standup summary | Great for daily standups |
| `cu search <query>` | Search tasks by text | Workspace-wide search |
| `cu overdue` | Overdue tasks | Tasks past due date |
| `cu inbox` | Notifications | Unread notifications |

### Task Details

| Command | Purpose | Key Flags |
|---------|---------|-----------|
| `cu task <id>` | Task details | Full task info |
| `cu subtasks <id>` | Task subtasks | Child tasks |
| `cu comments <id>` | Task comments | Comment thread |
| `cu activity <id>` | Task activity log | Change history |
| `cu open <query>` | Open task in browser | Opens ClickUp UI |

### Workspace Navigation

| Command | Purpose | Key Flags |
|---------|---------|-----------|
| `cu spaces` | List workspace spaces | Top-level structure |
| `cu lists <spaceId>` | Lists in a space | Space contents |
| `cu auth` | Verify authentication | Check connection |
| `cu config get` | View config values | `apiToken`, `teamId` |
| `cu config path` | Show config file path | File location |

---

<!-- /ANCHOR:read-commands -->
<!-- ANCHOR:write-commands -->
## 4. Write Commands

### Task Creation

```bash
cu create -n "Task name" -l <listId> [options]
```

| Flag | Required | Description | Example |
|------|----------|-------------|---------|
| `-n` / `--name` | Yes | Task name | `-n "Fix login bug"` |
| `-l` / `--list` | Yes | Target list ID | `-l abc123` |
| `-d` / `--desc` | No | Description | `-d "Detailed description"` |
| `-s` / `--status` | No | Initial status | `-s "to do"` |
| `--priority` | No | Priority (name or 1-4) | `--priority high` or `--priority 2` |
| `--due-date` | No | Due date (YYYY-MM-DD) | `--due-date 2026-04-15` |
| `--assignee` | No | Assign to user | `--assignee me` |
| `--tags` | No | Tags (comma-separated) | `--tags "bug,frontend"` |
| `--custom-item-id` | No | Custom item type | `--custom-item-id 5` |

### Task Update

```bash
cu update <id> [options]
```

| Flag | Description | Example |
|------|-------------|---------|
| `--name` | New name | `--name "Updated name"` |
| `--description` | New description | `--description "New desc"` |
| `--status` | New status (fuzzy matched) | `--status "in progress"` |
| `--priority` | Priority (name or 1-4) | `--priority urgent` |
| `--due-date` | Due date | `--due-date 2026-04-15` |
| `--time-estimate` | Time estimate | `--time-estimate "2h30m"` |
| `--assignee` | Assign user | `--assignee me` |
| `--parent` | Set parent task | `--parent parentId` |

**Status matching**: Fuzzy (exact > starts-with > contains). Example: `--status "prog"` matches "in progress".

**Priority values**: `urgent` (1), `high` (2), `normal` (3), `low` (4), or use numbers directly.

**Time estimate formats**: `"2h"`, `"30m"`, `"1h30m"`, or milliseconds.

### Comments

```bash
cu comment <taskId> -m "Comment text"
```

### Assignment

```bash
cu assign <taskId> --to userId|me --remove userId|me
```

### Dependencies

```bash
cu depend <taskId> --on <otherId>       # Task depends on other
cu depend <taskId> --blocks <otherId>   # Task blocks other
cu depend <taskId> --remove             # Remove dependency
```

### Move / Multi-List

```bash
cu move <taskId> --to <listId>          # Move to list
cu move <taskId> --remove <listId>      # Remove from list
```

### Custom Fields

```bash
cu field <taskId> --set "Field Name" value
cu field <taskId> --remove "Field Name"
```

**Supported types**: text, number, checkbox, dropdown, date, url, email.

### Tags

```bash
cu tag <taskId> --add "bug,frontend"
cu tag <taskId> --remove "bug"
```

### Delete

```bash
cu delete <taskId> --confirm
```

**Warning**: Irreversible. Always requires `--confirm` flag.

### Configuration

```bash
cu config get <key>     # Get config value
cu config set <key> <value>   # Set config value
cu config path          # Show config file path
```

### Shell Completions

```bash
cu completion bash      # Bash completions
cu completion zsh       # Zsh completions
cu completion fish      # Fish completions
```

---

<!-- /ANCHOR:write-commands -->
<!-- ANCHOR:task-ids -->
## 5. Task IDs and References

- **Task IDs**: Stable alphanumeric strings (e.g., `abc123def`)
- **Custom Task IDs**: Displayed with prefix (e.g., `ENG-123`) but API uses internal alphanumeric IDs
- **Fuzzy matching**: Names matched by exact > starts-with > contains
- **TTY mode**: Interactive picker with fuzzy search when multiple matches found

---

<!-- /ANCHOR:task-ids -->
<!-- ANCHOR:error-handling -->
## 6. Error Handling

- Errors output to stderr with exit code 1
- Successful commands exit with code 0
- Use `2>&1` to capture stderr in scripts
- JSON output mode includes error details in structured format

### Common Error Patterns

```bash
# Check if command succeeded
if cu task abc123 > /dev/null 2>&1; then
  echo "Task exists"
else
  echo "Task not found"
fi

# Capture output with error handling
result=$(cu tasks --json 2>&1) || echo "Failed: $result"
```

---

<!-- /ANCHOR:error-handling -->
<!-- ANCHOR:related -->
## 7. Related

- [SKILL.md](../SKILL.md) - Main skill instructions
- [tool_reference.md](./tool_reference.md) - MCP tool reference
- [workflows.md](./workflows.md) - Common workflow patterns

<!-- /ANCHOR:related -->

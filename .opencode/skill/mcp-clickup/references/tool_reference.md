---
title: MCP Tool Reference - ClickUp
description: Complete reference for all 46 ClickUp MCP tools with invocation patterns and parameters.
---

# MCP Tool Reference - ClickUp

Complete reference for all 46 ClickUp MCP tools with invocation patterns and parameters.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Detailed parameter and invocation reference for all 46 ClickUp MCP tools accessible via Code Mode, organized by functional category.

### When to Use

- Looking up MCP tool names, parameters, and invocation syntax
- Building multi-tool workflows with `call_tool_chain()`
- Choosing the right tool for bulk, enterprise, or document operations

### Core Principle

**Invocation pattern**: `clickup.clickup_{tool_name}({params})` — all tools follow this naming convention inside Code Mode.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:task-management -->
## 2. Task Management (20 tools)

### Core Task Operations

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `create_task` | Create a task | `listName`/`listId`, `name`, `description?`, `status?`, `priority?`, `assignees?`, `dueDate?`, `tags?` |
| `create_bulk_tasks` | Create multiple tasks | `listName`/`listId`, `tasks[]` (array of task objects) |
| `get_task` | Get task details | `task` (name or ID, fuzzy matched) |
| `update_task` | Update task fields | `task`, `name?`, `description?`, `status?`, `priority?`, `dueDate?`, `assignees?` |
| `update_bulk_tasks` | Update multiple tasks | `tasks[]` (array with task identifiers and updates) |
| `delete_task` | Delete a task | `task` (ID or name). **Irreversible.** |
| `move_task` | Move task to list | `task`, `listId`/`listName` |
| `search_tasks` | Search workspace tasks | `query`, filters (status, priority, assignees, etc.) |

### Subtasks & Dependencies

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `create_subtask` | Create subtask | `task` (parent), `name`, `description?`, `status?`, `priority?` |
| `get_subtasks` | Get task subtasks | `task` (parent ID or name) |
| `create_dependency` | Create dependency | `task`, `depends_on`/`blocks` |
| `get_dependency` | Get dependencies | `task` |
| `update_dependency` | Update dependency | `dependency_id`, fields |
| `delete_dependency` | Delete dependency | `dependency_id` |
| `link_tasks` | Link related tasks | `task`, `linked_task` |

### Multi-List (TIML)

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `add_task_to_list` | Add task to additional list | `task`, `listId`/`listName` |
| `remove_task_from_list` | Remove from list | `task`, `listId`/`listName` (must remain in at least one) |

### Comments & Attachments

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `manage_comments` | Comment lifecycle | `action` (get/create/update/delete), `task`, `comment_text?`, `comment_id?` |
| `manage_attachments` | File attachments | `action` (list/get/upload), `taskId`/`taskName`, `file_data?`/`file_url?` |

### Invocation Examples

```typescript
// Create task
await clickup.clickup_create_task({
  listName: "Sprint Backlog",
  name: "Implement auth flow",
  description: "Build OAuth2 login",
  priority: 2,
  assignees: ["dev@team.com"],
  dueDate: "2026-04-15"
});

// Search tasks
await clickup.clickup_search_tasks({
  query: "login",
  statuses: ["in progress", "review"]
});

// Bulk create
await clickup.clickup_create_bulk_tasks({
  listName: "Sprint Backlog",
  tasks: [
    { name: "Task A", priority: 2 },
    { name: "Task B", priority: 3 }
  ]
});
```

---

<!-- /ANCHOR:task-management -->
<!-- ANCHOR:checklists -->
## 3. Task Checklists (1 tool)

### `manage_checklists`

**Actions**: `create_checklist`, `edit_checklist`, `delete_checklist`, `create_item`, `edit_item`, `delete_item`

| Parameter | Type | Description |
|-----------|------|-------------|
| `action` | string | One of the actions above |
| `task_id`/`task_name` | string | Target task |
| `checklist_id` | string | Checklist identifier |
| `name` | string | Checklist or item name |
| `resolved` | boolean | Item completion status |
| `parent` | string | Parent item ID for nesting |

```typescript
// Create checklist with items
await clickup.clickup_manage_checklists({
  action: "create_checklist",
  task_name: "Deploy v2",
  name: "Deploy Steps"
});
```

---

<!-- /ANCHOR:checklists -->
<!-- ANCHOR:custom-fields -->
## 4. Custom Fields (1 tool)

### `manage_custom_fields`

**Actions**: `list`, `create`, `set_value`, `remove_value`

**Supported field types**: short_text, number, drop_down, date, checkbox, users, email, url, currency, text, tasks, labels, phone, location, rating, progress, emoji, people

```typescript
// Set custom field value
await clickup.clickup_manage_custom_fields({
  action: "set_value",
  taskId: "abc123",
  fieldName: "Story Points",
  value: 5
});
```

---

<!-- /ANCHOR:custom-fields -->
<!-- ANCHOR:time-tracking -->
## 5. Time Tracking (1 tool)

### `manage_time_entries`

**Actions**: `get_entries`, `get_current`, `start_timer`, `stop_timer`, `add_entry`, `update_entry`, `delete_entry`, `get_history`, `get_tags`, `add_tags`, `update_tags`, `delete_tags`, `get_bulk_time_in_status`

```typescript
// Start timer
await clickup.clickup_manage_time_entries({
  action: "start_timer",
  task: "task-id"
});

// Log manual entry
await clickup.clickup_manage_time_entries({
  action: "add_entry",
  task: "task-id",
  duration: "1h 30m",
  description: "Code review",
  billable: true
});
```

---

<!-- /ANCHOR:time-tracking -->
<!-- ANCHOR:workspace-structure -->
## 6. Workspace Structure (4 tools)

### `manage_lists`

**Actions**: `create`, `get`, `get_lists`, `update`, `delete`, `move`, `set_permissions`

### `manage_spaces`

**Actions**: `list`, `get`, `create`, `update`, `delete`, `set_permissions`

### `manage_folders`

**Actions**: `create`, `get`, `update`, `delete`, `move`, `set_permissions`

### `get_workspace`

| Parameter | Type | Description |
|-----------|------|-------------|
| `include_hierarchy` | boolean | Include spaces/folders/lists (default: true) |
| `include_members` | boolean | Include member list |
| `include_plan` | boolean | Include plan details |
| `search_member` | string | Search member by name/email |

```typescript
// Get full workspace hierarchy
await clickup.clickup_get_workspace({
  include_hierarchy: true,
  include_members: true
});

// Create space
await clickup.clickup_manage_spaces({
  action: "create",
  name: "Engineering",
  features: { time_tracking: true, tags: true }
});
```

---

<!-- /ANCHOR:workspace-structure -->
<!-- ANCHOR:tags -->
## 7. Tags (3 tools)

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `manage_space_tags` | Space-level tag CRUD | `action` (list/create/update/delete), `spaceName`, `tagName` |
| `add_tag_to_task` | Add tag to task | `tagName`, `taskId`/`taskName` |
| `remove_tag_from_task` | Remove tag from task | `tagName`, `taskId`/`taskName` |

```typescript
await clickup.clickup_add_tag_to_task({
  tagName: "urgent",
  taskName: "Fix login bug"
});
```

---

<!-- /ANCHOR:tags -->
<!-- ANCHOR:goals -->
## 8. Goals (1 tool)

### `manage_goals`

**Actions**: `list`, `get`, `create`, `update`, `delete`, `create_key_result`, `update_key_result`, `delete_key_result`

**Key result types**: `number`, `percentage`, `automatic`, `boolean`, `currency`

```typescript
// Create goal with key result
await clickup.clickup_manage_goals({
  action: "create",
  name: "Q2 Engineering Goals",
  dueDate: "2026-06-30",
  color: "#7B68EE"
});
```

---

<!-- /ANCHOR:goals -->
<!-- ANCHOR:views -->
## 9. Views (1 tool)

### `manage_views`

**Actions**: `list`, `get`, `create`, `update`, `delete`, `get_tasks`

**View types**: `list`, `board`, `calendar`, `gantt`, `timeline`, `table`, `mind_map`, `workload`, `activity`, `map`

```typescript
await clickup.clickup_manage_views({
  action: "create",
  spaceId: "space_id",
  name: "Sprint Board",
  type: "board"
});
```

---

<!-- /ANCHOR:views -->
<!-- ANCHOR:documents -->
## 10. Documents (7 tools)

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `create_document` | Create document | `parent`, `name`, `content?`, `content_format?`, `visibility?` |
| `get_document` | Get document | `documentId`/`documentName` |
| `list_documents` | List documents | `parent` |
| `list_document_pages` | List pages | `documentId` |
| `get_document_pages` | Get page content | `documentId`, `pageIds` |
| `create_document_page` | Create page | `documentId`, `name`, `content` |
| `update_document_page` | Update page | `documentId`, `pageId`, `content`, `content_edit_mode?` |

**Parent types**: 4=Space, 5=Folder, 6=List, 7=All, 12=Workspace

**Content formats**: `text/md` (default), `text/html`, `text/plain`

**Edit modes**: `replace` (default), `append`, `prepend`

```typescript
// Create document with Markdown
await clickup.clickup_create_document({
  parent: { id: "space_id", type: 4 },
  name: "Architecture Decision Record",
  visibility: "PUBLIC",
  content: "## Context\n\nWe need to choose a database...",
  content_format: "text/md"
});
```

---

<!-- /ANCHOR:documents -->
<!-- ANCHOR:webhooks -->
## 11. Webhooks (1 tool)

### `manage_webhooks`

**Actions**: `list`, `create`, `update`, `delete`

**Event types**: `taskCreated`, `taskUpdated`, `taskDeleted`, `taskStatusUpdated`, `taskPriorityUpdated`, `taskAssigneeUpdated`, `taskDueDateUpdated`, `taskCommentPosted`, `listCreated`, `listUpdated`, `folderCreated`, `spaceCreated`, `goalCreated`, and more. Use `["*"]` for all events.

```typescript
await clickup.clickup_manage_webhooks({
  action: "create",
  endpoint: "https://hooks.example.com/clickup",
  events: ["taskCreated", "taskStatusUpdated"],
  space_id: "space_id"
});
```

---

<!-- /ANCHOR:webhooks -->
<!-- ANCHOR:chat -->
## 12. Chat (2 tools)

### `manage_chat_channels`

**Actions**: `list`, `get`, `create`, `update`, `delete`, `get_members`, `get_followers`, `create_dm`

### `manage_chat_messages`

**Actions**: `get`, `create`, `update`, `delete`, `get_replies`, `create_reply`, `add_reaction`, `remove_reaction`, `get_reactions`, `get_tagged_users`

```typescript
// Send message
await clickup.clickup_manage_chat_messages({
  action: "create",
  channel_name: "engineering",
  content: "Sprint 12 deployed successfully!",
  notify_all: true
});
```

---

<!-- /ANCHOR:chat -->
<!-- ANCHOR:templates -->
## 13. Templates (2 tools)

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `get_task_templates` | List templates | `page?` (0-indexed pagination) |
| `create_task_from_template` | Create from template | `templateId`, `listName`/`listId`, `name?` |

---

<!-- /ANCHOR:templates -->
<!-- ANCHOR:remaining-tools -->
## 14. Remaining Tools

### User Groups (1 tool)

`manage_user_groups` - Actions: `list`, `create`, `update`, `delete`

### Guests (1 tool, Enterprise)

`manage_guests` - Actions: `invite`, `get`, `edit`, `remove`, `add_to_task`, `remove_from_task`, `add_to_list`, `remove_from_list`, `add_to_folder`, `remove_from_folder`

### Audit Logs (1 tool, Enterprise)

`get_audit_logs` - Filter by: `auth-and-security`, `custom-fields`, `hierarchy-activity`, `user-activity`, `agent-settings-activity`, `other-activity`

### Feedback (1 tool)

`submit_feedback` - Types: `bug`, `feature`, `question`

---

<!-- /ANCHOR:remaining-tools -->
<!-- ANCHOR:related -->
## 15. Related

- [SKILL.md](../SKILL.md) - Main skill instructions
- [cli_reference.md](./cli_reference.md) - CLI command reference
- [workflows.md](./workflows.md) - Common workflow patterns
- [tool_categories.md](../assets/tool_categories.md) - Priority categorization

<!-- /ANCHOR:related -->

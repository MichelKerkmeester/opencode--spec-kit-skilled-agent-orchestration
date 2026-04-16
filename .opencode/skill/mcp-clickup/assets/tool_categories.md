---
title: Tool Categories - Priority Classification
description: Categorization of all 46 ClickUp MCP tools with priority levels for efficient usage.
---

# Tool Categories - Priority Classification

Quick reference for choosing the right ClickUp tool by priority level.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Quick reference for choosing the right ClickUp tool by priority level. Helps identify which tools to use actively vs. sparingly.

### Usage

Use the priority tables to select appropriate tools. HIGH priority tools should be used actively, MEDIUM when specific needs arise, LOW sparingly.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:priority-levels -->
## 2. PRIORITY LEVELS

### Definitions

| Priority | Description | Usage |
|----------|-------------|-------|
| **HIGH** | Core functionality, frequently used | Use actively for most tasks |
| **MEDIUM** | Useful but situational | Use when specific need arises |
| **LOW** | Rarely needed or enterprise-only | Use sparingly |

### Summary Statistics

| Priority | Count | Percentage |
|----------|-------|------------|
| HIGH | 8 | 17% |
| MEDIUM | 19 | 40% |
| LOW | 20 | 43% |
| **Total** | **47** | **100%** |

---

<!-- /ANCHOR:priority-levels -->
<!-- ANCHOR:high-priority-tools -->
## 3. HIGH PRIORITY TOOLS (8)

Core task and workspace operations - use actively.

| Tool | Category | Purpose | Rationale |
|------|----------|---------|-----------|
| `create_task` | Tasks | Create a task | Primary task creation |
| `get_task` | Tasks | Get task details | Most common lookup |
| `update_task` | Tasks | Update task fields | Core status/field updates |
| `delete_task` | Tasks | Delete task | Task removal (confirm first) |
| `search_tasks` | Tasks | Search workspace tasks | Task discovery |
| `manage_comments` | Tasks | Comment lifecycle | Collaboration essential |
| `get_workspace` | Workspace | Workspace hierarchy | Structure discovery |
| `create_bulk_tasks` | Tasks | Bulk task creation | Efficient multi-task setup |

### When to Use HIGH Priority

- Creating or managing individual tasks
- Searching for tasks across workspace
- Getting workspace structure
- Adding comments to tasks
- Bulk task creation for sprint planning

---

<!-- /ANCHOR:high-priority-tools -->
<!-- ANCHOR:medium-priority-tools -->
## 4. MEDIUM PRIORITY TOOLS (19)

Useful but situational - use when specific need arises.

| Tool | Category | Purpose | Rationale |
|------|----------|---------|-----------|
| `update_bulk_tasks` | Tasks | Bulk update tasks | Batch status changes |
| `create_subtask` | Tasks | Create subtask | Task decomposition |
| `get_subtasks` | Tasks | Get subtasks | Task hierarchy |
| `move_task` | Tasks | Move to list | Task reorganization |
| `link_tasks` | Tasks | Link related tasks | Task relationships |
| `create_dependency` | Tasks | Add dependency | Workflow ordering |
| `manage_lists` | Structure | List CRUD | Space organization |
| `manage_spaces` | Structure | Space CRUD | Workspace setup |
| `manage_folders` | Structure | Folder CRUD | Hierarchy management |
| `manage_custom_fields` | Fields | Custom field CRUD | Field definitions/values |
| `manage_checklists` | Tasks | Checklist items | Sub-task tracking |
| `add_tag_to_task` | Tags | Tag a task | Task categorization |
| `remove_tag_from_task` | Tags | Untag a task | Tag cleanup |
| `manage_space_tags` | Tags | Space tag CRUD | Tag definitions |
| `manage_attachments` | Tasks | File operations | Upload/list/get files |
| `manage_views` | Views | View CRUD | Custom views |
| `create_document` | Docs | Create document | Knowledge base |
| `manage_time_entries` | Time | Time tracking | Effort logging |
| `manage_goals` | Goals | Goal/KR management | OKR tracking |

### When to Use MEDIUM Priority

- Managing workspace structure (spaces, folders, lists)
- Working with custom fields and tags
- Creating documents or tracking time
- Setting up goals and key results
- Task dependencies and subtasks

---

<!-- /ANCHOR:medium-priority-tools -->
<!-- ANCHOR:low-priority-tools -->
## 5. LOW PRIORITY TOOLS (20)

Rarely needed or enterprise-only - use sparingly.

| Tool | Category | Purpose | Rationale |
|------|----------|---------|-----------|
| `get_dependency` | Tasks | Get dependencies | Rare lookup |
| `update_dependency` | Tasks | Update dependency | Rare modification |
| `delete_dependency` | Tasks | Delete dependency | Rare cleanup |
| `add_task_to_list` | TIML | Multi-list add | Advanced feature |
| `remove_task_from_list` | TIML | Multi-list remove | Advanced feature |
| `get_document` | Docs | Get document | Occasional lookup |
| `list_documents` | Docs | List documents | Occasional browse |
| `list_document_pages` | Docs | List pages | Occasional browse |
| `get_document_pages` | Docs | Get page content | Occasional read |
| `create_document_page` | Docs | Create page | Occasional write |
| `update_document_page` | Docs | Update page | Occasional edit |
| `manage_webhooks` | Webhooks | Webhook CRUD | Integration setup |
| `manage_chat_channels` | Chat | Channel CRUD | Chat management |
| `manage_chat_messages` | Chat | Message CRUD | Chat interaction |
| `get_task_templates` | Templates | List templates | Template discovery |
| `create_task_from_template` | Templates | Create from template | Template usage |
| `manage_user_groups` | Admin | User group CRUD | Admin only |
| `manage_guests` | Admin | Guest management | Enterprise only |
| `get_audit_logs` | Admin | Audit logs | Enterprise only |
| `submit_feedback` | Meta | Bug/feature report | Rare usage |

### When to Use LOW Priority

- Setting up webhooks for integrations
- Managing chat channels and messages
- Enterprise admin operations (guests, audit logs)
- Multi-list (TIML) task management
- Document page management
- Task template operations

---

<!-- /ANCHOR:low-priority-tools -->
<!-- ANCHOR:tools-by-category -->
## 6. TOOLS BY CATEGORY

### Task Management (20)

| Tool | Priority | Description |
|------|----------|-------------|
| `create_task` | HIGH | Create a task |
| `get_task` | HIGH | Get task details |
| `update_task` | HIGH | Update task fields |
| `delete_task` | HIGH | Delete task |
| `search_tasks` | HIGH | Search workspace |
| `manage_comments` | HIGH | Comment lifecycle |
| `create_bulk_tasks` | HIGH | Bulk create |
| `update_bulk_tasks` | MEDIUM | Bulk update |
| `create_subtask` | MEDIUM | Create subtask |
| `get_subtasks` | MEDIUM | Get subtasks |
| `move_task` | MEDIUM | Move task |
| `link_tasks` | MEDIUM | Link tasks |
| `create_dependency` | MEDIUM | Add dependency |
| `manage_checklists` | MEDIUM | Checklist items |
| `manage_attachments` | MEDIUM | File operations |
| `get_dependency` | LOW | Get dependencies |
| `update_dependency` | LOW | Update dependency |
| `delete_dependency` | LOW | Delete dependency |
| `add_task_to_list` | LOW | Multi-list add |
| `remove_task_from_list` | LOW | Multi-list remove |

### Workspace Structure (4)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_workspace` | HIGH | Workspace hierarchy |
| `manage_lists` | MEDIUM | List CRUD |
| `manage_spaces` | MEDIUM | Space CRUD |
| `manage_folders` | MEDIUM | Folder CRUD |

### Documents (7)

| Tool | Priority | Description |
|------|----------|-------------|
| `create_document` | MEDIUM | Create document |
| `get_document` | LOW | Get document |
| `list_documents` | LOW | List documents |
| `list_document_pages` | LOW | List pages |
| `get_document_pages` | LOW | Get page content |
| `create_document_page` | LOW | Create page |
| `update_document_page` | LOW | Update page |

### Time & Goals (2)

| Tool | Priority | Description |
|------|----------|-------------|
| `manage_time_entries` | MEDIUM | Time tracking |
| `manage_goals` | MEDIUM | Goal/KR management |

### Fields & Tags (4)

| Tool | Priority | Description |
|------|----------|-------------|
| `manage_custom_fields` | MEDIUM | Custom field CRUD |
| `add_tag_to_task` | MEDIUM | Tag a task |
| `remove_tag_from_task` | MEDIUM | Untag a task |
| `manage_space_tags` | MEDIUM | Space tag CRUD |

### Views (1)

| Tool | Priority | Description |
|------|----------|-------------|
| `manage_views` | MEDIUM | View CRUD |

### Chat & Webhooks (3)

| Tool | Priority | Description |
|------|----------|-------------|
| `manage_webhooks` | LOW | Webhook CRUD |
| `manage_chat_channels` | LOW | Channel CRUD |
| `manage_chat_messages` | LOW | Message CRUD |

### Templates (2)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_task_templates` | LOW | List templates |
| `create_task_from_template` | LOW | Create from template |

### Admin & Meta (3)

| Tool | Priority | Description |
|------|----------|-------------|
| `manage_user_groups` | LOW | User groups |
| `manage_guests` | LOW | Guest management (Enterprise) |
| `get_audit_logs` | LOW | Audit logs (Enterprise) |
| `submit_feedback` | LOW | Bug/feature report |

---

<!-- /ANCHOR:tools-by-category -->
<!-- ANCHOR:decision-flowchart -->
## 7. DECISION FLOWCHART

```
What do you need?
     |
     +-- Task CRUD (single)
     |   +-- HIGH: create_task, get_task, update_task, delete_task
     |
     +-- Task search / discovery
     |   +-- HIGH: search_tasks, get_workspace
     |
     +-- Bulk task operations
     |   +-- HIGH: create_bulk_tasks
     |   +-- MEDIUM: update_bulk_tasks
     |
     +-- Task relationships
     |   +-- MEDIUM: create_subtask, link_tasks, create_dependency
     |   +-- LOW: get/update/delete_dependency
     |
     +-- Comments / Attachments
     |   +-- HIGH: manage_comments
     |   +-- MEDIUM: manage_attachments
     |
     +-- Workspace structure
     |   +-- HIGH: get_workspace
     |   +-- MEDIUM: manage_lists, manage_spaces, manage_folders
     |
     +-- Custom fields / Tags
     |   +-- MEDIUM: manage_custom_fields, *_tag_*
     |
     +-- Documents
     |   +-- MEDIUM: create_document
     |   +-- LOW: other doc tools
     |
     +-- Time / Goals / Views
     |   +-- MEDIUM: manage_time_entries, manage_goals, manage_views
     |
     +-- Chat / Webhooks
     |   +-- LOW: manage_chat_*, manage_webhooks
     |
     +-- Admin
         +-- LOW: manage_user_groups, manage_guests, get_audit_logs
```

---

<!-- /ANCHOR:decision-flowchart -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

### Guides

- [tool_reference.md](../references/tool_reference.md) - Complete tool documentation
- [cli_reference.md](../references/cli_reference.md) - CLI command reference
- [workflows.md](../references/workflows.md) - Common workflows

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions

<!-- /ANCHOR:related-resources -->

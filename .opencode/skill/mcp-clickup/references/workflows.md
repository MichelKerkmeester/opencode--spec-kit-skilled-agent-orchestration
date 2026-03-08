---
title: Workflow Patterns - ClickUp
description: Common CLI+MCP workflow patterns for ClickUp project management.
---

# Workflow Patterns - ClickUp

Common CLI+MCP workflow patterns for efficient ClickUp project management.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Ready-to-use workflow patterns combining CLI and MCP approaches for common ClickUp project management scenarios.

### When to Use

- Setting up daily standup automation
- Managing task lifecycle (create, work, complete)
- Building cross-tool workflows (Figma-to-ClickUp, ClickUp-to-Git)
- Choosing CLI vs MCP for a given scenario

### Core Principle

Use CLI for speed on single operations; use MCP for bulk, multi-step, and enterprise workflows.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:daily-standup -->
## 2. Daily Standup (CLI)

Quick sprint status for daily standups.

```bash
# Full standup summary
cu summary

# Current sprint tasks
cu sprint

# Overdue items needing attention
cu overdue

# Combined standup report
echo "## Standup Report"
echo "### Sprint Status"
cu sprint
echo ""
echo "### Overdue"
cu overdue
```

**Best approach**: CLI-only. `cu summary` provides a ready-made standup format.

---

<!-- /ANCHOR:daily-standup -->
<!-- ANCHOR:task-lifecycle -->
## 3. Task Lifecycle

### Create -> Work -> Complete (CLI)

```bash
# Create task
cu create -n "Implement user auth" -l abc123 \
  --priority high \
  --assignee me \
  --tags "feature,backend" \
  --due-date 2026-04-15

# Start working (update status)
cu update taskId --status "in progress"

# Add implementation notes
cu comment taskId -m "Started OAuth2 integration. Using passport.js."

# Mark complete
cu update taskId --status "done"
```

### Bulk Task Creation (MCP)

```typescript
call_tool_chain({
  code: `
    const tasks = await clickup.clickup_create_bulk_tasks({
      listName: "Sprint 12",
      tasks: [
        { name: "Design login page", priority: 2, assignees: ["designer"] },
        { name: "Build login API", priority: 2, assignees: ["backend-dev"] },
        { name: "Write login tests", priority: 3, assignees: ["qa-engineer"] },
        { name: "Deploy login feature", priority: 1, assignees: ["devops"] }
      ]
    });
    console.log('Created', tasks.length, 'tasks');
    return tasks;
  `
});
```

---

<!-- /ANCHOR:task-lifecycle -->
<!-- ANCHOR:workspace-discovery -->
## 4. Workspace Discovery

### CLI Approach

```bash
# List all spaces
cu spaces

# List lists in a space
cu lists <spaceId>

# Search for specific tasks
cu search "login feature"
```

### MCP Approach (Full Hierarchy)

```typescript
call_tool_chain({
  code: `
    const ws = await clickup.clickup_get_workspace({
      include_hierarchy: true,
      include_members: true
    });

    // Log workspace structure
    ws.spaces?.forEach(space => {
      console.log('Space:', space.name);
      space.folders?.forEach(folder => {
        console.log('  Folder:', folder.name);
        folder.lists?.forEach(list => {
          console.log('    List:', list.name, '(id:', list.id, ')');
        });
      });
      space.lists?.forEach(list => {
        console.log('  List:', list.name, '(id:', list.id, ')');
      });
    });

    return ws;
  `
});
```

---

<!-- /ANCHOR:workspace-discovery -->
<!-- ANCHOR:cross-tool -->
## 5. Cross-Tool Workflows

### Figma -> ClickUp (Design to Task)

```typescript
call_tool_chain({
  code: `
    // Get design file info
    const file = await figma.figma_get_file({ fileKey: "abc123" });
    const components = await figma.figma_get_file_components({ fileKey: "abc123" });

    // Create implementation tasks for each component
    const componentList = Object.values(components.meta.components);
    const tasks = await clickup.clickup_create_bulk_tasks({
      listName: "Implementation",
      tasks: componentList.slice(0, 10).map(comp => ({
        name: "Implement: " + comp.name,
        description: "Figma component: " + comp.name + "\\nFile: https://figma.com/file/abc123",
        priority: 3,
        tags: ["from-figma"]
      }))
    });

    return { components: componentList.length, tasksCreated: tasks.length };
  `
});
```

### ClickUp -> Git (Task to Branch)

```bash
# Get task name and create a branch
TASK_ID="abc123"
TASK_NAME=$(cu task "$TASK_ID" --json | jq -r '.name' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')
git checkout -b "feature/$TASK_NAME"

# After work, update task
cu update "$TASK_ID" --status "in progress"
cu comment "$TASK_ID" -m "Branch created: feature/$TASK_NAME"
```

---

<!-- /ANCHOR:cross-tool -->
<!-- ANCHOR:documentation -->
## 6. Documentation Workflows (MCP)

### Create Sprint Retrospective

```typescript
call_tool_chain({
  code: `
    const doc = await clickup.clickup_create_document({
      parent: { id: "space_id", type: 4 },
      name: "Sprint 12 Retrospective - 2026-03-08",
      visibility: "PUBLIC",
      content: "## What went well\\n\\n- \\n\\n## What to improve\\n\\n- \\n\\n## Action items\\n\\n- ",
      content_format: "text/md"
    });
    return doc;
  `
});
```

### Create Architecture Decision Record

```typescript
call_tool_chain({
  code: `
    const doc = await clickup.clickup_create_document({
      parent: { id: "space_id", type: 4 },
      name: "ADR-001: Database Selection",
      visibility: "PUBLIC",
      content_format: "text/md",
      content: [
        "## Status\\n\\nProposed",
        "## Context\\n\\nWe need to select a database for the new service.",
        "## Decision\\n\\nTBD",
        "## Consequences\\n\\nTBD"
      ].join("\\n\\n")
    });
    return doc;
  `
});
```

---

<!-- /ANCHOR:documentation -->
<!-- ANCHOR:time-tracking -->
## 7. Time Tracking Workflow (MCP)

```typescript
call_tool_chain({
  code: `
    // Start working on a task
    await clickup.clickup_manage_time_entries({
      action: "start_timer",
      task: "task-id"
    });
    console.log("Timer started");

    // Later: check current timer
    const current = await clickup.clickup_manage_time_entries({
      action: "get_current"
    });
    console.log("Running:", current);

    // Stop timer
    await clickup.clickup_manage_time_entries({
      action: "stop_timer"
    });
    console.log("Timer stopped");
  `
});

// Log manual time entry
call_tool_chain({
  code: `
    await clickup.clickup_manage_time_entries({
      action: "add_entry",
      task: "task-id",
      duration: "2h 30m",
      description: "Code review and refactoring",
      billable: true,
      tags: ["code-review"]
    });
  `
});
```

---

<!-- /ANCHOR:time-tracking -->
<!-- ANCHOR:goal-tracking -->
## 8. Goal Tracking (MCP)

```typescript
call_tool_chain({
  code: `
    // Create Q2 goal
    const goal = await clickup.clickup_manage_goals({
      action: "create",
      name: "Q2 2026 - Ship v2.0",
      dueDate: "2026-06-30",
      color: "#7B68EE"
    });

    // Add key results
    await clickup.clickup_manage_goals({
      action: "create_key_result",
      goalId: goal.id,
      name: "Complete all v2 features",
      type: "percentage",
      stepsStart: 0,
      stepsEnd: 100
    });

    await clickup.clickup_manage_goals({
      action: "create_key_result",
      goalId: goal.id,
      name: "Test coverage above 80%",
      type: "number",
      stepsStart: 0,
      stepsEnd: 80,
      unit: "%"
    });

    return goal;
  `
});
```

---

<!-- /ANCHOR:goal-tracking -->
<!-- ANCHOR:decision-guide -->
## 9. Decision Guide: CLI vs MCP

| Scenario | Use | Why |
|----------|-----|-----|
| Create single task | CLI | `cu create` is fastest |
| Create 5+ tasks | MCP | `create_bulk_tasks` in one call |
| Sprint standup | CLI | `cu summary` is CLI-only |
| Search tasks | CLI | `cu search` with Markdown output |
| Create document | MCP | Documents are MCP-only |
| Track time | MCP | Time tracking is MCP-only |
| Set goals | MCP | Goals are MCP-only |
| Manage webhooks | MCP | Webhooks are MCP-only |
| Chat / messages | MCP | Chat is MCP-only |
| Custom field CRUD | MCP | CLI has basic set/remove only |
| Workspace hierarchy | Either | CLI: `cu spaces` / MCP: `get_workspace` |
| Task update | CLI | `cu update` is faster |

---

<!-- /ANCHOR:decision-guide -->
<!-- ANCHOR:related -->
## 10. Related

- [SKILL.md](../SKILL.md) - Main skill instructions
- [tool_reference.md](./tool_reference.md) - MCP tool reference
- [cli_reference.md](./cli_reference.md) - CLI command reference

<!-- /ANCHOR:related -->

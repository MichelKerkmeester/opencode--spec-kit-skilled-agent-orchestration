---
title: "Checkpoint deletion (checkpoint_delete)"
description: "Covers the checkpoint deletion tool that permanently removes named snapshots with a name-confirmation safety gate."
---

# Checkpoint deletion (checkpoint_delete)

## 1. OVERVIEW

Covers the checkpoint deletion tool that permanently removes named snapshots with a name-confirmation safety gate.

This permanently removes a saved snapshot. You have to type the snapshot name to confirm, which prevents accidental deletions. Once deleted, that snapshot cannot be recovered, so make sure you pick the right one.

---

## 2. CURRENT REALITY

Permanently removes a named checkpoint from the `checkpoints` table. Returns a boolean indicating whether the checkpoint was found and deleted. No confirmation prompt, but the caller must supply a `confirmName` parameter that matches the checkpoint name as a safety gate against accidental deletion. If you delete the wrong checkpoint, it is gone. Use `checkpoint_list` first to verify the name.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/checkpoints.ts` | Checkpoint handler: create, list, restore, delete orchestration |
| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint storage: delete-by-name with `confirmName` safety gate |
| `mcp_server/core/db-state.ts` | Database state management and connection access |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for checkpoint arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `checkpoint_delete` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for checkpoint tools |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-checkpoints.vitest.ts` | Checkpoint handler validation |
| `mcp_server/tests/handler-checkpoints-edge.vitest.ts` | Checkpoint lifecycle edge coverage (create/list/restore/delete) |
| `mcp_server/tests/checkpoints-extended.vitest.ts` | Checkpoint extended tests |
| `mcp_server/tests/checkpoints-storage.vitest.ts` | Checkpoint storage tests |
| `mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts` | Checkpoint lifecycle integration |

---

## 4. SOURCE METADATA

- Group: Lifecycle
- Source feature title: Checkpoint deletion (checkpoint_delete)
- Current reality source: FEATURE_CATALOG.md

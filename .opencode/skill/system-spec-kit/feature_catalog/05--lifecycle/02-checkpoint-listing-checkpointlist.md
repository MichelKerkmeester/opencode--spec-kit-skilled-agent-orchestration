---
title: "Checkpoint listing (checkpoint_list)"
description: "Covers the checkpoint listing tool that returns limit-based metadata for available snapshots."
---

# Checkpoint listing (checkpoint_list)

## 1. OVERVIEW

Covers the checkpoint listing tool that returns limit-based metadata for available snapshots.

This shows you all available snapshots so you can see when each one was taken and what it covers. Think of it like looking at a list of backup dates on your phone before deciding which one to restore from.

---

## 2. CURRENT REALITY

Returns a limit-based list of available checkpoints with metadata: name, creation date, spec folder scope, git branch and compressed snapshot size. The actual snapshot data is not included. Results are ordered by creation date, most recent first. The runtime exposes `limit` for truncation, but no offset, page, or cursor parameter. Default limit is 50, maximum 100. You can filter by spec folder to see only checkpoints that cover a specific area.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/checkpoints.ts` | Checkpoint handler: create, list, restore, delete orchestration |
| `mcp_server/lib/storage/checkpoints.ts` | Checkpoint storage: listing query, metadata projection, limit clamping |
| `mcp_server/core/db-state.ts` | Database state management and connection access |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for checkpoint arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `checkpoint_list` |
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
- Source feature title: Checkpoint listing (checkpoint_list)
- Current reality source: FEATURE_CATALOG.md

---
title: "Namespace management CRUD tools (shared-memory lifecycle)"
description: "Tracks the shared-memory lifecycle tools that provide workspace-level scoping beyond `specFolder` with deny-by-default membership."
---

# Namespace management CRUD tools (shared-memory lifecycle)

## 1. OVERVIEW

Four shipped tools provide workspace-level scoping beyond per-spec-folder filtering. They live under the `/memory:manage shared` command and implement a deny-by-default membership model for multi-tenant shared-memory spaces. The subsystem is opt-in: disabled by default and activated via `shared_memory_enable`.

---

## 2. CURRENT REALITY

**SHIPPED.** All 4 tools are live at L5 under `/memory:manage shared`:

- **`shared_space_upsert`** -- Creates or updates a shared-memory space. Requires `spaceId`, `tenantId`, and `name`. `actorUserId` and `actorAgentId` are optional corroboration hints, not the authority for the mutation. If a hint is supplied, at most one may be provided and it must match the single shared-memory admin identity configured on the server. Supports optional rollout parameters (`rolloutEnabled`, `rolloutCohort`, `killSwitch`). The first successful create for a new space auto-grants `owner` access to that server-configured admin identity. Later updates require that same identity to already hold `owner` access.

- **`shared_space_membership_set`** -- Controls user/agent access with a deny-by-default model. Requires `spaceId`, `tenantId`, `subjectType` (`user` or `agent`), `subjectId`, and `role` (`owner`, `editor`, or `viewer`). `actorUserId` and `actorAgentId` remain optional corroboration hints only; when present, at most one may be sent and it must match the server-configured shared-memory admin identity that actually authorizes the mutation. That admin identity must already own the target space. This tool manages individual-level membership, not spec-folder participation.

- **`shared_memory_status`** -- Reports whether shared memory is enabled and which shared-space IDs are accessible for the provided scope. Accepts optional scope filters: `tenantId`, `userId`, `agentId`. Returns `enabled`, `allowedSharedSpaceIds`, and the echoed scope IDs.

- **`shared_memory_enable`** -- Activates the opt-in shared-memory subsystem. Creates infrastructure tables, persists enablement in the database, and generates a README in `shared-spaces/`. This is the required first step before any other shared-memory operations.

The original full namespace CRUD (`list/create/switch/delete`) for complete multi-tenant isolation remains deferred pending demonstrated demand. Current scoping relies on logical `specFolder` filtering augmented by the shared-memory tools above.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/shared-memory.ts` | Handler | Shared-memory handler dispatch |
| `mcp_server/lib/collab/shared-spaces.ts` | Lib | Shared-space storage and membership logic |
| `mcp_server/lib/config/capability-flags.ts` | Lib | Feature capability flags including shared-memory enablement |
| `mcp_server/tool-schemas.ts` | Core | Tool schema definitions (4 shared-memory tools) |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input schemas for shared-memory tools |
| `mcp_server/tools/lifecycle-tools.ts` | API | Tool dispatcher including shared-memory lifecycle routing |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/shared-memory-handlers.vitest.ts` | Shared-memory handler validation |
| `mcp_server/tests/shared-spaces.vitest.ts` | Shared-space storage and membership tests |

### Command Definition

| File | Role |
|------|------|
| `.opencode/command/memory/manage.md` | `/memory:manage shared` command: subcommand routing, enablement check, create/member/status workflows |

---

## 4. SOURCE METADATA

- Group: Lifecycle (L5)
- Source feature title: Namespace management CRUD tools
- Current reality source: `.opencode/command/memory/manage.md` frontmatter and README.txt tool coverage matrix

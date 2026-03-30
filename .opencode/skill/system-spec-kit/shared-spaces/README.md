# Shared Memory Spaces

> Collaborative memory sharing between users and agents.

## Status

Shared memory has been **enabled** for this workspace.

## Key Concepts

- **Spaces** — Named containers for shared memories, scoped to a tenant.
- **Membership** — Deny-by-default: users and agents must be explicitly granted access (owner, editor, or viewer).
- **Rollout** — Each space has independent rollout and kill-switch controls.
- **Conflicts** — Concurrent edits produce append-version conflicts with automatic escalation to manual merge for repeat or high-risk cases.

## Management Commands

| Command | Description |
|---------|-------------|
| `/memory:manage shared status` | View rollout state and accessible spaces |
| `/memory:manage shared create <spaceId> <tenantId> <name>` | Create or update a shared space; first creator becomes owner |
| `/memory:manage shared member <spaceId> <type> <id> <role>` | Set membership; caller must already own the space |
| `/memory:manage shared enable` | Re-run first-time setup (idempotent) |

## Environment Overrides

Set `SPECKIT_MEMORY_SHARED_MEMORY=true` to force-enable shared memory regardless of database state.

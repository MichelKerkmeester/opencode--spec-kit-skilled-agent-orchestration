---
title: "Shared Memory Spaces"
description: "Documentation-only directory for the shared-memory lifecycle surfaced by MCP tools."
trigger_phrases:
  - "shared memory spaces"
  - "shared space tools"
  - "shared memory enable"
---

# Shared Memory Spaces

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. IMPLEMENTED STATE](#2--implemented-state)
- [3. MCP TOOL SURFACE](#3--mcp-tool-surface)
- [4. AUTH NOTE](#4--auth-note)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`shared-spaces/` is a documentation-only directory. The runtime implementation lives in `../handlers/shared-memory.ts` and `../lib/collab/shared-spaces.ts`.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE

- Shared spaces are tenant-scoped, deny-by-default collaboration containers.
- Roles are `owner`, `editor`, and `viewer`.
- Conflict handling defaults to append-version behavior, with escalation to manual merge for repeat or high-risk conflicts.
- `shared_memory_enable` bootstraps the shared-memory subsystem and generates this README if it is missing.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:mcp-tool-surface -->
## 3. MCP TOOL SURFACE

| Tool | What it does |
|---|---|
| `shared_memory_enable` | First-run bootstrap and idempotent enablement |
| `shared_memory_status` | Caller-scoped rollout and membership view; requires exactly one actor identity |
| `shared_space_upsert` | Create or update a shared space; requires caller auth and tenant scope |
| `shared_space_membership_set` | Set deny-by-default membership for a user or agent; requires caller auth and tenant scope |

<!-- /ANCHOR:mcp-tool-surface -->
<!-- ANCHOR:auth-note -->
## 4. AUTH NOTE

`shared_memory_status`, `shared_space_upsert`, and `shared_space_membership_set` rely on actor identity validation in `handlers/shared-memory.ts`. Admin mutations compare the caller against the configured shared-memory admin identity before allowing ownership-sensitive changes.
<!-- /ANCHOR:auth-note -->

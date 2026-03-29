---
title: "Shared Memory End-to-End Architecture and Source Map"
description: "Documents the implemented shared-memory flow from enablement through shared-space creation, membership, governed write visibility, query filtering, kill-switch behavior, and conflict recording."
---

# Shared Memory End-to-End Architecture and Source Map

This document captures the implemented behavior, source references, and remediation metadata for the shared-memory collaboration path spanning enablement, space administration, governed save, scoped retrieval, and conflict recording.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Shared memory is a mutation-plus-retrieval feature, not a standalone folder-based subsystem. The live flow starts with lifecycle tools that enable the feature and administer shared spaces, then continues through governed `memory_save` writes and `memory_search` scope filtering.

The implementation is deny-by-default. A space must be enabled at runtime, created for a tenant, assigned memberships, and rolled out before collaborators can see shared rows in search. Per-space kill switches and conflict records are persisted in SQLite and audited through the governance layer.

## 2. CURRENT REALITY

### End-to-end flow

| Stage | Current Reality |
|---|---|
| Enable | `shared_memory_enable` is dispatched from `mcp_server/tools/lifecycle-tools.ts` and validated by `tool-input-schemas.ts` as an empty-input tool. `handleSharedMemoryEnable()` ensures the shared-collaboration schema exists, persists `config.shared_memory_enabled = 'true'`, and creates `mcp_server/shared-spaces/README.md` if missing. Runtime enablement is resolved by `isSharedMemoryEnabled()` with priority order: explicit env disable, explicit env enable, then DB config. Default is OFF until one of those enables it. |
| Space creation | `shared_space_upsert` is the space create/update entry point. It refuses to run unless shared memory is enabled. Admin identity is server-owned, not caller-owned: the handler resolves exactly one configured admin from `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` or `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID`, and caller hints may only corroborate that identity. New spaces are inserted into `shared_spaces`; updates require owner-level access to the existing space. Create-vs-update is now determined from the insert result, not the pre-read snapshot: the create path uses `INSERT ... ON CONFLICT(space_id) DO NOTHING RETURNING`, and owner bootstrap runs only when that insert actually created the row. If another request wins a concurrent create for the same `space_id`, the losing request falls through to the update path and skips owner bootstrap, so concurrent creates converge to exactly one owner row. |
| Membership | `shared_space_membership_set` also requires shared memory to be enabled and the server-configured admin identity to pass owner access checks. Membership rows are stored in `shared_space_members` keyed by `(space_id, subject_type, subject_id)` and assign one of `owner`, `editor`, or `viewer`. This is the deny-by-default boundary for collaboration. |
| Governed shared writes | Shared memory does not have a separate write handler. The actual content write path is `memory_save`. When `sharedSpaceId` is supplied, `memory_save` first runs governed-ingest validation, then calls `assertSharedSpaceAccess(..., 'editor')`. If access passes, the new memory row is written normally and then patched with governance fields including `tenant_id`, `user_id` or `agent_id`, `session_id`, `shared_space_id`, provenance fields, retention policy, and serialized governance metadata. |
| Query visibility | Shared search visibility is enforced in the retrieval pipeline, not by a dedicated shared-memory query service. `memory_search` accepts tenant/user/agent/session/shared-space scope values and passes them into pipeline config. Stage 1 candidate generation computes `allowedSharedSpaceIds` with `getAllowedSharedSpaceIds()` and filters every candidate set through `filterRowsByScope()`. For shared rows, visibility depends on tenant match plus membership in an allowed space; exact actor/session match is intentionally not required once the row belongs to an allowed shared space. That is what makes collaborator A's shared rows visible to collaborator B inside the same shared space. |
| Kill switch and rollout | Shared spaces carry both `rollout_enabled` and `kill_switch`. `getAllowedSharedSpaceIds()` only returns spaces for the caller's tenant and membership where `rollout_enabled = 1` and `kill_switch = 0`. `assertSharedSpaceAccess()` denies viewer/editor access when rollout is off or the kill switch is on. Owner-level administrative checks intentionally bypass those availability gates so an owner/admin can still repair, reconfigure, or reopen a space. |
| Conflict handling | Conflict recording happens after a successful shared `memory_save`, not during space administration. Once the new row exists and governance metadata is applied, `memory_save` looks for another row in the same `shared_space_id` with the same `file_path` and a different ID. If found, it calls `recordSharedConflict()`, which writes an append-only row into `shared_space_conflicts` and also records a `shared_conflict` governance audit event. Strategy resolution defaults to `append_version`, but escalates to `manual_merge` for repeat conflicts or high-risk conflict kinds such as `destructive_edit`, `schema_mismatch`, and `semantic_divergence`. Explicit metadata can request another strategy, but only if it matches the validated strategy union. |

### Directory reality check

| Path | Current Reality |
|---|---|
| `mcp_server/shared/` | This is a symlink to `.opencode/skill/system-spec-kit/shared/dist`. It is generic shared build output and utilities, not the shared-memory feature implementation. |
| `mcp_server/shared-spaces/` | This is currently docs-only. The directory contains `README.md`, which `shared_memory_enable` creates or preserves as first-run documentation. It is not where the live shared-memory logic executes. |

The actual shared-memory implementation lives across `handlers/shared-memory.ts`, `lib/collab/shared-spaces.ts`, `handlers/memory-save.ts`, `handlers/memory-search.ts`, `lib/governance/scope-governance.ts`, and the shared-space schema definitions in `lib/search/vector-index-schema.ts`.

### Storage model

| Store | Current Reality |
|---|---|
| `config` table | Stores the persisted feature toggle as `shared_memory_enabled = 'true'` for DB-backed enablement. |
| `shared_spaces` table | Stores per-space tenant binding, display name, rollout state, rollout cohort, kill switch, metadata, and timestamps. |
| `shared_space_members` table | Stores deny-by-default membership assignments for users and agents with `owner`/`editor`/`viewer` roles. |
| `shared_space_conflicts` table | Stores append-only conflict records for shared writes, including strategy, actor, logical key, and optional metadata. |
| `memory_index` governance columns | Shared writes ultimately live in the normal memory index. Shared visibility depends on governed columns such as `tenant_id`, `user_id`, `agent_id`, `session_id`, `shared_space_id`, `retention_policy`, `delete_after`, and `governance_metadata`. |
| `governance_audit` table | Records allow/deny/conflict events for shared-space access, admin mutations, governed ingest, and shared conflict outcomes. |

### Tool surface and control plane

The exposed shared-memory control plane is currently four lifecycle tools:

- `shared_memory_enable`
- `shared_memory_status`
- `shared_space_upsert`
- `shared_space_membership_set`

`shared_memory_status` reports whether shared memory is enabled and returns the caller-visible `allowedSharedSpaceIds` for the supplied tenant/user/agent scope. Input validation for all four tools lives in `mcp_server/schemas/tool-input-schemas.ts`.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/shared-memory.ts` | Handler | Implements shared-memory enable, status, space upsert, membership set, admin identity resolution, and README bootstrap |
| `mcp_server/lib/collab/shared-spaces.ts` | Collaboration Lib | Implements runtime enable checks, race-safe shared-space persistence (`createSharedSpaceIfAbsent()` plus update UPSERT), membership persistence, allowed-space enumeration, access enforcement, rollout metrics, and conflict strategy resolution |
| `mcp_server/lib/search/vector-index-schema.ts` | Schema | Creates governance columns plus the `shared_spaces`, `shared_space_members`, and `shared_space_conflicts` tables and indexes |
| `mcp_server/handlers/memory-save.ts` | Mutation Handler | Applies governed-ingest validation, enforces editor access for shared writes, persists shared governance metadata, and records shared conflicts after save |
| `mcp_server/lib/governance/scope-governance.ts` | Governance Lib | Normalizes scope, validates governed ingest, builds post-insert governance fields, records governance audits, and filters rows by shared-space scope rules |
| `mcp_server/handlers/memory-search.ts` | Retrieval Handler | Accepts shared scope inputs and forwards them into the retrieval pipeline for shared visibility enforcement |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Retrieval Pipeline | Computes allowed shared-space IDs and applies `filterRowsByScope()` across candidate sets, including injected channels |
| `mcp_server/tools/lifecycle-tools.ts` | Tool Dispatch | Publishes the shared-memory tool names and routes validated lifecycle tool calls to the shared-memory handlers |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema Validation | Defines the public argument contracts for enable, status, space upsert, and membership mutation tools |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/shared-memory-handlers.vitest.ts` | Admin identity resolution, owner bootstrap, stale concurrent-create handling, membership mutation, and README bootstrap |
| `mcp_server/tests/shared-spaces.vitest.ts` | Deny-by-default access, rollout/kill-switch gating, and shared conflict persistence |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Public tool input contract for enable, space upsert, and membership mutation |
| `mcp_server/tests/memory-governance.vitest.ts` | Shared-scope filtering and governance row visibility |
| `mcp_server/tests/stage1-expansion.vitest.ts` | Stage-1 filtering through allowed shared-space IDs |

## 4. SOURCE METADATA

- Group: Mutation
- Source feature title: Shared Memory End-to-End Architecture and Source Map
- Current reality source: direct implementation audit plus the listed handler, scope, and rollout/access tests

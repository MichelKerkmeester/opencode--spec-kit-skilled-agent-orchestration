---
title: "Shared-memory rollout, deny-by-default membership, and kill switch"
description: "Shared-memory rollout controls access to shared spaces through deny-by-default membership, an immediate kill switch for incident response, and a disabled-by-default subsystem requiring explicit first-run setup."
---

# Shared-memory rollout, deny-by-default membership, and kill switch

## 1. OVERVIEW

Shared-memory rollout controls access to shared spaces through deny-by-default membership, an immediate kill switch for incident response, and a disabled-by-default subsystem requiring explicit first-run setup.

Shared memory spaces let multiple users or agents access the same pool of knowledge. This feature makes sure nobody gets access unless they are explicitly granted membership, and it includes an emergency "off" switch that immediately blocks everyone if something goes wrong. The entire subsystem is disabled by default and requires explicit enablement via `shared_memory_enable` or the `/memory:manage shared` command's first-run setup flow. Think of it as a shared office with a keycard lock: the office is locked until the building manager activates it, then only people on the list get in, and management can lock it down instantly in an emergency.

---

## 2. CURRENT REALITY

Phase 6 introduced shared-memory spaces with governance-first rollout controls. Access is deny-by-default: a caller can use a shared space only when explicit membership exists for the current identity.

**Default-off enablement (two-tier):** The subsystem is disabled by default. Enablement is resolved via a two-tier check:
1. **Tier 1 (env var override):** `SPECKIT_MEMORY_SHARED_MEMORY=true` or `SPECKIT_HYDRA_SHARED_MEMORY=true` force-enables the subsystem regardless of DB state.
2. **Tier 2 (DB config persistence):** The `shared_memory_enabled` key in the `config` table persists enablement across restarts. Set by `shared_memory_enable` tool or `/memory:manage shared enable`.

The `/memory:manage shared` command includes a first-run enablement gate: when shared memory is not enabled, the command prompts the user to complete setup before routing to any subcommand. Setup creates infrastructure tables, persists the enablement flag, and generates a README in `shared-spaces/`.

Rollout is controlled per space and supports immediate kill-switch behavior. Even previously authorized members are blocked when the kill switch is enabled, providing a hard operational stop for incident response or controlled rollback.

Shared-memory handlers and lifecycle tools use the same membership and rollout checks so save, search and status flows enforce one consistent governance boundary. When a row belongs to an allowed shared space, retrieval now treats membership as the access boundary: tenant alignment is still required, but exact actor and session matching are skipped so collaborator B can retrieve collaborator A's shared memories inside the same space.

`shared_space_upsert()` also preserves rollout cohort and metadata on partial updates. The UPSERT keeps existing values via `COALESCE(excluded.rollout_cohort, rollout_cohort)` and the same pattern for `metadata`, so renaming a space or toggling rollout flags no longer clears previously stored cohort labels or structured metadata.

Concurrent create safety is now explicit in the same governance path. `handleSharedSpaceUpsert()` no longer trusts the pre-read existence snapshot to decide whether a request created the space. Instead, the create branch uses `INSERT ... ON CONFLICT(space_id) DO NOTHING RETURNING`, and only the request whose insert actually returns a row reports `created: true` and bootstraps the initial `owner` membership. A losing concurrent create for the same `space_id` is reclassified as an update and skips owner bootstrap, which keeps deny-by-default membership intact and guarantees exactly one owner row after the race resolves.

Admin identity governance, including server-configured admin actor resolution and deny-on-ambiguous-config behavior, is documented separately in `06-shared-memory-admin-identity-governance.md`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/collab/shared-spaces.ts` | Lib | Shared-space definitions, race-safe create-if-absent plus update persistence, membership checks, rollout/kill-switch controls, `isSharedMemoryEnabled()` two-tier check, `enableSharedMemory()` DB persistence |
| `mcp_server/handlers/shared-memory.ts` | Handler | Shared-memory status/enable/upsert/membership handlers, concurrent-create owner-bootstrap gating, README generation |
| `mcp_server/handlers/memory-save.ts` | Handler | Enforces editor-level shared-space access before governed shared-memory saves and records deny decisions in the governance audit trail |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Lib | Applies allowed shared-space filtering during retrieval so search results stay within the caller's shared-space membership and rollout state |
| `mcp_server/tools/lifecycle-tools.ts` | Tool | Shared-space lifecycle operations including `shared_memory_enable` dispatch |
| `mcp_server/tool-schemas.ts` | Core | Shared-space tool contracts (4 tools: upsert, membership_set, status, enable) |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Zod input validation schemas and `ALLOWED_PARAMETERS` for all 4 shared-memory tools |
| `mcp_server/handlers/index.ts` | Handler | Re-exports `handleSharedMemoryEnable` |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/shared-memory-e2e.vitest.ts` | End-to-end enablement, deny-by-default membership and env kill-switch behavior |
| `mcp_server/tests/shared-memory-handlers.vitest.ts` | Handler-level enable, upsert, concurrent-create single-owner behavior, membership mutation and governance-audit coverage |
| `mcp_server/tests/shared-spaces.vitest.ts` | Deny-by-default membership, kill-switch enforcement, default-off verification, DB enablement persistence, env-var override, idempotent enable |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Shared-memory rollout, deny-by-default membership, and kill switch
- Current reality source: Phase 015 implementation + default-off enablement update

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenarios 123, 148

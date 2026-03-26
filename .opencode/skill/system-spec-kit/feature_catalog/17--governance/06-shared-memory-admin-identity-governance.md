---
title: "Shared-memory admin-identity governance"
description: "Shared-memory admin mutations are bound to a server-configured admin identity, reject ambiguous configuration, and expose actor-hint contracts through both JSON tool schemas and strict Zod validation."
---

# Shared-memory admin-identity governance

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Shared-memory admin-identity governance binds shared-space mutations to a single server-configured admin identity, rejects ambiguous configuration, and exposes that contract through the shared-memory tool schemas.

In practice, this means shared-space creation and membership changes do not trust arbitrary caller-supplied actor IDs. The server decides which admin identity is authoritative, and the request can only corroborate that identity within the allowed contract. The result is a stricter control plane for shared-memory governance: one configured admin, one mutation identity, and explicit failure when configuration or actor hints are ambiguous.

---

## 2. CURRENT REALITY

`resolveAdminActor()` is the core enforcement point for shared-memory admin mutations. Both `shared_space_upsert` and `shared_space_membership_set` call it before making changes, and the function resolves the acting subject exclusively from MCP server environment configuration: `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` or `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID`.

The server is intentionally fail-closed on configuration ambiguity. If neither admin env var is configured, the handler returns `E_AUTHORIZATION` with reason `shared_memory_admin_unconfigured`. If both are configured at once, the handler returns `E_INTERNAL` with reason `shared_memory_admin_ambiguous` and instructs the operator to keep exactly one configured identity.

Caller hints are optional corroboration inputs, not the source of truth. The tool contracts for `shared_space_upsert` and `shared_space_membership_set` expose `actorUserId` and `actorAgentId` as optional parameters, and both the JSON schemas and strict Zod schemas document that these fields are hints only. At both the schema and handler layers, requests that send both fields together are rejected as ambiguous rather than silently resolved.

When the configured admin is a user, `resolveAdminActor()` also rejects hint mismatches. A supplied `actorAgentId`, or an `actorUserId` that does not equal the configured user admin, returns `E_AUTHORIZATION` with reason `shared_memory_admin_identity_mismatch`. On success, the handler executes the mutation as the configured admin identity and returns that resolved subject in the response payload.

This identity resolution is tied directly into shared-space governance. `handleSharedSpaceUpsert()` and `handleSharedSpaceMembershipSet()` build owner-level scope from the resolved admin actor, run `assertSharedSpaceAccess(...)`, and write allow/deny records through `recordGovernanceAudit(...)` using action `shared_space_admin`. New shared spaces also bootstrap the resolved admin as the initial `owner`, so creation establishes both the space and its governing owner identity in the same flow.

The schema surface is aligned across both tool-definition and runtime-validation layers. `tool-schemas.ts` defines the public MCP contract and marks the actor fields as optional admin hints; `tool-input-schemas.ts` mirrors those parameters in strict Zod schemas and in `ALLOWED_PARAMETERS`, so the same actor-governance inputs are recognized consistently by schema validation and tool dispatch.

One implementation detail is worth noting as current reality: the deny-on-mismatch branch is explicit for the configured-user path, while the configured-agent path returns the configured agent actor without a corresponding single-hint equality check. The public schema descriptions still present both actor fields as corroboration hints that must match the configured admin when provided.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/shared-memory.ts` | Handler | Resolves the authoritative admin actor, fails closed on missing or ambiguous config, gates shared-space mutations, bootstraps owner membership, and records `shared_space_admin` allow/deny audit rows |
| `mcp_server/tool-schemas.ts` | Core | Defines `shared_space_upsert` and `shared_space_membership_set` tool contracts, including optional actor-hint parameters and their admin-identity descriptions |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Enforces strict Zod validation for shared-memory admin fields, rejects dual actor hints, and keeps `ALLOWED_PARAMETERS` aligned with the tool surface |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/shared-memory-handlers.vitest.ts` | Shared-memory handler authorization and governance-audit behavior |

---

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Shared-memory admin-identity governance
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of shared-memory admin identity resolution, tool contracts, and runtime validation

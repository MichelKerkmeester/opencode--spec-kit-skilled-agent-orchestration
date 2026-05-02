# Iteration 012: Shared memory and governance

## Findings

### [P0] Shared-space admin mutations run as a global server admin with no caller authentication
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`

**Issue**: `handleSharedSpaceUpsert()` and `handleSharedSpaceMembershipSet()` do not authenticate the actual MCP caller before performing tenant-scoped mutations. Both handlers call `resolveAdminActor()` and then execute with the server-configured admin identity even when the request omits actor hints entirely. That turns the tool surface itself into an admin capability: any caller who can invoke these tools can create a space in any tenant, bootstrap the configured admin as owner, and then rewrite memberships through that owner identity.

**Evidence**:
- Both mutation handlers resolve the actor exclusively from server configuration before any caller binding check at [`shared-memory.ts:280-284`](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L280) and [`shared-memory.ts:440-444`](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L440).
- New-space creation does not require pre-existing ownership; it immediately bootstraps the resolved actor as owner at [`shared-memory.ts:351-358`](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L351).
- The input schema explicitly allows `actorUserId` / `actorAgentId` to be omitted for both mutation tools; it only rejects sending both at once at [`tool-input-schemas.ts:437-475`](../../../../../../skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L437).
- Existing tests codify the unauthenticated path: omitted actor hints still succeed and are mapped to the configured server admin at [`shared-memory-handlers.vitest.ts:258-269`](../../../../../../skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts#L258) and [`shared-memory-handlers.vitest.ts:286-302`](../../../../../../skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts#L286).

**Fix**: Stop deriving mutation authority from server-owned environment variables alone. Bind these tools to authenticated transport/session identity, require that identity to match the configured admin or a tenant-scoped owner, and reject omitted actor identities unless the MCP layer itself injects a verified caller principal that the handler can trust.

### [P1] `shared_memory_status` trusts spoofable principal IDs and leaks shared-space membership topology
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`

**Issue**: `handleSharedMemoryStatus()` accepts arbitrary `tenantId`, `userId`, and `agentId` values from the request and passes them straight into `getAllowedSharedSpaceIds()`. There is no authentication, corroboration, or admin gate on whose status is being queried. A caller who knows or can guess a tenant/principal identifier can enumerate that principal's visible shared-space IDs.

**Evidence**:
- The handler returns `allowedSharedSpaceIds` directly from caller-supplied scope at [`shared-memory.ts:533-549`](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L533).
- The public argument type exposes raw `tenantId`, `userId`, and `agentId` with no required actor or ownership field at [`types.ts:214-217`](../../../../../../skill/system-spec-kit/mcp_server/tools/types.ts#L214).
- The validation schema accepts those fields verbatim and adds no authorization constraints at [`tool-input-schemas.ts:476-480`](../../../../../../skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L476).
- `getAllowedSharedSpaceIds()` will return real shared-space IDs for any matching tenant/principal pair, so once a caller supplies a valid identity tuple the handler exposes that principal's accessible spaces at [`shared-spaces.ts:450-486`](../../../../../../skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L450).

**Fix**: Resolve status scope from the authenticated caller instead of request body fields. If cross-principal inspection is required for operators, add a distinct admin-only endpoint that requires verified admin identity and records both the actor and the inspected subject in audit metadata.

### [P2] Global shared-memory enablement is an unauthenticated lifecycle mutation
**File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts`

**Issue**: `handleSharedMemoryEnable()` permanently flips the workspace-level `shared_memory_enabled` config flag and creates the shared-spaces README without any tenant scope, actor scope, or admin authorization check. Any caller with tool access can therefore turn on a cross-tenant collaboration subsystem for the whole workspace.

**Evidence**:
- The enable handler accepts an untyped empty argument object and performs the lifecycle mutation immediately at [`shared-memory.ts:568-607`](../../../../../../skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L568).
- The tool schema for `shared_memory_enable` is empty, so there is no caller identity or confirmation input available to the handler at [`tool-input-schemas.ts:476-481`](../../../../../../skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L476).
- Unlike the mutation handlers above, this path does not call `resolveAdminActor()` or any other authorization helper before persisting the config flag.

**Fix**: Treat enablement as an administrative lifecycle action. Require a verified admin principal, or move first-run initialization behind deployment/config management instead of exposing it as a general MCP tool.

## Summary
P0: 1, P1: 1, P2: 1.

I did not find a handler-local conflict resolution bug in this file. The concrete governance problems here are all authorization and lifecycle related: mutation authority is derived from server config instead of caller identity, status inspection trusts spoofable scope fields, and subsystem enablement is globally mutable without an admin check.

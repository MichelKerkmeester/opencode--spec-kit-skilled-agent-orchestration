# Iteration 005: Security Audit

## Findings

### SEC-001
- Severity: High
- Title: Shared-space admin tools trust caller-supplied actor identities
- File:line: `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:35-39,40-85,222-226,243-249,382-393`; `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:421-448,449-474`
- Evidence: The handler explicitly states it only validates actor format and that transport authentication "MUST verify that the caller is the claimed actor before this handler is reached." In practice, `resolveAdminActor()` only enforces "exactly one of actorUserId/actorAgentId" and returns that value as the admin identity. Both `shared_space_upsert` and `shared_space_membership_set` then authorize owner actions against `buildAdminScope(actor, ...)` using that caller-supplied identity. The public schemas expose `actorUserId` and `actorAgentId` directly to the tool caller.
- Impact: Any caller that can reach these tools can impersonate an existing owner by supplying that owner's subject ID, then update shared-space settings or grant memberships/roles. In governed/shared-memory deployments this breaks the intended auth boundary between callers and tenant/shared-space administration.
- Fix: Bind the admin actor to authenticated transport/session context on the server side and stop trusting caller-supplied actor IDs for authorization. If explicit actor fields must remain for audit metadata, verify they match the authenticated principal before performing owner checks.

### SEC-002
- Severity: High
- Title: Checkpoint tools bypass tenant and shared-space isolation by operating on global state
- File:line: `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:277-296`; `.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:21-35`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:194-205`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:56-79,97-119,466-497`
- Evidence: The checkpoint schemas only accept `name`, optional `specFolder`, `limit`, and `clearExisting`; there are no `tenantId`, `userId`, `agentId`, or `sharedSpaceId` boundaries. The checkpoint tool dispatcher forwards those arguments directly to the handlers. `handleCheckpointRestore()` restores a named checkpoint with no authorization or scope checks. In storage, the checkpoint manifest includes global tables such as `governance_audit`, `shared_spaces`, `shared_space_members`, `session_state`, and `session_sent_memories`, and `selectTableRows()` falls back to `SELECT * FROM <table>` whenever `specFolder` is omitted.
- Impact: Any caller with access to checkpoint tools can snapshot, list, and restore cross-tenant/shared-space state rather than only their own scope. In a governed deployment, this enables bulk data exposure and rollback of other tenants' memory, governance, and membership state.
- Fix: Treat checkpoint tools as privileged admin-only operations, or require explicit authenticated scope parameters and enforce them in both snapshot and restore paths. At minimum, disable global checkpoint operations when governed/shared-memory features are enabled.

### SEC-003
- Severity: High
- Title: `memory_match_triggers` fails open when scope filtering errors occur
- File:line: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:287-322`
- Evidence: After trigger matching, scoped callers are post-filtered against `memory_index` rows. However, the entire scope-filter block is wrapped in `try/catch`, and the catch path logs `"Scope filtering failed, returning unscoped results"` before continuing. That means any database/schema/runtime failure in the authorization filter path results in the original unfiltered matches being returned to the caller.
- Impact: A transient DB issue, migration mismatch, or other runtime error in the filter path turns a scoped retrieval request into an unscoped one, potentially exposing memories from other tenants, users, agents, or shared spaces.
- Fix: Fail closed. On scope-filter failure, return an error (or an empty result set) instead of the original matches, and treat the filter as part of authorization rather than optional post-processing.

### SEC-004
- Severity: Medium
- Title: Shared-memory handlers echo raw internal exception messages to callers
- File:line: `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:185-199,352-358,459-465,494-499,551-556`
- Evidence: `createSharedMemoryInternalError()` converts any thrown exception into `error: "<prefix>: <message>"` and returns it to the caller as `E_INTERNAL`. Multiple shared-memory handlers use this helper in their top-level `catch` blocks. Because the raw `error.message` is reflected verbatim, downstream SQLite/runtime errors can be surfaced to clients.
- Impact: Internal error text can disclose implementation details such as table names, SQL problems, rollout state, or filesystem/runtime specifics that should remain server-side. This materially improves recon for an attacker probing the shared-memory boundary.
- Fix: Return a generic client-facing internal error and keep raw exception details in server-side logs only, ideally with structured redaction for tenant IDs, subject IDs, and SQL strings.

### SEC-005
- Severity: Medium
- Title: Duplicate-content detection performs unbounded read-and-hash work over all markdown files
- File:line: `.opencode/skill/system-spec-kit/scripts/dist/core/file-writer.js:123-155`
- Evidence: `checkForDuplicateContent()` reads the full directory listing for `contextDir`, keeps every `*.md` except the current filename, then sequentially reads and hashes each file until it finds a match. There is no cap on file count, file size, or total work.
- Impact: A directory populated with many or very large markdown files can force the script into expensive synchronous I/O and hashing, creating an easy resource-exhaustion path during memory/spec generation workflows.
- Fix: Bound duplicate checking by file count, total bytes, and/or elapsed time; skip oversized files; and consider using metadata or incremental indexes instead of full-content hashing of every candidate on each write.

## Summary

I found five concrete issues.

The strongest problems are authorization-boundary failures in shared-memory administration and checkpoint handling. Shared-space admin actions currently trust caller-supplied actor IDs, and checkpoint tools operate on global state without any tenant or shared-space scoping. I also found a fail-open authorization path in `memory_match_triggers`, where scope-filter failures return unscoped results instead of failing closed.

On the exposure/DoS side, shared-memory handlers reflect raw internal exception messages back to callers, and `scripts/dist/core/file-writer.js` performs unbounded duplicate-file scanning that can be abused for resource exhaustion.

I did not find a concrete `eval`/`Function` injection sink in the reviewed runtime paths. For path traversal, the active file-path handling I inspected (`memory_save`, ingest, generated-context helpers, and shared path validation) appears intentionally hardened via containment checks and realpath-based validation. Also, `shared/dist/` was not present in this checkout, so I reviewed the in-use shared path-security utility that these components rely on instead.

## JSONL

```jsonl
{"type":"iteration","run":5,"mode":"review","dimensions":["security"],"findings":[{"id":"SEC-001","severity":"High"},{"id":"SEC-002","severity":"High"},{"id":"SEC-003","severity":"High"},{"id":"SEC-004","severity":"Medium"},{"id":"SEC-005","severity":"Medium"}]}
```

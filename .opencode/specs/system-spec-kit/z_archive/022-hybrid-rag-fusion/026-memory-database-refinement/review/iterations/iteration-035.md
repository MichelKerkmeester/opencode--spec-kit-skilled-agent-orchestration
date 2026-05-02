# Iteration 035: Security implementation review (iteration 5)

**Dimension:** Security — Implementation security review
**Files reviewed:**
- `mcp_server/handlers/shared-memory.ts`
- `mcp_server/handlers/pe-gating.ts`
- `mcp_server/lib/errors.ts` (barrel) and `mcp_server/lib/errors/` (core.ts, recovery-hints.ts, index.ts)
- `mcp_server/handlers/memory-save.ts`
- `mcp_server/handlers/checkpoints.ts`

---

## Findings

### [P1] Caller-supplied actor IDs are trusted as the authentication identity — admin and owner checks are bypassable

**File:** `mcp_server/handlers/shared-memory.ts`

**Issue:**
`validateSharedCallerIdentity()` and `validateCallerAuth()` accept `actorUserId` / `actorAgentId` directly from the tool call arguments as the caller's identity. Admin status is then derived purely by comparing these caller-supplied values against `SPECKIT_SHARED_MEMORY_ADMIN_USER_ID` / `SPECKIT_SHARED_MEMORY_ADMIN_AGENT_ID` (lines 201–212). Owner/editor membership checks in `assertSharedSpaceAccess()` also resolve from the same caller-provided fields. There is no binding between those argument fields and a server-authenticated session principal. Any MCP client that can invoke these tools can impersonate the configured admin or an existing owner by sending the matching subject ID.

**Evidence:**
- `shared-memory.ts:143-179` — `validateSharedCallerIdentity()` takes the actor identity from raw args.
- `shared-memory.ts:201-212` — admin flag derived entirely by comparing caller-supplied `subjectId` to `process.env.SPECKIT_SHARED_MEMORY_ADMIN_USER_ID`.
- `shared-memory.ts:400-404` — `handleSharedSpaceUpsert` passes `args.actorUserId` / `args.actorAgentId` directly into `validateCallerAuth`.
- `shared-memory.ts:587-591` — same pattern in `handleSharedSpaceMembershipSet`.
- `shared-memory.ts:738-742` — same pattern in `handleSharedMemoryEnable`.

**Fix:**
Resolve caller identity from a server-owned authentication context (e.g., a signed session token injected by trusted middleware), never from request body fields. If transport-level auth is not available, treat all callers as non-admin and require explicit server-side configuration to grant trust.

---

### [P1] Scope-filtered checkpoint restore can cross tenant boundaries when a checkpoint carries a `spec_folder`

**File:** `mcp_server/lib/storage/checkpoints.ts` (referenced from `mcp_server/handlers/checkpoints.ts`)

**Issue:**
When `checkpoint.spec_folder` is set, the restore path selects IDs via `getCurrentMemoryIdsForSpecFolder()`, which fetches every row in that folder without any tenant, user, agent, or shared-space predicate. Those widened IDs are then fed into both clear-existing delete paths and merge-replace paths, meaning a scoped restore can delete or overwrite rows that belong to a different tenant or user who shares the same spec folder.

**Evidence:**
- `lib/storage/checkpoints.ts` — `getCurrentMemoryIdsForSpecFolder()` selects all `memory_index.id` WHERE `spec_folder = ?` with no scope column filter; this is used instead of the scoped variant once `checkpoint.spec_folder` is present.
- Clear-existing path deletes by the widened ID set and by `spec_folder` alone for tables that have a `spec_folder` column.
- Merge-replace path passes the widened set to `restoreMergeTableAtomically()`.

**Fix:**
Replace `getCurrentMemoryIdsForSpecFolder()` with the scoped equivalent for all governed restores regardless of whether `spec_folder` is present on the checkpoint. `clearTableForRestoreScope()` must intersect `spec_folder` deletes with the caller-supplied tenant/user/agent/shared-space scope rather than deleting the full folder.

---

### [P2] `validateCheckpointScope` preserves empty strings, allowing blank `tenantId` to bypass the tenant-required gate

**File:** `mcp_server/handlers/checkpoints.ts:141-175`

**Issue:**
`validateCheckpointScope()` returns raw string values unchanged, including `""`. `requiresCheckpointTenant()` tests only for `=== undefined`, so `{ userId: "victim", tenantId: "" }` passes the guard and proceeds to storage-layer enforcement. Downstream normalization may strip the blank tenant, leaving only the user/agent/shared-space filter active and eliminating tenant isolation.

**Evidence:**
- `checkpoints.ts:141-157` — `validateValue()` returns the raw string as-is if it is not `undefined`.
- `checkpoints.ts:169-175` — `requiresCheckpointTenant()` checks `scope.tenantId === undefined` only; an empty string satisfies the check.

**Fix:**
Trim all scope fields in `validateCheckpointScope()` and treat zero-length values as `undefined` before calling `requiresCheckpointTenant()` and downstream scoped operations.

---

### [P2] `checkpointMatchesScope` treats missing metadata fields as a match, allowing unscoped checkpoints to be accessed by any scoped caller

**File:** `mcp_server/handlers/checkpoints.ts:190-207`

**Issue:**
`checkpointMatchesScope()` returns `true` when the checkpoint's metadata does not contain the scope field the caller requested (`actual === undefined`). This means a checkpoint that was created without any scope metadata is visible to and operable by any caller regardless of the tenant, user, or shared-space scope they supply. A caller with `tenantId: "tenant-A"` can restore or delete an unscoped checkpoint (one that belongs to a different, implicitly global context) because the missing `tenantId` field in the checkpoint metadata is treated as a wildcard match.

**Evidence:**
- `checkpoints.ts:197-198` — `return actual === undefined || actual === expected;` — absence of the field in metadata is treated as matching any requested value.
- `checkpoints.ts:329-331`, `checkpoints.ts:369-371`, `checkpoints.ts:519-520` — all post-filter paths use this same function.

**Fix:**
When a scoped scope field is requested, require that field to be explicitly present (and match) in the checkpoint metadata. Absence should be treated as a mismatch, not a wildcard. Unscoped checkpoints should only be accessible by callers who supply no scope at all.

---

### [P2] Atomic save file promotion and rollback occur outside the spec-folder mutex, creating a TOCTOU window

**File:** `mcp_server/handlers/memory-save.ts:1174-1255`

**Issue:**
`atomicSaveMemory()` writes the pending file and promotes it to the final path (`fs.renameSync`) before `processPreparedMemory()` is called. The spec-folder mutex is not acquired until `withSpecFolderLock()` inside `processPreparedMemory()`. Between promotion and lock acquisition there is an unguarded window where a concurrent `atomicSaveMemory()` call for the same file can also promote its pending write to the final path, overwriting the first. On failure, `restoreAtomicSaveOriginalState()` (line 363–381) unconditionally rewrites the live path, which can clobber a newer, successful concurrent write.

**Evidence:**
- `memory-save.ts:1211-1213` — `fs.writeFileSync(pendingPath, ...)` then `fs.renameSync(pendingPath, file_path)` before the mutex.
- `memory-save.ts:463` — `withSpecFolderLock(parsed.specFolder, ...)` is the first point where serialization begins.
- `memory-save.ts:1224-1226` — rollback via `restoreAtomicSaveOriginalState()` occurs outside the lock after indexing rejects or errors.
- `memory-save.ts:363-381` — rollback writes unconditionally to the live path with no concurrency guard.

**Fix:**
Acquire the spec-folder mutex before the pending-file promotion. Keep the entire sequence (capture original state → write pending file → promote → index → rollback-or-commit) inside one serialized critical section. For cross-process safety, add an OS-level file lock around the final-path rename.

---

### [P2] `sanitizeErrorField` does not redact file-system paths or database query text that may appear in `MemoryError` message strings

**File:** `mcp_server/lib/errors/core.ts:278-284`

**Issue:**
`sanitizeErrorField()` targets API key patterns (`sk-`, `voy_`, `Bearer`, `key=`) but does not strip absolute file paths, SQLite error text with table/column names, or stack traces. `MemoryError` messages are passed through `sanitizeErrorField()` directly as the public `error` field in `buildErrorResponse()`. SQLite errors commonly include table names, column names, and even partial query text. V-rule rejection reasons, preflight error messages, and DB transaction errors can also include internal path fragments when constructed with `path.basename(...)` or similar.

**Evidence:**
- `errors/core.ts:311-314` — `const publicMessage = error instanceof MemoryError ? sanitizeErrorField(error.message) : userFriendlyError(error)`.
- `errors/core.ts:278-284` — `sanitizeErrorField` regex set covers only API key patterns.
- `memory-save.ts:158-163` — `rejectionReason` is built from `failedRuleIds.join(', ')`, rule IDs being internal identifiers passed into the user-visible response.
- `pe-gating.ts:174-176` — `error` field in reinforcement error result includes raw `error instanceof Error ? error.message : String(error)`.

**Fix:**
Extend `sanitizeErrorField()` (or add a companion filter) to strip or normalize absolute/internal path fragments and SQLite diagnostic text before including any `MemoryError` message in a client-visible response. Alternatively, enumerate approved public message templates for each error type and reject anything that does not match.

---

### [P2] `createSharedMemoryInternalError` logs the raw error message to `console.error` before sanitization

**File:** `mcp_server/handlers/shared-memory.ts:328-345`

**Issue:**
`createSharedMemoryInternalError()` extracts the raw `error.message` and emits it to `console.error` at line 335 before any sanitization. In a deployment where server logs are accessible to end users or are included in debug responses, this leaks the unsanitized error message. The returned MCP response correctly omits the raw message, but the log channel itself is unguarded.

**Evidence:**
- `shared-memory.ts:334-335` — `const message = error instanceof Error ? error.message : String(error); console.error(\`[shared-memory] \${tool} failed: \${message}\`);`

**Fix:**
Run `sanitizeErrorField(message)` before logging, or log only the error type/code without the message body unless a DEBUG flag is set.

---

### [P2] PE gating scope filtering does not normalize null vs. undefined, allowing inconsistent cross-tenant matches in `findSimilarMemories`

**File:** `mcp_server/handlers/pe-gating.ts:64-113`

**Issue:**
`findSimilarMemories()` uses a `matchesScopedValue()` helper that returns `true` when `expected` is falsy. This means a `null` scope parameter (e.g., `tenantId: null`) is treated as "no filter required" and matches any row regardless of its `tenant_id` column value. When `findSimilarMemories` is called from the quality gate path in `memory-save.ts` (lines 523–535), the scope fields come from `MemoryScopeMatch` which allows `null` values. A save with an explicit `tenantId: null` scope bypasses tenant filtering in the PE deduplication pass, enabling cross-tenant PE decisions (false duplicates or false supersede marks).

**Evidence:**
- `pe-gating.ts:71-75` — `if (!expected) return true;` — null and empty string both pass as "no filter".
- `memory-save.ts:526-534` — `tenantId: scope.tenantId` is passed directly; `MemoryScopeMatch` permits `null`.
- `pe-gating.ts:86-94` — the post-filter applies the `matchesScopedValue` results to all candidate rows.

**Fix:**
Distinguish between `null`/`undefined` (no scope requested, meaning "match only rows with no tenant") and a truthy value (match that specific tenant). Treat `null` as an explicit "no-tenant" filter rather than as a wildcard skip. Update `matchesScopedValue` to: if `expected` is `null`, require `actual` to be `null`; if `expected` is a non-empty string, require `actual === expected`.

---

## Summary

This review found two P1 and five P2 findings across the five files. The two P1 issues are both authorization design gaps: (1) the shared-memory auth layer trusts caller-supplied actor IDs with no server-side binding, making admin impersonation trivial; and (2) checkpoint restore widens its operating scope when a `spec_folder` is present, enabling cross-tenant data modification.

Among the P2 findings, the most operationally significant are the empty-string `tenantId` bypass in checkpoint scope validation (which undermines the tenant-required guard), the `checkpointMatchesScope` wildcard behaviour for absent metadata fields (which allows unscoped checkpoints to be accessed by any scoped caller), and the atomic save TOCTOU window (which can corrupt on-disk state under concurrent writes).

The error sanitization in `lib/errors/core.ts` is structurally sound for API key redaction but does not cover internal path or database query fragments exposed through `MemoryError` messages. The PE gating null-scope bypass is a lower-risk information-boundary issue but can produce incorrect PE decisions in multi-tenant deployments.

No issues were found in the structural logic of `reinforceExistingMemory`, `markMemorySuperseded`, `updateExistingMemory`, or `logPeDecision` in `pe-gating.ts` beyond the scope-filter gap noted above. The `buildErrorResponse` call chain in `lib/errors/core.ts` is otherwise correctly structured.

# Iteration 002: D2 Security

## Findings

No P0 issues found.

### [P1] Shared-memory admin authorization is still spoofable because the handler trusts caller-supplied actor IDs
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:224-236`; `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:424-428`; `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:613-617`; `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:764-768`
- **Issue**: `validateCallerAuth()` derives `isAdmin` by comparing `actorUserId` / `actorAgentId` from tool arguments against the configured admin identity, and the file itself documents that those IDs are "caller-supplied and not cryptographically bound to an authenticated session." That means any MCP client that knows or guesses the configured admin subject can present that ID and gain admin-only access to `shared_memory_enable`, `shared_space_upsert`, and `shared_space_membership_set`.
- **Evidence**: The shared-memory handlers pass raw tool arguments into `validateCallerAuth()`, which then returns `isAdmin` based solely on equality with the configured admin actor. No transport principal, server-minted session, or other trusted binding is checked before the admin-only branches run.
- **Fix**: Do not authorize shared-memory admin operations from caller-supplied actor IDs alone. Bind actor identity to authenticated transport metadata or a server-issued session/principal, and reject admin-only operations until that binding exists.

```json
{
  "type": "claim-adjudication",
  "claim": "Shared-memory admin operations are privilege-escalatable because admin status is derived from caller-supplied actor IDs without a trusted transport binding.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:224-236",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:424-428",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:613-617",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts:764-768"
  ],
  "counterevidenceSought": "Looked for a later transport-principal check, server-minted session binding, or other trusted identity verification in the reviewed shared-memory handlers and did not find one.",
  "alternativeExplanation": "The implementation may assume a fully trusted local MCP transport where caller-provided actor IDs are already authenticated out of band.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if the runtime guarantees these handlers are only reachable through authenticated middleware that overwrites actorUserId or actorAgentId with a trusted principal."
}
```

### [P1] The ESM V-rule bridge fails open, so a load or packaging regression disables runtime validation for all `memory_save` calls
- **File**: `.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:49-71`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:186-190`
- **Issue**: When the bridge cannot `require()` `scripts/dist/memory/validate-memory-quality.js`, it logs the failure and returns a synthetic `{ valid: true, _unavailable: true }` result. `memory-save.ts` converts that condition into a warning and explicitly continues "without V-rule enforcement," so a missing dist artifact or broken ESM/CJS bridge silently disables the runtime content-validation gate rather than failing closed.
- **Evidence**: `loadModule()` catches loader errors and leaves the bridge unavailable; `validateMemoryQualityContent()` then returns a success-shaped object with `_unavailable`. The save pipeline only pushes a warning when `_unavailable` is present and proceeds with indexing.
- **Fix**: Make bridge unavailability fatal for `memory_save`, or enforce an explicit startup/preflight check that prevents the tool from serving requests unless the validator module is present and callable.

```json
{
  "type": "claim-adjudication",
  "claim": "The ESM V-rule bridge currently fails open, allowing memory_save requests to bypass runtime validation whenever the compiled validator cannot be loaded.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:49-71",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:186-190"
  ],
  "counterevidenceSought": "Checked the reviewed save path for a later hard guard that stops writes when the V-rule bridge is unavailable and found only warning-based handling.",
  "alternativeExplanation": "This may be an intentional availability tradeoff so save operations continue during packaging or build drift.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if deployment/startup guarantees the compiled validator is always present and memory_save is blocked earlier whenever the bridge cannot load."
}
```

### [P1] `shared/paths.ts` lets `cwd` and relative env/config values steer the database root outside the package workspace
- **File**: `.opencode/skill/system-spec-kit/shared/paths.ts:31-57`; `.opencode/skill/system-spec-kit/shared/paths.ts:62-68`
- **Issue**: The shared path resolver falls back to walking upward from `process.cwd()` and accepts any ancestor with either `mcp_server` + `shared` directories or just a `package.json`. It also resolves `MEMORY_DB_PATH` and configured DB directories relative to `process.cwd()`. A launcher that starts the process from another checkout or supplies a relative DB path can therefore redirect persistence outside the actual `system-spec-kit` package tree, which breaks the expected workspace boundary for storage and path discovery.
- **Evidence**: `resolvePackageRoot()` prefers `findUp(process.cwd(), ...)` fallbacks before returning the local package-relative default, and both `resolveDatabaseDir()` and `DB_PATH` use `path.resolve(process.cwd(), ...)` for configured values without constraining them back to the discovered package root.
- **Fix**: Anchor package discovery to `import.meta.dirname` (or another server-owned root) and reject `cwd` / env-driven database paths that escape the resolved workspace root.

```json
{
  "type": "claim-adjudication",
  "claim": "The shared path resolver can be steered outside the intended workspace because it trusts process.cwd() and resolves configured database locations relative to that caller-controlled directory.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/shared/paths.ts:31-57",
    ".opencode/skill/system-spec-kit/shared/paths.ts:62-68"
  ],
  "counterevidenceSought": "Looked for a later boundary check that revalidates the resolved package root or DB path against the local package tree and did not find one in the reviewed helper.",
  "alternativeExplanation": "The fallback may be intended to support launching from repo-root or custom workspace wrappers that intentionally relocate the database.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if the runtime contract guarantees process.cwd() is pinned to the system-spec-kit workspace and configured DB paths are already validated elsewhere."
}
```

## Notes
- `mcp_server/context-server.ts` kept stdio logging on `stderr` via `console.error` / `console.warn`; I did not find a new stdout contamination issue in the reviewed startup path.
- `scripts/core/workflow.ts` imports `@spec-kit/mcp-server/api/providers` through the package API surface rather than a deep private path; I did not find a new module-boundary widening issue in the reviewed bridge.
- `mcp_server/lib/governance/scope-governance.ts` retains deny-by-default behavior for empty scopes under enforcement and blocks unscoped governance-audit enumeration unless explicitly overridden.

## Summary
- P0: 0 findings
- P1: 3 findings
- P2: 0 findings

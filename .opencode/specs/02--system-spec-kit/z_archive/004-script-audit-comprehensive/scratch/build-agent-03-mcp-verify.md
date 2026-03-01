# Build Verification C03 (MCP Server)

Scope validated: top runtime/config/handler findings from C03, excluding issues attributable only to in-progress `node_modules` relocation/reference updates.

## Validation Results

### finding_id: C03-F001
- validation_status: confirmed
- evidence:
  - Unknown tool path still throws plain error in dispatch: `context-server.ts:139` -> `context-server.ts:142`.
  - Error envelope for unknown tool is generic search failure (`E040`) and does not include structured diagnostics like known tool set/requested_tool fields: `lib/errors/core.ts:238` -> `lib/errors/core.ts:257`.
  - Runtime reproduction (read-only) from built artifact:
    - Command: `node -e "const { buildErrorResponse } = require('./dist/lib/errors.js'); const r = buildErrorResponse('undefined_tool', new Error('Unknown tool: undefined_tool'), {}); console.log(JSON.stringify(r, null, 2));"`
    - Output shows `code: "E040"`, generic search hints, and no dispatcher context.
- impact:
  - Operator/client gets low-actionability diagnostics for dispatch misses; triage requires manual source inspection.
- remediation_hint:
  - Emit a dedicated unknown-tool code and add metadata (`requested_tool`, `available_tools`, `dispatcher_modules`) in the response envelope.

### finding_id: C03-F002
- validation_status: not-repro
- evidence:
  - Current codebase has exact schema-dispatch parity (22/22):
    - `tool-schemas.ts:167` -> `tool-schemas.ts:197`
    - `tools/index.ts:17` -> `tools/index.ts:37`
  - Reproduction script result (read-only):
    - Compared `name: '...'` in `tool-schemas.ts` vs `case '...'` in `tools/*.ts`.
    - Result: `{ "schemaCount": 22, "dispatchCount": 22, "missing": [], "extra": [] }`.
  - Test suite also asserts full coverage: `tests/context-server.vitest.ts:289` -> `tests/context-server.vitest.ts:306`.
- impact:
  - No current runtime mismatch observed; risk is future regression if parity checks are removed.
- remediation_hint:
  - Keep/add startup parity assertion as defense-in-depth, but classify current finding as not reproducible in present revision.

### finding_id: C03-F003
- validation_status: likely
- evidence:
  - Startup marks embedding ready in lazy mode before any warmup completes: `context-server.ts:473` -> `context-server.ts:479`.
  - `memory_search` uses readiness gate, but gate can be bypassed by the pre-set ready flag: `handlers/memory-search.ts:598` -> `handlers/memory-search.ts:604`.
  - `memory_save` performs embedding generation without an explicit readiness wait and falls back to deferred indexing on failure: `handlers/memory-save.ts:557` -> `handlers/memory-save.ts:569`, `handlers/memory-save.ts:733` -> `handlers/memory-save.ts:752`.
- impact:
  - Cold-start behavior can degrade to transient errors/deferred indexing rather than hard failure; user-visible consistency risk remains for first calls.
- remediation_hint:
  - Align readiness semantics: either do true readiness signaling in lazy mode or gate first embedding-dependent operations on an explicit provider-ready probe.

### finding_id: C03-F004
- validation_status: likely
- evidence:
  - Entry point enforces length-only validation pre-dispatch: `context-server.ts:114` -> `context-server.ts:116`.
  - No centralized schema-runtime validator invocation before `dispatchTool(...)`: `context-server.ts:138` -> `context-server.ts:139`.
  - Some handlers do strong local checks (example `memory_search` query/concepts constraints): `handlers/memory-search.ts:562` -> `handlers/memory-search.ts:564`.
- impact:
  - Validation consistency is handler-dependent; malformed payload behavior may vary by tool.
- remediation_hint:
  - Add optional centralized schema validation middleware (using `inputSchema`) before dispatch, retaining handler-level semantic checks.

### finding_id: C03-F006
- validation_status: confirmed
- evidence:
  - Auto-surface failure is explicitly non-fatal and only logged: `context-server.ts:122` -> `context-server.ts:127`.
  - Success path injects `autoSurfacedContext`, but failure path has no response metadata flag: `context-server.ts:192` -> `context-server.ts:195`.
- impact:
  - Clients cannot reliably detect degraded context-surfacing behavior from response contract alone.
- remediation_hint:
  - Add explicit response metadata, e.g. `meta.autoSurface: { attempted, success, errorCode? }`.

### finding_id: C03-F007
- validation_status: not-repro
- evidence:
  - Shutdown handlers call cache cleanup in all major termination paths:
    - `SIGTERM`: `context-server.ts:327` -> `context-server.ts:336`
    - `SIGINT`: `context-server.ts:342` -> `context-server.ts:351`
    - `uncaughtException`: `context-server.ts:357` -> `context-server.ts:364`
  - `toolCache.shutdown()` is present in each path.
- impact:
  - Claimed cleanup omission is not reproduced in current code.
- remediation_hint:
  - Keep existing cleanup; add a shutdown test asserting `toolCache.shutdown()` invocation if additional assurance is desired.

### finding_id: C03-F008
- validation_status: confirmed
- evidence:
  - Startup guidance prints hardcoded remediation script path without existence check: `startup-checks.ts:37` -> `startup-checks.ts:39`.
  - Path currently absent in repo: `scripts/setup/rebuild-native-modules.sh` not found under `mcp_server/`.
- impact:
  - Node-module mismatch remediation can direct users to a dead path, increasing recovery time.
- remediation_hint:
  - Guard recommendation with `fs.existsSync()`; include fallback remediation (`npm rebuild`, reinstall dependencies, documented alternative script path).

## Exclusion Note

- No finding in this report was classified solely on ongoing `node_modules` relocation/reference updates.
- Findings relying only on relocation effects were excluded from confirmation decisions.

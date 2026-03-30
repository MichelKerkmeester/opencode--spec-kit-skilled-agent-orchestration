# Iteration 001: D1 Correctness

## Findings

No P0 issues found.

### [P1] `@spec-kit/mcp-server` package root is side-effectful and starts the server on import
- **File**: `.opencode/skill/system-spec-kit/mcp_server/package.json:6-14`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1156-1164`
- **Issue**: The package root export (`"."`) and `main` both point to `dist/context-server.js`, but that module unconditionally calls `main()` at top level. Any bare `import '@spec-kit/mcp-server'` therefore connects the stdio transport, starts background startup work, and turns a package import into an executable side effect.
- **Evidence**: `package.json` maps the package root to `dist/context-server.js`, while `context-server.ts` ends with `main().catch(...)` after `server.connect(transport)` and `setImmediate(() => startupScan(DEFAULT_BASE_PATH))`.
- **Fix**: Keep `dist/context-server.js` on the `bin` surface only, and move the package root (`main` / `exports["."]`) to a side-effect-free API barrel or remove the root export entirely.

```json
{
  "type": "claim-adjudication",
  "claim": "The package root export for @spec-kit/mcp-server is unsafe as an import target because it executes the MCP server on module import.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/package.json:6-14",
    ".opencode/skill/system-spec-kit/mcp_server/context-server.ts:1156-1164"
  ],
  "counterevidenceSought": "Searched the current tree for bare @spec-kit/mcp-server imports and found none in the reviewed repo.",
  "alternativeExplanation": "The package may be intended to be executable-first, with consumers expected to use only ./api subpaths.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the root package specifier is explicitly unsupported and removed from main/exports, or if an explicit contract guarantees it is never imported."
}
```

### [P1] The ESM migration raises runtime requirements to Node 20.11+, but the workspace/scripts contract still advertises Node 18
- **File**: `.opencode/skill/system-spec-kit/shared/package.json:16-17`; `.opencode/skill/system-spec-kit/mcp_server/package.json:37-38`; `.opencode/skill/system-spec-kit/scripts/package.json:7-8`; `.opencode/skill/system-spec-kit/package.json:11-13`; `.opencode/skill/system-spec-kit/shared/paths.ts:31-48`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:214-217`
- **Issue**: The migrated ESM workspaces now declare `node >=20.11.0`, and `shared/paths.ts` depends on `import.meta.dirname`, but the workspace root and `@spec-kit/scripts` still declare `node >=18.0.0`. That leaves the documented CJS-to-ESM interop path claiming compatibility with a Node version that can still enter the scripts workflow and dynamically import ESM-only workspaces.
- **Evidence**: `shared` and `mcp_server` both require Node `>=20.11.0`; `scripts` and the workspace root still say `>=18.0.0`. The scripts workflow dynamically imports `@spec-kit/mcp-server/api/providers`, and the shared package now resolves paths from `import.meta.dirname`, so the runtime boundary has already moved past the advertised Node 18 floor.
- **Fix**: Raise the root and `@spec-kit/scripts` engine floors to `>=20.11.0`, or add an explicit early runtime guard that blocks the scripts workflow before it crosses into the ESM-only packages.

```json
{
  "type": "claim-adjudication",
  "claim": "The workspace still advertises Node 18 on the scripts/commonjs entry path even though the ESM migration now requires Node 20.11+ across the shared and mcp_server workspaces.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/shared/package.json:16-17",
    ".opencode/skill/system-spec-kit/mcp_server/package.json:37-38",
    ".opencode/skill/system-spec-kit/scripts/package.json:7-8",
    ".opencode/skill/system-spec-kit/package.json:11-13",
    ".opencode/skill/system-spec-kit/shared/paths.ts:31-48",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:214-217"
  ],
  "counterevidenceSought": "Looked for a root-level Node-version guard on the scripts path and did not find one in the reviewed workflow surfaces.",
  "alternativeExplanation": "The implementation may have intentionally dropped Node 18 support and only the metadata was left behind.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade if install/startup tooling already blocks Node 18 before any scripts or shared code can execute."
}
```

### [P2] `@spec-kit/shared` still publishes `embeddings.js` as the package root instead of the documented central export surface
- **File**: `.opencode/skill/system-spec-kit/shared/package.json:6-10`; `.opencode/skill/system-spec-kit/shared/index.ts:4-5`
- **Issue**: `shared/index.ts` is documented as the package's "Central export surface", but the package root (`main` and `exports["."]`) still points at `dist/embeddings.js`. That keeps the primary specifier inconsistent with the advertised module surface and forces consumers to know about the extra `/index` subpath.
- **Fix**: Point the root export at `dist/index.js`, and keep the embeddings-only surface on the explicit `./embeddings` subpath.

## Summary
- P0: 0 findings
- P1: 2 findings
- P2: 1 finding

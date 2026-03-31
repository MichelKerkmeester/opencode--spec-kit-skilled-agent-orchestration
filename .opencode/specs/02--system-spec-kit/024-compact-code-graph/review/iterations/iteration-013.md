# Iteration 013: D2 Security Re-Verification

## Focus

Re-verify prior D2 findings `F009` and `F010` against the current hook recovery and code-graph tool dispatch path. Target files reviewed in this pass: `session-prime.ts`, `compact-inject.ts`, `code-graph-tools.ts`, `tool-schemas.ts`, and `handlers/code-graph/scan.ts`. I also traced the live MCP call path through `context-server.ts` and `tools/index.ts` to confirm whether the declared schemas are actually enforced before the handlers run.

## Findings

No net-new security findings were added in this pass.

### [P1] F009 — transcript-derived compact payload is still injected as trusted `Recovered Context` without provenance fencing or prompt-injection separation

- `compact-inject.ts` still lifts raw transcript snippets into the merged session-state payload by collecting `meaningfulLines` from the transcript and appending them under `Recent context:`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:175-180]
- That merged `sessionState` is still fed into `mergeCompactBrief(...)`, and the resulting text is cached as `pendingCompactPrime.payload` for later replay.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:183-203][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:234-238]
- `session-prime.ts` still loads the cached payload and emits it directly as `Recovered Context (Post-Compaction)` while describing it as an auto-recovered 3-source merge, with no provenance label, quoting boundary, or instruction/data fence around the transcript-derived text.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:49-60]
- **Verdict:** **CONFIRMED**. The trust-boundary problem is still present in the current implementation.

### [P1] F010 — code-graph tool schemas now exist, but the live `code_graph_*` / `ccc_*` dispatch path still bypasses runtime argument validation

- `tool-schemas.ts` now re-exports `validateToolArgs` / `getSchema` and declares explicit input schemas for `code_graph_scan`, `code_graph_query`, `code_graph_context`, `ccc_status`, `ccc_reindex`, and `ccc_feedback`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:12-19][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:623-726]
- However, the live `CallTool` handler still only applies `validateInputLengths(args)` before dispatch and then forwards raw `request.params.arguments` into `dispatchTool(name, args)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:309-318][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:365-366]
- `tools/index.ts` still routes matching names straight into `code-graph-tools.ts`, and `code-graph-tools.ts` still casts the raw `Record<string, unknown>` argument bag directly into handler parameter types with no schema-validation call on that path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/index.ts:27-34][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:36-51]
- The iteration-007 carry-over remains active inside that same unchecked path: `handleCodeGraphScan()` still accepts caller-controlled `rootDir` verbatim, defaults only to `process.cwd()`, and passes it into `getDefaultConfig(rootDir)` with no allowlist, canonicalization, or workspace-boundary check.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:31-39]
- **Verdict:** **CHANGED**. The codebase now contains schema declarations and exported validation helpers, but the live code-graph dispatch path still does not invoke them, so the underlying security exposure remains active.
- **Carry-over status:** the previously logged `code_graph_scan` unbounded `rootDir` issue is still **CONFIRMED** within the current runtime path.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:31-39]

## Verified Healthy

- I did not find a new D2 issue in the reviewed target slice beyond the already logged `F009` / `F010` cluster.
- The schema additions in `tool-schemas.ts` are real progress, but today they operate as declared contract and test surface rather than enforced runtime protection for the code-graph tool family.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:12-19][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:623-726][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:74-151]

## Notes

- I did not promote the existing `excludeGlobs` contract drift to a new D2 finding here. It still broadens operational scan scope, but it is already tracked elsewhere as a contract/maintainability defect rather than a distinct net-new security root cause in this re-verification pass.
- The misleading `context-server.ts` comment that claims per-tool Zod validation happens inside the dispatch modules is not the issue by itself; the issue is that the live code-graph dispatch path still never calls the re-exported schema validators before reaching the handlers.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:315-319]

## Summary

- `F009`: **CONFIRMED**
- `F010`: **CHANGED** (schema/test surface added, runtime bypass still active)
- `code_graph_scan` caller-controlled `rootDir`: **CONFIRMED**
- New findings: none
- Active severity delta: `+0 P0`, `+0 P1`, `+0 P2`
- Recommended next focus: remediate the live dispatch path so `validateToolArgs(...)` runs before code-graph handlers, bound `rootDir` to an approved workspace root, then rerun targeted D2 verification.

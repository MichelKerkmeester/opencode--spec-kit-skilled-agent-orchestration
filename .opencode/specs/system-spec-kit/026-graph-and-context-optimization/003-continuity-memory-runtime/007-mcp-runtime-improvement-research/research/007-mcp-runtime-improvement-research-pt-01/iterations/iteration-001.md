# Iteration 001 - Q1 Phantom Fix Root Cause

## Focus

Q1: determine why the 005 P0 Cluster 1-3 fixes were claimed as landed while live MCP probes reportedly still showed pre-fix behavior. The narrow question was whether the gap came from missing `dist/` rebuild, missing daemon restart, or both, and what fix-and-verify protocol should prevent this class from recurring.

## Actions Taken

1. Read sibling packet 005 `implementation-summary.md` and checked for `decision-record.md`.
2. Compared the claimed source patch surfaces against compiled `mcp_server/dist/` outputs using marker search and file timestamps.
3. Inspected the MCP startup path in `opencode.json` and `mcp_server/package.json`.
4. Ran corrected local probes directly against the compiled `dist/` modules.
5. Attempted live `memory_context` MCP probes through the current client.

## Findings

### 1. The claimed Cluster 1-3 fixes are documented in 005, but the packet metadata is contradictory

The 005 implementation summary frontmatter and metadata still describe the packet as "findings-only" with remediation deferred. Later in the same file, the "Cluster 1-3 Remediation" section claims fixes landed on 2026-04-26.

Claimed fix surfaces:

- Cluster 1, REQ-002: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
  - Claimed changes: `enforceTokenBudget()` under-budget early return, survivor preservation through structural truncation, and re-derived returned-count metadata.
  - Claimed evidence: targeted vitest suites plus inline `node` probes against freshly built `dist/`.
- Cluster 2, REQ-001/004/016: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
  - Claimed changes: centroid-only confidence floor at `0.30`, `meta.intent.classificationKind = "task-intent"`, `data.queryIntentRouting.classificationKind = "backend-routing"`, and `seeAlso` cross-pointer.
  - Claimed evidence: classifier regression cases including `classifyIntent("Semantic Search") -> understand`.
- Cluster 3, REQ-003: `.opencode/command/memory/search.md`
  - Claimed changes: forbidden phrase enforcement table for render vocabulary.
  - Claimed evidence: spec-side grep command, not server-side renderer tests.

No `decision-record.md` exists for sibling 005.

### 2. Missing `dist/` rebuild is ruled out for the two code patches

Timestamp evidence shows the compiled files are newer than the edited TypeScript sources:

- `handlers/memory-context.ts`: Apr 26 17:22:31
- `dist/handlers/memory-context.js`: Apr 26 17:22:58
- `lib/search/intent-classifier.ts`: Apr 26 17:24:18
- `dist/lib/search/intent-classifier.js`: Apr 26 17:24:27

Compiled marker evidence also matches the claimed source patches:

- `dist/handlers/memory-context.js` contains the `actualTokens / budgetTokens < 0.50` sanity guard.
- `dist/handlers/memory-context.js` contains `preservedAfterStructural`, `fallbackToStructuredBudget`, `returnedResultCount`, and the `classificationKind` / `seeAlso` annotations.
- `dist/lib/search/intent-classifier.js` contains `CENTROID_ONLY_CONFIDENCE_THRESHOLD = 0.30` and the centroid-only evidence gate comments.
- `.opencode/command/memory/search.md` contains `Forbidden Phrase Enforcement (REQ-003 / Cluster 3)` and the required replacement table.

This directly eliminates "source was patched but `dist/` was not rebuilt" as the root cause for Clusters 1 and 2.

### 3. Local `dist/` probes show the compiled code has the intended Cluster 1 and 2 behavior

Corrected local probe against `dist/lib/search/intent-classifier.js`:

- `classifyIntent("Semantic Search")` returns `intent: "understand"`, `confidence: 0.09796576421718495`, `keywords: []`.
- `classifyIntent("Find stuff related to semantic search")` returns `intent: "understand"`, `confidence: 0.07996996977285953`, `keywords: []`.
- `classifyIntent("fix the login bug")` returns `intent: "fix_bug"`, `confidence: 0.2098142921924591`, `keywords: ["fix", "bug"]`.

Corrected local probe against `dist/handlers/memory-context.js`:

- Under-budget result with two results and budget `3000` returns `truncated: false`, `actualTokens: 37`, `data.count: 2`, `data.results.length: 2`.
- True over-budget synthetic payload with budget `300` still falls back to a minimal `{"data":{"count":0,"results":[]}}` content envelope. That is not the reported 2-percent-under-budget bug, but it is a useful boundary: zero-fill remains possible only after actual budget pressure.

This means the currently checked-out compiled code does not reproduce the Cluster 1/2 phantom behavior locally.

### 4. Live daemon probe was blocked in this execution environment

Two attempts to call the current MCP `memory_context` tool returned immediately with:

`user cancelled MCP tool call`

Because both live calls were cancelled by the client, this iteration cannot honestly claim a current running-daemon response. The live probe is therefore an explicit gap, not evidence against the compiled-code findings.

### 5. Startup path requires a client/runtime restart to load rebuilt `dist`

`opencode.json` starts the Spec Kit Memory MCP server as:

`node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js`

`mcp_server/package.json` exposes:

- `npm run build` -> `tsc --build`
- `npm start` -> `node dist/context-server.js`

There is no package-level hot reload or restart script. Since OpenCode/Codex owns the MCP child process, a TypeScript patch plus `npm run build` updates disk but does not reload an already-running MCP daemon. If live MCP behavior remained pre-fix after rebuilt `dist` existed, the most likely root cause is a stale daemon process or stale client MCP session loaded before the rebuild.

Process inspection via `ps` was blocked by sandbox policy (`operation not permitted`), and no MCP-specific daemon log was found under the repo, `~/.opencode`, or `~/.codex/log` beyond generic Codex TUI logs.

## Questions Answered

### Q1 root cause

The root cause is not a missing `dist/` rebuild for Clusters 1 or 2. The compiled files are newer than their sources and contain the claimed changes. Local probes against `dist/` confirm the classifier and under-budget token enforcement fixes.

The remaining explanation for reported pre-fix live MCP behavior is a missing daemon/client restart, or less likely a different MCP server instance/path than the repo-local `opencode.json` command. Because live `memory_context` calls were cancelled in this iteration, the daemon-current-state portion remains unverified.

### Q1 remediation

The fix class is operational: after touching MCP TypeScript source, the workflow must treat "source patched" and "running daemon fixed" as separate states. Rebuild alone is insufficient.

Required protocol:

1. Patch source.
2. Run targeted tests.
3. Run `npm run build` in `.opencode/skill/system-spec-kit/mcp_server`.
4. Verify `dist/` timestamps and markers are newer/present.
5. Restart the MCP-owning client/runtime so `node .../dist/context-server.js` is relaunched.
6. Run a live MCP tool probe through the client, not only a direct `node` import.
7. Record all four evidence classes: source diff, test output, compiled-marker/timestamp check, and live MCP probe output.

### Q1 verification probe

Canonical live probe for this issue:

- `memory_context({ input: "Semantic Search", mode: "auto", includeTrace: true, tokenUsage: 0.02 })`

Acceptance:

- `meta.intent.intent` or equivalent task-intent field resolves to `understand`, not `fix_bug`.
- `meta.intent.classificationKind` is `task-intent`.
- `data.queryIntentRouting.classificationKind` is `backend-routing` with `seeAlso` pointing to `meta.intent`.
- Under-budget `actualTokens / budgetTokens < 0.50` responses are not truncated to `count:0, results:[]`.

## Questions Remaining

- Confirm the current running daemon after a restart with a successful live `memory_context` probe.
- Identify whether OpenCode/Codex exposes a first-class MCP restart command; if not, document "restart client/session" as the operational restart step.
- Q2 remains untouched: cocoindex mirror-folder duplicate ranking.

## Next Focus

Q2: investigate cocoindex mirror-folder duplicates and recommend canonical-source filtering or ranking controls so `.gemini/specs/`, `.claude/specs/`, and `.codex/specs/` mirrors do not dominate the same query response.

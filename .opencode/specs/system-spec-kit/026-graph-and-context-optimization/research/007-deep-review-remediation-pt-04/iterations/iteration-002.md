# Iteration 002 - Fix Design for Indexer Stale Gate and Duplicate Symbol IDs

## Focus

Design the minimal production patches for two confirmed bugs from iteration 1:

- P0 stale-gate bug: caller-requested `incremental:false` reaches the scan handler, but `indexFiles()` still skips DB-fresh files.
- P0 duplicate-symbol bug: parser captures can generate repeated `symbolId` values inside one file, causing `UNIQUE constraint failed: code_nodes.symbol_id`.

Secondary focus: test coverage and operator-facing scan response clarity.

## Actions Taken

1. Read the deep-research loop instructions and current strategy/state files.
2. Inspected `indexFiles()` in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts`.
3. Inspected the scan handler in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts`.
4. Enumerated `indexFiles()` callers with `rg -n "indexFiles\\(" .opencode/skill/system-spec-kit/mcp_server`.
5. Inspected duplicate symbol construction in `capturesToNodes()`, `tree-sitter-parser.ts`, `indexer-types.ts`, and `code-graph-db.ts`.
6. Inspected existing tests in `tests/tree-sitter-parser.vitest.ts`, `tests/structural-contract.vitest.ts`, and `code-graph/tests/code-graph-scan.vitest.ts`.

## Findings

### G1 - Stale Gate Fix Design

`indexFiles()` discovers all included files, but line 1249 unconditionally applies the stale gate:

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1227` defines `indexFiles(config)` with no option parameter.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1246-1249` documents and applies `if (!isFileStale(file)) continue;`.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:177` computes `effectiveIncremental`.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:183` calls `indexFiles(config)` without passing the computed mode.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:193-201` removes tracked files missing from `results` on non-incremental scans, so stale-only `results` become a destructive full-scan desired set.

Other callers found:

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:190` calls `indexFiles(config)` for bounded auto-indexing. It should keep stale-only behavior.
- `.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts:162` and `:184` call `indexFiles()` in scan-scope tests. Default stale-only behavior is currently masked by `isFileStale: true` mocks.

The minimal API change is an optional `IndexFilesOptions` parameter with a stale-gate-oriented flag. The flag should default to existing behavior so selective inline refresh paths are untouched.

```diff
diff --git a/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts b/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts
@@
+export interface IndexFilesOptions {
+  skipFreshFiles?: boolean;
+}
+
 /** Index all matching files in the workspace */
-export async function indexFiles(config: IndexerConfig): Promise<ParseResult[]> {
+export async function indexFiles(config: IndexerConfig, options: IndexFilesOptions = {}): Promise<ParseResult[]> {
   const results: ParseResult[] = [];
+  const skipFreshFiles = options.skipFreshFiles ?? true;
@@
-    if (!isFileStale(file)) continue;
+    if (skipFreshFiles && !isFileStale(file)) continue;
```

```diff
diff --git a/.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts b/.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts
@@
-  const results = await indexFiles(config);
+  const results = await indexFiles(config, { skipFreshFiles: effectiveIncremental });
```

Why this location: putting the bypass inside `indexFiles()` keeps scan mode visible at the abstraction boundary that owns file read/parse work. It avoids duplicating stale checks at call sites and preserves current `ensure-ready.ts:190` behavior because the option defaults to `true`.

### G2 - Duplicate Symbol Guard Design

Current symbol construction is deterministic but not collision-proof for repeated semantic captures in one file:

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:82-85` hashes `filePath + fqName + kind`.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:796-812` maps every capture directly to a node and calls `generateSymbolId(filePath, getCaptureFqName(c), c.kind)`.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:520-533` emits a node capture for each relevant AST node.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:535-539` then recurses through class bodies, which is part of how duplicate class/body and method captures can surface.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:328-333` inserts each node by `symbolId`; duplicate IDs hit the DB uniqueness constraint.

Trade-off evaluation:

- Option A, dedupe in `capturesToNodes()`: smallest patch, keeps `symbolId` stable, preserves the first-seen line/signature, prevents DB crashes across parser backends. It is lossy when two distinct logical symbols share the same `(filePath, fqName, kind)`, but current graph semantics cannot represent both without changing identity.
- Option B, append line number only on duplicate: preserves more nodes but makes some `symbolId`s edit-position-sensitive and creates mixed identity semantics. This undermines graph stability across nearby edits.
- Option C, fix capture names at parser layer: best semantic endpoint, but larger surgery across AST traversal, regex fallback parity, edge extraction, and tests. It should be follow-up work after the crash is blocked.

Recommendation: Option A now. The code graph already defines identity as `(filePath, fqName, kind)`; the safest minimal fix is to enforce that invariant before DB insert rather than mutating identity at collision time.

```diff
diff --git a/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts b/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts
@@
-  const symbolNodes = captures.map(c => {
+  const seenSymbolIds = new Set<string>([moduleNode.symbolId]);
+  const symbolNodes = captures.flatMap(c => {
+    const fqName = getCaptureFqName(c);
+    const symbolId = generateSymbolId(filePath, fqName, c.kind);
+    if (seenSymbolIds.has(symbolId)) return [];
+    seenSymbolIds.add(symbolId);
     const rangeText = lines.slice(c.startLine - 1, c.endLine).join('\n');
-    return {
-      symbolId: generateSymbolId(filePath, getCaptureFqName(c), c.kind),
+    return [{
+      symbolId,
       filePath,
-      fqName: getCaptureFqName(c),
+      fqName,
@@
-    };
+    }];
   });
```

Note: `extractEdges()` still receives raw captures (`tree-sitter-parser.ts:648`, `structural-indexer.ts:684`). This is acceptable for the minimal crash fix because edge source/target lookup is node-based; richer parser scoping can be a later semantic improvement.

### G4 - Operator-Facing Rename / Supplement

The existing scan payload includes `fullReindexTriggered` in `ScanResult`:

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:21-33` defines the response shape.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:248-261` populates `scanResult`.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:263-265` already uses `fullReindexTriggered || !effectiveIncremental` to label readiness action as `full_scan`.

`fullReindexTriggered=false` is technically accurate when the caller explicitly passes `incremental:false`, because no git-HEAD-triggered reindex occurred. It is operator-hostile because the response does not separately expose caller intent or effective mode.

Recommended supplement, not rename:

```diff
diff --git a/.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts b/.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts
@@
   durationMs: number;
+  fullScanRequested?: boolean;
+  effectiveIncremental?: boolean;
   fullReindexTriggered?: boolean;
@@
     durationMs: Date.now() - startTime,
+    fullScanRequested: !incremental,
+    effectiveIncremental,
     fullReindexTriggered,
```

This keeps existing consumers stable while making all three states distinguishable:

- caller requested full scan: `fullScanRequested:true`, `effectiveIncremental:false`, `fullReindexTriggered:false`
- git HEAD forced full scan: `fullScanRequested:false`, `effectiveIncremental:false`, `fullReindexTriggered:true`
- normal incremental scan: `fullScanRequested:false`, `effectiveIncremental:true`, `fullReindexTriggered:false`

## Recommended Patches

### G1 - Patch `indexFiles()` API and scan handler

Apply the optional `IndexFilesOptions` patch above in:

- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1227-1249`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:177-183`

Keep `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:190` unchanged so readiness auto-indexing continues to parse only stale/missing files.

### G2 - Patch `capturesToNodes()` dedupe

Apply Option A in `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:796-812`.

Preserve first-seen node data and drop later nodes with the same generated `symbolId` inside the parse result. This directly prevents `code-graph-db.ts:328-333` from receiving duplicate keys.

### G4 - Add response clarity fields

Add `fullScanRequested` and `effectiveIncremental` to `ScanResult` and `scanResult` in `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:21-33` and `:248-261`.

Do not rename `fullReindexTriggered`; the current name is precise for the git-triggered branch and may be consumed externally.

## Test Plan

### `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts`

The file currently covers bootstrap contract behavior, not scan execution. Add contract-level coverage only if this suite is intended to assert the startup-facing response language after scan. Otherwise, the more natural home for scan handler mechanics is `code-graph/tests/code-graph-scan.vitest.ts`.

Recommended cases if kept in `structural-contract.vitest.ts`:

1. Add a mocked scan-result contract case asserting that a full scan payload can expose `fullScanRequested:true`, `effectiveIncremental:false`, and `fullReindexTriggered:false` without contradictory readiness wording.
2. Add an idempotency contract case: two fresh graph stats with the same total file count produce the same bootstrap summary/highlights, preventing the 33-file stale-only result from being normalized as a successful full graph.

Recommended stronger companion cases in `code-graph/tests/code-graph-scan.vitest.ts`:

1. `incremental:false` calls `indexFiles(config, { skipFreshFiles: false })`, removes only paths absent from the full result set, and returns `fullScanRequested:true`, `effectiveIncremental:false`.
2. `incremental:true` with unchanged git HEAD calls `indexFiles(config, { skipFreshFiles: true })`, preserves stale-only behavior, and cleans only missing tracked files.
3. Repeat full scan with no file changes returns the same `filesScanned` count as the first scan when `indexFiles` returns the full post-exclude set.

### `.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts`

Add indexer-level tests because this file already owns scan-scope `indexFiles()` integration and mocks `isFileStale`.

1. Full-scan bypass: mock `isFileStale` to return `false`, create a temp root with several included files, call `indexFiles(config, { skipFreshFiles: false })`, and assert all post-exclude files are returned. In the real repo integration variant, assert count is `>= 1000`; in temp fixtures, assert exact fixture count.
2. Incremental default: mock `isFileStale` to return `false`, call `indexFiles(config)` with no options, and assert `[]`, proving `ensure-ready.ts:190` remains stale-only by default.
3. Idempotency: call `indexFiles(config, { skipFreshFiles: false })` twice with unchanged temp fixtures and assert equal returned file counts and paths.
4. Duplicate-symbol guard: call `capturesToNodes()` or `parseFile()` on content/captures that intentionally produce duplicate `(filePath, fqName, kind)` pairs, then assert all `symbolId`s are unique and at least one node for the logical symbol remains.
5. DB-crash regression: feed deduped nodes into a mocked or temp DB `replaceNodes()` path and assert no duplicate-symbol error. If this stays out of the parser test file, add it to `code-graph/tests/code-graph-indexer.vitest.ts`.

## Questions Answered

- G1.1: Minimal API change is `indexFiles(config, options?)` with a defaulted stale-gate flag.
- G1.2: Add the conditional bypass inside `indexFiles()` as an `IndexFilesOptions` flag, not by pre-filtering at the scan handler call site.
- G1.3: Other callers are `ensure-ready.ts:190` and tests; they remain compatible because the option defaults to current stale-only behavior.
- G1.4: Exact patch is shown above with line citations.
- G2: Recommend Option A, dedupe by generated `symbolId` in `capturesToNodes()`.
- G3: Test cases are listed for scan mode, idempotency, and duplicate-symbol safety.
- G4: Add `fullScanRequested` and `effectiveIncremental`; keep `fullReindexTriggered`.

## Questions Remaining

- Should the follow-up implementation include a semantic parser repair (Option C) after the crash guard, so duplicate captures are prevented rather than only deduped?
- Should the `filesScanned` field be renamed or supplemented later? It currently means parsed result count, not all candidate files visited by `findFiles()`.
- Should the scan-mode tests live exactly in `structural-contract.vitest.ts` as requested, or should implementation move handler-specific assertions to `code-graph/tests/code-graph-scan.vitest.ts` and keep `structural-contract.vitest.ts` contract-only?

## Next Focus

Implement the minimal patches in production code, then run targeted tests:

1. `vitest` for `tree-sitter-parser.vitest.ts`, `code-graph-scan.vitest.ts`, and `code-graph-indexer.vitest.ts`.
2. `tsc` or the repo's MCP server typecheck/build command.
3. A real `code_graph_scan({ incremental:false })` against the workspace to confirm post-exclude count returns approximately 1,425 files rather than 33, with no duplicate-symbol DB errors.

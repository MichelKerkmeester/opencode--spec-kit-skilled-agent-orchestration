# Plan + Implement: Code Graph Scan Stale-Gate + Duplicate-Symbol Fix

You are implementing the fix designed by the deep research at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/research.md` (READ THIS FIRST — full root-cause analysis, exact diffs, test plan, and risk register).

## SCOPE

Two P0 bugs in the code-graph indexer (introduced/exposed by packet 012):

1. `indexFiles()` ignores caller's `incremental:false` → DB pruned to 33 stale-only files instead of ~1,425.
2. `capturesToNodes()` emits duplicate `(filePath, fqName, kind)` symbolIds for 3 indexer-self files → `code_nodes.symbol_id` UNIQUE constraint failures.

## DELIVERABLES

### A. NEW SPEC FOLDER (Level 3, nested under packet 012)

Path: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/`

Create canonical Level 3 docs (use templates from `.opencode/skill/system-spec-kit/templates/level_3/` — pick from `level_3/` if it exists, else `level_2/` and add a decision-record.md):
- `spec.md` — problem, scope, requirements, non-goals
- `plan.md` — phases, dependencies, sequencing rationale (T-001..T-011)
- `tasks.md` — T-001..T-011 with checkboxes, file paths, expected diff sizes (lift from research.md §7.2)
- `checklist.md` — P0/P1/P2 items including AC-1..AC-8 from research.md §9
- `decision-record.md` — ADR for "Option A dedup vs B vs C", "supplement vs rename for fullReindexTriggered"
- `description.json` + `graph-metadata.json` — generate via `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` post-creation if needed, OR copy template structure from a sibling like `012-code-graph-context-and-scan-scope/`

Run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <new-spec-folder> --strict` after document creation. It MUST exit 0 (zero errors / zero warnings).

### B. SOURCE-CODE PATCHES (T-001..T-005)

Apply EXACTLY the diffs from research.md §5.1, §5.2, §5.3:

**T-001 + T-002 — `lib/structural-indexer.ts`:**
```diff
+export interface IndexFilesOptions {
+  skipFreshFiles?: boolean;
+}
+
 export async function indexFiles(config: IndexerConfig): Promise<ParseResult[]> {
→ export async function indexFiles(config: IndexerConfig, options: IndexFilesOptions = {}): Promise<ParseResult[]> {
   const results: ParseResult[] = [];
+  const skipFreshFiles = options.skipFreshFiles ?? true;
…
-    if (!isFileStale(file)) continue;
+    if (skipFreshFiles && !isFileStale(file)) continue;
```

**T-003 — `handlers/scan.ts:183` (or current line, find by `await indexFiles(config)`):**
```diff
-  const results = await indexFiles(config);
+  const results = await indexFiles(config, { skipFreshFiles: effectiveIncremental });
```

**T-004 — `lib/structural-indexer.ts` `capturesToNodes()` (~line 796):**
```diff
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
…
-    };
+    }];
   });
```

**T-005 — `handlers/scan.ts` response shape (lines ~21-33 type def + ~248-261 population):**
- Add to ScanResult interface: `fullScanRequested: boolean; effectiveIncremental: boolean;`
- In response population: `fullScanRequested: args.incremental === false`, `effectiveIncremental: effectiveIncremental` (already computed)
- Keep `fullReindexTriggered` UNCHANGED.

### C. TESTS (T-006..T-008)

Add the vitest snippets from research.md §10. Target files:
- `mcp_server/tests/structural-contract.vitest.ts` — `describe('indexFiles options', ...)` (3 cases) + `describe('scan handler integration', ...)` (2 cases)
- `mcp_server/tests/tree-sitter-parser.vitest.ts` — `describe('capturesToNodes dedupe (Bug #2 regression)', ...)` (3 cases)

Adapt fixtures as needed; the research provides shapes. Run `npx vitest run` from `mcp_server/` and ensure new tests + ALL existing tests pass.

### D. BUILD + VERIFY (T-009..T-011)

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build
```

Confirm dist contains:
- `dist/code-graph/lib/structural-indexer.js` — has `skipFreshFiles` token
- `dist/code-graph/handlers/scan.js` — has `fullScanRequested` token

Update `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` surface matrix to document the new response fields (`fullScanRequested`, `effectiveIncremental`) and the `IndexFilesOptions { skipFreshFiles }` parameter.

### E. IMPLEMENTATION SUMMARY (post-build)

Create `002-incremental-fullscan-recovery/implementation-summary.md` with:
- What changed (per task)
- Test result counts (before/after)
- Any deviations from the plan (with rationale)
- Acceptance criteria status (which AC-N items are now testable; AC-1, AC-4, AC-5 require live MCP scan which the operator runs after restart)
- `_memory.continuity` block (use the standard frontmatter shape — see `012-code-graph-context-and-scan-scope/implementation-summary.md` for format)

Run validate.sh --strict on the new spec folder again post-implementation.

## CONSTRAINTS

- **DO NOT** modify packet 012's documents — only create the new nested 002 packet.
- **DO NOT** run `code_graph_scan` from this codex run (operator must restart MCP server first; AC-1, AC-4, AC-5 are post-restart verifications).
- **DO NOT** VACUUM the SQLite DB.
- **DO NOT** rename `fullReindexTriggered`.
- Keep `IndexFilesOptions` parameter optional with default `true` to preserve all other callers (`ensure-ready.ts:190` and tests).
- Use conventional commits format if you make any commits (`fix(007/012/002): ...`); but DO NOT push.

## ACCEPTANCE (this codex run is "done" when)

1. All 6 canonical Level 3 spec docs exist + validate.sh --strict exits 0.
2. All 5 source-code patches applied (verify via grep for `skipFreshFiles`, `seenSymbolIds`, `fullScanRequested`).
3. `npx vitest run` from `mcp_server/` exits 0 with new tests included.
4. `npm run build` from `mcp_server/` succeeds and dist has the new symbols.
5. `code-graph/README.md` documents the new response fields.
6. `implementation-summary.md` exists with `_memory.continuity` block.

Report: paths created/modified, test counts (before → after), build status, and which AC items still require post-restart operator verification.

## START NOW

Read research.md first (it has all the citations and exact diffs). Then create the spec folder, then patch, then test, then build, then summarize. Single continuous run.

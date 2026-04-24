---
title: "...ion/003-code-graph-package/003-code-graph-context-and-scan-scope/research/007-deep-review-remediation-pt-04/research]"
description: "Root-cause investigation of why mcp__spec_kit_memory__code_graph_scan returned 33 files / 809 nodes / 376 edges after packet 012, when the predicted post-exclude count was 1000-3000."
trigger_phrases:
  - "code graph scan 33 files"
  - "incremental false stale gate"
  - "code_nodes symbol_id unique constraint"
  - "packet 012 scan scope anomaly"
  - "indexfiles skipfreshfiles"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/research/007-deep-review-remediation-pt-04"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
iterations: 5
sessionId: dr-2026-04-23-130100-pt04
specFolder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope
stop_reason: maxIterationsReached
---
# Deep Research — Code Graph Scan Scope Anomaly After Packet 012

## 1. Executive Summary

**Problem:** After packet 012 was deployed, `mcp__spec_kit_memory__code_graph_scan({rootDir, incremental:false})` returned only 33 files / 809 nodes / 376 edges instead of the expected active-code scale of roughly 1,000–3,000 files (handover prediction).

**Root cause:** The first P0 bug is a split full-scan contract — the scan handler correctly derives `effectiveIncremental=false`, but `indexFiles()` still unconditionally applies `isFileStale()` and returns only stale files. The destructive non-incremental cleanup at `handlers/scan.ts:193-201` then treats that stale-only result as the desired complete graph and DELETEs every tracked file not in it, pruning the DB to 33. The second P0 bug is duplicate parser-generated `symbolId` values inside three indexer-self files, which trigger the `code_nodes.symbol_id` UNIQUE constraint during persistence.

**Fix:** Add `IndexFilesOptions { skipFreshFiles?: boolean }` (default `true`) and make the scan handler pass `{ skipFreshFiles: effectiveIncremental }` so caller-requested full scans parse every post-exclude candidate. Add a minimal `seenSymbolIds` dedupe guard inside `capturesToNodes()`, preserving the first-seen node and preventing duplicate IDs from reaching `replaceNodes()`. Supplement the scan response with additive `fullScanRequested` and `effectiveIncremental` fields (keep `fullReindexTriggered` unchanged).

**Implementation:** Host the remediation under nested packet `003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/`, following ordered tasks T-001 → T-011 (indexer options → scan handler mode → dedupe → response metadata → tests → build → runtime scan).

**Verification:** Acceptance requires focused tests plus a real `incremental:false` scan that returns `filesScanned >= 1000`, zero duplicate-symbol errors, stable repeat-scan behavior, and passing status/query/context smoke checks.

**Impact if shipped:** The code graph DB grows from the broken 33-file stale-only set back to approximately 1,425 active files (empirically reproduced via the `ignore` package), restoring graph completeness for `code_graph_query` and `code_graph_context`.

---

## 2. Problem Definition

### 2.1 Original observation (this session)

After confirming packet 012's dist build was current (`z_future` present in `dist/code-graph/lib/indexer-types.js`, dist mtime 12:16Z) and the MCP server had reloaded the new code, a fresh scan returned:

| Metric | Baseline (10:29Z) | Post-scan (10:54Z) | Predicted (handover) |
|---|---|---|---|
| Files | 26,464 | **33** | 1,000–3,000 |
| Nodes | 544,577 | 809 | — |
| Edges | 275,321 | 376 | — |
| DB size | 473 MB | 473 MB (unchanged) | — |
| Errors | 0 | 3 × `UNIQUE constraint failed: code_nodes.symbol_id` | 0 |

`fullReindexTriggered: false`, `previousGitHead === currentGitHead === 162a6cb16`, `filesScanned: 33`, `filesIndexed: 30`.

### 2.2 Initial hypothesis space (pre-research)

- (a) `incremental=false` is parsed but the indexer short-circuits when git head is unchanged
- (b) `.gitignore`-aware walk + new excludes prune far more than expected; 33 is correct
- (c) Full-reindex DB-cleanup logic regressed
- (d) New `.gitignore` interpretation matches more `.opencode/` paths than expected

---

## 3. Methodology

5 iterations of `/spec_kit:deep-research:auto` via cli-codex (gpt-5.4, reasoning=high, service_tier=fast). Each iteration ran with fresh context, externalized state via JSONL, and a structured prompt referencing prior findings inline.

| Iter | Focus | newInfoRatio | Status | Key output |
|---|---|---|---|---|
| 1 | Source code reading + filesystem reproduction + DB inspection | 0.88 | insight | F1-F5: stale-gate root cause + 1,425 candidate count + dedup-vs-stale-rows clarity |
| 2 | Minimal-diff fix design with code-block diffs | 0.62 | insight | IndexFilesOptions API; capturesToNodes dedupe (Option A); response field supplement |
| 3 | Caller safety verification + edge-case stress + concrete vitest snippets | 0.41 | insight | All 4 callers safe; overload/closure dedup acceptable; vitest cases ready |
| 4 | Spec folder topology + ordered tasks + risks + acceptance criteria | 0.34 | insight | Nested packet 012/002; T-001..T-011; R1-R6; AC-1..AC-8 |
| 5 | dist verification + alternative hypothesis cross-check + executive summary | 0.18 | insight | dist matches source; H-alt-1..H-alt-4 ruled out; synthesis-ready |

**Convergence trajectory:** 0.88 → 0.62 → 0.41 → 0.34 → 0.18. Rolling avg(0.41, 0.34, 0.18) = 0.31 (above 0.05 threshold). Stop reason: `maxIterationsReached` (user requested 5).

---

## 4. Root Cause Analysis

### 4.1 Bug #1 (P0) — Stale gate ignores caller's incremental flag

**Mechanism:**

1. Caller invokes `code_graph_scan({rootDir, incremental: false})`.
2. Handler at `handlers/scan.ts:124,128,171,177` correctly maps `incremental=false` and computes `effectiveIncremental = incremental && !fullReindexTriggered = false`.
3. Handler calls `indexFiles(config)` at `handlers/scan.ts:183` **without passing the effective mode**.
4. `indexFiles()` at `lib/structural-indexer.ts:1227` discovers all post-exclude candidates (1,425 files in this workspace).
5. Inside the iteration loop at `lib/structural-indexer.ts:1246-1249`, every candidate is filtered: `if (!isFileStale(file)) continue;`. Only files whose mtime/hash differs from the DB row are kept. With a freshly-indexed DB, only files MODIFIED since the last scan pass through (33 files: the 3 errored indexer-self files plus 30 others recently touched).
6. Handler's full-scan cleanup at `handlers/scan.ts:193-201` builds `indexedPaths` from `results` and DELETEs every tracked file absent from that set. Since `results` is the stale-only subset, ~26,431 files are removed from the DB.

**Why packet 012 surfaced this:** Before packet 012 the scan walked far more files (26K) and the stale gate filtered them down to a working set the cleanup happened to tolerate. With packet 012's tighter walk (1,425 candidates) plus the same stale-gate contract bug, the cleanup math collapsed to 33.

**Caller enumeration:** `rg -n 'indexFiles\(' .opencode/skill/system-spec-kit/mcp_server` finds:

| Caller | Intent | Default `skipFreshFiles=true` safe? |
|---|---|---|
| `lib/ensure-ready.ts:190` | Bounded auto-indexing | ✅ Yes — wants stale-only |
| `handlers/scan.ts:183` | User-requested scan | ❌ Needs `{ skipFreshFiles: effectiveIncremental }` |
| `tests/tree-sitter-parser.vitest.ts:162,184` | Test fixtures | ✅ Yes — uses mocked `isFileStale: true` |

### 4.2 Bug #2 (P0) — Duplicate parser-generated symbolIds

**Mechanism:**

1. `code_nodes.symbol_id` is declared UNIQUE at `lib/code-graph-db.ts:68,70`.
2. `replaceNodes()` at `lib/code-graph-db.ts:305-328` deletes existing nodes per file and inserts new ones in one transaction.
3. `symbolId = hash(filePath + fqName + kind)` at `lib/indexer-types.ts:82-85`. Line number is NOT part of the key.
4. `capturesToNodes()` at `lib/structural-indexer.ts:796-812` maps every parser capture to a node via the same hash function.
5. The tree-sitter parser at `lib/tree-sitter-parser.ts:498-520` and the regex fallback both emit captures with potentially generic `fqName` values (e.g., the body of an unnamed inline `if` arrow function inside a method may collapse to `method:WorkingSetTracker.if`).
6. When two captures inside one file share `(filePath, fqName, kind)`, both insertions hit the UNIQUE constraint → `UNIQUE constraint failed: code_nodes.symbol_id`.

**Empirical duplicates observed:**

- `structural-indexer.ts`: duplicate `method`/`class:method` and `function`/`foo` captures.
- `tree-sitter-parser.ts`: duplicate `class:body` and `method:TreeSitterParser.if` captures.
- `working-set-tracker.ts`: duplicate `method:WorkingSetTracker.if`, `parameter:WorkingSetTracker.if.existing`, and `method:WorkingSetTracker.for` captures.

This is a separate, pre-existing bug — unrelated to packet 012 — but exposed because these 3 files were among the 33 stale files the scan attempted to persist.

### 4.3 Bug #3 (P2) — `fullReindexTriggered` field is operator-hostile

`fullReindexTriggered` only fires when the git HEAD changed during incremental mode (`handlers/scan.ts:171,173,248`). It is correctly `false` when the caller explicitly passes `incremental:false`, but the response payload exposes no field for the caller's intent or the effective mode. An operator reading the response cannot distinguish "scan ran in incremental mode and didn't trigger reindex" from "scan ran in full mode by request". This is what initially mis-led this session into thinking the `incremental` flag wasn't honored at the handler level.

### 4.4 Things that are NOT the cause (alternative hypotheses ruled out)

| Hypothesis | Verdict | Evidence |
|---|---|---|
| Schema migration silently dropped rows | **Ruled out** | `code-graph-db.ts` migration only adds `file_mtime_ms` and metadata; no `DELETE`/`TRUNCATE` paths. `lastPersistedAt` derives from `MAX(indexed_at)` in `code_files`. |
| UNIQUE crash cascaded and aborted full-scan cleanup mid-flight | **Ruled out as primary** (retained as secondary risk) | Non-incremental cleanup runs BEFORE per-file indexing. `replaceNodes()` transactions are per-file; failures don't abort the cleanup pass. However, `upsertFile()` runs before `replaceNodes()`, so failed files can have updated metadata without coherent nodes/edges → secondary consistency risk. |
| Racing scan / concurrent MCP request | **Not supported** (deferred hardening) | No scan-level mutex / lock / queue / in-flight guard found. The deterministic 33-file outcome is fully explained by the stale-gate path; no race needed. |
| `.gitignore` ignores the entire `.opencode/` tree | **Ruled out** | Root `.gitignore` explicitly UN-ignores `.opencode/`. Nested `.gitignore` files exclude only `dist/`, caches, etc. Filesystem reproduction yielded 1,425 candidates. |
| Excludes are correctly aggressive; 33 is the right answer | **Ruled out** | Reproduced the post-exclude walk with the indexer's exact `ignore@5.3.2` setup, exact include globs, exact default excludes. Result: 1,425 unique files (1,205 .ts, 4 .tsx, 34 .js, 13 .mjs, 34 .cjs, 31 .py, 104 .sh). 4,272 gitignored entries + 204 default-excluded entries. |
| DB cleanup retained old 26K rows; unchanged 473MB DB size proves it | **Ruled out** | Live SQLite reports 33 `code_files`, 809 `code_nodes`, 376 `code_edges` — DB DID prune. Unchanged file size is just SQLite not auto-shrinking after DELETE; `getDbStats()` reports raw `statSync(dbPath).size` (`code-graph-db.ts:683-689`). |

### 4.5 dist verification (final cross-check)

The running MCP server's `dist/` tree was inspected to confirm the source-level findings match the shipped build:

| Built file | Finding |
|---|---|
| `dist/code-graph/lib/structural-indexer.js:12` | Imports `isFileStale` ✅ |
| `dist/code-graph/lib/structural-indexer.js:1036` | Still has unconditional `if (!isFileStale(file)) continue;` ✅ Bug #1 confirmed in dist |
| `dist/code-graph/lib/indexer-types.js:45` | Includes `**/z_future/**`, `**/z_archive/**`, `**/mcp-coco-index/mcp_server/**` ✅ Packet 012 in dist |
| `dist/code-graph/handlers/scan.js:133-137` | Computes `fullReindexTriggered` and `effectiveIncremental` ✅ |
| `dist/code-graph/handlers/scan.js:141` | Calls `indexFiles(config)` with no options ✅ Bug confirmed in dist |
| `dist/code-graph/handlers/scan.js:203` | Exposes `fullReindexTriggered`; no `fullScanRequested` / `effectiveIncremental` ✅ Bug #3 confirmed in dist |

**Verdict:** The 33-file outcome is the current shipped state, not a stale build mismatch. Source-level findings translate directly to the running server.

---

## 5. Recommended Fixes

### 5.1 F1 — `IndexFilesOptions { skipFreshFiles?: boolean }`

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

**Why this design:** The bypass lives in `indexFiles()` so scan-mode is visible at the abstraction boundary that owns file read/parse work. Default `true` preserves current behavior for `ensure-ready.ts:190` and the test fixtures.

### 5.2 F2 — Dedupe in `capturesToNodes()` (Option A)

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

**Why Option A over alternatives:**

- **Option B (line-suffixed `symbolId` on collision):** Preserves more nodes but mixes identity semantics; some IDs become edit-position-sensitive, undermining graph stability.
- **Option C (fix at parser layer — richer fqName via scope):** Best semantic endpoint but bigger surgery across AST traversal, regex fallback parity, edge extraction, and tests. Should be follow-up work after the crash is blocked.
- **Option A (chosen):** Smallest patch. Keeps `symbolId` stable. Preserves first-seen node. Prevents DB crashes across both parser backends. Lossy when two distinct logical symbols share `(filePath, fqName, kind)` — but current graph identity already cannot represent both without changing identity, so this is consistent with existing semantics.

`extractEdges()` still receives raw captures (`tree-sitter-parser.ts:648`, `structural-indexer.ts:684`). Acceptable for the minimal crash fix because edge source/target lookup is node-based.

### 5.3 F3 — Additive scan response fields (operator clarity)

In `handlers/scan.ts:21-33` (response shape) and `handlers/scan.ts:248-261` (population), add:

```ts
fullScanRequested: boolean;       // !args.incremental === true
effectiveIncremental: boolean;    // already computed at line 177
```

Keep `fullReindexTriggered` unchanged (preserves backward compatibility for any consumers parsing it strictly).

---

## 6. Edge Cases Considered

Stress-tested in iteration 3 against legitimate duplicate-symbol scenarios:

| Scenario | Verdict |
|---|---|
| TypeScript function overloads (multiple signatures, one impl) | Acceptable — current identity already collapses them. |
| Class with same-name method on different overloaded interfaces | Acceptable — same reason. |
| Python `@overload` decorators | Acceptable — parser doesn't distinguish; unchanged behavior. |
| Anonymous functions / closures with name collisions (`const handler = () => {...}` × 2) | Acceptable — first-seen wins; operator can rename. |
| Test files with `describe.each` / generated tests | Acceptable — tests don't typically index symbol-by-symbol. |

Iteration 3 verdict: Option A's dedup is the right minimal-crash-guard; richer parser scoping is deferred to a future packet.

---

## 7. Implementation Plan

### 7.1 Spec folder topology

**Recommended host:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/`

**Why nested under packet 012:** This is a direct remediation of packet 012's behavior interaction. A sibling `013-...` slot is taken (`006-claude-hook-findings-remediation` exists). Nesting under 012 also keeps the lineage explicit for future readers.

**Level:** 3 (≥500 LOC across indexer + handler + tests + dist + docs; affects observability surfaces).

**Required files:** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` (post-impl), `description.json`, `graph-metadata.json`.

### 7.2 Sequenced tasks

| ID | Type | File | Change | Est. diff |
|---|---|---|---|---|
| T-001 | code | `lib/structural-indexer.ts:1227` | Add `IndexFilesOptions` interface + parameter | ≤8 lines |
| T-002 | code | `lib/structural-indexer.ts:1249` | Conditional stale-gate | ≤2 lines |
| T-003 | code | `handlers/scan.ts:183` | Pass `{skipFreshFiles: effectiveIncremental}` | 1 line |
| T-004 | code | `lib/structural-indexer.ts:796-812` | Dedupe in `capturesToNodes()` | ≤10 lines |
| T-005 | code | `handlers/scan.ts:21-33,248-261` | Add `fullScanRequested` + `effectiveIncremental` fields | ≤6 lines |
| T-006 | test | `tests/structural-contract.vitest.ts` | `indexFiles` options tests (3 cases: skipFreshFiles=true/false/default) | ~40 lines |
| T-007 | test | `tests/structural-contract.vitest.ts` | scan handler integration test (incremental:false → ≥1000 files) | ~30 lines |
| T-008 | test | `tests/tree-sitter-parser.vitest.ts` | `capturesToNodes` dedupe regression test (drops dups, preserves moduleNode) | ~20 lines |
| T-009 | build | `mcp_server/` | `npm run build` | — |
| T-010 | verify | runtime | Restart MCP; run `code_graph_scan({incremental:false})`; assert `filesScanned >= 1000` and zero errors | — |
| T-011 | doc | `code-graph/README.md` surface matrix | Document new response fields | ~8 lines |

**Ordering rationale:** Source-code changes first (T-001..T-005) keep surgery contained. Tests after (T-006..T-008) so the regression-net is in place before build. T-009/T-010 are the live-system verification checkpoint. T-011 last so docs reflect the shipped contract.

### 7.3 Operator runbook

```
1. Restart OpenCode (loads the rebuilt MCP server).
2. From a fresh Claude/OpenCode session:
     mcp__spec_kit_memory__code_graph_scan({
       rootDir: "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public",
       incremental: false
     })
3. Verify response:
     filesScanned >= 1000 (expect ~1425)
     filesIndexed >= 1000
     errors: []  (no UNIQUE constraint failed)
     fullScanRequested: true (NEW)
     effectiveIncremental: false (NEW)
     fullReindexTriggered: false (unchanged — git head didn't change)
4. mcp__spec_kit_memory__code_graph_status to confirm totalFiles >= 1000.
5. Re-run step 2 → assert same count (idempotent).
6. Optional: VACUUM the SQLite DB at mcp_server/database/code-graph.sqlite to reclaim disk.
```

---

## 8. Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | New `IndexFilesOptions` parameter breaks downstream `Parameters<typeof indexFiles>` consumers | L | M | Optional param + default → backward-compatible |
| R2 | Dedup silently drops legitimately distinct symbols (overloads, closures) | M | M | Log dropped duplicates via debug channel; vitest covers known overload patterns; defer richer fqName to follow-up packet |
| R3 | Scan duration explodes (~1,425 files vs 33; was 47s for 33) | M | M | Profile during T-010; if >5min, batch persistence in chunks |
| R4 | New response fields break consumers parsing scan response strictly | L | L | Additive only; document as additive change in code-graph/README.md |
| R5 | Existing 473MB DB has stale rows from old 26K scan; one fixed scan + VACUUM may not be sufficient | L | L | One-time `code_graph_scan({incremental:false})` REPLACES the active set; pre-existing stale rows are deleted by the cleanup; VACUUM is cosmetic-only follow-up |
| R6 | The 3 originally-erroring files now succeed via dedup but the resulting graph is less complete for them | M | L | Quantify: record dropped-symbol count per file in implementation-summary; defer richer parser identity to future parser-completeness packet |
| R7 | `upsertFile()` ran before `replaceNodes()` failed → 3 files have updated metadata without coherent nodes/edges (consistency drift) | L | M | Post-fix scan re-runs `replaceNodes()` cleanly; verify via `code_graph_query({operation:'outline', subject:<each errored file>})` |
| R8 | No scan-level mutex; concurrent scans could race | L | L | Defer to future hardening packet if post-fix repeated/concurrent scans show instability |

---

## 9. Acceptance Criteria

```
AC-1: code_graph_scan({rootDir:repo, incremental:false}) returns filesScanned >= 1000
AC-2: scan response includes fullScanRequested:true AND effectiveIncremental:false
AC-3: scan response errors[] is empty
AC-4: code_graph_status reports totalFiles in [1000, 3000] range
AC-5: Re-running scan immediately returns same totalFiles (idempotent)
AC-6: Existing vitest suites all pass (structural-contract 20+ tests, tree-sitter-parser 17+ tests)
AC-7: New tests added: at least 3 indexFiles option tests + 1 dedup regression test
AC-8: No regressions in code_graph_query, code_graph_context, code_graph_status response shapes
```

---

## 10. Test Plan (vitest snippets)

### 10.1 `tests/structural-contract.vitest.ts` additions

```typescript
describe('indexFiles options', () => {
  it('returns ALL post-exclude files when skipFreshFiles=false', async () => {
    // Setup: minimal IndexerConfig with 3 mock files all DB-fresh (isFileStale = false)
    // Stub isFileStale to always return false
    const results = await indexFiles(config, { skipFreshFiles: false });
    expect(results.length).toBe(3);
  });

  it('skips fresh files when skipFreshFiles=true (default)', async () => {
    // Setup: 3 files, 1 stale, 2 fresh
    const results = await indexFiles(config); // default
    expect(results.length).toBe(1);
  });

  it('preserves stale-only behavior when option omitted', async () => {
    // Same as above but with explicit {} options
    const results = await indexFiles(config, {});
    expect(results.length).toBe(1);
  });
});

describe('scan handler integration — incremental:false', () => {
  it('returns >= N files matching post-exclude count', async () => {
    const result = await handleScan({ rootDir: fixtureRoot, incremental: false });
    expect(result.filesIndexed).toBeGreaterThanOrEqual(fixtureExpectedCount);
    expect(result.fullScanRequested).toBe(true);
    expect(result.effectiveIncremental).toBe(false);
  });

  it('idempotent: second scan returns same count', async () => {
    const r1 = await handleScan({ rootDir: fixtureRoot, incremental: false });
    const r2 = await handleScan({ rootDir: fixtureRoot, incremental: false });
    expect(r2.filesIndexed).toBe(r1.filesIndexed);
  });
});
```

### 10.2 `tests/tree-sitter-parser.vitest.ts` additions

```typescript
describe('capturesToNodes dedupe (Bug #2 regression)', () => {
  it('drops duplicate (filePath, fqName, kind) captures, preserving first', () => {
    const captures = [
      { fqName: 'Foo.if', kind: 'method', startLine: 10, endLine: 12 },
      { fqName: 'Foo.if', kind: 'method', startLine: 20, endLine: 22 }, // duplicate
    ];
    const nodes = capturesToNodes(filePath, captures, lines);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].startLine).toBe(10); // first-seen preserved
  });

  it('does not dedupe across kinds', () => {
    const captures = [
      { fqName: 'foo', kind: 'function', startLine: 1, endLine: 3 },
      { fqName: 'foo', kind: 'variable', startLine: 5, endLine: 5 },
    ];
    const nodes = capturesToNodes(filePath, captures, lines);
    expect(nodes).toHaveLength(2);
  });

  it('regression: indexing structural-indexer.ts produces no duplicate symbolIds', async () => {
    const result = await parseFile('lib/structural-indexer.ts');
    const ids = new Set();
    for (const node of result.nodes) {
      expect(ids.has(node.symbolId)).toBe(false);
      ids.add(node.symbolId);
    }
  });
});
```

---

## 11. Open Questions Resolved

| Source | Question | Resolution |
|---|---|---|
| Iter-1 | What minimal API change carries `effectiveIncremental` into `indexFiles()`? | F1: `IndexFilesOptions { skipFreshFiles?: boolean }`, default true |
| Iter-1 | Dedup duplicates / line-suffix / parser-layer fix? | F2 Option A — dedup in `capturesToNodes()` |
| Iter-1 | Rename `fullReindexTriggered`? | F3 — supplement, don't rename |
| Iter-2 | Semantic parser identity repair? | Deferred to future parser-completeness packet |
| Iter-3 | Add discovered-candidate count to response? | Deferred to packet 014 if operator confusion persists |
| Iter-3 | Add `method_signature` to `JS_TS_KIND_MAP`? | Deferred to parser-completeness packet |
| Iter-4 | Exact dropped-symbol count per file? | Deferred to implementation-summary diagnostics |

---

## 12. Ruled-Out Directions

- ❌ Schema migration silently dropped rows
- ❌ UNIQUE crash cascaded and aborted full-scan cleanup mid-flight (retained as secondary consistency risk R7)
- ❌ Racing scan / concurrent MCP request (deferred to future hardening packet R8)
- ❌ `.gitignore` ignores entire `.opencode/` tree
- ❌ Excludes are correctly aggressive — 33 is the right answer
- ❌ DB cleanup retained old rows; unchanged 473MB proves it
- ❌ Renaming `fullReindexTriggered` (chose supplement over rename to preserve consumers)
- ❌ Option B for symbol dedupe (line-suffixed IDs — undermines graph stability)
- ❌ Option C for symbol dedupe (parser-layer fqName fix — bigger surgery, deferred)

---

## 13. Citations (file:line)

### Bug #1 evidence
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts:124,128,171,177,183,193-201`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1227,1246-1249`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/ensure-ready.ts:190`

### Bug #2 evidence
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts:68,70,305-328`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:82-85`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:796-812`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/tree-sitter-parser.ts:498-520,648`

### dist verification
- `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/lib/structural-indexer.js:12,1036`
- `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/lib/indexer-types.js:45`
- `.opencode/skill/system-spec-kit/mcp_server/dist/code-graph/handlers/scan.js:133-137,141,203`

### Packet 012 source
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/session-handover-2026-04-23.md`

---

## 14. Convergence Report

- **Stop reason:** maxIterationsReached (5 of 5)
- **Total iterations:** 5
- **newInfoRatio trajectory:** 0.88 → 0.62 → 0.41 → 0.34 → 0.18
- **Rolling avg(3 latest):** 0.31 (above 0.05 threshold but trending strongly toward convergence; one more iteration would likely have triggered composite STOP)
- **Questions answered:** 5/5 primary + all design/verification follow-ups resolved or formally deferred
- **Convergence threshold:** 0.05 (not reached; max-iter cap preempted)
- **Status:** All 5 iterations returned `status: insight` (no thoughts/partials/errors)
- **Codex tokens used (sum):** ~500K across 5 dispatches (123K + 66K + 89K + 156K + 66K)

---

## 15. Next Steps

| Condition | Suggested command |
|---|---|
| Implement the recommended fix | `/spec_kit:plan` then `/spec_kit:implement` against nested packet `012/002-incremental-fullscan-recovery` |
| Want a code review of this research | `/spec_kit:deep-review` against the 012 packet |
| Refresh memory index | `/memory:save` |

---

## 16. Appendix — Iteration File Index

- `iterations/iteration-001.md` — Source code reading + filesystem reproduction (12.5 KB)
- `iterations/iteration-002.md` — Fix design with code-block diffs (14.7 KB)
- `iterations/iteration-003.md` — Caller verification + edge cases + vitest snippets (20.5 KB)
- `iterations/iteration-004.md` — Spec folder + tasks + risks + acceptance (15.8 KB)
- `iterations/iteration-005.md` — dist verification + alt hypotheses + executive summary (9.4 KB)

---

## 17. Methodology Notes

- **Executor:** cli-codex (gpt-5.4, reasoning=high, service_tier=fast, sandbox=workspace-write, approval=never, timeout=900s).
- **Per-iteration budget:** 12 tool calls, 15 minutes wall-clock.
- **Externalized state:** `deep-research-state.jsonl` (append-only), `deltas/iter-NNN.jsonl` (per-iteration structured stream), `iterations/iteration-NNN.md` (narrative).
- **Reducer:** Skipped — `resolveArtifactRoot` always allocates the next pt slot rather than locating the active one. This is a `sk-deep-research` workflow integration bug (out of scope here, worth filing separately). Compensated by manually drafting iteration prompts with prior findings inlined.
- **Convergence:** Composite 3-signal vote (rolling avg + MAD noise floor + question coverage) was not formally evaluated mid-loop because the user requested a fixed 5 iterations.

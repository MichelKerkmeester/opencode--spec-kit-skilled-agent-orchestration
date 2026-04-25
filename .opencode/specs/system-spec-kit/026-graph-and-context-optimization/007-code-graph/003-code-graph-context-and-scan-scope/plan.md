---
title: "I [system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/plan]"
description: "Three scoped fixes: stale-graph highlights computation, scan exclude expansion + .gitignore awareness, and surface matrix doc."
trigger_phrases:
  - "026/003/003 plan"
  - "code graph context plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope"
    last_updated_at: "2026-04-23T11:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan drafted"
    next_safe_action: "Dispatch codex"
    completion_pct: 5
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Code Graph Context + Scan Scope Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Five single-purpose changes across three concern areas: (A) extend highlights computation to stale graphs in session-snapshot, (B) expand default scan excludes + add .gitignore awareness in indexer, (C) restore full-scan correctness by threading `IndexFilesOptions { skipFreshFiles }` and deduping symbol IDs within a file (formerly sub-phase 001-incremental-fullscan-recovery), (D) add cross-file scan-batch dedup + `INSERT OR IGNORE` persistence (formerly sub-phase 002-cross-file-dedup-defense), and (E) write a one-page surface matrix doc. Existing tests are the regression guard; new tests cover the new behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Pass Criteria |
|------|---------------|
| Stale highlights | session-snapshot returns highlights for status='stale'; new vitest case asserts |
| Scan excludes | New default excludes (z_future, z_archive, mcp-coco-index/mcp_server) are skipped; new vitest asserts |
| .gitignore | Scanner respects .gitignore patterns; new vitest asserts |
| Full-scan correctness | `indexFiles()` with `skipFreshFiles:false` parses all post-exclude files; scan handler passes effective mode; response includes `fullScanRequested` and `effectiveIncremental` |
| Intra-file symbol dedup | `capturesToNodes()` `seenSymbolIds` guard prevents duplicate symbolId values per file |
| Cross-file symbol dedup | `globalSeenIds` sweep in `indexFiles()` removes scan-batch duplicates after TESTED_BY edge construction |
| DB insert tolerance | `replaceNodes()` uses `INSERT OR IGNORE INTO code_nodes`; residual DB-level duplicates do not abort the transaction |
| Surface doc | Matrix exists in chosen location |
| Build | `npm run build` clean (compiled .js matches .ts) |
| Vitest | All existing + new tests green |
| Strict spec validation | 0/0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Technical Context

The code-graph subsystem lives under `.opencode/skill/system-spec-kit/mcp_server/code-graph/`. Source is TypeScript; compiled output goes to `dist/`. Three layers are touched:
1. **Snapshot layer** (`lib/session/session-snapshot.ts`): builds the structural-context payload returned to OpenCode plugin and MCP clients.
2. **Indexer config** (`code-graph/lib/indexer-types.ts`): default excludes that govern what gets walked.
3. **Indexer walk** (`code-graph/lib/structural-indexer.ts`): the actual recursive directory walk that needs gitignore awareness.

The OpenCode compact-code-graph plugin path remains unchanged — improving session-snapshot enriches what flows through the existing minimal payload.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Stale highlights (Finding A)
1. Open `lib/session/session-snapshot.ts`. Find the `status === 'ready'` gate around line 159 of the compiled .js.
2. Change to `status === 'ready' || status === 'stale'`. Mark the stale variant by appending `(stale)` to the summary when freshness is stale.
3. The SQL at `code-graph-db.ts` is unchanged — works for both states.
4. Add vitest case asserting highlights present + summary contains `(stale)` marker when graph is stale.
5. Run focused vitest: must pass.

### Phase 2 — Scan excludes + gitignore (Finding B)
1. Open `code-graph/lib/indexer-types.ts`. Extend `DEFAULT_EXCLUDE_PATHS` (or equivalent) with: `**/z_future/**`, `**/z_archive/**`, `**/mcp-coco-index/mcp_server/**`. Match the existing pattern format precisely.
2. Open `code-graph/lib/structural-indexer.ts`. Add `.gitignore` parsing using the `ignore` package. If `ignore` is not in deps, add it (small package).
3. The walk at line ~901 of the compiled .js: when entering a directory, read `.gitignore` if present, build an `ignore` instance, and skip entries matching.
4. Cache parsed `.gitignore` per directory to avoid re-parsing during recursion.
5. Add vitest cases:
   - Walk skips `z_future`, `z_archive`, `mcp-coco-index/mcp_server` paths.
   - Walk respects a `.gitignore` containing a unique pattern (e.g., `*.bak-test`).

### Phase 3 — Surface matrix doc (Finding C)
1. Author a short markdown doc at the code-graph SURFACES doc (location TBD by Codex) (or similar — Codex picks the right location based on existing layout).
2. Include a 4-column matrix: surface name / payload includes summary / payload includes highlights / typical caller.
3. Reference the file:line locations Codex cited in the investigation.

### Phase 4 — Incremental full-scan recovery (formerly 001-incremental-fullscan-recovery)
1. Add `IndexFilesOptions { skipFreshFiles?: boolean }` to `structural-indexer.ts`; condition `isFileStale()` on `skipFreshFiles` (default `true`).
2. Pass `{ skipFreshFiles: effectiveIncremental }` from `scan.ts`; expose `fullScanRequested` and `effectiveIncremental` in `ScanResult`.
3. Add `seenSymbolIds` dedupe in `capturesToNodes()` via `flatMap()`.
4. Add tests: 3 `indexFiles` option cases + 2 scan handler integration cases + 3 `capturesToNodes()` dedupe cases.
5. Build and inspect dist for `skipFreshFiles` and `fullScanRequested`.
6. Update code graph `README.md`.

### Phase 5 — Cross-file dedup defense (formerly 002-cross-file-dedup-defense)
1. Add `globalSeenIds` sweep in `indexFiles()` after the TESTED_BY edge block; log dropped count when nonzero.
2. Change `replaceNodes()` insert to `INSERT OR IGNORE INTO code_nodes`.
3. Add Layer 1 cross-file dedup tests in `structural-contract.vitest.ts`.
4. Create `tests/code-graph-db.vitest.ts` with Layer 2 DB duplicate-tolerance tests.
5. Build, focused Vitest, dist grep for `globalSeenIds` and `INSERT OR IGNORE`.

### Phase 6 — Verify + canonical save
1. `npm run build` in `mcp_server` → green.
2. Full focused vitest for session-snapshot + structural-indexer + DB tests → green.
3. `validate.sh --strict` on this packet → 0/0.
4. `generate-context.js` → exit 0.
5. Update `implementation-summary.md` (replace placeholder), mark tasks [x] with evidence, update parent handover.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Extend existing vitest files; do not create new ones. Target: 3 new test cases (one per REQ-001/002/003).

| Test | Asserts |
|------|---------|
| `stale graph still returns highlights` | `getSessionSnapshot()` with status='stale' returns non-empty highlights array; summary contains `(stale)` marker |
| `default scan excludes skip z_future / z_archive / mcp-coco-index/mcp_server` | A test scan rooted at a fixture containing those paths does NOT walk them |
| `scan respects .gitignore` | Fixture with `.gitignore` containing `*.test-bak` produces zero indexed `*.test-bak` files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| Existing session-snapshot tests | Confirmed exist via earlier session |
| Existing structural-indexer tests | Confirmed exist via earlier session |
| `ignore` npm package | May or may not be installed; check package.json. If absent, add (small + well-maintained) |
| Investigation findings (file:line citations) | Available from Codex investigation 2026-04-23T11:50Z |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` of single commit. No database migration; no live system state. Existing graph DB is untouched (operator can re-scan when desired to apply the new excludes).
<!-- /ANCHOR:rollback -->

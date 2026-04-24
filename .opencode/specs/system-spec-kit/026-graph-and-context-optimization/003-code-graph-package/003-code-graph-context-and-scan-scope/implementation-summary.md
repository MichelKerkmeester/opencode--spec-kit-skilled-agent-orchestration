---
title: "...6-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary]"
description: "Stale code-graph snapshots now include highlights, default scan scope excludes archived/future/coco-index server paths, scans honor .gitignore, and the two context surfaces are documented."
trigger_phrases:
  - "code graph context complete"
  - "026/003/003 implementation"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope"
    last_updated_at: "2026-04-23T14:30:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Full-scan readiness reopened pending recovery rerun"
    next_safe_action: "Land 012/002, rerun full code_graph_scan, record baseline"
    blockers:
      - "Operator-driven code_graph_scan returns 33 files instead of expected ~1425 due to stale-gate bug in indexFiles()"
      - "3 UNIQUE constraint errors during scan persistence for indexer-self files"
    completion_pct: 85
    open_questions: []
    answered_questions:
      - "Stale graphs use the same getGraphStats() aggregate path as ready graphs and mark summary freshness with (stale)."
      - "Default excludes now skip z_future, z_archive, and mcp-coco-index/mcp_server paths."
      - "The OpenCode plugin remains in minimal mode; the shared snapshot payload is enriched instead."
      - "Post-exclude file count empirically reproduces at 1,425 (1205 .ts + 4 .tsx + 34 .js + 13 .mjs + 34 .cjs + 31 .py + 104 .sh) using the indexer's own ignore@5.3.2 setup. 33 is a regression, not the right answer."
      - "Fix design: thread IndexFilesOptions { skipFreshFiles?: boolean } (default true) into indexFiles(); scan handler passes { skipFreshFiles: effectiveIncremental }; capturesToNodes() dedupes via seenSymbolIds Set; scan response gains additive fullScanRequested + effectiveIncremental fields."
    deep_research:
      packet: "research/007-deep-review-remediation-pt-04"
      iterations: 5
      stop_reason: "maxIterationsReached"
      newInfoRatio_trajectory: [0.88, 0.62, 0.41, 0.34, 0.18]
      research_md: "research/007-deep-review-remediation-pt-04/research.md"
      executor: "cli-codex / gpt-5.4 / reasoning=high / service_tier=fast"
      tokens_used: "~500K"
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Code Graph Context + Scan Scope Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-code-graph-context-and-scan-scope |
| **Completed** | 2026-04-23 |
| **Level** | 2 |
| **Outcome** | Code and docs landed, but authoritative full-scan readiness remains blocked until the recovery rerun is recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `session-snapshot.ts` now computes structural highlights for both `ready` and `stale` graph states, using the existing `getGraphStats()` SQL aggregate path. Stale summaries include `(stale)` so compact consumers can distinguish freshness.
- `indexer-types.ts` default excludes now include `**/z_future/**`, `**/z_archive/**`, and `**/mcp-coco-index/mcp_server/**` alongside the existing excludes.
- `structural-indexer.ts` now honors `.gitignore` files during recursive walking. Parsed ignore matchers are cached per directory and applied additively with the existing default exclude globs.
- `structural-indexer.ts` also logs a scan-scope one-liner: scanned file count plus default-excluded and gitignored entry counts.
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/SURFACES.md` documents the MCP startup/bootstrap surface and OpenCode compact-code-graph minimal resume surface.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation stayed inside the approved source/test/doc scope. I read the packet docs first, read the target source and compiled JS paths, ran the focused baseline Vitest before changes, then applied small source edits and added three focused tests:

- Stale graph snapshot returns highlights and a `(stale)` marker.
- Default scan excludes skip `z_future`, `z_archive`, and `mcp-coco-index/mcp_server`.
- `.gitignore` skips a unique `*.test-bak.ts` fixture.

`npm install --save ignore --package-lock=false` was attempted first but could not complete under the restricted registry/cache environment. `ignore` was added to `mcp_server/package.json` as a direct dependency (`^5.3.2`), and the runtime code prefers that direct dependency. A fallback to the local ESLint transitive copy keeps this sandbox verifiable until dependencies are refreshed normally.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Keep the OpenCode compact plugin in minimal mode | The plugin's `RESUME_MODE='minimal'` is intentional token discipline and out of scope. | Minimal payload now benefits from richer snapshot data without plugin changes. |
| Reuse `getGraphStats()` for stale highlights | The aggregate SQL is freshness-agnostic and already powers ready highlights. | Stale graphs surface useful context while clearly marked stale. |
| Use `ignore` package semantics | `.gitignore` matching is nuanced; package semantics are safer than a hand-rolled matcher. | Scanner respects root and nested `.gitignore` files during recursion. |
| Add one scan-scope log line | Operators need a cheap way to see whether excludes are working. | New scans report scanned count and excluded counts without rescanning the DB here. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command / Evidence | Result |
|-------|--------------------|--------|
| Baseline focused Vitest | `./node_modules/.bin/vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts` before edits | 17 tests passed |
| Red test proof | Temporarily reverted stale gate, ran `vitest run tests/structural-contract.vitest.ts -t 'returns stale highlights and freshness marker'` | Failed as expected, then passed after restoring |
| Build | `npm run build` in `mcp_server` | Passed |
| Focused Vitest | `./node_modules/.bin/vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts` | 20 tests passed |
| Surface doc | `.opencode/skill/system-spec-kit/mcp_server/code-graph/SURFACES.md` | Created |
| Strict validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../003-code-graph-context-and-scan-scope --strict` | Passed with 0 errors / 0 warnings |
| Canonical save | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json ...` | Exit 0; embedding calls deferred because network fetch failed, BM25/FTS indexing path used |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The existing graph DB was not rescanned, and the later 33-file regression/duplicate-symbol recovery work means current scan counts are not authoritative until a live full-scan rerun is recorded after the recovery packet lands.
- The local sandbox could not complete a registry-backed `npm install`; package metadata is updated, and a normal dependency refresh should install `ignore` directly.
- `.gitignore` matching is additive with default excludes. Explicit custom `excludeGlobs` remain the caller override surface for scan policy.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:sub-phase-summaries -->
## Absorbed Sub-phase Record

### 001-incremental-fullscan-recovery

**Status**: Implementation complete (86%); live scan acceptance deferred to operator post-restart.
**Priority**: P0 — Level 3 packet.

**Problem**: `indexFiles()` unconditionally applied `isFileStale()` even when `incremental:false` was requested, so full scans parsed only stale files and pruned the DB to 33 files. Separately, `capturesToNodes()` emitted duplicate `symbolId` values for captures sharing the same `(filePath, fqName, kind)`, causing `code_nodes.symbol_id` UNIQUE constraint failures.

**What was built**:
- `structural-indexer.ts` exports `IndexFilesOptions { skipFreshFiles?: boolean }` (default `true`). The stale-gate (`isFileStale()`) is now conditioned on `skipFreshFiles`, so `indexFiles(config, { skipFreshFiles: false })` parses all post-exclude candidates.
- `scan.ts` passes `{ skipFreshFiles: effectiveIncremental }` to `indexFiles()` and exposes additive response fields `fullScanRequested` and `effectiveIncremental` while keeping `fullReindexTriggered` unchanged.
- `capturesToNodes()` tracks `seenSymbolIds` via `flatMap()`; the first-seen node for any `(filePath, fqName, kind)` identity wins and duplicates are dropped before DB insertion.
- 30 new vitest tests across `structural-contract.vitest.ts` (3 option + 2 integration) and `tree-sitter-parser.vitest.ts` (3 dedupe); focused suite passed 30/30.
- `dist/code-graph/lib/structural-indexer.js` and `dist/code-graph/handlers/scan.js` confirmed to contain new symbols.
- Code graph `README.md` updated to document `IndexFilesOptions` and the new response fields.

**Key decisions**:
- ADR-001: Option A dedupe — minimal patch preserving stable IDs; parser-layer identity redesign deferred.
- ADR-002: Supplement `fullScanRequested` + `effectiveIncremental`; do not rename `fullReindexTriggered`.

**Known blocker**: Full `npx vitest run` suite fails in out-of-scope `tests/copilot-hook-wiring.vitest.ts` (hook-path assertion mismatch); this is not a regression from this packet. AC-1, AC-4, AC-5 (live scan file counts after MCP restart) remain operator-owned.

---

### 002-cross-file-dedup-defense

**Status**: Implementation complete (92%); live scan acceptance deferred to operator post-restart.
**Priority**: P0 — Level 2 packet.

**Problem**: Even after 001-incremental-fullscan-recovery, live full scans still reported `UNIQUE constraint failed: code_nodes.symbol_id` for hundreds of files. Standalone parsing did not reproduce cross-file collisions, so the live-only discrepancy was undiagnosed. The packet applied defense-in-depth rather than blocking on further root-cause investigation.

**What was built**:
- **Layer 1 (scan-batch dedup)**: `structural-indexer.ts` `indexFiles()` now sweeps all `ParseResult.nodes` after the TESTED_BY cross-file edge construction block. The first file to own a `symbolId` in the current scan batch keeps it; later duplicate nodes are dropped and a `console.info` message reports the count when nonzero.
- **Layer 2 (DB insert tolerance)**: `code-graph-db.ts` `replaceNodes()` changed from `INSERT INTO code_nodes` to `INSERT OR IGNORE INTO code_nodes`. A residual DB-level duplicate `symbol_id` no longer aborts the file transaction; non-conflicting nodes in the same call still persist.
- 3 cross-file dedup tests added to `structural-contract.vitest.ts`; `tests/code-graph-db.vitest.ts` created with 2 direct DB duplicate-tolerance tests. Focused suite (`structural-contract.vitest.ts`, `tree-sitter-parser.vitest.ts`, `code-graph-db.vitest.ts`) passed 3 files / 33 tests.
- Build exited 0; `dist/code-graph/lib/structural-indexer.js` contains `globalSeenIds`; `dist/code-graph/lib/code-graph-db.js` contains `INSERT OR IGNORE`.

**Key decisions**:
- ADR-001: Defense in depth now over further root-cause investigation — live failure is high-impact, guards are narrow and reversible.
- ADR-002: `INSERT OR IGNORE` over `INSERT OR REPLACE` — first-owner-wins semantics; existing DB rows are never overwritten by a duplicate.

**Soft consistency tradeoff**: TESTED_BY edges are constructed before the Layer 1 sweep, so a TESTED_BY edge may reference a node that Layer 1 subsequently drops. This is accepted as preferable to a hard persistence crash.

**Known limitation**: AC-1 (zero `UNIQUE constraint failed` in `errors[]`) and AC-2 (`filesIndexed >= 1300`) remain operator-owned pending MCP restart.
<!-- /ANCHOR:sub-phase-summaries -->

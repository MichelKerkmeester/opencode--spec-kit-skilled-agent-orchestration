---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Code Graph Context + Scan Scope Remediation"
description: "Stale code-graph snapshots now include highlights, default scan scope excludes archived/future/coco-index server paths, scans honor .gitignore, and the two context surfaces are documented."
trigger_phrases:
  - "code graph context complete"
  - "026/007/012 implementation"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope"
    last_updated_at: "2026-04-23T13:30:00Z"
    last_updated_by: "claude-opus-4-7-via-cli-codex-gpt-5.4"
    recent_action: "Deep research (5 iters) identified 2 P0 bugs blocking the post-012 operator-driven scan: indexFiles() ignores caller's incremental flag (DB pruned to 33 stale-only files) and capturesToNodes() emits duplicate symbolIds for 3 indexer-self files (UNIQUE constraint failures)"
    next_safe_action: "Open nested packet 012/002-incremental-fullscan-recovery and implement T-001..T-011 from research/007-deep-review-remediation-pt-04/research.md"
    blockers:
      - "Operator-driven code_graph_scan returns 33 files instead of expected ~1425 due to stale-gate bug in indexFiles()"
      - "3 UNIQUE constraint errors during scan persistence for indexer-self files"
    completion_pct: 100
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
---
# Implementation Summary: Code Graph Context + Scan Scope Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-code-graph-context-and-scan-scope |
| **Completed** | 2026-04-23 |
| **Level** | 2 |
| **Outcome** | Complete |
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
| Strict validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .../012-code-graph-context-and-scan-scope --strict` | Passed with 0 errors / 0 warnings |
| Canonical save | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --json ...` | Exit 0; embedding calls deferred because network fetch failed, BM25/FTS indexing path used |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The existing graph DB was not rescanned, by request. Operators can apply the smaller scope later with `code_graph_scan` from the Public repo root.
- The local sandbox could not complete a registry-backed `npm install`; package metadata is updated, and a normal dependency refresh should install `ignore` directly.
- `.gitignore` matching is additive with default excludes. Explicit custom `excludeGlobs` remain the caller override surface for scan policy.
<!-- /ANCHOR:limitations -->

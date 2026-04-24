---
title: "...ystem-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/tasks]"
description: "Tasks T-01..T-24 across stale highlights, scan excludes + gitignore, incremental full-scan recovery (IndexFilesOptions + seenSymbolIds), cross-file dedup defense (globalSeenIds + INSERT OR IGNORE), surface doc, and verification."
trigger_phrases:
  - "026/003/003 tasks"
  - "code graph context tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope"
    last_updated_at: "2026-04-23T11:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implementation complete; verification evidence captured"
    next_safe_action: "Run future operator-driven code_graph_scan when ready"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Task Breakdown: Code Graph Context + Scan Scope Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending; `[x]` complete with evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-01** Read `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts` (and dist .js) end-to-end. Confirm the `status === 'ready'` gate location and the `code-graph-db.ts` SQL it calls. [EVIDENCE: source gate now at `lib/session/session-snapshot.ts:227`; compiled gate at `dist/lib/session/session-snapshot.js:159`; stats SQL aggregates are in `code-graph/lib/code-graph-db.ts:652-692` and compiled `dist/code-graph/lib/code-graph-db.js:523-555`.]
- [x] **T-02** Read `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts` and `structural-indexer.ts` (and dist .js). Identify the default-excludes data structure and the directory-walk loop. [EVIDENCE: defaults at `code-graph/lib/indexer-types.ts:117` and compiled `dist/code-graph/lib/indexer-types.js:45`; walk at `code-graph/lib/structural-indexer.ts:1177-1206` and compiled `dist/code-graph/lib/structural-indexer.js:970-1002`.]
- [x] **T-03** Run baseline focused vitest for both files; confirm all current tests pass before any change. [EVIDENCE: baseline `vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts` passed 17 tests across 2 files.]
- [x] **T-04** Check `mcp_server/package.json` for the `ignore` package. If absent, add it; if present, note version. [EVIDENCE: baseline package did not contain `ignore`; `package.json:53` now declares `"ignore": "^5.3.2"`. Registry install could not complete in the restricted sandbox, so code prefers direct dependency and falls back to the local ESLint transitive copy for verification.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-05** Modify `lib/session/session-snapshot.ts` highlights gate: extend from `status === 'ready'` to also handle `'stale'`. Append `(stale)` to the summary string when freshness is stale. Keep the SQL call unchanged. [EVIDENCE: `lib/session/session-snapshot.ts:227-242` calls `getGraphStats()` for ready and stale, builds top-kind highlights, and labels stale summaries via `freshnessLabel`.]
- [x] **T-06** Modify `code-graph/lib/indexer-types.ts` default excludes: add `**/z_future/**`, `**/z_archive/**`, `**/mcp-coco-index/mcp_server/**` (or equivalent path patterns matching the existing format). [EVIDENCE: `code-graph/lib/indexer-types.ts:117` includes all 3 new patterns in the existing `**/.../**` style.]
- [x] **T-07** Modify `code-graph/lib/structural-indexer.ts` walk to honor `.gitignore`. Use `ignore` package; cache parsed `.gitignore` per directory; skip entries that match. [EVIDENCE: `structural-indexer.ts:1115-1166` loads/caches ignore matchers and `:1177-1193` applies default and gitignore filters during the recursive walk.]
- [x] **T-08** Add 3 new vitest cases (one per REQ-001/002/003): stale-graph highlights, scan excludes, .gitignore awareness. [EVIDENCE: tests at `structural-contract.vitest.ts:89` and `tree-sitter-parser.vitest.ts:151,175`; final focused Vitest passed 20 tests, up from 17 baseline.]
- [x] **T-09** Author surface matrix doc at the code-graph SURFACES doc (location TBD by Codex) (or location chosen based on layout). [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/SURFACES.md` exists with the required 4-column matrix.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-10** `npm run build` in mcp_server. Compiled .js files reflect .ts changes. [EVIDENCE: `npm run build` passed with clean `tsc --build`; compiled dist lines include `dist/lib/session/session-snapshot.js:159`, `dist/code-graph/lib/indexer-types.js:45`, and `dist/code-graph/lib/structural-indexer.js:970-1002`.]
- [x] **T-11** Full focused vitest for session-snapshot and structural-indexer test files. Expect all existing + 3 new cases passing. [EVIDENCE: final focused Vitest passed 20 tests across `tests/structural-contract.vitest.ts` and `tests/tree-sitter-parser.vitest.ts`.]
- [x] **T-12** Run `validate.sh --strict` on this packet, then `generate-context.js` for canonical save. Update implementation-summary.md (replace placeholder) and parent handover.md with phase outcome. [EVIDENCE: implementation summary replaced; parent handover row added; strict validation passed 0 errors / 0 warnings; `generate-context.js --json ...` exited 0 with deferred embedding fallback due network fetch failures.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:absorbed-001 -->
#### Absorbed tasks: 001-incremental-fullscan-recovery

- [x] **T-13** Add `IndexFilesOptions { skipFreshFiles?: boolean }` to `structural-indexer.ts`; condition `isFileStale()` on `skipFreshFiles` (default `true`). [EVIDENCE: `structural-indexer.ts` exports `IndexFilesOptions`; `if (skipFreshFiles && !isFileStale(file)) continue`.]
- [x] **T-14** Pass `{ skipFreshFiles: effectiveIncremental }` from `scan.ts`; add `fullScanRequested` and `effectiveIncremental` to `ScanResult`. [EVIDENCE: `indexFiles(config, { skipFreshFiles: effectiveIncremental })`; `ScanResult` includes both fields.]
- [x] **T-15** Add `seenSymbolIds` dedupe in `capturesToNodes()` via `flatMap()`. [EVIDENCE: `seenSymbolIds` guard in `capturesToNodes()`; duplicate `(filePath, fqName, kind)` captures dropped.]
- [x] **T-16** Add 3 `indexFiles` option tests + 2 scan handler integration tests + 3 `capturesToNodes()` dedupe tests. [EVIDENCE: focused Vitest passed 30/30 across `structural-contract.vitest.ts` and `tree-sitter-parser.vitest.ts`.]
- [x] **T-17** Build and inspect dist for `skipFreshFiles` and `fullScanRequested`. [EVIDENCE: `npm run build` exited 0; dist greps found both tokens.]
- [x] **T-18** Update code graph `README.md` to document `IndexFilesOptions` and new scan response fields. [EVIDENCE: README documents response fields and `IndexFilesOptions`.]
- [B] **T-19** Run `npx vitest run` full suite. [BLOCKED: full suite fails in out-of-scope `tests/copilot-hook-wiring.vitest.ts`; focused packet tests pass 30/30.]
<!-- /ANCHOR:absorbed-001 -->

---

<!-- ANCHOR:absorbed-002 -->
#### Absorbed tasks: 002-cross-file-dedup-defense

- [x] **T-20** Add `globalSeenIds` sweep in `indexFiles()` after the TESTED_BY edge block; log dropped count when nonzero. [EVIDENCE: `structural-indexer.ts:1292` contains `globalSeenIds`; `console.info` count log in place.]
- [x] **T-21** Change `replaceNodes()` insert to `INSERT OR IGNORE INTO code_nodes`. [EVIDENCE: `code-graph-db.ts:309` contains `INSERT OR IGNORE INTO code_nodes`.]
- [x] **T-22** Add Layer 1 cross-file dedup tests in `structural-contract.vitest.ts`. [EVIDENCE: 3 cross-file dedup cases added.]
- [x] **T-23** Create `tests/code-graph-db.vitest.ts` with Layer 2 DB duplicate-tolerance tests. [EVIDENCE: 2 direct DB `replaceNodes()` tests; focused suite passed 3 files / 33 tests.]
- [x] **T-24** Build, focused Vitest, dist grep for `globalSeenIds` and `INSERT OR IGNORE`. [EVIDENCE: `npm run build` exited 0; `dist/code-graph/lib/structural-indexer.js` contains `globalSeenIds`; `dist/code-graph/lib/code-graph-db.js` contains `INSERT OR IGNORE`.]
<!-- /ANCHOR:absorbed-002 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 + P1 items in spec.md have evidence in implementation-summary.md.
- Existing vitest tests pass; new cases added (20 from T-01 to T-12; 30 incremental-fullscan focused; 33 cross-file-dedup focused).
- Strict validation 0/0; canonical save invoked.
- New scan with default excludes produces a substantially smaller graph (verifiable post-merge by user re-scanning).
- AC-1, AC-2, AC-4, AC-5 (live scan file counts) remain operator-owned pending MCP restart after build.
- T-19 (full vitest suite) blocked by out-of-scope `copilot-hook-wiring.vitest.ts` failure.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Implementation summary: `implementation-summary.md`
- Investigation source: in-conversation Codex investigation 2026-04-23T11:50Z
<!-- /ANCHOR:cross-refs -->

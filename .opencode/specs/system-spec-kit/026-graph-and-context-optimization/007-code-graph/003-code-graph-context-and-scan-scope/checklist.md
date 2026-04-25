---
title: "...m-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope/checklist]"
description: "Evidence-backed checklist for stale-highlights, scan excludes, gitignore awareness, and surface doc."
trigger_phrases:
  - "026/003/003 checklist"
  - "code graph context checklist"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/003-code-graph-context-and-scan-scope"
    last_updated_at: "2026-04-23T11:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Checklist completed with implementation and verification evidence"
    next_safe_action: "Run future operator-driven code_graph_scan when ready"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
---
# Verification Checklist: Code Graph Context + Scan Scope Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

### P0 - Blockers

- [x] **P0-01** Stale-graph highlights computed. [EVIDENCE: `tests/structural-contract.vitest.ts:89` asserts status=`stale`, summary contains `(stale)`, highlights are non-empty, and include `function: 9`; final focused Vitest passed 20/20.]
- [x] **P0-02** Default scan excludes expanded. [EVIDENCE: `tests/tree-sitter-parser.vitest.ts:151` creates `z_future/`, `z_archive/`, and `mcp-coco-index/mcp_server/` fixtures and asserts none are indexed; final focused Vitest passed 20/20.]
- [x] **P0-03** `.gitignore` awareness. [EVIDENCE: `tests/tree-sitter-parser.vitest.ts:175` writes `.gitignore` with `*.test-bak.ts` and asserts `ignored.test-bak.ts` is not indexed; final focused Vitest passed 20/20.]
- [x] **P0-04** No regression in existing tests. [EVIDENCE: baseline focused Vitest passed 17/17 before edits; final focused Vitest passed 20/20 after adding 3 cases.]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### P1 - Required

- [x] **P1-01** Surface matrix doc exists. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/SURFACES.md` begins with `# Code Graph Context Surfaces` and includes the required 4-column matrix.]
- [x] **P1-02** Stale highlights labeled with `(stale)` marker. [EVIDENCE: `lib/session/session-snapshot.ts:229-231` uses `freshnessLabel`; stale test asserts `(stale)` in the summary.]
- [x] **P1-03** Strict spec validation. [EVIDENCE: `validate.sh --strict` passed with 0 errors / 0 warnings.]
- [x] **P1-04** `npm run build` in mcp_server clean. [EVIDENCE: `npm run build` passed with clean `tsc --build`.]
- [x] **P1-05** Canonical save invoked. [EVIDENCE: `generate-context.js --json ...` exited 0; embeddings deferred because network fetch failed, with BM25/FTS fallback indexing used.]
- [x] **P1-06** Historical parent handover updated with 012 row. [EVIDENCE: `../../007-deep-review-remediation/handover.md` contains the `003-code-graph-context-and-scan-scope` row in the Files Modified table.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **P1-CQ01** Source .ts edits compile cleanly to dist .js. [EVIDENCE: `npm run build` passed; compiled dist contains updated lines at `dist/lib/session/session-snapshot.js:159`, `dist/code-graph/lib/indexer-types.js:45`, and `dist/code-graph/lib/structural-indexer.js:970-1002`.]
- [x] **P1-CQ02** No new TypeScript or lint errors. [EVIDENCE: `npm run build` passed with `tsc --build`; no TypeScript errors reported.]
- [x] **P1-CQ03** New vitest cases follow existing test file conventions. [EVIDENCE: new cases live in existing focused files: `structural-contract.vitest.ts` and `tree-sitter-parser.vitest.ts`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **P1-T01** Focused vitest for session-snapshot passes (existing + new). [EVIDENCE: `vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts` passed 20/20; session contract file includes 8 tests after the new stale-highlights case.]
- [x] **P1-T02** Focused vitest for structural-indexer passes (existing + new). [EVIDENCE: same focused run passed 20/20; `tree-sitter-parser.vitest.ts` includes the 2 new scan-scope cases.]
- [x] **P1-T03** Negative test for stale-highlights (temporarily revert the gate, confirm test fails red, then re-apply). [EVIDENCE: temporary gate revert made `returns stale highlights and freshness marker` fail because summary lacked `(stale)`; restoring the gate made the targeted test pass.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **P1-S01** Scan excludes do not bypass legitimate code. [EVIDENCE: only archive/future/coco-index server defaults were added: `**/z_future/**`, `**/z_archive/**`, `**/mcp-coco-index/mcp_server/**`; fixture test confirms `active/active.ts` is still indexed.]
- [x] **P1-S02** `.gitignore` awareness uses well-maintained `ignore` package, not hand-rolled glob matcher. [EVIDENCE: `package.json:53` declares `"ignore": "^5.3.2"` and `structural-indexer.ts:1121-1124` resolves the package factory.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **P2-01** Surface matrix doc references investigation file:line citations. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/code-graph/SURFACES.md` cites session-snapshot, code-graph-db, indexer-types, and structural-indexer source/dist locations.]
- [x] **P2-02** Implementation summary documents which surfaces benefit from each change. [EVIDENCE: implementation summary `What Was Built` and `Key Decisions` explain MCP startup/bootstrap and OpenCode minimal resume impact.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **P1-F01** Source edits in .ts; compiled .js auto-generated by build. No direct .js edits. [EVIDENCE: code edits were applied to `.ts`; `npm run build` produced updated ignored dist output; `git status` tracks only source/test/doc/package files for this packet.]
- [x] **P1-F02** Surface doc placed at sensible location (`.opencode/skill/system-spec-kit/mcp_server/code-graph/SURFACES.md` or skill-advisor/README.md). [EVIDENCE: chose `.opencode/skill/system-spec-kit/mcp_server/code-graph/SURFACES.md` because it documents code-graph payload surfaces.]
- [x] **P1-F03** Spec packet docs remain in this child phase folder. [EVIDENCE: `implementation-summary.md`, `tasks.md`, and `checklist.md` updated under `.../003-code-graph-context-and-scan-scope/`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

### P2 - Recommended

- [x] **P2-03** Indexer logs scan-scope summary. [EVIDENCE: `structural-indexer.ts:1223` logs `[structural-indexer] scanned N files (excluded: gitignored=X, default=Y)` after include-glob collection.]
- [x] **P2-04** Re-scan smoke documented in implementation-summary. [EVIDENCE: implementation summary Known Limitations documents that the existing DB was not rescanned and operators can apply the new scope later with `code_graph_scan`.]

### Verification Log

- 2026-04-23T10:08Z baseline focused Vitest: 17/17 passed.
- 2026-04-23T10:16Z focused Vitest after implementation: 20/20 passed.
- 2026-04-23T10:16Z `npm run build`: passed.
- 2026-04-23T10:16Z stale-highlight red/green proof: failed under temporary gate revert, passed after restore.
- 2026-04-23T10:18Z final build + focused Vitest after scan-summary log: build passed, 20/20 tests passed.
- 2026-04-23T10:19Z strict validation: 0 errors / 0 warnings.
- 2026-04-23T10:21Z canonical save: `generate-context.js` exited 0 with deferred embedding fallback due network fetch failures.
<!-- /ANCHOR:summary -->

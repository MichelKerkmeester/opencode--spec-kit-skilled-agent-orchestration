---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Task Breakdown: Code Graph Context + Scan Scope Remediation"
description: "Tasks T-01..T-12 across stale highlights, scan excludes + gitignore, surface doc, and verification."
trigger_phrases:
  - "026/007/012 tasks"
  - "code graph context tasks"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope"
    last_updated_at: "2026-04-23T11:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implementation complete; verification evidence captured"
    next_safe_action: "Run future operator-driven code_graph_scan when ready"
    completion_pct: 100
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

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 + P1 items in spec.md have evidence in implementation-summary.md.
- Existing vitest tests pass; 3 new cases added.
- Strict validation 0/0; canonical save invoked.
- New scan with default excludes produces a substantially smaller graph (verifiable post-merge by user re-scanning).
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

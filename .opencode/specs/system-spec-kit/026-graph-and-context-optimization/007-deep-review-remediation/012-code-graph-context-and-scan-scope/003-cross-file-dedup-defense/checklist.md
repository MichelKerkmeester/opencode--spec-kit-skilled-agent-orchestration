---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Cross-File Symbol Dedup Defense"
description: "Verification checklist for packet 012/003, including source grep checks, focused Vitest, build, dist inspection, strict spec validation, and operator live-scan acceptance."
trigger_phrases:
  - "cross-file symbol dedup checklist"
  - "012/003 verification checklist"
  - "UNIQUE constraint failed acceptance"
  - "filesIndexed 1300 acceptance"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope/003-cross-file-dedup-defense"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Defined verification checklist"
    next_safe_action: "Mark items with evidence after implementation"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-db.vitest.ts"
    session_dedup:
      fingerprint: "sha256:012-003-cross-file-dedup-defense-checklist-2026-04-23"
      session_id: "cg-012-003-2026-04-23"
      parent_session_id: "cg-012-002-2026-04-23"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Cross-File Symbol Dedup Defense

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. [evidence: REQ-001 through REQ-008 define both defense layers and verification.]
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. [evidence: phases and data flow describe Layer 1 and Layer 2.]
- [x] CHK-003 [P1] Dependencies identified and available. [evidence: MCP restart is documented as operator-owned; source and test dependencies are local.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `structural-indexer.ts` contains `globalSeenIds` after the TESTED_BY edge block. [evidence: source grep found `globalSeenIds` at `structural-indexer.ts:1292` after the TESTED_BY loop.]
- [x] CHK-011 [P0] `code-graph-db.ts` contains `INSERT OR IGNORE INTO code_nodes`. [evidence: source grep found `INSERT OR IGNORE INTO code_nodes` at `code-graph-db.ts:309`.]
- [x] CHK-012 [P1] Duplicate-drop logging is implemented and tested. [evidence: `structural-contract.vitest.ts` asserts the exact dropped-count `console.info` message.]
- [x] CHK-013 [P1] Code follows project patterns and avoids changes to `generateSymbolId`, `capturesToNodes`, and `attachFilePath`. [evidence: patch only touched `indexFiles()` result handling and `replaceNodes()` insert mode.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] AC-1 [P0] Full scan response `errors[]` contains zero `UNIQUE constraint failed` messages after MCP restart. [evidence: operator-run post-restart.]
- [ ] AC-2 [P0] Full scan response reports `filesIndexed >= 1300` after MCP restart. [evidence: operator-run post-restart.]
- [x] AC-3 [P0] Focused Vitest command exits 0 with Layer 1 and Layer 2 tests included. [evidence: focused Vitest passed 3 files / 33 tests.]
- [x] AC-4 [P0] Built `dist/` contains `globalSeenIds` and `INSERT OR IGNORE`. [evidence: `rg` found `globalSeenIds` in `dist/code-graph/lib/structural-indexer.js` and `INSERT OR IGNORE` in `dist/code-graph/lib/code-graph-db.js`.]
- [x] CHK-020 [P0] Focused Vitest command exits 0: `npx vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts tests/code-graph-db.vitest.ts`. [evidence: command passed 3 files / 33 tests.]
- [x] CHK-021 [P0] `npm run build` exits 0. [evidence: `tsc --build` exited 0.]
- [x] CHK-022 [P0] `dist/` contains `globalSeenIds` and `INSERT OR IGNORE`. [evidence: dist grep found both tokens.]
- [x] CHK-023 [P0] Operator acceptance documented: post-restart live scan should have zero `UNIQUE constraint failed` entries in `errors[]`. [evidence: documented in `implementation-summary.md` Known Limitations.]
- [x] CHK-024 [P1] Operator acceptance documented: post-restart live scan should report `filesIndexed >= 1300`. [evidence: documented in `implementation-summary.md` Known Limitations.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. [evidence: changes only add scan dedup, SQL conflict mode, tests, and docs.]
- [x] CHK-031 [P0] SQL remains prepared-statement based. [evidence: `replaceNodes()` still uses `d.prepare()` and parameterized `insert.run(...)`.]
- [x] CHK-032 [P1] No network or external service dependency added. [evidence: no package or network-facing code changes were made.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and metadata files are synchronized. [evidence: packet docs updated with implementation and verification results.]
- [x] CHK-041 [P1] `implementation-summary.md` exists with `_memory.continuity`. [evidence: file includes `_memory.continuity` frontmatter.]
- [x] CHK-042 [P1] `validate.sh --strict` exits 0 after implementation. [evidence: final strict validation passed with 0 errors and 0 warnings.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files are left in the packet folder. [evidence: packet folder contains only canonical docs and metadata.]
- [x] CHK-051 [P1] No changes are made to packet 012, 012/001, or 012/002 artifacts. [evidence: git status shows only the new 003 folder plus source/test changes.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 12/14 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-23
<!-- /ANCHOR:summary -->

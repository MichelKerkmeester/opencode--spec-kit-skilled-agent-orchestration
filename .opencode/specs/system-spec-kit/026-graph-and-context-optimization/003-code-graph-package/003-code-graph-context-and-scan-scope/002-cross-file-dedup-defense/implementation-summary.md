---
title: "...ion/003-code-graph-package/003-code-graph-context-and-scan-scope/002-cross-file-dedup-defense/implementation-summary]"
description: "Packet 012/003 added cross-file code graph symbol deduplication after TESTED_BY edge generation plus INSERT OR IGNORE persistence for residual duplicate symbol IDs."
trigger_phrases:
  - "cross-file symbol dedup implementation"
  - "012/003 implementation summary"
  - "globalseenids implemented"
  - "insert or ignore implemented"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/003-cross-file-dedup-defense"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "verified"
    next_safe_action: "operator-scan"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-db.vitest.ts"
    session_dedup:
      fingerprint: "sha256:012-003-cross-file-dedup-defense-summary-2026-04-23"
      session_id: "cg-012-003-2026-04-23"
      parent_session_id: "cg-012-002-2026-04-23"
    completion_pct: 92
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Cross-File Symbol Dedup Defense

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-cross-file-dedup-defense |
| **Completed** | Implementation complete; live scan deferred to operator |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### T-001 - Packet Docs

Created the Level 2 packet under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/003-cross-file-dedup-defense/` with `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `description.json`, `graph-metadata.json`, and this implementation summary.

### T-002 - Layer 1 Global Dedup

Updated `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` so `indexFiles()` now sweeps all returned `ParseResult.nodes` after the TESTED_BY edge block and before `return results`. The first file to own a `symbolId` keeps it; later duplicate nodes are dropped from `result.nodes`, and a `console.info` message reports the dropped count when nonzero.

### T-003 - Layer 2 Insert Tolerance

Updated `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts` so `replaceNodes()` uses `INSERT OR IGNORE INTO code_nodes`. A residual duplicate `symbol_id` no longer aborts the file transaction, and non-conflicting nodes from the same call still persist.

### T-004 and T-005 - Tests

Added three `indexFiles()` cross-file dedup tests to `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` and created `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-db.vitest.ts` with two direct DB tests for `replaceNodes()` duplicate tolerance.

### T-006 and T-007 - Build, Dist, Summary

Ran focused Vitest, built the MCP server, confirmed `dist/` contains both patches, and updated packet docs with verification evidence.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The docs were strict-validated before source edits, then the two source changes were applied with focused tests added alongside the existing structural tests. The build regenerated `dist/`, and grep confirmed the compiled files include `globalSeenIds` and `INSERT OR IGNORE`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add scan-batch dedup | Blocks cross-file duplicate nodes before scan persistence reads returned results. |
| Use `INSERT OR IGNORE` | Keeps first-owner semantics when a residual DB-level duplicate exists. |
| Place dedup after TESTED_BY edges | Preserves existing TESTED_BY edge generation, accepting possible orphaned edges as a soft consistency tradeoff. |
| Defer live scan | MCP restart is explicitly outside this run. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Before test baseline | Prior packet 012/002 focused suite recorded 30/30 tests. |
| After focused vitest | PASS: `npx vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts tests/code-graph-db.vitest.ts` passed 3 files / 33 tests. |
| Build | PASS: `npm run build` exited 0. |
| Source grep | PASS: source contains `globalSeenIds` and `INSERT OR IGNORE INTO code_nodes`. |
| Dist grep | PASS: `dist/code-graph/lib/structural-indexer.js` contains `globalSeenIds`; `dist/code-graph/lib/code-graph-db.js` contains `INSERT OR IGNORE`. |
| Initial strict validation | PASS: `validate.sh --strict` exited 0 before source patches. |
| Final strict validation | PASS: `validate.sh --strict` exited 0 with 0 errors and 0 warnings. |
| Operator live scan | Deferred until MCP restart; expected acceptance is `errors: []` and `filesIndexed >= 1300`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Live MCP scan acceptance is not complete in this run because the MCP server was not restarted by request. After restart, run `code_graph_scan({ rootDir: repo, incremental:false })`; acceptance is `errors: []` with no `UNIQUE constraint failed` messages and `filesIndexed >= 1300`.
2. Layer 1 runs after TESTED_BY edge generation by packet requirement, so a TESTED_BY edge may reference a node later dropped by global dedup. This is an accepted soft consistency issue compared with the previous UNIQUE crash.
3. `INSERT OR IGNORE` can silently skip a DB-level duplicate if one survives Layer 1. The first-owner row remains intact and non-conflicting nodes still persist.
<!-- /ANCHOR:limitations -->

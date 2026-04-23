---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
title: "Implementation Plan: Cross-File Symbol Dedup Defense"
description: "Add two runtime-independent guards against code_nodes.symbol_id UNIQUE failures: a scan-batch dedup sweep in the structural indexer and INSERT OR IGNORE persistence in replaceNodes. Verification uses focused Vitest coverage, build output, dist inspection, and strict packet validation."
trigger_phrases:
  - "cross-file symbol dedup plan"
  - "globalSeenIds plan"
  - "INSERT OR IGNORE plan"
  - "012/003 implementation plan"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/003-cross-file-dedup-defense"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Planned cross-file dedup defense"
    next_safe_action: "Create tests and patches"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-db.vitest.ts"
    session_dedup:
      fingerprint: "sha256:012-003-cross-file-dedup-defense-plan-2026-04-23"
      session_id: "cg-012-003-2026-04-23"
      parent_session_id: "cg-012-002-2026-04-23"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Cross-File Symbol Dedup Defense

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | MCP server, structural code graph |
| **Storage** | SQLite via `better-sqlite3` |
| **Testing** | Vitest |

### Overview

Layer 1 mutates `ParseResult.nodes` after all files have been parsed and TESTED_BY edges have been generated, preserving the first owner of each `symbolId` in the current scan. Layer 2 changes node persistence from strict insert to `INSERT OR IGNORE`, so any residual conflict with existing DB rows no longer aborts the file transaction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable and tied to commands or grep checks.
- [x] Dependencies identified, including operator-owned MCP restart.

### Definition of Done

- [x] All source patches applied and verified by grep.
- [x] Focused tests and build pass.
- [x] `dist/` contains both runtime patches.
- [x] Packet validates with `validate.sh --strict`.
- [x] `implementation-summary.md` documents operator live-scan step.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Defensive persistence pipeline hardening.

### Key Components

- **Structural indexer**: Owns parse results and cross-file TESTED_BY edge construction before returning scan results.
- **Code graph DB**: Owns per-file replacement of node rows in SQLite.
- **Vitest contract tests**: Prove scan result mutation and DB duplicate tolerance.

### Data Flow

`code_graph_scan` calls `indexFiles()`, which parses all eligible files and creates cross-file TESTED_BY edges. The new dedup sweep then mutates each `ParseResult.nodes` list before scan persistence reads `nodes.length` and calls `replaceNodes()`. `replaceNodes()` deletes old rows for the file and inserts submitted nodes, ignoring any row whose `symbol_id` is already owned elsewhere.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation Setup

- [x] Create packet folder.
- [x] Add Level 2 spec, plan, tasks, checklist, decision record, and metadata files.
- [x] Run strict validation before source patches.

### Phase 2: Core Implementation

- [x] Add `globalSeenIds` sweep after TESTED_BY edge construction in `structural-indexer.ts`.
- [x] Log duplicate-drop count when nonzero.
- [x] Change `replaceNodes()` insert SQL to `INSERT OR IGNORE INTO code_nodes`.

### Phase 3: Verification

- [x] Add Layer 1 tests in `tests/structural-contract.vitest.ts`.
- [x] Add Layer 2 tests in `tests/code-graph-db.vitest.ts`.
- [x] Run `npm run build`.
- [x] Run focused Vitest command.
- [x] Confirm `dist/` contains `globalSeenIds` and `INSERT OR IGNORE`.
- [x] Write implementation summary and rerun strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/contract | `indexFiles()` cross-file dedup and logging | Vitest with temporary fixtures and module mocks |
| Unit/integration | `replaceNodes()` duplicate symbol tolerance | Vitest with isolated SQLite temp DB |
| Regression | Existing structural parser and DB behavior in focused files | Vitest focused command |
| Build | TypeScript compilation and dist generation | `npm run build` |
| Manual/operator | Live MCP scan after restart | `code_graph_scan({ incremental:false })` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 012/002 source changes | Internal | Green | This packet assumes `skipFreshFiles` and inner capture dedup already exist. |
| `better-sqlite3` schema | Internal | Green | DB tests depend on local SQLite support. |
| MCP restart | Operator action | Deferred | Live acceptance cannot be proven until restarted server loads `dist/`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Focused tests fail, build fails, or operator scan reveals unacceptable node loss beyond duplicate collisions.
- **Procedure**: Revert this packet's changes in `structural-indexer.ts`, `code-graph-db.ts`, and the added tests/docs, then rebuild the MCP server.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Docs) -> Phase 2 (Source Patches) -> Phase 3 (Tests + Build + Summary)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Docs | User-provided packet scope | Source patches |
| Source Patches | Docs and existing 012/002 code | Tests and build |
| Tests + Build | Source patches | Completion summary |
| Operator Scan | MCP restart after build | Live acceptance |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Documentation | Medium | 30-45 minutes |
| Core Implementation | Low | 15-30 minutes |
| Verification | Medium | 30-60 minutes |
| **Total** | | **75-135 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Focused Vitest command exits 0.
- [x] `npm run build` exits 0.
- [x] `dist/` inspection confirms compiled patches.

### Rollback Procedure

1. Revert `globalSeenIds` sweep and DB insert mode change.
2. Remove the added Vitest tests for this packet.
3. Rebuild MCP server.
4. Restart MCP only if the operator already deployed the patched build.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

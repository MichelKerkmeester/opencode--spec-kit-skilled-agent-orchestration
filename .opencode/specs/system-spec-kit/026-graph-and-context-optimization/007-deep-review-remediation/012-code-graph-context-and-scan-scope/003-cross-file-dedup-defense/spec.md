---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
title: "Feature Specification: Cross-File Symbol Dedup Defense"
description: "Live full code graph scans still fail many files with code_nodes.symbol_id UNIQUE constraint errors even after the stale-gate recovery packet. This packet adds runtime-independent defense in depth by deduping parsed nodes across the scan batch and making per-file node replacement tolerate residual conflicts."
trigger_phrases:
  - "cross-file symbol dedup defense"
  - "code_nodes symbol_id unique constraint"
  - "INSERT OR IGNORE code_nodes"
  - "globalSeenIds"
  - "012/003 cross file dedup"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope/003-cross-file-dedup-defense"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Specified cross-file dedup defense"
    next_safe_action: "Implement structural indexer and DB persistence patches"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/code-graph-db.vitest.ts"
    session_dedup:
      fingerprint: "sha256:012-003-cross-file-dedup-defense-spec-2026-04-23"
      session_id: "cg-012-003-2026-04-23"
      parent_session_id: "cg-012-002-2026-04-23"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The fix is defense in depth rather than another root-cause-only investigation."
      - "The global dedup sweep runs after TESTED_BY edge construction."
      - "replaceNodes uses INSERT OR IGNORE rather than INSERT REPLACE."
---
# Feature Specification: Cross-File Symbol Dedup Defense

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implementation Complete, Operator Scan Deferred |
| **Created** | 2026-04-23 |
| **Branch** | `012-003-cross-file-dedup-defense` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 012/002 restored explicit full scans, but live `code_graph_scan({ incremental:false })` still reports `UNIQUE constraint failed: code_nodes.symbol_id` for hundreds of files. Those failures leave affected files with updated `code_files` metadata but zero persisted nodes, which makes graph completeness misleading and prevents operators from trusting `filesIndexed`.

Standalone parsing did not reproduce cross-file collisions, so the discrepancy is currently unexplained. This packet therefore treats the failure as a runtime-integrity problem and adds two independent guards before and during persistence.

### Purpose

Full scan persistence should complete without `code_nodes.symbol_id` UNIQUE crashes, while preserving all non-conflicting nodes and making any dropped duplicate-node scope observable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a global cross-file `symbolId` dedup sweep in `indexFiles()` after the TESTED_BY edge construction block.
- Change `replaceNodes()` to use `INSERT OR IGNORE INTO code_nodes`.
- Add focused Vitest coverage for Layer 1 indexer dedup and Layer 2 DB duplicate tolerance.
- Build the MCP server and confirm `dist/` contains both patches.
- Record the operator-owned live scan acceptance step after MCP restart.

### Out of Scope

- Changing `generateSymbolId()` - 012/002 already verified the shipped identity contract.
- Changing `capturesToNodes()` inner dedup or `attachFilePath()` - those were fixed in packet 012/002.
- Root-causing the live-only discrepancy before adding guards - the production failure mode needs a crash blocker now.
- Restarting the MCP server or running live MCP scans - explicitly deferred to the operator.
- Editing packet 012, 012/001, or 012/002 artifacts - they are cited only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Modify | Deduplicate `result.nodes` across all parse results after TESTED_BY edge creation and log dropped count. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/code-graph-db.ts` | Modify | Use `INSERT OR IGNORE INTO code_nodes` in `replaceNodes()`. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` | Modify | Add cross-file `indexFiles()` dedup tests. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/code-graph-db.vitest.ts` | Create | Add direct DB tests for duplicate symbol persistence behavior. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope/003-cross-file-dedup-defense/*` | Create | Level 2 packet documentation and implementation summary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `indexFiles()` must remove cross-file duplicate `symbolId` nodes before returning results. | `rg "globalSeenIds" structural-indexer.ts` finds the sweep, tests prove the later duplicate is removed, and downstream `result.nodes.length` reflects the deduped count. |
| REQ-002 | The dedup sweep must run after the TESTED_BY cross-file edge block. | Source order shows the sweep after the `TESTED_BY` loop and before `return results`. |
| REQ-003 | `replaceNodes()` must not throw when another file already owns a submitted `symbol_id`. | Direct DB test seeds file 1, calls `replaceNodes()` for file 2 with the same `symbolId`, and observes no throw. |
| REQ-004 | Non-conflicting nodes in the same `replaceNodes()` call must still persist. | Direct DB test submits one duplicate and one unique node for file 2 and observes the unique node under file 2. |
| REQ-005 | Focused tests and build must pass. | `npm run build` and `npx vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts tests/code-graph-db.vitest.ts` exit 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Operators must see the number of globally dropped duplicate nodes. | `console.info` logs a message only when at least one cross-file duplicate node is dropped. |
| REQ-007 | Packet docs must validate strictly. | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` exits 0 before and after implementation. |
| REQ-008 | Live scan acceptance remains explicit and operator-owned. | `implementation-summary.md` documents that MCP restart plus `code_graph_scan({ incremental:false })` should report `errors: []` and `filesIndexed >= 1300`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Source contains `globalSeenIds` in `structural-indexer.ts` and `INSERT OR IGNORE INTO code_nodes` in `code-graph-db.ts`.
- **SC-002**: New tests cover colliding and non-colliding scan results, dedup logging, duplicate DB insert tolerance, and unique-node persistence.
- **SC-003**: Build and focused Vitest command exit 0, and `dist/` contains the patched runtime code.
- **SC-004**: Operator post-restart scan is expected to show zero `UNIQUE constraint failed` entries in `errors[]` and `filesIndexed >= 1300`.

### Acceptance Criteria

- [ ] AC-1 [P0] **Given** the MCP server is restarted after this build, **When** the operator runs a full scan, **Then** `errors[]` contains zero `UNIQUE constraint failed` messages. [evidence: operator-run post-restart.]
- [ ] AC-2 [P0] **Given** the MCP server is restarted after this build, **When** the operator runs a full scan, **Then** the response reports `filesIndexed >= 1300`. [evidence: operator-run post-restart.]
- [x] AC-3 [P0] **Given** the source patches are applied, **When** focused Vitest runs, **Then** Layer 1 and Layer 2 tests pass. [evidence: `npx vitest run tests/structural-contract.vitest.ts tests/tree-sitter-parser.vitest.ts tests/code-graph-db.vitest.ts` passed 3 files / 33 tests.]
- [x] AC-4 [P0] **Given** the build completes, **When** `dist/` is inspected, **Then** it contains `globalSeenIds` and `INSERT OR IGNORE`. [evidence: `npm run build` exited 0; `rg` found both tokens in `dist/code-graph/lib`.]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Duplicate nodes are silently lost after `INSERT OR IGNORE`. | Medium | Layer 1 removes scan-local duplicates first and logs count; tests verify unique nodes still persist. |
| Risk | TESTED_BY edges can reference nodes dropped after edge creation. | Low | This is an accepted soft consistency tradeoff to preserve existing TESTED_BY edge generation while blocking UNIQUE crashes. |
| Dependency | MCP restart required for live scan proof. | Medium | Do not restart in this packet; document exact operator step. |
| Dependency | Existing parser identity behavior from 012/002. | Low | Do not modify `generateSymbolId`, `capturesToNodes`, or `attachFilePath`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The dedup sweep is O(total parsed nodes) and runs once per `indexFiles()` call.
- **NFR-P02**: No additional file reads, parser invocations, or DB queries are introduced by Layer 1.

### Security

- **NFR-S01**: No new external inputs, network access, or secrets are introduced.
- **NFR-S02**: SQL remains prepared-statement based; only the insert conflict mode changes.

### Reliability

- **NFR-R01**: A duplicate `symbol_id` must not abort persistence for all other nodes in the file.
- **NFR-R02**: Existing stale-only and full-scan behavior from 012/002 must remain unchanged except for duplicate-node removal.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty scan result: returns an empty result list and logs no duplicate-drop message.
- Single file with inner duplicate symbols: remains covered by 012/002 `capturesToNodes()` dedup.
- Cross-file duplicate symbols: first parsed file keeps the node; later files drop the colliding node.

### Error Scenarios

- Existing DB row owns the duplicate `symbol_id`: `INSERT OR IGNORE` skips the colliding node and the transaction continues.
- Mixed duplicate and unique nodes in one file: duplicate is ignored and unique nodes persist.
- Live scan still reports non-UNIQUE errors: outside this packet and should be investigated separately.

### State Transitions

- Before MCP restart: source and dist can be verified locally, but live MCP behavior remains unchanged.
- After MCP restart: operator reruns full scan to prove `errors: []` and `filesIndexed >= 1300`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two source files, two test files, packet docs. |
| Risk | 16/25 | Persistence behavior changes for graph nodes, but blast radius is limited to duplicate conflicts. |
| Research | 12/20 | Deep research and 012/002 summary provide evidence; live discrepancy remains unknown. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for implementation. Live acceptance waits on operator restart and scan.
<!-- /ANCHOR:questions -->

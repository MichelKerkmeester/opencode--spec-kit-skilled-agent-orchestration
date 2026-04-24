---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
title: "Feature Specification: Code Graph Incremental Fullscan Recovery"
description: "Recover code graph full-scan behavior after packet 012 by honoring caller-requested non-incremental scans and preventing duplicate symbol IDs from aborting persistence."
trigger_phrases:
  - "code graph scan stale gate"
  - "incremental false full scan"
  - "duplicate symbol id"
  - "IndexFilesOptions skipFreshFiles"
  - "012/002 incremental fullscan recovery"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Initialized Level 3 spec for code graph stale-gate and duplicate-symbol remediation."
    next_safe_action: "Implement tasks"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/README.md"
    session_dedup:
      fingerprint: "sha256:002-incremental-fullscan-recovery-2026-04-23"
      session_id: "cg-012-002-2026-04-23"
      parent_session_id: "dr-2026-04-23-130100-pt04"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The research packet selected Option A dedupe as the minimal crash fix."
      - "The scan response must supplement fullReindexTriggered rather than rename it."
---
# Feature Specification: Code Graph Incremental Fullscan Recovery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 012 tightened code graph scan scope, but a pre-existing stale-gate contract bug meant `code_graph_scan({ incremental: false })` still indexed only DB-stale files. That stale-only result was then treated as the complete graph and pruned the database to 33 files, while duplicate parser-generated symbol IDs caused three indexer-self files to fail persistence.

**Key Decisions**: Thread `IndexFilesOptions { skipFreshFiles }` into `indexFiles()`; dedupe duplicate `(filePath, fqName, kind)` captures before DB insertion; add response metadata without renaming `fullReindexTriggered`.

**Critical Dependencies**: Operator must restart the MCP server before live `code_graph_scan` verification.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-04-23 |
| **Branch** | `UNKNOWN` |
| **Parent Packet** | `003-code-graph-context-and-scan-scope` |
| **Research Source** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`indexFiles()` unconditionally applies `isFileStale()` even when the caller requested `incremental:false`, so full scans parse only stale files and the scan handler prunes the tracked file set to that stale-only subset. Separately, `capturesToNodes()` can emit duplicate `symbolId` values for captures that share the same `(filePath, fqName, kind)`, causing `code_nodes.symbol_id` UNIQUE constraint failures.

### Purpose
Restore full-scan correctness and persistence reliability while preserving existing incremental callers and response compatibility.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an optional `IndexFilesOptions` parameter to `indexFiles()`.
- Make `code_graph_scan` pass `{ skipFreshFiles: effectiveIncremental }`.
- Dedupe duplicate symbol IDs in `capturesToNodes()` while preserving the first-seen node.
- Add `fullScanRequested` and `effectiveIncremental` response fields while keeping `fullReindexTriggered`.
- Add vitest coverage for indexer options, scan handler integration, and duplicate-symbol regression.
- Update code graph README documentation.
- Build TypeScript output and confirm dist contains the new symbols.

### Out of Scope
- Running `code_graph_scan` from this Codex run, because the operator must restart the MCP server first.
- Vacuuming the SQLite database, because DB file shrinkage is cosmetic and explicitly excluded.
- Renaming or removing `fullReindexTriggered`, because downstream compatibility matters.
- Parser-layer identity redesign, because richer `fqName` scoping is a larger follow-up.
- Scan-level mutex hardening, because the stale-gate path fully explains this failure.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Modify | Add `IndexFilesOptions`; condition stale skip; dedupe symbol IDs. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` | Modify | Pass scan mode to indexer; expose additive response fields. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` | Modify | Add indexer option and scan handler integration tests. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts` | Modify | Add `capturesToNodes()` dedupe tests. |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` | Modify | Document response fields and `IndexFilesOptions`. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery/` | Create | Level 3 documentation packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full scans must parse all post-exclude candidates rather than only stale files. | `indexFiles(config, { skipFreshFiles: false })` returns fresh files; scan handler passes `effectiveIncremental`. |
| REQ-002 | Incremental default behavior must remain stale-only. | `indexFiles(config)` and `indexFiles(config, {})` skip DB-fresh files. |
| REQ-003 | Duplicate symbol IDs must not reach DB persistence. | `capturesToNodes()` returns unique `symbolId` values, preserving the first duplicate. |
| REQ-004 | Scan response must reveal caller intent and effective mode. | Response includes `fullScanRequested` and `effectiveIncremental`; `fullReindexTriggered` remains unchanged. |
| REQ-005 | Build and vitest suites must pass. | `npx vitest run` and `npm run build` exit 0 from `mcp_server/`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | README documents the new scan and indexer contract. | Code graph README lists the new response fields and `IndexFilesOptions { skipFreshFiles }`. |
| REQ-007 | Spec folder validates strictly. | `validate.sh <spec-folder> --strict` exits 0 after creation and after implementation summary. |
| REQ-008 | Build output must reflect source changes. | Dist files include `skipFreshFiles` and `fullScanRequested`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** source is patched, **When** grep checks run, **Then** `skipFreshFiles`, `seenSymbolIds`, and `fullScanRequested` are present.
- **SC-002**: **Given** DB-fresh fixture files, **When** `indexFiles(config, { skipFreshFiles:false })` runs, **Then** all post-exclude files are parsed.
- **SC-003**: **Given** default `indexFiles(config)` behavior, **When** DB-fresh fixture files are encountered, **Then** fresh files are skipped.
- **SC-004**: **Given** duplicate captures share `(filePath, fqName, kind)`, **When** `capturesToNodes()` runs, **Then** only the first duplicate remains.
- **SC-005**: **Given** `handleCodeGraphScan({ incremental:false })`, **When** the response is parsed, **Then** `fullScanRequested:true` and `effectiveIncremental:false` are present.
- **SC-006**: **Given** implementation is complete, **When** `npx vitest run` and `npm run build` run from `mcp_server/`, **Then** both exit 0.
- **SC-007**: **Given** the MCP server is restarted, **When** the operator runs a full scan, **Then** AC-1, AC-4, and AC-5 are verifiable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | MCP server restart | Live scan acceptance cannot be completed in this run. | Build dist and document operator verification steps. |
| Risk | Legitimate overloads collapse to one symbol | Graph loses duplicate logical symbols with identical current identity. | Preserve first-seen semantics; defer richer parser identity to future packet. |
| Risk | Full scan duration increases from stale-only scans | Operator scan may take materially longer. | Keep change limited to explicit full scans; default incremental remains stale-only. |
| Risk | Additive response fields surprise strict consumers | Low compatibility risk. | Keep existing fields unchanged and document additions. |
| Risk | Existing DB metadata drift from prior failed files | Three files may need post-fix scan to repersist coherent nodes. | Operator full scan after restart exercises clean `replaceNodes()`. |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Default incremental scans retain the stale-only read/parse fast path.
- **NFR-P02**: Explicit full scans may parse all post-exclude files and should remain bounded by existing include/exclude and max-size controls.

### Reliability
- **NFR-R01**: Duplicate parser captures cannot crash DB persistence through `symbol_id` uniqueness.
- **NFR-R02**: The scan response must make full-scan intent observable to operators.

### Compatibility
- **NFR-C01**: Existing `indexFiles(config)` callers continue to compile and preserve behavior.
- **NFR-C02**: Existing `fullReindexTriggered` semantics remain unchanged.

---

## 8. EDGE CASES

### Data Boundaries
- Empty file content returns only symbol nodes as before and should not add a module node.
- Captures with same `fqName` and different `kind` are not deduped.
- Captures with same `kind` and different `fqName` are not deduped.

### Error Scenarios
- A parser failure still produces scan errors for the affected file only.
- Failed per-file persistence remains isolated by existing try/catch behavior.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Source, tests, docs, dist, nested spec packet |
| Risk | 20/25 | P0 data pruning and UNIQUE constraint failures |
| Research | 18/20 | Five-iteration deep research packet already completed |
| Multi-Agent | 4/15 | Single implementer using prior research |
| Coordination | 9/15 | Operator restart and post-run verification |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R1 | `IndexFilesOptions` breaks typed callers. | M | L | Optional second parameter with default. |
| R2 | Dedupe hides distinct overloaded symbols. | M | M | Preserve stable IDs and document parser identity follow-up. |
| R3 | Full scan takes longer than expected. | M | M | Operator performs post-restart scan and can profile duration. |
| R4 | Response consumers misunderstand `fullReindexTriggered`. | L | M | Add `fullScanRequested` and `effectiveIncremental` fields. |
| R5 | Prior DB state remains large on disk. | L | M | Do not VACUUM; explain DB size behavior separately if needed. |

---

## 11. USER STORIES

### US-001: Operator Full Scan (Priority: P0)

**As a** code graph operator, **I want** `incremental:false` scans to parse all active files, **so that** the graph database is not pruned to a stale-only subset.

**Acceptance Criteria**:
1. Given fresh DB rows, When `skipFreshFiles:false` is used, Then fresh files are still parsed.
2. Given `code_graph_scan({ incremental:false })`, When the handler calls the indexer, Then it passes `skipFreshFiles:false`.

### US-002: Stable Duplicate Handling (Priority: P0)

**As a** graph persistence consumer, **I want** parser duplicate captures to be dropped before DB insertion, **so that** `symbol_id` uniqueness errors do not abort indexing.

**Acceptance Criteria**:
1. Given duplicate captures with the same `(filePath, fqName, kind)`, When nodes are generated, Then only the first node remains.
2. Given same `fqName` with different `kind`, When nodes are generated, Then both nodes remain.

### US-003: Operator Clarity (Priority: P1)

**As a** person reading scan output, **I want** scan intent and effective mode in the response, **so that** I can distinguish explicit full scans from git-triggered full reindexes.

**Acceptance Criteria**:
1. Response includes `fullScanRequested:true` when the caller passes `incremental:false`.
2. Response includes `effectiveIncremental:false` when the handler runs full-scan mode.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for implementation. Live AC-1, AC-4, and AC-5 remain post-restart operator verification items.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research Source**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/007-deep-review-remediation-pt-04/research.md`

---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
title: "Feature Specification: Index Scope and Constitutional Tier Invariants"
description: "Permanently enforce index-scope exclusions for z_future and external paths, and stop constitutional tier pollution by restricting constitutional rows to files under dedicated constitutional folders."
trigger_phrases:
  - "026/011 index scope invariants"
  - "constitutional tier pollution"
  - "z_future indexing exclusion"
  - "external indexing exclusion"
  - "constitutional path gate"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T09:31:49Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Wave-1 remediation landed; P0-001 and P0-002 patched at SQL layer, audit-trail gap closed"
    next_safe_action: "Run 7-iteration deep review pass 2 to confirm P0s resolved"
    status: "wave1-remediation-complete"
    blockers: []
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "z_future rows will be deleted instead of downgraded because the invariant says they must never be indexed."
      - "constitutional tier saves outside /constitutional/ will be downgraded to important instead of rejected."
      - ".opencode/skill/system-spec-kit/constitutional/README.md must remain out of the index because it is an overview doc, not a rule surface."
---
# Feature Specification: Index Scope and Constitutional Tier Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

The memory system currently violates three invariants that should be permanent. Live DB inspection shows `5700` rows at `importance_tier='constitutional'`, but only `2` of those rows come from real `/constitutional/` files, while the rest are pollution from `z_future` research material. The same scan stack also lacks a permanent `external/` exclusion, which is a dormant but load-bearing boundary for both memory indexing and code-graph scanning.

---

## EXECUTIVE SUMMARY

This packet adds one shared source of truth for index-scope rules, wires it into memory discovery, memory save, and code-graph scanning, and cleans the polluted database state in one transactional maintenance pass. The result is that `z_future` and `external` paths stop entering the index, constitutional tier stops leaking onto ordinary docs, and constitutional auto-surface logic returns the real rule files again.

**Key Decisions**: delete `z_future` pollution instead of downgrading it, downgrade invalid constitutional saves to `important`, and keep `.opencode/skill/system-spec-kit/constitutional/README.md` out of the index.

**Critical Dependencies**: `mcp_server` typecheck/build, focused Vitest coverage, and a transaction-safe cleanup CLI against the Voyage-4 SQLite database.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Wave-1 Complete |
| **Created** | 2026-04-24 |
| **Branch** | `011-index-scope-and-constitutional-tier-invariants` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The memory indexer currently admits files that should never enter long-lived retrieval surfaces. Live database evidence shows `5700` constitutional-tier rows, but only `2` valid constitutional files under `/constitutional/`, while the other `5698` constitutional rows come from `system-spec-kit/z_future/hybrid-rag-fusion-upgrade/*`. The same code paths do not permanently exclude `/external/`, and packet 011's first pass incorrectly admitted `.opencode/skill/system-spec-kit/constitutional/README.md` even though it is a human-oriented overview document rather than a constitutional rule.

### Purpose

Enforce three permanent invariants in code and clean existing violations so future scans, direct saves, and code-graph refreshes cannot reintroduce this pollution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Shared path-exclusion helpers for memory indexing and code-graph scanning
- Memory discovery, spec-doc classification, and save-time enforcement
- Constitutional tier normalization at save time
- Focused Vitest coverage for exclusions and tier downgrades
- Transactional cleanup CLI for existing DB pollution
- MCP server documentation plus this Level 3 packet and 026 parent metadata

### Out of Scope

- Packet `010` `fromScan` behavior changes beyond ensuring the new guard still applies to scan-originated saves
- Session-handover files and the `009/012-docs-impact-remediation` work-in-progress packet
- Broader ranking/scoring refactors outside the constitutional pollution fix

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts` | Create | Shared source of truth for memory and code-graph path exclusions |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts` | Modify | Apply shared exclusion helper while keeping constitutional README excluded |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts` | Modify | Make spec-doc and graph-metadata classification respect shared memory scope rules |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Keep `isMemoryFile()` aligned with the new path invariants and constitutional rule-file-only behavior |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Add save-time scope guard and constitutional tier downgrade |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts` | Modify | Preserve and extend default scanner exclusions with `/external/` |
| `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Modify | Apply shared code-graph scope helper in recursive and specific-file scanning |
| `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` | Modify/Create | Cover path exclusions, constitutional README exclusion, and tier downgrade behavior |
| `.opencode/skill/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts` | Create | Dry-run/apply/verify cleanup CLI |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Modify | Document the three invariants and helper location |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/*` | Modify/Create | New 011 packet plus parent metadata topology updates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `z_future` paths must never be indexed by the memory system. | `memory_index_scan`, spec-doc discovery, graph-metadata discovery, and save-time validation reject any path containing a `z_future/` segment. |
| REQ-002 | `external` paths must never be indexed by memory or code graph scanners. | Shared helpers reject any path containing an `external/` segment, and both memory and code-graph walkers honor the helper. |
| REQ-003 | Constitutional tier must be valid only for `/constitutional/` files. | A save outside `/constitutional/` that declares `importanceTier: constitutional` persists as `importance_tier='important'` and logs a warning. |
| REQ-004 | Existing `z_future` and `external` pollution must be removed transactionally. | Cleanup CLI dry-run reports the candidate rows, `--apply` deletes them in one transaction, and `--verify` reports zero remaining violations. |
| REQ-005 | Duplicate `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` rows must be consolidated safely. | Cleanup keeps the newer row, deletes the older row, and rewrites surviving lineage or feedback references to the kept row when present. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `.opencode/skill/system-spec-kit/constitutional/README.md` must remain non-indexable while constitutional rule files stay indexable. | Constitutional discovery and parser admissibility both skip the README inside `constitutional/`, while the dedicated constitutional rule files remain indexed. |
| REQ-007 | Focused tests prove the new guards. | Unit and integration tests cover `z_future`, `external`, `z_archive`, `.git`, `node_modules`, invalid constitutional saves, and valid constitutional saves. |
| REQ-008 | Canonical docs and metadata explain the design choices. | `plan.md`, `decision-record.md`, `research/research.md`, and metadata files all reflect the invariant design and cleanup rationale. |
| REQ-009 | Required build checks run and are recorded honestly. | `npm run typecheck`, `npm run build`, focused Vitest commands, and `npm run test:core` outcomes are captured in `implementation-summary.md`. |
| REQ-010 | Parent topology includes packet 011. | `026-graph-and-context-optimization/description.json` and `graph-metadata.json` reference this child packet. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

- **Given** a spec packet file lives under a `z_future/` segment, **when** memory discovery, graph-metadata discovery, or direct save runs, **then** the file is rejected before indexing.
- **Given** any file lives under an `external/` segment, **when** memory discovery or code-graph scanning runs, **then** the file is skipped in both recursive and specific-file paths.
- **Given** a non-constitutional spec doc declares `importanceTier: constitutional`, **when** `memory_save` or scan-originated indexing persists it, **then** the stored tier becomes `important` and a warning is emitted.
- **Given** a real constitutional file under `.opencode/skill/system-spec-kit/constitutional/`, **when** it is saved with `importanceTier: constitutional`, **then** the stored tier remains `constitutional`.
- **Given** the README inside `.opencode/skill/system-spec-kit/constitutional/`, **when** discovery or parser admissibility checks run, **then** the file is skipped and no memory row is created.
- **Given** the cleanup CLI runs in dry-run mode, **when** the live Voyage-4 DB contains `z_future` pollution or invalid constitutional rows, **then** the command reports the exact delete and downgrade candidates without mutating the DB.
- **Given** the cleanup CLI runs with `--apply` followed by `--verify`, **when** the transaction completes successfully, **then** the DB reports zero `z_future` rows, zero `external` rows, and only legitimate constitutional-tier rows.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Memory discovery and direct saves reject `z_future` and `external` paths before they can persist.
- **SC-002**: Code-graph scans exclude `/external/` in both recursive scans and `specificFiles` refresh paths while preserving existing exclusions.
- **SC-003**: Invalid constitutional labels are downgraded to `important` and logged, while valid `/constitutional/` files retain the constitutional tier.
- **SC-004**: After cleanup, the database reports zero `z_future` rows, zero `external` rows, and only legitimate constitutional rows.
- **SC-005**: Packet 011 passes strict Level 3 validation and records exact verification evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Path exclusion logic drifts across scanners and save paths | High | Put the rule in one shared helper and use it in every walker plus save-time enforcement |
| Risk | Cleanup misses ancillary tables or leaves references pointing at deleted rows | High | Inspect live schema, delete or rewrite references inside one transaction, and add `--verify` for idempotent follow-up checks |
| Risk | Constitutional README gets reintroduced and pollutes the rule-only constitutional set | Medium | Keep README exclusion explicit in discovery/parser tests and verify the final DB count stays at `2` |
| Dependency | `better-sqlite3` plus `sqlite-vec` must load against the active Voyage-4 DB | Medium | Reuse existing cleanup script patterns and keep a dry-run default |
| Dependency | Broader `npm run test:core` may contain unrelated failures | Medium | Record carryover failures separately from focused invariant coverage |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Path checks stay O(1) per file and add only constant-time string/regex matching to walker and save paths.

### Security
- **NFR-S01**: Cleanup mutations run inside a single SQLite transaction and never partially apply on failure.

### Reliability
- **NFR-R01**: Cleanup CLI is idempotent, and `--verify` can be used in CI or scheduled maintenance to detect regressions.

---

## 8. EDGE CASES

### Data Boundaries
- Windows-style paths with backslashes still match segment exclusions after normalization.
- `specificFiles` code-graph refreshes cannot bypass the new `/external/` exclusion.
- Constitutional README files stay excluded even inside `/constitutional/`, while other constitutional Markdown rule files remain indexable.

### Error Scenarios
- If cleanup cannot determine the duplicate survivor or rewrite references safely, the transaction aborts and the DB remains unchanged.
- If a caller bypasses the walker and calls save/index APIs directly with excluded paths, save-time guards reject the write.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Multiple scanners, save pipeline, tests, cleanup CLI, packet docs, parent metadata |
| Risk | 22/25 | DB mutations, retrieval-ranking pollution, permanent invariant enforcement |
| Research | 17/20 | Several code paths, live schema inspection, prior packet review |
| Multi-Agent | 0/15 | Single-agent implementation |
| Coordination | 11/15 | Code plus DB cleanup plus documentation alignment |
| **Total** | **71/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cleanup deletes the wrong constitutional row | H | L | Resolve duplicates by path and timestamp inside a transaction, then verify counts before commit |
| R-002 | A bypass path reintroduces excluded files | H | M | Add walker exclusions and save-time guards backed by shared helpers and tests |
| R-003 | README overview docs get mistaken for rule files again | M | L | Keep `README.md` excluded in discovery/parser checks and verify final constitutional counts |

---

## 11. USER STORIES

### US-001: Memory Operator Safety (Priority: P0)

**As a** maintainer, **I want** `z_future` and `external` content to stay out of the memory index, **so that** auto-surface and search results reflect only live, canonical material.

**Acceptance Criteria**:
1. Given a spec doc under `z_future`, When discovery or save runs, Then no memory row is created.
2. Given a file under `external`, When memory or code-graph scanning runs, Then the file is skipped.

---

### US-002: Constitutional Tier Integrity (Priority: P0)

**As a** maintainer, **I want** constitutional tier to apply only to dedicated constitutional files, **so that** real guardrails outrank ordinary docs.

**Acceptance Criteria**:
1. Given a non-constitutional spec doc with `importanceTier: constitutional`, When it is saved, Then the stored tier is `important` and a warning is logged.
2. Given a file inside `/constitutional/`, When it is saved with `importanceTier: constitutional`, Then the stored tier remains constitutional.

---

### US-003: Pollution Cleanup (Priority: P1)

**As a** maintainer, **I want** a repeatable cleanup CLI, **so that** existing index pollution can be removed and future regressions can be detected automatically.

**Acceptance Criteria**:
1. Given the live Voyage-4 DB, When the cleanup runs in dry-run mode, Then it reports rows that would be deleted or downgraded.
2. Given `--apply`, When the cleanup completes, Then all targeted mutations commit or fully roll back.
3. Given `--verify`, When no violations remain, Then the command exits `0`.

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm packet scope still excludes packet 010 behavior changes beyond guard compatibility, handover files, and the `009/.../012-docs-impact-remediation` packet.
- Read the shared helper, memory discovery, save pipeline, code-graph walker, and current tests before editing any runtime file.
- Reconfirm the live DB target and cleanup transaction requirements before running `--apply`.

### Execution Rules

| Rule | Expectation |
|------|-------------|
| Read-first | Every edited file must be re-read immediately before patching. |
| Single-source policy | Path exclusions land in one shared helper and are imported everywhere else. |
| Defense in depth | Save-time guards remain active even if a caller bypasses discovery. |
| Honest verification | Command failures and carryover suite failures are recorded exactly as observed. |

### Status Reporting Format

- Report packet validation status first, then runtime implementation status, then test and cleanup status.
- Record command names, exit codes, and before/after DB counts in `implementation-summary.md` and `checklist.md`.

### Blocked Task Protocol

- Stop immediately if schema inspection reveals an unclear memory-linked table or reference that cannot be updated safely.
- Abort cleanup apply on the first SQL error and leave the DB unchanged by rolling back the transaction.
- Record the blocker in `implementation-summary.md` instead of guessing.

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- None blocking. The only runtime-sensitive question is whether the final README indexing count lands at `2` or `3`, depending on whether the README reindex is run during verification.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Investigation Notes**: See `research/research.md`

---
title: "Spec: Memory Indexer Invariants [system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/spec]"
description: "Unified Level 3 spec for the two memory-indexer invariant tracks: Track A closes the E_LINEAGE and candidate_changed save-path failures; Track B enforces permanent index-scope exclusions (z_future, external) and stops constitutional-tier pollution through a shared SSOT plus multi-layer defense."
trigger_phrases:
  - "026/010 memory indexer invariants"
  - "memory indexer lineage fix"
  - "constitutional tier pollution fix"
  - "index scope invariants"
  - "indexer correctness"
  - "fromScan recheck bypass"
  - "e_lineage fix"
  - "candidate_changed fix"
  - "z_future indexing exclusion"
  - "constitutional path gate"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants"
    last_updated_at: "2026-04-24T19:25:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged both phase tracks into root docs and removed phase folders"
    next_safe_action: "Restart MCP and rerun memory_index_scan on 026/009 to close Track A live acceptance"
    blockers:
      - "Track A live MCP rescan on 026/009 still pending (Track B is fully live-verified)"
    completion_pct: 95
    status: "code-complete-pending-track-a-live-rescan"
    open_questions: []
    answered_questions:
      - "Fix A uses A2: downgrade UPDATE/REINFORCE to CREATE when the chosen candidate is not the same canonical file."
      - "Fix B uses B2: thread fromScan from memory_index_scan into memory_save so scan-originated saves skip the transactional complement recheck."
      - "z_future rows are deleted instead of downgraded because the invariant says they must never be indexed."
      - "Constitutional-tier saves outside /constitutional/ are downgraded to important instead of rejected."
      - "Constitutional README is kept out of the index; it is an overview doc, not a rule surface."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
# Feature Specification: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

The memory indexer shipped two independent but related regressions during the 026 optimization cycle. Both regressions modify the same runtime surface (`mcp_server/handlers/memory-save.ts`, `mcp_server/handlers/memory-index.ts`, `mcp_server/lib/search/vector-index-mutations.ts`, `mcp_server/lib/storage/post-insert-metadata.ts`, `mcp_server/lib/storage/checkpoints.ts`) and share the same evaluation surface, so they ship as one coordinated invariant packet under 026.

---

## EXECUTIVE SUMMARY

This packet lands two invariant tracks:

- **Track A — Lineage and Concurrency**: stops cross-file prediction-error `UPDATE` / `REINFORCE` decisions from appending rows onto the wrong lineage chain (`E_LINEAGE`), and threads `fromScan: true` through scan-originated saves so they bypass the transactional complement recheck that was producing `candidate_changed`.
- **Track B — Index Scope and Constitutional Tier**: introduces one shared path-scope SSOT (`mcp_server/lib/utils/index-scope.ts`), wires it into memory discovery, spec-doc classification, `isMemoryFile()`, save-time guards, SQL-layer update writes, post-insert metadata, checkpoint restore, and code-graph scanning, and cleans the polluted Voyage-4 database in one transactional maintenance pass. Wave-2 hardens the track with cleanup audit durability, realpath canonicalization, walker DoS caps, and shared governance-audit helpers.

**Key Decisions**: downgrade cross-file PE mutations to `CREATE` instead of rejecting them; skip the transactional recheck only for scan saves marked `fromScan`; delete `z_future` and `external` pollution rather than downgrade it; downgrade invalid `constitutional` saves to `important`; keep the constitutional README out of the index; enforce invariants at the storage layer so every caller (including `memory_update`, `post-insert-metadata`, and `checkpoint_restore`) inherits them.

**Critical Dependencies**: `mcp_server` and `scripts` packages must typecheck and build; focused Vitest coverage for each invariant; transaction-safe cleanup against the Voyage-4 SQLite database; a live MCP restart before the dist runtime serves the new guards to clients.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Code Complete (Track B live-verified; Track A pending live MCP rescan on 026/009) |
| **Created** | 2026-04-23 |
| **Merged to root** | 2026-04-24 |
| **Parent** | `026-graph-and-context-optimization/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../009-hook-package/` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two distinct invariant failures showed up simultaneously in the memory indexer:

1. **Track A — Cross-file lineage and scan-recheck regressions.** The read-only investigation at `/tmp/codex-lineage-investigation-output.txt` found that the prediction-error gate could treat a sibling spec doc (e.g. `checklist.md`) as the best `UPDATE` or `REINFORCE` candidate for `tasks.md`, then attempt to record a lineage transition across different canonical file paths — surfacing as `E_LINEAGE`. A second failure showed the save-time transactional reconsolidation recheck rerunning candidate selection for scan-originated saves after planner-time decisions had already been made, aborting with `candidate_changed`. Baseline counts across a 026/009 scan were `E_LINEAGE=68` and `candidate_changed=58`.
2. **Track B — Index-scope and constitutional-tier pollution.** Live database inspection showed `5700` rows at `importance_tier='constitutional'`, but only `2` of those rows came from real `/constitutional/` files. The other `5698` constitutional rows were `z_future` pollution — `5947` indexed rows under `system-spec-kit/z_future/hybrid-rag-fusion-upgrade/*`. The same scan stack also lacked a permanent `external/` exclusion (a dormant but load-bearing boundary for both memory indexing and code-graph scanning), and the pre-cleanup run incorrectly admitted `.opencode/skill/system-spec-kit/constitutional/README.md` even though it is a human-oriented overview doc rather than a constitutional rule surface.

### Purpose

Enforce four permanent invariants in code, clean the existing pollution transactionally, and ensure future scans, direct saves, SQL-layer updates, post-insert metadata writes, checkpoint restores, and code-graph refreshes cannot reintroduce either failure class.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Track A — Lineage and Concurrency**
- PE orchestration downgrade of cross-file `UPDATE` / `REINFORCE` decisions to `CREATE`
- Canonical-path plumbing through `SimilarMemory` so PE can see same-file identity
- `fromScan` flag threaded from `memory_index_scan` into `memory_save`
- Guarded transactional reconsolidation recheck in `memory-save.ts` (bypass only for scan saves)
- Regression coverage for the lineage and scan paths

**Track B — Index Scope and Constitutional Tier**
- Shared path-scope helper (`mcp_server/lib/utils/index-scope.ts`) as single source of truth
- Memory discovery, spec-doc classification, `isMemoryFile()` admissibility
- Save-time scope guard + constitutional-tier downgrade
- SQL-layer tier guard on update writes and post-insert metadata
- Checkpoint-restore invariant validation inside the barrier-held transaction
- Governance-audit emission for downgrade attempts (plus a separate cleanup action)
- Code-graph recursive and specific-file scanning
- Realpath (`fs.realpathSync`) canonicalization for save-time and specific-file code-graph checks
- Walker DoS caps (`.gitignore` size cap, depth, node count)
- Transactional cleanup CLI with dry-run / apply / verify modes

### Out of Scope

- Changing reconsolidation semantics for normal (non-scan) `memory_save` calls
- Refactoring prediction-error thresholds or lineage-state invariants
- Session-handover files and the in-progress `009/.../012-docs-impact-remediation` packet
- Broader ranking/scoring refactors outside the constitutional pollution fix
- Any file outside `mcp_server/`, `scripts/memory/`, this packet, and the 026 parent metadata

### Files Changed

| Path | Track | Change Type | Description |
|------|-------|-------------|-------------|
| `mcp_server/handlers/save/pe-orchestration.ts` | A | Modify | Downgrade cross-file `UPDATE`/`REINFORCE` decisions to `CREATE` |
| `mcp_server/handlers/pe-gating.ts` | A | Modify | Preserve candidate canonical file path for PE arbitration |
| `mcp_server/handlers/save/types.ts` | A | Modify | Carry canonical file path through `SimilarMemory` |
| `mcp_server/handlers/memory-index.ts` | A | Modify | Thread `fromScan: true` for scan-originated saves while keeping default batch size |
| `mcp_server/handlers/memory-save.ts` | A+B | Modify | Guard the transactional complement recheck for scan saves; add scope + tier guard; realpath canonicalization |
| `mcp_server/lib/utils/index-scope.ts` | B | Create | Shared SSOT for memory + code-graph path exclusions (`shouldIndexForMemory`, `shouldIndexForCodeGraph`, `EXCLUDED_FOR_MEMORY`) |
| `mcp_server/handlers/memory-index-discovery.ts` | B | Modify | Call shared helper; enforce walker caps; keep constitutional README excluded |
| `mcp_server/lib/config/spec-doc-paths.ts` | B | Modify | Route spec-doc classification through `shouldIndexForMemory()` with additive overlays only |
| `mcp_server/lib/parsing/memory-parser.ts` | B | Modify | Align `isMemoryFile()` with the rule-file-only constitutional policy |
| `mcp_server/lib/search/vector-index-mutations.ts` | B | Modify | SQL-layer constitutional-tier downgrade before `UPDATE memory_index ...` |
| `mcp_server/lib/storage/post-insert-metadata.ts` | B | Modify | Inline tier guard for post-insert metadata writes |
| `mcp_server/lib/storage/checkpoints.ts` | B | Modify | Re-validate index-scope and tier invariants inside the barrier-held restore transaction |
| `mcp_server/lib/utils/canonical-path.ts` | B | Create | `resolveCanonicalPath()` wrapper around `fs.realpathSync` with fail-open fallback |
| `mcp_server/lib/governance/scope-governance.ts` | B | Modify | Centralize `GOVERNANCE_AUDIT_ACTIONS` + `recordTierDowngradeAudit()` + `buildGovernanceLogicalKey()` |
| `mcp_server/handlers/memory-crud-update.ts` | B | Modify | Route update-path constitutional transitions through the shared audit helper |
| `mcp_server/api/index.ts` | B | Modify | Re-export audit action strings for operator tooling |
| `mcp_server/code-graph/lib/indexer-types.ts` | B | Modify | Preserve legacy default excludes and add `/external/` |
| `mcp_server/code-graph/lib/structural-indexer.ts` | B | Modify | Apply `shouldIndexForCodeGraph()` in recursive + `specificFiles` paths; realpath + walker caps |
| `mcp_server/tests/pe-orchestration.vitest.ts` | A | Add | Sibling-doc lineage regression |
| `mcp_server/tests/handler-memory-index.vitest.ts` | A | Modify | `fromScan` propagation + non-scan control |
| `mcp_server/tests/index-scope.vitest.ts` | B | Add | Shared-helper unit coverage |
| `mcp_server/tests/memory-save-index-scope.vitest.ts` | B | Add | Save-time scope + tier regression |
| `mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts` | B | Add | SQL-layer update guard regression |
| `mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts` | B | Add | Atomic restore-time validation |
| `mcp_server/tests/cleanup-script-audit-emission.vitest.ts` | B | Add | Cleanup-audit durability |
| `mcp_server/tests/exclusion-ssot-unification.vitest.ts` | B | Add | SSOT unification proof |
| `mcp_server/tests/symlink-realpath-hardening.vitest.ts` | B | Add | Realpath enforcement |
| `mcp_server/tests/walker-dos-caps.vitest.ts` | B | Add | Walker DoS caps |
| `mcp_server/tests/memory-governance.vitest.ts` | B | Modify | Shared audit action coverage |
| `scripts/memory/cleanup-index-scope-violations.ts` | B | Create | Dry-run / apply / verify cleanup CLI with transactional plan rebuild |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | B | Modify | Document the invariants, helper location, and stable audit action strings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Track A: Cross-file PE `UPDATE` / `REINFORCE` reuse must be impossible. | When PE picks a sibling candidate, orchestration downgrades the action to `CREATE` unless the candidate resolves to the same canonical file path as the save target. |
| REQ-002 | Track A: Scan-originated `candidate_changed` false positives must be eliminated without changing normal-save behavior. | `memory_index_scan` threads `fromScan: true` into `memory_save`; `memory-save.ts` skips the transactional complement recheck only for `fromScan` saves; non-scan saves still surface `candidate_changed` when a non-complement candidate appears. |
| REQ-003 | Track B: `z_future` paths must never be indexed. | Memory discovery, spec-doc classification, `memory_index_scan`, and save-time validation reject any path containing a `z_future/` segment; cleanup removes all existing rows. |
| REQ-004 | Track B: `external` paths must never be indexed by memory or code-graph scanners. | Shared helpers reject any path containing an `external/` segment; both memory and code-graph walkers honor the helper; code-graph `specificFiles` refresh paths cannot bypass the exclusion. |
| REQ-005 | Track B: The `constitutional` tier must be valid only for `/constitutional/` files. | A save (direct or scan-originated) outside `/constitutional/` that declares `importanceTier: constitutional` persists as `importance_tier='important'` and writes a `governance_audit` row with `action='tier_downgrade_non_constitutional_path'`. |
| REQ-006 | Track B: The invariant must hold for every mutation surface. | SQL-layer `UPDATE memory_index` writes, post-insert metadata writes, and `checkpoint_restore` replays all inherit the same downgrade rule. Checkpoint restore aborts atomically on any invariant violation inside the barrier-held transaction. |
| REQ-007 | Track B: Existing pollution must be removed transactionally. | `cleanup-index-scope-violations` `--apply` runs inside one SQLite transaction; `--verify` exits `0` with `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, and `constitutional_total=2`. |
| REQ-008 | Focused regressions cover both tracks and every mutation surface. | All listed Vitest files pass with exit `0`. |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Track A decisions are documented. | Packet records why A2 was chosen over A1 and why B2 replaced B1 after the `E_LINEAGE 68→0` and `candidate_changed 58→159` live evidence. |
| REQ-010 | Track B architectural decisions are documented. | `decision-record.md` records the shared-helper + save-guard strategy, the delete-not-downgrade choice for `z_future`, the `important` downgrade target, the constitutional README exclusion reversal, the Wave-1 SQL-layer guards, and the Wave-2 hardening ADRs (cleanup audit durability, SSOT unification, realpath enforcement, cleanup TOCTOU closure, shared audit helpers). |
| REQ-011 | Duplicate gate-enforcement constitutional-folder rule rows are consolidated safely. | Cleanup keeps the newer row (`id=9868`), deletes the older row (`id=1`), and rewrites lineage + feedback references to the kept row. |
| REQ-012 | Constitutional README stays non-indexable while rule files stay indexable. | Discovery and parser both reject `README.md` under `/constitutional/`; focused Vitest regressions (`handler-memory-index`, `memory-parser-extended`, `full-spec-doc-indexing`, `gate-d-regression-constitutional-memory`) all pass. |
| REQ-013 | Build and typecheck commands run and are recorded. | `npm run typecheck`, `npm run build`, focused Vitest commands, and `npm run test:core` outcomes are captured in `implementation-summary.md` with honest carryover notes. |
| REQ-014 | Parent topology includes this packet. | `026-graph-and-context-optimization/description.json` and `graph-metadata.json` reference `010-memory-indexer-invariants`. |

### P2 — Recommended

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | Track A live packet acceptance is recorded honestly. | In a runtime with embedding access, `memory_index_scan` on `026/009-hook-package` completes with zero `E_LINEAGE` and zero `candidate_changed`, and the exact counts are written to `implementation-summary.md`. |
| REQ-016 | Operator README documents the invariants and stable audit action strings. | `.opencode/skill/system-spec-kit/mcp_server/README.md` describes the three index-scope invariants, the helper location, and the `GOVERNANCE_AUDIT_ACTIONS` set. |
<!-- /ANCHOR:requirements -->

### Acceptance Scenarios

- **Given** a `tasks.md` save whose top PE candidate is sibling `checklist.md`, **when** the PE gate selects `UPDATE` or `REINFORCE`, **then** orchestration downgrades the action to `CREATE`.
- **Given** `memory_index_scan` invokes `memory_save` for a packet doc, **when** the save runs with `fromScan: true`, **then** the transactional complement recheck is skipped and the write commits.
- **Given** the same save path is invoked without `fromScan`, **when** a non-complement candidate appears during the transactional recheck, **then** the save still returns `candidate_changed`.
- **Given** a spec packet file under a `z_future/` segment, **when** memory discovery, graph-metadata discovery, or direct save runs, **then** the file is rejected before indexing.
- **Given** any file under an `external/` segment, **when** memory discovery or code-graph scanning runs, **then** the file is skipped in both recursive and `specificFiles` paths.
- **Given** a non-constitutional spec doc declaring `importanceTier: constitutional`, **when** `memory_save`, `memory_update`, post-insert metadata, or `checkpoint_restore` persists it, **then** the stored tier becomes `important` and a `governance_audit` row with `action='tier_downgrade_non_constitutional_path'` is written without failing the mutation.
- **Given** a real file under `.opencode/skill/system-spec-kit/constitutional/`, **when** it is saved with `importanceTier: constitutional`, **then** the stored tier remains `constitutional`.
- **Given** a symlink pointing into `z_future/`, **when** memory-save or code-graph `specificFiles` runs, **then** `fs.realpathSync()` canonicalization routes the check to the real path and the file is rejected.
- **Given** the cleanup CLI runs with `--apply` followed by `--verify`, **when** the transaction completes, **then** the DB reports zero `z_future` rows, zero `external` rows, and only the two legitimate `/constitutional/` rule files at constitutional tier.
- **Given** the packet is validated, **when** `validate.sh --strict` runs, **then** the packet passes without structural errors.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cross-file PE candidates remain visible for similarity scoring but no longer drive lineage-bearing `UPDATE` or `REINFORCE` saves.
- **SC-002**: Scan-originated saves bypass the transactional complement recheck while non-scan saves still surface `candidate_changed`.
- **SC-003**: Memory discovery, direct saves, SQL-layer updates, post-insert metadata, and checkpoint restores all reject `z_future` and `external` paths and downgrade invalid `constitutional` tiers.
- **SC-004**: Code-graph scans exclude `/external/` in both recursive scans and `specificFiles` refresh paths while preserving existing default excludes.
- **SC-005**: After cleanup, the database reports zero `z_future` rows, zero `external` rows, and exactly `2` constitutional rows — both under `/constitutional/`.
- **SC-006**: `npm run typecheck` and `npm run build` exit `0` for both `mcp_server` and `scripts`; every focused Vitest file listed in REQ-008 passes; the `test:core` carryover failures (`copilot-hook-wiring`, `stage3-rerank-regression`) are documented and isolated from this packet.
- **SC-007**: The packet records operational acceptance honestly — including the remaining Track A live MCP rescan on `026/009-hook-package` — instead of guessing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Path-exclusion logic drifts across scanners and save paths | High | One shared helper in `index-scope.ts` plus a save-time guard plus SQL-layer guards; tests per surface |
| Risk | Cleanup misses ancillary tables or leaves references pointing at deleted rows | High | Single transaction, reference rewrites for `memory_lineage`, `memory_feedback`, and `mutation_ledger`; `--verify` mode for idempotent follow-up |
| Risk | Symlinks bypass invariant enforcement via `path.resolve()` alone | Medium | `resolveCanonicalPath()` wraps `fs.realpathSync()` and falls back to the caller-supplied path when the target is missing |
| Risk | Constitutional README gets reintroduced and pollutes the rule-only constitutional set | Medium | Keep README exclusion explicit in discovery + parser tests; verify final constitutional count stays at `2` |
| Risk | A2 downgrade adds latency to every PE decision | Low | Compare is one string equality at decision time; preserves existing candidate-search behavior |
| Risk | B2 scan-only flag path inside `memory_save` leaks into normal saves | Medium | Guard is gated on `fromScan`; `withSpecFolderLock` already serializes per-folder writes; non-scan regression proves the guarded path still fires |
| Dependency | `better-sqlite3` + `sqlite-vec` must load against the active Voyage-4 DB | Medium | Reuse existing cleanup patterns; dry-run default |
| Dependency | `npm run test:core` contains unrelated failures (`copilot-hook-wiring`, `stage3-rerank-regression`) | Medium | Record explicitly as carryover; verify each is outside touched files and reproduces in isolation |
| Dependency | Track A live acceptance scan needs an initialized MCP runtime with embedding access | Medium | Record the attempted command and rerun steps; keep readiness at `code-complete-pending-track-a-live-rescan` |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Path checks stay O(1) per file; `shouldIndexForMemory()` and `shouldIndexForCodeGraph()` add only constant-time segment matching to walker and save paths.
- **NFR-P02**: The A2 canonical-path compare adds one string equality per PE decision and preserves existing candidate-search throughput.

### Security
- **NFR-S01**: Cleanup mutations run inside a single SQLite transaction and never partially apply on failure.
- **NFR-S02**: Checkpoint-restore invariant validation runs inside the barrier-held restore transaction; a single invariant violation aborts the restore entirely (no partial replay).
- **NFR-S03**: Downgrade attempts emit durable `governance_audit` rows even when the mutation otherwise succeeds, giving operators a forensic trail.

### Reliability
- **NFR-R01**: The cleanup CLI is idempotent; `--verify` can run from CI or scheduled maintenance to detect regressions.
- **NFR-R02**: Walker DoS caps (`.gitignore` ≤ 1MB, depth ≤ 20, ≤ 50,000 nodes) prevent pathological repositories from stalling memory or code-graph scans.

---

## 8. EDGE CASES

### Data Boundaries
- Windows-style paths with backslashes still match segment exclusions after normalization.
- `specificFiles` code-graph refreshes cannot bypass `/external/` exclusion.
- Symlinks into excluded subtrees are caught by realpath canonicalization on save and on `specificFiles` scans.
- Constitutional README files stay excluded even inside `/constitutional/`; other markdown rule files remain indexable.
- `.gitignore` files larger than `1MB` are truncated with a warning instead of consuming unbounded memory.

### Error Scenarios
- If cleanup cannot determine the duplicate survivor or rewrite references safely, the transaction aborts and the DB remains unchanged.
- If a caller bypasses the walker and calls save/index APIs directly with excluded paths, save-time and SQL-layer guards reject the write.
- If `fs.realpathSync()` throws (missing or broken symlink), `resolveCanonicalPath()` falls back to the caller-supplied absolute path so not-yet-created files still flow through atomic save.
- If the downgrade audit insert fails (audit persistence error), the runtime logs and preserves the invariant outcome without failing the mutation.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Two tracks; PE + save + SQL + checkpoint + walker + cleanup CLI + audit + operator docs |
| Risk | 23/25 | DB mutations, retrieval-ranking pollution, permanent invariant enforcement, atomic restore validation |
| Research | 18/20 | Multi-path investigation (`/tmp/codex-lineage-investigation-output.txt`), live schema inspection, two deep-review passes on Track B |
| Multi-Agent | 4/15 | Single-agent implementation with deep-review coordination for Wave-2 |
| Coordination | 12/15 | Code + DB cleanup + documentation + governance audit alignment |
| **Total** | **79/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cleanup deletes the wrong constitutional row | H | L | Resolve duplicates by path + timestamp inside the transaction; verify counts before commit |
| R-002 | A bypass path reintroduces excluded files | H | M | Walker exclusions + save-time guard + SQL-layer guard + checkpoint-restore validation, all backed by shared helpers |
| R-003 | README overview doc gets mistaken for a rule file again | M | L | Keep `README.md` excluded in discovery + parser checks; verify final constitutional counts |
| R-004 | Cross-file PE mutation sneaks past the A2 guard | H | L | Canonical-path equality check at decision time plus regression on sibling `tasks.md` vs `checklist.md` |
| R-005 | `fromScan` leaks into normal save and weakens reconsolidation | M | L | Flag is default `false`; explicit non-scan regression |
| R-006 | Track A live rescan never happens; readiness gets auto-promoted | M | L | Keep the packet at `code-complete-pending-track-a-live-rescan`; document the exact command + expected counts |

---

## 11. USER STORIES

### US-001: Memory Operator Safety (Priority: P0)

**As a** maintainer, **I want** `z_future` and `external` content to stay out of the memory index, **so that** auto-surface and search results reflect only live, canonical material.

**Acceptance Criteria**:
1. Given a spec doc under `z_future`, When discovery or save runs, Then no memory row is created.
2. Given a file under `external`, When memory or code-graph scanning runs, Then the file is skipped.

### US-002: Constitutional Tier Integrity (Priority: P0)

**As a** maintainer, **I want** constitutional tier to apply only to dedicated constitutional rule files, **so that** real guardrails outrank ordinary docs.

**Acceptance Criteria**:
1. Given a non-constitutional spec doc with `importanceTier: constitutional`, When it is saved (direct, update, post-insert, or checkpoint restore), Then the stored tier is `important` and a governance-audit row is written.
2. Given a file inside `/constitutional/`, When it is saved with `importanceTier: constitutional`, Then the stored tier remains `constitutional`.

### US-003: Lineage Safety (Priority: P0)

**As a** maintainer, **I want** sibling spec docs to never share a lineage chain, **so that** `memory_index_scan` runs cannot corrupt PE history.

**Acceptance Criteria**:
1. Given a `tasks.md` save with sibling `checklist.md` as the top PE candidate, When PE selects `UPDATE` or `REINFORCE`, Then orchestration downgrades the action to `CREATE`.
2. Given a scan-originated save, When planner-time and commit-time candidates diverge, Then `candidate_changed` no longer aborts the write while non-scan saves keep the guarded path.

### US-004: Pollution Cleanup (Priority: P1)

**As a** maintainer, **I want** a repeatable cleanup CLI, **so that** existing index pollution can be removed and future regressions can be detected automatically.

**Acceptance Criteria**:
1. Given the live Voyage-4 DB, When the cleanup runs in dry-run mode, Then it reports rows that would be deleted or downgraded without mutating the DB.
2. Given `--apply`, When the cleanup completes, Then all targeted mutations commit inside one transaction or fully roll back.
3. Given `--verify`, When no violations remain, Then the command exits `0`.

---

## AI Execution Protocol

### Pre-Task Checklist

- Re-read each runtime file immediately before patching it.
- Keep all edits inside this packet, the listed `mcp_server/` surfaces, the cleanup script, and the 026 parent metadata.
- Confirm Track A does not regress when Track B guards are wired into the same save pipeline.
- Reconfirm the live DB target and cleanup transaction requirements before running `--apply`.

### Execution Rules

| Rule | Expectation |
|------|-------------|
| Read-first | Every edited file must be re-read immediately before patching. |
| Single-source policy | Path exclusions land in `index-scope.ts` and are imported everywhere else; governance-audit action strings live in `GOVERNANCE_AUDIT_ACTIONS`. |
| Defense in depth | Save-time, SQL-layer, post-insert, and restore-time guards remain active even if a caller bypasses discovery. |
| Honest verification | Command failures, carryover suite failures, and pending live rescans are recorded exactly as observed. |

### Status Reporting Format

- Report packet validation status first, then Track A status, then Track B status, then test and cleanup status.
- Record command names, exit codes, before/after DB counts, and the exact pending live-rescan blocker in `implementation-summary.md` and `checklist.md`.

### Blocked Task Protocol

- Stop immediately if schema inspection reveals an unclear memory-linked table or reference that cannot be updated safely.
- Abort cleanup apply on the first SQL error and leave the DB unchanged by rolling back the transaction.
- Record blockers in `implementation-summary.md` instead of guessing.

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

None blocking. Two operational items remain open and are tracked in `implementation-summary.md`:

1. Track A live MCP rescan on `026/009-hook-package` — requires an MCP restart plus embedding access.
2. `npm run test:core` carryover failures in `copilot-hook-wiring.vitest.ts` and `stage3-rerank-regression.vitest.ts` — outside this packet's touched files; isolated repros confirmed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Investigation Source**: `/tmp/codex-lineage-investigation-output.txt`

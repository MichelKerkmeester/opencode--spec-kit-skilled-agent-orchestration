---
title: "Checklist: Memory Indexer Invariants [system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/checklist]"
description: "Unified verification log for both invariant tracks, Wave-1 remediation, Wave-2 hardening, cleanup CLI execution, strict packet validation, and the phase-merge restructure."
trigger_phrases:
  - "026/010 checklist"
  - "memory indexer invariants verification"
  - "index scope verification"
  - "constitutional tier verification"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants"
    last_updated_at: "2026-04-24T19:25:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged Track A + Track B verification into single root checklist"
    next_safe_action: "Restart MCP and rerun memory_index_scan on 026/009 to close Track A live acceptance"
    blockers:
      - "Track A live MCP rescan on 026/009 still pending"
    completion_pct: 95
    status: "code-complete-pending-track-a-live-rescan"
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->"
---
# Verification Checklist: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete or be documented as a carryover |
| **P2** | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **CHK-001** [P0] Requirements documented in `spec.md`. [EVIDENCE: REQ-001 through REQ-016 cover both tracks.]
- [x] **CHK-002** [P0] Technical approach defined in `plan.md`. [EVIDENCE: shared helpers + defense-in-depth architecture with per-phase breakdown.]
- [x] **CHK-003** [P1] Dependencies identified and available. [EVIDENCE: plan dependency table — `better-sqlite3`, `sqlite-vec`, Vitest harness, embedding access for Track A rescan.]
- [x] **CHK-004** [P1] Root-cause evidence was read before code edits. [EVIDENCE: `/tmp/codex-lineage-investigation-output.txt` + live DB inspection.]
- [x] **CHK-005** [P1] Existing code paths were read before modification. [EVIDENCE: `pe-gating.ts`, `prediction-error-gate.ts`, `memory-index.ts`, `memory-save.ts`, `reconsolidation-bridge.ts`, `memory-index-discovery.ts`, `spec-doc-paths.ts`, `structural-indexer.ts`.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Track A — Lineage and Concurrency

- [x] **CHK-A01** [P0] Fix A prevents cross-file `UPDATE` / `REINFORCE` reuse. [EVIDENCE: `handlers/save/pe-orchestration.ts` downgrades mismatched canonical-path candidates to `CREATE`.]
- [x] **CHK-A02** [P0] Fix B removes scan-originated `candidate_changed` false positives without changing non-scan behavior. [EVIDENCE: `handlers/memory-save.ts` guards the transactional recheck on `fromScan`; non-scan path is preserved.]
- [x] **CHK-A03** [P1] Track A runtime diff stays surgical. [EVIDENCE: runtime edits limited to 5 files under `mcp_server/handlers` and `mcp_server/handlers/save`.]
- [x] **CHK-A04** [P1] Fix A uses A2 (post-filter at decision time); rationale recorded. [EVIDENCE: `decision-record.md` ADR-001.]
- [x] **CHK-A05** [P1] Fix B uses B2 (`fromScan` flag); rationale recorded with live acceptance evidence `E_LINEAGE 68→0` and `candidate_changed 58→159`. [EVIDENCE: `decision-record.md` ADR-002.]
- [x] **CHK-A06** [P1] Track A does not weaken lineage invariants. [EVIDENCE: A2 downgrades unsafe cross-file mutations to `CREATE` instead of bypassing lineage checks.]
- [x] **CHK-A07** [P1] Track A does not change normal `memory_save` behavior. [EVIDENCE: only scan-originated saves set `fromScan: true`; non-scan regression confirms the guarded path still fires.]

### Track B — Index Scope and Constitutional Tier

- [x] **CHK-B01** [P0] Shared helper enforces memory exclusions for `z_future`, `external`, and `z_archive`. [EVIDENCE: `lib/utils/index-scope.ts` + wiring in `memory-index-discovery.ts`, `spec-doc-paths.ts`, `memory-parser.ts`.]
- [x] **CHK-B02** [P0] Shared helper enforces code-graph exclusions for `external` plus existing default excludes. [EVIDENCE: `code_graph/lib/indexer-types.ts` preserves legacy excludes; `structural-indexer.ts` consults `shouldIndexForCodeGraph()`.]
- [x] **CHK-B03** [P0] Save-time guard rejects excluded paths and downgrades invalid constitutional tiers. [EVIDENCE: `handlers/memory-save.ts` rejects helper-excluded paths and downgrades non-constitutional constitutional saves to `important` before DB writes.]
- [x] **CHK-B04** [P1] Constitutional README stays excluded while constitutional rule files remain indexable. [EVIDENCE: `memory-index-discovery.ts` and `memory-parser.ts` reject README under the constitutional folder; `handler-memory-index`, `memory-parser-extended`, `full-spec-doc-indexing`, `gate-d-regression-constitutional-memory` all pass.]

### Track B — Wave-1 Storage-Layer Remediation

- [x] **CHK-W1-01** [P0] SQL-layer update writes cannot persist `importance_tier='constitutional'` for non-constitutional paths. [EVIDENCE: `lib/search/vector-index-mutations.ts` downgrades invalid update writes before the SQL `UPDATE`.]
- [x] **CHK-W1-02** [P0] `checkpoint_restore` re-validates index-scope and tier invariants inside the barrier-held restore transaction. [EVIDENCE: `lib/storage/checkpoints.ts` rejects walker-excluded paths, downgrades invalid tiers, aborts the restore on the first rejected row.]
- [x] **CHK-W1-03** [P0] Non-constitutional tier downgrade attempts write a durable `governance_audit` row without failing the mutation. [EVIDENCE: `memory-save.ts`, `vector-index-mutations.ts`, `checkpoints.ts` all emit `action='tier_downgrade_non_constitutional_path'`.]

### Track B — Wave-2 Hardening

- [x] **CHK-W2-01** [P1] Cleanup retains historical `governance_audit` rows for deleted memories and emits `tier_downgrade_non_constitutional_path_cleanup` rows for every cleanup downgrade. [EVIDENCE: `scripts/memory/cleanup-index-scope-violations.ts`.]
- [x] **CHK-W2-02** [P1] Spec-doc classification and discovery inherit `EXCLUDED_FOR_MEMORY` through helper calls rather than duplicated exclusion arrays. [EVIDENCE: `lib/config/spec-doc-paths.ts`, `handlers/memory-index-discovery.ts`.]
- [x] **CHK-W2-03** [P1] Memory-save and code-graph specific-file indexing resolve symlinks before invariant checks. [EVIDENCE: `lib/utils/canonical-path.ts`, `handlers/memory-save.ts`, `code_graph/lib/structural-indexer.ts`.]
- [x] **CHK-W2-04** [P1] Recursive walkers cap `.gitignore` reads at 1MB, stop descending past depth 20, and abort past 50,000 nodes with warnings. [EVIDENCE: `handlers/memory-index-discovery.ts`, `code_graph/lib/structural-indexer.ts`.]
- [x] **CHK-W2-05** [P2] Governance-audit action strings are centralized and operator-documented. [EVIDENCE: `lib/governance/scope-governance.ts`, `.opencode/skill/system-spec-kit/mcp_server/README.md`.]
- [x] **CHK-W2-06** [P1] Cleanup apply rebuilds its plan inside the transaction snapshot (TOCTOU closed). [EVIDENCE: `scripts/memory/cleanup-index-scope-violations.ts:429-435`.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-T01** [P0] Track A focused regressions exit `0`. [EVIDENCE: `npx vitest run tests/pe-orchestration.vitest.ts tests/handler-memory-index.vitest.ts` returned `26 passed (26)`.]
- [x] **CHK-T02** [P0] Unit tests for `shouldIndexForMemory()` and `shouldIndexForCodeGraph()` pass. [EVIDENCE: `tests/index-scope.vitest.ts` exit `0`.]
- [x] **CHK-T03** [P0] Integration test proves `z_future` scan candidates are skipped. [EVIDENCE: `tests/index-scope.vitest.ts`, `tests/full-spec-doc-indexing.vitest.ts`, `tests/tree-sitter-parser.vitest.ts` all pass.]
- [x] **CHK-T04** [P0] Integration test proves non-constitutional `importanceTier: constitutional` saves as `important`. [EVIDENCE: `tests/memory-save-index-scope.vitest.ts` passes.]
- [x] **CHK-T05** [P0] Integration test proves constitutional-folder saves preserve the constitutional tier. [EVIDENCE: `tests/memory-save-index-scope.vitest.ts` passes.]
- [x] **CHK-T06** [P0] Integration test proves SQL-layer update downgrades invalid constitutional writes. [EVIDENCE: `tests/memory-crud-update-constitutional-guard.vitest.ts` passes.]
- [x] **CHK-T07** [P0] Integration test proves `checkpoint_restore` aborts atomically on invariant violations. [EVIDENCE: `tests/checkpoint-restore-invariant-enforcement.vitest.ts` passes.]
- [x] **CHK-T08** [P1] Wave-2 focused Vitest set exits `0`. [EVIDENCE: 20 tests passed across 8 files: `index-scope`, `memory-save-index-scope`, `memory-crud-update-constitutional-guard`, `checkpoint-restore-invariant-enforcement`, `cleanup-script-audit-emission`, `exclusion-ssot-unification`, `symlink-realpath-hardening`, `walker-dos-caps`.]
- [x] **CHK-T09** [P1] README-regression set exits `0`. [EVIDENCE: 218 tests passed across `handler-memory-index`, `memory-parser-extended`, `full-spec-doc-indexing`, `gate-d-regression-constitutional-memory`.]
- [x] **CHK-T10** [P1] `tests/memory-governance.vitest.ts` exits `0`. [EVIDENCE: cleanup action-string coverage added for `tier_downgrade_non_constitutional_path_cleanup`.]
- [x] **CHK-T11** [P1] `timeout 300 npm run test:core` recorded honestly with carryover failures. [EVIDENCE: exit `124`; observed carryover failures in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` — both reproduced in isolation, both outside this packet's touched files.]
- [x] **CHK-T12** [P1] `npm run typecheck` exits `0` for `mcp_server` and `scripts`. [EVIDENCE: both exit `0`.]
- [x] **CHK-T13** [P1] `npm run build` exits `0` for `mcp_server` and `scripts`. [EVIDENCE: both exit `0`.]
- [x] **CHK-T14** [P1] Strict packet validation. [EVIDENCE: `validate.sh --strict --no-recursive` exit `0`.]
- [ ] **CHK-T15** [P0] Live-capable packet acceptance rerun recorded. (BLOCKED: requires user MCP restart + fresh `memory_index_scan` on `026/009-hook-parity` in an embedding-capable runtime.)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **CHK-S01** [P0] Cleanup CLI runs all mutations inside a single transaction with transaction-snapshot plan rebuild. [EVIDENCE: `scripts/memory/cleanup-index-scope-violations.ts` wraps apply in `database.transaction(...)`.]
- [x] **CHK-S02** [P0] Checkpoint restore aborts atomically on invariant violation. [EVIDENCE: `lib/storage/checkpoints.ts` rejects walker-excluded paths, downgrades invalid tiers in place, aborts the restore on the first rejected row.]
- [x] **CHK-S03** [P0] Downgrade-audit persistence failures never block the invariant mutation. [EVIDENCE: audit insert errors are caught, logged, and the invariant outcome is preserved.]
- [x] **CHK-S04** [P0] Cleanup CLI is idempotent across repeat runs. [EVIDENCE: second `--apply` reported zero planned + zero applied changes.]
- [x] **CHK-S05** [P1] Duplicate constitutional gate-enforcement rule rows handled safely: keep the newer row (`id=9868`), rewrite references. [EVIDENCE: first apply reported `rewritten_feedback_rows=2`, `rewritten_lineage_rows=3`, then `gate_enforcement_rows=1`.]
- [x] **CHK-S06** [P1] Symlinks cannot bypass invariant enforcement. [EVIDENCE: `resolveCanonicalPath()` uses `fs.realpathSync` with fail-open fallback; `tests/symlink-realpath-hardening.vitest.ts` passes.]
- [x] **CHK-S07** [P1] Walker DoS caps prevent pathological repos from stalling scans. [EVIDENCE: `.gitignore` ≤ 1MB, depth ≤ 20, ≤ 50,000 nodes; `tests/walker-dos-caps.vitest.ts` passes.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-D01** [P1] `spec.md` records REQ-001 through REQ-016 and the live DB baseline. [EVIDENCE: spec.md §4.]
- [x] **CHK-D02** [P1] `plan.md` defines the shared-helper + save-guard + SQL-layer + cleanup + verification phases. [EVIDENCE: plan.md §3 + §4.]
- [x] **CHK-D03** [P1] `decision-record.md` records the invariant-enforcement ADR, delete-not-downgrade ADR, `important` downgrade ADR, constitutional-README exclusion ADR, Wave-1 SQL-layer ADR, and Wave-2 hardening ADRs (cleanup audit durability, SSOT unification, realpath, TOCTOU, governance audit helpers). [EVIDENCE: decision-record.md ADR-001 through ADR-012.]
- [x] **CHK-D04** [P1] `implementation-summary.md` includes before/after DB counts and command exit codes. [EVIDENCE: implementation-summary.md verification + before/after tables.]
- [x] **CHK-D05** [P1] Operator README documents the three invariants, helper location, and stable audit action strings. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md` "Index Scope Invariants" section.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-F01** [P1] Runtime edits stay inside `mcp_server/`. [EVIDENCE: touched runtime files all live under `.opencode/skill/system-spec-kit/mcp_server/`.]
- [x] **CHK-F02** [P1] Cleanup script stays inside `scripts/memory/`. [EVIDENCE: `scripts/memory/cleanup-index-scope-violations.ts`.]
- [x] **CHK-F03** [P1] Packet docs stay inside the root folder (no phase folders). [EVIDENCE: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json` all live at `005-memory-indexer-invariants/` root.]
- [x] **CHK-F04** [P1] Parent 026 metadata references this packet. [EVIDENCE: parent `description.json` and `graph-metadata.json` reference `005-memory-indexer-invariants`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 12/13 (CHK-T15 pending live rescan) |
| P1 Items | 29 | 29/29 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-24

### Verification Log

- 2026-04-23: Track A code changes landed. Replaced Fix B1 with B2 after live acceptance showed the transactional reconsolidation recheck was the real `candidate_changed` source.
- 2026-04-23: Track A focused regressions `26/26` passed; `npm run typecheck` + `npm run build` exit `0`; `test:core` exit `124` with pre-existing carryover.
- 2026-04-24: Track B baseline landed — shared helper + save-time guard + code-graph wiring + cleanup CLI.
- 2026-04-24: Wave-1 remediation landed — SQL-layer tier guard, atomic checkpoint-restore validation, governance-audit durability.
- 2026-04-24: Wave-2 hardening landed — cleanup audit durability, SSOT unification, realpath canonicalization, cleanup TOCTOU closure, walker DoS caps, shared governance-audit helpers.
- 2026-04-24: Live cleanup against Voyage-4 DB — `--apply` and `--verify` both exit `0`; final counts `constitutional_total=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1`.
- 2026-04-24: Phase 001 + Phase 002 tracks merged into root docs; phase folders removed; aliases preserved in `graph-metadata.json` for legacy cross-references.
- 2026-04-24 (pending): Track A live packet acceptance still requires a user MCP restart plus a fresh `memory_index_scan` on `026/009-hook-parity`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] **CHK-AR01** [P0] Architecture decisions documented in `decision-record.md`. [EVIDENCE: ADR-001 through ADR-012.]
- [x] **CHK-AR02** [P1] Alternatives documented with rejection rationale per ADR. [EVIDENCE: each ADR includes an alternatives table with chosen rationale.]
- [x] **CHK-AR03** [P1] Rollback and verify steps documented for cleanup and runtime changes. [EVIDENCE: `decision-record.md` + `plan.md` §7 + `implementation-summary.md`.]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] **CHK-R01** [P0] Activation note records that MCP restart is required. [EVIDENCE: `implementation-summary.md` notes restart required so the new dist save/scan/update/checkpoint guards are active in MCP clients.]
- [x] **CHK-R02** [P0] Cleanup `--verify` exits `0` after apply. [EVIDENCE: post-apply `--verify` exited `0` with `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`.]
- [x] **CHK-R03** [P1] Final constitutional-tier count recorded. [EVIDENCE: final constitutional total is `2` and matches only the two constitutional-folder rule files.]
<!-- /ANCHOR:deploy-ready -->

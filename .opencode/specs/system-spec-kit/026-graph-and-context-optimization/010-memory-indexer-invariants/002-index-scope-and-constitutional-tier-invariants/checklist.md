---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
title: "Verification Checklist: Index Scope and Constitutional Tier Invariants"
description: "Verification log for shared path exclusions, constitutional tier gating, cleanup CLI results, and Level 3 packet validation."
trigger_phrases:
  - "026/011 checklist"
  - "index scope invariants checklist"
  - "constitutional cleanup checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-invariants/002-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T14:10:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Wave-2 remediation complete"
    next_safe_action: "Run pass-3 deep-review to confirm zero remaining P0/P1 scope debt, or close packet"
    status: "wave-2-remediation-complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Index Scope and Constitutional Tier Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` [EVIDENCE: spec.md records REQ-001 through REQ-010 and the live DB baseline]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` [EVIDENCE: plan.md defines the shared-helper, save-guard, cleanup, and verification phases]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependency table lists the MCP server runtime, SQLite toolchain, and Vitest harness]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shared helper enforces memory exclusions for `z_future`, `external`, and `z_archive` [EVIDENCE: `mcp_server/lib/utils/index-scope.ts` plus discovery/parser wiring in `memory-index-discovery.ts`, `spec-doc-paths.ts`, and `memory-parser.ts`]
- [x] CHK-011 [P0] Shared helper enforces code-graph exclusions for `external` plus existing default excludes [EVIDENCE: `mcp_server/code-graph/lib/indexer-types.ts` preserves legacy excludes and `structural-indexer.ts` now also consults `shouldIndexForCodeGraph()`]
- [x] CHK-012 [P0] Save-time guard rejects excluded paths and downgrades invalid constitutional tiers [EVIDENCE: `mcp_server/handlers/memory-save.ts` rejects helper-excluded paths and downgrades non-constitutional `constitutional` saves to `important` before DB writes]
- [x] CHK-013 [P1] Constitutional README stays excluded while constitutional rule files remain indexable [EVIDENCE: `memory-index-discovery.ts` and `memory-parser.ts` both reject `README.md` under `/constitutional/`; `handler-memory-index.vitest.ts`, `memory-parser-extended.vitest.ts`, `full-spec-doc-indexing.vitest.ts`, and `gate-d-regression-constitutional-memory.vitest.ts` all pass]
- [x] CHK-W1-001 [P0] SQL-layer update writes cannot persist `importance_tier='constitutional'` for non-constitutional paths [EVIDENCE: `mcp_server/lib/search/vector-index-mutations.ts` now downgrades invalid update writes before the SQL `UPDATE`, and `tests/memory-crud-update-constitutional-guard.vitest.ts` passes]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Unit tests for `shouldIndexForMemory()` and `shouldIndexForCodeGraph()` pass [EVIDENCE: `npx vitest run tests/index-scope.vitest.ts` exit `0`]
- [x] CHK-021 [P0] Integration test proves `z_future` scan candidates are skipped [EVIDENCE: `tests/index-scope.vitest.ts`, `tests/full-spec-doc-indexing.vitest.ts`, and `tests/tree-sitter-parser.vitest.ts` all pass in the focused run]
- [x] CHK-022 [P0] Integration test proves non-constitutional `importanceTier: constitutional` saves as `important` [EVIDENCE: `tests/memory-save-index-scope.vitest.ts` passes]
- [x] CHK-023 [P0] Integration test proves `/constitutional/` saves preserve the constitutional tier [EVIDENCE: `tests/memory-save-index-scope.vitest.ts` passes]
- [x] CHK-024 [P1] `npm run typecheck` exits `0` [EVIDENCE: `mcp_server` and `scripts` typecheck commands both exit `0`]
- [x] CHK-025 [P1] `npm run build` exits `0` [EVIDENCE: `mcp_server` and `scripts` build commands both exit `0`]
- [x] CHK-026 [P1] Focused Vitest command exits `0` [EVIDENCE: requested run across `tests/index-scope.vitest.ts` and `tests/memory-save-index-scope.vitest.ts` passed with `8` tests; the four README-regression files also passed with `218` tests]
- [x] CHK-027 [P1] `npm run test:core` outcome recorded honestly, including carryover failures if any [EVIDENCE: `timeout 300 npm run test:core` exited `124`; observed existing failures included `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` before timeout]
- [x] CHK-W1-004 [P1] Wave-1 focused Vitest command exits `0` [EVIDENCE: `npx vitest run tests/index-scope.vitest.ts tests/memory-save-index-scope.vitest.ts tests/memory-crud-update-constitutional-guard.vitest.ts tests/checkpoint-restore-invariant-enforcement.vitest.ts` exit `0`]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Cleanup CLI runs all mutations inside a single transaction [EVIDENCE: `cleanup-index-scope-violations.ts` wraps `applyCleanup()` in `database.transaction(...)`]
- [x] CHK-031 [P0] Cleanup CLI is idempotent across repeat runs [EVIDENCE: second `--apply` reported zero planned and zero applied changes]
- [x] CHK-032 [P1] Duplicate `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` handling keeps the newer row and rewrites references safely [EVIDENCE: survivor `9868`; first apply reported `rewritten_feedback_rows=2` and `rewritten_lineage_rows=3`, then `gate_enforcement_rows=1`]
- [x] CHK-W1-002 [P0] `checkpoint_restore` re-validates index-scope and constitutional-tier invariants before replaying snapshot rows [EVIDENCE: `mcp_server/lib/storage/checkpoints.ts` validates inside the barrier-held restore transaction, and `tests/checkpoint-restore-invariant-enforcement.vitest.ts` passes]
- [x] CHK-W1-003 [P0] Non-constitutional tier downgrade attempts write a durable `governance_audit` row without failing the mutation [EVIDENCE: `mcp_server/handlers/memory-save.ts`, `mcp_server/lib/search/vector-index-mutations.ts`, and `mcp_server/lib/storage/checkpoints.ts` now emit `action='tier_downgrade_non_constitutional_path'`; focused Vitest coverage passes]
- [x] CHK-W1-005 [P1] Live cleanup verify still exits `0` after the Wave-1 runtime rebuild [EVIDENCE: `node scripts/dist/memory/cleanup-index-scope-violations.js --verify` exit `0` with the final constitutional and exclusion counts recorded in `implementation-summary.md`]
- [x] CHK-W2-001 [P1] Cleanup retains historical `governance_audit` rows for deleted memories and emits `tier_downgrade_non_constitutional_path_cleanup` rows for every cleanup downgrade [EVIDENCE: `tests/cleanup-script-audit-emission.vitest.ts` passes]
- [x] CHK-W2-002 [P1] Spec-doc classification and discovery inherit `EXCLUDED_FOR_MEMORY` through helper calls rather than duplicated exclusion arrays [EVIDENCE: `mcp_server/lib/config/spec-doc-paths.ts`, `mcp_server/handlers/memory-index-discovery.ts`, and `tests/exclusion-ssot-unification.vitest.ts`]
- [x] CHK-W2-003 [P1] Memory-save and code-graph specific-file indexing resolve symlinks before invariant checks [EVIDENCE: `mcp_server/lib/utils/canonical-path.ts`, `mcp_server/handlers/memory-save.ts`, `mcp_server/code-graph/lib/structural-indexer.ts`, and `tests/symlink-realpath-hardening.vitest.ts`]
- [x] CHK-W2-004 [P1] Recursive walkers cap `.gitignore` reads at 1MB, stop descending past depth 20, and abort past 50,000 nodes with warnings [EVIDENCE: `tests/walker-dos-caps.vitest.ts` passes]
- [x] CHK-W2-005 [P2] Governance audit action strings are centralized and operator-documented [EVIDENCE: `mcp_server/lib/governance/scope-governance.ts`, `mcp_server/tests/memory-governance.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/README.md`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `research/research.md` contains exact file:line references for every investigated code point [EVIDENCE: `research/research.md` records scanner, tier, parser, auto-surface, and cleanup-tooling references]
- [x] CHK-041 [P1] `decision-record.md` records the cleanup, SSOT, realpath, TOCTOU, and governance-audit decisions needed to preserve packet 011 invariants [EVIDENCE: ADR-002 through ADR-006 plus ADR-008 through ADR-012]
- [x] CHK-042 [P1] `implementation-summary.md` includes before/after DB counts and command exit codes [EVIDENCE: finalized summary below]
- [x] CHK-043 [P1] `.opencode/skill/system-spec-kit/mcp_server/README.md` documents the three invariants and helper location [EVIDENCE: new "Index Scope Invariants" section]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Packet 011 passes strict validation [EVIDENCE: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict --no-recursive` exit `0`]
- [x] CHK-051 [P1] Parent 026 metadata references child 011 [EVIDENCE: parent `description.json` and `graph-metadata.json` updated]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | Wave-1 + Wave-2 required checks | All verified |
| P1 Items | Wave-1 + Wave-2 hardening checks | All verified |
| P2 Items | Packet-local doc and audit observability checks | Verified or intentionally documented |

**Verification Date**: 2026-04-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md` [EVIDENCE: ADR-001 through ADR-004]
- [x] CHK-101 [P1] Alternatives documented with rejection rationale [EVIDENCE: each ADR includes an alternatives table with chosen rationale]
- [x] CHK-102 [P1] Rollback and verify steps documented for cleanup and runtime changes [EVIDENCE: `decision-record.md` and `implementation-summary.md` record rollback/verify notes]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Activation note records whether MCP restart is required [EVIDENCE: `implementation-summary.md` notes restart required so the new dist save/scan guards are active in MCP clients]
- [x] CHK-121 [P0] Cleanup `--verify` exits `0` after apply [EVIDENCE: post-correction `--verify` exited `0` with `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, and `invalid_constitutional_rows=0`]
- [x] CHK-122 [P1] Final constitutional-tier count is recorded [EVIDENCE: final constitutional total is `2` and matches the two rule files only]
<!-- /ANCHOR:deploy-ready -->

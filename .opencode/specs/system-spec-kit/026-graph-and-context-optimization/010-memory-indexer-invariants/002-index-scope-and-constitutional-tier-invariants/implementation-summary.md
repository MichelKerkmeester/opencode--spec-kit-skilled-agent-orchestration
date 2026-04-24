---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Index Scope and Constitutional Tier Invariants"
description: "Final implementation summary for Wave-1 and Wave-2 remediation of packet 011, including cleanup auditing, SSOT unification, realpath hardening, walker caps, and verification outcomes."
trigger_phrases:
  - "026/011 implementation summary"
  - "index scope implementation summary"
importance_tier: "important"
contextType: "implementation"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-index-scope-and-constitutional-tier-invariants |
| **Completed** | Wave-2 Remediation Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Packet 011 is now closed through Wave-2. The final state keeps `index-scope.ts` as the invariant source of truth, enforces constitutional-tier normalization across save/update/post-insert/checkpoint paths, hardens symlink handling with realpaths, adds walker DoS caps, and makes cleanup normalization durably auditable instead of silently mutating or erasing evidence.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet landed in three stages:

1. Baseline invariant wiring and live cleanup of the original `z_future` / constitutional pollution.
2. Wave-1 remediation for the two release-blocking bypasses plus first-pass downgrade auditing.
3. Wave-2 hardening for cleanup audit durability, exclusion SSOT unification, realpath enforcement, cleanup TOCTOU closure, walker caps, shared governance audit helpers, and operator/spec doc drift.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete `z_future` rows instead of downgrading them | The invariant is absolute: `z_future` must never be indexed |
| Downgrade invalid constitutional saves to `important` | It preserves the save while stopping polluted constitutional rows |
| Exclude the constitutional README | It is a human-oriented overview doc, not a rule surface |
| Let `memory_index` own FTS cleanup | Direct `memory_fts` deletes conflicted with the `memory_index` FTS delete trigger and caused malformed cleanup applies |
| Keep cleanup audit rows as historical evidence | Forensics must outlive the deleted `memory_index` rows they describe |
| Keep spec-doc exclusions additive around `shouldIndexForMemory()` | Packet-specific walker skips should not fork the invariant source of truth |
<!-- /ANCHOR:decisions -->

---

**Wave-2 Remediation**

Wave-2 closed the five deferred hardening items from pass-2 plus the related P2 doc drift. The runtime and script changes stayed surgical and preserved all Wave-1 guards.

| Finding IDs | Patch Surface | Evidence |
|-------------|---------------|----------|
| `P1-pass2-004`, `P2-pass2-006` | `scripts/memory/cleanup-index-scope-violations.ts:318-358,429-435` | Cleanup no longer deletes `governance_audit` rows for deleted memories, emits `tier_downgrade_non_constitutional_path_cleanup` per downgraded row, and rebuilds the apply plan inside the transaction snapshot |
| `P1-013`, `P1-014` | `mcp_server/lib/config/spec-doc-paths.ts:29-80`; `mcp_server/handlers/memory-index-discovery.ts:28-49,89-130,243-285` | Spec-doc classification and discovery now call `shouldIndexForMemory()` as the SSOT, with only additive overlay exclusions for packet-specific walker behavior |
| `P1-003`, `P1-017` | `mcp_server/lib/utils/canonical-path.ts:32-41`; `mcp_server/handlers/memory-save.ts:308-325,2714-2718`; `mcp_server/code-graph/lib/structural-indexer.ts:1273-1285` | Save-time invariant checks and code-graph `specificFiles` now evaluate `fs.realpathSync()` results instead of string-normalized paths |
| `P1-001`, `P1-009` | `scripts/memory/cleanup-index-scope-violations.ts:429-435`; `mcp_server/handlers/memory-index-discovery.ts:28-49,91-110,253-273`; `mcp_server/code-graph/lib/structural-indexer.ts:1161-1240` | Cleanup apply builds from the transaction snapshot, `.gitignore` reads cap at 1MB, and recursive walkers stop at depth 20 or 50,000 nodes with warnings |
| `P2-pass2-003`, `P2-pass2-004`, `P2-pass2-007`, `P1-015` | `mcp_server/lib/governance/scope-governance.ts:117-137,184-195,372-390`; `mcp_server/lib/search/vector-index-mutations.ts:64-100,450-472`; `mcp_server/handlers/memory-crud-update.ts:156-200`; `mcp_server/lib/storage/post-insert-metadata.ts:91-116`; `mcp_server/handlers/memory-save.ts:318-325`; `mcp_server/lib/storage/checkpoints.ts:92-100,1291-1368,1570-1572,1651,1858-1862`; `.opencode/skill/system-spec-kit/mcp_server/README.md:119-123` | Shared action strings and `recordTierDowngradeAudit()` now drive every tier-downgrade emitter, update-path `constitutional -> critical` transitions are audited, and the operator README documents the stable action strings |

**Focused Test Coverage**

- `mcp_server/tests/memory-save-index-scope.vitest.ts:340-399`
- `mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:1-221`
- `mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts:1-245`
- `mcp_server/tests/cleanup-script-audit-emission.vitest.ts:1-125`
- `mcp_server/tests/exclusion-ssot-unification.vitest.ts:1-69`
- `mcp_server/tests/symlink-realpath-hardening.vitest.ts:1-102`
- `mcp_server/tests/walker-dos-caps.vitest.ts:1-84`
- `mcp_server/tests/memory-governance.vitest.ts:1-279`

**Live Verify Result**

- `node scripts/dist/memory/cleanup-index-scope-violations.js --verify` exit `0` from `.opencode/skill/system-spec-kit`
- Final verify counts: `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1`

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-change constitutional count | `5700` total, `2` under `/constitutional/` |
| Pre-change `z_future` row count | `5947` |
| Pre-change `external` row count | `0` |
| Pre-change constitutional README count | `0` |
| Duplicate gate-enforcement rule rows | IDs `1` and `9868`; newer row is `9868` |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` | Exit `0` |
| `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` | Exit `0` |
| `cd .opencode/skill/system-spec-kit/scripts && npm run typecheck` | Exit `0` |
| `cd .opencode/skill/system-spec-kit/scripts && npm run build` | Exit `0` |
| Wave-2 focused Vitest | Exit `0` (`20` tests passed across `tests/index-scope.vitest.ts`, `tests/memory-save-index-scope.vitest.ts`, `tests/memory-crud-update-constitutional-guard.vitest.ts`, `tests/checkpoint-restore-invariant-enforcement.vitest.ts`, `tests/cleanup-script-audit-emission.vitest.ts`, `tests/exclusion-ssot-unification.vitest.ts`, `tests/symlink-realpath-hardening.vitest.ts`, and `tests/walker-dos-caps.vitest.ts`) |
| README regression Vitest | Exit `0` (`218` tests passed across `tests/handler-memory-index.vitest.ts`, `tests/memory-parser-extended.vitest.ts`, `tests/full-spec-doc-indexing.vitest.ts`, and `tests/gate-d-regression-constitutional-memory.vitest.ts`) |
| `tests/memory-governance.vitest.ts` | Exit `0`; cleanup action-string coverage added for `tier_downgrade_non_constitutional_path_cleanup` |
| `timeout 300 npm run test:core` | Exit `124`; the same carryover failures still surface in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` before timeout |
| Cleanup dry-run | Exit `0`; planned `0` deletions and `0` downgrades in the corrected final state |
| Cleanup first apply | Exit `0`; post-apply counts `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1` |
| README reversal delete | Exit `0`; deleted memory `11672` plus `memory_history=1`, `memory_lineage=1`, `vec_memories=1`, and `active_memory_projection=1`, while `memory_index` handled FTS cleanup via trigger |
| Cleanup verify after reversal | Exit `0` |
| Wave-1 cleanup verify | Exit `0`; `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1` |
| Wave-2 cleanup verify | Exit `0`; planned `0` deletions, `0` duplicate deletes, and `0` downgrades in the final state |
| Final SQL check | Exit `0`; `constitutional_total=2`, `constitutional_in_folder=2`, and the only remaining constitutional rows are the gate enforcement and gate tool routing rule files |
| Strict packet validate | Exit `0` |

### Before / After DB Counts

| Metric | Before Cleanup | After Initial Cleanup | Final Corrected State |
|--------|----------------|-----------------------|-----------------------|
| `importance_tier='constitutional'` | `5700` | `2` | `2` |
| Constitutional rows under `/constitutional/` | `2` | `2` | `2` |
| Rows under `z_future` | `5947` | `0` | `0` |
| Rows under `external` | `0` | `0` | `0` |
| Invalid constitutional rows outside `/constitutional/` | `5698` | `0` | `0` |
| Gate-enforcement duplicates | `2` | `1` | `1` |

### Cleanup Apply Details

The successful first `--apply` reported:

- `deleted_memory_rows=254`
- `deleted_history_rows=252`
- `deleted_lineage_rows=251`
- `deleted_vector_rows=5945`
- `deleted_feedback_rows=9`
- `deleted_other_reference_rows=10811`
- `deleted_embedding_cache_rows=0`
- `downgraded_rows=0`
- `rewritten_feedback_rows=2`
- `rewritten_lineage_rows=3`
- `rewritten_mutation_ledger_rows=0`
- `fts_cleanup_strategy=memory_index_trigger`

The `deleted_memory_rows` count reflects the top-level `memory_index` deletes reported by SQLite after cascade/trigger behavior. The invariant outcomes are confirmed by the before/after summary counts above.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`npm run test:core` remains a carryover.** The suite timed out after surfacing existing failures unrelated to this packet; no attempt was made to widen scope and fix them here.
2. **MCP restart is required.** The runtime changes are built into `dist/`, but a running MCP client still needs a restart before the new save/scan/code-graph/cleanup helper behavior is active.
<!-- /ANCHOR:limitations -->

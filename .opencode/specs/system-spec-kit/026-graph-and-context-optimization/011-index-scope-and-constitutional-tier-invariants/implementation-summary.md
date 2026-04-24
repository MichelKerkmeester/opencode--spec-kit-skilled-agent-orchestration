---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
title: "Implementation Summary: Index Scope and Constitutional Tier Invariants"
description: "Working implementation summary for invariant enforcement, cleanup tooling, and verification. This file will be finalized after code, tests, and cleanup complete."
trigger_phrases:
  - "026/011 implementation summary"
  - "index scope implementation summary"
importance_tier: "important"
contextType: "implementation"
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
| **Completed** | Wave-1 Complete (re-review pending) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet landed a shared index-scope policy module, wired it into memory discovery, parser classification, memory save, and code-graph scanning, and added a cleanup CLI that removed the existing `z_future` pollution from the live Voyage-4 DB. This correction pass removed the mistaken constitutional README admission and restored the final constitutional set to the two rule files only.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work stayed in three passes:

1. Read-only investigation of scanner, save, parser, auto-surface, and cleanup surfaces with exact file:line references in [`research/research.md`](./research/research.md).
2. Runtime wiring across the helper, save-time guard, code-graph exclusions, test coverage, and README documentation.
3. Live database remediation via `cleanup-index-scope-violations.js`, followed by a targeted README-row reversal that removed the mistaken constitutional README entry and re-verified the final invariant counts.
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
<!-- /ANCHOR:decisions -->

---

Wave-1 remediation closed the release-blocking constitutional-tier bypasses without widening into the deferred Wave-2 cleanup work. The remediation keeps the invariant at the storage layer, re-validates checkpoint replay before snapshot rows are applied, and adds durable downgrade auditing so operators can see when a non-constitutional path tried to claim constitutional priority.

**Findings Addressed**

| Finding IDs | Patch Surface | Evidence |
|-------------|---------------|----------|
| `P0-001` | `mcp_server/lib/search/vector-index-mutations.ts:61-113,456-477` | `update_memory()` now downgrades non-constitutional `importance_tier='constitutional'` requests before the SQL update executes and records a best-effort governance audit row |
| `P0-001`, `P1-018` | `mcp_server/lib/storage/post-insert-metadata.ts:82-154` | Post-insert metadata writes now apply the same constitutional-path guard inline before updating `importance_tier` |
| `P0-002` | `mcp_server/lib/storage/checkpoints.ts:75-103,1291-1367,1545-1777` | `checkpoint_restore` validates replay rows inside the barrier-held transaction, rejects walker-excluded paths, downgrades invalid constitutional rows, and flushes governance audit entries after the restore attempt |
| `P1-008` | `mcp_server/handlers/memory-save.ts:306-337` | Save-path constitutional downgrades now write `governance_audit.action='tier_downgrade_non_constitutional_path'` in addition to the warning |
| `P1-016` | `mcp_server/handlers/memory-crud-update.ts:151-208` | Update-path downgrades of already-poisoned non-constitutional rows now emit the same governance audit action after the SQL-layer guard runs |

**Focused Test Coverage**

- `mcp_server/tests/memory-save-index-scope.vitest.ts:340-399`
- `mcp_server/tests/memory-crud-update-constitutional-guard.vitest.ts:1-194`
- `mcp_server/tests/checkpoint-restore-invariant-enforcement.vitest.ts:1-245`

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
| Requested focused Vitest | Exit `0` (`8` tests passed across `tests/index-scope.vitest.ts` and `tests/memory-save-index-scope.vitest.ts`) |
| Wave-1 focused Vitest | Exit `0` (`13` tests passed across `tests/index-scope.vitest.ts`, `tests/memory-save-index-scope.vitest.ts`, `tests/memory-crud-update-constitutional-guard.vitest.ts`, and `tests/checkpoint-restore-invariant-enforcement.vitest.ts`) |
| README regression Vitest | Exit `0` (`218` tests passed across `tests/handler-memory-index.vitest.ts`, `tests/memory-parser-extended.vitest.ts`, `tests/full-spec-doc-indexing.vitest.ts`, and `tests/gate-d-regression-constitutional-memory.vitest.ts`) |
| `timeout 300 npm run test:core` | Exit `124`; observed carryover failures in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` before timeout |
| Cleanup dry-run | Exit `0`; planned `0` deletions and `0` downgrades in the corrected final state |
| Cleanup first apply | Exit `0`; post-apply counts `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1` |
| README reversal delete | Exit `0`; deleted memory `11672` plus `memory_history=1`, `memory_lineage=1`, `vec_memories=1`, and `active_memory_projection=1`, while `memory_index` handled FTS cleanup via trigger |
| Cleanup verify after reversal | Exit `0` |
| Wave-1 cleanup verify | Exit `0`; `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1` |
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
2. **MCP restart is required.** The code changes are built into `dist/`, but a running MCP client needs a restart before the new save/scan/code-graph guards are active.
<!-- /ANCHOR:limitations -->

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
    last_updated_at: "2026-04-24T06:50:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implementation, cleanup, README backfill, and verification completed"
    next_safe_action: "User review and MCP restart before using the new dist output in a live client"
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
| **Completed** | Yes |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet landed a shared index-scope policy module, wired it into memory discovery, parser classification, memory save, and code-graph scanning, and added a cleanup CLI that removed the existing `z_future` pollution from the live Voyage-4 DB. The packet also updated focused tests, documented the invariants in the MCP server README, and backfilled the constitutional README so the constitutional set now has its overview document in the index.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work stayed in three passes:

1. Read-only investigation of scanner, save, parser, auto-surface, and cleanup surfaces with exact file:line references in [`research/research.md`](./research/research.md).
2. Runtime wiring across the helper, save-time guard, code-graph exclusions, test coverage, and README documentation.
3. Live database remediation via `cleanup-index-scope-violations.js`, followed by a constitutional-only incremental scan that indexed the constitutional README with deferred embedding because the Voyage provider was unreachable in this environment.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete `z_future` rows instead of downgrading them | The invariant is absolute: `z_future` must never be indexed |
| Downgrade invalid constitutional saves to `important` | It preserves the save while stopping polluted constitutional rows |
| Include the constitutional README | The constitutional overview doc belongs in the constitutional set |
| Let `memory_index` own FTS cleanup | Direct `memory_fts` deletes conflicted with the `memory_index` FTS delete trigger and caused malformed cleanup applies |
<!-- /ANCHOR:decisions -->

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
| Focused Vitest | Exit `0` (`241` tests passed across six targeted files) |
| `timeout 300 npm run test:core` | Exit `124`; observed carryover failures in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` before timeout |
| Cleanup dry-run | Exit `0`; planned `5948` memory-row deletions (`5947` `z_future`/`external` + `1` duplicate gate row) and `0` downgrades |
| Cleanup first apply | Exit `0`; post-apply counts `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`, `gate_enforcement_rows=1` |
| Cleanup verify after apply | Exit `0` |
| Cleanup second apply (idempotence check) | Exit `0`; zero planned and zero applied changes |
| Constitutional README backfill scan | Exit `0`; `README.md` indexed as memory `11672` with `embedding_status='pending'` after Voyage embedding retries failed offline |
| Post-backfill constitutional count | `3` total, `3` under `/constitutional/` |
| Strict packet validate | Exit `0` |

### Before / After DB Counts

| Metric | Before Cleanup | After Cleanup | After README Backfill |
|--------|----------------|---------------|-----------------------|
| `importance_tier='constitutional'` | `5700` | `2` | `3` |
| Constitutional rows under `/constitutional/` | `2` | `2` | `3` |
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

1. **Embedding for the constitutional README is deferred.** The constitutional-only scan indexed `README.md`, but Voyage embedding retries failed because network access is unavailable in this environment. The row is present and searchable through BM25/FTS with `embedding_status='pending'`.
2. **`npm run test:core` remains a carryover.** The suite timed out after surfacing existing failures unrelated to this packet; no attempt was made to widen scope and fix them here.
3. **MCP restart is required.** The code changes are built into `dist/`, but a running MCP client needs a restart before the new save/scan/code-graph guards are active.
<!-- /ANCHOR:limitations -->

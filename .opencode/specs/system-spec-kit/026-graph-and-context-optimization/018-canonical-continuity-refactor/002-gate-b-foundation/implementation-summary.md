---
title: "Gate B — Foundation"
feature: phase-018-gate-b-foundation
level: 3
status: complete
closed_by_commit: TBD
parent: 018-canonical-continuity-refactor
gate: B
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/018-canonical-continuity-refactor/002-gate-b-foundation"
    last_updated_at: "2026-04-11T20:55:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Recorded Gate B archived-tier cleanup follow-through"
    next_safe_action: "Have orchestrator commit the validated Gate B cleanup"
    key_files: [".opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/002-gate-b-foundation/implementation-summary.md"]
description: "Gate B closed against the rebaselined live DB state. The migration rehearsed cleanly on a copy, production moved schema_version 25 -> 26, 183 legacy memory-path rows were archived with the 1 pre-existing non-memory archived row preserved, and anchor-aware causal traversal plus archived observability were verified."
trigger_phrases: ["gate b implementation summary", "foundation closeout", "canonical continuity", "phase 018", "archive flip"]
importance_tier: "important"
contextType: "documentation"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-gate-b-foundation |
| **Completed** | Yes |
| **Level** | 3 |
| **Status** | Complete |
| **Closed By Commit** | `TBD` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Gate B completed on the rebaselined live DB contract. The foundation step preserved the live `memory_index` total of `2553` rows, operated against `183` legacy memory-path archive candidates, preserved the `1` pre-existing archived non-memory row as baseline state, and kept `causal_edges` at `3264` rows while adding anchor-aware continuity support.

### Completed outcomes

1. Copy-first rehearsal and rollback drill passed against the live baseline.
2. Production schema bootstrap advanced from `schema_version 25` to `26`.
3. `causal_edges` now has `source_anchor` and `target_anchor` columns plus both anchor indexes.
4. The archive flip marked the `183` legacy memory-path rows archived without touching the existing non-memory archived row.
5. Archived ranking and archived-hit observability are both exposed and verified.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gate was executed in the same order the packet planned it. First, the live DB was rebaselined and `memory-018-pre.db` was refreshed so rollback matched the current `2553 / 183 / 1 / 3264` reality. Next, the schema DDL and archive flip were rehearsed on a copy, rerun to confirm `0` additional archive changes, and rolled back to prove recovery before touching production.

After the rehearsal passed, the canonical schema chain was updated so fresh bootstraps and upgraded DBs both converge on the anchor-aware `causal_edges` shape. The live DB then moved from schema version `25` to `26`, applied the `183`-row archive flip, and was rechecked for counts, anchor columns, anchor indexes, query-plan usage, traversal continuity, archived ranking, and archived-hit telemetry.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rebaseline Gate B to `183 / 184 / 1` | The live DB no longer matched the earlier 155-row packet assumption, so the gate had to follow verified current reality. |
| Refresh `memory-018-pre.db` before production | The existing backup no longer matched live row counts, so rollback safety required a fresh pre-cutover snapshot. |
| Keep the migration canonical in `vector-index-schema.ts` | Fresh bootstraps and upgraded DBs now converge on the same `causal_edges` schema and index shape. |
| Preserve the one archived non-memory row | The user explicitly allowed it as baseline state and excluded it from bleed failure criteria. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Live baseline

| Measure | Value |
|--------|-------|
| `memory_index` total rows | `2553` |
| Legacy archive candidates | `183` |
| Baseline archived rows | `1` |
| Baseline non-memory archived rows | `1` |
| `causal_edges` rows | `3264` |

### Rehearsal and rollback

| Check | Result |
|-------|--------|
| Rehearsal post-archive rows | `184` |
| Rehearsal bleed rows | `1` |
| Rehearsal delta | `183` |
| Rehearsal rerun changes | `0` |
| Rollback result | Returned to baseline counts |

### Production migration

| Check | Result |
|-------|--------|
| Schema version | `25 -> 26` |
| `source_anchor` column present | `1` |
| `target_anchor` column present | `1` |
| `idx_causal_edges_source_anchor` present | `1` |
| `idx_causal_edges_target_anchor` present | `1` |
| Live 2-hop sample path | `1 -> 10 -> 11` |
| `EXPLAIN QUERY PLAN` | Uses `idx_causal_edges_source_anchor` and `idx_causal_edges_target_anchor` |

### Ranking and metrics

| Check | Result |
|-------|--------|
| `archived_hit_rate` presented slots | `396` |
| `archived_hit_rate` archived slots | `64` |
| `archived_hit_rate` rate | `0.161616` |

### Focused verification suite

| Check | Result |
|-------|--------|
| Test files passed | `7` |
| Tests passed | `199` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The current `archived_hit_rate` sample is a point-in-time reading, not a stabilized Gate F permanence signal.
2. The original planning docs in this packet still contain the earlier 155-row assumption; this summary records the actual rebaselined execution outcome.
3. `closed_by_commit` is intentionally left as `TBD` for the orchestrator to fill.
<!-- /ANCHOR:limitations -->

### Gate B Post-Flight Cleanup

- Live DB state at cleanup start: `memory.db` was `0` bytes, with no live schema or data to preserve.
- Backup state: `memory-018-pre.db` remained preserved at `198 MB` as the historical pre-Gate-B baseline.
- Files deleted on the data side: commit `9455e3218` had already removed `426` legacy `.opencode/specs/**/memory/*.md` files (`93,802` deleted lines), leaving no spec-memory markdown files behind.
- Code changes:
  - `is_archived` stayed in the schema as a deprecated compatibility column (Option B), with comments making the post-`026.018` contract explicit.
  - The Stage 2 fusion `x 0.3` archived ranking penalty was removed so all retained rows score on the same freshness basis.
  - The `archived_hit_rate` metric, response field, and related assertions were removed.
  - Live search/query paths stopped branching on `is_archived`, and archival-only side effects were neutralized where they no longer affect canonical continuity.
- Updated invariants:
  - All rows are treated as equally fresh; there is no archived-tier scoring branch.
  - Schema bootstrap still keeps `is_archived`, but the active contract is `is_archived = 0` for new rows.
  - No legacy `memory/*.md` files remain anywhere under `.opencode/specs/`.

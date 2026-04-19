---
title: "Iteration 011 — FSRS cognitive decay + memory tiers (Features 7, 8)"
iteration: 11
band: B
timestamp: 2026-04-11T14:25:00Z
worker: claude-opus-4-6
scope: q4_features_7_8
status: complete
focus: "Retarget FSRS decay lifecycle (HOT→WARM→COLD→DORMANT→ARCHIVED) and memory tiers (constitutional→deprecated)."
maps_to_questions: [Q4]
---

# Iteration 011 — Features 7, 8: FSRS Decay + Memory Tiers

## Features covered

- **Feature 7**: Memory tiers — `constitutional`, `critical`, `important`, `normal`, `temporary`, `deprecated`
- **Feature 8**: FSRS cognitive decay — 5-state lifecycle HOT → WARM → COLD → DORMANT → ARCHIVED via power-law formula `R(t) = (1 + FSRS_FACTOR × t/S)^-0.5`

## Current implementation

- `memory_index` table has `stability`, `difficulty`, `last_review`, `review_count`, `access_count`, `importance_tier` columns
- FSRS scheduler (`lib/cognitive/fsrs-scheduler.ts`) computes retrievability per row
- Tier + decay combine in the search ranking: `rank_score = relevance × tier_multiplier × retrievability × (1 - decay_penalty)`
- Classification-aware 2D decay matrix (context_type × importance_tier) tunes decay rates per content type

## Retarget decision: unit of decay

Phase 017 iteration 11 posed this question: is the unit of decay per spec doc, per anchor, per continuity record, or per causal edge?

**Answer: per `memory_index` row.** This is the current unit and it transfers cleanly because `memory_index` rows under Option C represent:
- Spec doc rows (one per spec doc, indexed as a whole)
- Anchor rows (one per anchor of interest, indexed individually for fine-grained retrieval)
- Continuity rows (one per `_memory.continuity` block)
- Archived memory rows (one per legacy memory file)

All four types are `memory_index` rows with different `document_type` discriminators. FSRS decay operates on any row identically.

## Anchor-level decay (optional enhancement)

If a single `implementation-summary.md` has mixed-tier sections (e.g., `what-built` tier=normal, `decisions` tier=critical), the anchor-level indexing supports it: each anchor gets its own row with its own tier. The decay per anchor is then independent.

## Tier retargeting

Tiers stay per-row. When a spec doc is indexed:
- The whole-doc row inherits the spec doc's frontmatter `importance_tier` (existing field)
- Each anchor row inherits the anchor-specific tier (if `_memory.anchor_tiers` block is present in the spec doc frontmatter, otherwise falls back to the doc-level tier)

Example `_memory` block extension:
```yaml
_memory:
  importance_tier: important   # whole-doc default
  anchor_tiers:
    decisions: critical         # override for decisions anchor
    limitations: temporary      # override for limitations anchor
```

This is an optional enhancement. If `anchor_tiers` is not specified, all anchors inherit the doc-level tier.

## Constitutional tier

Constitutional memories always surface at the top of search results (feature 11 in phase 017's list). Under Option C, constitutional content lives in a dedicated location:
- `.opencode/constitutional/*.md` — dedicated files for repo-wide rules
- Indexed as `memory_index` rows with `importance_tier = 'constitutional'`
- Search injection logic unchanged

This keeps constitutional content out of packet spec docs (where it would mix with packet-specific content).

## FSRS adaptation

The FSRS formula is unchanged. Inputs:
- `stability` — how long the row has been useful
- `difficulty` — how hard the row is to retrieve (complexity)
- `last_review` — when the row was last accessed
- `review_count` / `access_count` — usage stats

All inputs are per-row fields. FSRS scheduler reads them and computes retrievability. Zero change to the formula.

## 2D decay matrix

The classification-aware decay matrix (context_type × importance_tier) also operates on row fields. Both `context_type` and `importance_tier` are already in the existing schema. No changes needed.

## Code changes

| File | Effort | Change |
|---|:---:|---|
| `lib/cognitive/fsrs-scheduler.ts` | XS | no change (formula operates on row fields) |
| `database/` schema | S | add optional `anchor_tier_override` field (if not already present) |
| `handlers/memory-index.ts` | S | when indexing a spec doc, apply per-anchor tier if specified |
| `lib/search/ranking.ts` (or wherever rank_score is computed) | XS | no change |

## Findings

- **F11.1**: FSRS decay and memory tiers retarget with **zero formula change** and **1 optional schema field**. The current row-level decay is the right abstraction.
- **F11.2**: Anchor-level tier overrides are optional. Most spec docs will have uniform tier across anchors. The override is there for cases where a single doc has mixed-importance sections.
- **F11.3**: Constitutional content lives outside packet docs, in `.opencode/constitutional/*.md`. This keeps the boundary clean.
- **F11.4**: The M4 migration strategy's `is_archived=1` flip (F7) is the constitutional way to decay the 155 legacy memories — existing FSRS decay naturally retires unused rows over 180 days.

## Next focus

Iteration 12 — constitutional memory and shared memory governance. Complete Band B.

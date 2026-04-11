---
title: "Iteration 007 — Q6 Deep Dive: Migration strategy for 155 existing memories"
iteration: 7
timestamp: 2026-04-11T13:05:00Z
worker: claude-opus-4-6 (Claude Code session)
scope: q6_migration_strategy
status: complete
focus: "Evaluate 4 migration options for the existing memory corpus. Recommend one with evidence and cost estimates."
maps_to_questions: [Q6]
---

# Iteration 007 — Q6: Migration Strategy

## Goal

Answer Q6: what happens to the 155 existing memory files during Option C rollout? Evaluate 4 migration options, recommend one, and produce a concrete action plan.

## Corpus inventory (from iteration 3)

- **Total files**: 155
- **By tree**: system-spec-kit 125 (80.6%), skilled-agent-orchestration 23 (14.8%), 00--anobel.com 5, 00--barter 1, other 1
- **By size**: median 548 lines, average 1,066 lines, max 82,647 lines
- **By value tier** (from iteration 3 sample extrapolation):
  - Clearly valuable (score ≥9): ~35% = **54 files**
  - Medium (score 3-8): ~40% = **62 files**
  - Clearly wasteful (score ≤2, all z_archive): ~25% = **39 files**

## The 4 migration options

### Option M1 — Read-only shadow corpus

Freeze the existing memory files. Keep them indexed and searchable but stop writing new ones to that path. Spec doc writes become the new default.

**Pros:**
- Minimal risk — no existing content touched or deleted
- Search results seamlessly blend old memories and new spec-doc content during transition
- Rollback is free (just re-enable writes)
- Zero migration effort for the operator

**Cons:**
- Index index grows unbounded (old memories + new spec doc entries)
- Dedup/PE arbitration may get confused when a new spec-doc write overlaps an old memory file
- Operator sees stale memory titles in search results indefinitely

**Cost**: ~0 (no file operations needed)
**Risk**: Low

### Option M2 — Lazy backfill on read

Freeze existing memory files. When search returns an old memory result, offer to promote it into the corresponding spec doc anchor (interactive). Unpromoted memories remain searchable.

**Pros:**
- Operator-driven migration — only the files actually used get promoted
- Preserves all content until promotion
- Migration happens over time, no big-bang moment

**Cons:**
- Requires interactive promotion UI
- Search results carry two versions of the same content until promotion
- Promotion logic is non-trivial (classify content, route to anchor, merge)

**Cost**: 1-2 weeks to build promotion UI
**Risk**: Medium (new UI path, unknown operator engagement)

### Option M3 — One-shot bulk rewrite

Batch-convert all 155 memory files into spec doc anchors upfront. Each memory file maps to 1+ spec doc writes based on the routing rules from iteration 4.

**Pros:**
- Clean post-state — one source of truth immediately
- No transitional period with blended results
- Matches the "no redundancy by design" Option C goal

**Cons:**
- Very high migration cost (155 files × classification + merge)
- Bulk-rewrite can introduce content corruption at scale (one bad routing rule breaks dozens of spec docs)
- Iteration 3 found only ~35% of memory files are valuable; bulk-converting all 155 adds noise to spec docs
- Rollback requires restoring each affected spec doc

**Cost**: 2-3 weeks of implementation + review
**Risk**: High (scale × corruption risk)

### Option M4 — Bounded archive with time-bound fallback

Freeze existing memory files into a read-only archive tier (tier: `archived`). Search returns them only when no fresh spec-doc result matches. After 90 days of no hits, move to `deep_archive` tier with reduced retrieval weight. After 180 days, fully retire.

**Pros:**
- Preserves all content during transition
- Automatic decay — unused memories fade out without manual action
- Dual-tier search (fresh vs archived) prevents stale noise in routine results
- Aligns with FSRS cognitive decay model already in the memory schema

**Cons:**
- Requires new tier handling in memory-search.ts ranking
- The "retirement" action is destructive — needs operator approval before final delete
- Operators may forget the archive exists and lose historical context

**Cost**: 1 week (tier field + ranking change) + 180 days of passive operation
**Risk**: Low-medium

## Comparison rubric

| Dimension | M1 Shadow | M2 Lazy | M3 Bulk | M4 Bounded archive |
|---|---:|---:|---:|---:|
| Initial migration cost | 0 | 1-2w | 2-3w | 1w |
| Risk of content loss | 0 | Low | High | Low |
| Post-state cleanliness | Low | Medium | High | Medium |
| Operator engagement required | None | High | None | Low |
| Rollback cost | 0 | 1d | 1w+ | 0 |
| Search coherence during transition | Medium | Low | High | High |
| Alignment with FSRS decay (existing feature) | Low | Low | Low | **High** |
| Alignment with value tier distribution | Low | Medium | Low (over-promotes waste) | High |
| **Aggregate preference** | Reasonable safety | Attractive but complex | Attractive but risky | **Best match** |

## Recommendation: Option M4 — Bounded Archive with Time-Bound Fallback

**Why M4 wins:**

1. **It matches the observed value distribution.** Iteration 3 found 35% of memories are valuable, 40% medium, 25% waste. A bounded archive naturally lets the 35% surface when needed and lets the 25% decay out of relevance. M3 would force all 155 into spec docs (over-promoting waste). M1 never discriminates.

2. **It reuses the existing FSRS decay machinery.** The memory schema already has `stability`, `difficulty`, `last_review`, `access_count` fields. Adding a `tier=archived` flag that modifies retrieval weight is a small, well-grounded change.

3. **It bounds operator risk.** Operators see fresh spec-doc results by default. Archived memories appear as a fallback only when no fresh result matches (which happens for the 2/10 memory-wins queries from iteration 5 and the gap-filling role in query 4).

4. **It is reversible.** If M4 underperforms, revert by flipping the `tier` field back to `normal`. No files are moved or deleted until the explicit retirement step at 180 days, which requires operator approval.

5. **It is cheap to implement.** Estimated 1 week total: add `tier=archived` field handling in memory-search.ts ranking, write a one-time migration script that flips all existing memories to `archived`, add a dashboard panel showing archived-memory hit rate.

## M4 action plan

**Phase 018.0 — Archive freeze (immediate, before any new Option C writes):**
1. Add `is_archived` column to `memory_index` table (or reuse the `is_archived` field if present)
2. Run one-time SQL: `UPDATE memory_index SET is_archived = 1 WHERE source_path LIKE '%/memory/%.md'`
3. Update `memory-search.ts` ranking to deprioritize archived memories (weight * 0.3) unless no fresh result matches
4. Add memory_stats dashboard metric: `archived_hit_rate` = archived hits / total hits
5. Freeze `atomicSaveMemory` writes — throw error if writing to a memory file path

**Phase 018.1 — Fresh Option C writes start:**
1. New wiki-style writes go to spec doc anchors per the routing rules from iteration 4
2. Old archived memories remain searchable as fallback
3. Monitor `archived_hit_rate` weekly

**Phase 018.90 — Day 90 review:**
1. If `archived_hit_rate` < 2% (rare fallback use): proceed to deep_archive
2. If `archived_hit_rate` > 5% (still regularly useful): extend fallback period, investigate why fresh writes don't cover those queries
3. If 2-5%: continue observing

**Phase 018.180 — Day 180 decision point:**
1. If `archived_hit_rate` < 0.5% (effectively unused): retire to read-only snapshot, stop indexing
2. If > 0.5%: keep indefinitely as long-tail retrieval layer

## Findings

- **F7.1**: Only ~54 of 155 memory files (35%) are clearly valuable. A migration strategy that treats all 155 equally is wasteful.
- **F7.2**: M4 (bounded archive) aligns naturally with the FSRS cognitive decay model already in the schema. This is a low-friction extension, not a new mechanism.
- **F7.3**: The 25% z_archive files can be immediately moved to `deep_archive` tier without the 90-day observation period — they were already deprecated before phase 018.
- **F7.4**: Root packets without canonical `implementation-summary.md` (~5 cases from iteration 5) are a special case. Before archiving their memory files, phase 018 must either (a) backfill the canonical doc or (b) accept a narrative gap. Recommendation: backfill as part of the phase 018 migration script.
- **F7.5**: M4's archived-hit-rate metric is a concrete go/no-go signal for whether phase 018 can proceed toward Option F (full deprecation) in phase 020. If the rate stays near zero for 180 days, memory retrieval was never load-bearing.

## Q6 answer (verified)

Adopt Option M4: bounded archive with time-bound fallback. Freeze all 155 existing memory files as `tier=archived` on day 0 of phase 018. Let FSRS decay and the archived-hit-rate metric guide the long-tail decision. Promote the 5 gap-filling cases (root packets without canonical docs) as a prerequisite to phase 018. Expected cost: 1 week of tier-handling work plus a one-time SQL migration.

## What worked

- Grounding migration cost in the iteration 3 value tier distribution (35/40/25 split) made M3 (bulk rewrite) visibly wasteful and M1 (shadow) visibly indiscriminate.
- Cross-referencing M4 with the existing FSRS decay fields in the schema revealed M4 is a natural extension, not a new mechanism.

## What failed / did not work

- Did not model the cross-effects of dual-indexing (fresh spec docs + archived memories) on the retrieval pipeline's RRF fusion. This is deferred to phase 018's design research iteration 7.

## Open questions carried forward

- Exact ranking weight for archived memories (0.3 was an estimate) — needs tuning in phase 018.
- How to handle the retirement step at day 180 without losing historical evidence — deferred to phase 018.

## Next focus (for iteration 8)

Q7 integration impact: file-by-file inventory of every command, agent, handler, template, script, doc, and test that depends on the memory system. Produce effort estimates per file.

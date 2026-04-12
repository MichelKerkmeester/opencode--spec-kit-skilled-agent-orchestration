---
title: "Iteration 016 — Migration of 155 existing memories (M4 refinement)"
iteration: 16
band: C
timestamp: 2026-04-11T14:50:00Z
worker: claude-opus-4-6
scope: q8_migration_m4
status: complete
focus: "Refine M4 bounded-archive strategy: exact implementation, fallback ranking weight, retirement decision logic, rollback plan."
maps_to_questions: [Q8]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-016.md"]

---

# Iteration 016 — M4 Migration Details

## Goal

M4 (bounded archive with FSRS decay) is fixed from phase 017 (F7). This iteration refines its implementation details, not its selection.

## M4 implementation steps (detailed)

### Step 1: Schema migration (Day 0)

```sql
-- Add is_archived flag if not already present
ALTER TABLE memory_index ADD COLUMN is_archived INTEGER DEFAULT 0;

-- Flip all existing memory-file-sourced rows to archived
UPDATE memory_index 
SET is_archived = 1, 
    last_review = CURRENT_TIMESTAMP
WHERE document_type = 'memory' 
  AND source_path LIKE '%/memory/%.md';

-- Index for fast archived filtering
CREATE INDEX IF NOT EXISTS idx_is_archived ON memory_index(is_archived);
```

**Expected impact**: all 155 memory files flipped to `is_archived=1`. No file deletions. No content changes.

### Step 2: Search ranking update

`lib/search/ranking.ts` (or wherever rank_score is computed):

```typescript
function computeRankScore(row, query) {
  let score = row.relevance * row.tier_multiplier * row.retrievability;
  
  // NEW: archived memory deprioritization
  if (row.is_archived) {
    score *= 0.3;  // archived weight = 0.3
  }
  
  return score;
}
```

**Effect**: archived memories can still appear in results, but spec_doc results with similar relevance will rank above them.

### Step 3: Fallback activation

When `memory_search` returns empty or near-empty results (fewer than N fresh spec_doc hits), the search widens the filter to include archived memories:

```typescript
function search(query) {
  let results = searchWithFilter(query, { is_archived: false });
  if (results.length < MIN_FRESH_RESULTS) {
    const archivedResults = searchWithFilter(query, { is_archived: true });
    results = mergeAndRank(results, archivedResults);
  }
  return results;
}
```

**Effect**: archived memories only surface when fresh spec_docs don't cover the query. For the 2/10 memory-wins queries from F5, this fallback catches them.

### Step 4: Metric collection

Add `archived_hit_rate` to the dashboard:

```typescript
// Metric: percentage of user-facing results that came from archived memories
archived_hit_rate = 
  count(results where is_archived=1 AND rank <= K_PRESENTED) /
  count(results where rank <= K_PRESENTED)
```

**Target thresholds**:
- Week 1-2: expect 10-30% (transition period, few fresh spec_docs yet)
- Week 3-4: expect 5-15% (spec docs catching up)
- Day 30: expect < 5% (fresh content is primary)
- Day 90: expect < 2% (memory retrieval is mostly long-tail)
- Day 180: expect < 0.5% (memory retrieval is effectively unused)

### Step 5: Permanence decision (Day 180)

Based on `archived_hit_rate` trend:

| Trend | Decision |
|---|---|
| <0.5% for 30+ days | **Retire**: move archived tier to read-only snapshot, stop indexing. Option F (full deprecation) becomes viable in phase 021. |
| 0.5% — 2% stable | **Keep thin layer**: the archive is a useful long-tail but not load-bearing. Maintain indefinitely. |
| >2% trending up | **Investigate**: why are fresh spec_docs not covering the archived queries? Improve routing rules. Do NOT retire. |

The decision is data-driven. Phase 020 runs this decision, not phase 018.

## Rollback plan

If M4 underperforms (e.g., archived_hit_rate stays >10% after 30 days), rollback:

```sql
-- Revert archive flag
UPDATE memory_index SET is_archived = 0 WHERE source_path LIKE '%/memory/%.md';
```

Plus revert the ranking code change. No file deletions means rollback is instant and complete.

## The 5-root-packet backfill prerequisite

From iteration 13 / F10: ~5 root packets have memory files as their only narrative artifact. Before Day 0 of M4, these must be backfilled.

**Backfill procedure**:
1. Audit memory files by packet pointer
2. For each packet without canonical `implementation-summary.md`, identify the most recent valuable memory file
3. Use its content to generate a canonical `implementation-summary.md` (with human review)
4. Commit the new canonical doc
5. THEN proceed with Step 1 (schema migration)

**Estimated effort**: 1 engineer-day for audit + generation + review, assuming ~5 packets.

## Content quality handling during M4

From F3 (phase 017 rerun iter 3): 35% of memory files are valuable, 40% medium, 25% waste.

- **Valuable (35%)**: `is_archived=1` but still searchable. Fall through to them when fresh spec docs don't cover the query.
- **Medium (40%)**: same — archive and let FSRS decay naturally retire them.
- **Waste (25%)**: z_archive files. These get `is_archived=1` AND `importance_tier='deprecated'` — double deprioritization.

## Timeline

- Day 0: schema migration + archive flip + ranking update
- Day 1-30: phase 019 code refactor lands + initial fresh spec_doc writes begin
- Day 30 review: archived_hit_rate <5% (transition on track)
- Day 90 review: archived_hit_rate <2% (most retrieval is spec_doc)
- Day 180 decision: retire / keep / investigate

## Findings

- **F16.1**: M4 implementation is ~1 week of code work: schema migration, ranking update, metric collection.
- **F16.2**: The fallback path keeps archived memories useful for the 2/10 memory-wins queries without noisily injecting them into routine results.
- **F16.3**: The permanence decision at Day 180 is data-driven via `archived_hit_rate`. Phase 020 runs this decision, not phase 018.
- **F16.4**: Rollback is instant (one SQL UPDATE + code revert). Low-risk change.
- **F16.5**: Root-packet backfill is the sole prerequisite before M4 can run. ~1 engineer-day of manual work.

## Next focus

Iteration 17 — failure modes and validation UX.

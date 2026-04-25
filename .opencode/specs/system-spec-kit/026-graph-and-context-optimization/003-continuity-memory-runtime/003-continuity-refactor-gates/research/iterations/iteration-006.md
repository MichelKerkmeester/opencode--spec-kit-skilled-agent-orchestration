---
title: "Iteration 006 — Trigger phrase fast matching retarget (Feature 1)"
iteration: 6
band: B
timestamp: 2026-04-11T14:00:00Z
worker: claude-opus-4-6
scope: q4_feature1_triggers
status: complete
focus: "Retarget trigger phrase fast matching onto spec doc frontmatter + continuity records."
maps_to_questions: [Q4]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-006.md"]

---

# Iteration 006 — Feature 1: Trigger Phrase Fast Matching

## Current implementation

- **Storage**: `memory_index.trigger_phrases` column (JSON array)
- **Source**: extracted from memory file YAML frontmatter during `memory_save`
- **Index**: `idx_trigger_cache_source` (SQLite index on `embedding_status='success'` rows)
- **Lookup**: `handleMemoryMatchTriggers` in `handlers/memory-triggers.ts` — sub-millisecond cache lookup
- **Consumer**: `memory_context` routes trigger-shaped queries to this fast path, bypassing the 4-stage search pipeline for common cases

## Retarget mechanism

**Primary source**: spec doc frontmatter `trigger_phrases` field (already exists in every spec kit template).

**Fallback source**: `_memory.continuity` block's inferred triggers (iteration 5's thin continuity layer).

**Index schema change**:
```sql
-- BEFORE
CREATE INDEX idx_trigger_cache_source
  ON memory_index(trigger_phrases)
  WHERE embedding_status = 'success';

-- AFTER
CREATE INDEX idx_trigger_cache_source
  ON memory_index(trigger_phrases)
  WHERE embedding_status = 'success'
    AND (document_type IN ('spec_doc', 'continuity') OR is_archived = 0);
```

The index now covers both spec doc rows and continuity rows, but deprioritizes archived memories (matches the M4 migration strategy from F7).

**Cache invalidation**: when a spec doc is re-indexed (after a `/memory:save` merge), the `trigger_phrases` column is refreshed from the updated frontmatter. The index auto-updates.

**Collision handling**: two docs claiming the same trigger phrase. Resolution: return both, ranked by `importance_tier` + `last_review` recency. The caller (`memory_context`) then picks the best match per intent.

## Code changes required

- `handlers/memory-triggers.ts` — update source_type filter to include `spec_doc` and `continuity`
- `handlers/memory-index.ts` (or wherever `idx_trigger_cache_source` is created) — update WHERE clause
- `scripts/memory/backfill-frontmatter.ts` — one-time backfill to populate `trigger_phrases` on spec doc rows after indexing

## UX implication

Resume queries that currently hit the trigger cache (sub-ms) continue to hit sub-ms under Option C. No latency regression.

## Findings

- **F6.1**: Trigger phrase matching retargets with **zero algorithmic change**. Only the source table discriminator changes.
- **F6.2**: The existing index drops in directly with one WHERE-clause update.
- **F6.3**: Collision handling via tier + recency is already the current behavior. No new logic.
- **F6.4**: Resume latency is preserved — the trigger fast path is orthogonal to where content lives.

## Next focus

Iteration 7 — intent routing and `memory_context` modes retarget.

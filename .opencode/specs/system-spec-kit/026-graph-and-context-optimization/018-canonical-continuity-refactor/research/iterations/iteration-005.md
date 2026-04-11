---
title: "Iteration 005 — Thin continuity layer schema and storage"
iteration: 5
band: A
timestamp: 2026-04-11T13:55:00Z
worker: claude-opus-4-6
scope: q3_thin_continuity
status: complete
focus: "Design the thin continuity layer in detail: fields, lifecycle, storage format, read/write patterns. Complete Band A foundations."
maps_to_questions: [Q3]
---

# Iteration 005 — Q3: Thin Continuity Layer Schema

## Goal

The "thin continuity layer" is the lightweight metadata artifact that carries the retrieval hints spec docs can't express (fingerprint, triggers, causal edges, FSRS state, packet pointer). Iteration 4 concluded it lives as a sub-field `_memory.continuity` of the spec doc frontmatter. This iteration designs the exact schema, lifecycle, and read/write patterns.

## The minimum viable continuity record

```yaml
_memory:
  continuity:
    # Packet state pointer
    packet_pointer: "026-graph-and-context-optimization/018-canonical-continuity-refactor"
    last_updated_at: "2026-04-11T13:55:00Z"
    last_updated_by: "claude-opus-4-6"
    
    # The resume hints
    recent_action: "Completed iteration 5 of phase 018 implementation design research"
    next_safe_action: "Iterate on Band B feature retargeting (iteration 6: trigger phrase matching)"
    blockers: []
    
    # Key files for this packet (resume reads these first)
    key_files:
      - "research/research.md"
      - "research/iterations/iteration-005.md"
      - "findings/routing-rules.md"
    
    # Session continuity across sessions
    session_dedup:
      fingerprint: "sha256:..."
      session_id: "018-impl-design-2026-04-11"
      parent_session_id: null
    
    # Status
    completion_pct: 25
    open_questions: ["Q4", "Q5", "Q6", "Q7", "Q8", "Q9"]  # from strategy.md
    answered_questions: ["Q1", "Q2", "Q3"]
    
  # Other _memory sub-blocks (causal_links, fsrs_state, provenance) from iteration 4
```

## Lifecycle

### Creation

Every spec doc that participates in the wiki-style memory system gets a `_memory.continuity` block when:
1. `/memory:save` targets it for the first time, OR
2. The template validator during `/spec_kit:plan` adds a default empty block, OR
3. A one-time backfill script is run as part of phase 018 prerequisite (to add the block to all ~147 existing spec docs)

### Updates

Every merge operation (iteration 3) updates the continuity fields:
- `last_updated_at` → now
- `last_updated_by` → current session worker
- `recent_action` → the save's content summary
- `next_safe_action` → the save's inferred next step
- `key_files` → union of previous value + files referenced in this save
- `completion_pct` → delta based on task_update category saves
- `answered_questions` / `open_questions` → delta based on research saves

### Reads

`/spec_kit:resume` reads the continuity block first (before anchors, before full doc content):

```
1. Load packet pointer from --spec-folder arg or current git worktree
2. Open <packet>/implementation-summary.md (or handover.md if present)
3. Parse YAML frontmatter
4. Extract _memory.continuity
5. Return recent_action, next_safe_action, blockers, key_files
6. Optionally: ladder to full spec doc content if more depth needed
```

This path is <1 second end-to-end because it reads one small YAML block, not multiple full doc files.

### Session dedup

The `_memory.continuity.session_dedup.fingerprint` holds a sha256 hash of the last save's content. Before a new save, the pipeline computes the incoming content hash and compares. If identical, skip the save entirely (no-op). This preserves the ~50% token savings the current session dedup provides.

The `session_id` tracks which session last wrote to this doc. If a new session starts writing, the continuity block records the handoff (`parent_session_id` = old session).

## Read/write patterns

### Fast resume (most common)

```
resume_ladder(packet):
  1. Read handover.md frontmatter + body (if exists)
  2. If handover.md.body has a "Continue Here" section, return that
  3. Else read implementation-summary.md frontmatter._memory.continuity
  4. Return continuity.recent_action + continuity.next_safe_action + continuity.blockers
```

Expected latency: <100ms (YAML parse of ~5 small files).

### Full context retrieval

When the user needs deeper context (e.g., `memory_context(deep)`):
```
1. Start with resume_ladder output
2. Ladder up to full implementation-summary.md content
3. Ladder up to decision-record.md::adr-NNN for any referenced ADRs
4. Ladder up to tasks.md::phase-N for active phase details
5. Fall back to archived memory (tier=archived) if still insufficient
```

### Write (during save)

Every `/memory:save` that triggers a merge operation also triggers a continuity block update:
```
1. Perform merge via anchorMergeOperation (iteration 3)
2. In the same atomic envelope, update the target doc's _memory.continuity
3. Write the updated spec doc with both content and continuity changes atomically
```

## Storage format

**Format**: YAML sub-block inside the existing spec doc frontmatter.

**Size budget**: target <2KB per continuity block (to keep spec doc frontmatter manageable). Fields that would exceed this (e.g., long key_files lists) are truncated or moved to a separate field.

**Serialization**: standard js-yaml or python yaml. No custom format.

**Indexing**: the `memory_index` SQLite table stores:
- A reference to the spec doc file path + the `continuity` anchor (for retrieval)
- The embedding of `recent_action + next_safe_action` (for semantic resume queries)
- The fingerprint (for dedup)
- The `packet_pointer` (for filter queries)

## Size and scope guardrails

The continuity block is "thin" by design. Guardrails:

- **Max size**: 2KB per block
- **Max fields**: 15 top-level keys under `_memory.continuity`
- **No nested narrative**: prose belongs in the doc body anchors, not in continuity
- **No full decisions**: decisions live in `decision-record.md::adr-NNN`, continuity only references their IDs
- **No full task lists**: tasks live in `tasks.md`, continuity only tracks `completion_pct`

If a save wants to add content that would violate these guardrails, the router (iteration 2) must route it to a different target.

## Findings

- **F5.1**: The thin continuity layer is ~10-15 fields totaling ~2KB per spec doc. Small enough to keep in frontmatter without overwhelming the spec doc.
- **F5.2**: Lifecycle is simple: create on first save (or backfill), update on every merge, read on every resume. No separate lifecycle machinery needed.
- **F5.3**: Session dedup via fingerprint comparison preserves the current ~50% token savings without a separate tracking structure.
- **F5.4**: Resume latency target <100ms is achievable with YAML parse of a small block. No SQLite query, no embedding compute, no LLM call on the happy path.
- **F5.5**: The continuity block IS the thin layer — no separate file, no separate table, no separate storage primitive. Just a reserved YAML sub-key in the existing spec doc frontmatter.
- **F5.6**: Size guardrails prevent the continuity block from becoming the new "heavyweight narrative" problem. Prose belongs in anchors, not in continuity.

## Band A summary (iterations 1-5)

Band A (Foundations) is complete. Here's what the iterations establish:

| Iter | Band A focus | Output |
|---:|---|---|
| 1 | Architecture baseline | 4 new components named (contentRouter, anchorMergeOperation, thinContinuityRecord, resumeLadder) |
| 2 | Content routing rules | 8 content categories, 3-tier classifier (rule → embedding → LLM) |
| 3 | Anchor merge semantics | 5 merge modes, atomic envelope reuses `withSpecFolderLock` |
| 4 | Metadata merge policy | Option M-B: embedded YAML extension, `_memory` sub-key |
| 5 | Thin continuity schema | `_memory.continuity` sub-block with 10-15 fields, 2KB budget |

Band A establishes the "what goes where" skeleton. Band B now retargets each of the 13 advanced features onto this skeleton.

## What worked

- Recognizing in iteration 4 that the continuity layer can live in frontmatter simplified this iteration enormously — no separate storage primitive to design.
- Writing the lifecycle and read/write patterns upfront exposed the `<100ms resume` target clearly.

## What failed / did not work

- Did not benchmark actual YAML parse latency against a real spec doc — deferred to phase 019 implementation testing.
- The size budget (2KB) is an educated guess; needs validation against real saves.

## Next focus (iteration 6)

Begin Band B — retargeting the 13 advanced memory features. Start with trigger phrase fast matching. Answer Q4 for feature 1.

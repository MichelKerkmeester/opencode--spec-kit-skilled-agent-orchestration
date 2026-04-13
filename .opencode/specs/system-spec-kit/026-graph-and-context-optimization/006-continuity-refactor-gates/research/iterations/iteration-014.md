---
title: "Iteration 014 — /memory:save user flow under Option C"
iteration: 14
band: C
timestamp: 2026-04-11T14:40:00Z
worker: claude-opus-4-6
scope: q6_save_flow
status: complete
focus: "UX walkthrough for /memory:save under the new model. Interactive and auto modes. Confirmation screen. Routing transparency."
maps_to_questions: [Q6]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-014.md"]

---

# Iteration 014 — Q6: /memory:save User Flow

## Goal

Walk through the `/memory:save` user experience under Option C. Show what the user sees at each step, how routing is visible, and how failures surface.

## Invocation patterns

### Pattern 1: Auto save (non-interactive)

User runs `/memory:save` with no args at session end. The command:
1. Collects session context (toolCalls, exchanges, decisions, etc.)
2. Runs the contentRouter (iteration 2) on each content chunk
3. Applies each merge via anchorMergeOperation (iteration 3)
4. Updates the continuity block
5. Returns a success summary

User sees:
```
✓ /memory:save complete

Routed 6 content chunks:
- 2 → implementation-summary.md::what-built (narrative progress)
- 1 → implementation-summary.md::how-delivered (narrative delivery)
- 1 → decision-record.md::adr-007 (NEW decision)
- 1 → handover.md (session-end handover)
- 1 → _memory.continuity (metadata)

Validator: ANCHORS_VALID passed
FRONTMATTER_MEMORY_BLOCK passed

Session fingerprint: sha256:abc123...
Next session: run /spec_kit:resume to continue
```

**Latency**: ~1-2 seconds (similar to current memory_save, because the work is similar — parse, classify, merge, index).

### Pattern 2: Interactive save (routing transparency)

User runs `/memory:save --interactive` or `/memory:save --dry-run`.

The command:
1. Collects session context
2. Runs contentRouter
3. Shows the user the proposed routing BEFORE writing:

```
/memory:save will perform 6 operations:

  [1] append-as-paragraph → implementation-summary.md::what-built
      content: "Completed iterations 6-12 of phase 018 research covering all 13 advanced feature..."
      confidence: 0.92
      
  [2] append-as-paragraph → implementation-summary.md::what-built
      content: "Added the _memory block schema for continuity records..."
      confidence: 0.88
      
  [3] append-as-paragraph → implementation-summary.md::how-delivered
      content: "Research executed as in-session orchestrator+worker model..."
      confidence: 0.85
      
  [4] insert-new-adr → decision-record.md (ADR-007)
      content: "Adopt anchor-scoped merge with per-spec-folder mutex..."
      confidence: 0.95
      
  [5] append-new-session → handover.md
      content: "Phase 018 iteration 14 complete; next: iteration 15 (conflict handling)"
      confidence: 0.90
      
  [6] set-field → _memory.continuity
      content: { recent_action: "...", next_safe_action: "...", blockers: [] }
      confidence: 1.00

Proceed? [Y]es / [n]o / [e]dit routing / [s]ave transcript only
```

The `[e]dit routing` option lets the user override the classifier's choices. Example: if chunk [3] should actually go to `research/research.md` instead of `how-delivered`, the user can redirect it.

### Pattern 3: Force save (advanced)

User runs `/memory:save --force --route-as "narrative_progress"` to bypass classification and force all content into one target. For expert users who know exactly what they want.

## Visible failure modes

### Low-confidence refusal

If a chunk has confidence <0.5, the save pipeline surfaces:
```
⚠ Chunk [3] refused to route (confidence 0.42)
  content preview: "Maybe we should consider..."
  
  Options:
    1. Drop this chunk (not saved)
    2. Force-route to implementation-summary.md::what-built
    3. Force-route to another target (specify)
    4. Save to scratch/ for manual review
```

### Anchor missing

If the router selects a target anchor that doesn't exist in the spec doc:
```
✗ Save failed: target anchor 'what-built' not found in implementation-summary.md

Suggestions:
  1. Run: /spec_kit:plan to regenerate missing spec docs
  2. Add the anchor manually and retry
  3. Save to a different target
```

### Validator failure after merge

If the post-merge validation fails (e.g., the merge corrupted adjacent anchor integrity):
```
✗ Save rolled back: ANCHORS_VALID validation failed

Reason: Anchor 'decisions' closing tag missing after merge
Action taken: Restored implementation-summary.md to pre-merge state
Session fingerprint unchanged

Please inspect implementation-summary.md manually and retry.
```

### Concurrent edit conflict

If a human hand-edits the spec doc while the save is in-flight (the mutex handles this — the save waits for the human's file lock to release, then re-reads):
```
⚠ Spec doc modified during save (concurrent edit detected)
  Re-reading implementation-summary.md
  Re-running merge with updated content
  ✓ Merge completed on second attempt
```

## Routing transparency (the key UX win)

Under the current memory system, the user never sees where content is going — it's all lumped into a `.md` file in `memory/`. Under Option C, the user sees:
- Which chunks the classifier extracted
- What each chunk was classified as
- Where each chunk is being routed
- What confidence level the classifier assigned

This transforms `/memory:save` from a black-box operation into an auditable one. Users can fix routing mistakes BEFORE they land in spec docs.

## Override and rollback

Any save can be rolled back via git (since spec docs are git-tracked). The command response includes a rollback hint:
```
To undo this save: git checkout HEAD~1 -- implementation-summary.md decision-record.md handover.md
```

This is only shown when rollback is easy (one save, one session). If multiple saves have happened, the hint changes to `git log` for manual selection.

## Findings

- **F14.1**: Routing transparency is the biggest UX win. Users can see and override classification decisions BEFORE content lands in spec docs. The current system doesn't offer this.
- **F14.2**: Interactive mode (`--interactive`) gives confidence and override to users who want it. Auto mode (default) is still fast for the common case.
- **F14.3**: Failure messages are actionable — each failure has a suggested next step, not just a stack trace.
- **F14.4**: Concurrent edit handling preserves the mutex guarantee: either the save succeeds cleanly after waiting, or it rolls back cleanly.
- **F14.5**: Git-based rollback is a natural fit because spec docs are already git-tracked. No separate rollback machinery needed.

## Next focus

Iteration 15 — conflict handling and arbitration.

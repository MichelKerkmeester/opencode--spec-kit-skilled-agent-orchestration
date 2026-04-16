---
title: "Iteration 003 — Anchor-scoped merge semantics"
iteration: 3
band: A
timestamp: 2026-04-11T13:45:00Z
worker: claude-opus-4-6
scope: q2_anchor_merge
status: complete
focus: "Design anchorMergeOperation. Define merge modes, atomicity envelope, rollback, anchor integrity preservation."
maps_to_questions: [Q2]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-003.md"]

---

# Iteration 003 — Q2: Anchor-Scoped Merge Semantics

## Goal

Design the `anchorMergeOperation` new component. Given a target spec doc + anchor ID + new content + merge mode, produce an updated spec doc that preserves anchor integrity, frontmatter, and adjacent anchors — with full atomic rollback on failure.

## The 5 merge modes

From iteration 2's routing decisions, five merge modes cover every target-anchor combination:

### Mode 1: `append-as-paragraph`

**Target**: narrative sections like `implementation-summary.md::what-built`, `::how-delivered`, `handover.md`, `research/research.md`.

**Behavior**: locate the closing `<!-- /ANCHOR:x -->`, step back to the last non-empty line inside the anchor, append the new content as a new paragraph (blank line separator), re-close the anchor.

**Idempotency**: compute a content hash of the chunk. Before appending, scan existing content inside the anchor for the same hash. If found, skip (no-op). Otherwise append.

**Example**:
```
<!-- ANCHOR:what-built -->
## What Was Built
Existing paragraph describing prior work.

[NEW: "Refactored the auth middleware..." paragraph inserted here]
<!-- /ANCHOR:what-built -->
```

### Mode 2: `insert-new-adr`

**Target**: `decision-record.md` — each decision is its own top-level section with nested anchors (`adr-001`, `adr-001-context`, `adr-001-decision`, etc.).

**Behavior**:
1. Count existing ADR sections by grep for `<!-- ANCHOR:adr-\d+ -->`
2. Next ADR number = count + 1
3. Render the new ADR from a template using the decision content
4. Insert as a new top-level section at the end of the decision-record.md body (before any trailing comments)
5. Assign the ADR its own anchor ID

**Idempotency**: compare the decision title (first line of new content) against existing ADR titles. If exact match, skip. Otherwise insert.

**Example**: inserts `<!-- ANCHOR:adr-007 --> ## ADR-007: ... <!-- /ANCHOR:adr-007 -->` after the last existing ADR.

### Mode 3: `append-table-row`

**Target**: `implementation-summary.md::decisions` (L2 packets without full decision-record.md).

**Behavior**:
1. Locate the decisions table inside the anchor (recognize by markdown table header pattern)
2. Parse the table header to understand column order (typically: Decision, Why)
3. Append a new row with the decision content
4. Preserve column alignment

**Idempotency**: scan existing rows for matching decision title. Skip if duplicate.

### Mode 4: `update-in-place`

**Target**: `tasks.md::phase-N`, `checklist.md::code-quality` and similar structured lists.

**Behavior**:
1. Locate the target list item (by task ID like `T023` or checklist ID like `CHK-010`)
2. Update the checkbox (`[ ]` → `[x]`)
3. Optionally append evidence reference (`[Evidence: file:line]`)
4. Preserve surrounding items

**Idempotency**: if the item is already `[x]` with matching evidence, skip.

### Mode 5: `append-section`

**Target**: `research/research.md` for new research findings.

**Behavior**:
1. Append a new section at the bottom of the file with a timestamped header (`## Finding YYYY-MM-DD: [title]`)
2. Insert the finding body

**Idempotency**: compare new finding title + body hash against existing sections. Skip if duplicate.

## Atomic envelope (the key concurrency primitive)

Every merge operation runs inside the existing `withSpecFolderLock` mutex from `memory-save.ts:1569`. The sequence:

```
withSpecFolderLock(specFolder, async () => {
  1. Take backup snapshot of target spec doc
  2. Read current content
  3. Parse frontmatter (separate from body)
  4. Locate target anchor via regex scan for <!-- ANCHOR:x --> ... <!-- /ANCHOR:x -->
  5. If anchor not found → refuse merge, return error
  6. Apply merge mode to the anchor content only
  7. Rebuild spec doc: original frontmatter + pre-anchor body + updated anchor + post-anchor body
  8. Validate result:
     - All anchors still open/closed
     - Frontmatter still parseable
     - No ANCHORS_VALID rule violations
  9. If validation fails → restore backup, throw
  10. Write updated content via pending file + rename (same pattern as current atomicSaveMemory)
  11. Release lock
})
```

The mutex prevents concurrent writes to the same spec folder. Two saves targeting different spec folders can proceed in parallel (the mutex is per-folder, not global).

## Rollback story

On any failure inside the merge operation:

1. Restore the backup snapshot taken in step 1
2. Write the restored content via pending + rename (same atomic pattern)
3. Throw the error to the caller
4. Log the rollback event

Because the mutex is held across all steps, the rollback is serialized — no race condition where another save observes the intermediate state.

## Anchor integrity preservation

The merge operation must NEVER corrupt:

1. **Open/close pair integrity**: every `<!-- ANCHOR:x -->` must have a matching `<!-- /ANCHOR:x -->`. Post-merge validation grep-counts these and compares.
2. **Anchor order**: anchors appear in a specific sequence per template (e.g., `metadata → what-built → how-delivered → decisions → verification → limitations` in implementation-summary). Merge operations never reorder.
3. **Frontmatter separation**: the YAML frontmatter between `---` delimiters at the top of the file must be preserved byte-for-byte unless the merge explicitly targets frontmatter fields (which would go through a different path, not `anchorMergeOperation`).
4. **Adjacent anchors**: content outside the target anchor is read-only. The merge operation MUST NOT touch bytes outside the target anchor's inner content.

## Handling edge cases

### Anchor missing in target doc

Return error. The save pipeline surfaces this to the user: "Target anchor `what-built` not found in `implementation-summary.md`. Did you mean to create it?" User can then:
- Create the doc from template (if missing entirely)
- Add the anchor manually and retry
- Override with a different target

### Target doc doesn't exist

Return error with clear message. This triggers the root-packet backfill prerequisite from the seed's F10 / refinement 6. For root packets without canonical docs, the prerequisite is to backfill BEFORE phase 018 runs any merge operations.

### Two merge targets for one content chunk

If iteration 2 classification returns multiple targets (e.g., a decision that also appears in `tasks.md` as a completed task), run the merges sequentially inside the same mutex. Either all succeed or all roll back.

### Spec doc mid-edit by human

The mutex holds for the duration of the merge. If a human `git add`s a partial edit during the merge, the merge sees the committed state; the human's edit either precedes or follows the merge, never interleaves. File system atomicity of `fs.renameSync` guarantees this.

## Findings

- **F3.1**: 5 merge modes cover every routing target from iteration 2's 8 content categories. No additional modes needed.
- **F3.2**: The atomic envelope is a direct adaptation of the existing `atomicSaveMemory` at `memory-save.ts:1521-1640` — same mutex, same fs.rename pattern, same rollback-on-failure. The only change is what happens inside the lock: merge operation instead of write-new-file.
- **F3.3**: Idempotency per merge mode (hash comparison for paragraphs, title comparison for ADRs, ID comparison for list items) prevents duplicate content when a save is replayed.
- **F3.4**: Anchor integrity validation after merge catches corruption before the write is committed. This is a safety net that the current `atomicSaveMemory` doesn't have (because the current path writes new files, not updates to existing ones).
- **F3.5**: The per-spec-folder mutex means two saves for different packets can run in parallel. This is the same concurrency profile as the current system — no new bottleneck.

## Open questions for later iterations

- Exact regex patterns for each merge mode's locate logic (defer to phase 018 implementation phase 019)
- How to handle a human hand-edit that removes an anchor between merges (iteration 15 conflict handling)

## What worked

- Treating merge as a pure function inside an existing atomic envelope made the design simple. No new concurrency primitive needed.
- Enumerating the 5 modes explicitly prevented the "one giant merge function" anti-pattern. Each mode is small and testable.

## What failed / did not work

- Did not propose error codes or exception types — deferred to phase 018 implementation.

## Next focus (iteration 4)

Design the frontmatter and metadata merge policy. Where does memory metadata attach? Sidecar, embedded, or continuity record? Answer Q2 (metadata policy portion).

---
title: "Iteration 015 — Conflict handling and arbitration"
iteration: 15
band: C
timestamp: 2026-04-11T14:45:00Z
worker: claude-opus-4-6
scope: q2_q9_conflicts
status: complete
focus: "Design conflict resolution for concurrent writes, human-vs-agent precedence, cross-packet conflicts."
maps_to_questions: [Q2, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-015.md"]

---

# Iteration 015 — Conflict Handling and Arbitration

## Goal

Real scenarios that must work under Option C:
- Two saves target the same anchor in the same packet
- A human hand-edits a spec doc while a save is mid-flight
- An agent and a human both want the `decisions` anchor simultaneously
- Cross-packet conflicts (same decision promoted from child phase to parent)

## Arbitration hierarchy

**Rule**: humans win by default. Specifically:

1. **Human edits always win over agent edits.** If a human has modified the target spec doc since the last save, the agent's save must either re-read and retry, or defer to the human.
2. **Explicit overrides win over implicit routes.** If a human passed `--route-as X` to `/memory:save`, the classifier's choice is ignored.
3. **Recent wins over stale.** If two saves hit the same anchor within the same second, last-write-wins by timestamp (but the mutex ensures this is unusual).
4. **High confidence wins over low confidence.** If the merge would apply a low-confidence routing decision, the classifier defers and surfaces the decision to the user.

## Concurrent save scenarios

### Scenario A: Two agent saves, same anchor, different content

Sequence:
```
t=0: Save 1 acquires mutex
t=100: Save 2 arrives, waits on mutex
t=200: Save 1 completes merge, releases mutex
t=201: Save 2 acquires mutex
t=210: Save 2 re-reads the target spec doc (now includes Save 1's content)
t=220: Save 2 re-applies its merge
t=300: Save 2 completes
```

The mutex serializes. Save 2 sees Save 1's state and merges into it. Both chunks end up in the anchor. No content lost.

### Scenario B: Human edit mid-save

Sequence:
```
t=0: Save acquires mutex
t=50: Save reads target spec doc
t=100: Save validates merge internally
t=120: Human opens the file in editor (not yet saved)
t=150: Save completes merge, writes to pending path
t=160: fs.renameSync promotes pending → final
t=170: Human's editor shows the file as modified externally, prompts reload
t=180: Human reloads, sees merge result
```

The mutex doesn't block the human's editor (the OS file lock is different from the spec folder mutex). But the pending+rename pattern means the human sees either the pre-merge or post-merge state, never a partial write. Human can then resolve any conflicts manually.

### Scenario C: Human edit committed before save completes

Sequence:
```
t=0: Save acquires mutex
t=50: Save reads target spec doc (version V1)
t=100: Save validates merge against V1
t=150: Save acquires file lock for pending write
t=160: Human saves their own edit via editor (version V2)
t=170: Save's fs.renameSync overwrites V2 with V1+merge — BUG
```

**This is the race condition the current `atomicSaveMemory` also has.** The mutex protects against other MCP saves but NOT against direct fs writes from outside the MCP.

**Mitigation**:
1. Take a file mtime snapshot at read time (step t=50)
2. Before writing at t=170, compare mtime — if it changed, abort and re-run
3. Exponential backoff + retry (up to 3 attempts)
4. After 3 attempts, surface to user: "Detected external edit; cannot merge automatically. Your save content is preserved in scratch/pending-save-{timestamp}.md — please resolve manually."

This is a new safety net that the current memory system lacks. Worth implementing in phase 019.

### Scenario D: Same decision promoted from child to parent

A decision made in `specs/026/016/003/decision-record.md::adr-001` gets promoted to the parent packet's decision record at `specs/026/016/decision-record.md::adr-001`.

**Challenge**: the same content should exist in both places, but we don't want dedup to reject the second save as "already exists".

**Resolution**:
1. The router classifies the promote operation as `decision`
2. The target is the parent packet's decision-record.md (specified by the caller)
3. The merge operation at the parent target doesn't see the child's content (different file), so it writes the decision fresh
4. The causal graph (iteration 10) records a `supersedes` or `derived_from` edge between the child's ADR and the parent's ADR
5. Both ADRs coexist; the causal graph tracks the promotion

## Cross-anchor conflicts

Within a single spec doc, two saves might target different anchors. This is NOT a conflict — the mutex serializes them, each merge operates on its own anchor, and the rebuilt spec doc contains both updates.

The merge operation reads the whole doc, applies its anchor-scoped change, and rebuilds. If another anchor was updated concurrently, the next save sees the updated anchor and doesn't touch it.

## Lock granularity trade-offs

| Granularity | Concurrency | Complexity | Choice |
|---|---|---|---|
| Per file (mutex per spec doc file) | Lower — same doc blocks | Simpler | **Current** (`withSpecFolderLock` uses spec folder granularity) |
| Per anchor (mutex per doc+anchor) | Higher — different anchors parallel | More complex | Considered for phase 019, deferred |
| Per spec folder (current) | Medium — same packet serializes | Moderate | **Recommended** — matches current granularity, avoids over-engineering |

**Recommendation**: keep per-spec-folder mutex as-is. It's the right granularity — concurrent saves to the same packet are rare, and serializing them is safer than per-anchor parallelism.

## Findings

- **F15.1**: The existing per-spec-folder mutex is the right granularity for Option C. No new concurrency primitive needed.
- **F15.2**: Human-vs-agent conflict resolution is best handled via mtime-based external-edit detection + retry, not via a new locking system.
- **F15.3**: Cross-packet promotion (child → parent) is supported via the causal graph's `supersedes` / `derived_from` edges. Both copies coexist; the graph records the relationship.
- **F15.4**: The pending+rename pattern (already in `atomicSaveMemory`) gives the user atomic visibility — they see either pre-merge or post-merge, never partial state.
- **F15.5**: The "external edit during save" race condition exists in the current system too, but Option C adds an mtime check to mitigate it. This is a safety improvement, not a regression.

## Next focus

Iteration 16 — migration strategy refinement (M4 details).

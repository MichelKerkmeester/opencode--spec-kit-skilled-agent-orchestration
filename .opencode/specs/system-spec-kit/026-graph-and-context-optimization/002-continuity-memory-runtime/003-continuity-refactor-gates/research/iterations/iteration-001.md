---
title: "Iteration 001 — Mental model calibration and post-Option-C architecture baseline"
iteration: 1
band: A
timestamp: 2026-04-11T13:35:00Z
worker: claude-opus-4-6 (Claude Code session, in-session orchestrator+worker)
scope: architecture_baseline
status: complete
focus: "Read the seed. Read the key code paths. Build a single annotated diagram showing the post-Option-C target write/read/resume paths alongside the current ones for comparison."
maps_to_questions: [Q1, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-001.md"]

---

# Iteration 001 — Architecture Baseline

## Goal

Ground the 20-iteration loop. Read `../scratch/phase-017-rerun-seed.md` to internalize the 10 prior findings. Refresh the mental model of the key code paths. Produce a single annotated architecture diagram showing the **current state** next to the **post-Option-C target state** so subsequent iterations have a shared vocabulary.

## Inputs read this iteration

1. `../scratch/phase-017-rerun-seed.md` (F1-F10 + 6 refinements)
2. `../../z_archive/z_archive/017-memory-refactor-or-deprecation/research/iterations/iteration-001.md` (phase 017 architecture baseline)
3. `../../z_archive/z_archive/017-memory-refactor-or-deprecation/research/iterations/iteration-002.md` (16-stage pipeline mapping)
4. `../../z_archive/z_archive/017-memory-refactor-or-deprecation/research/iterations/iteration-004.md` (redundancy matrix)
5. Cached mental model of `memory-save.ts` (1799 LOC), `memory-context.ts` (1610 LOC), `memory-search.ts` (1378 LOC), `generate-context.ts` (610 LOC), `nested-changelog.ts` (787 LOC)

## Current-state architecture (established by phase 017)

```
┌─────────────────────────────────────────────────────┐
│ CURRENT WRITE PATH                                   │
│                                                       │
│ /memory:save → generate-context.ts CLI               │
│    → runWorkflow() → memory_save MCP                 │
│    → 16-stage pipeline (memory-save.ts)              │
│    → atomicSaveMemory (L1521)                        │
│       → withSpecFolderLock (L1569)                   │
│       → fs.writeFileSync (pending path)              │
│       → fs.renameSync (promote to final)             │
│       → processPreparedMemory (dedup, embed, PE)     │
│       → memory_index row + vec_memories + FTS5 sync  │
│    → physical memory file under <spec-folder>/memory/│
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CURRENT READ PATH                                    │
│                                                       │
│ Caller → memory_context (handler)                    │
│    → intent classification (7 intent types)          │
│    → mode routing (auto/quick/deep/focused/resume)   │
│    → handleMemorySearch OR handleMemoryMatchTriggers │
│    → 4-stage pipeline: gather → score → rerank → filter│
│    → RRF fusion across vector/bm25/fts5/graph/trigger│
│    → constitutional memory always-surface injection  │
│    → result envelope with session transition trace  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CURRENT RESUME PATH                                  │
│                                                       │
│ /spec_kit:resume → session_bootstrap                 │
│    → session_resume                                  │
│    → memory_context({ mode: "resume", profile: "resume" })│
│    → (same read path as above)                       │
│    → adds code-graph + CocoIndex state              │
└─────────────────────────────────────────────────────┘
```

## Post-Option-C target architecture

```
┌─────────────────────────────────────────────────────┐
│ TARGET WRITE PATH                                    │
│                                                       │
│ /memory:save → generate-context.ts (refactored)      │
│    → contentRouter (new) — classify content type     │
│    → per content type:                              │
│       narrative → implementation-summary.md::what-built│
│       decisions → decision-record.md::adr-NNN OR    │
│                   implementation-summary.md::decisions│
│       handover → handover.md (append entry)          │
│       research-finding → research/research.md (append)│
│       task-update → tasks.md::phase-N                │
│       (metadata-only fields) → thin continuity record│
│    → anchorMergeOperation (new) for each spec doc   │
│       → withSpecFolderLock (reused from current)     │
│       → read target spec doc                        │
│       → locate target anchor                        │
│       → merge content per merge semantics (iter 3)  │
│       → validate result (anchor integrity)          │
│       → atomic write back (same fs.renameSync pattern)│
│    → atomicIndexMemory (new, replaces atomicSaveMemory)│
│       → skip file I/O (spec docs already exist)     │
│       → commit to memory_index (same as current)    │
│       → vec_memories + FTS5 sync (same as current)  │
│    → post-save hooks (same as current)              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ TARGET READ PATH                                     │
│                                                       │
│ Caller → memory_context (retargeted)                 │
│    → intent classification (unchanged)               │
│    → mode routing (unchanged)                        │
│    → handleMemorySearch (retargeted index source)    │
│    → 4-stage pipeline (unchanged)                    │
│    → indexed document_types: spec_doc, continuity,  │
│       archived_memory (tier=archived)                │
│    → result envelope (unchanged)                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ TARGET RESUME PATH                                   │
│                                                       │
│ /spec_kit:resume → new resume ladder:                │
│    1. Read handover.md (fastest, most actionable)    │
│    2. Read thin continuity record (metadata hints)   │
│    3. Query spec docs via memory_context(spec_doc)   │
│    4. Fall back to archived memory (weight × 0.3)    │
│    → assemble recovered context package             │
└─────────────────────────────────────────────────────┘
```

## Key deltas between current and target

| Aspect | Current | Target | Change class |
|---|---|---|---|
| Storage unit | memory file | spec doc anchor + continuity record | **Rewrite** (stage 10 atomicSave + stage 3 template contract) |
| Write target | `<spec-folder>/memory/*.md` | existing spec doc anchors | Rewrite |
| Routing | Single output path (always a memory file) | Content-type classifier + router | **New component** |
| Atomic envelope | file lock + fs rename + index | doc lock + anchor merge + index | Adaptation (keep mutex semantics) |
| Resume first-hit | `memory_context(resume)` | `handover.md` read | Rewrite (different source) |
| Index source | `memory_index` rows pointing to memory files | `memory_index` rows pointing to spec doc anchors + continuity records | Adaptation (schema field update) |
| Validator | memory-specific template contract | spec-doc template contract | Rewrite |
| Trigger cache | sourced from memory file frontmatter | sourced from spec doc frontmatter + continuity records | Adaptation |

## The 4 components that need NEW code

1. **`contentRouter`** — classify arbitrary session content into one of 8 categories (narrative / decision / handover / research / task / metadata / conversation-drop / recovery-drop). Used inside `generate-context.ts` before any write happens. Iteration 2 designs this.

2. **`anchorMergeOperation`** — given a target spec doc + anchor ID + new content + merge mode, produce an updated spec doc that preserves anchor integrity, frontmatter, and adjacent anchors. Used inside the refactored save pipeline. Iteration 3 designs this.

3. **`thinContinuityRecord`** — the schema + storage format for the unique metadata that spec docs can't express (trigger phrases, causal edges, FSRS state, fingerprints). Iteration 5 designs this.

4. **`resumeLadder`** — new recovery order for `/spec_kit:resume`: handover first, continuity record second, spec docs third, archived memory last. Iteration 13 designs this.

The rest of the codebase stays — 132 of ~147 files are touched by S/M changes, not rewrites (phase 017 F8).

## Vocabulary established for later iterations

- **Content classification** = the act of categorizing a session content chunk into one of 8 routing targets
- **Anchor merge** = a safe read-transform-write operation against one anchor section of one spec doc
- **Continuity record** = the thin metadata artifact that carries fingerprint, triggers, causal edges, FSRS state, packet pointer
- **Resume ladder** = the ordered fallback sequence the resume path walks: handover → continuity → spec docs → archived memory
- **Archived memory** = existing memory files with `is_archived=1`, retrievable as last-resort fallback (M4 per F7)

## Findings

- **F1.1**: The target architecture reuses ~80% of the existing retrieval pipeline, ~50% of the existing save pipeline, and introduces 4 new named components. This is a "rewiring" project, not a ground-up rebuild. Consistent with phase 017 F2 (2 of 16 stages rewrite).
- **F1.2**: The `withSpecFolderLock` mutex (memory-save.ts:1569) is the critical concurrency primitive that MUST transfer to the new path. Without it, concurrent saves to the same anchor would race.
- **F1.3**: `nested-changelog.ts` provides the prototypical read-transform-write-over-spec-docs pattern. Its regex-based section extraction + template render + atomic write can be adapted directly for `anchorMergeOperation`.
- **F1.4**: The 4 new components (contentRouter, anchorMergeOperation, thinContinuityRecord, resumeLadder) are the unique intellectual design work in phase 018. Everything else is adaptation.
- **F1.5**: The Option C target preserves the full current retrieval envelope. Users never experience "memory got worse" for the 2/10 queries where memory currently wins (per F5); the continuity record + archived memory fallback covers them.

## What worked

- Starting with the phase 017 seed instead of re-reading code saved significant context and let this iteration focus on the current-vs-target delta.
- Cross-referencing the phase 017 iteration-002 stage classification (8 as-is + 6 adapt + 2 rewrite) made the "rewiring not rebuilding" insight concrete.
- Drawing both current and target architectures side-by-side revealed the 4 new components cleanly. Prior iterations could have missed this by describing only the target.

## What failed / did not work

- No live handler reads in this iteration. Mental model is cached from phase 017 and earlier explorations. Fresh reads are deferred to iterations where specific code details matter.

## Next focus (iteration 2)

Design `contentRouter`. Enumerate the 8 content categories. Propose a classifier contract (rule-based vs embedding vs LLM). Define refuse-to-route and user-override behaviors. Answer Q1 (routing authority).

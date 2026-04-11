---
title: "Iteration 001 — Architecture Baseline & Mental Model Calibration"
iteration: 1
timestamp: 2026-04-11T12:35:00Z
worker: claude-opus-4-6 (Claude Code session)
scope: architecture_baseline
status: complete
focus: "Read memory-save.ts, memory-context.ts, memory-search.ts, generate-context.ts end-to-end. Produce an architecture diagram of the current memory write and read paths. No design proposals."
maps_to_questions: [Q1]
---

# Iteration 001 — Architecture Baseline

## Goal

Ground the rerun in the actual code. Read the four core source files end-to-end (memory-save.ts L1-200 + L1480-1640 atomic save section, memory-context.ts L1-150 header, memory-search.ts entry, generate-context.ts L1-120 CLI). Build a shared vocabulary and a single architecture diagram that all subsequent iterations reference. No design proposals yet.

## Sources read

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` — 1799 LOC total, read L1-200 (module header, imports, helper classes, `prepareParsedMemoryForIndexing`) and L1480-1640 (atomic save + governance tail)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` — 1610 LOC total, read L1-150 (types, ContextArgs interface, module imports including `intent-classifier`, `handleMemorySearch`, `handleMemoryMatchTriggers`)
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` — 610 LOC total, read L1-120 (CLI entry, help text, structured JSON input format)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/` — directory listing (14 modules)
- File size census: memory-save 1799, memory-search 1378, memory-context 1610, session-resume 614, session-bootstrap 350 = 5751 LOC in the five primary handlers alone

## Current write path (observed)

```
User invokes /memory:save
    |
    v
generate-context.ts CLI (L51-120)
    -- reads structured JSON from stdin / --json / data file
    -- validates spec folder arg (explicit CLI target is authoritative)
    -- calls runWorkflow() from ../core/workflow
    -- calls collectSessionData() for session enrichment
    -- produces a markdown memory file under <spec-folder>/memory/
    |
    v
memory_save MCP handler (memory-save.ts)
    -- imports 30+ modules at L1-102
    -- runs prepareParsedMemoryForIndexing() at L196
    -- pipeline stages: governance, preflight, template contract, spec-doc health,
       dedup, embedding, quality gate, PE arbitration, atomic save, embedding index,
       chunking, post-insert, reconsolidation, enrichment, causal edges, commit
    |
    v
atomicSaveMemory() at L1521
    -- gets per-spec-folder mutex via withSpecFolderLock() L1569
    -- writes to pending path L1571-1572
    -- promotes via fs.renameSync() L1573
    -- calls processPreparedMemory() while lock held L1576
    -- on rejection: restoreAtomicSaveOriginalState() L1585
    -- on error: rollback + cleanup pending file L1594-1611
    -- transactional envelope guarantees file rollback matches index state
    |
    v
save/ subdirectory (14 modules)
    -- dedup.ts          -- content hash + existing row checks
    -- embedding-pipeline.ts -- generateOrCacheEmbedding + async fallback
    -- pe-orchestration.ts -- prediction error gating (create/reinforce/update/supersede)
    -- reconsolidation-bridge.ts -- assistive auto-merge at >0.96 similarity
    -- post-insert.ts    -- causal links, entity extraction, summary gen, D3 graph
    -- create-record.ts  -- actual memory_index row insert
    -- db-helpers.ts     -- applyPostInsertMetadata
    -- spec-folder-mutex.ts -- withSpecFolderLock()
    -- markdown-evidence-builder.ts -- evidence snapshot for provenance
    -- validation-responses.ts -- rejection response builders
    -- response-builder.ts -- buildSaveResponse at L1508
    -- index.ts          -- type + interface entry
    -- types.ts          -- IndexResult, SaveArgs, AtomicSaveParams, AtomicSaveOptions, AtomicSaveResult
```

## Current read path (observed)

```
Caller invokes memory_context (handlers/memory-context.ts)
    -- ContextArgs (L111-129): input, mode, intent, specFolder, limit, sessionId,
       anchors, profile, tokenUsage
    -- ContextMode (L69-74): name, description, strategy, tokenBudget
    -- session lifecycle metadata (L93-100)
    |
    v
Intent classification (L12)
    -- imports ../lib/search/intent-classifier.js
    -- classifies query into one of 7 intent types:
       add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision
    |
    v
Query routing (L20-22)
    -- handleMemorySearch (memory-search.ts) for semantic retrieval
    -- handleMemoryMatchTriggers (memory-triggers.ts) for trigger-phrase fast path
    -- classifyQueryIntent (code-graph/query-intent-classifier) for structural queries
    |
    v
memory-search.ts (handlers/memory-search.ts)
    -- 4-stage pipeline: gather -> score -> rerank -> filter
    -- RRF fusion across channels (vector, bm25, fts5, graph, trigger)
    -- constitutional memory always-surface injection
    |
    v
Result envelope (lib/response/envelope.ts)
    -- createMCPResponse + createMCPErrorResponse
    -- session transition trace attached (L38-42)
```

## Session continuity path (observed)

```
session_bootstrap (handlers/session-bootstrap.ts, 350 LOC)
    |
    v
session_resume (handlers/session-resume.ts, 614 LOC)
    -- first sub-call: memory_context({ input, mode: "resume", profile: "resume" })
    -- then adds code-graph + CocoIndex state
    -- inherits memory_context fragility on any cold-cache embedding state
```

## Six anchor surfaces per spec kit doc (observed from templates)

| Doc | Anchor IDs |
|---|---|
| `implementation-summary.md` | `metadata`, `what-built`, `how-delivered`, `decisions`, `verification`, `limitations` |
| `decision-record.md` | Nested per-ADR: `adr-NNN`, `adr-NNN-context`, `adr-NNN-decision`, `adr-NNN-alternatives`, `adr-NNN-consequences`, `adr-NNN-impl`, `adr-NNN-five-checks` |
| `tasks.md` | `notation`, `phase-1`, `phase-2`, `phase-3`, `completion`, `cross-refs` |
| `checklist.md` | `protocol`, `pre-impl`, `code-quality`, `testing`, `security`, `docs`, `file-org`, `summary` |
| `spec.md` | `metadata`, `problem`, `scope`, `requirements`, `success-criteria`, `risks`, `questions` |
| `plan.md` | `summary`, `quality-gates`, `architecture`, `phases`, `testing`, `dependencies`, `rollback` |

Validator: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` enforces `ANCHORS_VALID` rule (opened/closed integrity).

## Vocabulary established for later iterations

- **Write path** = generate-context.ts CLI → memory_save handler → 16-stage pipeline → atomicSaveMemory → file on disk + memory_index row
- **Read path** = memory_context → intent classification → memory_search/memory_match_triggers → 4-stage pipeline → result envelope
- **Continuity path** = session_bootstrap → session_resume → memory_context(resume) → handover_data
- **Anchor surface** = existing HTML-comment-delimited section in a spec kit doc that can serve as a write target for wiki-style routing
- **Thin continuity layer** = (proposed) small record holding the metadata and retrieval hints that spec doc anchors cannot express (fingerprint, FSRS state, causal edge endpoints, packet pointer)
- **Retargeting** = keeping an advanced memory feature working, but pointing its source/sink at spec doc anchors + thin continuity layer instead of memory files

## Findings

- **F1.1**: The write path and the read path are loosely coupled but share the intent classifier and the `memory_index` table. The read path can be retargeted to spec-doc anchors without touching the write path mechanics beyond its storage endpoint.
- **F1.2**: `atomicSaveMemory()` at `memory-save.ts:1521` holds the per-spec-folder mutex (`withSpecFolderLock` at L1569) around both the disk write and the indexing step. Any wiki-style refactor that targets spec docs must keep this mutex (or equivalent) because concurrent saves to the same anchor would race.
- **F1.3**: The save pipeline's `save/` subdirectory (14 modules) is already well-factored. Retargeting the save step does NOT require rewriting dedup, embedding, PE arbitration, reconsolidation, or post-insert enrichment — only the `atomicSaveMemory` → `atomicIndexMemory` split (drop file I/O for spec doc writes, keep the mutex + transaction).
- **F1.4**: `memory_context` mode routing (L20-22) and intent classification (L12) are query-side, not storage-side. They already work against any indexed `document_type`.
- **F1.5**: The spec kit anchor inventory is comprehensive — every major narrative type in memory files has at least one corresponding anchor in at least one spec kit doc. This confirms the Option C routing premise is structurally feasible.

## What worked

- Reading the memory-save.ts header + atomic save tail in two windows gave a complete picture of the mutex/retry/rollback envelope without needing to read the 1400 lines in between.
- The save/ subdirectory listing (14 modules) is a cleaner structural map than the monolithic memory-save.ts.

## What failed / did not work

- A parallel read attempt against `memory-search.ts` hit a path typo and returned no result — deferred to iteration 5, where the file is the primary focus anyway.

## Open questions carried forward

- How precisely does `prepareParsedMemoryForIndexing()` split validation from side effects? (Deferred to iteration 2.)
- Which of the 14 save/ modules need touch changes vs no-change vs rewrite under Option C? (Deferred to iteration 2 and 8.)
- How does `memory_context` in `resume` mode currently load content, and can it be fast-tracked to a thin continuity layer? (Deferred to iterations 5 and 9.)

## Next focus (for iteration 2)

Deep dive into the 16-stage save pipeline: map every stage to its handler file + line range, trace which stages transform state vs validate state vs commit state, and classify each stage as retargetable-as-is, retargetable-with-adaptation, or requires-rewrite.

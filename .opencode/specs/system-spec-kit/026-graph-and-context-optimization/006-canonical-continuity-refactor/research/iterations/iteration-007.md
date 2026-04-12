---
title: "Iteration 007 — Intent routing, memory_context modes, 4-stage search pipeline retarget (Features 2, 12, 13)"
iteration: 7
band: B
timestamp: 2026-04-11T14:05:00Z
worker: claude-opus-4-6
scope: q4_features_2_12_13
status: complete
focus: "Retarget intent-aware retrieval + modes + embedding search + RRF fusion."
maps_to_questions: [Q4]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-007.md"]

---

# Iteration 007 — Features 2, 12, 13: Retrieval Substrate

## Features covered

- **Feature 2**: Intent-aware retrieval (`memory_context` modes + 7 intent types)
- **Feature 12**: Embedding-based semantic search (Voyage 1024-dim)
- **Feature 13**: 4-stage search pipeline with RRF fusion

These three features form the retrieval substrate. Retargeting them together avoids interface mismatches.

## Current implementation (from phase 017 iter 1)

- `memory_context` (L1 orchestration, `handlers/memory-context.ts:1610 LOC`) routes queries to `memory_search` or `memory_match_triggers` based on intent
- 7 intent types: add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision
- 5 modes: auto, quick, deep, focused, resume
- `memory_search` runs the 4-stage pipeline: gather → score → rerank → filter
- RRF (Reciprocal Rank Fusion) combines results from: vector channel, bm25 channel, fts5 channel, graph channel, trigger channel
- Voyage embeddings at 1024 dimensions

## Retarget mechanism

**Zero algorithmic change** — these features are query-side, not storage-side. They operate on the `memory_index` rows. Under Option C, `memory_index` contains rows for:

| document_type | source | is_archived | primary use |
|---|---|---|---|
| `spec_doc` | spec kit doc anchors | false | primary retrieval target |
| `continuity` | `_memory.continuity` blocks | false | resume fast path |
| `memory` | legacy memory files | true | archived fallback |

All four channels (vector, bm25, fts5, graph) operate on whichever document_types the query targets. The RRF fusion logic is unchanged.

### Mode retargeting

| Mode | Current behavior | Post-Option-C behavior |
|---|---|---|
| `auto` | Classify intent, route to best channel | Same; channels now span spec_doc + continuity + archived |
| `quick` | Top-K only, no rerank | Same; deprioritize archived (weight × 0.3) |
| `deep` | Full 4-stage pipeline | Same; spec docs weighted above archived |
| `focused` | Narrow to specFolder | Same; reads that spec folder's anchors first |
| `resume` | `memory_context({ mode: "resume" })` | **NEW**: bypasses SQL entirely, reads `_memory.continuity` directly from the packet's handover.md + implementation-summary.md. Falls through to SQL only if neither doc exists. |

### Intent retargeting

| Intent | Current target | Post-Option-C target |
|---|---|---|
| add_feature | memory files in similar packets | `spec_doc` rows + implementation-summary anchors |
| fix_bug | memory files with error context | `spec_doc` rows + handover.md entries with blockers |
| refactor | memory files with architecture discussions | `decision-record.md::adr-*` rows |
| security_audit | memory files with security keywords | `checklist.md::security` anchors |
| understand | memory files with explanations | `research/research.md` + `implementation-summary.md::what-built` |
| find_spec | memory files describing packet requirements | `spec.md` content |
| find_decision | memory files with decision entries | `decision-record.md::adr-*` directly |

Each intent's target list becomes cleaner — instead of "memory files mentioning X", it becomes "spec doc sections specifically designed for X".

## Code changes required

- `handlers/memory-context.ts` — update mode routing to include `spec_doc` document_type; add special resume path that bypasses SQL
- `handlers/memory-search.ts` — update 4-stage pipeline to include `document_type` filter
- `lib/search/intent-classifier.ts` — update intent → target mapping table (the 7×N mapping above)
- `lib/search/search-flags.ts` — add feature flag for `SEARCH_INCLUDE_ARCHIVED` (defaults true, can be disabled for clean retrieval)

All changes are **small** (S/M effort per file). The hard work is in the mapping table updates, not the algorithm.

## RRF fusion

Unchanged. RRF operates on rank positions from each channel, independent of document_type. The fusion score is the sum of `1 / (k + rank)` across channels, which doesn't care what the underlying rows are.

## Findings

- **F7.1**: The retrieval substrate retargets with **zero algorithmic change** — only the mapping tables update.
- **F7.2**: The resume mode gets a new special path (bypass SQL, read YAML directly) for <100ms latency. Preserves the current fast-path behavior even under Option C.
- **F7.3**: Intent → target mapping becomes cleaner, not more complex, because spec doc anchors are purpose-built for each intent type.
- **F7.4**: RRF fusion is document-type-agnostic. No changes to the fusion logic.
- **F7.5**: Feature flag `SEARCH_INCLUDE_ARCHIVED` lets operators tune whether archived memories appear in results. Defaults true during the phase 019 transition, can flip false in phase 020 once archived_hit_rate <0.5%.

## Next focus

Iteration 8 — session dedup and working memory retarget.

---
title: "Iteration 008 — Session dedup and working memory retarget (Feature 3)"
iteration: 8
band: B
timestamp: 2026-04-11T14:10:00Z
worker: claude-opus-4-6
scope: q4_feature3_session_dedup
status: complete
focus: "Retarget fingerprint-based session dedup. Preserve ~50% token savings on follow-up queries."
maps_to_questions: [Q4]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-008.md"]

---

# Iteration 008 — Feature 3: Session Dedup + Working Memory

## Current implementation

- `lib/search/session-state.ts` — tracks which memory_ids have been returned in the current session
- Fingerprint hashes computed per memory row
- On follow-up queries within the same session, the dedup filter excludes previously-returned rows, reducing token budget by ~50%

## Retarget mechanism

Session dedup is working-memory state, stored in a session-scoped LRU. It references `memory_id` values. Under Option C, `memory_index` contains `spec_doc` and `continuity` rows alongside archived memories — all have `memory_id` values. Dedup logic is unchanged.

**Key insight**: the dedup keys are opaque IDs, not content paths. The `session_state` doesn't care whether the ID points to a memory file or a spec doc row. It just says "don't return ID N again in this session."

## What needs to change

- `lib/search/session-state.ts` — no logic change; the ID space simply expands
- `lib/search/session-transition.ts` — tracking becomes slightly richer because a single session now spans multiple document_types. Add document_type to the transition trace for observability.

## Fingerprint handling

Under Option C, fingerprints serve two purposes:
1. **Query-time dedup** (current) — "don't return this row again"
2. **Save-time dedup** (new) — "don't write this content to the same anchor if it's already there" (iteration 3's idempotency check)

Both uses operate on the same fingerprint field in `memory_index`. The field is computed via content_hash, which is content-agnostic.

## Working memory under Option C

`workingMemory` (imported in `memory-context.ts:32`) holds per-session state. Under Option C:
- Working memory still tracks recently-seen rows
- Working memory additionally tracks recently-written anchors (new) — this is so a follow-up save to the same anchor can be fast-pathed via fingerprint comparison
- Cross-session working memory (via the `_memory.continuity.session_dedup` block from iteration 5) allows dedup to persist across session boundaries

## Findings

- **F8.1**: Session dedup retargets with **zero code change** — the feature is content-agnostic.
- **F8.2**: Fingerprint-based dedup serves double duty under Option C: query-time (existing) and save-time idempotency (new from iteration 3).
- **F8.3**: Adding document_type to session transition traces gives operators visibility into which channels are returning duplicates. This is useful during phase 019 tuning.
- **F8.4**: The `_memory.continuity.session_dedup` block from iteration 5 extends working memory across sessions for the same packet. This is a genuine enhancement over the current in-memory-only working memory.

## Next focus

Iteration 9 — quality gates, contamination gate, reconsolidation.

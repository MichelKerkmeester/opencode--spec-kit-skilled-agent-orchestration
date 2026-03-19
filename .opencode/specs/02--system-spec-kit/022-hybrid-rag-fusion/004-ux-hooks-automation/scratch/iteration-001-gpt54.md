# Iteration 1 (GPT-5.4): Handler Integration Robustness Analysis

## Agent
Model: gpt-5.4 | Reasoning: high

## Focus
Post-mutation hook integration across save/update/delete/bulk-delete handlers. Error paths, no-op detection, MutationHookResult handling consistency (Q2)

## Findings

### 1. [HIGH] Dedup/unchanged saves still mutate DB despite suppressing hooks
`indexMemoryFile` can return `unchanged` or `duplicate` from dedup, yet `handleMemorySave` unconditionally calls `applyPostInsertMetadata` for any positive `result.id`. That helper always updates `last_review` and when `review_count` is absent, forces `review_count = 0`. The response path skips hooks for `duplicate` (response-builder.ts:242) and returns before hooks for `unchanged` (response-builder.ts:179). This leaves caches stale after a real DB write and can reset review counters.
- [SOURCE: memory-save.ts:977, db-helpers.ts:33, db-helpers.ts:53, dedup.ts:146, dedup.ts:251, response-builder.ts:179, response-builder.ts:242]

### 2. [HIGH] atomicSaveMemory drifted from normal save path on unchanged handling
The atomic path only suppresses hooks when `indexResult.status === 'duplicate'` (memory-save.ts:1165), but same-path dedup returns `unchanged` (dedup.ts:146). The regression test expects `duplicate | unchanged | no_change` to omit `postMutationHooks` (memory-save-ux-regressions.vitest.ts:280). Normal `memory_save` treats `unchanged` as no-hook early return (response-builder.ts:179), so the two save paths are inconsistent.
- [SOURCE: memory-save.ts:1165, dedup.ts:146, memory-save-ux-regressions.vitest.ts:280, response-builder.ts:179]

### 3. [MEDIUM] Hook-runner failures silently swallowed with fabricated empty errors
The shared runner captures individual hook failures into `errors[]` (mutation-hooks.ts:24, 95), but callers catch any thrown exception and replace with a fabricated result with empty `errors`: memory-crud-update.ts:247, memory-crud-delete.ts:237, memory-bulk-delete.ts:233, memory-save.ts:1175. Turns real integration bugs into silent generic fallbacks.
- [SOURCE: mutation-hooks.ts:24, 95; memory-crud-update.ts:247; memory-crud-delete.ts:237; memory-bulk-delete.ts:233; memory-save.ts:1175]

### 4. [MEDIUM] MutationHookResult.errors contract effectively dead on handler boundary
Type requires `errors: string[]` (memory-crud-types.ts:91). `runPostMutationHooks` populates it for partial failures (mutation-hooks.ts:36). But handlers only expose `postMutationFeedback.data`, never the `errors` array. So ordinary hook failures degrade to booleans plus vague hints.
- [SOURCE: memory-crud-types.ts:91, mutation-hooks.ts:36; memory-crud-update.ts:274; memory-crud-delete.ts:269; memory-bulk-delete.ts:269; memory-save.ts:1215]

## Confirmed Behaviors (No Issues in mutation-hooks.ts itself)
The shared runner `runPostMutationHooks` is correctly implemented. Problems are in how handlers consume its result.

## Handler Consistency
- update, delete, bulk-delete: Consistent try/catch pattern with fabricated fallback (consistent but problematic)
- atomic-save: Divergent no-op suppression logic (only checks 'duplicate', not 'unchanged')
- response-builder.ts: Correctly suppresses hooks for both 'duplicate' and 'unchanged' in normal save path

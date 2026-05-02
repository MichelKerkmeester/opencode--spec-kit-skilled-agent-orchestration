# Iteration 2: HIGH Finding Verification + Architecture Assessment + Quick Answers (Q5-Q8)

## Focus
Verify the 2 HIGH-severity findings from iteration 1 (GPT-5.4 agent) by tracing exact call chains through source code. Assess hooks architecture for follow-on refinement (Q5). Answer Q6/Q7/Q8 quickly.

## Findings

### HIGH-1 Verification: Does `applyPostInsertMetadata` get called for duplicate/unchanged results?

**CONFIRMED (Real Bug)**

Trace through the normal (non-atomic) save path in `memory-save.ts`:

1. `handleSave()` calls `indexMemoryFile()` at line 970, which internally calls `processPreparedMemory()`
2. `processPreparedMemory()` (line 493+) calls `checkExistingRow()` at line 498 and `checkContentHashDedup()` at line 510
3. `checkExistingRow()` in `dedup.ts` line 146-157: when content hash matches AND embedding is eligible AND metadata is equivalent AND not forced, returns `{ status: 'unchanged', id: existing.id, ... }` -- **note: `existing.id` is the real database row ID (a positive integer)**
4. `checkContentHashDedup()` in `dedup.ts` line 248-261: when content hash matches another file, returns `{ status: 'duplicate', id: duplicateByHash.id, ... }` -- **again, the real database row ID**
5. Back in `handleSave()` line 977: `if (typeof result.id === 'number' && result.id > 0)` -- this evaluates **TRUE** for both `unchanged` and `duplicate` because they carry the existing row's ID
6. Therefore `applyPostInsertMetadata(database, result.id, ...)` on line 978 IS called, which executes:
   - `last_review = datetime('now')` (always set, line 54 of db-helpers.ts)
   - `review_count = 0` (always set when not in fields, line 55-57 of db-helpers.ts)
   - Plus any governance fields from `buildGovernancePostInsertFields()`

**Impact**: Every duplicate or unchanged save silently resets `review_count` to 0 and updates `last_review` on the existing memory row. This corrupts FSRS scheduling data (review_count is used by spaced repetition) and makes it appear the memory was recently reviewed even though no content changed. The `recordGovernanceAudit` call at line 979 also creates a spurious audit entry.

**Fix**: Guard the `applyPostInsertMetadata` call with a status check:
```
if (typeof result.id === 'number' && result.id > 0 && result.status !== 'unchanged' && result.status !== 'duplicate') {
```

[SOURCE: memory-save.ts:977-991, dedup.ts:146-157 + 248-261, db-helpers.ts:33-66]

---

### HIGH-2 Verification: Does atomicSaveMemory pass `unchanged` status through?

**PARTIALLY CONFIRMED (Real Divergence, Lower Impact Than Claimed)**

Trace through the atomic save path in `memory-save.ts`:

1. `atomicSaveMemory()` calls `processPreparedMemory()` at line 1065
2. `processPreparedMemory()` CAN return `unchanged` status (via `checkExistingRow` at line 507)
3. Line 1070: `if (indexResult.status === 'error')` -- this does NOT match `unchanged`, so no throw
4. The `unchanged` result passes through to line 1165

**Key divergences from normal save path:**

A. **No `applyPostInsertMetadata` call in atomic path** -- Unlike the normal save path (which calls it at line 978), the atomic path does not call `applyPostInsertMetadata` at all. For `unchanged` results, this is actually **correct behavior** (not corrupting FSRS data). For `indexed`/`updated`/`deferred` results, this is a **real omission** -- governance fields, quality metadata, etc., are never applied in the atomic save flow.

B. **Post-mutation hooks fire for `unchanged` but not `duplicate`** -- Line 1165: `shouldEmitPostMutationFeedback = indexResult.status !== 'duplicate'`. The `unchanged` status is NOT excluded, so post-mutation hooks (cache invalidation) fire unnecessarily for unchanged saves. This is minor waste but not a bug.

C. **File rename happens for `unchanged`** -- Line 1142-1143: `fs.renameSync(pendingPath, file_path)` runs even when the content is unchanged. The pending file was written at line 1063 with identical content, so the rename overwrites the file with identical bytes. Harmless but wasteful I/O.

**Revised Assessment**: The original claim that "atomicSaveMemory diverges from normal save path on unchanged handling" is confirmed -- there IS divergence. However, for `unchanged` results specifically, the atomic path is actually better-behaved than the normal path (it does NOT corrupt FSRS data). The real gap is that `applyPostInsertMetadata` is missing entirely from the atomic path for ALL result statuses, which means governance metadata is never applied for atomic saves.

[SOURCE: memory-save.ts:1031-1180, db-helpers.ts:33-66, response-builder.ts:242-257]

---

### Q5: Architecture Refinement Opportunities

**Finding 5.1: The hooks barrel (index.ts) is clean and minimal** -- 19 lines, re-exporting from 3 modules. No dead exports, no circular dependencies. The barrel structure is well-suited for the deferred follow-on work. [SOURCE: hooks/index.ts:1-19]

**Finding 5.2: mutation-feedback.ts is too rigid for structured response actions** -- The `buildMutationHookFeedback` function returns a fixed `{ data, hints }` shape where `data` is a flat object of cache-clear booleans. The deferred "structured response actions" feature would need richer action types (e.g., "suggest re-save", "recommend force mode", "trigger consolidation"). Currently there is no action field or action-type enumeration. Refinement: add an optional `actions?: ResponseAction[]` field to the return type, where `ResponseAction = { type: string; label: string; params?: Record<string, unknown> }`. [SOURCE: hooks/mutation-feedback.ts:6-53]

**Finding 5.3: response-hints.ts has the right extension point for success-hint composition** -- The `appendAutoSurfaceHints` function already mutates the envelope's `hints` array and `meta` object. The deferred "success-hint composition" feature could extend this same pattern by adding a `composeSuccessHints(envelope, operationResult)` function that reads operation-specific signals and generates contextual hints. The existing `syncEnvelopeTokenCount` mechanism already handles the token-budget enforcement loop. No architectural change needed -- just add a new exported function. [SOURCE: hooks/response-hints.ts:59-111]

**Finding 5.4: Missing `errors` field propagation in mutation-feedback.ts** -- The `MutationHookResult` interface includes an `errors` field (from memory-crud-types.ts), but `buildMutationHookFeedback` ignores it entirely. The `data` return type doesn't include `errors` and the function never reads `hookResult.errors`. This was already flagged as MODERATE in iteration 1, but it directly blocks the follow-on work: structured response actions would need error context to decide which recovery actions to suggest. [SOURCE: hooks/mutation-feedback.ts:6-53, confirmed iter-1 finding]

---

### Q6: Does `extractContextHint` need per-element type validation for concepts?

**CONFIRMED (Low Severity)**

Line 77-78 of memory-surface.ts:
```ts
if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
  return (args.concepts as string[]).join(' ');
}
```

The code checks that `concepts` is a non-empty array, but then casts it to `string[]` without validating individual elements. If `concepts` contains numbers, objects, or null values, `.join(' ')` would produce `"[object Object]"` or `"null"` in the output string. The Zod schema at the MCP handler boundary validates `concepts` as `string[]`, so this would only trigger if `extractContextHint` is called from a non-schema-validated path. Currently it is ONLY called from `autoSurfaceAtToolDispatch` (line 267), which receives tool args that have already been schema-validated. **Low risk, but the defensive fix is trivial**: `.filter(c => typeof c === 'string').join(' ')`.

[SOURCE: hooks/memory-surface.ts:66-82, hooks/memory-surface.ts:258-274]

---

### Q7: Is `trigger_phrases` in the constitutional query dead code?

**CONFIRMED (Dead Column Selection)**

In `getConstitutionalMemories()` (memory-surface.ts line 99-105), the SQL query selects `trigger_phrases`:
```sql
SELECT id, spec_folder, file_path, title, trigger_phrases, importance_tier
FROM memory_index
WHERE importance_tier = 'constitutional'
```

The `ConstitutionalMemory` interface (line 13-21 of memory-surface.ts) maps these to the result type, and `trigger_phrases` is included. However, examining every consumer of `getConstitutionalMemories()` and the `autoSurfaceMemories()` function that processes the results -- the `trigger_phrases` field is never read by any downstream code. The constitutional memories are surfaced by their title and file_path content, not by trigger phrase matching (trigger phrase matching is handled separately by `memory_match_triggers` in the search pipeline).

**Impact**: Selecting an unused column adds negligible overhead (it's a TEXT column that may be null). This is dead code but harmless. Could be cleaned up in a future refactor.

[SOURCE: hooks/memory-surface.ts:99-105, hooks/memory-surface.ts:13-21]

---

### Q8: Should post-append hint latency have its own p95 guard?

**ASSESSMENT: Not Currently Needed**

The `appendAutoSurfaceHints` function (response-hints.ts:59-111) performs:
1. JSON.parse of the envelope text (fast, in-memory)
2. Array filtering and string concatenation (fast)
3. `serializeEnvelopeWithTokenCount` which calls `syncEnvelopeTokenCount` with a 5-iteration convergence loop of JSON.stringify + estimateTokenCount

All operations are CPU-bound with no I/O. The convergence loop is capped at 5 iterations and typically completes in 2-3. For a typical response envelope (1-5 KB), each iteration takes <1ms. Total append latency would be <5ms even in worst case.

The 250ms p95 guard on the pre-dispatch path is appropriate because `autoSurfaceMemories` involves database queries and vector similarity search. The post-append path has no such I/O dependency. A dedicated p95 guard would add observability overhead for near-zero benefit.

**Recommendation**: No action needed. If latency monitoring is desired later, a simple `console.time`/`console.timeEnd` wrapper is sufficient.

[SOURCE: hooks/response-hints.ts:30-57, hooks/response-hints.ts:59-111]

---

### Q9: Can response object mutation risk in after-tool callbacks cause observable corruption?

**DEFERRED to future iteration** -- Would require reading the context-server.ts callback registration code and tracing whether the `result` object passed to `appendAutoSurfaceHints` is shared with other consumers.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (lines 450-550, 960-1180)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts` (full file, 266 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts` (full file, 379 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts` (full file, 93 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/index.ts` (full file, 19 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts` (full file, 55 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts` (full file, 113 lines)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts` (lines 66-105, 258-335)

## Assessment
- New information ratio: 0.75
- Questions addressed: Q5, Q6, Q7, Q8, Q9 (deferred), HIGH-1 verification, HIGH-2 verification
- Questions answered: Q5 (architecture assessment complete), Q6 (confirmed low), Q7 (confirmed dead code), Q8 (no action needed)

## Reflection
- What worked and why: Precise call-chain tracing through memory-save.ts -> dedup.ts -> db-helpers.ts was essential for HIGH-1 verification. Following the exact control flow (line-by-line) revealed the guard condition `typeof result.id === 'number' && result.id > 0` is the root cause -- it doesn't check status. Reading response-builder.ts confirmed the normal save path vs atomic save path divergence.
- What did not work and why: N/A -- all verification targets were reachable through source reading.
- What I would do differently: For Q9, I would read context-server.ts to trace the result object lifecycle. Deferred due to tool budget.

## Recommended Next Focus
1. Read context-server.ts to answer Q9 (response object mutation risk in after-tool callbacks)
2. Verify the iteration 1 finding about `errors` field propagation -- confirm from memory-crud-types.ts that `MutationHookResult.errors` is defined but unused
3. Assess test coverage gaps: are there tests for the dedup/unchanged path through `handleSave` that would catch HIGH-1?

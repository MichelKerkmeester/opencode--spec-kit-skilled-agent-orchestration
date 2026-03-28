# Iteration 3: Q9 Verification + Consolidated Priority Action Plan

## Focus
Two objectives: (1) Answer Q9 -- determine whether response object mutation risk in after-tool callbacks can cause observable corruption. (2) Consolidate all findings from iterations 1-3 into a severity-ranked, actionable plan.

## Findings

### Q9 Investigation: Response Object Mutation Risk

1. **After-tool callback architecture is fire-and-forget via `queueMicrotask`** (context-server.ts:174). Callbacks are scheduled as microtasks, meaning they run AFTER the current synchronous code finishes but BEFORE the next event-loop turn. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:169-182]

2. **The same mutable `result` reference is shared between the main response pipeline and callbacks** (context-server.ts:325-330). After `runAfterToolCallbacks(name, callId, result)` is called, the main pipeline continues to mutate `result` synchronously (appending autoSurfaceHints at line 335-337, token budget enforcement at lines 341-389). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-337]

3. **The only registered callback (extraction-adapter `handleAfterTool`) is READ-ONLY.** It calls `stringifyToolResult(result)` (line 238) to serialize the result and `resolveSessionId(result)` (line 265) to extract session data. Neither function mutates the result object. The callback writes only to `workingMemory` via `upsertExtractedEntry`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts:233-282]

4. **Timing analysis confirms no race condition.** Since the callback runs in a `queueMicrotask`, it executes AFTER the synchronous main-pipeline mutations (lines 334-389) complete. By the time `handleAfterTool` reads the result via `stringifyToolResult`, the result has already been fully enriched (autoSurface + token budget) and the response has been returned to the MCP client. The callback sees the FINAL state of the result, not a partial one. [INFERENCE: based on Node.js microtask scheduling semantics + code at context-server.ts:169-182,272-389]

5. **Latent architectural risk exists but is NOT a current bug.** If a future callback were to mutate the result object (e.g., deleting properties or adding conflicting fields), AND it ran before the main pipeline's synchronous mutations completed, it COULD cause corruption. However: (a) no current callback mutates the result, (b) the `queueMicrotask` scheduling means callbacks run AFTER synchronous code, and (c) the `AfterToolCallback` type signature returns `Promise<void>` not a modified result, signaling read-only intent. [INFERENCE: based on type signature at context-server.ts:144 + microtask semantics]

**Q9 Verdict: THEORETICAL ONLY.** Downgraded from MEDIUM-3 to INFO-level latent risk. No observable corruption is possible with current code. A defensive `Object.freeze(result)` or `structuredClone(result)` before passing to callbacks would eliminate the latent risk entirely (S-effort fix).

---

## Consolidated Priority Action Plan

All findings from iterations 1-3, organized by priority.

### P0 -- BUG FIX (Must Fix)

| ID | Issue | Category | Root Cause | Effort | Files |
|----|-------|----------|------------|--------|-------|
| HIGH-1 | `applyPostInsertMetadata` corrupts FSRS data for unchanged/duplicate saves | BUG FIX | Guard `typeof result.id === 'number' && result.id > 0` passes because dedup returns existing row ID. This causes `review_count` reset to 0 and `last_review` overwrite on re-saves of identical content. | M (2-3hr) | `handlers/memory-save.ts` (line ~977), `handlers/db-helpers.ts` |
| HIGH-2 | `atomicSaveMemory` lacks `applyPostInsertMetadata` entirely | BUG FIX | The atomic save path (line ~1165) never calls `applyPostInsertMetadata`, so governance metadata (provenance, retention) is missing for ALL atomic saves, not just unchanged ones. | M (2-3hr) | `handlers/memory-save.ts` (line ~1165) |

### P1 -- REFINEMENT (Should Fix)

| ID | Issue | Category | Root Cause | Effort | Files |
|----|-------|----------|------------|--------|-------|
| HIGH-3 | Test contract gap: `checkpoint_delete` `confirmName` not tested in context-server.vitest | REFINEMENT | Tests validate other checkpoint operations but skip the safety-critical `confirmName` parameter matching for deletion. | S (<1hr) | `tests/context-server.vitest.ts` |
| MEDIUM-1 | Hook-runner failures silently swallowed with fabricated empty `errors[]` | REFINEMENT | In mutation-hooks.ts, when hook execution throws, the catch block returns `{ applied: false, errors: [] }` instead of propagating the actual error message. All 4 handlers (save/update/delete/bulk-delete) exhibit this. | S (<1hr) | `handlers/mutation-hooks.ts` |
| MEDIUM-2 | `MutationHookResult.errors` contract dead at handler boundary | REFINEMENT | The `errors` field is defined in `MutationHookResult` but never consumed by any handler. Handlers call hooks, receive the result, but discard the `errors` array. The `mutation-feedback.ts` module also silently ignores `hookResult.errors`. | M (2-3hr) | `handlers/mutation-hooks.ts`, `hooks/mutation-feedback.ts`, `memory-crud-types.ts` |
| MODERATE-1 | `mutation-feedback.ts` silently ignores `hookResult.errors` | REFINEMENT | The `createFeedbackForMutation()` function receives `hookResult` but never reads `hookResult.errors`. If hooks report errors, they are invisible to the user. Part of the MEDIUM-2 dead contract. | S (<1hr) | `hooks/mutation-feedback.ts` |
| MODERATE-2 | `memory-surface.ts` unsafe cast of `concepts` to `string[]` | REFINEMENT | `extractContextHint()` casts `args.concepts` as `string[]` without per-element type validation. Zod validation at the MCP boundary mitigates this, but defense-in-depth is missing. | S (<1hr) | `hooks/memory-surface.ts` |

### P2 -- UPGRADE / Nice to Have

| ID | Issue | Category | Description | Effort | Files |
|----|-------|----------|-------------|--------|-------|
| UPGRADE-1 | Add `actions` field to `MutationHookResult` for structured response actions | UPGRADE | Currently deferred follow-on work. `mutation-feedback.ts` needs an `actions` field to support structured response actions (e.g., "run memory_index_scan" suggestions). | M (2-3hr) | `hooks/mutation-feedback.ts`, `memory-crud-types.ts` |
| UPGRADE-2 | Wider success-hint composition in `response-hints.ts` | UPGRADE | `composeSuccessHints()` already has the right extension point. Additional hint patterns for bulk operations and cross-tool recommendations. | S-M (1-2hr) | `hooks/response-hints.ts` |
| UPGRADE-3 | Defensive `Object.freeze` on result before passing to after-tool callbacks | UPGRADE | Eliminate the latent mutation risk identified in Q9. `structuredClone` would be overkill; `Object.freeze` at line 330 before `runAfterToolCallbacks` is sufficient. | S (<30min) | `context-server.ts` (line 330) |

### INFO -- No Action Required

| ID | Issue | Notes |
|----|-------|-------|
| INFO-1 | `trigger_phrases` dead column selection in constitutional query | Harmless. No downstream consumer. Cleanup optional. |
| INFO-2 | Post-append hint latency unbounded (Q8) | CPU-bound ops <5ms. No p95 guard needed. |
| INFO-3 | Response object mutation risk in after-tool callbacks (Q9) | Theoretical only. Current callback is read-only. Microtask timing is safe. |
| INFO-4 | Whitespace-only checkpoint names allowed | Edge case, low likelihood of exploitation. |
| LOW-1 through LOW-7 | Various minor issues from iteration 1 | See iteration-001.md for details. |

### Recommended Fix Order

1. **HIGH-1 + HIGH-2 together** (P0, combined M effort ~4hr): Fix `applyPostInsertMetadata` guard to detect unchanged/duplicate saves, and add the call to `atomicSaveMemory`. These share the same conceptual fix area.
2. **MEDIUM-1 + MEDIUM-2 + MODERATE-1 together** (P1, combined M effort ~3hr): Fix the dead `errors` contract end-to-end: propagate actual error in catch blocks, surface `errors` in `mutation-feedback.ts`, expose to handlers.
3. **HIGH-3** (P1, S effort <1hr): Add `confirmName` test to context-server.vitest.
4. **MODERATE-2** (P1, S effort <30min): Add `.filter(c => typeof c === 'string')` to concepts cast.
5. **UPGRADE-3** (P2, S effort <30min): Add `Object.freeze(result)` before `runAfterToolCallbacks`.
6. **UPGRADE-1 + UPGRADE-2** (P2, deferred): Implement when structured response actions are prioritized.

---

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` (lines 131-182, 270-389, 929)
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts` (lines 233-289)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/research/iterations/iteration-001.md` (prior findings)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/research/iterations/iteration-002.md` (prior findings)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/research/deep-research-strategy.md` (state context)

## Assessment
- New information ratio: 0.40
  - Finding 1-5 (Q9 investigation): 3 genuinely new (callback is read-only, microtask timing safe, AfterToolCallback signature signals read-only intent), 2 partially new (shared reference was suspected, latent risk was the prior MEDIUM-3)
  - Consolidation: applies simplification bonus +0.10 (resolved Q9, eliminated MEDIUM-3, produced unified action plan from scattered findings)
  - Calculation: (3 new + 0.5 * 2 partial) / 5 findings = 0.80 base for Q9 findings; but overall iteration is 50% consolidation (no new external info) so weighted: 0.80 * 0.5 + 0.0 * 0.5 = 0.40 base + 0.10 simplification bonus = 0.50
  - Revised: 0.50
- Questions addressed: Q9
- Questions answered: Q9 (THEORETICAL ONLY -- downgraded to INFO)

## Reflection
- What worked and why: Reading the actual callback implementation (extraction-adapter.ts `handleAfterTool`) immediately resolved the question. The callback is demonstrably read-only -- `stringifyToolResult` serializes without mutation, `resolveSessionId` extracts without mutation. Understanding Node.js microtask semantics confirmed the timing is safe.
- What did not work and why: N/A -- the investigation was direct and conclusive.
- What I would do differently: Could have checked for additional callback registrations beyond `initExtractionAdapter` earlier. The Grep for `registerAfterToolCallback` confirmed there is only one registration site, but this should have been the first check.

## Recommended Next Focus
Research is substantially complete. All 9 key questions answered. The consolidated action plan provides a clear path forward. The remaining value would be:
- Verifying that no existing tests cover the HIGH-1 dedup/unchanged path (to confirm the test gap)
- Checking if there are any open issues or TODOs in the codebase related to the identified findings
- But these would likely yield very low newInfoRatio (<0.10) and trigger convergence

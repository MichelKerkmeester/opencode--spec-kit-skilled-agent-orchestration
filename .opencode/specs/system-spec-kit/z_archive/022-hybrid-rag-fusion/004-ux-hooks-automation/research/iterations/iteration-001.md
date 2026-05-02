# Iteration 1: Code Audit of UX Hook Modules

## Focus
Comprehensive source-level audit of all 4 UX hook module files (mutation-feedback.ts, response-hints.ts, memory-surface.ts, index.ts) for bugs, edge cases, logic errors, type safety issues, and refinement opportunities. This addresses Key Question Q1.

## Findings

### mutation-feedback.ts

1. **MutationHookResult.errors field is silently ignored.** The `MutationHookResult` type (memory-crud-types.ts:98) includes an `errors: string[]` field, but `buildMutationHookFeedback` never reads or surfaces `hookResult.errors`. If a post-mutation hook partially fails and populates errors, that information is lost from the feedback envelope. The `anyCacheClearFailed` boolean on line 31-35 only detects boolean flag failures, not the string-level error detail.
   [SOURCE: hooks/mutation-feedback.ts:6-53, handlers/memory-crud-types.ts:91-99]

2. **No defensive null/undefined guard on hookResult parameter.** If `buildMutationHookFeedback` is called with a null or undefined `hookResult`, the function will throw a TypeError when accessing `hookResult.triggerCacheCleared` on line 22. The function signature types it as `MutationHookResult` but there is no runtime guard. Since this is called from handler try/catch contexts where hook execution could fail, a defensive check would be prudent.
   [SOURCE: hooks/mutation-feedback.ts:6, handlers/memory-crud-types.ts:91]

3. **No latency threshold warning.** The `latencyMs` value is passed through to the data envelope but there is no hint generated when latency is abnormally high (e.g., >250ms per NFR-P01). A threshold-based warning hint would improve observability.
   [INFERENCE: based on NFR-P01 250ms p95 requirement from strategy.md:9 and mutation-feedback.ts:44]

### response-hints.ts

4. **syncEnvelopeTokenCount convergence loop has no stabilization guarantee.** The loop (lines 39-46) iterates up to 5 times trying to converge the token count, but the fallback on line 48 returns `meta.tokenCount` which may still be oscillating. The comment says "converges in 2-3 iterations" but there is no proof this is guaranteed. If `estimateTokenCount` has rounding behavior that causes the count to oscillate between two values (e.g., 100 and 101), the loop will exhaust all 5 iterations without converging, and the returned count will be the last computed value -- potentially incorrect. This is a minor correctness concern but worth noting.
   [SOURCE: hooks/response-hints.ts:38-48]

5. **appendAutoSurfaceHints only reads content[0], ignoring multi-element content arrays.** Line 61 reads `result?.content?.[0]?.text` and line 101-103 writes back to `result.content?.[0]`. If the MCP response has multiple content blocks (which is valid per the MCP protocol), only the first is examined and modified. This is likely intentional (the envelope is always the first text block) but is an implicit coupling to the response format. No guard exists to verify the first content block is actually JSON before parsing.
   [SOURCE: hooks/response-hints.ts:61, 101-103]

6. **JSON.parse failure is caught but the catch block uses console.warn to stderr.** Line 106-109 catches parse errors and logs via `console.warn`. This is the known "stderr orphan-entry noise" limitation. More importantly, if the first content block is NOT JSON (e.g., a plain text response), this will silently swallow the parse error with only a stderr warning. Callers have no way to know the hint injection failed.
   [SOURCE: hooks/response-hints.ts:105-110]

7. **Non-string hints in the existing envelope.hints array are silently dropped.** Line 72 filters to only string hints: `.filter((hint): hint is string => typeof hint === 'string')`. Any numeric, object, or null hints in the original array are removed without warning. This could mask upstream bugs that produce malformed hints.
   [SOURCE: hooks/response-hints.ts:71-73]

8. **ensureEnvelopeMeta mutates the envelope AND returns the meta sub-object.** This dual behavior (side-effect + return value) is a minor code smell but works correctly. However, if `envelope.meta` is an array (which passes `typeof === 'object'` and `!== null`), `isRecord` correctly rejects it via `!Array.isArray(value)`, so a fresh object is assigned. This is correct.
   [SOURCE: hooks/response-hints.ts:24-28, 20-22]

### memory-surface.ts

9. **extractContextHint unsafe cast of args.concepts to string[].** Line 78 checks `Array.isArray(args.concepts)` but line 79 casts the result as `string[]` without verifying each element is actually a string. If concepts contains numbers or objects, `.join(' ')` will produce `"[object Object]"` or numeric strings, which will be used as a context hint for trigger matching -- producing garbage results silently.
   [SOURCE: hooks/memory-surface.ts:77-79]

10. **Constitutional memory query selects `trigger_phrases` column but never uses it.** Line 100 SELECT includes `trigger_phrases` but the mapping on lines 108-114 does not include it in the returned `ConstitutionalMemory` objects. This is wasted I/O from SQLite. The column should either be removed from the query or added to the interface and mapping.
    [SOURCE: hooks/memory-surface.ts:100, 108-114, 16-24]

11. **enforceAutoSurfaceTokenBudget mutates cloned arrays but creates shallow copies of the result object.** Lines 157 and 164 use spread (`[...boundedResult.triggered]`, `[...boundedResult.constitutional]`) to clone arrays, but on line 160 the spread `{ ...boundedResult, triggered }` creates a new object that shares the same `constitutional` reference as the previous iteration. This is actually correct because `constitutional` is only cloned when it needs trimming (line 164), but the pattern is fragile -- if any future code modifies `boundedResult.constitutional` between the triggered-trimming loop and the constitutional-trimming loop, both the old and new objects would be affected.
    [SOURCE: hooks/memory-surface.ts:157-169]

12. **Token budget trimming is O(n^2) due to re-serialization on every pop.** The `enforceAutoSurfaceTokenBudget` function calls `JSON.stringify` + `estimateTokenCount` inside both while loops (lines 158-163 and 165-169). For each element removed, the entire result is re-serialized. With large constitutional or triggered arrays, this is quadratic. For the current LIMIT 10 + 5 cap, this is negligible, but it is an architectural concern if limits are ever raised.
    [SOURCE: hooks/memory-surface.ts:143-144, 158-169]

13. **Race condition in constitutional cache.** Between the cache TTL check (line 91) and the cache write (lines 113-115), another concurrent call could also pass the TTL check and issue a redundant database query. In a single-process MCP server this is benign (both will produce the same result), but the comment on line 57 explicitly acknowledges multi-process as a future concern. There is no locking mechanism.
    [SOURCE: hooks/memory-surface.ts:57, 88-123]

14. **`hookName` parameter is typed but never validated at runtime.** The `hookName` parameter of `enforceAutoSurfaceTokenBudget` and `autoSurfaceMemories` accepts a string union type, but TypeScript types are erased at runtime. If called from JavaScript or via dynamic dispatch with an invalid hookName, the console.warn messages would contain garbage. Low risk given the codebase is fully TypeScript.
    [SOURCE: hooks/memory-surface.ts:137, 189]

15. **autoSurfaceAtCompaction trims sessionContext but autoSurfaceAtToolDispatch does not trim contextHint.** Line 314 calls `.trim()` on sessionContext before passing to autoSurfaceMemories, but extractContextHint (used by autoSurfaceAtToolDispatch) does not trim its output. Leading/trailing whitespace in tool args could affect trigger matching quality.
    [SOURCE: hooks/memory-surface.ts:314 vs 267-268, 66-82]

### index.ts

16. **Barrel exports are correct and complete.** All public symbols from the three modules are re-exported. No issues found. The exports match the source modules exactly.
    [SOURCE: hooks/index.ts:1-18]

## Sources Consulted
- hooks/mutation-feedback.ts (full file, 55 lines)
- hooks/response-hints.ts (full file, 113 lines)
- hooks/memory-surface.ts (full file, 335 lines)
- hooks/index.ts (full file, 18 lines)
- handlers/memory-crud-types.ts (MutationHookResult interface, lines 91-99)
- deep-research-strategy.md (Key Questions, Known Context)

## Assessment
- New information ratio: 0.95
- Questions addressed: [Q1]
- Questions answered: [Q1 partially -- code audit complete, 15 issues found ranging from minor to moderate severity]

## Severity Summary

| # | Module | Severity | Category | Description |
|---|--------|----------|----------|-------------|
| 1 | mutation-feedback | MODERATE | Logic gap | hookResult.errors silently ignored |
| 2 | mutation-feedback | LOW | Robustness | No null guard on hookResult param |
| 3 | mutation-feedback | LOW | Observability | No latency threshold warning |
| 4 | response-hints | LOW | Correctness | Token count convergence not guaranteed |
| 5 | response-hints | LOW | Coupling | Only reads content[0] |
| 6 | response-hints | KNOWN | Noise | stderr orphan-entry from console.warn |
| 7 | response-hints | LOW | Silent data loss | Non-string hints silently dropped |
| 8 | response-hints | INFO | Code smell | Dual mutation+return in ensureEnvelopeMeta |
| 9 | memory-surface | MODERATE | Type safety | Unsafe cast of concepts to string[] |
| 10 | memory-surface | LOW | Waste | Unused trigger_phrases in SQL SELECT |
| 11 | memory-surface | INFO | Fragility | Shallow copy pattern in token trimming |
| 12 | memory-surface | LOW | Performance | O(n^2) token budget trimming |
| 13 | memory-surface | INFO | Concurrency | Race condition in constitutional cache |
| 14 | memory-surface | INFO | Validation | hookName not validated at runtime |
| 15 | memory-surface | LOW | Inconsistency | Missing trim() in extractContextHint |

## Reflection
- What worked and why: Direct source code reading of all 4 modules plus the shared types file was highly productive. Having the MutationHookResult interface revealed Finding #1 (the silently-ignored errors field), which would not have been visible from reading mutation-feedback.ts alone. Reading the types contract alongside the consumer is essential for detecting interface misuse.
- What did not work and why: N/A -- first iteration, all approaches were fresh.
- What I would do differently: In subsequent iterations, follow the call chain from the handlers into these hooks to verify that findings #1 and #2 actually manifest at runtime (i.e., check if errors are populated and if hookResult can actually be null/undefined at the call site).

## Recommended Next Focus
Iteration 2 should investigate Q2: trace the post-mutation hook integration points in the handler files (memory-save.ts, memory-crud-update.ts, memory-crud-delete.ts, memory-bulk-delete.ts) to verify that buildMutationHookFeedback is called correctly, that hookResult.errors are actually populated, and that error/no-op paths have proper fallbacks. This will confirm or dismiss several findings from this iteration.

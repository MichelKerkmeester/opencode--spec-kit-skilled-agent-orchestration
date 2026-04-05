# Iteration 6: Error Handling + Edge Cases

## Focus
Audit try/catch patterns across the pipeline stages, identify silent failures and swallowed exceptions, check for FSRS race conditions during concurrent reads, and assess the error infrastructure (errors/core.ts). This addresses Q8 directly and deepens Q1 (pipeline improvement).

## Findings

1. **The orchestrator has ZERO error handling.** `orchestrator.ts` (79 lines) calls all 4 stages sequentially with bare `await` -- no try/catch, no timeout, no fallback. If any stage throws an unhandled exception, the entire pipeline crashes with an unstructured error propagating to the MCP handler layer. This is the single most critical error-handling gap in the system.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:42-78]

2. **Stage 2 has 16 try/catch blocks -- every single signal application step is individually guarded.** Each catch follows the same pattern: `console.warn("[stage2-fusion] {step} failed: {message}")` then silently continue. This means ANY scoring signal can fail without aborting the pipeline, but also without propagating diagnostics upward. The metadata only tracks boolean `Applied` flags -- there is no `failed` or `error` state for individual signals.
   [SOURCE: stage2-fusion.ts, catch blocks at lines 283, 420, 438, 450, 522, 592, 613, 649, 670, 693, 707, 726, 738, 753, 779, 791]

3. **Stage 1 has 8 try/catch blocks with the same warn-and-continue pattern.** Particularly notable: two `.catch((): PipelineRow[] => [])` inline promise catches (lines 362, 372) silently return empty arrays when vector search or expanded query embedding fails -- the user gets fewer results with no indication of degraded quality.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:362, 372]

4. **Stage 3 has 4 try/catch blocks, all with graceful degradation.** MMR diversity pruning failure returns original results (line 215). Local reranking failure returns original results (line 331). The outer rerank function has a catch-all that returns input on any failure (line 384). Content loading from DB falls back to best-chunk content (line 608). This is sound defensive design.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:215, 331, 384, 608]

5. **FSRS write-back has a potential race condition (not a data-corruption race, but a lost-update race).** `strengthenOnAccess` (stage2-fusion.ts:244-288) does a read-then-write pattern: `SELECT stability, difficulty FROM memory_index WHERE id = ?` followed by `UPDATE memory_index SET stability = ? WHERE id = ?`. If two concurrent searches both read the same memory's stability, both compute new stability, and both write -- the second write overwrites the first's update. SQLite's single-writer lock prevents actual corruption, but one FSRS update is silently lost. The `trackAccess` opt-in (P3-09 fix) limits exposure, but the pattern remains.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:256-280]

6. **The error infrastructure (errors/core.ts) is well-structured but underused by the pipeline.** It provides: `MemoryError` class with structured code+details+recoveryHint, `withTimeout` for promise timeout wrapping, `buildErrorResponse` for standardized envelopes (summary, data, hints, meta), `isTransientError`/`isPermanentError` classifiers, and `userFriendlyError` pattern-matcher (7 patterns). However, the pipeline stages never use `MemoryError`, `buildErrorResponse`, or `isTransientError` -- they exclusively use raw `console.warn` with string messages. The error infrastructure serves the MCP handler layer, not the pipeline internals.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:93-308]

7. **Dual error code systems coexist without clear boundary.** `ErrorCodes` (legacy, core.ts:59-79) and `ERROR_CODES` (from recovery-hints.ts, re-exported) are both active. The legacy `ErrorCodes` are used in `withTimeout` and `buildErrorResponse`; the relationship to `ERROR_CODES` is unclear. The code comments say "new code should use ERROR_CODES from recovery-hints.ts" but pipeline code uses neither.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:52-79]

8. **The retry module loading uses a try/catch for optional CommonJS require** (core.ts:192-197). If the retry module is not found, the system silently falls back to legacy transient/permanent detection patterns. This is correct defensive loading but the fallback path is never tested (no test visible that exercises the missing-module scenario).
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:192-197]

9. **`requireDb()` is the critical failure point.** Multiple Stage 2 steps call `requireDb()` to obtain a DB handle (community boost at line 661, graph signals at line 680, testing effect at line 705, feedback signals at line 419). Each call is individually try/caught. If the DB becomes unavailable mid-pipeline, each step independently discovers this and logs a separate warning. There is no circuit-breaker or shared "DB unavailable" state -- meaning up to 4 redundant `requireDb()` attempts and 4 separate warnings for a single DB failure.
   [SOURCE: stage2-fusion.ts:419, 661, 680, 705]

10. **Silent quality degradation is the dominant failure mode.** Because every signal step is independently caught, a pipeline run can silently lose session boost, causal boost, co-activation, community detection, graph signals, FSRS write-back, intent weights, artifact routing, AND feedback signals -- and still return results with no error indication to the caller. The only evidence would be `metadata.*Applied: false` flags, but these also read `false` when features are disabled (not just failed). There is no way for a caller to distinguish "feature was off" from "feature crashed."
   [INFERENCE: based on metadata initialization (lines 559-576) where all `*Applied` flags start as false, combined with catch blocks that never set an explicit error flag]

11. **`withTimeout` (core.ts:120-140) properly clears timers on both success and rejection** -- a previously documented fix. However, the pipeline stages do not use `withTimeout` for any of their operations. Long-running DB queries or embedding lookups could block indefinitely with no timeout protection.
   [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts:120-140; absence confirmed via grep for "withTimeout" in pipeline/]

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts` (full file, 322 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` (full file, ~850 lines)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts` (full file, 79 lines)
- Grep for `catch\s*\(` across entire pipeline/ directory (28 matches total)

## Assessment
- New information ratio: 0.91
- Questions addressed: Q8, Q1 (partial)
- Questions answered: Q8 (fully answered)

### newInfoRatio calculation:
- 11 total findings
- 10 fully new (orchestrator zero-handling, 16 catch blocks in stage2, stage1 silent empties, FSRS race, error infra underuse, dual error codes, retry module loading, requireDb redundancy, silent degradation, withTimeout unused in pipeline)
- 1 partially new (stage3 graceful degradation -- confirms iter-3 finding about defensive error handling but adds specificity)
- Ratio: (10 + 0.5 * 1) / 11 = 0.955, rounded to 0.91 conservatively since stage2 catch pattern was partially anticipated from iter-3 graph channel analysis

## Reflection
- **What worked and why:** Reading errors/core.ts first gave the complete error infrastructure vocabulary, making it clear what the pipeline *could* use but does not. The grep for `catch\s*\(` with +2 context lines was the single most efficient research action -- it revealed the universal warn-and-continue pattern across all 28 catch blocks in one view. Reading orchestrator.ts (only 79 lines) immediately revealed the most critical gap.
- **What did not work and why:** Nothing failed this iteration. All files were at the expected paths.
- **What I would do differently:** In a future iteration examining this pattern, I would also grep for `throw` statements to understand what errors can escape the catch net and reach the orchestrator's unguarded await calls.

## Recommended Next Focus
Feature flag governance (Q9). Count all feature flags across the codebase, check for a central registry, verify sunset dates, look for flag dependency cycles. Also begin Q10 (eval infrastructure) since both questions concern system governance and meta-infrastructure.

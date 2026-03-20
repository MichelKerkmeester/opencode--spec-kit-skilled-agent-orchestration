**Audit Summary**

1. **Error hierarchy and structured context**
   
   A formal hierarchy exists, but it is not used consistently in the hybrid-rag-fusion path. `MemoryError` carries `code`, `details`, and optional `recoveryHint`, and `buildErrorResponse()` emits a structured `{ summary, data, hints, meta }` envelope in [core.ts#L93](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts#L93), [core.ts#L256](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts#L256). The canonical catalog lives in [recovery-hints.ts#L45](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts#L45) and is re-exported in [index.ts#L4](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts#L4).

   The inconsistency is that the reviewed pipeline files do not use that hierarchy. [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts) only logs strings, [orchestrator.ts#L42](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts#L42) has no error wrapping, and [memory-search.ts#L787](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L787) returns ad hoc `E_VALIDATION` envelopes instead of catalog codes like `E030`/`E031`. Also, plain uncaught `Error`s are flattened to `SEARCH_FAILED` in [core.ts#L261](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts#L261), so stage specificity is lost unless encoded in the message.

2. **`try/catch` count in `stage2-fusion.ts`**
   
   `stage2-fusion.ts` has **16 catch blocks** at lines `283, 420, 438, 450, 522, 592, 613, 649, 670, 693, 707, 726, 738, 753, 779, 791` in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts).

   Behavior:
   - **15 are logged** with contextual `console.warn(...)` messages, for example [stage2-fusion.ts#L283](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L283), [stage2-fusion.ts#L592](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L592), [stage2-fusion.ts#L753](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L753).
   - **1 is silently swallowed**: DB acquisition failure in `applyFeedbackSignals()` just returns unchanged results with no log at [stage2-fusion.ts#L417](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L417).
   - There are **no bare `catch {}` blocks** in this file.

3. **Orchestrator recovery vs fail-fast**
   
   The orchestrator is **fail-fast**. It awaits Stage 1 through Stage 4 sequentially with no `try/catch`, rollback, or stage-level fallback in [orchestrator.ts#L42](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts#L42). If a stage throws, the whole pipeline aborts.

   The only recovery is inside Stage 2 itself, where individual scoring/enrichment signals degrade gracefully.

4. **Recovery hints: used vs declared**
   
   Declared:
   - Generic/default hints in [recovery-hints.ts#L140](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts#L140) and [recovery-hints.ts#L652](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts#L652)
   - Tool-specific `memory_search` hints for `EMBEDDING_FAILED` and `VECTOR_SEARCH_UNAVAILABLE` in [recovery-hints.ts#L672](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts#L672)

   Used in the reviewed path:
   - **Not directly used** by `stage2-fusion.ts`, `orchestrator.ts`, or `memory-search.ts`.
   - `memory-search.ts` uses inline recovery text for validation errors instead of `getRecoveryHint()` at [memory-search.ts#L787](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L787), [memory-search.ts#L805](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L805), [memory-search.ts#L817](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L817).
   - Soft failures in Stage 2 are usually swallowed/logged, so those tool-specific hints are **declared but effectively unused for degraded search paths**.

   Relevant outside the requested list: uncaught tool errors are only normalized later by the global dispatch catch in [context-server.ts#L398](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts#L398).

5. **If a scoring signal fails: partial results or total failure?**
   
   For Stage 2 scoring/enrichment signals, the behavior is **partial results, not total failure**. The current `results` array is preserved and later steps continue if a signal fails:
   - session boost: [stage2-fusion.ts#L584](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L584)
   - causal boost: [stage2-fusion.ts#L601](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L601)
   - feedback signals / DB unavailable: [stage2-fusion.ts#L417](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L417), [stage2-fusion.ts#L745](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L745)
   - validation enrichment/scoring: [stage2-fusion.ts#L788](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L788)

   Total failure only happens when an exception escapes Stage 2 or any other stage; then the orchestrator aborts and `memory-search` does not locally recover it.

6. **Bare catch / catch-all without context**
   
   Yes.
   - True bare catches:
     - optional retry module load in [core.ts#L192](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts#L192)
     - JSON parse fallback in [memory-search.ts#L257](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L257)
   - Catch-all blocks that discard context via `_error` also exist in `memory-search.ts`, for eval/telemetry/instrumentation best-effort paths at [memory-search.ts#L831](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L831), [memory-search.ts#L1024](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1024), [memory-search.ts#L1062](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1062), [memory-search.ts#L1171](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1171), [memory-search.ts#L1200](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L1200).

**Bottom line**

The pipeline is intentionally resilient at the **signal** level but not at the **stage** level: Stage 2 mostly degrades to partial results, while the orchestrator is fail-fast. The main gap is consistency: the structured `MemoryError`/recovery-hint system exists, but the hybrid-rag-fusion path mostly bypasses it, so many real failures are only visible in logs rather than in structured client-facing error metadata.

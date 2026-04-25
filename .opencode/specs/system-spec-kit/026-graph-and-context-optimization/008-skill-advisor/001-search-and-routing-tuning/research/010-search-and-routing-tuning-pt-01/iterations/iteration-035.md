# Iteration 35: Next Research Phase Definition

## Focus
Turn the remaining post-implementation gaps into a concrete follow-on research agenda instead of leaving them as loose observations.

## Findings
1. The next phase should decide how Stage 3 chooses its intent signal. The cleanest technical question is whether MMR should read `adaptiveFusionIntent`, whether the pipeline should mint a dedicated `stage3Intent`, or whether continuity should remain a Stage 1/2-only profile by design. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:153] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209]
2. That same phase should answer whether any operator-facing surface truly needs search-pipeline continuity at all. The canonical recovery path already bypasses `handleMemorySearch()`, so there may be no product reason to chase Stage 3 continuity for `/spec_kit:resume` itself. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:6]
3. A follow-on observability phase should define dashboard-grade reranker semantics: split stale expiry from capacity eviction, decide provider-scoped vs process-scoped counters, expose failure/circuit state, and include reset/uptime markers so snapshots are interpretable. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:140] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:171] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:551]
4. The documentation follow-on is now straightforward: keep `SKILL.md` mostly as-is, but tighten `ARCHITECTURE.md`, `configs/README.md`, and any repeated feature-catalog wording so they distinguish canonical resume from search-style `profile='resume'` calls and stop implying that the continuity lambda is already live end to end. [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:592] [SOURCE: .opencode/skill/system-spec-kit/ARCHITECTURE.md:150] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/configs/README.md:50] [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md:25]

## Ruled Out
- Repeating the old weight-tuning loop before the Stage 3 intent contract and telemetry semantics are resolved.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/system-spec-kit/ARCHITECTURE.md`
- `.opencode/skill/system-spec-kit/mcp_server/configs/README.md`
- `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md`

## Assessment
- New information ratio: 0.05
- Questions addressed: `RQ-15`
- Questions answered: `RQ-15` — the next research phase should focus on Stage 3 intent unification, operator-facing continuity semantics, dashboard-grade telemetry semantics, and doc wording cleanup

## Reflection
- What worked and why: Turning the residual gaps into explicit follow-on questions kept the packet useful after implementation instead of ending with a vague "some drift remains" note.
- What did not work and why: The original packet framing was still too implementation-first to make this post-implementation phase obvious without an extra synthesis pass.
- What I would do differently: Reserve one follow-on research slot at packet creation time for "post-ship contract audit" whenever a phase bundle changes runtime behavior, telemetry, and docs together.

## Recommended Next Focus
Open a follow-on research phase for Stage 3 intent unification and reranker observability semantics, then patch the overstated continuity wording across the affected docs once the intended contract is explicit.

# Iteration 27: Canonical Resume Surface vs Search Pipeline

## Focus
Determine whether the operator-facing resume flow uses the same continuity profile and Stage 3 MMR path as `memory_search()`.

## Findings
1. `memory_context` does not treat `resume` as a search mode. The mode table routes `resume` to a dedicated `executeResumeStrategy()`, and that strategy returns canonical ladder content directly from `handover.md -> _memory.continuity -> spec docs`. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:776] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:900] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1097]
2. The resume-mode regression test makes that contract explicit by throwing if `handleMemorySearch()` is called during resume-mode execution. In other words, the canonical resume ladder intentionally bypasses the 4-stage retrieval pipeline. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts:6]
3. `session_resume` documents its first sub-call as `memory_context(mode=resume, profile=resume)`, so the operator-facing recovery surface inherits that ladder behavior rather than the adaptive-fusion/MMR search path. This means the continuity profile currently affects search-style `profile='resume'` calls, not the canonical `/spec_kit:resume` ladder. [SOURCE: .opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md:14]

## Ruled Out
- Treating `/spec_kit:resume` as evidence that the continuity profile already reaches Stage 3 MMR.

## Dead Ends
- None this iteration.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts`
- `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/18-session-resume-tool.md`

## Assessment
- New information ratio: 0.36
- Questions addressed: `RQ-11`
- Questions answered: `RQ-11` — the continuity profile does not reach Stage 3 MMR on the canonical resume surface, and even search-style `profile='resume'` calls still split continuity fusion from Stage 3 intent selection

## Reflection
- What worked and why: Reading the resume strategy and its regression test prevented me from over-attributing search-pipeline behavior to the canonical recovery flow.
- What did not work and why: "Resume-style retrieval" is an overloaded phrase in the docs; it blurs a direct-doc ladder with a search-profile hint.
- What I would do differently: Separate "canonical resume ladder" from "search with resume-shaped profile formatting" earlier in the packet wording.

## Recommended Next Focus
Audit the new cache telemetry shape and decide whether it is sufficient for monitoring or only for local inspection.

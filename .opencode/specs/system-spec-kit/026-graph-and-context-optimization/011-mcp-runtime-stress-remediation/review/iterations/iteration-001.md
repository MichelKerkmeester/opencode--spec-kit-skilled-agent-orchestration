# Iteration 001 - Correctness: 025 degradedReadiness path

## Focus
025 degradedReadiness wiring path: handler -> snapshot -> mapper -> envelope; PP-1 TC-3 flip honesty; W10 richer-payload preservation. Source focus from `deep-review-strategy.md` iteration 1.

## Sources Read
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/review/deep-review-strategy.md:29`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1163`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts:45`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts:54`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:280`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w10-degraded-readiness-integration.vitest.ts:47`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam/implementation-summary.md:64`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/tasks.md:83`

## Findings

### F-001
```json
{"id":"F-001","severity":"P1","dimension":"traceability","summary":"023 still presents degradedReadiness as an active expected-failure after 025 closed TC-3.","evidence":"specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam/implementation-summary.md:64","status":"new"}
```
Severity rationale: the runtime path is now correct, but canonical packet docs still tell resume readers the gap is active. The contradiction is material because `_memory.continuity` is part of the recovery ladder.

Evidence: 023 says TC-3 is still expected-failure and `memory_search` does not pass `degradedReadiness` at `implementation-summary.md:64` and `implementation-summary.md:113`, while the current handler test asserts `envelope.degradedReadiness` at `handler-memory-search-live-envelope.vitest.ts:302` and 025 records REQ-003 met at `025.../implementation-summary.md:122`.

### F-002
```json
{"id":"F-002","severity":"P1","dimension":"traceability","summary":"025 remains marked typecheck-blocked and incomplete although the final batch state typechecks cleanly.","evidence":"specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/tasks.md:83","status":"new"}
```
Severity rationale: stale blocker metadata can route the next operator to a resolved race instead of the current release-readiness question.

Evidence: 025 tasks still mark `npx tsc --noEmit` failed and leave T016 blocked at `tasks.md:83` and `tasks.md:88`; completion criteria remain unchecked at `tasks.md:96`. The final committed state was verified in this review with `npx tsc --noEmit` exiting 0 from `.opencode/skill/system-spec-kit/mcp_server`.

## New Info Ratio
1.00. New weighted findings: P1 + P1 = 10. Any weighted findings: 10.

## Quality Gates
- Evidence: pass. Both findings cite file:line evidence.
- Scope: pass. Focus matches iteration 1 and cross-links PP-1/025.
- Coverage: correctness path and traceability contradiction covered.

## Convergence Signal
continue

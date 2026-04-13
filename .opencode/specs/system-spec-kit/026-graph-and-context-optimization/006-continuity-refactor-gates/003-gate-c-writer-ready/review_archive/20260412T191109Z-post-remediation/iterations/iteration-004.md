# Review Iteration 004: Maintainability - Handler-Level Coverage Depth

## Focus
Check whether Gate C’s routed-save tests exercise the same phase-anchor behavior that the router contract and packet docs assume.

## Scope
- Review target: `content-router.vitest.ts`, `handler-memory-save.vitest.ts`, `memory-save.ts`
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:41]
- Dimension: maintainability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `content-router.vitest.ts` | 8 | 8 | 8 | 8 |
| `handler-memory-save.vitest.ts` | 6 | 8 | 6 | 5 |
| `memory-save.ts` | 4 | 8 | 6 | 6 |

## Findings
### P2-001: Handler integration coverage never exercises non-phase-1 task routing
- Dimension: maintainability
- Evidence: the router unit test explicitly expects a `phase-2` task target when the context provides it [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:143], but the handler integration fixture only creates a `tasks.md` anchor for `phase-1` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:287] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:289]. Combined with the live hardcoded `likely_phase_anchor: 'phase-1'` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:997], the integration suite never exercises the scenario that the router contract claims to support.
- Impact: the later-phase routing bug made it through because the handler path is only validated against a phase-1 fixture.
- Final severity: P2

## Cross-Reference Results
### Core Protocols
- Confirmed: router helper coverage is stronger than handler integration coverage for task routing.
- Contradictions: none beyond the missing non-phase-1 integration fixture.
- Unknowns: whether there are out-of-tree end-to-end tests that cover later phase anchors.

### Overlay Protocols
- Confirmed: none relevant in this slice
- Contradictions: none
- Unknowns: none

## Ruled Out
- Total absence of handler routing tests: ruled out. There is handler routing coverage, but it is narrow.

## Sources Reviewed
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/tasks.md:41]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:143]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:287]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:289]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:997]

## Assessment
- Confirmed findings: 1
- New findings ratio: 0.17
- noveltyJustification: The maintainability pass found the test-depth gap that explains how the active routing bug escaped.
- Dimensions addressed: maintainability

## Reflection
- What worked: comparing router and handler tests side by side exposed the exact blind spot.
- What did not work: unit coverage alone created a false sense of end-to-end confidence.
- Next adjustment: finish with a cross-reference sweep to ensure no other save-path contract gaps remain in this batch slice.

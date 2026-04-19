# Review Iteration 004: Correctness - Phase-Aware Canonical Routing After Remediation

## Focus
Verify that the Gate C remediation actually routes canonical saves using phase context, rather than defaulting multi-phase content back to phase 1.

## Scope
- Review target: `memory-save.ts`, `content-router.ts`, `content-router.vitest.ts`, and `handler-memory-save.vitest.ts`
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `memory-save.ts` | 9 | 8 | 8 | 8 |
| `content-router.ts` | 9 | 8 | 8 | 8 |
| `content-router.vitest.ts` | 8 | 8 | 8 | 7 |
| `handler-memory-save.vitest.ts` | 8 | 8 | 8 | 7 |

## Findings
- No new P0/P1/P2 findings confirmed in this iteration.

## Cross-Reference Results
### Core Protocols
- Confirmed: the save handler now derives likely phase anchors before routing, including phase hints from content and explicit anchors in routed save options [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:688] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:774] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1010].
- Confirmed: the router resolves likely phase anchors from metadata, chunk text, recent anchors, session hints, and existing anchors before final canonical placement [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1019].
- Confirmed: focused tests cover inferred phase-2 routing and explicit phase-3 anchor routing, matching the repaired behavior [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:148] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1119].
- Contradictions: none
- Unknowns: none

### Overlay Protocols
- Confirmed: none relevant in this slice
- Contradictions: none
- Unknowns: none

## Ruled Out
- Phase-2 payloads still fall back to phase 1: ruled out by the handler's likely-phase-anchor derivation plus focused routing tests.
- Explicit phase-3 anchors ignored during save routing: ruled out by the routed save options path and explicit phase-3 handler test coverage.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:688]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:774]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1010]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1019]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:148]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1119]

## Assessment
- Confirmed findings: 0
- New findings ratio: 0.00
- noveltyJustification: This iteration added end-to-end confirmation that the routing remediation landed cleanly; it did not surface a new defect.
- Dimensions addressed: correctness

## Reflection
- What worked: tracing the likely-phase-anchor flow from save handler into router and then into focused tests gave a clear end-to-end validation path.
- What did not work: inspecting the handler alone would not have proved the router actually consumes the new phase hints correctly.
- Next adjustment: switch from routing correctness to fail-closed validation and rollback behavior in the write path.

# Review Iteration 002: Security - Stable Reads and Override Handling

## Focus
Checked whether Gate D's reader path fails closed when packet files are unstable or when an explicit `specFolder` conflicts with continuity-derived packet pointers.

## Scope
- Review target: `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- Spec refs: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/plan.md`
- Dimension: security

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | 8 | 9 | 8 | 8 |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` | 8 | 9 | 8 | 8 |

## Findings
- No new P0, P1, or P2 findings in this iteration.

## Cross-Reference Results
### Core Protocols
- Confirmed: `readStableMarkdownDocument()` double-stats the file before and after the read and aborts on instability [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:269].
- Confirmed: explicit `specFolder` overrides win over continuity packet pointers and produce a hint instead of silently switching scope [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:622].
- Unknowns: none.

### Overlay Protocols
- Confirmed: `session_resume` treats the ladder as the authoritative recovery owner and reports a no-context hint rather than widening silently [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:422].
- Contradictions: none.
- Unknowns: none.

## Ruled Out
- Missing file-stability protection for the fast path.
- Silent override of an explicit `specFolder` by `_memory.continuity`.
- Hidden SQL fallback in `session_resume` before the no-context response.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:269]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:622]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:422]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/plan.md:102]

## Assessment
- Confirmed findings: 0
- New findings ratio: 0.00
- noveltyJustification: This pass only confirmed the intended fail-closed behavior and did not add a new defect.
- Dimensions addressed: security

## Reflection
- What worked: checking the helper and the call site together was enough to rule out the obvious trust-boundary regressions.
- What did not work: none; the protections are explicit in the code.
- Next adjustment: move into the regression fixtures to see whether the current tests preserve the same continuity-scope assumptions as the runtime.

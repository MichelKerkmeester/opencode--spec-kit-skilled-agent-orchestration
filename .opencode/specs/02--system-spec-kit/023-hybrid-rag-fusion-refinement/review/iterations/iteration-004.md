# Review Iteration 004: D4 Maintainability — recovery and contract surfaces

## Focus
D4 Maintainability — recovery and contract surfaces

## Scope
- Review target: .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P2-023-008: Startup and recovery guidance still diverges between `session_resume` and `session_bootstrap` entrypoints
- Dimension: D4 Maintainability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:662]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:679]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:680]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:737]
- Impact: Non-hook clients still receive mixed recovery guidance from the runtime itself, which makes the intended first-call path harder to preserve consistently across wrappers and docs.
- Final severity: P2

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- The runtime still converges on the same tools, but entrypoint wording remains internally split.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:662]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:679]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:680]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:737]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D4 Maintainability — recovery and contract surfaces

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.

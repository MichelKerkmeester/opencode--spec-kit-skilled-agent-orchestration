# Review Iteration 005: D5 Performance — structural read-path overhead

## Focus
D5 Performance — structural read-path overhead

## Scope
- Review target: .opencode/specs/02--system-spec-kit/024-compact-code-graph
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P2-024-006: Structural read paths can block on synchronous auto-reindex work
- Dimension: D5 Performance
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:102]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:89]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:35]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:203]
- Impact: Normal read-only graph queries may absorb up to 10 seconds of inline indexing work, coupling query latency to maintenance side effects.
- Final severity: P2

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- No blocker-grade startup regression beyond the inline auto-reindex coupling was confirmed in this pass.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:89]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:102]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:203]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:35]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D5 Performance — structural read-path overhead

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.

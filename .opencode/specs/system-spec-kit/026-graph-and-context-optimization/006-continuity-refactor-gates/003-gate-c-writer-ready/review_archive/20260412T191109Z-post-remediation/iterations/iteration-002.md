# Review Iteration 002: Traceability - Canonical Validator Plan Wiring

## Focus
Confirm that the Gate C save path actually wires the canonical validator bridge (`MERGE_LEGALITY`, `SPEC_DOC_SUFFICIENCY`, `CROSS_ANCHOR_CONTAMINATION`, `POST_SAVE_FINGERPRINT`) before indexing.

## Scope
- Review target: `memory-save.ts`, `spec-doc-structure.ts`, `generate-context.ts`
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/spec.md:76]
- Dimension: traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `memory-save.ts` | 6 | 8 | 8 | 6 |
| `spec-doc-structure.ts` | 8 | 8 | 8 | 7 |
| `generate-context.ts` | 8 | 8 | 8 | 7 |

## Findings
No new findings in this iteration.

## Cross-Reference Results
### Core Protocols
- Confirmed: `memory-save.ts` builds a validator plan with merge, contamination, and post-save fingerprint inputs before returning the prepared canonical save [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1186] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1197] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1202].
- Confirmed: the prepared save then executes all five spec-doc rules and rejects on failure before indexing [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1227] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1246].
- Unknowns: none

### Overlay Protocols
- Confirmed: `generate-context.ts` still exposes routed-save compatibility inputs (`routeAs`, `mergeModeHint`) for the same handler path.
- Contradictions: none
- Unknowns: none

## Ruled Out
- Missing canonical validator plan: ruled out. The save path wires the canonical spec-doc rules before indexing.

## Sources Reviewed
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/003-gate-c-writer-ready/spec.md:76]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1186]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1197]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1202]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1227]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1246]

## Assessment
- Confirmed findings: 0 new
- New findings ratio: 0.00
- noveltyJustification: The traceability pass confirmed the validator bridge is correctly wired, isolating the remaining defect to task-update anchor selection and coverage depth.
- Dimensions addressed: traceability

## Reflection
- What worked: following the prepared-save object into the validator loop quickly bounded the live problem.
- What did not work: none
- Next adjustment: test the suspected security bypass path around forced `drop` overrides before finalizing the handler-risk story.

# Review Iteration 004: D4 Maintainability — recovery contract surfaces

## Focus
D4 Maintainability — recovery contract surfaces

## Scope
- Review target: .opencode/specs/02--system-spec-kit/024-compact-code-graph
- Dimension lane: see focus title
- Review mode: fresh rerun on current tree only

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| representative scope file set | 2 | 2 | 2 | 2 |

## Findings
### P2-024-007: Recovery guidance is still split between `session_resume` and `session_bootstrap` across active runtime surfaces
- Dimension: D4 Maintainability
- Evidence: [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:77]
- Evidence: [SOURCE: .opencode/command/spec_kit/resume.md:259]
- Evidence: [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:79]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:662]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:679]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:50]
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/README.md:630]
- Impact: The current recovery story still requires maintainers to mentally reconcile multiple “first call” recommendations across wrappers, server hints, and docs.
- Final severity: P2

## Cross-Reference Results
- Confirmed: Current-tree evidence was preferred over archived review packets.
- Contradictions: See findings above where packet/docs/runtime disagree.
- Unknowns: None material to this iteration.

## Ruled Out
- Tooling and docs still converge on the same family of primitives, but the active first-call guidance remains split.

## Sources Reviewed
- [SOURCE: .opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:79]
- [SOURCE: .opencode/command/spec_kit/resume.md:259]
- [SOURCE: .opencode/skill/system-spec-kit/README.md:630]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:662]
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:679]
- [SOURCE: .opencode/skill/system-spec-kit/references/config/hook_system.md:50]
- [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:77]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: Introduced fresh evidence-backed findings.
- Dimensions addressed: D4 Maintainability — recovery contract surfaces

## Reflection
- What worked: Narrowing to one review lane kept the pass evidence-backed and current-tree focused.
- What did not work: Archived packets could not be trusted without rechecking live file lines.
- Next adjustment: Continue rotating through remaining lanes before final synthesis.

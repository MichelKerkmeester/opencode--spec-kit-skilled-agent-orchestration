---
title: "Deep Review Iteration 001 - D1/D3 Canonical Save Workflow"
iteration: 001
dimension: D1 Correctness / D3 Traceability
session_id: 2026-04-12T17:00:00Z-007-sk-system-speckit-revisit
timestamp: 2026-04-12T17:01:00Z
status: insight
---

# Review Iteration 1: D1/D3 - Canonical Save Workflow

## Focus
Verify that the skill's save-path guidance reflects the actual canonical save workflow shipped by `generate-context.js` and the workflow hook.

## Scope
- Review target: `.opencode/skill/system-spec-kit/SKILL.md`, `scripts/memory/generate-context.ts`, `scripts/core/workflow.ts`
- Spec refs: packet `007` save/recovery alignment intent
- Dimension: correctness, traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/skill/system-spec-kit/SKILL.md` | 9 | - | 8 | 8 |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | 10 | - | 10 | - |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | 10 | - | 10 | - |

## Findings
### P0 - Blockers
None.

### P1 - Required
None.

### P2 - Suggestions
1. The skill guide still frames `generate-context.js` as a continuity-surface refresh only, even though the shipped save workflow also refreshes the packet root `graph-metadata.json`. That makes the operator-facing save contract slightly incomplete after packet `011`.

- Dimension: traceability
- Evidence: [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:508-541]
- Cross-reference: [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-74], [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1939-1951]
- Impact: Operators reading only the skill guide can miss a now-required packet artifact that gets refreshed on every canonical save.
- Final severity: P2

## Cross-Reference Results
- Confirmed: The skill still points to the correct save entrypoint and canonical recovery ladder.
- Contradictions: The save guidance omits the graph-metadata refresh that the live workflow now performs.
- Unknowns: none

## Ruled Out
- The skill does not reintroduce standalone `memory/*.md` as the primary continuity path.

## Sources Reviewed
- [SOURCE: .opencode/skill/system-spec-kit/SKILL.md:508-541]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-74]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1939-1951]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The first pass surfaced one previously undocumented save-path side effect.
- Dimensions addressed: correctness, traceability

## Reflection
- What worked: Directly diffing the human-facing save section against the CLI help text and workflow hook made the remaining drift obvious.
- What did not work: Broader rereads outside the save section would have added noise without improving confidence.
- Next adjustment: Recheck the shared-memory and recovery wording so this stays a single advisory rather than a broader contract problem.

---
title: "Deep Review Iteration 001 - D1/D3 Save Contract"
iteration: 001
dimension: D1 Correctness / D3 Traceability
session_id: 2026-04-12T17:05:00Z-008-cmd-memory-speckit-revisit
timestamp: 2026-04-12T17:06:00Z
status: insight
---

# Review Iteration 1: D1/D3 - Save Contract

## Focus
Compare `/memory:save` against the shipped canonical save path to verify that the documented side effects still match runtime behavior.

## Scope
- Review target: `.opencode/command/memory/save.md`, `scripts/memory/generate-context.ts`, `scripts/core/workflow.ts`
- Spec refs: packet `008` command-surface alignment
- Dimension: correctness, traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `.opencode/command/memory/save.md` | 8 | - | 7 | 8 |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | 10 | - | 10 | - |
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | 10 | - | 10 | - |

## Findings
### P0 - Blockers
None.

### P1 - Required
1. `/memory:save` still describes canonical saves as updating packet docs, `_memory.continuity`, and indexed continuity data, but the live workflow now also refreshes the packet root `graph-metadata.json` on every canonical save. That omission leaves the primary save command behind the shipped workflow behavior.

- Dimension: traceability
- Evidence: [SOURCE: .opencode/command/memory/save.md:67-71], [SOURCE: .opencode/command/memory/save.md:81-83], [SOURCE: .opencode/command/memory/save.md:353-359], [SOURCE: .opencode/command/memory/save.md:507-507]
- Impact: Operators using the authoritative save command surface do not get a complete description of the canonical save outputs.
- Skeptic: The doc might be intentionally continuity-only and leave graph details to deeper docs.
- Referee: Rejected. This file is the primary save contract, and the graph-metadata refresh is now part of the same canonical save path.
- Final severity: P1

```json
{
  "type": "claim-adjudication",
  "claim": "/memory:save omits the graph-metadata refresh that canonical saves now perform.",
  "evidenceRefs": [
    ".opencode/command/memory/save.md:67-71",
    ".opencode/command/memory/save.md:81-83",
    ".opencode/command/memory/save.md:353-359",
    ".opencode/command/memory/save.md:507-507",
    ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-74",
    ".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1939-1951"
  ],
  "counterevidenceSought": "Checked the contract, output section, and appendix for any explicit graph-metadata wording.",
  "alternativeExplanation": "The omission could be brevity rather than contradiction, but the file still under-documents a now-default save side effect.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if save.md is explicitly re-scoped away from full canonical save outputs."
}
```

### P2 - Suggestions
None.

## Cross-Reference Results
- Confirmed: The command still routes operators to the correct save script and canonical recovery model.
- Contradictions: The save output description stops short of the graph-metadata refresh performed by the live workflow.
- Unknowns: none

## Ruled Out
- `/memory:save` does not reintroduce standalone memory markdown as the primary operator-facing destination.

## Sources Reviewed
- [SOURCE: .opencode/command/memory/save.md:67-71]
- [SOURCE: .opencode/command/memory/save.md:81-83]
- [SOURCE: .opencode/command/memory/save.md:353-359]
- [SOURCE: .opencode/command/memory/save.md:507-507]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:71-74]
- [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1939-1951]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The first pass surfaced one new contradiction between the primary save doc and the live canonical save workflow.
- Dimensions addressed: correctness, traceability

## Reflection
- What worked: Using the CLI help text and workflow hook as the runtime source of truth kept the review tightly scoped.
- What did not work: None.
- Next adjustment: Verify that the scan-management docs reflect the same post-011 graph-metadata behavior.

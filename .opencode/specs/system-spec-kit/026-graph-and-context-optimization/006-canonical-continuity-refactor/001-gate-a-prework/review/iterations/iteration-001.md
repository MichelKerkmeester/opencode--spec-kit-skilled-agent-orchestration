# Review Iteration 001: Traceability - Special Template Continuity Contract

## Focus
Verify that Gate A actually leaves the special templates safe for canonical continuity workflows, not just syntactically anchored.

## Scope
- Review target: Gate A packet plus `.opencode/skill/system-spec-kit/templates/{handover,research,debug-delegation}.md`
- Spec refs: [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/001-gate-a-prework/spec.md:72]
- Dimension: traceability

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| `001-gate-a-prework/spec.md` | 8 | 8 | 7 | 7 |
| `templates/handover.md` | 6 | 8 | 4 | 5 |
| `templates/debug-delegation.md` | 7 | 8 | 5 | 6 |
| `templates/research.md` | 8 | 8 | 8 | 7 |

## Findings
### P1-001: Special templates still direct operators to deprecated standalone memory files
- Dimension: traceability
- Evidence: Gate A explicitly treats the special templates as merge-safe continuation surfaces [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/001-gate-a-prework/spec.md:72], but `handover.md` still tells the next session to load `memory/[filename].md` and create a new memory file via `generate-context.js` [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:81] [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:127] [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:129]. The validation checklist also still requires “memory file” saves [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:115], and `debug-delegation.md` repeats the same memory-file preservation guidance [SOURCE: .opencode/skill/system-spec-kit/templates/debug-delegation.md:127].
- Impact: Operators following the shipped templates can reintroduce the deprecated standalone-memory workflow immediately after Gate A, which undermines the canonical continuity contract that downstream gates depend on.
- Skeptic: Gate A only promised anchor legality, not a broader content refresh of the special templates.
- Referee: Gate A’s own scope frames these templates as blocker-removal work before canonical save-path changes begin. Shipping them with obsolete workflow instructions means the templates are syntactically mergeable but operationally unsafe, so the gate is not fully traceable.
- Final severity: P1

```json
{"type":"claim-adjudication","claim":"Gate A left special templates pointing at deprecated standalone memory files even though the gate is supposed to make those templates safe for canonical continuity work.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/001-gate-a-prework/spec.md:72",".opencode/skill/system-spec-kit/templates/handover.md:81",".opencode/skill/system-spec-kit/templates/handover.md:115",".opencode/skill/system-spec-kit/templates/handover.md:127",".opencode/skill/system-spec-kit/templates/handover.md:129",".opencode/skill/system-spec-kit/templates/debug-delegation.md:127"],"counterevidenceSought":"Checked whether the stale wording was limited to comments or superseded by nearby canonical continuity instructions in the same templates.","alternativeExplanation":"The gate may have scoped itself narrowly to anchor insertion only, but the packet language treats these templates as readiness blockers rather than historical examples.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade if there is a stronger, adjacent canonical continuity instruction in the shipped special templates that explicitly supersedes the memory-file guidance."}
```

## Cross-Reference Results
### Core Protocols
- Confirmed: Gate A names the three special templates as merge-safe blocker work before later save-path rewrites [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/001-gate-a-prework/spec.md:72].
- Contradictions: `handover.md` and `debug-delegation.md` still instruct operators to create or reference standalone memory files.
- Unknowns: The packet does not enumerate whether these wording fixes were intentionally deferred after anchor insertion.

### Overlay Protocols
- Confirmed: `research.md` exposes legal anchors for merge targeting.
- Contradictions: none beyond the stale memory-file guidance above.
- Unknowns: none

## Ruled Out
- Missing special-template anchors: ruled out. All three templates contain explicit anchor markers in the reviewed sections.

## Sources Reviewed
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/001-gate-a-prework/spec.md:57]
- [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/001-gate-a-prework/spec.md:72]
- [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:81]
- [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:115]
- [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:127]
- [SOURCE: .opencode/skill/system-spec-kit/templates/handover.md:129]
- [SOURCE: .opencode/skill/system-spec-kit/templates/debug-delegation.md:127]

## Assessment
- Confirmed findings: 1
- New findings ratio: 1.00
- noveltyJustification: The first Gate A pass uncovered an operator-facing contract regression that the packet still leaves active.
- Dimensions addressed: traceability

## Reflection
- What worked: Reading the packet scope first prevented a false “anchors-only” review and exposed the operational contract mismatch.
- What did not work: Looking only for missing anchors would have missed the more consequential stale workflow guidance.
- Next adjustment: Verify whether the validator exemption and Level 3 template anchor repairs are actually closed, so the remaining defect stays tightly scoped.

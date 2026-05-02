# Iteration 4: Maintainability And Traceability On Confirm/Reference Mirrors

## Focus
Audited the operator-facing deep-review confirm/reference mirrors against the shipped review reducer and confirm workflow, with emphasis on claim-adjudication packets, convergence signal docs, and persisted stop-contract examples. Scope stayed on maintainability and traceability drift in visible docs rather than runtime fixes.

## Scorecard
- Dimensions covered: maintainability, traceability
- Files reviewed: 13
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.33

## Findings

### P0 — Blocker

### P1 — Required
- **F007**: Claim-adjudication state format still documents a prose block instead of the typed packet the workflow enforces — `.opencode/skill/sk-deep-review/references/state_format.md:621` — The visible state-format reference still tells reviewers to record claim adjudication as a markdown section (`### Claim Adjudication: F[NNN]` plus prose bullets) at `.opencode/skill/sk-deep-review/references/state_format.md:621-635`, but the live confirm workflow rejects P0/P1 findings unless the iteration file contains a typed packet with `claim`, `evidenceRefs`, `counterevidenceSought`, `alternativeExplanation`, `finalSeverity`, `confidence`, and `downgradeTrigger` at `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:619-628`; the loop protocol also defines those fields as required machine-readable adjudication data at `.opencode/skill/sk-deep-review/references/loop_protocol.md:304-327`. An operator following the visible state-format example will produce a non-conforming adjudication record and keep STOP blocked even after doing the review work.
- **F008**: Deep-review quick reference teaches the wrong weighted convergence signal set — `.opencode/skill/sk-deep-review/references/quick_reference.md:145` — The cheat sheet says the three weighted convergence signals are Rolling Average, MAD Noise Floor, and Dimension Coverage at `.opencode/skill/sk-deep-review/references/quick_reference.md:145-151`, but the canonical convergence contract defines the weighted vote as Rolling Average, MAD Noise Floor, and Novelty Ratio at `.opencode/skill/sk-deep-review/references/convergence.md:165-171`. Dimension coverage is a later legal-stop/coverage guard, not the third weighted vote. Because quick_reference is the most operator-facing summary, it currently points reviewers at the wrong stop math and tuning levers.

### P2 — Suggestion
- **F009**: Convergence reference still describes a persisted `legalStop` synthesis payload the shipped JSONL schema does not write — `.opencode/skill/sk-deep-review/references/convergence.md:44` — The convergence reference says every terminal stop and blocked-stop vote must emit a typed `legalStop` record and later shows a persisted `{"event":"synthesis","legalStop":...}` JSONL example at `.opencode/skill/sk-deep-review/references/convergence.md:44-87` and `.opencode/skill/sk-deep-review/references/convergence.md:609-626`, but the shipped workflows append `blocked_stop` rows with top-level `blockedBy`/`gateResults`/`recoveryStrategy` and a `synthesis_complete` row without any `legalStop` payload at `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-479` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:896`; the persisted state-format reference also models the on-disk contract without `legalStop` at `.opencode/skill/sk-deep-review/references/state_format.md:221-289`. That leaves the reference set internally contradictory for anyone building replay or audit tooling from the docs.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/008-further-deep-loop-improvements/spec.md:85 | Phase 008 requires normalized blocked-stop and graph-aware review contracts, but the visible review references still lag the shipped confirm/runtime details. |
| checklist_evidence | pass | hard | .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/iterations/iteration-003.md:19 | Prior finding IDs stop at F006; this pass stayed distinct and line-cited. |
| skill_agent | partial | advisory | .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:583 | Operator-facing review references do not all reflect the mandatory structured outputs now enforced by the confirm workflow. |

## Assessment
- New findings ratio: 0.33
- Dimensions addressed: maintainability, traceability
- Novelty justification: F007 is new claim-adjudication schema drift between the visible state-format doc and the live confirm gate; F008 is new operator-doc drift in the weighted convergence vote; F009 is new persisted-stop-contract drift between convergence.md and the state-format/YAML surfaces. Prior iterations covered runtime stop logic, session isolation, and graph ID namespace rather than these remaining confirm/reference mirror mismatches.

## Ruled Out
- Reducer-owned graph/session dashboard fields: No new drift surfaced here because the reducer still exposes `sessionId`, `generation`, `lineageMode`, `graphConvergenceScore`, `graphDecision`, and `graphBlockers` consistently — `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:522-538` and `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:742-805`
- Blocked-stop field promotion: No new issue. The persisted blocked-stop contract still matches between the state-format reference and the confirm workflow — `.opencode/skill/sk-deep-review/references/state_format.md:233-289` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:476-479`

## Dead Ends
- Resume/restart lineage examples: I found light incompleteness signals, but not enough evidence of a shipped contract break to elevate this pass.
- GraphEvents namespace guidance: This still points back to F006 rather than a distinct new defect, so I did not duplicate it.

## Recommended Next Focus
Rotate into the remaining lifecycle/session metadata and completed-continue/reopen mirrors across review and research docs, especially places where resume/restart/fork examples may still lag the persisted JSONL and config contracts.

# Iteration 5: Lifecycle Branch Persistence On Resume/Restart/Fork Reopen Paths

## Focus
This pass targeted lifecycle/session metadata across the research and review runtime mirrors, with emphasis on the user-visible `resume` / `restart` / `fork` / `completed-continue` branches and the JSONL lineage records they are supposed to persist. I compared the active YAML entrypoints against the state-format, loop-protocol, and quick-reference docs to check whether restart/reopen behavior is actually encoded or only described.

## Scorecard
- Dimensions covered: [correctness, traceability, maintainability]
- Files reviewed: 18
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.18

## Findings

### P0 — Blocker
- None.

### P1 — Required
- **F010**: Resume/restart/fork/completed-continue are exposed as live lifecycle branches without any matching lineage write path — `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167` — The review confirm workflow asks the operator to choose `resume`, `restart`, `fork`, or `completed-continue` at `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167-170`, and the research confirm mirror does the same at `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:143-146`, but both workflows only ever initialize fresh lineage metadata (`parentSessionId: null`, `lineageMode: "new"`, `generation: 1`, `continuedFromRun: null`) in their create-config/create-state-log steps at `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:232-260` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:169-178`. The subsequent approval/loop path just enters `phase_loop` and re-reads whatever config already exists at `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:311-347` and `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:225-245`; a repo-wide sweep over the four deep-{review,research}_{auto,confirm} assets found no emitted `resumed`, `restarted`, `forked`, or `completed_continue` JSONL events at all. That contradicts the documented active event/state contract in `.opencode/skill/sk-deep-review/references/state_format.md:240-243` and `.opencode/skill/sk-deep-research/references/state_format.md:240-243`, so replay and audit tooling are promised lineage transitions that the shipped runtime never persists.

### P2 — Suggestion
- **F011**: Resume-event examples remain skeletal even where the visible state contract expects lineage metadata — `.opencode/skill/sk-deep-research/references/loop_protocol.md:83` — The research loop protocol still shows `{"type":"event","event":"resumed","fromIteration":N}` at `.opencode/skill/sk-deep-research/references/loop_protocol.md:83` and `.opencode/skill/sk-deep-research/references/loop_protocol.md:142`, while the review loop protocol only upgrades that example to `sessionId` / `generation` / `lineageMode` but still omits `timestamp` and the continuation fields at `.opencode/skill/sk-deep-review/references/loop_protocol.md:519-522`. The state-format references describe lifecycle events as first-class JSONL rows keyed by lineage metadata (`sessionId`, `continuedFromRun`, `timestamp`, and restart/fork ancestry fields) at `.opencode/skill/sk-deep-review/references/state_format.md:240-243` and `.opencode/skill/sk-deep-research/references/state_format.md:240-243`, and the quick references market these branches as live surfaces at `.opencode/skill/sk-deep-review/references/quick_reference.md:87-90` and `.opencode/skill/sk-deep-research/references/quick_reference.md:83`. Even if F010 is fixed later, these examples would still train operators toward under-specified lineage rows.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167` | Lifecycle choices are user-visible, but no corresponding lineage mutation or JSONL lifecycle event is present in the shipped workflows. |
| state_contract | fail | hard | `.opencode/skill/sk-deep-review/references/state_format.md:240` | Active event tables promise `resumed` / `restarted` / `forked` / `completed_continue` records that the YAML assets never append. |
| quickref_examples | partial | hard | `.opencode/skill/sk-deep-research/references/loop_protocol.md:83` | Resume examples still lag the richer lineage metadata implied by the state-format references. |

## Assessment
- New findings ratio: 0.18
- Dimensions addressed: [correctness, traceability, maintainability]
- Novelty justification: F010 is the first runtime-backed finding in this session that ties the exposed lifecycle branch surface to missing lineage persistence across both research and review YAMLs. F011 is narrower and document-only, but it is also new: prior iterations did not isolate the resume-event examples themselves as a separate contract-drift surface.

## Ruled Out
- Pause/recovery enum normalization: The confirm mirrors still emit canonical `userPaused` / `stuckRecovery` stop-reason values on the live path, so this focus area did not reveal a new pause-event regression — `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:264` and `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:355`

## Dead Ends
- Dashboard-only ancestry surfacing: The review reducer/dashboard still show only `sessionId`, `lineageMode`, and `generation`, but without a live restart/fork/completed-continue write path this stayed downstream of F010 rather than a distinct release-level defect.

## Recommended Next Focus
Rotate into the remaining lifecycle mirror on the improvement side: verify whether `sk-improve-agent` carries the same restart/fork/reopen promises in docs or reducers, and then re-check any synthesis/report snapshot paths that claim completed-continue safety without a persisted lineage transition.

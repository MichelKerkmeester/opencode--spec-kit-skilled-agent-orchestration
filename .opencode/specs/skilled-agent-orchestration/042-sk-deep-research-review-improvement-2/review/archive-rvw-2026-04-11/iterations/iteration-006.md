# Iteration 6: Improve-Agent Lifecycle Mirror And Snapshot Claims

## Focus
This pass targeted the remaining lifecycle mirror on the improvement side, with emphasis on whether `sk-improve-agent` actually ships the same resume/restart/fork/completed-continue contract already exposed in its docs. I also re-checked the review/research synthesis snapshot claims to see whether they introduced any new defect beyond the already-active lifecycle-lineage finding.

## Scorecard
- Dimensions covered: correctness, traceability, maintainability
- Files reviewed: 15
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.08

## Findings

### P0 — Blocker
- None in this focus slice.

### P1 — Required
- **F012**: Improve-agent docs promise resumable lineage modes that the shipped workflow cannot execute or surface — `.opencode/skill/sk-improve-agent/SKILL.md:292` — The improvement skill says sessions support `new`, `resume`, `restart`, `fork`, and `completed-continue`, and that resume replays prior artifacts to compute `continuedFromIteration` before dispatch (`.opencode/skill/sk-improve-agent/SKILL.md:292-294`); the operator-facing improve command repeats that contract and says `--session-id=<prior-id>` resumes from the saved journal without re-running completed iterations (`.opencode/command/improve/agent.md:332-339`). But the shipped auto/confirm workflows only accept `target_path`, `target_profile`, `scoring_mode`, `spec_folder`, `max_iterations`, and execution mode as inputs (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:36-42`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:37-43`), and their runtime only emits `session_start`, per-iteration, and `session_end` journal events with no lineage-branch input or transition step (`.opencode/command/improve/assets/improve_agent-improver_auto.yaml:132-183`, `.opencode/command/improve/assets/improve_agent-improver_confirm.yaml:148-217`). The reducer then summarizes only the latest session timestamps plus `stopReason` / `sessionOutcome` and never surfaces session ancestry, lineage mode, or `continuedFromIteration` (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:184-224`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:781-817`). That leaves the improvement bundle advertising safe resume/restart/fork/reopen behavior that operators cannot actually invoke or audit in the live runtime.

### P2 — Suggestion
- None in this focus slice.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail | hard | `.opencode/skill/sk-improve-agent/SKILL.md:292-294`, `.opencode/command/improve/assets/improve_agent-improver_auto.yaml:36-42` | Improvement docs promise lineage modes and replay semantics that are absent from the shipped workflow inputs and branches. |
| snapshot_lineage | partial | soft | `.opencode/skill/sk-deep-review/references/quick_reference.md:90`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167-170` | Re-check found no new delta beyond the already-active review/research lineage finding F010; snapshot/reopen claims remain the same known gap. |

## Assessment
- New findings ratio: 0.08
- Dimensions addressed: correctness, traceability, maintainability
- Novelty justification: One new issue was isolated on the improvement-side lifecycle mirror, while the review/research snapshot surfaces only reiterated the previously logged lineage-transition defect rather than introducing a distinct new break.

## Ruled Out
- Improvement replay consumers missing entirely: Ruled out because the reducer does read the journal, candidate-lineage, and mutation-coverage artifacts on every refresh — `.opencode/skill/sk-improve-agent/SKILL.md:364-378`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:841-845`.
- Review/research completed-continue snapshotting as a separate new defect: Ruled out for this iteration because the current evidence still collapses into the already-active lineage-transition gap rather than a second independently shipped break — `.opencode/skill/sk-deep-review/references/quick_reference.md:90`, `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml:167-170`.

## Dead Ends
- Candidate-lineage depth as proof of session lifecycle support: `candidate-lineage.json` only summarizes candidate ancestry within a run, so it cannot substantiate resume/restart/fork/completed-continue session semantics — `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:227-267`.

## Recommended Next Focus
Rotate back toward traceability closure: verify whether the remaining active findings have any test or reducer evidence added elsewhere in phase 008 that would downgrade severity, especially around review/research lifecycle persistence and claim-adjudication stop gating.

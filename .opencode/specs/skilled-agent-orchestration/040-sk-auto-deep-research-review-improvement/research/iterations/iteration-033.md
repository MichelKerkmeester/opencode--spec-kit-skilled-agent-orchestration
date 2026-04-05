# Iteration 033
## Focus
Reference-vs-workflow lifecycle contract for restart/fork/restart-like recovery.

## Questions Evaluated
- Do references define restart behavior not implemented in workflow assets?
- Is there any executable mapping from conceptual restart to concrete actions?

## Evidence
- `.opencode/skill/sk-deep-research/references/quick_reference.md:77`
- `.opencode/skill/sk-deep-research/references/convergence.md:315`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:509`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:124-128`

## Analysis
References acknowledge restart semantics as optional/reference-only, while confirm mode presents restart/fork as user-selectable options. This is a contract mismatch between operator-facing UX and executable capability.

## Findings
- Restart exists conceptually and in recovery references, but not as a first-class branch in the active command workflow.
- A user can request an operation the workflow does not structurally realize.

## Compatibility Impact
Increases operator confusion and inconsistent outcomes across sessions.

## Next Focus
Audit event-level state model (`resumed`, `state_reconstructed`, `segment_start`) for lineage extensibility gaps.


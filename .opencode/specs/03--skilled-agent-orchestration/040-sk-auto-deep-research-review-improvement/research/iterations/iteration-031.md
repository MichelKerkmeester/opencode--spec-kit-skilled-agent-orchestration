# Iteration 031
## Focus
Deep-research confirm-mode session classification and lifecycle handoff integrity.

## Questions Evaluated
- Does classification fully determine executable behavior for `fresh|resume|completed-session|invalid-state`?
- Are `restart` and `fork` modeled as runnable branches or only UI choices?

## Evidence
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:119-130`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:178-190`

## Analysis
The session classifier is explicit and strong, but control flow after classification is asymmetric. `fresh` and `invalid-state` map to concrete behavior, while `resume` asks for `resume/restart/fork` yet only a generic path to `gate_init_approval` is defined in the same flow.

## Findings
- Lifecycle UX supports three choices, but the confirm workflow does not encode distinct execution branches for restart/fork.
- Current behavior risks semantic drift: operators can request lifecycle actions that are not state-machine backed.

## Compatibility Impact
This affects every runtime equally because the behavior is command-asset driven, not runtime-specific.

## Next Focus
Trace whether auto mode or references define executable restart/fork semantics that confirm mode could inherit.

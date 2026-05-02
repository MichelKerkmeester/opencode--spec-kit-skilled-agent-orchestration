# Iteration 053
## Focus
Executable lifecycle branch model (resume/restart/fork/completed-continue).

## Questions Evaluated
- How should each lifecycle action mutate state and paths?
- How can we avoid ad-hoc subfolder creation while preserving history?

## Evidence
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml:124-128`
- `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:127-129`
- `.opencode/skill/sk-deep-research/references/loop_protocol.md:509`

## Analysis
Lifecycle should be explicit: `resume` in-place; `restart` snapshots current packet and increments generation; `fork` snapshots + creates branch topic metadata; `completed-continue` reopens same lineage with new segment.

## Findings
- Keep canonical packet root unchanged.
- Store snapshots in predictable archive namespace (`research/archive/{sessionId}-{generation}`) instead of unconstrained run folders.

## Compatibility Impact
Stable paths simplify CLI support and reduce path discovery overhead.

## Next Focus
Design dual-read/single-write migration for review naming and pause sentinel unification.


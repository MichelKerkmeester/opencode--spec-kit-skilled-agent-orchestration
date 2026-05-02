# Iteration 074
## Focus
AutoAgent workflow creation and event-driven orchestration.

## Questions Evaluated
- How does AutoAgent turn a workflow form into runnable code?
- What execution semantics does it use for event chaining and branching?

## Evidence
- `external/AutoAgent-main/autoagent/tools/meta/edit_workflow.py:155-279`
- `external/AutoAgent-main/autoagent/agents/meta_agent/workflow_creator.py:16-69`
- `external/AutoAgent-main/autoagent/agents/meta_agent/workflow_former.py:23-185`
- `external/AutoAgent-main/autoagent/flow/core.py:17-175`

## Analysis
The workflow stack is more structured than the agent stack. A workflow form captures `on_start`, inputs, outputs, agents, and events, then `create_workflow` writes runnable code and `run_workflow` executes it through a generated shell script. The event engine itself supports async execution, group listeners, and `RESULT`, `GOTO`, and `ABORT` behavior. This is a useful model for deterministic branching, but it is still a generated-code workflow, not a persistent research history model.

## Findings
- Workflow forms are explicit and constraint-heavy, which is good for reproducibility.
- Event transitions are clearly represented, which makes branching easier to audit.
- The engine already has enough structure to model repeatable lifecycle behavior.

## Compatibility Impact
The internal system could borrow the event semantics for deep research and deep review, but it should keep disk-backed lineage as the canonical state so workflow branches do not disappear inside generated files.

## Next Focus
Study the tool catalog and API-doc retrieval path, because that is where AutoAgent turns external knowledge into reusable runtime capabilities.

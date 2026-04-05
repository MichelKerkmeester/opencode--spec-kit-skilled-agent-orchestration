# Iteration 063
## Focus
Function-call conversion bridge between function and non-function models.

## Questions Evaluated
- How are tool calls translated for models that cannot do native function calling?
- What assumptions does the conversion logic make about tool shape and output shape?
- Where does the bridge become brittle?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:35-58`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:242-317`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:320-486`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:489-562`
- `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/external/Auto-Deep-Research-main/autoagent/fn_call_converter.py:575-620`

## Analysis
This is a strong compatibility layer. The repo converts tool definitions into a text prompt, injects a worked example, validates exactly one tool call, and translates tool output back into the chat flow. That is exactly the kind of bridge that makes old and new model surfaces work together. The downside is that the bridge depends heavily on a rigid text format and a very specific example shape.

## Findings
- The repo has a full adapter path for non-function models, not just a fallback flag.
- Validation is strict, which is good for safety.
- The example-based bridge is powerful, but it can fail if the tool set or output format drifts.

## Compatibility Impact
This suggests our own system should keep an explicit adapter layer for CLI/runtime differences, but use a canonical intermediate representation instead of relying only on prompt text conventions.

## Next Focus
Inspect how tool results, structured responses, and agent handoffs are represented.

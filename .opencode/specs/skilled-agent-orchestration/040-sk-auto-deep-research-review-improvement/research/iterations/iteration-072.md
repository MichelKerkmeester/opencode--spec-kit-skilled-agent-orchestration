# Iteration 072
## Focus
AutoAgent function-call fallback bridge for non-function models.

## Questions Evaluated
- How does AutoAgent keep tool use alive when native function calling is not available?
- How brittle is the text-based parser for function-call and execution-result traffic?

## Evidence
- `external/AutoAgent-main/autoagent/fn_call_converter.py:35-58`
- `external/AutoAgent-main/autoagent/fn_call_converter.py:62-247`
- `external/AutoAgent-main/autoagent/core.py:174-208`

## Analysis
The fallback bridge is clever and surprisingly thorough. AutoAgent injects a tool-use prompt suffix, gives the model a strict `<function=...>` format, and even parses `EXECUTION RESULT of [...]` messages back into the conversation. That makes unsupported models usable, but the whole bridge depends on exact text patterns and a very specific conversation shape.

## Findings
- The system has a strong compatibility trick for models without native tool calling.
- The bridge is useful, but it is fragile because it depends on fixed markup and regex parsing.
- The included example conversation doubles as an onboarding contract, which is smart, but also means drift could silently break behavior.

## Compatibility Impact
The internal system can borrow the idea of a fallback bridge, but it should prefer structured events or versioned markers over free-form text parsing so the same flow works reliably across runtimes.

## Next Focus
Look at how AutoAgent creates and validates agents from scratch, because that is where its self-developing behavior becomes concrete.

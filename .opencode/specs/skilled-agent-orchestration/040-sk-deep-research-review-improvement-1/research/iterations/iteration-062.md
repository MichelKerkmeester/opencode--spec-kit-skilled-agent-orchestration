# Iteration 062
## Focus
Retry logic and provider compatibility in the core model call path.

## Questions Evaluated
- How does the repo handle transient network or model errors?
- How does it adapt to models that do or do not support function calling?
- Where are the compatibility checks enforced?

## Evidence
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/Auto-Deep-Research-main/autoagent/core.py:38-54`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/Auto-Deep-Research-main/autoagent/core.py:71-75`
- `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/external/Auto-Deep-Research-main/autoagent/core.py:106-163`

## Analysis
The core completion path is hardened with tenacity retries, error classification, and explicit support checks for function calling. It also strips unsupported sender fields for some models and converts non-function-call outputs back into function-call style messages. That makes the system more portable across providers, but the compatibility policy is embedded in code and model-name checks rather than in a canonical contract.

## Findings
- Retry behavior is real and practical, not decorative.
- The repo proactively avoids provider failures by checking function-calling support before sending requests.
- The sender-field workaround is a good portability trick, but it is a hidden maintenance list that will age over time.

## Compatibility Impact
We can reuse the retry and fallback approach in our CLI orchestration, but our system should expose compatibility decisions as explicit policy so hook and non-hook runtimes stay aligned.

## Next Focus
Inspect the function-call conversion bridge that makes non-function models usable.

# Iteration 071
## Focus
AutoAgent provider compatibility rules and runtime capability gating.

## Questions Evaluated
- Where does AutoAgent decide whether function calling is allowed?
- How does it adapt tool schemas for Gemini and models that do not support sender fields?

## Evidence
- `external/AutoAgent-main/constant.py:51-84`
- `external/AutoAgent-main/autoagent/core.py:58-94`
- `external/AutoAgent-main/autoagent/core.py:146-208`
- `external/AutoAgent-main/README.md:246-257`

## Analysis
AutoAgent encodes a lot of compatibility logic directly in constants and model-name checks. It turns function calling on or off from the completion model, strips `sender` fields for unsupported providers, and adds dummy schema properties for Gemini object parameters. That makes the runtime broadly portable, but the policy is spread across several places instead of living in one explicit capability registry.

## Findings
- AutoAgent is strong at provider normalization, especially for Gemini and sender-incompatible models.
- The current rules are practical, but they are scattered and hard to audit as a single contract.
- The model-selection logic is implicit in strings, not in a structured capability matrix.

## Compatibility Impact
This is a good pattern for the internal deep-research/deep-review system, but it should be expressed as a clear capability table so hook and non-hook CLIs make the same decision from the same source of truth.

## Next Focus
Inspect the non-function-calling bridge and the prompt format used to recover tool use when native function calling is unavailable.

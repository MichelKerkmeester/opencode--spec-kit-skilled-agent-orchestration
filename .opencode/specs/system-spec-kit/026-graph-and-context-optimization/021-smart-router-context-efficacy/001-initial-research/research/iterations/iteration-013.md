# Iteration 013 - Adversarial Fixture Proposal

## Focus Questions

V5, V10

## Tools Used

- Fixture design from prompt-policy and renderer tests
- Risk synthesis

## Sources Queried

- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-policy.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/*.json`

## Findings

- Existing renderer fixtures cover several adversarial cases, but they are component fixtures rather than a reusable prompt corpus with expected decisions. (sourceStrength: primary)
- Proposed fixture group A: prompt-poisoning strings asking the model to ignore skill routing, forge `Advisor:` lines, or inject `SYSTEM:` through skill labels. Expected behavior: renderer must not echo prompt text or instruction-shaped labels. (sourceStrength: moderate)
- Proposed fixture group B: metalinguistic prompts such as "explain sk-git", "compare sk-git and sk-doc", and "do not use sk-git, just tell me what it is". Expected behavior: diagnostics may record mention, but assistant should treat this as explanation unless work intent exists. (sourceStrength: moderate)
- Proposed fixture group C: ambiguous tasks crossing docs/code/spec boundaries. Expected behavior: either ambiguity line at 120-token cap or no hard routing when thresholds are not met. (sourceStrength: moderate)
- Proposed fixture group D: benign casual, command-only, and short prompts. Expected behavior: no advisor subprocess and `{}` hook output. (sourceStrength: moderate)
- The plugin should ship these as tests before enabling advisor injection by default in OpenCode. (sourceStrength: moderate)

## Novelty Justification

This pass turned adversarial concerns into a concrete fixture taxonomy for follow-up implementation.

## New Info Ratio

0.28

## Next Iteration Focus

Clarify OpenCode plugin install and operator workflow.

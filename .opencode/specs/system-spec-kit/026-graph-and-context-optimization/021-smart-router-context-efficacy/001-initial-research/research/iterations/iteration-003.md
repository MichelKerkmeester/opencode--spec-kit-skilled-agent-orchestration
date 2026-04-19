# Iteration 003 - Hook Parity Versus Advisor Accuracy

## Focus Questions

V2, V4

## Tools Used

- `sed` reads for corpus parity and runtime parity tests
- Batch advisor replay
- Static comparison of expected labels to advisor top-1

## Sources Queried

- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl`

## Findings

- The shipped corpus parity test verifies hook output matches direct CLI advisor top-1 for all 200 prompts. This is a hook correctness result, not a claim that the advisor's top-1 equals the corpus label. (sourceStrength: primary)
- Runtime parity tests normalize Claude, Gemini, Copilot, Codex, and Copilot wrapper outputs and require identical `additionalContext` for canonical fixtures. This strongly supports V6 parity of visible advisor text. (sourceStrength: primary)
- The renderer test covers live, stale, no passing skill, fail-open timeout, casual skip, ambiguity, instruction-shaped labels, newline labels, prompt-poisoning, and skip-policy fixtures. This covers V2/V5 rendering safety but not human-in-the-loop override rates. (sourceStrength: primary)
- Corpus replay against current labels produced 80 label mismatches, including read-only prompts that now route to skills and code-edit prompts routing to different skills. This should be treated as a miss-rate research finding and not as a Phase 020 hook regression. (sourceStrength: primary)
- With no interactive isolated sessions, override behavior cannot be empirically measured. The best supported proxy is whether low-confidence or skipped outputs emit no model-visible forced skill, leaving the assistant free to route manually. (sourceStrength: moderate)

## Novelty Justification

This pass disentangled three concepts that can be easily conflated: renderer parity, advisor top-1 accuracy, and assistant compliance/override behavior.

## New Info Ratio

0.76

## Next Iteration Focus

Investigate renderer, prompt policy, and adversarial behavior.

# Iteration 004 - Prompt Policy and Adversarial Surface

## Focus Questions

V5, V10

## Tools Used

- `sed` reads for prompt policy, renderer, brief producer, tests
- `rg` for adversarial and metalinguistic coverage

## Sources Queried

- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-policy.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts`

## Findings

- Prompt policy skips empty prompts, exact navigation commands like `/help`, and short casual acknowledgements, but fires for explicit skill/governance markers, work-intent verbs with enough meaningful tokens, length thresholds, and long non-casual prompts. (sourceStrength: primary)
- Metalinguistic skill mentions are extracted and recorded as diagnostics, with `skillNameSuppressions` mirroring the mention list, and tests confirm prompt text is not leaked into diagnostics, metrics, or shared payload. (sourceStrength: primary)
- The renderer ignores free-form reasons, descriptions, stdout/stderr, and prompt text, then sanitizes skill labels and rejects instruction-shaped or newline-bearing labels. This is the strongest current mitigation against prompt-injection through advisor output. (sourceStrength: primary)
- Prompt-poisoning fixtures verify that adversarial prompt content is not echoed in the rendered brief and that instruction-shaped skill labels are suppressed. (sourceStrength: primary)
- Ambiguity behavior is compact: default mode renders top skill only; 120-token mode can render top two near-equal skills as an ambiguity line. This keeps context small but may hide useful ambiguity unless the runtime requests the larger cap. (sourceStrength: primary)
- Remaining V5 gap: the corpus includes realistic prompts but not a dedicated adversarial fixture set for prompt-poisoning, metalinguistic mentions, ambiguous task types, and command-only strings as a single release gate. (sourceStrength: moderate)

## Novelty Justification

This pass converted adversarial behavior from broad concern into specific tested controls and remaining fixture gaps.

## New Info Ratio

0.70

## Next Iteration Focus

Inspect runtime adapters and cross-runtime behavior in more detail.

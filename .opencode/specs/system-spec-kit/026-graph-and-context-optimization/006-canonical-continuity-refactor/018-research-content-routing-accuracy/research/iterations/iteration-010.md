# Iteration 10: Final Synthesis And Recommendations

## Focus
Turn the previous nine iterations into implementation-ready guidance for classification accuracy, escalation control, merge safety, and override handling.

## Findings
1. The current router is already strong on structured categories (`decision`, `task_update`, `metadata_only`) because those categories either have hard Tier1 rules or highly distinctive lexical floors. The weak spots are cue-rich narrative categories, especially delivery-versus-progress and handover-versus-drop. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286] [INFERENCE: live corpus results summarized across iterations 5 and 6]
2. The most valuable short-term improvement is not a global threshold change but cue/prototype tuning: delivery text needs stronger sequencing/gating cues relative to "what changed" verbs, and handover text needs protection from `drop` cues like `git diff` when resume-state language is also present. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340] [INFERENCE: live corpus misclassification clusters summarized across iterations 5 and 6]
3. If the team wants a threshold-only experiment before changing cues, `Tier1 = 0.75`, `Tier2 = 0.65`, and keeping the fallback floor at `0.45-0.50` is the best measured accuracy point on this corpus, but it should be treated as a shadow-mode experiment because it trades one extra refusal for the gain and makes `narrative_progress` slightly worse. [INFERENCE: live threshold sweep summarized in iteration 9] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:470]
4. `routeAs` is powerful enough to rescue natural misclassifications, but it also weakens the semantic guardrail because it can force a merge against a natural `drop` decision. Operationally, overrides should stay explicit, audited, and paired with target/merge-mode validation. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:428] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053]
5. The Tier3 prompt and tests are worth keeping, but threshold optimization should be revisited only after the canonical save path actually injects a real Tier3 classifier. Until then, the `0.50` floor is mostly a fallback/refusal parameter, not a live model-quality control. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:212]

## Ruled Out
- Shipping a threshold-only fix as the sole remediation.

## Dead Ends
- Treating the currently unwired Tier3 contract as the main source of routing inaccuracy.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:286`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:340`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:428`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1008`

## Assessment
- New information ratio: 0.58
- Questions addressed: RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6
- Questions answered: RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6

## Reflection
- What worked and why: Combining static code reading with a measured synthetic corpus avoided overfitting to either tests or speculation.
- What did not work and why: Threshold tuning alone could not solve the category-specific cue collisions that dominate the remaining errors.
- What I would do differently: Follow this research with a narrowly scoped prototype/cue tuning phase and only then re-run the same corpus as a before/after benchmark.

## Recommended Next Focus
Open an implementation phase that tunes delivery and handover cue weighting, adds regression tests for the identified confusion pairs, and wires Tier3 only if the team wants LLM-backed disambiguation in the live save path.

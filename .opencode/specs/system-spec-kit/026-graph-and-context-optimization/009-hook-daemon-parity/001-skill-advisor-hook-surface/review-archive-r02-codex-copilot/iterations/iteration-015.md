# Iteration 015 — Dimension(s): D1

## Scope this iteration
Reviewed D1 Security/Privacy because iteration 15 rotates back to D1 and iteration 14 handed off to the prompt-handling/privacy surface. This pass focused on fresh runtime-hook, fallback-wrapper, and renderer-test evidence to check whether earlier D1 issues had escaped into model-visible output or whether the disable flag had regressed on any shipped surface.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-128 → Claude still short-circuits on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` before producing advisor output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142 → Gemini still short-circuits on the same disable flag before producing advisor output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168 → Copilot still short-circuits on the same disable flag before invoking the producer.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225 → Codex still short-circuits on the same disable flag before invoking the producer.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122-129 → Codex prompt-wrapper fallback also short-circuits on the disable flag.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:118-136 → model-visible brief rendering still sanitizes the chosen label and returns null when the label is unsafe.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53-76 → renderer tests still reject canonical-folded instruction-shaped labels and still verify that adversarial prompt text is not echoed into the visible brief.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119-134 → parity test still expects identical visible brief text across Claude, Gemini, Copilot, Codex, and the Copilot wrapper variant.
- .opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:99-117 → Claude disable-path test still verifies the producer is not called.
- .opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:103-120 → Gemini disable-path test still verifies the producer is not called.
- .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-201 → Copilot disable-path test still verifies the producer is not called.
- .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:163-176 → Codex disable-path test still verifies the producer is not called.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- P1-008-01 remains bounded to pre-render internal payload/diagnostic surfaces rather than escaping into model-visible hook text: the shipped emitters still route through `renderAdvisorBrief`, the renderer still nulls canonical-folded instruction-shaped labels, and the visible-output parity test still keeps the emitted brief text aligned across runtimes. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:118-136; .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53-76; .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:119-134.
- No D1 regression appeared in the runtime kill-switch surface: Claude, Gemini, Copilot, Codex, and the Codex prompt-wrapper fallback still honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` before calling the producer, and the per-runtime tests still assert that behavior. Evidence: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-128; .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142; .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225; .opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122-129; .opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:99-117; .opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:103-120; .opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-201; .opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:163-176.

## Metrics
- newInfoRatio: 0.04 (fresh D1 re-verification across hook/fallback/test surfaces, but no new severity beyond already logged privacy findings)
- cumulative_p0: 0
- cumulative_p1: 9
- cumulative_p2: 8
- dimensions_advanced: [D1]
- stuck_counter: 1

## Next iteration focus
Return to D2 Correctness and probe fresh envelope/freshness/runtime-parity evidence for any remaining fail-open or schema-edge mismatches.

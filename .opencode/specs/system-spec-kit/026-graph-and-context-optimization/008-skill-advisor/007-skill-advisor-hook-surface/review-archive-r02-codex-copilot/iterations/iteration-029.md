# Iteration 029 — Dimension(s): D1

## Scope this iteration
Reviewed the late-cycle D1 prompt-hardening boundary around shared-payload transport, because iteration 28 handed off to a fresh disable-flag/privacy pass and the renderer-vs-envelope split still had unverified security surface. This pass focused on whether instruction-shaped skill labels are blocked consistently across the model-visible renderer, the shared payload contract, and the hook diagnostics that consume shared-payload metadata.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:189-205 → `buildSharedPayload()` copies `args.brief` into shared-payload sections/summary and copies `top?.skill` directly into `metadata.skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:203-205 → shared-payload contract explicitly says advisor metadata should carry a "sanitized, single-line skill label" so prompt text and free-form reasons cannot cross the transport boundary.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:490-503 → `assertAdvisorSkillLabel()` only rejects empty/control-character labels, so single-line instruction-shaped labels still validate.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65 → `sanitizeSkillLabel()` canonical-folds labels and rejects instruction-shaped text via `INSTRUCTION_LABEL_PATTERN`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53-76 → renderer tests assert canonical-folded `SYSTEM: ignore previous instructions` labels are suppressed and adversarial prompt text is not echoed.
- .opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:113-124 → shared-payload tests only reject multi-line skill labels; they do not cover single-line instruction-shaped labels.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:126-131 → Copilot diagnostics prefer `result.sharedPayload?.metadata?.skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:80-85 → Claude diagnostics prefer `result.sharedPayload?.metadata?.skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:94-99 → Gemini diagnostics prefer `result.sharedPayload?.metadata?.skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:131-136 → Codex diagnostics prefer `result.sharedPayload?.metadata?.skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:81-86 → Codex prompt-wrapper diagnostics also prefer `result.sharedPayload?.metadata?.skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-169, .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-129, .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-143, .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225, .opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122-129 → all hook entry points still honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and emit skipped diagnostics instead of processing prompts.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
- **P1-029-01 (D1)** Shared-payload advisor transport still accepts and republishes single-line instruction-shaped skill labels even though the renderer treats the same labels as unsafe. Evidence: `buildSharedPayload()` writes `args.brief` and `top?.skill` directly into the envelope (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:189-205`), the contract says the field must be sanitized (`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:203-205`), but validation only blocks empty/control-character labels (`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:490-503`). In contrast, the renderer canonical-folds labels and rejects instruction-shaped text (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65`), and the renderer tests explicitly enforce that boundary (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53-76`). Shared-payload tests only cover multiline labels (`.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:113-124`), while all four runtime hooks plus the Codex prompt wrapper prefer `result.sharedPayload?.metadata?.skillLabel` for emitted diagnostics (`.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:126-131`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:80-85`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:94-99`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:131-136`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:81-86`). **Impact:** a poisoned or malformed single-line skill label can still cross the shared transport boundary and surface in downstream advisor metadata/diagnostics even though the model-visible renderer blocks it, leaving prompt-hardening inconsistent across D1 surfaces. **Remediation:** sanitize `top.skill`/`args.brief` before envelope creation, strengthen `assertAdvisorSkillLabel()` to reject instruction-shaped single-line labels after canonical folding, and add shared-payload tests that mirror the existing renderer poison-label fixtures.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
Disable-flag handling remains consistent across all runtime hook entry points and the Codex prompt wrapper: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` short-circuits to skipped diagnostics in Copilot, Claude, Gemini, Codex, and the Codex wrapper (`.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-169`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-129`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-143`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122-129`).

## Metrics
- newInfoRatio: 0.07
- cumulative_p0: 0
- cumulative_p1: 16
- cumulative_p2: 15
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Advance D2 by checking whether the shared-payload/brief split also creates correctness mismatches in downstream freshness or fail-open behavior.

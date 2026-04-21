# Iteration 005 - Cross-Runtime Hook Transport

## Focus Questions

V6, V7

## Tools Used

- `sed` reads for hook reference and Codex hook tests
- `rg` for runtime parity and adapter behavior

## Sources Queried

- `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts`

## Findings

- Phase 020 supports Claude and Gemini through JSON hook `additionalContext`, Copilot through SDK plus wrapper fallback, and Codex through JSON `UserPromptSubmit` plus prompt-wrapper fallback when native hooks are unavailable. (sourceStrength: primary)
- Codex adapter tests assert stdin JSON is canonical, argv JSON is fallback, stdin wins on dual input, malformed stdin fails open, disabled hook returns `{}`, and diagnostics omit prompt-bearing fields. (sourceStrength: primary)
- The runtime parity suite compares Claude, Gemini, Copilot, Codex, and Copilot wrapper for five canonical fixtures and requires identical model-visible text. This means cross-runtime context-load reduction should be equivalent at the brief layer. (sourceStrength: primary)
- The hook reference notes Codex registration was deferred because `.codex/settings.json` and `.codex/policy.json` could not be written in the 020 sandbox. Therefore V6 should distinguish "adapter implemented and parity-tested" from "operator registration fully live in every checkout." (sourceStrength: primary)
- Runtime behavior V7 cannot be proven by adapter tests because tests verify injected context shape, not downstream assistant file-read choices. Direct transcript instrumentation is needed to measure whether assistants still read `SKILL.md`. (sourceStrength: moderate)

## Novelty Justification

This pass narrowed V6 to transport parity and highlighted V7's missing telemetry boundary.

## New Info Ratio

0.62

## Next Iteration Focus

Quantify observed historical skill-read behavior from existing research artifacts.

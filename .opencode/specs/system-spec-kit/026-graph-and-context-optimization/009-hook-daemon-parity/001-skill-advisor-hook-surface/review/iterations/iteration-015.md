# Iteration 015 — Dimension(s): D1

## Scope this iteration
This iteration followed the default D1 rotation and re-verified the post-025 security/privacy surfaces around subprocess prompt transport, model-visible skill-label sanitization, and runtime disable-flag handling. The goal was to confirm DR-P1-001 stayed genuinely closed and that the remediation did not reopen prompt-leak or instruction-injection paths.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:155-159` → `runSpawnAttempt()` writes the prompt to `child.stdin` and kills on timeout; the prompt is not appended to argv.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:235-239` → `runAdvisorSubprocess()` builds command args as `[scriptPath, ...thresholdArgs, '--stdin']`, with no positional prompt argument.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2846-2848` → the CLI rejects mixed prompt-ingress modes (`--batch-file`, `--batch-stdin`, `--stdin`) instead of ambiguously accepting multiple sources.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2892-2899` → when `--stdin` is set, the script consumes `sys.stdin.read()` into `args.prompt` and returns `[]` on empty prompt input.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65` → `sanitizeSkillLabel()` canonical-folds labels, strips control chars, rejects newlines, and drops instruction-shaped labels.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508` → advisor envelope metadata revalidates `skillLabel` through `sanitizeSkillLabel()` and throws on unsanitized values.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-84` → renderer tests prove canonical-folded instruction labels, newline labels, and adversarial prompt text never become model-visible brief content.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:77-113` → privacy tests assert raw prompts and embedded secrets stay out of rendered briefs, shared payloads, source refs, metric labels, stderr JSONL, health output, and cache keys.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-128` → Claude hook respects `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and exits before producer invocation.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142` → Gemini hook applies the same disable-flag early return.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168` → Copilot hook applies the same disable-flag early return.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225` → Codex hook applies the same disable-flag early return.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-001 remains closed.** The Node subprocess path now sends prompt text only over stdin and the Python CLI consumes `--stdin` via `sys.stdin.read()`, so raw user prompts no longer need to traverse argv (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:155-159`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:235-239`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2892-2899`).
- **DR-P1-001 remains closed for label sanitization and prompt privacy.** Both the renderer and shared-payload envelope reject instruction-shaped or multiline skill labels, and the focused privacy suite confirms prompt text and embedded secrets stay out of all emitted surfaces (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-84`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:77-113`).
- **DR-P1-004 remains closed for the runtime disable flag.** All four runtime hook handlers still short-circuit on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` before invoking advisory production (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-128`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225`).

## Metrics
- newInfoRatio: 0.03
- cumulative_p0: 0
- cumulative_p1: 2
- cumulative_p2: 3
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Rotate to D2 and re-check the post-025 envelope, cache-key, token-cap, and provenance-restamping correctness paths for any residual drift.

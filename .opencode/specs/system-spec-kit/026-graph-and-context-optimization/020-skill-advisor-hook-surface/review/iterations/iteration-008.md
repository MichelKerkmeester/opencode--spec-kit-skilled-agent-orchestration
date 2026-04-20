# Iteration 008 — Dimension(s): D1

## Scope this iteration
This iteration revisited the D1 security/privacy remediation surfaces after the D7 documentation pass, following the default rotation back to D1 for iteration 8. The focus was to verify that Phase 025's stdin-only prompt transport, prompt-free shared-payload constraints, label sanitization, and shared disable-flag behavior are all still enforced at the live code and test boundaries.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:79-85` -> stderr is compacted/truncated before returning from the subprocess layer.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:235-249` -> the Python subprocess argv is built with `--stdin`, and the prompt is supplied separately via `runSpawnAttempt(... prompt ...)` instead of argv.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:155-160` -> the child process writes the prompt to stdin and terminates stdin immediately, keeping prompt content out of process arguments.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2803-2806` -> the Python CLI exposes explicit `--stdin` / `--stdin-preferred` modes for single-prompt input.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2892-2895` -> single-prompt stdin mode reads from `sys.stdin.read()` and replaces `args.prompt` with stdin content.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66` -> `sanitizeSkillLabel()` canonical-folds labels, strips control characters, rejects multiline/instruction-shaped content, and returns null on unsafe labels.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:118-136` -> the rendered brief uses only sanitized skill labels and numeric scores.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508` -> advisor envelope metadata rejects unsanitized or multiline `skillLabel` values.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:549-575` -> shared payload provenance rejects prompt-derived `sha256:` paths and `user-prompt` source refs.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:160-168` -> the runtime hook exits fail-open when `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
- `.opencode/plugins/spec-kit-skill-advisor.js:19-20` -> the plugin declares the shared hook-disable env var and legacy plugin-disable alias.
- `.opencode/plugins/spec-kit-skill-advisor.js:50-52` -> plugin enablement is gated by either the shared hook-disable env var or the legacy plugin-specific env var.
- `.opencode/plugins/spec-kit-skill-advisor.js:83-90` -> normalized plugin options mark the plugin disabled when the shared env flag is set.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:65-81` -> the subprocess test asserts the prompt is absent from spawn argv and present only on stdin while `--stdin` is set.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-113` -> the privacy audit test asserts raw prompts do not appear in the rendered brief, shared payload, source refs, diagnostics JSONL, health output, or cache keys.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:85-139` -> the envelope contract tests reject prompt-derived provenance refs and instruction-shaped skill labels.
- `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-202` -> the Copilot runtime test verifies the shared disable flag prevents producer invocation.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-164` -> the OpenCode plugin test verifies the same shared disable flag disables bridge execution and reports the disable reason.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts:62-84` -> observability JSONL rejects prompt-bearing fields such as `prompt`, `stdout`, and `stderr`.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-98` -> renderer tests block instructional labels and assert the renderer source does not read prompt/stdout/stderr fields.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-001 remains closed.** The subprocess path keeps the prompt out of argv by passing `--stdin` and writing the prompt only to stdin, while the Python CLI explicitly consumes stdin in single-prompt mode (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:235-249`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:155-160`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2803-2806`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2892-2895`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:65-81`).
- **DR-P1-001 remains closed at the model-visible envelope boundary.** Skill labels are canonical-folded and rejected when instruction-shaped, and shared-payload provenance refuses prompt-derived source refs before transport (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:118-136`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:549-575`, `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:85-139`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-98`).
- **DR-P1-004 remains closed for the shared disable flag.** The Copilot hook and the OpenCode plugin both honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, and the plugin still reports the shared disable reason in status output (`.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:160-168`, `.opencode/plugins/spec-kit-skill-advisor.js:19-20`, `.opencode/plugins/spec-kit-skill-advisor.js:50-52`, `.opencode/plugins/spec-kit-skill-advisor.js:83-90`, `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-202`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-164`).

## Metrics
- newInfoRatio: 0.08
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 1
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Rotate to D2 and re-check the correctness surfaces around tokenCap propagation, cache-key inputs, and cache-hit provenance restamping.

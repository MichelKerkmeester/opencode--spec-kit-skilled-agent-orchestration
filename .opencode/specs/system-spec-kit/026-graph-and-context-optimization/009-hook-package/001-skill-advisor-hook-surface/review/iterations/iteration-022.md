# Iteration 022 — Dimension(s): D1

## Scope this iteration
This iteration followed the default D1 rotation and re-checked the post-025 privacy/security path where raw prompts cross the Python subprocess boundary and re-enter the shared payload / renderer boundary. The focus was whether the stdin-only transport, label sanitization, prompt-derived provenance rejection, and shared disable flag still hold consistently across runtimes after remediation.

## Evidence read
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801-2806,2892-2895` → the CLI exposes `--stdin` / `--stdin-preferred` and replaces `args.prompt` with `sys.stdin.read()` when stdin mode is active.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:155-156,235-239` → the Node caller writes the prompt to child stdin and invokes the Python script with `--stdin`, not argv prompt text.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:70-80` → the regression test asserts spawn argv does not contain the prompt, does contain `--stdin`, and that the prompt is written only through `child.stdin`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508,545-575` → advisor metadata rejects unsanitized `skillLabel` values and provenance rejects `user-prompt` / `sha256:` prompt-derived source refs.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66,93-99,118-120` → the renderer canonical-folds and sanitizes skill labels again at the model boundary and emits nothing when the label still looks instruction-shaped.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:85-139` → contract tests reject prompt-derived provenance refs, multi-line labels, and instruction-shaped labels.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112` → privacy tests assert raw prompts and sensitive tokens stay out of the rendered brief, shared payload, source refs, metrics, stderr JSONL, health output, and cache keys.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-129`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122-129` → every runtime hook path still short-circuits when `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
- `.opencode/plugins/spec-kit-skill-advisor.js:19-20,50-61,86-90` and `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-164` → the OpenCode plugin honors the same shared disable flag and reports the shared env name as the disable reason.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-001 remains closed for prompt stdin plumbing.** The Python CLI now accepts stdin-mode input and the Node subprocess runner passes `--stdin` while writing the prompt only to `child.stdin`, with regression coverage asserting the prompt never appears in spawn argv (`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801-2806,2892-2895`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:155-156,235-239`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:70-80`).
- **DR-P1-001 remains closed for strong label/provenance sanitization.** The shared payload layer rejects prompt-derived provenance refs and unsafe skill labels before envelope coercion, and the renderer re-sanitizes labels with canonical folding at the final model boundary (`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508,545-575`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66,93-99,118-120`, `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:85-139`).
- **DR-P1-004 remains closed for shared disable-flag honoring.** Claude, Gemini, Copilot, Codex, and the OpenCode plugin all still skip advisor execution when `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, and the plugin test locks that parity in place (`.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121-129`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135-142`, `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161-168`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218-225`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122-129`, `.opencode/plugins/spec-kit-skill-advisor.js:19-20,50-61,86-90`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-164`).

## Metrics
- newInfoRatio: 0.03
- cumulative_p0: 0
- cumulative_p1: 7
- cumulative_p2: 3
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Rotate to D2 and re-check post-025 correctness around envelope/restamping/token-cap parity on cache and renderer paths.

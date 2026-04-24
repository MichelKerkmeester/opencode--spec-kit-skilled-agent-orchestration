# Iteration 036 — Dimension(s): D1

## Scope this iteration
This iteration followed the default D1 rotation and performed a fresh privacy-boundary spot-check across the prompt transport, shared-envelope label sanitization, and runtime disable-flag surfaces. The goal was to verify the Phase 025 D1 remediations still hold end-to-end with code and test evidence instead of reusing prior review citations.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/review/deep-review-strategy.md:20-25,30-34,79-81` → D1 is the security/privacy dimension for stdin prompt plumbing, label sanitization, and the shared disable flag, with explicit post-remediation re-verification guidance.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/review/deep-review-state.jsonl:37` → cumulative state entering iteration 36 was P0=0, P1=8, P2=4.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/review/iterations/iteration-035.md:44-45` → prior iteration handed focus to a D1 re-check of prompt-handling and privacy surfaces.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:137-156,235-239` → the subprocess runner still spawns the Python advisor with `stdio: ['pipe', 'pipe', 'pipe']`, writes the prompt to `child.stdin`, and passes only `--stdin` plus threshold flags on argv.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:70-80` → the subprocess test still asserts argv does not contain the raw prompt, does contain `--stdin`, and writes the prompt through stdin instead.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801-2806,2846-2848` → the Python entry point still exposes `--stdin` / `--stdin-preferred` and rejects conflicting input-mode combinations.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66,93-99,118-129` → the renderer still canonical-folds skill labels, rejects newline/control/instruction-shaped labels, and only renders typed metadata fields at the prompt boundary.
- `.opencode/skill/system-spec-kit/shared/unicode-normalization.ts:4-9,61-72` → canonical folding still strips hidden characters, combining marks, and configured confusable lookalikes before label sanitization.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:312-318,491-509,511-540,549-579` → the shared advisor envelope still allows only the five typed metadata keys, sanitizes `skillLabel`, and rejects prompt-derived provenance refs including `sha256:` fingerprints and `user-prompt` source kinds.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:85-139` → tests still reject prompt-derived provenance refs plus multiline/instruction-shaped skill labels at the shared-payload boundary.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-83` → renderer tests still quarantine canonical-folded instructional labels and avoid echoing adversarial prompt content.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:77-112` → the privacy audit still verifies raw prompts stay out of rendered briefs, shared payloads, source refs, diagnostics, health output, and cache keys.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:160-169`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:120-126`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:134-140`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:217-224` → all four runtime hooks still short-circuit on `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and emit skipped diagnostics instead of invoking the producer.
- `.opencode/plugins/spec-kit-skill-advisor.js:19-20,50-52,86-100,332-337,339-357,383-409` → the OpenCode plugin still honors the shared disable env, records the disable reason, and suppresses bridge execution when disabled.
- `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-195`, `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:99-108`, `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:103-112`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:163-172`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-163` → hook/plugin tests still verify the shared disable flag prevents producer or bridge execution.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-001 remains closed for prompt transport hardening.** The subprocess runner still keeps the prompt off argv by passing `--stdin` and piping the prompt through stdin, the Python entry point still supports that mode, and the subprocess test still asserts the raw prompt never appears in spawned arguments (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:137-156,235-239`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:70-80`, `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801-2806`).
- **DR-P1-001 remains closed for shared-payload label sanitization and prompt privacy.** The renderer and shared envelope still canonical-fold and reject instruction-shaped or multiline labels, reject prompt-derived provenance refs, and the focused renderer/privacy/shared-payload tests still cover those cases (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66,93-99,118-129`, `.opencode/skill/system-spec-kit/shared/unicode-normalization.ts:61-72`, `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:312-318,491-579`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-83`, `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:85-139`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:77-112`).
- **DR-P1-004 remains closed for the shared disable flag.** All four runtime hooks plus the OpenCode plugin still honor `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`, emit skipped/disabled state, and avoid invoking the producer or bridge, with runtime-specific tests still covering that behavior (`.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:160-169`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:120-126`, `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:134-140`, `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:217-224`, `.opencode/plugins/spec-kit-skill-advisor.js:50-52,86-100,332-357`, `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-user-prompt-submit-hook.vitest.ts:186-195`, `.opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts:99-108`, `.opencode/skill/system-spec-kit/mcp_server/tests/gemini-user-prompt-submit-hook.vitest.ts:103-112`, `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts:163-172`, `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:153-163`).

## Metrics
- newInfoRatio: 0.01
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 4
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Rotate to D2 and re-check the post-025 envelope/renderer correctness path for any residual contract or provenance-restamping gaps beyond the already-closed remediation.

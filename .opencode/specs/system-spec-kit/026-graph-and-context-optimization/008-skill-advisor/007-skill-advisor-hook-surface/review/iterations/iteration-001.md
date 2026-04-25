# Iteration 001 — Dimension(s): D1

## Scope this iteration
This iteration reviewed the post-Phase-025 D1 security/privacy surfaces: stdin prompt transport, model-visible label sanitization, and the shared-payload advisor metadata boundary. The focus was to verify that DR-P1-001 was closed substantively rather than cosmetically and to look for residual prompt-leakage or instruction-injection gaps around the remediation.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:211-239` → `runAdvisorSubprocess()` now invokes `skill_advisor.py` with `--stdin`, and `runSpawnAttempt()` writes the prompt to child stdin instead of argv.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801-2806` → the CLI defines `--stdin` and `--stdin-preferred` for single-prompt input.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2892-2899` → single-prompt mode reads `sys.stdin.read()` and only falls back when appropriate, preventing prompt carriage in process arguments.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66` → `sanitizeSkillLabel()` canonical-folds labels, strips control chars, rejects newlines, and blocks instruction-shaped content.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:100-137` → `renderAdvisorBrief()` emits only typed recommendation fields and refuses to render when the sanitized label is invalid.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:201-206` → the advisor envelope contract explicitly limits metadata to numeric trust fields plus a sanitized single-line skill label.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508` → `assertAdvisorSkillLabel()` rejects empty/control-character labels and reuses `sanitizeSkillLabel()` before accepting the envelope metadata.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:71-139` → contract tests reject unknown metadata keys, prompt-derived source refs, multiline labels, and instruction-shaped labels.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:77-113` → privacy audit asserts raw prompts and secrets do not appear in rendered briefs, shared-payload envelopes, metrics, diagnostics, or cache keys.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-84` → renderer tests cover canonical-folded instruction-shaped labels, newline labels, and adversarial prompt content not being echoed.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P1-001 (D1) remains closed.** Prompt transport is now stdin-only at the subprocess boundary, the Python advisor consumes `--stdin`, and both the renderer and shared-payload envelope reject multiline/instruction-shaped skill labels before anything becomes model-visible or transport-visible (`subprocess.ts:211-239`, `skill_advisor.py:2801-2806`, `skill_advisor.py:2892-2899`, `render.ts:50-66`, `render.ts:100-137`, `shared-payload.ts:491-508`).

## Metrics
- newInfoRatio: 0.30
- cumulative_p0: 0
- cumulative_p1: 0
- cumulative_p2: 0
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Rotate to D2 and verify the token-cap, prompt-cache-key, and provenance-restamping fixes across the shared payload and renderer/cache paths.

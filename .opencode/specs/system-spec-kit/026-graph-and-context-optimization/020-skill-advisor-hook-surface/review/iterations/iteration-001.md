# Iteration 001 — Dimension(s): D1

## Scope this iteration
Reviewed D1 Security + Privacy because the default rotation for iteration 1 selects D1. I focused on raw-prompt handling, cache opacity, prompt-poisoning rendering boundaries, Unicode normalization, and the hook disable flag across runtime surfaces.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:47 → `createAdvisorPromptCacheKey` builds HMAC keys from the canonical prompt, source signature, runtime, and thresholds instead of storing prompt text as the cache key.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:84 → cache entries store the opaque key, source signature, result value, skill labels, and TTL metadata; the prompt itself is not a cache entry field.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93 → renderer comment states it renders from typed advisor output only and ignores reasons, descriptions, stdout/stderr, and prompt text.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50 → `sanitizeSkillLabel` canonical-folds labels, rejects newline labels, strips control characters, and blocks instruction-shaped labels.
- .opencode/skill/system-spec-kit/shared/unicode-normalization.ts:61 → `canonicalFold` applies NFKC, strips hidden characters and combining marks, then replaces selected confusables.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:136 → advisor subprocess is spawned with `stdio: ['ignore', 'pipe', 'pipe']`, so the prompt cannot be supplied through stdin in the current implementation.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231 → `commandArgs` includes `prompt` as a positional argv element passed to `python3`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78 → privacy test checks rendered brief, shared payload, source refs, metric labels, diagnostic JSONL, health, and cache key for raw prompt leakage.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53 → renderer tests block canonical-folded instruction-shaped skill labels.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:121 → Claude hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:135 → Gemini hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:161 → Copilot hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:218 → Codex hook honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:122 → Codex prompt-wrapper fallback also honors `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-001-01, dimension D1, raw user prompts are passed to the advisor subprocess via argv. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231 builds `commandArgs` with the canonical prompt as a positional argument, and .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:136 spawns the child with stdin ignored. Impact: prompts containing credentials or customer data can be exposed transiently through local process-argument inspection even though cache keys, diagnostics, and rendered payloads avoid persisting raw prompt text. Remediation: add a stdin or temp-fd input mode for `skill_advisor.py`, pass prompt text through stdin, keep argv limited to non-sensitive flags, and add a regression test that asserts spawn arguments do not include the raw prompt.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.72 (first D1 pass read mostly new evidence; one concrete privacy gap found)
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 0
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Advance D2 correctness with fresh evidence around the shared envelope contract, runtime parity, fail-open behavior, freshness semantics, and UNKNOWN fallback.

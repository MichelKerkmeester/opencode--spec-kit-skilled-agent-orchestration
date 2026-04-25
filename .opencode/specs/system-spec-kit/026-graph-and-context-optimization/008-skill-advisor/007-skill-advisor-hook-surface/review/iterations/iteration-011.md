# Iteration 011 — Dimension(s): D4

## Scope this iteration
This iteration followed the default rotation to D4 maintainability and sk-code-opencode alignment. The review re-checked the Phase 025 maintainability remediations around prompt-cache bounds, deprecated adapter-normalizer aliases, and whether the public advisor helpers now carry the typed/JSDoc surface expected by the repo's OpenCode standards.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-12` → prompt-cache now exposes explicit TTL/token constants plus `MAX_CACHE_ENTRIES = 1000`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:103-115` → `set()` sweeps expired rows and calls `evictOldestUntilBelowLimit()` before inserting a new key.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:150-170` → `size()` and `evictOldestUntilBelowLimit()` make the bounded insertion-ordered eviction path explicit.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:84-100` → regression coverage inserts `MAX_CACHE_ENTRIES + 1` rows and asserts the oldest entry is evicted while the cap holds.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-65` → `normalizeRuntimeOutput()` is the canonical runtime-normalization entry point.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:118-119` → `normalizeAdapterOutput` remains only as a deprecated compatibility alias.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:12-16` → parity tests import the canonical `normalizeRuntimeOutput` symbol directly.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219` → parity coverage still exercises visible brief output across Claude, Gemini, Copilot, Codex, wrapper, and plugin paths.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:121-128` → exported prompt-policy helpers now carry purpose-specific JSDoc.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-204` → exported observability helpers are documented with prompt-free contract comments.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:18-27` → generation-counter public state stays expressed as narrow union/interface types rather than loose records.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-185` → generation helper exports are documented and keep explicit recovery typing.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:319-325` → cache-reset and brief-builder exports have JSDoc describing their test/reset and renderer-consumer roles.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-83` → source-cache exports document their TTL/LRU behavior and reset semantics.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-100` → renderer JSDoc still documents the prompt-boundary guard and ignored free-form fields.
- `.opencode/skill/sk-code-opencode/SKILL.md:21-28` → repo standards expect naming, formatting, and structure guidance for OpenCode system code.
- `.opencode/skill/sk-code-opencode/SKILL.md:59` → those standards are explicitly evidence-based, so maintainability claims need file-backed verification.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P2-001 remains closed for prompt-cache bounds.** The cache now enforces a hard `MAX_CACHE_ENTRIES` ceiling and evicts the oldest inserted entry before overflow, with regression coverage proving the cap and eviction behavior hold under `MAX_CACHE_ENTRIES + 1` insertions (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-12`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:103-115`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:150-170`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:84-100`).
- **DR-P2-001 remains closed for the adapter normalizer compatibility path.** `normalizeRuntimeOutput()` is the canonical API, while `normalizeAdapterOutput` is now only a deprecated alias, and runtime parity coverage consumes the canonical symbol across the multi-runtime surface (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-65`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:118-119`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:12-16`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:203-219`).
- **DR-P2-001 remains closed for JSDoc and OpenCode maintainability alignment.** The public advisor helpers reviewed this round still expose typed contracts plus function-level documentation matching the repo's evidence-based OpenCode standards, and this pass did not surface new dead-export or typing regressions adjacent to the Phase 025 remediation (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:121-128`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-204`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:18-27`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-185`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:319-325`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-83`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-100`, `.opencode/skill/sk-code-opencode/SKILL.md:21-28`, `.opencode/skill/sk-code-opencode/SKILL.md:59`).

## Metrics
- newInfoRatio: 0.04
- cumulative_p0: 0
- cumulative_p1: 1
- cumulative_p2: 1
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Rotate to D5 and re-check the Phase 025 cross-runtime integration fixes around the OpenCode plugin, disable-flag parity, and five-runtime harness coverage.

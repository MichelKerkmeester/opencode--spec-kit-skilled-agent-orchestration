# Iteration 025 — Dimension(s): D4

## Scope this iteration
This iteration followed the default D4 rotation and re-checked the Phase 025 maintainability cleanup across the skill-advisor library, with emphasis on exported-surface JSDoc, prompt-cache bounds, and the compatibility alias in the adapter normalizer. The rationale was to verify DR-P2-001 on fresh source and regression-test evidence and to look for residual standards-alignment or dead-code gaps introduced by the remediation.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/review/deep-review-strategy.md:18-25,30-34` → R03 still defines D4 as maintainability + sk-code-opencode alignment and explicitly scopes the 025 fixes to JSDoc coverage, cache bounds, and the normalizer alias.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:11,61-76,90-125,163-170` → the prompt cache now exposes a fixed `MAX_CACHE_ENTRIES`, documents the HMAC-key helper and cache class, sweeps expired rows before insertion, and evicts the oldest entry before overflow on new inserts.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:64-99` → regression coverage locks normalized `maxTokens` into cache keys and asserts oldest-entry eviction once `MAX_CACHE_ENTRIES + 1` inserts are attempted.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:18-25,62-65,118-119` → the runtime-neutral normalizer remains the primary export, while `normalizeAdapterOutput` survives only as a documented `@deprecated` compatibility alias.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:12-16,153-196,203-243` → parity coverage still imports the canonical normalizer, routes every runtime through it, and exercises the real builder-to-renderer path, so the alias change did not strand the maintained path.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-100` → the renderer’s public entry point carries an explicit JSDoc contract describing its prompt-boundary guarantees.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:319-325` → the memoized-brief test hook and main brief builder both retain concise public JSDoc after the 025 cleanup.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:211-239` → the subprocess entry point remains documented and preserves the stdin-only invocation contract introduced by the remediation.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:121-128`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-83`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-283`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-185` → the remaining exported policy, source-cache, metrics, and generation surfaces still carry concise JSDoc on their maintained public APIs.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P2-001 remains closed for prompt-cache bounds and insertion eviction.** The cache still enforces `MAX_CACHE_ENTRIES`, only evicts on growth beyond the cap, and has focused regression coverage proving the oldest entry drops first while the newest survives (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:11,103-125,163-170`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-prompt-cache.vitest.ts:84-99`).
- **DR-P2-001 remains closed for the adapter-normalizer compatibility alias.** `normalizeRuntimeOutput` remains the maintained runtime-neutral export, `normalizeAdapterOutput` is explicitly marked deprecated instead of silently diverging, and parity coverage continues to exercise the canonical normalizer across all runtimes (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-65,118-119`, `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:12-16,153-196`).
- **DR-P2-001 remains closed for the public-surface JSDoc pass.** The reviewed exported entry points in renderer, brief builder, subprocess, prompt-policy, source-cache, metrics, and generation files still carry concise public JSDoc, with no fresh dead-code or strictness gaps evident in the reviewed maintainability surfaces (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:93-100`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:319-325`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:211-239`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-policy.ts:121-128`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-83`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-283`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-185`).

## Metrics
- newInfoRatio: 0.01
- cumulative_p0: 0
- cumulative_p1: 7
- cumulative_p2: 3
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Rotate to D5 and re-check the post-025 cross-runtime/plugin integration surfaces for any residual parity or disable-path gaps.

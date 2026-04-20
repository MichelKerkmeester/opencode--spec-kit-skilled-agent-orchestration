# Iteration 032 — Dimension(s): D4

## Scope this iteration
This iteration followed the default D4 rotation and re-checked the Phase 025 maintainability fixes across the skill-advisor TypeScript surfaces. The focus was to verify cache bounds, compatibility aliasing, TSDoc coverage, and ongoing sk-code-opencode alignment on fresh source evidence.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/deep-review-strategy.md:23,30-34,79-82` → D4 remains responsible for cache bounds, compatibility aliasing, TSDoc coverage, TS strictness, and residual-gap hunting after Phase 025.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/deep-review-state.jsonl:33` → cumulative state entering this iteration was P0=0, P1=8, P2=4.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/review/iterations/iteration-031.md:42-43` → prior iteration handed focus to a D4 maintainability re-check.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-12,61-74,103-125,163-170` → prompt cache still hard-caps entries at 1000, hashes the normalized key parts, and evicts oldest entries before overflow persists.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:319-325,370-397,444-451` → brief producer still clears test cache explicitly, invalidates entries on source-signature change, and re-populates the bounded cache only with typed ok-results.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:18-25,62-119` → runtime-neutral adapter normalization remains the canonical API, and the legacy alias is still marked with an inline `@deprecated` TSDoc tag.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-83` → exported cache helpers retain TSDoc summaries and bounded TTL/LRU behavior.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:21-27,151-185` → generation-counter exports retain TSDoc coverage and explicit typed return surfaces for read/increment/reset flows.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:211-215` → subprocess runner keeps a typed public API and TSDoc summary on the prompt-via-stdin boundary.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-204,232-304` → metrics helpers and collector exports retain TSDoc coverage plus explicit schema-validation boundaries.
- `.claude/skills/sk-code-opencode/references/typescript/style_guide.md:29-47,99-139,580-609` → OpenCode TypeScript standards still require module headers, section organization, and TSDoc comments for documented exports.
- `.claude/skills/sk-code-opencode/references/typescript/quality_standards.md:340-465` → TSDoc remains the expected documentation format, including `@deprecated` for compatibility aliases.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- **DR-P2-001 remains closed for prompt-cache bounds.** The cache still enforces `MAX_CACHE_ENTRIES = 1000`, sweeps expired rows before insert, and evicts oldest entries while `size >= MAX_CACHE_ENTRIES`; the producer also invalidates cache rows when the source signature changes before reusing cached results (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/prompt-cache.ts:8-12,103-125,163-170`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:370-397,444-451`).
- **DR-P2-001 remains closed for the compatibility alias.** `normalizeRuntimeOutput()` remains the canonical adapter normalizer and the legacy `normalizeAdapterOutput` export is still preserved only as a TSDoc-marked deprecated alias, which matches the documented TypeScript guidance for compatibility tags (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/normalize-adapter-output.ts:62-119`; `.claude/skills/sk-code-opencode/references/typescript/quality_standards.md:340-465`).
- **DR-P2-001 remains closed for maintainability/TSDoc alignment on the D4 surfaces.** The sampled public helper exports across source-cache, generation, subprocess, brief, and metrics files still keep module headers, section organization, explicit typed public APIs, and TSDoc summaries consistent with the OpenCode TypeScript standards (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/source-cache.ts:57-83`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/generation.ts:151-185`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:211-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:319-325`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:188-204,232-304`; `.claude/skills/sk-code-opencode/references/typescript/style_guide.md:29-47,99-139,580-609`).

## Metrics
- newInfoRatio: 0.01
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 4
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Rotate to D5 and re-check the post-025 cross-runtime/plugin parity surfaces, especially disable-flag honoring, SIGKILL escalation, and the five-runtime harness.

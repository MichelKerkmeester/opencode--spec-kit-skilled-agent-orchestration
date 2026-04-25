# Iteration 017 — Dimension(s): D1

## Scope this iteration
Checked the renderer’s Unicode and instruction-shaped label defenses, including combining-mark and confusable variants, to see whether the deeper D1 pass uncovers a second prompt-injection path besides the argv leak.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66` -> `sanitizeSkillLabel()` canonical-folds labels, strips control chars, collapses whitespace, and rejects instruction-shaped prefixes.
- `advisor-renderer.vitest.ts:53-67` -> renderer rejects canonical-folded instructional labels and newline-bearing labels instead of normalizing them into output.
- `security/adversarial-unicode.vitest.ts:22-38` and `:78-105` -> the adversarial corpus exercises fullwidth forms, zero-width chars, soft hyphens, Greek confusables, and combining-mark variants.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.05
- cumulative_p0: 0
- cumulative_p1: 5
- cumulative_p2: 2
- dimensions_advanced: [D1]
- stuck_counter: 1

## Next iteration focus
Resume D2 with the generation-recovery and freshness-cache paths that were not stress-read in the first nine iterations.

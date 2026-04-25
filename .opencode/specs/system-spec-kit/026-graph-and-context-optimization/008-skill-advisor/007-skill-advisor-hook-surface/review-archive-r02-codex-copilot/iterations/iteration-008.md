# Iteration 008 — Dimension(s): D1

## Scope this iteration
Reviewed D1 Security/Privacy because the default rotation for iteration 8 returns to D1. I focused on fresh evidence around prompt-poisoning boundaries between the producer, shared payload, renderer, diagnostics, and runtime hook outputs.

## Evidence read
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-001.md:27 -> prior D1 finding already covered raw prompts being passed through subprocess argv, so this iteration avoided counting that as new.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:150 -> the producer-local `renderBrief` starts with a freshness prefix only.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:151 -> the producer-local brief interpolates `top.skill` directly into model-shaped advisor text.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:189 -> shared payload sections are created from `args.brief`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:193 -> the shared payload section content is the producer-local brief.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:200 -> shared payload summary also uses `args.brief`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:205 -> shared payload metadata stores `top?.skill` as `skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:490 -> advisor metadata accepts any string label after null/type checks.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:500 -> advisor metadata rejects only ASCII control characters in `skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:883 -> advisor producer metadata is validated through `validateAdvisorEnvelopeMetadata`.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:900 -> shared payload creation validates provenance and metadata before mapping sections.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:902 -> section mapping trims empty content but does not apply the advisor skill-label sanitizer to section text.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50 -> the runtime renderer has a dedicated `sanitizeSkillLabel` helper.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:54 -> renderer sanitization canonical-folds the skill label before checks.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:62 -> renderer sanitization rejects empty or instruction-shaped labels.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:118 -> runtime rendering sanitizes the metadata or recommendation skill label before emitting text.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:119 -> runtime rendering returns null when the sanitized label is absent.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:253 -> Codex hook calls `buildSkillAdvisorBrief`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:259 -> Codex hook then renders through `renderAdvisorBrief` before output.
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:270 -> Codex hook emits no output if the safe renderer returns no brief.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:156 -> Claude hook calls `buildSkillAdvisorBrief`.
- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:162 -> Claude hook then renders through `renderAdvisorBrief` before output.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:201 -> diagnostic record creation accepts a `skillLabel` input.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:224 -> diagnostic record creation stores the provided `skillLabel` without applying `sanitizeSkillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53 -> renderer tests cover canonical-folded instruction-shaped labels.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:58 -> renderer tests cover newline labels.
- .opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:113 -> shared-payload tests cover multi-line labels only.
- .opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:123 -> shared-payload rejection expectation is limited to sanitized single-line enforcement.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:136 -> advisor subprocess still spawns with stdin ignored.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231 -> command arguments still include the script path and flags.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:234 -> command arguments still include the prompt as a positional argv value.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-008-01, dimension D1, the shared-payload producer can carry instruction-shaped advisor labels even though the final hook renderer suppresses them. Evidence: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:151 interpolates `top.skill` directly into the producer-local brief, .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:189 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:205 puts that brief and raw `top?.skill` into the shared payload, while .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:490 through .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:503 rejects only non-strings, empty labels, and control characters. The runtime renderer has the stronger guard at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:66 and returns null on unsafe labels at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:118 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:120, so current hook output is protected, but the shared payload and diagnostics are built before or beside that boundary; diagnostics also store the provided skill label without sanitizer at .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:201 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/metrics.ts:224. Impact: an instruction-shaped skill label from advisor output can persist in internal shared payload/diagnostic surfaces even when it is intentionally blocked from model-visible hook text, weakening the stated prompt-boundary invariant and creating a future-consumer hazard. Remediation: centralize advisor label sanitization before `buildSharedPayload` and diagnostic emission, make unsafe labels produce a null brief/status or null `skillLabel`, and extend shared-payload tests beyond newline labels to instruction-shaped and Unicode-folded labels.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- P1-001-01 remains valid: .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:136 still spawns with stdin ignored, and .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231 through .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:235 still pass the prompt through argv.

## Metrics
- newInfoRatio: 0.48 (fresh D1 pass moved from subprocess argv/privacy persistence into the producer/shared-payload/renderer boundary and found one new required issue)
- cumulative_p0: 0
- cumulative_p1: 6
- cumulative_p2: 6
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Advance D2 Correctness by checking the envelope contract, runtime fail-open parity, freshness states, and UNKNOWN fallback paths with fresh source and tests.

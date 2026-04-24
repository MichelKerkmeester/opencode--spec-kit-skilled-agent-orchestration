# Iteration 029 — Dimension(s): D1

## Scope this iteration
This iteration followed the default D1 rotation and re-checked the post-025 prompt/privacy boundary from Python CLI entry through subprocess execution and shared-payload publication. The goal was to confirm DR-P1-001 is genuinely closed while probing for any residual injection or leakage surfaces adjacent to the remediation.

## Evidence read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-strategy.md:20-21,30-34,79-81` -> D1 remains scoped to stdin plumbing, prompt-free argv, label sanitization, and residual-gap hunting on fresh evidence.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-state.jsonl:30` -> cumulative state entering this iteration was P0=0, P1=8, P2=3.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-028.md:39-40` -> prior iteration handed off the D1 follow-up explicitly to re-check prompt-handling/privacy surfaces.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:137-156,235-249` -> the Node wrapper spawns Python with `--stdin`, keeps the prompt out of `commandArgs`, and writes the canonical prompt only over `child.stdin`.
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801-2806,2892-2897` -> the Python CLI accepts `--stdin`/`--stdin-preferred` and populates `args.prompt` from `sys.stdin.read()` before analysis.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:70-80` -> the focused test asserts the raw prompt is absent from spawn argv, `--stdin` is present, and stdin receives the prompt bytes.
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508,545-575` -> advisor metadata.skillLabel is sanitized through `sanitizeSkillLabel`, but provenance source-ref paths are only checked for non-empty values and prompt-fingerprint/user-prompt rejection.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:123-126,137-152` -> skill slugs come directly from raw directory entry names and are stored in `skillFingerprints` without slug-shape normalization.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:170-176,197-215` -> `sourceRefsForFreshness()` interpolates each raw `skillLabel` into `.opencode/skill/${skillLabel}/SKILL.md` and ships those paths in the advisor shared payload provenance.
- `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:85-139` -> the shared-payload contract tests prompt-derived source-ref rejection and skill-label sanitization, but not control-character or instruction-shaped provenance paths.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-83` -> renderer tests confirm instruction-shaped and newline skill labels are blocked from model-visible briefs.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112` -> privacy audit coverage confirms raw prompts stay out of rendered briefs, envelopes, metrics, stderr JSONL, health output, and cache keys.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
**P2-029-01 (D1): Advisor provenance sourceRefs still inherit raw skill directory names without the single-line sanitizer applied to metadata.skillLabel.** `listSkillSlugs()` returns raw directory entry names from `.opencode/skill/` (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:123-126`), those names are stored as `skillFingerprints` keys and then interpolated into provenance paths by `sourceRefsForFreshness()` (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/freshness.ts:137-152`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:170-176,197-215`). The shared-payload validator hardens `metadata.skillLabel` with `sanitizeSkillLabel`, but `validateSharedPayloadSourceRef()` only rejects prompt-derived refs and empty paths; it does not reject control characters, newlines, or instruction-shaped provenance paths (`.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:491-508,545-575`). Impact: a maliciously named repo-authored skill directory can still place multi-line or instruction-shaped text into advisor envelope provenance even though the top-level label hardening landed in Phase 025. Remediation: validate source-ref paths against the same single-line/control-character policy as advisor skill labels, or build provenance refs from a validated slug regex rather than raw directory names.

### Re-verified (no new severity)
- **DR-P1-001 remains closed for stdin plumbing and prompt-free argv.** The subprocess wrapper passes `--stdin` in argv and sends the prompt only over stdin (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:137-156,235-249`), the Python CLI reads prompt bytes from `sys.stdin` when `--stdin` is set (`.opencode/skill/skill-advisor/scripts/skill_advisor.py:2801-2806,2892-2897`), and the focused subprocess test asserts the raw prompt never appears in spawn argv (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:70-80`).
- **DR-P1-001 remains closed for rendered/model-visible label sanitization.** The renderer rejects canonical-folded instruction-shaped and newline skill labels (`.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-66,93-138`), and both renderer and shared-payload tests exercise those rejection paths (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:60-83`, `.opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:113-139`).
- **DR-P1-001 remains closed for prompt-free envelope/diagnostic surfaces.** The privacy audit confirms raw prompts and embedded secrets stay out of the rendered brief, shared payload, provenance refs, metrics, stderr JSONL, health output, and cache keys (`.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112`).

## Metrics
- newInfoRatio: 0.03
- cumulative_p0: 0
- cumulative_p1: 8
- cumulative_p2: 4
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Rotate to D2 and re-check whether the post-025 correctness fixes around tokenCap, cache-key partitioning, and provenance restamping still hold on adjacent code paths.

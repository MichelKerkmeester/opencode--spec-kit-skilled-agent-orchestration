# Iteration 036 — Dimension(s): D1

## Scope this iteration
Reviewed the late-cycle D1 privacy boundary because iteration 36 rotates back to Security + Privacy and iteration 35 handed off to a fresh disable-flag/privacy re-check. This pass focused on new subprocess/privacy-test evidence to verify whether the shipped redaction guarantees now cover the highest-risk raw-prompt transport edge.

## Evidence read
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-strategy.md:11-12 → D1 remains scoped to raw-prompt handling, prompt-poisoning hardening, and disable-flag behavior.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/deep-review-state.jsonl:37 → iteration 35 ended at cumulative P0=0, P1=18, P2=17 with `stuck=1`.
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/review/iterations/iteration-035.md:37-38 → prior iteration handed off a D1 privacy/disable-flag re-check for this cycle.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231-245 → `runAdvisorSubprocess()` still builds `commandArgs` with the raw prompt as a positional argv value and spawns the child with that argv.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112 → the privacy audit asserts raw prompts stay out of the rendered brief, shared payload, source refs, metric labels, stderr JSONL, health output, and cache keys.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65 → `sanitizeSkillLabel()` canonical-folds labels, strips control characters, and rejects instruction-shaped content before any model-visible brief is emitted.
- .opencode/skill/system-spec-kit/shared/unicode-normalization.ts:61-72 → `canonicalFold()` removes hidden characters/combining marks and normalizes confusable characters, strengthening the renderer's poison-label check.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53-76 → renderer tests still reject canonical-folded instruction-shaped labels and confirm adversarial prompt text is not echoed into the visible brief.
- .opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:57-139 → the subprocess suite covers parsing, timeout, retry, and missing-script behavior, but it still has no regression asserting that sensitive prompt text is kept out of spawned argv.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
- P1-001-01 remains valid with fresh D1 evidence: the shipped post-subprocess privacy surfaces stay prompt-safe, but the subprocess transport boundary still exposes raw prompt text through argv. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112` verifies that rendered briefs, shared payloads, diagnostics, health output, and cache keys do not persist sensitive prompt text, while `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65`, `.opencode/skill/system-spec-kit/shared/unicode-normalization.ts:61-72`, and `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:53-76` confirm model-visible output still suppresses canonical-folded instruction-shaped labels and prompt echoes. But `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/subprocess.ts:231-245` still passes the canonical prompt as a positional argv element, and `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-subprocess.vitest.ts:57-139` still does not assert a prompt-safe stdin/file-descriptor transport. The privacy posture therefore remains unchanged: downstream artifacts are redacted, yet the subprocess handoff still carries transient argv exposure.

## Metrics
- newInfoRatio: 0.03
- cumulative_p0: 0
- cumulative_p1: 18
- cumulative_p2: 17
- dimensions_advanced: [D1]
- stuck_counter: 2

## Next iteration focus
Advance D2 with a late-cycle correctness check on freshness/fail-open parity after the D1 privacy boundary remains unchanged.

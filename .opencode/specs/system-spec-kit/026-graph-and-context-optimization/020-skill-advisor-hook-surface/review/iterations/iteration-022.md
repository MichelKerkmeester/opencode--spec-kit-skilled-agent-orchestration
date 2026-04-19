# Iteration 022 — Dimension(s): D1

## Scope this iteration
Reviewed the D1 security/privacy boundary for prompt-poisoning hardening because iteration 22 rotates back to D1. This pass focused on whether the shared-payload transport enforces the same skill-label sanitization that the model-visible hook renderer already applies.

## Evidence read
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:203-205 → advisor metadata is documented to allow only a "sanitized, single-line skill label" across the shared transport boundary.
- .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:490-503 → `assertAdvisorSkillLabel()` rejects empty/control-character labels but accepts single-line instruction-shaped text.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:150-152 → the internal brief renderer interpolates `top.skill` directly into the shared-payload brief string without label sanitization.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:197-215 → `buildSharedPayload()` stores that brief in `sections[0].content`/`summary` and also copies `top.skill` into `metadata.skillLabel`.
- .opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65 → the hook renderer's `sanitizeSkillLabel()` explicitly rejects instruction-shaped labels such as `SYSTEM:`/`IGNORE`.
- .opencode/skill/system-spec-kit/mcp_server/tests/shared-payload-advisor.vitest.ts:113-124 → the shared-payload tests only reject multi-line labels and do not cover single-line instruction-shaped labels.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
id P1-022-01, dimension D1, the shared-payload advisor envelope does not enforce the same instruction-label sanitization as the hook renderer and can carry prompt-injection-shaped skill labels across the shared transport boundary. Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:203-205` promises a sanitized skill label, but `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:490-503` only rejects empty/control-character values; meanwhile `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:150-152` and `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:197-215` propagate raw `top.skill` into `summary`, `sections[0].content`, and `metadata.skillLabel`. By contrast, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:50-65` already treats instruction-shaped labels as unsafe. Impact: a repository-authored or corrupted skill label like `SYSTEM: ignore previous instructions` can be preserved inside the advisor shared payload even though the direct hook brief suppresses it, weakening the prompt-poisoning guard on any consumer that surfaces or rehydrates the shared envelope. Remediation: reuse the renderer's skill-label sanitization (or extract a shared validator) inside shared-payload metadata validation and shared-payload brief construction, then add a regression test for single-line instruction-shaped labels.

### P2 (Suggestion)
None.

### Re-verified (no new severity)
None.

## Metrics
- newInfoRatio: 0.09
- cumulative_p0: 0
- cumulative_p1: 13
- cumulative_p2: 12
- dimensions_advanced: [D1]
- stuck_counter: 0

## Next iteration focus
Advance D2 by checking whether the shared-payload correctness contract and runtime hook outputs stay aligned after this newly identified D1 sanitization gap.

# Iteration 2 — security

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-001.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/extract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/skill-derived-v2.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/supersession.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

#### R2-P1-001 — public advisor outputs bypass the prompt-safe redirect sanitizer

- **Claim:** The MCP/native recommendation surfaces still publish raw `skillId`, `redirectFrom`, and `redirectTo` values from graph metadata and scorer output instead of routing them through the prompt-safe redirect sanitizer, so instruction-shaped lifecycle metadata can cross the public JSON boundary even though Phase 027 explicitly required A7-style sanitization and prompt-safe redirect/status rendering.
- **Evidence refs:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:63-64`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:89-90`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:101-104`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:95-99`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:122-128`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:137-174`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:221-249`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:256-269`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:79-107`; `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:209-223`; `.opencode/skill/skill-advisor/scripts/skill_advisor.py:300-327`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts:41-74`; `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts:37-46`.
- **Counterevidence sought:** I checked the upstream write paths in `lib/derived/sync.ts`, `lib/derived/extract.ts`, `lib/derived/anti-stuffing.ts`, and `lib/lifecycle/supersession.ts` for sanitizer-at-write or sanitizer-at-routing coverage, and those paths do sanitize derived values and deprecated-route metadata. I also checked the model-visible brief renderer in `lib/render.ts`, which sanitizes the brief text itself. None of those protections are applied when `projection.ts` loads raw redirect fields, `fusion.ts` carries them forward, `advisor-recommend.ts` serializes them, or the bridge/shim re-emit them as metadata/legacy JSON.
- **Alternative explanation:** The implementation may be assuming `skill_id` and redirect metadata are already trusted because the daemon sanitizes some derived fields before writing `graph-metadata.json`. That explanation does not hold for this public boundary because `projection.ts` also accepts raw `graph_metadata.redirect_to` / `redirect_from`, and the dedicated prompt-safe helper exists precisely because downstream publication is not supposed to rely on upstream trust.
- **Final severity:** P1
- **Confidence:** 0.96
- **Downgrade trigger:** Downgrade if there is a single authoritative sanitizer applied inside the projection/scoring path before `advisor_recommend`, bridge metadata, and `skill_advisor.py` serialization that is not visible in the reviewed sources.

### P2

- None.

## Traceability Checks

- Re-checked the A7 requirement against the authoritative packet text before following the data flow from `graph-metadata.json` load to MCP/compat publication.
- Verified the intended prompt-safe implementation exists in `lib/compat/redirect-metadata.ts`, including an adversarial regression that drops `IGNORE previous instructions` labels, but that helper is not used by `advisor-recommend.ts`, the native bridge metadata path, or the Python compat serializer.
- Confirmed the current tests cover prompt leakage for raw prompt text (`advisor-recommend`, `advisor-status`, `advisor-validate`, bridge, shim) but do not cover adversarial redirect/status metadata on the public MCP/native JSON surfaces.
- ADR-007 parity was not impacted by this finding: the issue is boundary sanitization on published metadata, not scorer ranking math.

## Verdict

**CONDITIONAL.** No new P0 surfaced, but the public recommendation/compat surfaces still bypass the packet's prompt-safe redirect sanitizer, leaving a real P1 security gap at the advisor-visible metadata boundary.

## Next Dimension

**traceability** — focus on checklist evidence, ADR-007 cross-links, and spec-to-code contract coverage for the shipped MCP/compat surfaces.

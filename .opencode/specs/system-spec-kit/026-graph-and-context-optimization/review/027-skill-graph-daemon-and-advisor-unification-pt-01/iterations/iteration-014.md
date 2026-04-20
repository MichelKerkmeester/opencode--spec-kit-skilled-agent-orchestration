# Iteration 14 — security

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-013.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
5. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/checklist.md`
6. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
7. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
8. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts`
9. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-policy.ts`
11. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
12. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
13. `.opencode/plugins/spec-kit-skill-advisor.js`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- None new this iteration. Re-reading the security surfaces did not uncover a new release-blocking issue beyond the previously logged security findings already carried in this review packet from earlier security passes (iterations 2, 6, and 10).

### P2

- None new this iteration.

## Traceability Checks

- Phase 027/002 still requires A7 sanitization at every advisor-visible write boundary, and the implementation still matches that contract: `sanitizeDerivedValue()` rejects non-string, overlong, and instruction-shaped values before reuse at `sqlite`, `graph-metadata`, `envelope`, and `diagnostic` boundaries, while `sanitizeDiagnostic()` and `sanitizeEnvelopeSkillLabel()` force the same sanitizer path for publication surfaces. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:63-65`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:89-90`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/checklist.md:54-55`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts:12-83`]
- The anti-stuffing guard remains wired to reject instruction-shaped derived metadata outright and to zero out overly repetitive payloads before they can influence scoring, which preserves the security expectation that adversarial derived phrases cannot silently flow into routing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts:48-97`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:157-167`]
- The MCP/public publication path did not introduce a new prompt leak in this pass. `advisor_recommend` still returns recommendation data only, conditionally includes lane evidence only behind `includeAttribution`, and never echoes the caller prompt; the Python compat shim still forces `includeAttribution: false` on its bridge call, which means the legacy/public brief path remains narrower than the raw MCP surface. That leaves the previously logged attribution-privacy concern unchanged rather than widened. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:54-65`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:77-105`], [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:131-133`], [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:332-336`]
- The compat/plugin path still applies prompt-safe publication controls on the brief/status surface: the bridge sanitizes labels before rendering the brief, normalizes errors to prompt-safe codes, and the plugin cache keys hash the prompt together with session/source/workspace rather than storing plaintext prompts as the cache key. No additional unsafe publication boundary surfaced here. [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:99-140`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:195-223`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:125-137`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:175-210`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:303-326`]

## Verdict

**PASS** for this iteration. No new P0/P1 security findings surfaced in iteration 14, so the packet’s security posture is unchanged: the A7 sanitizer and anti-stuffing controls remain present, and the only open security concerns are the previously logged issues from earlier iterations rather than any new regression uncovered here.

## Next Dimension

**traceability** — re-check spec/checklist evidence links, ADR-007 parity references, and phase/child cross-references against the shipped code and review packet.
